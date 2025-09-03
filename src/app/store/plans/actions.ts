import { createAction, props } from '@ngrx/store';

export const loadPlans = createAction('[Plans] Load Plans');

export const loadPlansSuccess = createAction(
  '[Plans] Load Plans Success',
  props<{ plans: any[] }>()
);

export const loadPlansFailure = createAction(
  '[Plans] Load Plans Failure',
  props<{ error: any }>()
);
