import { Component } from '@angular/core';
import { GeofenceListComponent } from "./geofence-list/geofence-list.component";
import { GeofenceFilterComponent } from "./geofence-filter/geofence-filter.component";

@Component({
  selector: 'app-geofence',
  imports: [GeofenceListComponent, GeofenceFilterComponent],
  template: `
   <div class="p-2">
    <app-geofence-filter />
   </div>
    <app-geofence-list />
  `,
  styles: ``
})
export class GeofenceComponent {

}
