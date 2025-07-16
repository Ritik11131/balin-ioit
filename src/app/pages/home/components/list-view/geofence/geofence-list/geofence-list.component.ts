import { Component } from '@angular/core';
import { GeofenceCardComponent } from "./geofence-card/geofence-card.component";

@Component({
  selector: 'app-geofence-list',
  imports: [GeofenceCardComponent],
  template: `
   <div class="max-h-[calc(100vh-180px)] overflow-y-scroll scrollbar-hide mt-4">
  <div class="flex flex-col gap-4 p-2">
    @for (geofence of geofences; track geofence; let i = $index) {
      <app-geofence-card [geofence]="geofence"  [isSelected]="selectedGeofence === geofence" (cardSelected)="onGeofenceSelected($event)" />
    }
  </div>
</div>
  `,
  styles: ``
})
export class GeofenceListComponent {

  selectedGeofence: any = null;
  geofences = [
    {
      id: 1,
      name: 'Geofence Area 1',
      description: 'Restricted area around the main office',
      radius: '500m',
      status: 'active',
      linkedDevices: 4
    },
    {
      id: 2,
      name: 'Geofence Area 2',
      description: 'Construction site perimeter',
      radius: '300m',
      status: 'inactive',
      linkedDevices: 4
    },
    {
      id: 3,
      name: 'Geofence Area 3',
      description: 'Delivery zone for logistics',
      radius: '200m',
      status: 'active',
      linkedDevices: 4
    },
  ];

  onGeofenceSelected(geofence: any) {
    this.selectedGeofence = geofence;
  }

}
