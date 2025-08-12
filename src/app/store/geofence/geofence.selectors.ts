import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GeofenceState } from './geofence.state';

export const selectGeofenceState = createFeatureSelector<GeofenceState>('geofence');

export const selectGeofences = createSelector(
  selectGeofenceState,
  (state) => state.geofences
);

export const selectGeofenceLoading = createSelector(
  selectGeofenceState,
  (state) => state.loading
);

export const selectGeofenceLoaded = createSelector(
  selectGeofenceState,
  (state) => state.loaded
);

export const selectGeofenceError = createSelector(
  selectGeofenceState,
  (state) => state.error
);

export const selectSelectedGeofence = createSelector(
  selectGeofenceState,
  (state) => state.selectedGeofence
);
