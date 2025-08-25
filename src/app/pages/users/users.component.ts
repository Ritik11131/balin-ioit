import { ConfirmationService } from 'primeng/api';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { USER_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { USER_TABLE_CONFIG } from '../../shared/constants/table-config';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUsers, selectUsersLoaded, selectUsersLoading } from '../../store/users/users.selectors';
import { loadUsers } from '../../store/users/users.actions';
import { CommonModule } from '@angular/common';
import { UiService } from '../../layout/service/ui.service';
import { GenericFormGeneratorComponent } from '../../shared/components/generic-form-generator/generic-form-generator.component';
import { CREATE_USER_FORM_FIELDS, UPDATE_USER_FORM_FIELDS } from '../../shared/constants/forms';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { USER_DETAILS_TABS } from '../../shared/constants/user';
import { UserService } from '../service/user.service';
import { DeviceService } from '../service/device.service';
import { AuthService } from '../service/auth.service';
import { StoreService } from '../service/store.service';

@Component({
  selector: 'app-users',
  imports: [GenericTableComponent, CommonModule, GenericFormGeneratorComponent, ButtonModule, SkeletonModule,DividerModule, AvatarModule, TabsModule, BadgeModule, TableModule, ChipModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('createUpdateUser') createUpdateUser: any;
  @ViewChild('viewMoreDetails') viewMoreDetails: any;
  private store = inject(Store);
  private authService = inject(AuthService);
  private uiService = inject(UiService);
  private userService = inject(UserService);
  private deviceService = inject(DeviceService);
  private storeService = inject(StoreService);
  private confirmationService = inject(ConfirmationService)
  private destroy$ = new Subject<void>();
  
  toolbarItems = USER_TABLE_TOOLBAR;
  tableConfig = USER_TABLE_CONFIG;
  formFields = CREATE_USER_FORM_FIELDS;

  users$: Observable<any[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  usersLoaded$: Observable<boolean> = this.store.select(selectUsersLoaded);

  editData!: any
  selectedRowItems: any[] = [];
  user!:any;
  activeTab = 'details';
  tabsConfig: any = USER_DETAILS_TABS;

// Maps for generic handling
loadingMap: Record<string, boolean> = {
  details: false,
  subUsers: true,
  linkedDevices: true,
  config: false
};

dataMap: Record<string, any[]> = {
  subUsers: [],
  linkedDevices: []
};

  private actionHandlers: Record<string, (row: any) => void> = {
    'Update': (row) => this.editHandler(row),
    'Delete': (row) => this.deleteHandler(row),
    'More': (row) => this.viewMoreDetailsHandler(row),
    'Login As Child': (row) => this.handleChildLogins(row)
  };

  handleInTableActions(event: any) {
    const { label, row } = event;
    this.actionHandlers[label]?.(row);
  }


  ngOnInit(): void {
       this.usersLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
      if (!loaded) {
        this.store.dispatch(loadUsers());
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  async handleToolBarActions(event: any): Promise<void> {
        if (event.key === 'create') {
          this.formFields = CREATE_USER_FORM_FIELDS;
          this.uiService.openDrawer(this.createUpdateUser,' ','',true)
        }
  }

  async onUserFormSubmit(event: any): Promise<void> {
    console.log('User form submitted:', event);
    const {isEditMode, formValue} = event;
    if(isEditMode) {
      const mergedObj = {...this.editData, ...formValue}
      console.log(mergedObj);
      await this.updateUser(mergedObj?.id, mergedObj);
    } else {
      console.log('create');
      const mergedObj = {...formValue}
      await this.createUser(mergedObj);
    }
  }

  onFormValueChange($event: any) {
    console.log($event);

  }
  onFormCancel() {
    this.formFields = CREATE_USER_FORM_FIELDS;
    this.uiService.closeDrawer();
  }

  async editHandler(row: any): Promise<void> {
    this.formFields = UPDATE_USER_FORM_FIELDS;
    this.uiService.openDrawer(this.createUpdateUser,' ','',true)
    await Promise.all([
      this.loadUserObject(row?.id)
    ])
  }

  async deleteHandler(row: any): Promise<void> {
     this.confirmationService.confirm({
            target: row,
            message: `Are you sure that you want to delete ${row?.userName}?`,
            header: 'Confirmation',
            closable: true,
            closeOnEscape: true,
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Save',
                severity:'danger'
            },
            accept: async () => {
              await this.deleteUser(row);
                // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                // this.messageService.add({
                //     severity: 'error',
                //     summary: 'Rejected',
                //     detail: 'You have rejected',
                //     life: 3000,
                // });
            },
        });
  }

  async viewMoreDetailsHandler(row: any): Promise<void> {
    console.log(row);
    this.user = row;
    this.uiService.openDrawer(this.viewMoreDetails, ' ', '!w-[80vw] md:!w-[80vw] lg:!w-[80vw]', true);
    await Promise.all([
      this.loadSubUsers(row.id),
      this.loadLinkedDevices(row.id)
    ]);
  }

  private async updateUser(id:any, data:any): Promise<void> {
    const res = await this.userService.updateUser(id, data);
    this.uiService.closeDrawer();
    this.uiService.showToast('success','Success', res?.data);
    this.store.dispatch(loadUsers());
  }

  private async createUser(data: any): Promise<void> {
    const res = await this.userService.createUser(data);
    this.uiService.closeDrawer();
    this.uiService.showToast('success','Success', res?.data);
    this.store.dispatch(loadUsers());
  }

  private async deleteUser(data: any): Promise<void> {
    const res = await this.userService.deleteUser(data);
    this.uiService.showToast('success','Success', res?.data);
    this.store.dispatch(loadUsers());
  }

  private async loadUserObject(userId: number) {
    try {
      const res = await this.userService.getUserDetailsById(userId);
      this.editData = res?.data || null;
    } catch (error) {
      this.editData = null;
    }
  }

  private async loadSubUsers(userId: number) {
    try {
      const res = await this.userService.fetchSubUsers(userId);
      this.dataMap['subUsers'] = res?.data || [];
    } catch {
      this.dataMap['subUsers'] = [];
    } finally {
      this.loadingMap['subUsers'] = false;
    }
  }

  private async loadLinkedDevices(userId: number) {
    try {
      const res = await this.deviceService.fetchUserLinkedDevices(userId);
      this.dataMap['linkedDevices'] = res?.data || [];
    } catch {
      this.dataMap['linkedDevices'] = [];
    } finally {
      this.loadingMap['linkedDevices'] = false;
    }
  }

async handleChildLogins(row: any): Promise<void> {
  try {
    const res = await this.userService.getUserDetailsById(row?.id);
    const { loginId, password, id, userName } = res?.data;

    if (!loginId || !password) {
      console.error('Child credentials not found');
      return;
    }

    await this.authService.loginChild(loginId, password, id, userName);
    this.storeService.startAutoRefresh();
    console.log(`Switched to child: ${userName}`);
  } catch (error) {
    console.error('Error logging in as child:', error);
  }
}




}
