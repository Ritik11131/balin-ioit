import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../shared/constants/list-view';
import { VehicleFilterComponent } from "./vehicle-filter/vehicle-filter.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";

@Component({
    selector: 'app-vehicles',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleFilterComponent, VehicleListComponent],
    template: `
       <app-vehicle-filter />
       <app-vehicle-list />
    `,
    styles: ``
})
export class VehiclesComponent {
  filters = listViewFilters;
}
