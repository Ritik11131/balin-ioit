import { Component, inject, Input, ViewChild } from '@angular/core';
import { VehicleCardComponent } from './vehicle-card/vehicle-card.component';
import { VehicleSkeletonCardComponent } from './vehicle-skeleton-card/vehicle-skeleton-card.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Store } from '@ngrx/store';
import { selectVehicle, startSingleVehiclePolling, stopSingleVehiclePolling } from '../../../../../../store/vehicle/vehicle.actions';
import { selectSelectedVehicle } from '../../../../../../store/vehicle/vehicle.selectors';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../../../../layout/service/ui.service';
import { VehicleActionEvent, VehicleDetailsComponent } from "../vehicle-details/vehicle-details.component";
import { PathReplayService } from '../../../../../service/path-replay.service';
import { Subject, takeUntil } from 'rxjs';
import { LiveTrackingControl, TrackMapService } from '../../../../../service/track-map.service';

@Component({
  selector: 'app-vehicle-list',
  imports: [CommonModule, VehicleCardComponent, VehicleSkeletonCardComponent, ScrollingModule, VehicleDetailsComponent],
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
                    <cdk-virtual-scroll-viewport itemSize="124" class="scrollbar-hide scroll-smooth" style="height: calc(100vh - 280px);">
                        <div *cdkVirtualFor="let vehicle of fetchedVehicles; let last = last; trackBy: trackByVehicleId" [class.mb-4]="!last" class="px-2">
                            <app-vehicle-card [vehicle]="vehicle" [isSelected]="(selectedVehicle$ | async)?.id === vehicle?.id" (cardSelected)="onVehicleSelected($event)" />
                        </div>
                    </cdk-virtual-scroll-viewport>
                }
            </div>
        </div>

        <ng-template #vehicleDetailsTemplate>
            <app-vehicle-details [vehicle]="selectedVehicle$ | async" (actionExecuted)="onActionExecuted($event)"/>
        </ng-template>

    `,
  styles: ``
})
export class VehicleListComponent {

  @ViewChild('vehicleDetailsTemplate') vehicleDetailsTemplate: any;
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  @Input() fetchedVehicles: any = [];
  @Input() isLoading: any = false;

  private destroy$ = new Subject<void>();
  private store = inject(Store);
  private uiService = inject(UiService);
  private pathReplayService = inject(PathReplayService);
  public trackMapService = inject(TrackMapService);
  
  selectedVehicle$ = this.store.select(selectSelectedVehicle);



  ngAfterViewInit() {
    this.selectedVehicle$.pipe(takeUntil(this.destroy$)).subscribe(selected => {
      if (selected && this.viewport) {
        const index = this.fetchedVehicles.findIndex((v: any) => v.id === selected.id);
        if (index > -1) {
          this.viewport.scrollToIndex(index, 'smooth');
        }
      }
    });
  }

  trackByVehicleId = (index: number, vehicle: any) => vehicle?.id ?? index;

  onVehicleSelected(vehicle: any) {
    this.store.dispatch(selectVehicle({ vehicle }));
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(startSingleVehiclePolling({ vehicleId: vehicle.id }));
    this.uiService.openDrawer(this.vehicleDetailsTemplate);
  }

  onActionExecuted(event: VehicleActionEvent) {
    switch (event.actionKey) {
      case 'immobilizer':
        this.handleImmobilizer(event.actionType);
        break;
      case 'dashCam':
        this.openDashCam();
        break;
      case 'trackingLink':
        this.openLiveTracking();
        break;
      case 'elocking':
        this.handleELocking(event.actionType);
        break;
      case 'historyReplay':
        this.handlePathReplay(event);
        break;
      // Add more cases as needed
      default:
        console.log('Unhandled action:', event);
    }
  }

  private handleImmobilizer(actionType: string) {
    if (actionType === 'enable') {
      // Call API to enable immobilizer
      console.log('Enabling immobilizer...');
    } else if (actionType === 'disable') {
      // Call API to disable immobilizer
      console.log('Disabling immobilizer...');
    }
  }

  private handleELocking(actionType: string) {
    if (actionType === 'enable') {
      console.log('Locking vehicle...');
    } else if (actionType === 'disable') {
      console.log('Unlocking vehicle...');
    }
  }

  private openDashCam() {
    console.log('Opening dash cam...');
    // Navigate to dash cam or open modal
  }

  private openLiveTracking() {
    console.log('Opening live tracking...');
    // Navigate to tracking page
  }

  private handlePathReplay(event: any) {
    console.log(event);
    this.trackMapService.updateLiveTrackingControlObj({} as LiveTrackingControl)
    this.uiService.closeDrawer();
    this.pathReplayService.startPathReplay(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
