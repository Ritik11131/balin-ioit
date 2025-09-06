export const availableReports = [
    {
        id: "positionReport",
        reportName: "Position",
        filters: {
            vehicle: { show: true, multiSelection: {enabled: true, maxSelection:7} },
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
        id: "tripReport",
        reportName: "Trip",
        filters: {
            vehicle: { show: true, multiSelection: {enabled: true, maxSelection:7} },
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
        id: "stopReport",
        reportName: "Position",
        filters: {
            vehicle: { show: true, multiSelection: {enabled: true, maxSelection:7} },
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
            vehicle: { show: true, multiSelection: {enabled: true, maxSelection:7} },
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
            vehicle: { show: true, multiSelection: {enabled: true, maxSelection:7} },
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