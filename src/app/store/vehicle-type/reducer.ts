import { createReducer, on } from "@ngrx/store";
import { initialState } from "./state";
import { loadVehicleTypes, loadVehicleTypesFailure, loadVehicleTypesSuccess, resetVehicleTypes } from "./actions";

export const vehicleTypeReducer = createReducer(
  initialState,
  on(loadVehicleTypes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadVehicleTypesSuccess, (state, { vehicleTypes }) => ({
    ...state,
    loading: false,
    loaded: true,
    vehicleTypes,
  })),
  on(loadVehicleTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error,
  })),
  on(resetVehicleTypes, () => initialState)
);