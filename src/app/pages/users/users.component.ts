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
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PlatformConfig, UserConfiguration, UserConfigurationAttributes } from '../../store/user-configuration/state';
import { UserConfigurationService } from '../service/user-configuration.service';

@Component({
  selector: 'app-users',
  imports: [GenericTableComponent, CommonModule, GenericFormGeneratorComponent, ButtonModule, SkeletonModule,DividerModule, AvatarModule, TabsModule, BadgeModule, TableModule, ChipModule, CheckboxModule, FormsModule],
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
  private userConfigurationService = inject(UserConfigurationService);
  private confirmationService = inject(ConfirmationService);
  private destroy$ = new Subject<void>();
  
  toolbarItems = USER_TABLE_TOOLBAR;
  tableConfig = USER_TABLE_CONFIG;
  formFields = CREATE_USER_FORM_FIELDS;
  tabsConfig: any = [];

  users$: Observable<any[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  usersLoaded$: Observable<boolean> = this.store.select(selectUsersLoaded);

  editData!: any
  selectedRowItems: any[] = [];
  user!:any;
  userConfiguration!: UserConfiguration | null | any;
  childUserConfigurationObject!: any;
  activeTab = 'details';

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
          this.uiService.openDrawer(this.createUpdateUser,this.formFields.formTitle,'',true)
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
    this.uiService.openDrawer(this.createUpdateUser,this.formFields.formTitle,'',true)
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
  if (!row?.id) {
    console.warn('Invalid user row:', row);
    return;
  }

  try {
    this.uiService.toggleLoader(true);
    this.user = row;

    // Fetch user configuration safely
    const response = await this.userService.fetchUserConfigurationById(row.id);
    
    if (!response?.result || !response?.data) {
      console.warn('No configuration found for user:', row.id);
      this.userConfiguration = {} as PlatformConfig;
      this.childUserConfigurationObject = null;
    } else {
      // Safely parse attributes
      let parsedAttributes: UserConfigurationAttributes = { webConfig: {} as PlatformConfig, androidConfig: {} as PlatformConfig };
      try {
        parsedAttributes = response.data.attributes
        ? (typeof response.data.attributes === 'string'
          ? JSON.parse(response.data.attributes)
          : response.data.attributes)
          : parsedAttributes;
        } catch (parseError) {
          console.error('Failed to parse user configuration attributes:', parseError);
        }
        
        this.childUserConfigurationObject = response.data;
        this.userConfiguration = parsedAttributes.webConfig ?? ({} as PlatformConfig);
        
        console.log('Fetched user configuration:', parsedAttributes);
      }
      
      // Load related data in parallel with proper error handling
      await Promise.allSettled([
        this.loadSubUsers(row.id).catch(err => console.error('Failed to load sub-users:', err)),
        this.loadLinkedDevices(row.id).catch(err => console.error('Failed to load linked devices:', err))
      ]);
    } catch (error) {
      console.error('Error in viewMoreDetailsHandler:', error);
      this.userConfiguration = {} as PlatformConfig;
      this.childUserConfigurationObject = null;
    } finally {
      this.uiService.toggleLoader(false);
    }

     this.tabsConfig = USER_DETAILS_TABS.map((tab: any) => {
      if (tab.type !== 'config') return tab;

      return {
        ...tab,
        configSections: tab.configSections
          .map((section: any) => ({
            ...section,
            fields: section.fields.filter(
              (f: any) => !f.permissions || f.permissions.includes(this.authService.userRole)
            )
          }))
          .filter((section: any) => section.fields.length > 0) // remove empty sections
      };
    });
    
    // Open drawer early to show UI immediately
    this.uiService.openDrawer(this.viewMoreDetails,' ','!w-[80vw] md:!w-[80vw] lg:!w-[80vw]',true);
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

async handleChildLoginFromDetails(): Promise<void> {
  this.uiService.closeDrawer();
  await this.handleChildLogins(this.user);
}

 onFieldChange(fieldKey: string, value: boolean, sectionKey: string) {
    this.userConfigurationService.updateField(fieldKey, value, sectionKey as any, 'web', this.childUserConfigurationObject, this.user);
  }




}
