// store/users/users.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { loadUsers, loadUsersSuccess, loadUsersFailure } from './users.actions';
import { initialUsersState } from './users.state';

export const usersReducer = createReducer(
  initialUsersState,

  on(loadUsers, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null
  })),

  on(loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
    loaded: true
  })),

  on(loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
);
