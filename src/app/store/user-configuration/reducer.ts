// user-configuration.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { UserConfigurationState, initialUserConfigurationState } from './state';
import * as UserConfigurationActions from './actions';

export const userConfigurationReducer = createReducer(
  initialUserConfigurationState,
  on(UserConfigurationActions.loadUserConfiguration, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(UserConfigurationActions.loadUserConfigurationSuccess, (state, { configuration }) => ({
    ...state,
    configuration,
    loading: false,
    error: null,
    loaded: true
  })),
  on(UserConfigurationActions.loadUserConfigurationFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error.message || 'Failed to load user configuration',
    loaded: false
  })),
  on(UserConfigurationActions.clearUserConfiguration, () => initialUserConfigurationState)
);