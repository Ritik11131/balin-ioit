// vehicle.actions.ts
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

export const filterVehicles = createAction(
  '[Vehicle] Filter Vehicles',
  props<{ key: string; status?: string }>()
);

export const searchVehicles = createAction(
  '[Vehicle] Search Vehicles',
  props<{ searchTerm: string }>()
);

export const clearVehicleFilters = createAction(
  '[Vehicle] Clear Filters'
);

export const selectVehicle = createAction(
  '[Vehicle] Select Vehicle',
  props<{ vehicle: any | null }>()
);

export const startVehiclesPolling = createAction('[Vehicle] Start Polling');

export const stopVehiclesPolling = createAction('[Vehicle] Stop Polling');


export const startSingleVehiclePolling = createAction(
  '[Vehicle] Start Single Vehicle Polling',
  props<{ vehicleId: string }>()
);

export const stopSingleVehiclePolling = createAction('[Vehicle] Stop Single Vehicle Polling');

export const updateSelectedVehicle = createAction(
  '[Vehicle] Update Selected Vehicle',
  props<{ vehicle: any }>()
);

export const updateSelectedVehicleLocation = createAction(
  '[Vehicle] Update Selected Vehicle Location',
  props<{ location: string }>()
);

