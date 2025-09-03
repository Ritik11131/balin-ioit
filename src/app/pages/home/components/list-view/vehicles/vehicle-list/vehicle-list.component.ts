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
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { LiveTrackingControl, TrackMapService } from '../../../../../service/track-map.service';
import { VehicleDetailsMenuBuilderService } from '../../../../../service/vehicle-details-menu-builder.service';

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
  private vehcileDetailMenuService = inject(VehicleDetailsMenuBuilderService);

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

  async onActionExecuted(event: VehicleActionEvent): Promise<any> {
    switch (event.actionKey) {
      case 'immobilizer':
        await this.handleImmobilizer(event.actionType);
        break;
      case 'parking':
        await this.handleParking(event.actionType);
        break;
      case 'elocking':
        this.handleELocking(event.actionType);
        break;
      case 'historyReplay':
        this.handlePathReplay(event);
        break;
      case 'bootLock':
        await this.handleBootLock(event.actionType);
        break;
      default:
        console.log('Unhandled action:', event);
    }
  }

  private async handleBootLock(actionType: string) {
    await this.executeVehicleAction('Commands/Immobilizer', actionType, (deviceId, action) => {
      return {
        deviceId: deviceId,
        command: "*GIPL,BULOCK,$",
        commandType: 'custom',
        token: 'web'
      };
    });
  }

  private async handleImmobilizer(actionType: string) {
    await this.executeVehicleAction('Commands/Immobilizer', actionType, (deviceId, action) => {
      return {
        deviceId: deviceId,
        commandType: action === 'enable' ? 'engineResume' : 'engineStop',
        token: 'web'
      };
    });
  }

  private async handleParking(actionType: string) {
    await this.executeVehicleAction('Parking', actionType, (deviceId, action) => ({
      deviceId: deviceId,
      status: action === 'enable' ? 1 : 0
    }));
  }



  private async executeVehicleAction(
    actionKey: string,
    actionType: string,
    payloadMap: (deviceId: any, actionType: string) => any
  ) {
    const vehicle = await firstValueFrom(this.store.select(selectSelectedVehicle));
    if (!vehicle) {
      console.warn('No vehicle selected!');
      return;
    }

    const payload = payloadMap(vehicle.id, actionType); // build payload dynamically
    await this.vehcileDetailMenuService.handleCustomActionRequest(actionKey, payload);
  }

  private async handleELocking(actionType: string) {
     await this.executeVehicleAction('Parking', actionType, (deviceId, action) => ({
      deviceId: deviceId,
      status: action === 'enable' ? 1 : 0
    }));
  }

  private handlePathReplay(event: any) {
    this.trackMapService.updateLiveTrackingControlObj({} as LiveTrackingControl)
    this.uiService.closeDrawer();
    this.pathReplayService.startPathReplay(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
