import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service'; // Adjust the path as necessary
import { logout } from '../../store/core/action';
import { Store } from '@ngrx/store';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private store = inject(Store);

  public decodedToken: string | null = null;
  public userName: string = '';
  public userType:string = '';

  constructor(private httpService: HttpService) {
      if(this.getToken()) {
      this.decodeToken();
      this.setUserDetails(this.decodedToken);
    }
  }

  /**
   * Log in the user and store the token.
   * @param loginId The id of the user.
   * @param password The password of the user.
   * @returns A promise that resolves to the authentication response.
   */
  async login(loginId: string, password: string): Promise<any> {
    const data = { loginDevice:'web',loginId,password };
    const response = await this.httpService.post<any>('token', data);
    this.setTokens(response?.data); // Assuming the response contains a token
    return response;
  }

  /**
   * Log out the user and clear the token.
   */
  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token'); // Clear token from local storage
    this.store.dispatch(logout());
  }

  /**
   * Check if the user is authenticated.
   * @returns True if the user is authenticated, false otherwise.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Set the token in local storage.
   * @param token The token to set.
   */
  private setTokens(access_token: string): void {
    this.token = access_token;
    localStorage.setItem('access_token', access_token);
  }

  /**
   * Get the token from local storage.
   * @returns The token if it exists, null otherwise.
   */
  public getToken(): any {
    return this.token || localStorage.getItem('access_token');
  }

  decodeToken(): void {
    try {
      this.decodedToken = jwtDecode(this.getToken());
      console.log(this.decodedToken,'tokennnn');
      
    } catch (error) {
      this.decodedToken = null;
    }
  }

  private setUserDetails(decodedToken: any): void {
    if (!decodedToken) return;

    this.userName = decodedToken.unique_name || "";
    this.userType =
      decodedToken.role === "0"
        ? "Super Admin"
        : decodedToken.role === "2"
        ? "Customer"
        : "Admin";
  }
}