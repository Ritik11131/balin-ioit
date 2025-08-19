import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as DeviceTypeActions from './actions';
import { DeviceService } from '../../pages/service/device.service';

@Injectable()
export class DeviceTypeEffects {
        private actions$ = inject(Actions);
    
  loadDeviceTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DeviceTypeActions.loadDeviceTypes),
      mergeMap(() =>
        this.deviceService.fetchDeviceTypes().pipe(   // 👈 API call
          map((deviceTypes: any[]) =>
            DeviceTypeActions.loadDeviceTypesSuccess({ deviceTypes })
          ),
          catchError((error) =>
            of(DeviceTypeActions.loadDeviceTypesFailure({ error }))
          )
        )
      )
    )
  );

  constructor(private deviceService: DeviceService) {}
}
