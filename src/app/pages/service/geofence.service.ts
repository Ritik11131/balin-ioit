import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class GeofenceService {

  constructor(private http:HttpService) { }


  fetchGeofences(): Observable<any[]> {
      return this.http.get$<any>('Geofence').pipe(
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
      } catch (error) {
        console.error('Error fetching linked vehicles for geofence:', error);
        throw error;
      }
    }
}
