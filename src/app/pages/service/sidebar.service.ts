// sidebar.service.ts
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sidebarItems } from '../../shared/constants/sidebar';
import { selectWebConfigModules } from '../../store/user-configuration/selectors';
import { ConfigModules } from '../../store/user-configuration/state';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private store = inject(Store);

  /**
   * Returns sidebar items filtered by ConfigModules
   */
  getSidebarItems(): Observable<any[]> {
    return this.store.select(selectWebConfigModules).pipe(
      map((modules: ConfigModules | undefined) => {
        if (!modules) return [];
        return sidebarItems.filter(item => {
          // no requiredModuleKey → always show
          if (!item.requiredModuleKey) return true;
          // show only if module flag is true
          return modules[item.requiredModuleKey as keyof ConfigModules];
        });
      })
    );
  }

  /**
   * Finds active item based on route
   */
  getActiveKeyFromRoute(url: string): string {
    const matchedItem = sidebarItems.find(item => url === item.route);
    return matchedItem ? matchedItem.key : '';
  }
}
