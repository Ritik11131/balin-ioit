export const DEVICE_DETAILS_TABS = [
    {
        label: 'Details',
        icon: 'pi pi-user',
        key: 'details',
        type: 'cards', // cards | table
        cardFields: [
            { label: 'Vehicle No', key: 'vehicleNo' },
            { label: 'IMEI', key: 'deviceImei' },
            { label: 'Device ID', key: 'deviceId' },
            { label: 'Ph. No', key: 'simPhoneNumber' },
            { label: 'Installation On', key: 'installationOn', date: true },
        ]
    },
    {
        label: 'Linked Users',
        icon: 'pi pi-users',
        key: 'linkedUsers',
        type: 'table',
        tableConfig: {
            title: 'Linked Users',
            columns: [
                { field: 'userName', header: 'User Name', minWidth: '10rem' },
                { field: 'loginId', header: 'Login ID', minWidth: '10rem' },
                { field: 'email', header: 'Email', minWidth: '10rem' },
                { field: 'mobileNo', header: 'Mobile No.', minWidth: '10rem' },
            ],
            globalFilterFields: ['userName', 'mobileNo'],
            dataKey: 'id'
        }
    },
    {
        label: 'Configuration',
        icon: 'pi pi-cog',
        key: 'config',
        type: 'forms',
        formGroups: [
            {
                formTitle: 'Recharge Date',
                columns: 2,
                isEditMode: false,
                fields: [
                    {
                        key: 'installationOn',
                        label: 'Installation Date',
                        type: 'date',
                        required: true,
                        placeholder: 'Select installation date',
                        gridCol: 2
                    },
                ]
            },
            {
                formTitle: 'User Linking',
                columns: 2,
                isEditMode: false,
                fields: [
                    {
                        key: 'linkUser',
                        label: 'Link User',
                        type: 'select',
                        placeholder: 'Select a user',
                        required: true,
                        options: [],
                        dataSource: 'users' 
                    },
                ]
            }
        ]
    }


];
