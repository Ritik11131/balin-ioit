import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../shared/constants/list-view';
import { VehicleFilterComponent } from "./vehicle-filter/vehicle-filter.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { 
  selectFilteredVehicles, 
  selectVehicleLoading, 
  selectVehiclePolling, 
  selectVehiclesLoaded,
  selectCurrentFilter,
  selectSearchTerm 
} from '../../../../../store/vehicle/vehicle.selectors';
import { 
  filterVehicles, 
  loadVehicles, 
  searchVehicles, 
  startVehiclePolling 
} from '../../../../../store/vehicle/vehicle.actions';

@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
    <div class="p-2">
      <app-vehicle-filter 
        [isLoading]="isLoading$ | async" 
        (filterSelected)="onFilterSelected($event)" 
        (searchTerm)="onVehicleSearch($event)" 
        (refreshVehicles)="onVehicleRefresh($event)" />
    </div>
    <app-vehicle-list 
      [isLoading]="isLoading$ | async" 
      [fetchedVehicles]="filteredVehicles$ | async" />
    `
})
export class VehiclesComponent {
  filters = listViewFilters;
  
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  // Observable streams from store
  filteredVehicles$: Observable<any[]> = this.store.select(selectFilteredVehicles);
  isLoading$: Observable<boolean> = this.store.select(selectVehicleLoading);
  polling$: Observable<boolean> = this.store.select(selectVehiclePolling);
  currentFilter$: Observable<any> = this.store.select(selectCurrentFilter);
  searchTerm$: Observable<string> = this.store.select(selectSearchTerm);

  constructor() {}

  ngOnInit(): void {
    // Load vehicles only if not already loaded
    this.store.select(selectVehiclesLoaded).pipe(take(1)).subscribe((loaded) => {
      console.log('Vehicles loaded:', loaded);
      if (!loaded) {
        this.store.dispatch(loadVehicles());
      }
    });

    // Optional: Subscribe to store changes for debugging
    this.subscribeToStoreChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToStoreChanges(): void {
    // Optional: For debugging purposes
    this.filteredVehicles$.pipe(takeUntil(this.destroy$)).subscribe((vehicles) => {
      console.log('Filtered vehicles updated:', vehicles?.length || 0);
    });

    this.isLoading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
      console.log('Loading state:', loading);
    });

    this.currentFilter$.pipe(takeUntil(this.destroy$)).subscribe((filter) => {
      console.log('Current filter:', filter);
    });
  }

  onFilterSelected(filter: any): void {
    console.log('Filter selected:', filter);
    this.store.dispatch(filterVehicles({ key: filter.key, status: filter.status }));
  }

  onVehicleSearch(event: any): void {
    const searchTerm = event?.value || '';
    console.log('Search term:', searchTerm);
    this.store.dispatch(searchVehicles({ searchTerm }));
  }

  onVehicleRefresh(event: any): void {
    console.log('Refreshing vehicles...');
    this.store.dispatch(loadVehicles());
  }
}