import { createReducer, on } from '@ngrx/store';
import * as GeofenceActions from './geofence.actions';
import { initialGeofenceState } from './geofence.state';

export const geofenceReducer = createReducer(
  initialGeofenceState,

  on(GeofenceActions.loadGeofences, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(GeofenceActions.loadGeofencesSuccess, (state, { geofences }) => ({
    ...state,
    geofences,
    loading: false,
    loaded: true,
    error: null
  })),

  on(GeofenceActions.loadGeofencesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

   on(GeofenceActions.selectGeofence, (state, { geofence }) => ({
    ...state,
    selectedGeofence: geofence
  }))
);
