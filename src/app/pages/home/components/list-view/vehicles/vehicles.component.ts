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
  selectSearchTerm, 
  selectSelectedVehicle
} from '../../../../../store/vehicle/vehicle.selectors';
import { 
  filterVehicles, 
  loadVehicles, 
  searchVehicles, 
  selectVehicle,
  stopSingleVehiclePolling,
} from '../../../../../store/vehicle/vehicle.actions';
import { UiService } from '../../../../../layout/service/ui.service';
import { TrackMapService } from '../../../../service/track-map.service';
import { VehicleService } from '../../../../service/vehicle.service';

@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
    <div class="p-2">
      <app-vehicle-filter 
        [isLoading]="isLoading$ | async" 
        [activeFilterKey]="vehicleService.activeFilterKey"
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
  private uiService = inject(UiService);
  public vehicleService = inject(VehicleService)
  private trackMapService = inject(TrackMapService);
  private destroy$ = new Subject<void>();

  // Observable streams from store
  filteredVehicles$: Observable<any[]> = this.store.select(selectFilteredVehicles);
  isLoading$: Observable<boolean> = this.store.select(selectVehicleLoading);
  polling$: Observable<boolean> = this.store.select(selectVehiclePolling);
  currentFilter$: Observable<any> = this.store.select(selectCurrentFilter);
  searchTerm$: Observable<string> = this.store.select(selectSearchTerm);
  selectedVehicle$ = this.store.select(selectSelectedVehicle);

  constructor() {}

  ngOnInit(): void {
    // Optional: Subscribe to store changes for debugging
    this.subscribeToStoreChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(stopSingleVehiclePolling());
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

    this.selectedVehicle$.pipe(takeUntil(this.destroy$)).subscribe((vehicle) => {
      console.log('Selected vehicle:', vehicle);
    });
  }

  onFilterSelected(filter: any): void {
    console.log('Filter selected:', filter);
    this.vehicleService.activeFilterKey = filter.key;
    this.uiService.closeDrawer();
    this.trackMapService.exitFromLiveTracking();
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(filterVehicles({ key: filter.key, status: filter.status }));
    this.store.dispatch(selectVehicle({ vehicle: null }));
  }

  onVehicleSearch(event: any): void {
    const searchTerm = event?.value || '';
    console.log('Search term:', searchTerm);
    this.store.dispatch(searchVehicles({ searchTerm }));
    this.store.dispatch(selectVehicle({ vehicle: null }));
  }

  onVehicleRefresh(event: any): void {
    console.log('Refreshing vehicles...');
    this.uiService.closeDrawer();
    this.trackMapService.exitFromLiveTracking();
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(loadVehicles());
  }
}