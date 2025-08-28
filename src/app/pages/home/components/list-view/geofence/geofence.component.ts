import { Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { GeofenceListComponent } from "./geofence-list/geofence-list.component";
import { GeofenceFilterComponent } from "./geofence-filter/geofence-filter.component";
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectGeofenceLoading, selectGeofences } from '../../../../../store/geofence/geofence.selectors';
import { CommonModule } from '@angular/common';
import { selectGeofence } from '../../../../../store/geofence/geofence.actions';
import { UiService } from '../../../../../layout/service/ui.service';
import { GeofenceCrudComponent } from "../../../../../shared/components/generic-geofence-crud/generic-geofence-crud.component";

@Component({
  selector: 'app-geofence',
  imports: [GeofenceListComponent, GeofenceFilterComponent, CommonModule, GeofenceCrudComponent],
  template: `
   <div class="p-2">
    <app-geofence-filter (createGeofenceClick)="handleCreateGeofenceClick($event)" />
   </div>
    <app-geofence-list [isLoading]="isLoading$ | async" [geofences]="geofences$ | async" />

        <ng-template #createUpdateGeofence>
          <app-geofence-crud />
        </ng-template>
  `,
  styles: ``
})
export class GeofenceComponent implements OnDestroy {
  @ViewChild('createUpdateGeofence') createUpdateGeofence: any;
  

  private store = inject(Store);
  private uiService = inject(UiService);
  private destroy$ = new Subject<void>();

  geofences$: Observable<any[]> = this.store.select(selectGeofences);
  isLoading$: Observable<boolean> = this.store.select(selectGeofenceLoading);

  handleCreateGeofenceClick(event: any) {
    const {actionType} = event;
    this.uiService.openDrawer(this.createUpdateGeofence,' ','!w-[80vw] md:!w-[80vw] lg:!w-[80vw]',true)
  }


  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
      this.store.dispatch(selectGeofence({ geofence: null }));
    }

}
