import { createAction, props } from '@ngrx/store';

export const loadDeviceTypes = createAction('[DeviceType] Load Device Types');
export const loadDeviceTypesSuccess = createAction(
  '[DeviceType] Load Device Types Success',
  props<{ deviceTypes: any[] }>()
);
export const loadDeviceTypesFailure = createAction(
  '[DeviceType] Load Device Types Failure',
  props<{ error: any }>()
);
