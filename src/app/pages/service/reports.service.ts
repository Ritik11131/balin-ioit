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


  getFilteredReportsForCurrentUser(): Observable<any[]> {
    return this.store.select(selectWebConfigReports).pipe(
      map((report: ConfigReports | undefined) => {
        if (!report) return [];
        return availableReports.filter(item => report[item.id as keyof ConfigReports]);
      })
    );
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
