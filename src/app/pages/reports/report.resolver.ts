import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReportsService } from '../service/reports.service';

export const reportResolver: ResolveFn<any> = async (route) => {
  const reportsService = inject(ReportsService);
  const reportId = route.paramMap.get('id');
  if (!reportId) throw new Error('Report ID not provided');

  // Filter report from availableReports
  const reports = await firstValueFrom(reportsService.getFilteredReportsForCurrentUser());
  const report = reports.find(r => r.id === reportId);
  if (!report) throw new Error('Report not found');
 return report;
};
