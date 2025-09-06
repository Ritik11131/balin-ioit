import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';
import { ReportsService } from '../service/reports.service';
import { FormEnricherService } from '../service/form-enricher.service';

export const reportResolver: ResolveFn<any> = async (route) => {
  const reportsService = inject(ReportsService);
  const router = inject(Router);
  const formConfigEnricher = inject(FormEnricherService);
  const reportId = route.paramMap.get('id');
  if (!reportId) throw new Error('Report ID not provided');

  // Filter report from availableReports
  const reports = await firstValueFrom(reportsService.getFilteredReportsForCurrentUser());
  const report = reports.find(r => r.id === reportId);
  report.formFields = formConfigEnricher.enrichForms([report.formFields]).pipe(map((res) => res[0]));  
  if (!report) router.navigate(['/pages/reports']) ;
  return report;
};
