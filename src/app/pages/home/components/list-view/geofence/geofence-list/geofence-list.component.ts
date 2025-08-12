import { Component, inject, Input } from '@angular/core';
import { GeofenceCardComponent } from "./geofence-card/geofence-card.component";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { selectSelectedGeofence } from '../../../../../../store/geofence/geofence.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { GeofenceSkeletonCardComponent } from './geofence-skeleton-card/geofence-skeleton-card';
import { selectGeofence } from '../../../../../../store/geofence/geofence.actions';

@Component({
  selector: 'app-geofence-list',
  imports: [GeofenceCardComponent,ScrollingModule,GeofenceSkeletonCardComponent, CommonModule],
  template: `
   <!-- <div class="max-h-[calc(100vh-280px)] overflow-y-scroll scrollbar-hide mt-4">
  <div class="flex flex-col gap-4 p-2">
    @for (geofence of geofences; track geofence; let i = $index) {
      <app-geofence-card [geofence]="geofence"  [isSelected]="selectedGeofence === geofence" (cardSelected)="onGeofenceSelected($event)" />
    }
  </div>
</div> -->

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
      <app-geofence-card [geofence]="geofence"  [isSelected]="(selectedGeofence$ | async) === geofence" (cardSelected)="onGeofenceSelected($event)" />

                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>
  `,
  styles: ``
})
export class GeofenceListComponent {

  @Input() geofences: any = [];
  @Input() isLoading: any = false;

  selectedGeofence: any = null;
   private store = inject(Store);

  selectedGeofence$: Observable<any> = this.store.select(selectSelectedGeofence);

  onGeofenceSelected(geofence: any) {
    this.store.dispatch(selectGeofence({ geofence }));
  }

  trackByGeofenceId = (index: number, geofence: any) => geofence?.id ?? index;

  ngOnDestroy(): void {
    // Cleanup logic if needed
    this.selectedGeofence = null; // Clear the selected geofence reference
    console.log('GeofenceListComponent destroyed and cleaned up');
  }

}
