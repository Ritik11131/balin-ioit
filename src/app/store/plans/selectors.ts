import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PlanState } from './state';

export const selectPlanState = createFeatureSelector<PlanState>('plans');

export const selectPlans = createSelector(
  selectPlanState,
  (state) => state.plans
);

export const selectPlansLoading = createSelector(
  selectPlanState,
  (state) => state.loading
);

export const selectPlansLoaded = createSelector(
  selectPlanState,
  (state) => state.loaded
);

export const selectPlansError = createSelector(
  selectPlanState,
  (state) => state.error
);

export const selectPlanCount = createSelector(
  selectPlans,
  (plans) => plans.length
);
