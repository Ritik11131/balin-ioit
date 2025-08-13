// clear-state.metareducer.ts
import { ActionReducer, MetaReducer } from '@ngrx/store';
import { logout } from './action';

export function clearStateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === logout.type) {
      state = undefined; // Wipe the entire store
    }
    return reducer(state, action);
  };
}
