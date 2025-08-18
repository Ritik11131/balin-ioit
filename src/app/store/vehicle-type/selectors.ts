// vehicle-type.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehicleTypeState } from './state';

export const selectVehicleTypeState =
  createFeatureSelector<VehicleTypeState>('vehicleType');

export const selectVehicleTypes = createSelector(
  selectVehicleTypeState,
  (state) => state.vehicleTypes
);

export const selectVehicleTypesLoading = createSelector(
  selectVehicleTypeState,
  (state) => state.loading
);

export const selectVehicleTypesLoaded = createSelector(
  selectVehicleTypeState,
  (state) => state.loaded
);
