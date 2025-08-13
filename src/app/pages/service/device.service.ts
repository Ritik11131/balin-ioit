import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpService) { }

  fetchDevices(): Observable<any[]> {
      return this.http.get$<any>('device').pipe(
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
}
