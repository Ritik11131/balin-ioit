export const USER_DETAILS_TABS = [
    {
        label: 'Details',
        icon: 'pi pi-user',
        key: 'details',
        type: 'cards', // cards | table
        cardFields: [
            { label: 'User Name', key: 'userName' },
            { label: 'Login ID', key: 'loginId' },
            { label: 'Email', key: 'email' },
            { label: 'Mobile No.', key: 'mobileNo' },
            { label: 'Role', key: 'role', chip: true },
            { label: 'Created', key: 'createdAt', date: true },
        ]
    },
    {
        label: 'Sub Users',
        icon: 'pi pi-users',
        key: 'subUsers',
        type: 'table',
        tableConfig: {
            title: 'Sub Users',
            columns: [
                { field: 'userName', header: 'User Name', minWidth: '10rem' },
                { field: 'loginId', header: 'Login ID', minWidth: '10rem' },
                { field: 'email', header: 'Email', minWidth: '10rem' },
                { field: 'mobileNo', header: 'Mobile No.', minWidth: '10rem' },
                { field: 'deviceCount', header: 'Device Count', minWidth: '4rem' },
            ],
            globalFilterFields: ['userName','mobileNo'],
            dataKey: 'id'
        }
    },
    {
        label: 'Linked Devices',
        icon: 'pi pi-link',
        key: 'linkedDevices',
        type: 'table',
        tableConfig: {
            title: 'Linked Devices',
            columns: [
                { field: 'vehicleNo', header: 'Vehicle No', minWidth: '10rem' },
                { field: 'deviceImei', header: 'Unique ID', minWidth: '10rem' },
                { field: 'simPhoneNumber', header: 'Primary Ph. No', minWidth: '10rem' },
                { field: 'installationOn', header: 'Installation Date', minWidth: '10rem', date: true },
                { field: 'validity', subfield: 'nextRechargeDate', header: 'Validity', minWidth: '4rem', date: true },
                { field: 'lastUpdateOn', header: 'Last Updated', minWidth: '4rem', date: true },
            ],
            globalFilterFields: ['vehicleNo','deviceImei'],
            dataKey: 'id'
        }
    },
    {
    label: 'Configuration',
    icon: 'pi pi-cog',
    key: 'config',
    type: 'config',
    configSections: [
      {
        label: 'Modules',
        description:'Enable or disable specific modules for the user',
        key: 'modules',
        fields: [
          { label: 'Home', key: 'home' },
          { label: 'Dashboard', key: 'dashboard' },
          { label: 'Device List', key: 'devicelist' },
          { label: 'User List', key: 'userlist' },
          { label: 'Reports', key: 'reports' },
          { label: 'BMS', key: 'bms' },
          { label: 'ETA', key: 'eta' },
          { label: 'Raw Data', key: 'rawData' },
          { label: 'Subscription', key: 'subscription' },
          { label: 'Notification', key: 'notification' }
        ]
      },
      {
        label: 'Reports',
        key: 'reports',
        description:'Enable or disable specific reports for the user',
        fields: [
          { label: 'Trip Report', key: 'tripReport' },
          { label: 'Idle Report', key: 'idleReport' },
          { label: 'Alert Report', key: 'alertReport' },
          { label: 'Fuel Report', key: 'fuelReport' }
        ]
      }
    ]
  }
];
