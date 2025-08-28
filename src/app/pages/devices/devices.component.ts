import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DEVICE_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { DEVICE_TABLE_CONFIG } from '../../shared/constants/table-config';
import { selectVehicleLoading, selectVehicles, selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';
import { CommonModule } from '@angular/common';
import { loadVehicles } from '../../store/vehicle/vehicle.actions';
import { selectAllDevices, selectDevicesLoaded, selectDevicesLoading } from '../../store/devices/devices.selectors';
import { loadDevices } from '../../store/devices/devices.actions';
import { UiService } from '../../layout/service/ui.service';
import { UserService } from '../service/user.service';
import { DeviceService } from '../service/device.service';
import { CREATE_DEVICE_FORM_FIELDS, UPDATE_DEVICE_FORM_FIELDS } from '../../shared/constants/forms';
import { GenericFormGeneratorComponent } from "../../shared/components/generic-form-generator/generic-form-generator.component";
import { selectDeviceTypes } from '../../store/device-type/selectors';
import { selectVehicleTypes } from '../../store/vehicle-type/selectors';
import moment from 'moment';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { DEVICE_DETAILS_TABS } from '../../shared/constants/device';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { selectUsers } from '../../store/users/users.selectors';
import { FormEnricherService } from '../service/form-enricher.service';


@Component({
    selector: 'app-devices',
    imports: [GenericTableComponent, CommonModule, GenericFormGeneratorComponent, DividerModule,TabsModule,AvatarModule,ChipModule],
    templateUrl: './devices.component.html',
    styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnDestroy, OnInit {
    @ViewChild('createUpdateDevice') createUpdateDevice: any;
    @ViewChild('viewMoreDetails') viewMoreDetails: any;
    private store = inject(Store);
    private uiService = inject(UiService);
    private userService = inject(UserService);
    private deviceService = inject(DeviceService);
    private formConfigEnricher = inject(FormEnricherService)
    private destroy$ = new Subject<void>();

    devices$: Observable<any[]> = this.store.select(selectAllDevices);
    isLoading$: Observable<boolean> = this.store.select(selectDevicesLoading);
    devicesLoaded$: Observable<boolean> = this.store.select(selectDevicesLoaded);

    formFields = CREATE_DEVICE_FORM_FIELDS;
    toolbarItems = DEVICE_TABLE_TOOLBAR;
    tableConfig = DEVICE_TABLE_CONFIG;
    tabsConfig: any = DEVICE_DETAILS_TABS;

    selectedRowItems: any[] = [];
    editData!: any
    device!:any;
    activeTab = 'details';
    // Maps for generic handling
    loadingMap: Record<string, boolean> = {
        details: false,
        linkedUsers: true,
        config: false
    };

    dataMap: Record<string, any[]> = {
        linkedUsers: []
    };



    ngOnInit(): void {
        // Default load vehicles tab
        this.devicesLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
            if (!loaded) this.store.dispatch(loadDevices());
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async handleToolBarActions(event: any): Promise<void> {
        if (event.key === 'create') {
            // this.formFields = CREATE_DEVICE_FORM_FIELDS;
            this.formConfigEnricher.enrichForms([CREATE_DEVICE_FORM_FIELDS]).subscribe(res => {
                this.formFields = res[0];
            });
            this.uiService.openDrawer(this.createUpdateDevice, this.formFields.formTitle, '!w-[35vw] md:!w-[35vw] lg:!w-[35vw]', true)
        }
    }

    private actionHandlers: Record<string, (row: any) => void> = {
        'Update': (row) => this.editHandler(row),
        'More': (row) => this.viewMoreDetailsHandler(row),
    };

    
    async viewMoreDetailsHandler(row: any): Promise<void> {
        console.log(row);
        this.device = row;
        this.formConfigEnricher.enrichForms(DEVICE_DETAILS_TABS).subscribe(res => {
            this.tabsConfig = res;
        });
        this.uiService.openDrawer(this.viewMoreDetails, ' ', '!w-[80vw] md:!w-[80vw] lg:!w-[80vw]', true);
        await Promise.all([
            this.loadLinkedUsers(row.id)
        ]);
    }

  private async loadLinkedUsers(deviceId: number) {
    try {
      const res = await this.userService.getUserListByDeviceId(deviceId);
      this.dataMap['linkedUsers'] = res?.data || [];
    } catch {
      this.dataMap['linkedUsers'] = [];
    } finally {
      this.loadingMap['linkedUsers'] = false;
    }
  }

    handleInTableActions(event: any) {
        const { label, row } = event;
        this.actionHandlers[label]?.(row);
    }

    async editHandler(row: any): Promise<void> {
        // this.formFields = UPDATE_DEVICE_FORM_FIELDS;
        this.formConfigEnricher.enrichForms([UPDATE_DEVICE_FORM_FIELDS]).subscribe(res => {
            this.formFields = res[0];
        });
        this.uiService.openDrawer(this.createUpdateDevice, this.formFields.formTitle, '!w-[35vw] md:!w-[35vw] lg:!w-[35vw]', true)
        await Promise.all([
            this.loadDeviceObject(row?.id)
        ])
    }

    private async loadDeviceObject(userId: number) {
        try {
            const res = await this.deviceService.getDeviceDetailsById(userId);
            this.editData = res?.data?.[0]
                ? {
                    ...res.data[0],
                    installationOn: new Date(res.data[0].installationOn)
                }
                : null;

        } catch (error) {
            this.editData = null;
        }
    }

    async onDeviceFormSubmit(event: any): Promise<void> {
        console.log('User form submitted:', event);
        const { isEditMode, formValue } = event;
        if (isEditMode) {
            const mergedObj = { ...this.editData, ...formValue, attribute: JSON.stringify(formValue.attribute),
                installationOn: moment(formValue?.installationOn)?.format("YYYY-MM-DD")  }
            console.log(mergedObj);
            await this.updateDevice(mergedObj?.id, mergedObj);
        } else {
            console.log('create');
            const mergedObj = {
                ...formValue,
                attributes: JSON.stringify({}),
                installationOn: moment(formValue?.installationOn)?.format("YYYY-MM-DD")
            };
            await this.createDevice(mergedObj);
        }
    }

    async onConfigurationFormSubmit(event: any): Promise<void> {
        console.log(event);
        
    }


    private async updateDevice(id: any, data: any): Promise<void> {
        const res = await this.deviceService.updateDevice(id, data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', res?.data);
        this.store.dispatch(loadDevices());
    }

    private async createDevice(data: any): Promise<void> {
        const res = await this.deviceService.createDevice(data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', res?.data);
        this.store.dispatch(loadDevices());
    }

    onFormValueChange($event: any) {
        console.log($event);

    }
    onFormCancel() {
        this.formFields = CREATE_DEVICE_FORM_FIELDS;
        this.uiService.closeDrawer();
    }
}
