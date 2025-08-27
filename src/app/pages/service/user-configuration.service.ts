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
    async getConfigurationSnapshot(user: any): Promise<UserConfiguration | null> {
        const response = (await this.userService.fetchUserConfigurationById(user?.id))?.data;

        if (!response) return null;

        let attributes: any = response?.attributes;

        // Parse attributes if it's a string
        if (typeof attributes === 'string') {
            try {
                attributes = JSON.parse(attributes);
            } catch {
                attributes = null;
            }
        }

        // If attributes is null or not an object, initialize default platform configs
        if (!attributes || typeof attributes !== 'object') {
            attributes = {
                webConfig: {},
                androidConfig: {}
            };
        }

        const config: UserConfiguration = {
            ...response,
            attributes
        };

        // Return a deep copy to avoid mutating the store
        return JSON.parse(JSON.stringify(config));
    }

    /**
     * Update a single field in a specific section (modules, reports, etc.)
     * sectionKey: 'modules' | 'reports' | 'options' | 'permissions' | etc.
     * platform: 'web' | 'android'
     */
    async updateField(fieldKey: string, value: boolean, sectionKey: keyof UserConfiguration['attributes']['webConfig'], platform: 'web' | 'android' = 'web', childUserConfigurationObject: any, user: any) {
        const config = await this.getConfigurationSnapshot(user);
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

        console.log(updatedConfig, 'updatedConfig');

        // Update store immediately
        // this.store.dispatch(updateUserConfiguration({ configuration: updatedConfig }));

        // Save to backend
        this.saveUserConfiguration(updatedConfig, childUserConfigurationObject);
    }

    /** Save updated configuration to backend API */
    async saveUserConfiguration(config: UserConfiguration, childUserConfigurationObject: any) {
        try {
            // API expects attributes as string
            const payload = { fkUserId: childUserConfigurationObject?.fkUserId, id: childUserConfigurationObject?.id, attributes: JSON.stringify(config.attributes) };
            console.log(payload, 'payload');

            await this.userService.updateUserConfiguration(payload);
            console.log('Configuration saved successfully');
        } catch (error) {
            console.error('Failed to save configuration', error);
        }
    }
}
