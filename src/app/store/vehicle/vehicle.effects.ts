import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as VehicleActions from './vehicle.actions';
import { VehicleService } from '../../pages/service/vehicle.service';
import { catchError, map, switchMap, takeUntil, timer, mergeMap, startWith, from } from 'rxjs';
import { of } from 'rxjs';
import { AddressService } from '../../pages/service/address.service';

@Injectable()
export class VehicleEffects {
private actions$ = inject(Actions);
  constructor(
    private vehicleService: VehicleService,
    private addressService: AddressService
  ) {}

  // Polling effect
  pollVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleActions.startVehiclesPolling),
      switchMap(() =>
        timer(0, 10000).pipe( // 0ms first call, then every 10s
          mergeMap(() =>
            this.vehicleService.fetchVehicleList().pipe(
              map((vehicles) =>
                VehicleActions.loadVehiclesSuccess({ vehicles })
              ),
              catchError((error) =>
                of(VehicleActions.loadVehiclesFailure({ error }))
              )
            )
          ),
          takeUntil(this.actions$.pipe(ofType(VehicleActions.stopVehiclesPolling)))
        )
      )
    )
  );

pollSelectedVehicle$ = createEffect(() =>
  this.actions$.pipe(
    ofType(VehicleActions.startSingleVehiclePolling),
    switchMap(({ vehicleId }) =>
      timer(0, 10000).pipe(
        switchMap(() =>
          this.vehicleService.fetchVehicleById(vehicleId).pipe(
            switchMap((vehicle: any) => {
              // First, dispatch updateSelectedVehicle with API data
              const updateVehicleAction = VehicleActions.updateSelectedVehicle({ vehicle });              
              // Then fetch the cached or real address asynchronously
              return from(this.addressService.getAddress(vehicle?.position?.latitude, vehicle?.position?.longitude)).pipe(
                map(address => VehicleActions.updateSelectedVehicleLocation({ location: address })),
                catchError(() =>
                  of(VehicleActions.updateSelectedVehicleLocation({ location: 'Unknown Location' }))
                ),
                startWith(updateVehicleAction) // emit API vehicle first, location will follow
              );
            }),
            catchError(error =>
              of(VehicleActions.loadVehiclesFailure({ error }))
            )
          )
        ),
        takeUntil(
          this.actions$.pipe(ofType(VehicleActions.stopSingleVehiclePolling))
        )
      )
    )
  )
);

  // Single-time manual load
  loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(VehicleActions.loadVehicles),
      switchMap(() =>
        this.vehicleService.fetchVehicleList().pipe(
          map((vehicles) =>
            VehicleActions.loadVehiclesSuccess({ vehicles })
          ),
          catchError((error) =>
            of(VehicleActions.loadVehiclesFailure({ error }))
          )
        )
      )
    )
  );
}
