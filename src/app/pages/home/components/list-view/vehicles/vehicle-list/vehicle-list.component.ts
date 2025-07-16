import { Component } from '@angular/core';
import { VehicleCardComponent } from "./vehicle-card/vehicle-card.component";

@Component({
  selector: 'app-vehicle-list',
  imports: [VehicleCardComponent],
  template: `
   <!-- Cards Wrapper Container -->
<div class="max-h-[calc(100vh-180px)] overflow-y-scroll scrollbar-hide mt-4">
  <div class="flex flex-col gap-4 p-2">
    @for (vehicle of vehicles; track vehicle; let i = $index) {
      <app-vehicle-card [vehicle]="vehicle"  [isSelected]="selectedVehicle === vehicle" (cardSelected)="onVehicleSelected($event)" />
    }
  </div>
</div>



  `,
  styles: ``
})
export class VehicleListComponent {
  selectedVehicle: any = null;
  vehicles = [
  {
    id: 1,
    name: 'Vehicle XYZ-1234',
    lastUpdated: '2 min ago',
    location: '221B Baker Street, London',
    status: 'running'
  },
  {
    id: 2,
    name: 'Vehicle ABC-5678',
    lastUpdated: '5 min ago',
    location: 'Times Square, NY',
    status: 'idle'
  },
  {
    id: 3,
    name: 'Vehicle LMN-9101',
    lastUpdated: '10 min ago',
    location: 'Marina Bay, Singapore',
    status: 'offline'
  },
  
];


  onVehicleSelected(vehicle: any) {
    this.selectedVehicle = vehicle;
  }

}
