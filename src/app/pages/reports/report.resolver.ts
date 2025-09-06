import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReportsService } from '../service/reports.service';

export const reportResolver: ResolveFn<any> = async (route) => {
  const reportsService = inject(ReportsService);
  const router = inject(Router)
  const reportId = route.paramMap.get('id');
  if (!reportId) throw new Error('Report ID not provided');

  // Filter report from availableReports
  const reports = await firstValueFrom(reportsService.getFilteredReportsForCurrentUser());
  const report = reports.find(r => r.id === reportId);
  if (!report) router.navigate(['/pages/reports']) ;
 return report;
};
