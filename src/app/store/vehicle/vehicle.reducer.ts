// vehicle.reducer.ts
import { createReducer, on } from '@ngrx/store';
import {
  loadVehicles,
  loadVehiclesSuccess,
  loadVehiclesFailure,
  filterVehicles,
  searchVehicles,
  clearVehicleFilters,
  startVehiclePolling,
  stopVehiclePolling,
  selectVehicle
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
  
  on(startVehiclePolling, (state) => ({
    ...state,
    polling: true
  })),
  
  on(stopVehiclePolling, (state) => ({
    ...state,
    polling: false
  }))
);