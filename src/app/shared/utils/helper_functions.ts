const priorityMap: Record<string, number> = {
  running: 1,
  stop: 2,
  dormant: 3,
  offline: 4
};

export const sortVehiclesByStatus = (vehicles: any[]): any[] => {
  return [...vehicles].sort((a, b) => {
    const aPriority = priorityMap[a.status?.toLowerCase()] ?? 5;
    const bPriority = priorityMap[b.status?.toLowerCase()] ?? 5;
    return aPriority - bPriority;
  });
};


export const constructVehicleData = (vehicles: any[]): any[] => {
    return vehicles.map(({ device, parking, position, validity }, index) => ({
      id: device?.id,
      name: device?.vehicleNo ,
      lastUpdated: position?.deviceTime,
      location: position?.address || 'Unknown Location',
      status: position?.status?.status.toLowerCase(),
      apiObject: {device,parking,position,validity}
    }));
}


/**
   * Builds dynamic menu items based on webConfig actions
   */
  export const buildMenuItems = (webConfig: any, commandEmitter: (action: string, subAction?: string) => void): any[] => {
    const menuItems: any[] = [];

    // Immobilizer - has Enable/Disable sub-items
    if (webConfig.actions.immobilizer) {
      menuItems.push({
        label: 'Immobilize / Mobilize',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Immobilize',
            icon: 'pi pi-plus',
            command: () => commandEmitter('immobilizer', 'enable')
          },
          {
            label: 'Mobilize',
            icon: 'pi pi-folder-open',
            command: () => commandEmitter('immobilizer', 'disable')
          }
        ]
      });
    }

    // Wheel Lock - has Lock/Unlock sub-items
    if (webConfig.actions.wheelLock) {
      menuItems.push({
        label: 'Wheel Lock',
        icon: 'pi pi-lock',
        items: [
          {
            label: 'Lock Wheel',
            icon: 'pi pi-lock',
            command: () => commandEmitter('wheelLock', 'enable')
          },
          {
            label: 'Unlock Wheel',
            icon: 'pi pi-unlock',
            command: () => commandEmitter('wheelLock', 'disable')
          }
        ]
      });
    }

    // Per Wheel Lock - has Lock/Unlock sub-items
    if (webConfig.actions.perWheelLock) {
      menuItems.push({
        label: 'Per Wheel Lock',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Lock Per Wheel',
            icon: 'pi pi-lock',
            command: () => commandEmitter('perWheelLock', 'enable')
          },
          {
            label: 'Unlock Per Wheel',
            icon: 'pi pi-unlock',
            command: () => commandEmitter('perWheelLock', 'disable')
          }
        ]
      });
    }

    // Electronic Locking - has Lock/Unlock sub-items
    if (webConfig.actions.elocking) {
      menuItems.push({
        label: 'Electronic Lock',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'Enable E-Lock',
            icon: 'pi pi-lock',
            command: () => commandEmitter('elocking', 'enable')
          },
          {
            label: 'Disable E-Lock',
            icon: 'pi pi-unlock',
            command: () => commandEmitter('elocking', 'disable')
          }
        ]
      });
    }

    // Security - has Enable/Disable sub-items
    if (webConfig.actions.security) {
      menuItems.push({
        label: 'Security',
        icon: 'pi pi-eye',
        items: [
          {
            label: 'Enable Security',
            icon: 'pi pi-check',
            command: () => commandEmitter('security', 'enable')
          },
          {
            label: 'Disable Security',
            icon: 'pi pi-times',
            command: () => commandEmitter('security', 'disable')
          }
        ]
      });
    }

    // Parking - has Enable/Disable sub-items
    if (webConfig.actions.parking) {
      menuItems.push({
        label: 'Parking',
        icon: 'pi pi-car',
        items: [
          {
            label: 'Enable Parking',
            icon: 'pi pi-check',
            command: () => commandEmitter('parking', 'enable')
          },
          {
            label: 'Disable Parking',
            icon: 'pi pi-times',
            command: () => commandEmitter('parking', 'disable')
          }
        ]
      });
    }

    // Padlocking - has Lock/Unlock sub-items
    if (webConfig.actions.padlocking) {
      menuItems.push({
        label: 'Padlock',
        icon: 'pi pi-key',
        items: [
          {
            label: 'Enable Padlock',
            icon: 'pi pi-lock',
            command: () => commandEmitter('padlocking', 'enable')
          },
          {
            label: 'Disable Padlock',
            icon: 'pi pi-unlock',
            command: () => commandEmitter('padlocking', 'disable')
          }
        ]
      });
    }

    // Boot Lock - only unlock action
    if (webConfig.actions.bootLock) {
      menuItems.push({
        label: 'Boot Unlock',
        icon: 'pi pi-folder-open',
        command: () => commandEmitter('bootLock', 'unlock')
      });
    }

    // CCTV - has Enable/Disable sub-items
    if (webConfig.actions.cctv) {
      menuItems.push({
        label: 'CCTV',
        icon: 'pi pi-video',
        items: [
          {
            label: 'Enable CCTV',
            icon: 'pi pi-play',
            command: () => commandEmitter('cctv', 'enable')
          },
          {
            label: 'Disable CCTV',
            icon: 'pi pi-stop',
            command: () => commandEmitter('cctv', 'disable')
          }
        ]
      });
    }

    // Dash Cam - has Enable/Disable sub-items
    if (webConfig.actions.dashCam) {
      menuItems.push({
        label: 'Dash Cam',
        icon: 'pi pi-camera',
        items: [
          {
            label: 'Enable Dash Cam',
            icon: 'pi pi-play',
            command: () => commandEmitter('dashCam', 'enable')
          },
          {
            label: 'Disable Dash Cam',
            icon: 'pi pi-stop',
            command: () => commandEmitter('dashCam', 'disable')
          }
        ]
      });
    }

    // Set Over Speed - direct command
    if (webConfig.actions.setOverSpeed) {
      menuItems.push({
        label: 'Set Over Speed',
        icon: 'pi pi-exclamation-triangle',
        command: () => commandEmitter('setOverSpeed')
      });
    }

    // Add separator before navigation items
    if (webConfig.actions.trackingLink || webConfig.actions.historyReplay || webConfig.actions.navigateToGoogle) {
      menuItems.push({ separator: true });
    }

    // Tracking Link - direct command
    if (webConfig.actions.trackingLink) {
      menuItems.push({
        label: 'Tracking Link',
        icon: 'pi pi-link',
        command: () => commandEmitter('trackingLink')
      });
    }

    // History Replay - direct command
    if (webConfig.actions.historyReplay) {
      menuItems.push({
        label: 'History Replay',
        icon: 'pi pi-replay',
        command: () => commandEmitter('historyReplay')
      });
    }

    // Navigate to Google - direct command
    if (webConfig.actions.navigateToGoogle) {
      menuItems.push({
        label: 'Navigate to Google',
        icon: 'pi pi-map',
        command: () => commandEmitter('navigateToGoogle')
      });
    }

    return menuItems;
  }
