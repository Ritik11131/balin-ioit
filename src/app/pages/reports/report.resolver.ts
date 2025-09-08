import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ReportsService } from '../service/reports.service';
import { FormEnricherService } from '../service/form-enricher.service';

export const reportResolver: ResolveFn<any> = async (route) => {
  const reportsService = inject(ReportsService);
  const router = inject(Router);
  const formConfigEnricher = inject(FormEnricherService);

  const reportId = route.paramMap.get('id');
  if (!reportId) throw new Error('Report ID not provided');

  // Filter report from availableReports
  const reports = await firstValueFrom(
    reportsService.getFilteredReportsForCurrentUser()
  );
  const report = reports.find(r => r.id === reportId);

  if (!report) {
    router.navigate(['/pages/reports']);
    return null;
  }

  // ✅ Enrich and resolve here (FormGroup is returned, not Observable)
  const enrichedFormFields = await firstValueFrom(
    formConfigEnricher.enrichForms([report.formFields])
  );

  report.formFields = enrichedFormFields[0];

  return report;
};
