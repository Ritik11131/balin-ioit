// vehicle-type.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadVehicleTypes = createAction('[VehicleType] Load VehicleTypes');
export const loadVehicleTypesSuccess = createAction(
  '[VehicleType] Load VehicleTypes Success',
  props<{ vehicleTypes: any[] }>()
);
export const loadVehicleTypesFailure = createAction(
  '[VehicleType] Load VehicleTypes Failure',
  props<{ error: any }>()
);
export const resetVehicleTypes = createAction('[VehicleType] Reset VehicleTypes');
