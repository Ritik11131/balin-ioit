import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../shared/constants/list-view';
import { VehicleFilterComponent } from "./vehicle-filter/vehicle-filter.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { VehicleService } from '../../../../service/vehicle.service';
import { sortVehiclesByStatus } from '../../../../../shared/utils/helper_functions';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { selectVehicles, selectVehicleLoading, selectVehiclePolling, selectVehiclesLoaded  } from '../../../../../store/vehicle/vehicle.selectors';
import { loadVehicles, startVehiclePolling } from '../../../../../store/vehicle/vehicle.actions';

@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
    <div class="p-2">
      <app-vehicle-filter [isLoading]="isLoading" (filterSelected)="onFilterSelected($event)" (searchTerm)="onVehicleSearch($event)" (refreshVehicles)="onVehicleRefresh($event)" />
    </div>
    <app-vehicle-list [isLoading]="isLoading" [fetchedVehicles]="filteredVehicles" />
    `
})
export class VehiclesComponent {
filters = listViewFilters;
fetchedVehicles: any[] = [];
filteredVehicles: any[] = [];

public isLoading = false;

private store = inject(Store);
private destroy$ = new Subject<void>();

vehicles$: Observable<any[]> = this.store.select(selectVehicles);
loading$: Observable<boolean> = this.store.select(selectVehicleLoading);
polling$: Observable<boolean> = this.store.select(selectVehiclePolling);

constructor() {}

ngOnInit(): void {
  this.store.select(selectVehiclesLoaded).pipe(take(1)).subscribe((loaded) => {
    console.log(loaded,'dedd');
    
    if (!loaded) {
      this.store.dispatch(loadVehicles());
    }
  });
  this.subscribeToStoreData();
}

ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

private subscribeToStoreData(): void {
  this.vehicles$.pipe(takeUntil(this.destroy$)).subscribe((vehicles) => {
    if (vehicles && vehicles.length > 0) {
      this.fetchedVehicles = this.constructVehicleData(vehicles);
      this.filteredVehicles = sortVehiclesByStatus(this.fetchedVehicles);
      // console.log('Vehicles after transformation:', this.filteredVehicles);
    }
  });

  this.loading$.pipe(takeUntil(this.destroy$)).subscribe((loading) => {
    console.log('Loading state:', loading);
    this.isLoading = loading;
  });
}


  constructVehicleData(vehicles: any[]): any[] {
    return vehicles.map(({ device, parking, position, validity }, index) => ({
      id: device?.id,
      name: device?.vehicleNo ,
      lastUpdated: position?.deviceTime,
      location: position?.address || 'Unknown Location',
      status: position?.status?.status.toLowerCase(),
      apiObject: {device,parking,position,validity}
    }));
  }

  onFilterSelected(filter: any) {
    this.isLoading = true;
    console.time('filterExecutionTime');
    const { key, status } = filter;
    this.filteredVehicles =  key === 'all' ? sortVehiclesByStatus(this.fetchedVehicles) : this.fetchedVehicles.filter(vehicle => vehicle.status === status);
    console.timeEnd('filterExecutionTime');
    console.log(this.filteredVehicles);
    this.isLoading = false;
  }

  onVehicleSearch(event: any): void {
  const searchTerm = (event?.value || '').toLowerCase().trim();
  if (!searchTerm) {
    // If the search term is empty, reset the list to all vehicles
    this.filteredVehicles = sortVehiclesByStatus(this.fetchedVehicles);
    return;
  }

  this.filteredVehicles = sortVehiclesByStatus(this.fetchedVehicles.filter(vehicle =>
    (vehicle?.name || '').toLowerCase().includes(searchTerm))
  );  
}

  onVehicleRefresh(event: any): void {
    this.store.dispatch(loadVehicles());
    console.log('Vehicles refreshed');
  }




}
