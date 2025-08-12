import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GeofenceActions from './geofence.actions';
import { GeofenceService } from '../../pages/service/geofence.service';
import { catchError, map, switchMap } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class GeofenceEffects {
  private actions$ = inject(Actions);

  constructor(private geofenceService: GeofenceService) {}

  loadGeofences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GeofenceActions.loadGeofences),
      switchMap(() =>
        this.geofenceService.fetchGeofences().pipe(
          map((geofences) => GeofenceActions.loadGeofencesSuccess({ geofences })),
          catchError((error) =>
            of(GeofenceActions.loadGeofencesFailure({ error }))
          )
        )
      )
    )
  );
}
