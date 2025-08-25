import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service'; // Adjust path
import { Store } from '@ngrx/store';
import { logout } from '../../store/core/action';
import { jwtDecode } from 'jwt-decode';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private parentToken: string | null = null;
  private childTokens: { id: string; userName: string; token: string }[] = [];
  public currentToken: string | null = null;

  public decodedToken: any = null;
  public userName: string = '';
  public userType: string = '';

  private store = inject(Store);

  constructor(private httpService: HttpService) {
    this.parentToken = localStorage.getItem('parent_token');
    this.currentToken = localStorage.getItem('active_token') || this.parentToken;

    const children = localStorage.getItem('child_tokens');
    this.childTokens = children ? JSON.parse(children) : [];

    if (this.currentToken) {
      this.decodeToken();
      this.setUserDetails(this.decodedToken);
    }
  }

  // Parent login only
  async loginParent(loginId: string, password: string) {
    const response = await this.httpService.post<any>('token', { loginDevice: 'web', loginId, password });
    const token = response?.data;
    this.parentToken = token;
    this.currentToken = token;
    localStorage.setItem('parent_token', token);
    localStorage.setItem('active_token', token);

    this.decodeToken();
    this.setUserDetails(this.decodedToken);
    return response;
  }

  // Child login only
  async loginChild(loginId: string, password: string, childId: string, childName: string) {
    const response = await this.httpService.post<any>('token', { loginDevice: 'web', loginId, password });
    const token = response?.data;

    this.addChild({ id: childId, userName: childName, token });

    const index = this.childTokens.findIndex(c => c.id === childId);
    if (index !== -1) {
      this.switchToChild(index);
    }

    return response;
  }

  logout() {
    this.currentToken = null;
    this.parentToken = null;
    this.childTokens = [];
    localStorage.removeItem('parent_token');
    localStorage.removeItem('active_token');
    localStorage.removeItem('child_tokens');
    this.store.dispatch(logout());
  }

  isAuthenticated(): boolean {
    return !!this.currentToken;
  }

  decodeToken() {
    try {
      const tokenToDecode = this.currentToken!;
      this.decodedToken = jwtDecode(tokenToDecode);
    } catch {
      this.decodedToken = null;
    }
  }

  private setUserDetails(decodedToken: any) {
    console.log(decodedToken,'tokennnn');
    
    if (!decodedToken) return;
    this.userName = decodedToken.unique_name || '';
    this.userType =
      decodedToken.role === '0'
        ? 'Super Admin'
        : decodedToken.role === '2'
        ? 'Customer'
        : 'Admin';
  }

  addChild(child: { id: string; userName: string; token: string }) {
    this.childTokens.push(child);
    localStorage.setItem('child_tokens', JSON.stringify(this.childTokens));
  }

  getChildren() {
    return this.childTokens;
  }

  switchToChild(childIndex: number) {
    const children = this.childTokens;
    if (childIndex < 0 || childIndex >= children.length) return;

    const child = children[childIndex];
    this.currentToken = child.token;
    localStorage.setItem('active_token', child.token);

    // Keep only children up to selected
    this.childTokens = children.slice(0, childIndex + 1);
    localStorage.setItem('child_tokens', JSON.stringify(this.childTokens));

    this.decodeToken();
    this.setUserDetails(this.decodedToken);
  }

  switchToParent() {
    this.currentToken = this.parentToken;
    localStorage.setItem('active_token', this.parentToken!);
    this.decodeToken();
    this.setUserDetails(this.decodedToken);
  }
}
