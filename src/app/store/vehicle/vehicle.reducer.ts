import { createReducer, on } from '@ngrx/store';
import * as VehicleActions from './vehicle.actions';

export interface VehicleState {
  vehicles: any[];
  loading: boolean;
  loaded: boolean; // add this
  error: any;
  polling: boolean;
}

export const initialState: VehicleState = {
  vehicles: [],
  loading: false,
  loaded: false, // initialize to false
  error: null,
  polling: false,
};

export const vehicleReducer = createReducer(
  initialState,

  on(VehicleActions.loadVehicles, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(VehicleActions.loadVehiclesSuccess, (state, { vehicles }) => ({
    ...state,
    vehicles,
    loaded: true,
    loading: false
  })),

  on(VehicleActions.loadVehiclesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

on(VehicleActions.startVehiclePolling, (state) => ({ ...state, polling: true })),
  on(VehicleActions.stopVehiclePolling, (state) => ({ ...state, polling: false }))
);
