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
                label: 'File',
                icon: 'pi pi-file',
            },
            {
                label: 'Edit',
                icon: 'pi pi-file-edit',
            },
            {
                separator: true
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
        ]
    },

    globalFilterFields: [],
    dataKey: 'id'
};


export const DEVICE_TABLE_CONFIG = {
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
                label: 'File',
                icon: 'pi pi-file',
            },
            {
                label: 'Edit',
                icon: 'pi pi-file-edit',
            },
            {
                separator: true
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
        ]
    },

    globalFilterFields: [],
    dataKey: 'id'
};