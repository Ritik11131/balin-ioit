import { createAction, props } from '@ngrx/store';

export const loadVehicles = createAction('[Vehicle] Load Vehicles');

export const loadVehiclesSuccess = createAction(
  '[Vehicle] Load Vehicles Success',
  props<{ vehicles: any[] }>()
);

export const loadVehiclesFailure = createAction(
  '[Vehicle] Load Vehicles Failure',
  props<{ error: any }>()
);

export const startVehiclePolling = createAction('[Vehicle] Start Polling');
export const stopVehiclePolling = createAction('[Vehicle] Stop Polling');
