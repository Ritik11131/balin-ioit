import { Component, inject, Input, ViewChild } from '@angular/core';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehicleSkeletonCardComponent } from './vehicle-skeleton-card/vehicle-skeleton-card.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { selectVehicle } from '../../../../../../store/vehicle/vehicle.actions';
import { selectSelectedVehicle } from '../../../../../../store/vehicle/vehicle.selectors';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../../../../layout/service/ui.service';
import { CdkDragPlaceholder } from "@angular/cdk/drag-drop";
import { VehicleDetailsComponent } from "../vehicle-details/vehicle-details.component";

@Component({
    selector: 'app-vehicle-list',
    imports: [CommonModule, VehicleCardComponent, VehicleSkeletonCardComponent, ScrollingModule, CdkDragPlaceholder, VehicleDetailsComponent],
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
                            <app-vehicle-card [vehicle]="vehicle" [isSelected]="(selectedVehicle$ | async) === vehicle" (cardSelected)="onVehicleSelected($event)" />
                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>

        <ng-template #vehicleDetailsTemplate>
            <app-vehicle-details [vehicle]="selectedVehicle$ | async"/>
        </ng-template>

    `,
    styles: ``
})
export class VehicleListComponent {

    @ViewChild('vehicleDetailsTemplate') vehicleDetailsTemplate: any;

    @Input() fetchedVehicles: any = [];
    @Input() isLoading: any = false;

    private store = inject(Store);
    private uiService = inject(UiService);
    selectedVehicle$ = this.store.select(selectSelectedVehicle);

    trackByVehicleId = (index: number, vehicle: any) => vehicle?.id ?? index;

    onVehicleSelected(vehicle: any) {
        console.log(vehicle);
        this.store.dispatch(selectVehicle({ vehicle }));
        this.uiService.openDrawer(this.vehicleDetailsTemplate, 'Approve Rtd');

    }

    ngOnDestroy(): void {
        // Cleanup logic if needed
        console.log('VehicleListComponent destroyed and cleaned up');
    }
}
