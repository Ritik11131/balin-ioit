import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UiService } from '../../layout/service/ui.service';
import { Store } from '@ngrx/store';
import { selectWebConfigReports } from '../../store/user-configuration/selectors';
import { map, Observable } from 'rxjs';
import { ConfigReports } from '../../store/user-configuration/state';
import { availableReports } from '../../shared/constants/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private store = inject(Store);

  constructor(private http: HttpService, private uiService: UiService) { }

  private async safeFetch(endpoint: string, payload: any) {
  try {
    return await this.http.post(endpoint, payload)
  } catch (err: any) {
    return { error: err.message, data: [] };
  }
}

  getFilteredReportsForCurrentUser(): Observable<any[]> {
    return this.store.select(selectWebConfigReports).pipe(
      map((report: ConfigReports | undefined) => {
        if (!report) return [];
        return availableReports.filter(item => report[item.id as keyof ConfigReports]);
      })
    );
  }


  async fetchReport(reportConfig: any, requests: any[]) {
  const endpoints = Array.isArray(reportConfig.api.endpoints) ? reportConfig.api.endpoints : [reportConfig.api.endpoints];

  // // If multiRequest = true → split date range into days
  // if (reportConfig.api.multiRequest) {
  //   const expandedRequests: any[] = [];

  //   for (const r of requests) {
  //     const days = splitDateRangeIntoDays(r.fromTime, r.toTime);
  //     days.forEach(day =>
  //       expandedRequests.push({
  //         deviceId: r.deviceId,
  //         fromTime: day.fromTime,
  //         toTime: day.toTime
  //       })
  //     );
  //   }
  //   requests = expandedRequests;
  // }

  // Call APIs for all endpoints
  const results = await Promise.all(
    endpoints.map((endpoint: any) =>
      Promise.allSettled(
        requests.map(r =>
          this.safeFetch(endpoint, {
            DeviceId: r.deviceId,
            FromTime: r.fromTime,
            ToTime: r.toTime
          })
        )
      )
    )
  );

  // Return structured results
  return endpoints.reduce((acc: any, endpoint: any, idx: any) => {
    acc[endpoint] = results[idx];
    return acc;
  }, {} as Record<string, any>);
}


  async fetchStopReport(payload: any): Promise<any> {
    try {
      const response = await this.http.post('reports/StopReport', payload);
      return response;
    } catch (error: any) {
      throw error;
    }
  }
}
