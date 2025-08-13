import { createAction, props } from '@ngrx/store';

export const loadDevices = createAction('[Devices] Load Devices');
export const loadDevicesSuccess = createAction('[Devices] Load Devices Success', props<{ devices: any[] }>());
export const loadDevicesFailure = createAction('[Devices] Load Devices Failure', props<{ error: string }>());
