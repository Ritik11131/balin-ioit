import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PlanService } from '../../pages/service/plan.service';
import { loadPlans, loadPlansFailure, loadPlansSuccess } from './actions';

@Injectable()
export class PlansEffects {
  private actions$ = inject(Actions);
  private planService = inject(PlanService);

  loadPlans$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPlans),
      mergeMap(() =>
        this.planService.fetchPlans().pipe(
          map((plans) => loadPlansSuccess({ plans })),
          catchError((error) => of(loadPlansFailure({ error })))
        )
      )
    )
  );
}
