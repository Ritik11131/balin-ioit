import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UiService } from '../../layout/service/ui.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiTimeout = 10000; // 10 seconds
    private readonly maxRetries = 3;
  
    constructor(private http:HttpService, private uiService: UiService) { }
  
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

    fetchUsers(): Observable<any[]> {      
      return this.http.get$<any>('User').pipe(
        map((response) => {
          // Handle different response structures
          if (response && response.result) {
            return response?.data;
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

  async getUserDetailsById(id: any): Promise<any> {
    try {
      const response = await this.http.get('User', {}, id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }

  async updateUser(id: any,data: any): Promise<any> {
    try {
      const response = await this.http.put('User', id, data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

  async createUser(data: any): Promise<any> {
    try {
      const response = await this.http.post('User', data);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

  async deleteUser(data: any): Promise<any> {
    try {
      const response = await this.http.delete('User', data?.id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
      
    }
  }

  async fetchSubUsers(id: any): Promise<any> {
    try {
      const response = await this.http.get('User/GetSubUserList', {}, id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error' ,error?.error?.data);
      throw error;
    }
  }
}
