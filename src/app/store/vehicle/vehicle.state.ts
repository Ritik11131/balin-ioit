// vehicle.state.ts
export interface VehicleFilter {
  key: string;
  status?: string;
}

export interface VehicleState {
  vehicles: any[];
  filteredVehicles: any[];
  selectedVehicle: any;
  selectedVehicleId: string | null;
  loading: boolean;
  loaded: boolean;
  polling: boolean;
  error: any;
  currentFilter: VehicleFilter;
  searchTerm: string;
}

export const initialVehicleState: VehicleState = {
  vehicles: [],
  filteredVehicles: [],
  selectedVehicle: null,
   selectedVehicleId: null,
  loading: false,
  loaded: false,
  polling: false,
  error: null,
  currentFilter: { key: 'all' },
  searchTerm: ''
};