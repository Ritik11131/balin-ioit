import { createReducer, on } from '@ngrx/store';
import { initialDevicesState } from './devices.state';
import * as DevicesActions from './devices.actions';

export const devicesReducer = createReducer(
  initialDevicesState,

  on(DevicesActions.loadDevices, (state) => ({
    ...state,
    loading: true,
    loaded: false, // reset when starting load
    error: null
  })),

  on(DevicesActions.loadDevicesSuccess, (state, { devices }) => ({
    ...state,
    loading: false,
    loaded: true, // ✅ mark loaded
    devices
  })),

  on(DevicesActions.loadDevicesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
);
