import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { GeofenceListComponent } from "./geofence-list/geofence-list.component";
import { GeofenceFilterComponent } from "./geofence-filter/geofence-filter.component";
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectGeofenceLoading, selectGeofences, selectSelectedGeofence } from '../../../../../store/geofence/geofence.selectors';
import { CommonModule } from '@angular/common';
import { selectGeofence } from '../../../../../store/geofence/geofence.actions';
import { UiService } from '../../../../../layout/service/ui.service';
import { GeofenceCrudComponent } from "../../../../../shared/components/generic-geofence-crud/generic-geofence-crud.component";

@Component({
  selector: 'app-geofence',
  imports: [GeofenceListComponent, GeofenceFilterComponent, CommonModule, GeofenceCrudComponent],
  template: `
   <div class="p-2">
    <app-geofence-filter (createGeofenceClick)="handleGeofenceActionClick($event)" />
   </div>
    <app-geofence-list [isLoading]="isLoading$ | async" [geofences]="geofences$ | async" (editGeofenceClick)="handleGeofenceActionClick($event)" />

        <ng-template #createUpdateGeofence>
          <app-geofence-crud  [editGeofence]="selectedGeofence$ | async"  />
        </ng-template>
  `,
  styles: ``
})
export class GeofenceComponent implements OnDestroy {
  @ViewChild('createUpdateGeofence') createUpdateGeofence: any;
  

  private store = inject(Store);
  private uiService = inject(UiService);
  private destroy$ = new Subject<void>();

  selectedGeofence$ = this.store.select(selectSelectedGeofence);
  geofences$: Observable<any[]> = this.store.select(selectGeofences);
  isLoading$: Observable<boolean> = this.store.select(selectGeofenceLoading);

  handleGeofenceActionClick(event: any) {
    if(event.actionType === 'create') {
      this.store.dispatch(selectGeofence({ geofence: null }));
    }
    this.uiService.openDrawer(this.createUpdateGeofence,' ','!w-[100vw] md:!w-[100vw] lg:!w-[100vw]',true)
  }


  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.store.dispatch(selectGeofence({ geofence: null }));
  }

}
