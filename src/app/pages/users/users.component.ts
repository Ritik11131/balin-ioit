import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { USER_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { USER_TABLE_CONFIG } from '../../shared/constants/table-config';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUsers, selectUsersLoaded, selectUsersLoading } from '../../store/users/users.selectors';
import { loadUsers } from '../../store/users/users.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [GenericTableComponent, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  
  toolbarItems = USER_TABLE_TOOLBAR;
  tableConfig = USER_TABLE_CONFIG;
  selectedRowItems: any[] = [];
  users$: Observable<any[]> = this.store.select(selectUsers);
  isLoading$: Observable<boolean> = this.store.select(selectUsersLoading);
  usersLoaded$: Observable<boolean> = this.store.select(selectUsersLoaded);

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
          
        }
  }
}
