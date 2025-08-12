import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-geofence-card',
    imports: [CommonModule],
    template: `
        <div
            [ngClass]="cardClasses"
            class="w-full h-[60px] bg-white rounded-lg shadow-sm p-4 flex items-center justify-start cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
            [style.border-color]="isSelected ? 'var(--primary-color)' : 'transparent'"
            [style.opacity]="isSelected ? '0.7' : '1'"
            (click)="onCardClick()"
        >
            <div class="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--primary-color)]">
                <i class="pi pi-circle text-[16px] text-white"></i>
            </div>

            <!-- Right Content -->
            <div class="ml-4 flex flex-col overflow-hidden">
                <div class="text-sm font-semibold text-gray-600 truncate">
                    {{ geofence.geometryName }}
                </div>
                <div class="text-xs text-gray-500 truncate">{{ geofence.linkedDevices }} Linked Devices</div>
            </div>
        </div>
    `,
    styles: ``
})
export class GeofenceCardComponent {
    @Input() geofence: any;
    @Input() isSelected: boolean = false;
    @Output() cardSelected = new EventEmitter<any>();

    get cardClasses() {
        return {
            'border-2': this.isSelected,
            'border-transparent': !this.isSelected,
            relative: true,
            'overflow-hidden': true,
            'shadow-xl': this.isSelected,
            transform: true
        };
    }

    onCardClick() {        
        this.cardSelected.emit(this.geofence);
    }
}
