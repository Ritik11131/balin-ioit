// store/users/users.state.ts
export interface UsersState {
  users: any[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  loading: false,
  loaded: false,
  error: null
};
