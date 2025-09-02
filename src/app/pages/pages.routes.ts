import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { DevicesComponent } from './devices/devices.component';
import { UsersComponent } from './users/users.component';
import { WhitelabelComponent } from './whitelabel/whitelabel.component';
import { ReportsComponent } from './reports/reports.component';
import { CctvCameraComponent } from './cctv-camera/cctv-camera.component';

export default [
    { path: 'users',component: UsersComponent },
    { path: 'devices',component: DevicesComponent },
    { path: 'whitelabel', component: WhitelabelComponent},
    { path: 'cctv', component: CctvCameraComponent},
    { path: 'reports', component: ReportsComponent },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
