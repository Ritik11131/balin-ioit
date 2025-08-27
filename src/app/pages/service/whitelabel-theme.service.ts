import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { LayoutService } from '../../layout/service/layout.service';

export interface ThemeData {
  logo?: string;
  favicon?: string;
  title?: string;
  baseUrl?: string;
  themeColor?: string;
  message?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class WhitelabelThemeService {
  private themeSubject = new BehaviorSubject<ThemeData>({});
  theme$: Observable<ThemeData> = this.themeSubject.asObservable();
  private isLoaded = false;

  constructor(private http: HttpService, private layoutService: LayoutService) { }

  // Called once in APP_INITIALIZER
  async loadTheme(): Promise<void> {
    console.log('Applying theme...');

    if (this.isLoaded) return;

    try {
      const res: any = await this.http.get(`SASRegister?url=${window.location.host}`);
      const attributes = res?.data?.attributes
        ? JSON.parse(res.data.attributes)
        : {};

      const theme: ThemeData = {
        logo: attributes.logo,
        favicon: attributes.favicon,
        title: attributes.title,
        baseUrl: attributes.baseUrl,
        message: attributes.message,
        ...attributes
      };

      this.themeSubject.next(theme);
      document.title = theme.title ?? 'App';
      this.applyFavicon(theme.favicon);
      this.layoutService.layoutConfig.update((state) => ({ ...state, primary: theme.themeColor || 'emerald' }));
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load theme', error);
      this.themeSubject.next({});
      this.isLoaded = true;
    }
  }

  // Generic getter
  get(prop: keyof ThemeData): any {
    return this.themeSubject.getValue()[prop] || null;
  }

  private applyFavicon(url: string | undefined) {
    if (!url) return;
    const link: HTMLLinkElement =
      document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
  }

}
