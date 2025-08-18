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
import { CREATE_DEVICE_FORM_FIELDS } from '../../shared/constants/forms';
import { GenericFormGeneratorComponent } from "../../shared/components/generic-form-generator/generic-form-generator.component";

@Component({
    selector: 'app-devices',
    imports: [GenericTableComponent, CommonModule, GenericFormGeneratorComponent],
    templateUrl: './devices.component.html',
    styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnDestroy, OnInit {
    @ViewChild('createUpdateDevice') createUpdateDevice: any;
    @ViewChild('viewMoreDetails') viewMoreDetails: any;
    private store = inject(Store);
    private uiService = inject(UiService);
    private userService = inject(UserService);
    private deviceService = inject(DeviceService)
    private destroy$ = new Subject<void>();

    devices$: Observable<any[]> = this.store.select(selectAllDevices);
    isLoading$: Observable<boolean> = this.store.select(selectDevicesLoading);
    devicesLoaded$: Observable<boolean> = this.store.select(selectDevicesLoaded);

    formFields = CREATE_DEVICE_FORM_FIELDS;
    toolbarItems = DEVICE_TABLE_TOOLBAR;
    tableConfig = DEVICE_TABLE_CONFIG;

    selectedRowItems: any[] = [];
    editData!: any


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
            this.formFields = CREATE_DEVICE_FORM_FIELDS;
            this.uiService.openDrawer(this.createUpdateDevice, ' ', '!w-[35vw] md:!w-[35vw] lg:!w-[35vw]', true)
        }
    }

    private actionHandlers: Record<string, (row: any) => void> = {
        'Update': (row) => this.editHandler(row),
    };

    handleInTableActions(event: any) {
        const { label, row } = event;
        this.actionHandlers[label]?.(row);
    }

    async editHandler(row: any): Promise<void> {
        // this.formFields = UPDATE_USER_FORM_FIELDS;
        // this.uiService.openDrawer(this.createUpdateUser,' ','',true)
        // await Promise.all([
        //   this.loadUserObject(row?.id)
        // ])
    }

    async onUserFormSubmit(event: any): Promise<void> {
        console.log('User form submitted:', event);
        const { isEditMode, formValue } = event;
        if (isEditMode) {
            const mergedObj = { ...this.editData, ...formValue }
            console.log(mergedObj);
            await this.updateDevice(mergedObj?.id, mergedObj);
        } else {
            console.log('create');
            const mergedObj = { ...formValue }
            await this.createDevice(mergedObj);
        }
    }


    private async updateDevice(id:any, data:any): Promise<void> {
        const res = await this.deviceService.updateDevice(id, data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success','Success', res?.data);
        this.store.dispatch(loadDevices());
      }
    
      private async createDevice(data: any): Promise<void> {
        const res = await this.deviceService.createDevice(data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success','Success', res?.data);
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
