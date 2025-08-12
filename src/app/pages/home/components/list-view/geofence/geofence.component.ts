import { Component, inject, OnDestroy } from '@angular/core';
import { GeofenceListComponent } from "./geofence-list/geofence-list.component";
import { GeofenceFilterComponent } from "./geofence-filter/geofence-filter.component";
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectGeofenceLoading, selectGeofences } from '../../../../../store/geofence/geofence.selectors';
import { CommonModule } from '@angular/common';
import { selectGeofence } from '../../../../../store/geofence/geofence.actions';

@Component({
  selector: 'app-geofence',
  imports: [GeofenceListComponent, GeofenceFilterComponent, CommonModule],
  template: `
   <div class="p-2">
    <app-geofence-filter />
   </div>
    <app-geofence-list [isLoading]="isLoading$ | async" [geofences]="geofences$ | async" />
  `,
  styles: ``
})
export class GeofenceComponent implements OnDestroy {


  private store = inject(Store);
  private destroy$ = new Subject<void>();

  geofences$: Observable<any[]> = this.store.select(selectGeofences);
  isLoading$: Observable<boolean> = this.store.select(selectGeofenceLoading);


  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.store.dispatch(selectGeofence({ geofence: null }));
    }

}
