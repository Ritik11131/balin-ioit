import { Component, Input } from '@angular/core';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehicleSkeletonCardComponent } from './vehicle-skeleton-card/vehicle-skeleton-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-vehicle-list',
    imports: [VehicleCardComponent, VehicleSkeletonCardComponent, ScrollingModule],
    template: `
        <!-- Cards Wrapper Container -->
        <div class="max-h-[calc(100vh-280px)] overflow-y-scroll scrollbar-hide mt-4">
            <div class="flex flex-col">
                @if (isLoading) {
                    <!-- Show Skeleton Cards when loading -->
                    <div class="flex flex-col gap-4 px-2">
                    @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i; let j = $index) {
                        <app-vehicle-skeleton-card />
                      }
                    </div>
                } @else {
                    <cdk-virtual-scroll-viewport itemSize="124" class="scrollbar-hide" style="height: calc(100vh - 280px);">
                        <div *cdkVirtualFor="let vehicle of fetchedVehicles; let last = last; trackBy: trackByVehicleId" [class.mb-4]="!last" class="px-2">
                            <app-vehicle-card [vehicle]="vehicle" [isSelected]="selectedVehicle === vehicle" (cardSelected)="onVehicleSelected($event)" />
                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>
    `,
    styles: ``
})
export class VehicleListComponent {
    @Input() fetchedVehicles: any[] = [];
    @Input() isLoading: boolean = false;

    selectedVehicle: any = null;

    trackByVehicleId = (index: number, vehicle: any) => vehicle?.id ?? index;

    onVehicleSelected(vehicle: any) {
        this.selectedVehicle = vehicle;
        console.log(vehicle);
    }

    ngOnDestroy(): void {
        // Cleanup logic if needed
        this.selectedVehicle = null; // Clear the selected geofence reference
        console.log('VehicleListComponent destroyed and cleaned up');
    }
}
