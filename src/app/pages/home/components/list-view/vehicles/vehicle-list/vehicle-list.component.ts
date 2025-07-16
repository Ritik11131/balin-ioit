import { Component, Input } from '@angular/core';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehicleSkeletonCardComponent } from "./vehicle-skeleton-card/vehicle-skeleton-card.component";

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleCardComponent, VehicleSkeletonCardComponent],
  template: `
        <!-- Cards Wrapper Container -->
        <div class="max-h-[calc(100vh-180px)] overflow-y-scroll scrollbar-hide mt-4">
            <div class="flex flex-col gap-4 p-2">
              @if(isLoading) {
                  <!-- Show Skeleton Cards when loading -->
                  @for (i of [1,2,3,4,5,6,7,8,9,10]; track i; let j = $index) {
                    <app-vehicle-skeleton-card />
                  }
              } @else {
                @for (vehicle of fetchedVehicles; track vehicle?.id; let i = $index) {
                  <app-vehicle-card [vehicle]="vehicle" [isSelected]="selectedVehicle === vehicle" (cardSelected)="onVehicleSelected($event)" />
                }
              }
            </div>
        </div>
    `,
  styles: ``
})
export class VehicleListComponent {
  @Input() fetchedVehicles: any[] = [];
  @Input() isLoading: boolean = false;

  selectedVehicle: any = null;

  onVehicleSelected(vehicle: any) {
    this.selectedVehicle = vehicle;
    console.log(vehicle);
    
  }

  ngOnDestroy(): void {
    // Cleanup logic if needed
    this.selectedVehicle = null; // Clear the selected geofence reference
    console.log('VehicleListComponent destroyed and cleaned up');
  }
}
