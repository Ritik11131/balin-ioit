export interface GeofenceState {
  geofences: any[];
  selectedGeofence: any;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialGeofenceState: GeofenceState = {
  geofences: [],
  selectedGeofence: null,
  loading: false,
  loaded: false,
  error: null
};
