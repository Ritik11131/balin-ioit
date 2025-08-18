export interface VehicleTypeState {
  vehicleTypes: any[];
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialState: VehicleTypeState = {
  vehicleTypes: [],
  loading: false,
  loaded: false,
  error: null,
};