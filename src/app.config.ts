import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideAppInitializer  } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './app/pages/service/interceptors/auth.interceptor';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { VehicleEffects } from './app/store/vehicle/vehicle.effects';
import { vehicleReducer } from './app/store/vehicle/vehicle.reducer';
import { userConfigurationReducer } from './app/store/user-configuration/reducer';
import { UserConfigurationEffects } from './app/store/user-configuration/effects';
import { GeofenceEffects } from './app/store/geofence/geofence.effects';
import { geofenceReducer } from './app/store/geofence/geofence.reducer';
import { usersReducer } from './app/store/users/users.reducer';
import { UsersEffects } from './app/store/users/users.effects';
import { devicesReducer } from './app/store/devices/devices.reducer';
import { DevicesEffects } from './app/store/devices/devices.effects';
import { clearStateMetaReducer } from './app/store/core/clear-state-reducer';

export const appConfig: ApplicationConfig = {
    providers: [
  MessageService,
  ConfirmationService,
  provideRouter(
    appRoutes,
    withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    withEnabledBlockingInitialNavigation()
  ),
  provideHttpClient(
    withFetch(),
    withInterceptors([apiInterceptor]) // ✅ Combined here
  ),
  provideAnimationsAsync(),
  providePrimeNG({
    theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } }
  }),
  provideStore({
    vehicle: vehicleReducer,
    geofence: geofenceReducer,
    userConfiguration: userConfigurationReducer,
    users: usersReducer,
    devices: devicesReducer
  },
  { metaReducers: [clearStateMetaReducer] }
  ),
  provideEffects([
    VehicleEffects,
    UserConfigurationEffects,
    GeofenceEffects,
    UsersEffects,
    DevicesEffects
  ]),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
]

};
