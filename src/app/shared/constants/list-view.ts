import { GeofenceComponent } from "../../pages/home/components/list-view/geofence/geofence.component";
import { PoiComponent } from "../../pages/home/components/list-view/poi/poi.component";
import { VehiclesComponent } from "../../pages/home/components/list-view/vehicles/vehicles.component";

export const listViewTabs = [
        { value: 0, title: 'Vehicles', key: 'vehicles', component: VehiclesComponent },
        { value: 1, title: 'Geofence', key: 'geofence', component: GeofenceComponent },
        { value: 2, title: 'POI', key: 'poi', component: PoiComponent }
    ];

export const listViewFilters = [
    { key: 'all', label: 'ALL', status: 'all', width: 'w-[82px]', showText: true },
    { key: 'stop', status: 'stop' },
    { key: 'idle', status: 'idle' },
    { key: 'offline', status: 'offline' },
    { key: 'running', status: 'running' }
];