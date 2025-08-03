import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as UserConfigurationActions from './actions';
import { UserService } from '../../pages/service/user.service';

@Injectable()
export class UserConfigurationEffects {

    private actions$ = inject(Actions);

    constructor(
        private userService: UserService
    ) { }

    loadUserConfiguration$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserConfigurationActions.loadUserConfiguration),
            mergeMap(() =>
                this.userService.fetchUserConfiguration().pipe(
                    map((response: any) => {
                        // Handle the API response structure: { result: boolean, data: UserConfiguration }
                        if (response && response.data) {
                            // Parse the attributes string to object
                            const parsedData = {
                                ...response.data,
                                attributes: typeof response.data.attributes === 'string'
                                    ? JSON.parse(response.data.attributes)
                                    : response.data.attributes
                            };
                            return UserConfigurationActions.loadUserConfigurationSuccess({ configuration: parsedData });
                        }
                        throw new Error('Invalid response format');
                    }),
                    catchError(error =>
                        of(UserConfigurationActions.loadUserConfigurationFailure({ error }))
                    )
                )
            )
        )
    );


}