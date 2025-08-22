export interface MenuAction {
  command?: (item: MenuItem) => void;
  url?: string;
}

export interface MenuItem {
  label: string;
  icon?: string;
  items?: MenuItem[];
  command?: (item: MenuItem) => void;
  url?: string;
  disabled?: boolean;
  visible?: boolean;
  styleClass?: string;
  actionType?: string; // Custom property to identify action type
  actionKey?: string;  // Custom property to identify which action this is
}

export interface MenuConfig {
  [key: string]: {
    label: string;
    icon: string;
    hasSubItems?: boolean;
    enabledLabel?: string;
    disabledLabel?: string;
    actionType?: 'command' | 'navigation' | 'toggle';
  };
}


import { Injectable } from '@angular/core';
import { selectWebConfigActions } from '../../store/user-configuration/selectors';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class VehicleDetailsMenuBuilderService {

  // Configuration for each menu action
  private readonly menuConfig: MenuConfig = {
    // Actions with enable/disable sub-items
    immobilizer: {
      label: 'Immobilizer',
      icon: 'pi pi-lock',
      hasSubItems: true,
      enabledLabel: 'Enable',
      disabledLabel: 'Disable',
      actionType: 'toggle'
    },
    elocking: {
      label: 'E-Locking',
      icon: 'pi pi-key',
      hasSubItems: true,
      enabledLabel: 'Lock',
      disabledLabel: 'Unlock',
      actionType: 'toggle'
    },
    wheelLock: {
      label: 'Wheel Lock',
      icon: 'pi pi-stop-circle',
      hasSubItems: true,
      enabledLabel: 'Lock Wheel',
      disabledLabel: 'Unlock Wheel',
      actionType: 'toggle'
    },
    perWheelLock: {
      label: 'Per Wheel Lock',
      icon: 'pi pi-stop',
      hasSubItems: true,
      enabledLabel: 'Lock All Wheels',
      disabledLabel: 'Unlock All Wheels',
      actionType: 'toggle'
    },
    bootLock: {
      label: 'Boot Lock',
      icon: 'pi pi-box',
      hasSubItems: true,
      enabledLabel: 'Lock Boot',
      disabledLabel: 'Unlock Boot',
      actionType: 'toggle'
    },
    padlocking: {
      label: 'Padlocking',
      icon: 'pi pi-lock-open',
      hasSubItems: true,
      enabledLabel: 'Enable Padlock',
      disabledLabel: 'Disable Padlock',
      actionType: 'toggle'
    },
    parking: {
      label: 'Parking Mode',
      icon: 'pi pi-pause',
      hasSubItems: true,
      enabledLabel: 'Enable Parking',
      disabledLabel: 'Disable Parking',
      actionType: 'toggle'
    },
    setOverSpeed: {
      label: 'Over Speed',
      icon: 'pi pi-exclamation-triangle',
      hasSubItems: true,
      enabledLabel: 'Set Speed Limit',
      disabledLabel: 'Remove Speed Limit',
      actionType: 'toggle'
    },

    // Simple command actions
    cctv: {
      label: 'CCTV',
      icon: 'pi pi-video',
      actionType: 'command'
    },
    dashCam: {
      label: 'Dash Cam',
      icon: 'pi pi-camera',
      actionType: 'command'
    },
    historyReplay: {
      label: 'History Replay',
      icon: 'pi pi-history',
      actionType: 'command'
    },

    // Navigation actions
    trackingLink: {
      label: 'Live Tracking',
      icon: 'pi pi-map-marker',
      actionType: 'navigation'
    },
    navigateToGoogle: {
      label: 'Google Maps',
      icon: 'pi pi-map',
      actionType: 'navigation'
    }
  };

  constructor(private store: Store) {}

  /**
   * Builds menu items based on webConfig actions
   * @param commandCallback - Callback function for command actions
   * @param navigationCallback - Callback function for navigation actions
   * @returns Observable of MenuItem array
   */
  buildMenuItems(
    commandCallback?: (actionKey: string, actionType: string, item?: MenuItem) => void,
    navigationCallback?: (actionKey: string, url?: string) => void
  ): Observable<MenuItem[]> {
    
    return this.store.select(selectWebConfigActions).pipe(
      map(actions => {
        if (!actions) return [];

        const menuItems: MenuItem[] = [];

        // Group actions by category
        const toggleActions: MenuItem[] = [];
        const commandActions: MenuItem[] = [];
        const navigationActions: MenuItem[] = [];

        Object.entries(actions).forEach(([actionKey, isEnabled]) => {
          if (!isEnabled) return; // Skip disabled actions

          const config = this.menuConfig[actionKey];
          if (!config) return; // Skip if no config found

          const baseItem: MenuItem = {
            label: config.label,
            icon: config.icon,
            actionKey,
            actionType: config.actionType
          };

          if (config.hasSubItems && config.actionType === 'toggle') {
            // Create sub-items for toggle actions
            baseItem.items = [
              {
                label: config.enabledLabel || 'Enable',
                icon: 'pi pi-check',
                actionKey,
                actionType: 'enable',
                command: (item) => commandCallback?.(actionKey, 'enable', item)
              },
              {
                label: config.disabledLabel || 'Disable',
                icon: 'pi pi-times',
                actionKey,
                actionType: 'disable',
                command: (item) => commandCallback?.(actionKey, 'disable', item)
              }
            ];
            toggleActions.push(baseItem);
          } else if (config.actionType === 'command') {
            // Simple command actions
            baseItem.command = (item) => commandCallback?.(actionKey, 'command', item);
            commandActions.push(baseItem);
          } else if (config.actionType === 'navigation') {
            // Navigation actions
            baseItem.command = (item) => navigationCallback?.(actionKey);
            navigationActions.push(baseItem);
          }
        });

        // Build the final menu structure
        if (toggleActions.length > 0) {
          menuItems.push({
            label: 'Vehicle Controls',
            icon: 'pi pi-cog',
            items: toggleActions
          });
        }

        if (commandActions.length > 0) {
          menuItems.push({
            label: 'Media & Monitoring',
            icon: 'pi pi-video',
            items: commandActions
          });
        }

        if (navigationActions.length > 0) {
          menuItems.push({
            label: 'Navigation & Tracking',
            icon: 'pi pi-map',
            items: navigationActions
          });
        }

        return menuItems;
      })
    );
  }

  /**
   * Builds a flat menu structure (no categories)
   */
  buildFlatMenuItems(
    commandCallback?: (actionKey: string, actionType: string, item?: MenuItem) => void,
    navigationCallback?: (actionKey: string) => void
  ): Observable<MenuItem[]> {
    
    return this.store.select(selectWebConfigActions).pipe(
      map(actions => {
        if (!actions) return [];

        const menuItems: MenuItem[] = [];

        Object.entries(actions).forEach(([actionKey, isEnabled]) => {
          if (!isEnabled) return;

          const config = this.menuConfig[actionKey];
          if (!config) return;

          const baseItem: MenuItem = {
            label: config.label,
            icon: config.icon,
            actionKey,
            actionType: config.actionType
          };

          if (config.hasSubItems && config.actionType === 'toggle') {
            baseItem.items = [
              {
                label: config.enabledLabel || 'Enable',
                icon: 'pi pi-check',
                actionKey,
                actionType: 'enable',
                command: (item) => commandCallback?.(actionKey, 'enable', item)
              },
              {
                label: config.disabledLabel || 'Disable',
                icon: 'pi pi-times',
                actionKey,
                actionType: 'disable',
                command: (item) => commandCallback?.(actionKey, 'disable', item)
              }
            ];
          } else if (config.actionType === 'command') {
            baseItem.command = (item) => commandCallback?.(actionKey, 'command', item);
          } else if (config.actionType === 'navigation') {
            baseItem.command = (item) => navigationCallback?.(actionKey);
          }

          menuItems.push(baseItem);
        });

        return menuItems;
      })
    );
  }

  /**
   * Get configuration for a specific action
   */
  getActionConfig(actionKey: string) {
    return this.menuConfig[actionKey];
  }

  /**
   * Update menu configuration (useful for customization)
   */
  updateMenuConfig(actionKey: string, config: Partial<MenuConfig[string]>) {
    if (this.menuConfig[actionKey]) {
      this.menuConfig[actionKey] = { ...this.menuConfig[actionKey], ...config };
    }
  }
}
