export interface DevicesState {
  devices: any[];
  loading: boolean;
  loaded: boolean; // ✅ added loaded flag
  error: string | null;
}

export const initialDevicesState: DevicesState = {
  devices: [],
  loading: false,
  loaded: false, // ✅ initially false
  error: null
};