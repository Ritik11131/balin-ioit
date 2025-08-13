import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as DevicesActions from './devices.actions';
import { DeviceService } from '../../pages/service/device.service';

@Injectable()
export class DevicesEffects {
        private actions$ = inject(Actions);
    
  constructor(private deviceService: DeviceService) {}

  loadDevices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DevicesActions.loadDevices),
      mergeMap(() =>
        this.deviceService.fetchDevices().pipe(
          map((devices) => DevicesActions.loadDevicesSuccess({ devices })),
          catchError((error) => of(DevicesActions.loadDevicesFailure({ error: error.message })))
        )
      )
    )
  );
}
