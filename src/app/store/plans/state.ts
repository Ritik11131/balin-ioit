export interface PlanState {
  plans: any[];
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialPlanState: PlanState = {
  plans: [],
  loading: false,
  loaded: false,
  error: null
};