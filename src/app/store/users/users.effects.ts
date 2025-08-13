// store/users/users.effects.ts
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './users.actions';
import { UserService } from '../../pages/service/user.service';

@Injectable()
export class UsersEffects {
    private actions$ = inject(Actions);
    
  constructor(
    
    private userService: UserService,
    
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      mergeMap(() =>
        this.userService.fetchUsers().pipe(
          map((users) => loadUsersSuccess({ users })),
          catchError((error) => of(loadUsersFailure({ error: error.message })))
        )
      )
    )
  );
}
