import { Routes } from "@angular/router";
import { ReportDetailComponent } from "./report-detail/report-detail.component";
import { ReportsComponent } from "./reports.component";


export default [
    { path:'', component: ReportsComponent},
    { path: ':id',component: ReportDetailComponent },
] as Routes;
