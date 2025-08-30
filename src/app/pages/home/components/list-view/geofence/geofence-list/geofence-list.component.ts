import { loadGeofences } from './../../../../../../store/geofence/geofence.actions';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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

        <div class="max-h-[calc(100vh-280px)] overflow-y-scroll scrollbar-hide">
            <div class="flex flex-col">
                @if (isLoading) {
                    <!-- Show Skeleton Cards when loading -->
                    <div class="flex flex-col gap-4 px-2">
                        @for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; track i; let j = $index) {
                            <app-geofence-skeleton-card />
                        }
                    </div>
                } @else {
                    <cdk-virtual-scroll-viewport itemSize="20" class="scrollbar-hide" style="height: calc(100vh - 280px);">
                        <div *cdkVirtualFor="let geofence of geofences; let last = last; trackBy: trackByGeofenceId" [class.mb-4]="!last" class="px-2">
                            <app-geofence-card [geofence]="geofence" [isSelected]="(selectedGeofence$ | async)?.geofence?.id === geofence?.geofence?.id" (cardSelected)="onGeofenceSelected($event)" />
                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>


         <ng-template #geofenceDetailsTemplate>
            <app-geofence-details [geofence]="selectedGeofence$ | async" (actionExecuted)="onActionExecuted($event)" />
        </ng-template>
    `,
    styles: ``
})
export class GeofenceListComponent {
    @ViewChild('geofenceDetailsTemplate') geofenceDetailsTemplate: any;
    @Input() geofences: any = [];
    @Input() isLoading: any = false;

    @Output() editGeofenceClick = new EventEmitter<any>();

    private store = inject(Store);
    private geofenceService = inject(GeofenceService);
    private uiService = inject(UiService);

    selectedGeofence$: Observable<any> = this.store.select(selectSelectedGeofence);

    async onGeofenceSelected(geofence: any): Promise<void> {
        try {
            try {
                const response: any = await this.geofenceService.fetchGeofenceById(geofence?.geofence?.id);                                
                this.store.dispatch(selectGeofence({ geofence: response }));
            } catch (error) {
            }
            this.uiService.openDrawer(this.geofenceDetailsTemplate);
        } catch (error) {
            console.error('Error fetching geofence linked vehicles:', error);
        }
    }


    trackByGeofenceId = (index: number, geofence: any) => geofence?.id ?? index;


    onActionExecuted(event: any) {
        switch (event.actionKey) {
            case 'edit':
                this.handleGeofenceEdit();
                break;
            case 'delete':
                this.handleGeofenceDelete();
                break;
            case 'unlink':
                this.handleUnlinkGeofence(event?.data);
                break
            // Add more cases as needed
            default:
                console.log('Unhandled action:', event);
        }
    }

    handleGeofenceEdit() {
        this.editGeofenceClick.emit({actionType: 'edit'})
    }

    handleGeofenceDelete() {

    }

    async handleUnlinkGeofence(data: any): Promise<void> {
        this.uiService.toggleLoader(true);
        try {
            await this.geofenceService.unlinkVehicleFromGeofence(data);
            this.uiService.closeDrawer();
            this.store.dispatch(loadGeofences());
            this.store.dispatch(selectGeofence({ geofence: null }));
        } catch (error) {

        } finally {
            this.uiService.toggleLoader(false);
        }
    }

    ngOnDestroy(): void {
        console.log('GeofenceListComponent destroyed and cleaned up');
    }
}
