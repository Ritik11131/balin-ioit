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
  formFields = CREATE_USER_FORM_FIELDS;

  users$: Observable<any[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  usersLoaded$: Observable<boolean> = this.store.select(selectUsersLoaded);

  editData!: any
  selectedRowItems: any[] = [];

  private actionHandlers: Record<string, (row: any) => void> = {
    'Update': (row) => this.editHandler(row),
    'Delete': (row) => console.log('Deleting', row),
    'View Sub Users': (row) => console.log('Sub Users', row),
    'View Linked Devices': (row) => console.log('Linked Devices', row),
    'Login As Child': (row) => console.log('Login as Child', row)
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

  onUserFormSubmit(event: any): void {
    // TODO: handle user form submission logic here
    console.log('User form submitted:', event);
  }

  onFormValueChange($event: any) {
    console.log($event);

  }
  onFormCancel() {
    this.formFields = CREATE_USER_FORM_FIELDS;
    this.uiService.closeDrawer();
  }

  editHandler(row: any) {
    this.formFields = UPDATE_USER_FORM_FIELDS;
    this.editData = row;
    this.uiService.openDrawer(this.createUpdateUser,' ','',true)

  }


}
