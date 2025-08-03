import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserConfigurationState } from './state';

export const selectUserConfigurationState = createFeatureSelector<UserConfigurationState>('userConfiguration');

export const selectUserConfiguration = createSelector(
  selectUserConfigurationState,
  (state) => state.configuration
);

export const selectWebConfig = createSelector(
  selectUserConfiguration,
  (config) => config?.attributes?.webConfig
);

export const selectAndroidConfig = createSelector(
  selectUserConfiguration,
  (config) => config?.attributes?.androidConfig
);

export const selectUserInfo = createSelector(
  selectUserConfiguration,
  (config) => config ? {
    id: config.id,
    fkUserId: config.fkUserId,
    userName: config.userName,
    loginId: config.loginId
  } : null
);

// Platform-specific selectors
export const selectWebConfigActions = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.actions
);

export const selectWebConfigModules = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.modules
);

export const selectWebConfigOptions = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.options
);

export const selectWebConfigReports = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.reports
);

export const selectWebConfigPermissions = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.permissions
);

export const selectWebConfigNotifications = createSelector(
  selectWebConfig,
  (webConfig) => webConfig?.notifications
);

export const selectAndroidConfigActions = createSelector(
  selectAndroidConfig,
  (androidConfig) => androidConfig?.actions
);

export const selectAndroidConfigModules = createSelector(
  selectAndroidConfig,
  (androidConfig) => androidConfig?.modules
);

// Helper selectors for common use cases
export const selectIsFeatureEnabled = (platform: 'web' | 'android', section: string, feature: string) => 
  createSelector(
    platform === 'web' ? selectWebConfig : selectAndroidConfig,
    (config: any) => config?.[section]?.[feature] || false
  );

// Check if user has specific permission
export const selectHasPermission = (platform: 'web' | 'android', permission: string) =>
  createSelector(
    platform === 'web' ? selectWebConfigPermissions : selectAndroidConfig,
    (permissions: any) => permissions?.[permission] || false
  );