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


@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
    <div class="p-2">
      <app-vehicle-filter />
    </div>
    <app-vehicle-list [isLoading]="isLoading" [fetchedVehicles]="fetchedVehicles" />
    `
})
export class VehiclesComponent {
  filters = listViewFilters;
  fetchedVehicles:any[] = [];
  public isLoading = false;

  constructor(private vehicleService: VehicleService) {}


  ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        this.init();
    }

    private async init(): Promise<void> {
      this.isLoading = true;
        const results = await Promise.allSettled([this.fetchVehicles()]);
        console.log(results);
        

        results.forEach((result, index) => {
          console.log(result);
          
            if (result.status === 'fulfilled') {
              this.fetchedVehicles = this.constructVehicleData(result.value).slice(0,100);
              console.log(`Call ${index + 1} succeeded:`, this.fetchedVehicles);
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



}
