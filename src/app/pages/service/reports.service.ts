import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { UiService } from '../../layout/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpService, private uiService: UiService) { }

    async fetchStopReport(payload: any): Promise<any> {
    try {
      const response = await this.http.post('reports/StopReport', payload);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }
}
