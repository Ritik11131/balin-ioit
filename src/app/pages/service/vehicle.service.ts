import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http:HttpService) { }

  fetchVehicleList(): Observable<any[]> {
    return this.http.get$<any>('VehicleList').pipe(
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

  fetchVehicleById(id: any): Observable<any[]> {
    return this.http.get$<any>('vehicleList/SearchByVehicle', {}, id).pipe(
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

  fetchVehicleTypes(): Observable<any[]> {
    return this.http.get$<any>('Masters/VehicleType').pipe(
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
