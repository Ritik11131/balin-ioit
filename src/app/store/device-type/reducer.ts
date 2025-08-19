import { createReducer, on } from "@ngrx/store";
import { initialState } from "../vehicle-type/state";
import { loadDeviceTypes, loadDeviceTypesFailure, loadDeviceTypesSuccess } from "./actions";

export const deviceTypeReducer = createReducer(
  initialState,
  on(loadDeviceTypes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadDeviceTypesSuccess, (state, { deviceTypes }) => ({
    ...state,
    deviceTypes,
    loaded: true,
    loading: false,
  })),
  on(loadDeviceTypesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);