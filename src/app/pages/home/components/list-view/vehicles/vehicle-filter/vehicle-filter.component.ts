import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../../shared/constants/list-view';
import { VehicleStatusPipe } from '../../../../../../shared/pipes/vehicle-status.pipe';
import { VehicleStatusLabelPipe } from './../../../../../../shared/pipes/vehicle-status-label.pipe';

@Component({
    selector: 'app-vehicle-filter',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleStatusPipe, VehicleStatusLabelPipe],
    template: `
        <div class="w-full h-[90px] bg-transparent py-4 flex flex-col justify-between gap-4">
            <!-- Row 1: Filter Buttons -->
            <div class="flex gap-2 items-center transition-all duration-300">
                @for (filter of filters; track filter.key) {
                    <button
                        (click)="handleListMapFilter(filter)"
                        class="flex items-center justify-center gap-2 h-[34px] rounded-md shadow-sm px-2 overflow-hidden transition-all duration-300 ease-in-out"
                       [ngClass]="[ 
                        activeFilterKey === filter.key  ? 'bg-[var(--primary-bg-10)] w-[120px]'  : 'border border-[transparent] w-[34px]']"
                    >
                        <!-- Dot indicator -->
                        <span [ngClass]="filter | vehicleStatus" class="relative w-2.5 h-2.5 rounded-full transition-colors">
                            <span [ngClass]="filter | vehicleStatus" class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
                        </span>

                        <!-- Status Label only on active -->
                        <span *ngIf="activeFilterKey === filter.key" class="text-sm font-semibold whitespace-nowrap text-gray-800 transition-opacity duration-300">
                            {{ filter.status | vehicleStatusLabel }}
                        </span>
                    </button>
                }
            </div>

            <!-- Row 2: Search + Buttons -->
            <div class="flex items-center justify-between w-full">
                <!-- Search Input -->

                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input type="text" pInputText placeholder="Search" (input)="handleVehicleSearch($event)" />
                </p-iconfield>

                <!-- Action Buttons -->
                <div class="flex gap-2">
                    <p-button outlined (onClick)="handleRefreshVehicles()">
                        <ng-template #icon>
                            <img [ngClass]="{ 'animate-spin': isLoading }" src="images/home/icon_refresh.svg" alt="Refresh" class="w-[20px] h-[20px] transition-transform duration-500" />
                        </ng-template>
                    </p-button>
                    <p-button outlined>
                        <ng-template #icon>
                            <img [src]="'images/home/icon_filter.svg'" [alt]="'Filter'" class="w-[20px] h-[20px]" />
                        </ng-template>
                    </p-button>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between w-full"></div>
    `,
    styles: ``
})
export class VehicleFilterComponent {
    filters = listViewFilters;

    @Input() isLoading: any = false;
    @Input() activeFilterKey: string = 'all'

    @Output() filterSelected = new EventEmitter<any>();
    @Output() refreshVehicles = new EventEmitter<any>();
    @Output() searchTerm = new EventEmitter<any>();

    handleListMapFilter(selectedFilter: any) {
        this.filterSelected.emit(selectedFilter);
    }

    handleVehicleSearch(event: any) {
        this.searchTerm.emit({ key: 'search', value: event.target.value.toLowerCase() });
    }

    handleRefreshVehicles() {
        this.refreshVehicles.emit({key :'refresh', value: true});
    }
}
