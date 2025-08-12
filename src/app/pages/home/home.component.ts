import { Component, inject, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TrackMapComponent } from './components/track-map/track-map.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { Store } from '@ngrx/store';
import { loadVehicles, stopSingleVehiclePolling } from '../../store/vehicle/vehicle.actions';
import { loadGeofences } from '../../store/geofence/geofence.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';
import { selectGeofenceLoaded } from '../../store/geofence/geofence.selectors';

@Component({
  selector: 'app-home',
  imports: [TabsModule, TrackMapComponent, ListViewComponent],
  template: `
    <div class="w-full h-[calc(100vh-60px)]">
      <div class="flex flex-col lg:flex-row h-full">
        <div class="w-full lg:w-[340px] lg:flex-shrink-0 h-full">
          <app-list-view (tabChange)="onListTabChange($event)" />
        </div>
        <div class="flex-1 min-w-0 h-full">
          <app-track-map [activeTab]="activeTab" />
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  vehiclesLoaded$: Observable<boolean> = this.store.select(selectVehiclesLoaded);
  geofenceLoaded$: Observable<boolean> = this.store.select(selectGeofenceLoaded);
  activeTab: 'vehicles' | 'geofences' = 'vehicles';

  ngOnInit(): void {
    // Default load vehicles tab
    this.vehiclesLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
      if (!loaded) this.store.dispatch(loadVehicles());
    });
  }

  onListTabChange(index: number) {
    this.store.dispatch(stopSingleVehiclePolling());
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
