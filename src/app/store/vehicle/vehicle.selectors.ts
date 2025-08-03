// vehicle.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VehicleState } from './vehicle.state';

export const selectVehicleState = createFeatureSelector<VehicleState>('vehicle');

export const selectVehicles = createSelector(
  selectVehicleState,
  (state) => state.vehicles
);

export const selectFilteredVehicles = createSelector(
  selectVehicleState,
  (state) => state.filteredVehicles
);

export const selectVehicleLoading = createSelector(
  selectVehicleState,
  (state) => state.loading
);

export const selectVehiclesLoaded = createSelector(
  selectVehicleState,
  (state) => state.loaded
);

export const selectVehiclePolling = createSelector(
  selectVehicleState,
  (state) => state.polling
);

export const selectVehicleError = createSelector(
  selectVehicleState,
  (state) => state.error
);

export const selectCurrentFilter = createSelector(
  selectVehicleState,
  (state) => state.currentFilter
);

export const selectSearchTerm = createSelector(
  selectVehicleState,
  (state) => state.searchTerm
);

// Computed selectors
export const selectVehicleCount = createSelector(
  selectVehicles,
  (vehicles) => vehicles.length
);

export const selectFilteredVehicleCount = createSelector(
  selectFilteredVehicles,
  (vehicles) => vehicles.length
);

export const selectIsFiltered = createSelector(
  selectCurrentFilter,
  selectSearchTerm,
  (filter, searchTerm) => filter.key !== 'all' || searchTerm.trim() !== ''
);


export const selectSelectedVehicle = createSelector(
  selectVehicleState,
  (state) => state.selectedVehicle
);