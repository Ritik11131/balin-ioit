import { UiService } from './../../layout/service/ui.service';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {

  constructor(private http:HttpService, private uiService:UiService) { }


  fetchGeofences(): Observable<any[]> {
      return this.http.get$<any>('Geofence/v1').pipe(
        map((response) => {
          // Handle different response structures
          if (response && response.data) {
            return response.data;
          }
          // If response is directly the array
          return Array.isArray(response) ? response : [];
        }),
        catchError((error) => {
          console.error('Error fetching vehicles:', error);
          // You could add more specific error handling here
          return throwError(() => ({
            message: 'Failed to fetch vehicles',
            originalError: error,
            timestamp: new Date()
          }));
        })
      );
    }


    async fetchGeofenceLinkedVehicles(geofenceId: string): Promise<any> {
      try {
        const response = await this.http.get<any>('GeofenceLink/ByGeofenceId', {}, geofenceId);
        return response?.data || [];
      } catch (error: any) {
        this.uiService.showToast('error', 'Error', error?.error?.data);
        console.error('Error fetching linked vehicles for geofence:', error);
        throw error;
      }
    }

      async updateGeofence(id: any,data: any): Promise<any> {
    try {
      const response = await this.http.put('Geofence', id, data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

  async createGeofence(data: any): Promise<any> {
    try {
      const response = await this.http.post('Geofence', data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

  async deleteGeofence(data: any): Promise<any> {
    try {
      const response = await this.http.delete('Geofence', data?.id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }
}
