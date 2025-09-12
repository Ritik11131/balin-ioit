import { TimeAgoPipe } from './../../../../../../../shared/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { VehicleStatusPipe } from '../../../../../../../shared/pipes/vehicle-status.pipe';
import { EV_VEHICLES, STREAM_PROTOCOLS } from '../../../../../../../shared/utils/helper_functions';

@Component({
    selector: 'app-vehicle-card',
    imports: [CommonModule, VehicleStatusPipe, TimeAgoPipe],
    template: `
        <div
            [ngClass]="{
                'border-2': isSelected,
                'border-transparent': !isSelected,
                relative: true,
                'overflow-hidden': true,
                'shadow-xl': isSelected,
                transform: true,
                'h-[126px]': !isSelected,
                'h-[150px]': isSelected,
                'transition-all duration-500 ease-in-out': true
            }"
            class="w-full bg-white rounded-lg flex flex-col justify-between cursor-pointer group"
            [style.border-color]="isSelected ? 'var(--primary-color)' : 'transparent'"
            [style.opacity]="isSelected ? '0.7' : '1'"
            (click)="onCardClick()"
        >
            <div class="p-4">
                <!-- Row 1: Pulse + Icons -->
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-2">
                        <span [ngClass]="vehicle | vehicleStatus" class="relative w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-110">
                            <span [ngClass]="vehicle | vehicleStatus" class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
                        </span>
                        <span class="text-sm font-semibold text-gray-800 transition-all duration-300 group-hover:text-gray-900">
                            {{ vehicle.name }}
                        </span>
                    </div>
                    <div class="flex gap-2">
                        @if (EV_VEHICLES.includes(vehicle.apiObject?.device?.vehicleType)) {
                            <i class="pi pi pi-bolt text-green-500"></i>
                        }
                        @if (STREAM_PROTOCOLS[vehicle.apiObject?.position?.protocol]) {
                            <i class="pi pi pi-video text-red-500 animate-pulse"></i>
                        } @else {
                            <i class="pi pi-exclamation-circle text-yellow-500"></i>
                        }
                    </div>
                </div>

                <!-- Vehicle Name -->
                <div class="mt-1 mb-4 text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-600">GJ27-V-XXXX</div>

                <!-- Time Info -->
                <div class="flex items-center gap-2 mb-3 text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
                    <i class="pi pi-calendar-times w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110"></i>
                    <span>{{ vehicle.lastUpdated | timeAgo }}</span>
                </div>

                <!-- Address Info -->
                <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
                    <i class="pi pi-map-marker w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110"></i>
                    <span class="truncate max-w-[200px]" title="{{ vehicle.location }}">
                        {{ vehicle.location }}
                    </span>
                </div>
            </div>

            <!-- Expandable Animated Panel (pushes siblings down) -->
            @if (isSelected) {
                <div class="flex flex-1 items-center justify-center bg-primary/10 transition-all duration-500">
                    <i class="pi pi-gauge text-primary text-xl mr-2"></i>
                    <span class="text-primary font-bold text-md">{{ vehicle?.apiObject?.position?.speed || 0}} km/h</span>
                </div>
            }
        </div>
    `,
    styles: ``
})
export class VehicleCardComponent {
    @Input() vehicle: any;
    @Input() isSelected: boolean = false;
    @Output() cardSelected = new EventEmitter<any>();

    STREAM_PROTOCOLS = STREAM_PROTOCOLS;
    EV_VEHICLES = EV_VEHICLES;

    onCardClick() {
        this.cardSelected.emit(this.vehicle);
    }
}
