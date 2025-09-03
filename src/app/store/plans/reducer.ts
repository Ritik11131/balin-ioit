import { createReducer, on } from '@ngrx/store';
import { loadPlans, loadPlansSuccess, loadPlansFailure } from './actions';
import { initialPlanState } from './state';

export const plansReducer = createReducer(
  initialPlanState,

  on(loadPlans, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    error: null
  })),

  on(loadPlansSuccess, (state, { plans }) => ({
    ...state,
    loading: false,
    loaded: true,
    plans
  })),

  on(loadPlansFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
);
