import { updateUserConfiguration } from './../../store/user-configuration/actions';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from '../../pages/service/user.service';
import { Observable, firstValueFrom } from 'rxjs';
import { selectUserConfiguration } from '../../store/user-configuration/selectors';
import { UserConfiguration } from '../../store/user-configuration/state';

@Injectable({ providedIn: 'root' })
export class UserConfigurationService {
  private store = inject(Store);
  private userService = inject(UserService);

  /** Observable of current user configuration from store */
  configuration$: Observable<UserConfiguration | null> = this.store.select(selectUserConfiguration);

  /** Get current configuration snapshot (mutable copy) */
  async getConfigurationSnapshot(): Promise<UserConfiguration | null> {
    const config = await firstValueFrom(this.configuration$);
    if (!config) return null;

    // Return a deep copy to allow editing without mutating the store
    return JSON.parse(JSON.stringify(config));
  }

  /**
   * Update a single field in a specific section (modules, reports, etc.)
   * sectionKey: 'modules' | 'reports' | 'options' | 'permissions' | etc.
   * platform: 'web' | 'android'
   */
  async updateField(
    fieldKey: string,
    value: boolean,
    sectionKey: keyof UserConfiguration['attributes']['webConfig'],
    platform: 'web' | 'android' = 'web',
    userId: any
  ) {
    const config = await this.getConfigurationSnapshot();
    if (!config) return;

    // Map 'web'/'android' to actual keys
    const platformKey = platform === 'web' ? 'webConfig' : 'androidConfig';

    // Ensure immutability
  const updatedConfig: UserConfiguration = {
    ...config,
    attributes: {
      ...config.attributes,
      [platformKey]: {
        ...config.attributes[platformKey],
        [sectionKey]: {
          ...config.attributes[platformKey][sectionKey],
          [fieldKey]: value
        }
      }
    }
  };

    // Update store immediately
    this.store.dispatch(updateUserConfiguration({ configuration: updatedConfig }));

    // Save to backend
    this.saveConfiguration(updatedConfig, userId);
  }

  /** Save updated configuration to backend API */
  async saveConfiguration(config: UserConfiguration, userId: any) {
    try {
      // API expects attributes as string
      const payload = { fkUserId : userId, id:config?.id, attributes: JSON.stringify(config.attributes) };
      console.log(payload,'payload');
      
      await this.userService.updateUserConfiguration(payload);
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration', error);
    }
  }
}
