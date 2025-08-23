import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { loadUsers } from '../../store/users/users.actions';
import { loadDevices } from '../../store/devices/devices.actions';
import { loadVehicleTypes } from '../../store/vehicle-type/actions';
import { loadDeviceTypes } from '../../store/device-type/actions';
import { loadVehicles } from '../../store/vehicle/vehicle.actions';
import { loadGeofences } from '../../store/geofence/geofence.actions';
import { loadUserConfiguration } from '../../store/user-configuration/actions';

@Injectable({ providedIn: 'root' })
export class StoreService implements OnDestroy {
  private refreshSub?: Subscription;

  constructor(private store: Store) {}

  /**
   * Start auto-refresh every N minutes (from environment config)
   */
  startAutoRefresh() {
    this.refreshStore();

    this.refreshSub = interval(environment.storeRefreshInterval).subscribe(() => {
      // this.refreshStore();
    });
  }

  /**
   * Stop auto-refresh
   */
  stopAutoRefresh() {
    this.refreshSub?.unsubscribe();
    this.refreshSub = undefined;
  }

  /**
   * Manual refresh
   */
  refreshStore() {
    this.store.dispatch(loadUsers());
    this.store.dispatch(loadDevices());
    this.store.dispatch(loadVehicleTypes());
    this.store.dispatch(loadDeviceTypes());
    this.store.dispatch(loadVehicles());
    this.store.dispatch(loadGeofences());
    this.store.dispatch(loadUserConfiguration());
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }
}
