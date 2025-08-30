import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

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
            <div class="w-9 h-9 rounded-full flex items-center justify-center" [style.background-color]="'color-mix(in srgb, ' + (geofence.geofence.color || 'var(--primary-color)') + ' 50%, transparent)'">
                <img [src]="iconPath" alt="geofence icon" class="w-6 h-6" />
            </div>

            <!-- Right Content -->
            <div class="ml-4 flex flex-col overflow-hidden">
                <div class="text-sm font-semibold text-gray-600 truncate">
                    {{ geofence.geofence.geometryName }}
                </div>
                <div class="text-xs text-gray-500 flex justify-between items-center">
                    <span>
                        <span class="font-semibold">{{ geofence?.devices?.length }}</span> Linked Devices | 
                    </span>
                    <span class="ml-1 text-gray-400">{{geofence.type}}</span>
                </div>
            </div>
        </div>
    `,
    styles: ``
})
export class GeofenceCardComponent {
    @Input() geofence: any;
    @Input() isSelected: boolean = false;
    @Output() cardSelected = new EventEmitter<any>();

    iconPath: string = ''; // default fallback

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

    ngOnChanges(changes: SimpleChanges): void {
        try {
            const geometryType = this.geofence.type.toLowerCase();

            const iconMap: Record<string, string> = {
                polygon: 'images/home/geofence_hexagon.svg',
                point: 'images/home/geofence_circle.svg'
            };

            this.iconPath = iconMap[geometryType] || 'assets/images/home/geofence_hexagon.svg';
        } catch (err) {
            console.error('Error parsing geofence geojson:', err);
            this.iconPath = 'assets/images/home/geofence_hexagon.svg';
        }
    }

    onCardClick() {
        this.cardSelected.emit(this.geofence);
    }
}
