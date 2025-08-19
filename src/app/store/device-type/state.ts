export interface DeviceTypeState {
  deviceTypes: any[];
  loaded: boolean;
  loading: boolean;
  error: any;
}

const initialState: DeviceTypeState = {
  deviceTypes: [],
  loaded: false,
  loading: false,
  error: null,
};