// store/users/users.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersLoaded = createSelector(
  selectUsersState,
  (state) => state.loaded
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);
