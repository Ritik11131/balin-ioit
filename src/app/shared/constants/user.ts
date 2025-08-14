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
        type: 'cards',
        cardFields: [
            { label: 'Time Zone', key: 'timeZone' },
            { label: 'Alert Level', key: 'alertLevel', chip: true },
            { label: 'Notifications', key: 'notificationsEnabled', boolean: true },
            { label: 'Language', key: 'language' }
        ]
    }
];
