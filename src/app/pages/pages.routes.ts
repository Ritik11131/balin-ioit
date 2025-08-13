import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { DevicesComponent } from './devices/devices.component';
import { UsersComponent } from './users/users.component';

export default [
    { path: 'users',component: UsersComponent },
    { path: 'devices',component: DevicesComponent },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' },
] as Routes;
