import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehicleState } from './vehicle.reducer';

export const selectVehicleState = createFeatureSelector<VehicleState>('vehicle');

export const selectVehicles = createSelector(
  selectVehicleState,
  (state) => state.vehicles
);

export const selectVehicleLoading = createSelector(
  selectVehicleState,
  (state) => state.loading
);

export const selectVehiclesLoaded = createSelector(
  selectVehicleState,
  (state) => state.loaded
);

export const selectVehicleError = createSelector(
  selectVehicleState,
  (state) => state.error
);

export const selectVehiclePolling = createSelector(
  selectVehicleState,
  (state) => state.polling
);

