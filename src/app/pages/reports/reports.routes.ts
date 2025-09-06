import { Routes } from "@angular/router";
import { ReportDetailComponent } from "./report-detail/report-detail.component";
import { ReportsComponent } from "./reports.component";
import { reportResolver } from "./report.resolver";


export default [
    { path:'', component: ReportsComponent},
    { path: ':id',component: ReportDetailComponent, resolve: { report: reportResolver } },
] as Routes;
