import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiTimeout = 10000; // 10 seconds
    private readonly maxRetries = 3;
  
    constructor(private http:HttpService) { }
  
    fetchUserConfiguration(): Observable<any[]> {      
      return this.http.get$<any>('UserConfiguration').pipe(
        timeout(this.apiTimeout),
        retry(this.maxRetries),
        map((response) => {
          // Handle different response structures
          if (response && response.result) {
            return response;
          }
         
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
