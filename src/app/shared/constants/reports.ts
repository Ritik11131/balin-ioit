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
        api: { endpoint: 'v1/history', multiRequest: false },
        type: 'historyReplay',
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
    },
    {
        id: "stopReport",
        reportName: "Position",
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