import { Component, inject, Input, ViewChild } from '@angular/core';
import { GeofenceCardComponent } from "./geofence-card/geofence-card.component";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { selectSelectedGeofence } from '../../../../../../store/geofence/geofence.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { GeofenceSkeletonCardComponent } from './geofence-skeleton-card/geofence-skeleton-card';
import { selectGeofence } from '../../../../../../store/geofence/geofence.actions';
import { UiService } from '../../../../../../layout/service/ui.service';
import { GeofenceDetailsComponent } from "../geofence-details/geofence-details.component";
import { GeofenceService } from '../../../../../service/geofence.service';

@Component({
    selector: 'app-geofence-list',
    imports: [GeofenceCardComponent, ScrollingModule, GeofenceSkeletonCardComponent, CommonModule, GeofenceDetailsComponent],
    template: `

        <div class="max-h-[calc(100vh-280px)] overflow-y-scroll scrollbar-hide mt-4">
            <div class="flex flex-col">
                @if (isLoading) {
                    <!-- Show Skeleton Cards when loading -->
                    <div class="flex flex-col gap-4 px-2">
                        @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i; let j = $index) {
                            <app-geofence-skeleton-card />
                        }
                    </div>
                } @else {
                    <cdk-virtual-scroll-viewport itemSize="124" class="scrollbar-hide" style="height: calc(100vh - 280px);">
                        <div *cdkVirtualFor="let geofence of geofences; let last = last; trackBy: trackByGeofenceId" [class.mb-4]="!last" class="px-2">
                            <app-geofence-card [geofence]="geofence" [isSelected]="(selectedGeofence$ | async) === geofence" (cardSelected)="onGeofenceSelected($event)" />
                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>


         <ng-template #geofenceDetailsTemplate>
            <app-geofence-details [geofence]="selectedGeofence$ | async" [geofenceLinkedVehicles]="geofenceLinkedVehicles" />
        </ng-template>
    `,
    styles: ``
})
export class GeofenceListComponent {
    @ViewChild('geofenceDetailsTemplate') geofenceDetailsTemplate: any;
    @Input() geofences: any = [];
    @Input() isLoading: any = false;

    private store = inject(Store);
    private geofenceService = inject(GeofenceService);
    private uiService = inject(UiService);
    
    selectedGeofence$: Observable<any> = this.store.select(selectSelectedGeofence);
    geofenceLinkedVehicles = []

    async onGeofenceSelected(geofence: any): Promise<void> {
        this.store.dispatch(selectGeofence({ geofence }));
        this.geofenceLinkedVehicles = await this.geofenceService.fetchGeofenceLinkedVehicles(geofence.id) ?? [];
        this.uiService.openDrawer(this.geofenceDetailsTemplate);
    }

    trackByGeofenceId = (index: number, geofence: any) => geofence?.id ?? index;

    ngOnDestroy(): void {
        
        console.log('GeofenceListComponent destroyed and cleaned up');
    }
}
