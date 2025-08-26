import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { map, catchError, retry, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { UiService } from '../../layout/service/ui.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiTimeout = 10000; // 10 seconds
  private readonly maxRetries = 3;
  userTypes: { label: string; value: number }[] = [];
  readonly DEFAULT_USER_TYPES = [
    { label: 'Admin', value: 1 },
    { label: 'User', value: 2 },
  ];
  
    constructor(private http:HttpService, private uiService: UiService, private authService: AuthService) { }


    /**
   * Centralized mapping of orgName → role definitions
   */
  private readonly USER_TYPE_CONFIG: Record<
    string,
    { admin: { label: string; value: number }[]; nonAdmin: { label: string; value: number }[] }
  > = {
    Torq: {
      admin: [
        { label: 'Admin', value: 1 },
        { label: 'User', value: 2 },
      ],
      nonAdmin: [{ label: 'User', value: 2 }],
    },
    STC: {
      admin: [
        { label: 'End User', value: 2 },
        { label: 'Financer', value: 1 },
      ],
      nonAdmin: [{ label: 'End User', value: 2 }],
    },
    'Thukral Electric Bikes Pvt. ltd.': {
      admin: [
        { label: 'End User', value: 2 },
        { label: 'Financer', value: 1 },
      ],
      nonAdmin: [{ label: 'End User', value: 2 }],
    },
    default: {
      admin: [
        { label: 'Customer', value: 2 },
        { label: 'Dealer', value: 1 },
      ],
      nonAdmin: [{ label: 'Customer', value: 2 }],
    },
  };

  /**
   * Initializes userTypes for current user/org
   */
  initializeUserTypes(config: any): void {
    try {
      const hasCreateDealerPermission =
        config?.configJson?.webConfig?.permissions?.createDealer || false;
      const isAdminUser =
        this.authService?.userType === 'Admin' ||
        this.authService?.userType === 'Super Admin';
      const orgName = config?.title || 'default';

      const roleConfig = this.USER_TYPE_CONFIG[orgName] || this.USER_TYPE_CONFIG['default'];

      this.userTypes = hasCreateDealerPermission && isAdminUser
        ? roleConfig.admin
        : roleConfig.nonAdmin;
    } catch {
      this.userTypes = this.DEFAULT_USER_TYPES;
    }
  }

  /**
   * Returns a label for a given userType
   */
  getUserTypeLabel(type: number | string): string {
    const numericType = Number(type);

    if (!this.userTypes?.length) {
      this.userTypes = this.DEFAULT_USER_TYPES;
    }

    const user = this.userTypes.find((v) => v.value === numericType);
    if (user) return user.label;

    const fallback = this.DEFAULT_USER_TYPES.find((v) => v.value === numericType);
    if (fallback) return fallback.label;

    if (numericType === 1) return 'Admin';
    if (numericType === 2) return 'User';

    return 'Unknown';
  }

  
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

    async fetchUserConfigurationById(id: any): Promise<any> {
    try {
      const response = await this.http.get('UserConfiguration', {}, id);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
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

  async getUserListByDeviceId(id: any): Promise<any> {
    try {
      const response = await this.http.get('DeviceMapping/GetUserListByDeviceId', {}, id);
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

  async updateUserConfiguration(data: any): Promise<any> {
     try {
      const response: any = await this.http.put('UserConfiguration', data?.id, data);
      this.uiService.showToast('success', 'Success', response?.data)
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error' ,error?.error?.data);
      throw error;
    }
  }
}
