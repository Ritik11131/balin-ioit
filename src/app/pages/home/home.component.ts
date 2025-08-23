import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TrackMapComponent } from './components/track-map/track-map.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { Store } from '@ngrx/store';
import { loadVehicles, selectVehicle, stopSingleVehiclePolling } from '../../store/vehicle/vehicle.actions';
import { loadGeofences } from '../../store/geofence/geofence.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectSelectedVehicle, selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';
import { selectGeofenceLoaded } from '../../store/geofence/geofence.selectors';
import { UiService } from '../../layout/service/ui.service';
import { PathReplayService } from '../service/path-replay.service';
import { GenericPathReplayComponent } from "../../shared/components/generic-path-replay/generic-path-replay.component";

@Component({
  selector: 'app-home',
  imports: [CommonModule,TabsModule, TrackMapComponent, ListViewComponent, GenericPathReplayComponent],
  template: `
    <div class="w-full h-[calc(100vh-60px)]">
      <div class="flex flex-col lg:flex-row h-full">
        <div class="w-full lg:w-[340px] lg:flex-shrink-0 h-full">
          @if((pathReplayService.replayActive$ | async)?.value) {
            <app-generic-path-replay [vehicle]="(selectedVehicle$ | async)" [formFields]="pathReplayService.formFields$ | async" />
          } @else {
            <app-list-view (tabChange)="onListTabChange($event)" />
          }
        </div>
        <div class="flex-1 min-w-0 h-full">
          <app-track-map [activeTab]="activeTab" />
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private uiService = inject(UiService);
  public pathReplayService = inject(PathReplayService);
  
  private destroy$ = new Subject<void>();

  vehiclesLoaded$: Observable<boolean> = this.store.select(selectVehiclesLoaded);
  geofenceLoaded$: Observable<boolean> = this.store.select(selectGeofenceLoaded);
  selectedVehicle$ = this.store.select(selectSelectedVehicle);
  
  activeTab: 'vehicles' | 'geofences' = 'vehicles';

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.uiService.closeDrawer();
  }

  onListTabChange(index: number) {
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.uiService.closeDrawer();
    this.activeTab = index === 0 ? 'vehicles' : 'geofences';
    
    if (index === 0) {
      // Vehicles tab
      this.vehiclesLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
        if (!loaded) this.store.dispatch(loadVehicles());
      });
    } else if (index === 1) {
      // Geofence tab
      this.geofenceLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
        if (!loaded) this.store.dispatch(loadGeofences());
      });
    }
  }
}
