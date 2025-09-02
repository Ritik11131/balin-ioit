export const DEVICE_DETAILS_TABS = [
    {
        label: 'Details',
        icon: 'pi pi-user',
        key: 'details',
        type: 'cards',
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
                        gridCol: 2,
                        selectionMode:'single'
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
            },
              {
                formTitle: 'Plan Linking',
                columns: 2,
                isEditMode: false,
                fields: [
                    {
                        key: 'planLink',
                        label: 'Link Plan',
                        type: 'select',
                        placeholder: 'Select a Plan',
                        required: true,
                        options: [],
                        dataSource: 'plans' 
                    },
                ]
            },
             {
                formTitle: 'Send Command',
                columns: 2,
                isEditMode: false,
                fields: [
                    {
                        key: 'sendCommand',
                        label: 'Send Command',
                        type: 'text',
                        placeholder: 'e.g. Stop Device',
                        required: true,
                    },
                ]
            }
        ]
    }
];
