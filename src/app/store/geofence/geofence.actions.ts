import { createAction, props } from '@ngrx/store';

export const loadGeofences = createAction('[Geofence] Load Geofences');

export const loadGeofencesSuccess = createAction(
  '[Geofence] Load Geofences Success',
  props<{ geofences: any[] }>()
);

export const loadGeofencesFailure = createAction(
  '[Geofence] Load Geofences Failure',
  props<{ error: any }>()
);

export const selectGeofence = createAction(
  '[Geofence] Select Geofence',
  props<{ geofence: any | null }>()
);
