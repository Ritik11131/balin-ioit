// vehicle.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  loadVehicles,
  loadVehiclesSuccess,
  loadVehiclesFailure,
  filterVehicles,
  searchVehicles,
  clearVehicleFilters,
  startVehiclesPolling,
  stopVehiclesPolling,
  selectVehicle,
  startSingleVehiclePolling,
  updateSelectedVehicle,
  stopSingleVehiclePolling,
  updateSelectedVehicleLocation
} from './vehicle.actions';
import { constructVehicleData, sortVehiclesByStatus } from '../../shared/utils/helper_functions';
import { initialVehicleState } from './vehicle.state';

// Helper function to apply filters and search
const applyFiltersAndSearch = (
  vehicles: any[], 
  filter: { key: string; status?: string }, 
  searchTerm: string
): any[] => {
  let result = [...vehicles];
  
  // Apply status filter first
  if (filter.key !== 'all' && filter.status) {
    result = result.filter(vehicle => vehicle.status === filter.status);
  }
  
  // Apply search filter
  if (searchTerm.trim()) {
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    result = result.filter(vehicle => 
      (vehicle?.name || '').toLowerCase().includes(lowerSearchTerm)
    );
  }
  
  // Sort the final result
  return sortVehiclesByStatus(result);
};

export const vehicleReducer = createReducer(
  initialVehicleState,
  
  on(loadVehicles, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(loadVehiclesSuccess, (state, { vehicles }) => {
    const constructedVehicles = constructVehicleData(vehicles);
    const filteredVehicles = applyFiltersAndSearch(
      constructedVehicles, 
      state.currentFilter, 
      state.searchTerm
    );
    
    return {
      ...state,
      vehicles: constructedVehicles,
      filteredVehicles,
      loading: false,
      loaded: true,
      error: null
    };
  }),
  
  on(loadVehiclesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  on(filterVehicles, (state, { key, status }) => {
    const newFilter = { key, status };
    const filteredVehicles = applyFiltersAndSearch(
      state.vehicles, 
      newFilter, 
      state.searchTerm
    );
    
    return {
      ...state,
      currentFilter: newFilter,
      filteredVehicles
    };
  }),
  
  on(searchVehicles, (state, { searchTerm }) => {
    const filteredVehicles = applyFiltersAndSearch(
      state.vehicles, 
      state.currentFilter, 
      searchTerm
    );
    
    return {
      ...state,
      searchTerm,
      filteredVehicles
    };
  }),
  
  on(clearVehicleFilters, (state) => {
    const filteredVehicles = sortVehiclesByStatus(state.vehicles);
    
    return {
      ...state,
      currentFilter: { key: 'all' },
      searchTerm: '',
      filteredVehicles
    };
  }),

   on(selectVehicle, (state, { vehicle }) => ({
    ...state,
    selectedVehicle: vehicle
  })),
  
  on(startVehiclesPolling, (state) => ({
    ...state,
    polling: true
  })),
  
  on(stopVehiclesPolling, (state) => ({
    ...state,
    polling: false
  })),

  on(startSingleVehiclePolling, (state, { vehicleId }) => ({
    ...state,
    selectedVehicleId: vehicleId,
    polling: true
  })),
  
on(updateSelectedVehicle, (state, { vehicle }) => {
  const constructedVehicleArray = constructVehicleData([vehicle]);
  const constructedVehicle = constructedVehicleArray?.[0] ?? vehicle;

  const updatedVehicles = state.vehicles.map(v =>
    v.id === constructedVehicle.id ? constructedVehicle : v
  );

  const filteredVehicles = applyFiltersAndSearch(
    updatedVehicles,
    state.currentFilter,
    state.searchTerm
  );

  return {
    ...state,
    selectedVehicle: constructedVehicle,
    vehicles: updatedVehicles,
    filteredVehicles
  };
}),
  
  on(stopSingleVehiclePolling, (state) => ({
    ...state,
    polling: false,
    // selectedVehicle: null,
    // selectedVehicleId: null
  })),

on(updateSelectedVehicleLocation, (state, { location }) => {
  if (!state.selectedVehicle) return state;

  const updatedSelectedVehicle = {
    ...state.selectedVehicle,
    location
  };

  const updatedFilteredVehicles = state.filteredVehicles.map(v =>
    v.id === updatedSelectedVehicle.id ? { ...v, location } : v
  );

  return {
    ...state,
    selectedVehicle: updatedSelectedVehicle,
    filteredVehicles: updatedFilteredVehicles
  };
})
);
