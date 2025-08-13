export const USER_TABLE_CONFIG = {
    title: 'Users',
    columns: [
        { field: 'userName', header: 'User Name', minWidth: '10rem' },
        { field: 'loginId', header: 'Login ID', minWidth: '10rem' },
        { field: 'email', header: 'Email', minWidth: '10rem' },
        { field: 'mobileNo', header: 'Mobile No.', minWidth: '10rem' },
        { field: 'deviceCount', header: 'Device Count', minWidth: '4rem' },

    ],
    showActionsColumn: {
        enabled: true, actions: [
             {
                label: 'Edit',
                icon: 'pi pi-user-edit',
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
            },
            {
                label: 'View Sub Users',
                icon: 'pi pi-user-plus',
            },
            {
                label: 'View Linked Devices',
                icon: 'pi pi-link',
            },
            {
                separator: true
            },
            {
                label: 'Login As Child',
                icon: 'pi pi-sign-in'
            },
        ]
    },
    globalFilterFields: [],
    dataKey: 'id'
};


export const DEVICE_TABLE_CONFIG = {
    title: 'Devices',
    columns: [
        { field: 'vehicleNo', header: 'Vehicle No', minWidth: '10rem' },
        { field: 'deviceImei', header: 'Unique ID', minWidth: '10rem' },
        { field: 'simPhoneNumber', header: 'Primary Ph. No', minWidth: '10rem' },
        { field: 'installationOn', header: 'Installation Date', minWidth: '10rem', date:true },
        { field: 'validity', subfield: 'nextRechargeDate', header: 'Validity', minWidth: '4rem', date:true },
        { field: 'lastUpdateOn', header: 'Last Updated', minWidth: '4rem', date:true },

    ],
    showActionsColumn: {
        enabled: true, actions: [
            {
                label: 'Edit',
                icon: 'pi pi-file',
            },
            {
                label: 'Delete',
                icon: 'pi pi-file-edit',
            },
            {
                label: 'View Sub Users',
                icon: 'pi pi-file-edit',
            },
            {
                label: 'Linked Devices',
                icon: 'pi pi-file-edit',
            },
            {
                separator: true
            },
            {
                label: 'Login As Child',
                icon: 'pi pi-search'
            },
        ]
    },

    globalFilterFields: [],
    dataKey: 'id'
};