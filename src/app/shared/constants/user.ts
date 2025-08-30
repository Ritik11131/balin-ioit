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
            { label: 'Created', key: 'creationTime', date: true },
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
          { label: 'WhiteLabel', key: 'whitelabel', permissions: ['0'] },
          { label: 'Home', key: 'home', permissions: ['0','1'] },
          { label: 'Dashboard', key: 'dashboard', permissions: ['0','1'] },
          { label: 'Device List', key: 'devicelist', permissions: ['0','1'] },
          { label: 'User List', key: 'userlist', permissions: ['0','1'] },
          { label: 'Reports', key: 'reports', permissions: ['0','1'] },
          { label: 'BMS', key: 'bms', permissions: ['0','1'] },
          { label: 'ETA', key: 'eta', permissions: ['0','1'] },
          { label: 'Raw Data', key: 'rawData', permissions: ['0','1'] },
          { label: 'Subscription', key: 'subscription', permissions: ['0','1'] },
          { label: 'Notification', key: 'notification', permissions: ['0','1'] }
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
      },
       {
        label: 'Vehicle Actions',
        key: 'actions',
        description:'Enable or disable specific actions for the user',
        fields: [
          { label: 'Boot', key: 'bootLock' },
          { label: 'Wheel', key: 'wheelLock' },
          { label: 'Per Wheel', key: 'perWheelLock'},
          { label: 'Overspeed', key: 'setOverSpeed'},
          { label: 'View Device On Google Maps', key: 'navigateToGoogle'},
          { label: 'Vehicle History Playback', key: 'historyReplay' },
          { label: 'Immobilizer', key: 'immobilizer' },
          { label: 'Pad Locking', key: 'padlocking' },
          { label: 'Parking', key: 'parking' },
          { label: 'ELocking', key: 'elocking' },
          { label: 'Dash Cam', key: 'dashCam' },
          { label: 'Live Tracking Link', key: 'trackingLink' },
          { label: 'Security', key: 'security' },
          { label: 'CCTV', key: 'cctv' },
        ]
      }
    ]
  }
];

export const USER_TYPES = [
    { label: 'Admin', value: 1 },
    { label: 'Customer', value: 2 },
]
