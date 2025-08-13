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
import { CREATE_USER_FORM_FIELDS } from '../../shared/constants/forms';

@Component({
  selector: 'app-users',
  imports: [GenericTableComponent, CommonModule, GenericFormGeneratorComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  @ViewChild('createUpdateUser') createUpdateUser: any;
  private store = inject(Store);
  private uiService = inject(UiService)
  private destroy$ = new Subject<void>();
  
  toolbarItems = USER_TABLE_TOOLBAR;
  tableConfig = USER_TABLE_CONFIG;
  createUserFormFields = CREATE_USER_FORM_FIELDS;
  selectedRowItems: any[] = [];
  users$: Observable<any[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  usersLoaded$: Observable<boolean> = this.store.select(selectUsersLoaded);
editData = {
    "id": 2,
    "fkParentId": 1,
    "fkCustomerId": 0,
    "loginId": "balinadmin",
    "password": "Balin@123",
    "userName": "Balin Admin",
    "userType": 1,
    "userCategory": null,
    "kycstatus": null,
    "mobileNo": "9811441215",
    email: "support@galvanic-infotech.com",
    "passChangeTime": null,
    "timezone": "05:30",
    "isActive": 1,
    "address": "noida",
    "attributes": null,
    "creationTime": 1711299532,
    "lastUpdateOn": 1750399326,
    "tblSimInventories": [],
    "simnos": []
};

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
          console.log(event);
          this.uiService.openDrawer(this.createUpdateUser)
          
        }
  }

  onUserFormSubmit(event: any): void {
    // TODO: handle user form submission logic here
    console.log('User form submitted:', event);
  }

  onFormValueChange($event: any) {
    console.log($event);

  }
  onFormCancel() {
  }


}
