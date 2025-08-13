import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DevicesState } from './devices.state';

export const selectDevicesState = createFeatureSelector<DevicesState>('devices');

export const selectAllDevices = createSelector(selectDevicesState, (state) => state.devices);
export const selectDevicesLoading = createSelector(selectDevicesState, (state) => state.loading);
export const selectDevicesLoaded = createSelector(selectDevicesState, (state) => state.loaded); // ✅ new
export const selectDevicesError = createSelector(selectDevicesState, (state) => state.error);
