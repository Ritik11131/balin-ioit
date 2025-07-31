import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../shared/constants/list-view';
import { VehicleFilterComponent } from "./vehicle-filter/vehicle-filter.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { VehicleService } from '../../../../service/vehicle.service';
import { sortVehiclesByStatus } from '../../../../../shared/utils/helper_functions';

@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
    <div class="p-2">
      <app-vehicle-filter (filterSelected)="onFilterSelected($event)" (searchTerm)="onVehicleSearch($event)" />
    </div>
    <app-vehicle-list [isLoading]="isLoading" [fetchedVehicles]="filteredVehicles" />
    `
})
export class VehiclesComponent {
  filters = listViewFilters;
  fetchedVehicles:any[] = [];
  filteredVehicles:any[] = []
  public isLoading = false;

  constructor(private vehicleService: VehicleService) {}


  ngOnInit(): void {
        this.init();
    }

    private async init(): Promise<void> {
      this.isLoading = true;
        const results = await Promise.allSettled([this.fetchVehicles()]);
        console.log(results);
        

        results.forEach((result, index) => {
          console.log(result);
          
            if (result.status === 'fulfilled') {
              this.fetchedVehicles = this.constructVehicleData(result.value);
              this.filteredVehicles = sortVehiclesByStatus(this.fetchedVehicles)
              console.log(`Call ${index + 1} succeeded:`, this.filteredVehicles);
            } else {
                console.error(`Call ${index + 1} failed:`, result.reason);
                // Optionally show error toast/snackbar
            }
        });

      this.isLoading = false;
    }

    private async fetchVehicles(): Promise<any> {
        const vehicles = await this.vehicleService.fetchVehicleList();
        return vehicles;
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




}
