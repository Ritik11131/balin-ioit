import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeviceTypeState } from './state';

export const selectDeviceTypeState =
  createFeatureSelector<DeviceTypeState>('deviceType');

export const selectDeviceTypes = createSelector(
  selectDeviceTypeState,
  (state) => state.deviceTypes
);

export const selectDeviceTypesLoading = createSelector(
  selectDeviceTypeState,
  (state) => state.loading
);

export const selectDeviceTypesLoaded = createSelector(
  selectDeviceTypeState,
  (state) => state.loaded
);
