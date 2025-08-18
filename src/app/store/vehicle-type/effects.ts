// vehicle-type.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as VehicleTypeActions from './actions';
import { HttpService } from '../../pages/service/http.service';
import { VehicleService } from '../../pages/service/vehicle.service';

@Injectable()
export class VehicleTypeEffects {

    private actions$ = inject(Actions);
    
        constructor(
            private vehicleService: VehicleService
        ) { }

  loadVehicleTypes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleTypeActions.loadVehicleTypes),
      mergeMap(() =>
        this.vehicleService.fetchVehicleTypes().pipe(
          map((vehicleTypes: any[]) =>
            VehicleTypeActions.loadVehicleTypesSuccess({ vehicleTypes })
          ),
          catchError((error) =>
            of(VehicleTypeActions.loadVehicleTypesFailure({ error }))
          )
        )
      )
    )
  );
}
