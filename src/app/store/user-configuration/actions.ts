import { createAction, props } from '@ngrx/store';
import { UserConfiguration } from './state';

export const loadUserConfiguration = createAction(
  '[User Configuration] Load User Configuration'
);

export const loadUserConfigurationSuccess = createAction(
  '[User Configuration] Load User Configuration Success',
  props<{ configuration: UserConfiguration }>()
);

export const loadUserConfigurationFailure = createAction(
  '[User Configuration] Load User Configuration Failure',
  props<{ error: any }>()
);

export const clearUserConfiguration = createAction(
  '[User Configuration] Clear User Configuration'
);

export const updateUserConfiguration = createAction(
  '[User Configuration] Update',
  props<{ configuration: UserConfiguration }>()
);