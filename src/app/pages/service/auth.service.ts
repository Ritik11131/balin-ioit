import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service'; 
import { Store } from '@ngrx/store';
import { logout } from '../../store/core/action';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public parentToken: string | null = null;
  private childTokens: { id: string; userName: string; token: string }[] = [];
  public currentToken: string | null = null;

  public decodedToken: any = null;
  public userName: string = '';
  public userType: string = '';
  public userRole: string = '';

  public activeUser$ = new BehaviorSubject<{ userName: string; userType: string } | null>(null);

  roleMap: Record<string | number, string> = {
    '0': 'Super Admin',
    '1': 'Admin',
    '2': 'Customer',
    // Add more roles here if needed
  };

  private store = inject(Store);

  constructor(private httpService: HttpService) {
    this.parentToken = localStorage.getItem('parent_token');
    this.currentToken = localStorage.getItem('active_token') || this.parentToken;

    const children = localStorage.getItem('child_tokens');
    this.childTokens = children ? JSON.parse(children) : [];

    if (this.currentToken) {
      this.decodeToken();
      this.setUserDetails(this.decodedToken);
      this.updateActiveUser();
    }
  }

  async login(loginId: string, password: string) {
    const response = await this.httpService.post<any>('token', { loginDevice: 'web', loginId, password });
    this.setParentToken(response?.data);
    return response;
  }

  async loginChild(loginId: string, password: string, id: string, userName: string) {
    const response = await this.httpService.post<any>('token', { loginDevice: 'web', loginId, password });
    this.addChild({ id, userName, token: response.data });
    const childIndex = this.childTokens.findIndex(c => c.id === id);
    if (childIndex !== -1) {
      this.switchToChild(childIndex);
    }
  }

  logout() {
    this.currentToken = null;
    this.parentToken = null;
    this.childTokens = [];
    localStorage.removeItem('parent_token');
    localStorage.removeItem('active_token');
    localStorage.removeItem('child_tokens');
    this.store.dispatch(logout());
    this.updateActiveUser();
  }

    isAuthenticated(): boolean {
    return !!this.currentToken; // true if a parent or child is logged in
  }
  

  setParentToken(token: string) {
    this.parentToken = token;
    this.currentToken = token;
    localStorage.setItem('parent_token', token);
    localStorage.setItem('active_token', token);
    this.decodeToken();
    this.setUserDetails(this.decodedToken);
    this.updateActiveUser();
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
    if (!decodedToken) return;
    this.userName = decodedToken.unique_name || '';
    this.userRole = decodedToken.role || '';
    this.userType = this.roleMap[decodedToken.role] || 'Unknown';
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
    this.updateActiveUser();
  }

  switchToParent() {
    this.currentToken = this.parentToken;
    localStorage.setItem('active_token', this.parentToken!);
    this.childTokens = [];
    localStorage.removeItem('child_tokens');
    this.decodeToken();
    this.setUserDetails(this.decodedToken);
    this.updateActiveUser();
  }

  private updateActiveUser() {
    this.activeUser$.next({ userName: this.userName, userType: this.userType });
  }
}
