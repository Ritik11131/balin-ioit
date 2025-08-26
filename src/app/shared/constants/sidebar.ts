export const sidebarItems = [
  {
    name: 'Home',
    key: 'home',
    icon: 'pi pi-home',
    route: '/home',
    requiredModuleKey: 'home'
  },
  {
    name: 'Dashboard',
    key: 'dashboard',
    icon: 'pi pi-objects-column',
    route: '/dashboard',
    requiredModuleKey: 'dashboard'
  },
  {
    name: 'Devices',
    key: 'devices',
    icon: 'pi pi-microchip',
    route: '/pages/devices',
    requiredModuleKey: 'devicelist'
  },
  {
    name: 'Users',
    key: 'users',
    icon: 'pi pi-users',
    route: '/pages/users',
    requiredModuleKey: 'userlist'
  },
  {
    name:'Reports',
    key: 'reports',
    icon: 'pi pi-chart-bar',
    route: '/pages/reports',
    requiredModuleKey: 'reports'
  }

  // Add more items as needed
];