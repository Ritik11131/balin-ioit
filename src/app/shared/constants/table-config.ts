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
                label: 'Update',
                icon: 'pi pi-user-edit',
            },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
            },
            {
                label: 'More',
                icon: 'pi pi-ellipsis-v',
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
                label: 'Update',
                icon: 'pi pi-user-edit',
            },
            {
                label: 'More',
                icon: 'pi pi-ellipsis-v',
            },
        ]
    },

    globalFilterFields: [],
    dataKey: 'id'
};