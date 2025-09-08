export const reportViewOptions = [
    { label: 'Map View', value: 'map', icon: 'pi pi-map' },
    { label: 'Table View', value: 'table', icon: 'pi pi-list' }
]

export const availableReports = [
    {
        id: "positionReport",
        reportName: "Position",
        filters: {
            vehicle: { show: true, multiSelection: { enabled: true, maxSelection: 7 } },
            date: { show: true, disableFutureDate: true },
        },
        api: { endpoints: ['v1/history', 'reports/StopReport'], multiRequest: false },
        type: 'historyReplay',
        selectedView: 'map',
        table: {
            columns: [
                { field: 'serverTime', header: 'Server Time' },
                { field: 'timestamp', header: 'Device Time' },
                { field: 'latitude', header: 'Latitude' },
                { field: 'longitude', header: 'Longitude' }
            ],
            title: 'Posiitons',
            globalFilterFields: [],
            dataKey: 'id'
        },
        formFields: {
            formTitle: '',
            columns: 1,
            isEditMode: true,
            saveButtonText: 'Query',
            showCancelButton: false,
            fields: [
                {
                    key: 'vehicle',
                    label: 'Select Vehicle',
                    type: 'select',
                    placeholder: 'Select a vehicle',
                    gridCol: 2,
                    required: true,
                    options: [], // dynamic from API
                    dataSource: 'vehicles'
                },
                {
                    key: 'date',
                    label: 'Select Date',
                    type: 'date',
                    required: true,
                    placeholder: 'Select date',
                    gridCol: 2,
                    selectionMode: 'range'
                },
            ]
        }
    },
    {
        id: "tripReport",
        reportName: "Trip",
        filters: {
            vehicle: { show: true, multiSelection: { enabled: true, maxSelection: 7 } },
            date: { show: true, disableFutureDate: true },
        },
        api: { endpoint: 'TripReport', multiRequest: true },
        type: 'pointMarkers',
        selectedView: 'table',
        table: {
            columns: [
                { field: 'serverTime', header: 'Server Time' },
                { field: 'timestamp', header: 'Device Time' },
                { field: 'latitude', header: 'Latitude' },
                { field: 'longitude', header: 'Longitude' }
            ],
            title: 'Posiitons',
            globalFilterFields: [],
            dataKey: 'id'
        },
        formFields: {
            formTitle: '',
            columns: 1,
            isEditMode: true,
            saveButtonText: 'Query',
            showCancelButton: false,
            fields: [
                {
                    key: 'vehicle',
                    label: 'Select Vehicle',
                    type: 'select',
                    placeholder: 'Select a vehicle',
                    gridCol: 2,
                    required: true,
                    options: [], // dynamic from API
                    dataSource: 'vehicles'
                },
                {
                    key: 'date',
                    label: 'Select Date',
                    type: 'date',
                    required: true,
                    placeholder: 'Select date',
                    gridCol: 2,
                    selectionMode: 'range'
                },
            ]
        }
    },
    {
        id: "stopReport",
        reportName: "Stop",
        filters: {
            vehicle: { show: true, multiSelection: { enabled: true, maxSelection: 7 } },
            date: { show: true, disableFutureDate: true },
        },
        api: { endpoint: 'v1/history', multiRequest: false },
        tableColumns: [
            { field: 'serverTime', header: 'Server Time' },
            { field: 'timestamp', header: 'Device Time' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
        ],
        globalFilterFields: [],
    },
    {
        id: "idleReport",
        reportName: "Idle",
        filters: {
            vehicle: { show: true, multiSelection: { enabled: true, maxSelection: 7 } },
            date: { show: true, disableFutureDate: true },
        },
        api: { endpoint: 'v1/history', multiRequest: false },
        tableColumns: [
            { field: 'serverTime', header: 'Server Time' },
            { field: 'timestamp', header: 'Device Time' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
        ],
        globalFilterFields: [],
    },
    {
        id: "distanceReport",
        reportName: "Distance",
        filters: {
            vehicle: { show: true, multiSelection: { enabled: true, maxSelection: 7 } },
            date: { show: true, disableFutureDate: true },
        },
        api: { endpoint: 'reports/DistanceReport', multiRequest: true },
        tableColumns: [
            { field: 'serverTime', header: 'Server Time' },
            { field: 'timestamp', header: 'Device Time' },
            { field: 'latitude', header: 'Latitude' },
            { field: 'longitude', header: 'Longitude' },
        ],
        globalFilterFields: [],
    },
]