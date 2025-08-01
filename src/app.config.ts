import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './app/pages/service/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { VehicleEffects } from './app/store/vehicle/vehicle.effects';
import { vehicleReducer } from './app/store/vehicle/vehicle.reducer';

export const appConfig: ApplicationConfig = {
    providers: [
  MessageService,
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
    vehicle: vehicleReducer
  }),
  provideEffects([
    VehicleEffects
  ]),
  provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
]

};
