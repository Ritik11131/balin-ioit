import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LiveTrackingControl, TrackMapService } from '../../../../service/track-map.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { VehicleStatusPipe } from '../../../../../shared/pipes/vehicle-status.pipe';
import { UiService } from '../../../../../layout/service/ui.service';
import { loadVehicles, selectVehicle, stopSingleVehiclePolling } from '../../../../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-map-traking-controls',
  imports: [CommonModule, FormsModule, ButtonModule, VehicleStatusPipe, DragDropModule],
  template: `
     <div cdkDrag cdkDragHandle class="fixed bottom-6 left-1/3 transform -translate-x-1/2 control-panel rounded-xl shadow-lg border border-gray-200 bg-white" style="width: 351px; z-index: 9999">
            <div class="drag-handle bg-gray-50 text-gray-700 px-4 py-2 rounded-t-xl flex items-center justify-between cursor-move border-b border-gray-100">
                <div class="flex items-center gap-2">
                    <i class="pi pi-bars text-xs text-gray-400"></i>
                    <span class="font-medium text-sm text-gray-600">Tracking Controls</span>
                </div>
            </div>

            <div class="p-4 space-y-4">
                <div>
                    <div class="flex justify-between items-start">
                        <div class="flex items-center gap-2">
                            <span [ngClass]="trackMapService.liveTrackingControlObj | vehicleStatus" class="relative w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-110">
                                <span [ngClass]="trackMapService.liveTrackingControlObj | vehicleStatus" class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
                            </span>
                            <span class="text-sm font-semibold text-gray-800 transition-all duration-300 group-hover:text-gray-900">
                                {{ trackMapService.liveTrackingControlObj.vehicleName }}
                            </span>
                        </div>
                        <div class="flex gap-2">
                          <i class="pi pi-share cursor-pointer w-4 h-4 transition-all duration-300 
                                    hover:scale-110 active:scale-95 opacity-70 hover:opacity-100"></i>
                        
                          <i class="pi pi-history cursor-pointer w-4 h-4 transition-all duration-300 
                                    hover:scale-110 active:scale-95 opacity-70 hover:opacity-100"></i>
                        
                          <i class="pi pi-refresh cursor-pointer w-4 h-4 transition-all duration-300 
                                    hover:scale-110 active:scale-95 opacity-70 hover:opacity-100"></i>
                        </div>

                    </div>
                </div>                

                <!-- Row 3: Actions -->
                <div class="flex items-center gap-2">
                    <p-button [severity]="trackMapService.isFollowEnabled() ? 'danger' : 'secondary'" [label]="trackMapService.isFollowEnabled() ? 'Stop Following' : 'Follow Vehicle'"
                      [icon]="trackMapService.isFollowEnabled() ? 'pi pi-times' : 'pi pi-directions'" size="small"
                      (onClick)="toggleFollowVehicle()">
                    </p-button>
                    <p-button severity="contrast" label="Toggle Trail" [icon]="'pi pi-eye-slash'" (onClick)="toggleTrailVisibility()" size="small"> </p-button>
                    <p-button label="Exit Tracking" icon="pi pi-times" severity="danger" (onClick)="exitTracking()" size="small"></p-button>
                </div>
            </div>
        </div>
  `
})
export class MapTrakingControlsComponent {
  private store = inject(Store);
  private uiService = inject(UiService);
  public trackMapService = inject(TrackMapService);


  toggleFollowVehicle(): void {
    const vehicleId = this.trackMapService.getCurrentTrailVehicleId();
    if (vehicleId) {
      this.trackMapService.toggleFollow(vehicleId);
    }
  }

  toggleTrailVisibility(): void {
    const trailLayer = this.trackMapService.getVehicleTrailLayer();
    const mapInstance = this.trackMapService.getMapInstance();

    if (mapInstance.hasLayer(trailLayer)) {
      mapInstance.removeLayer(trailLayer)
    } else {
      trailLayer.addTo(mapInstance);
    }
  }

  exitTracking() {
    this.uiService.closeDrawer();
    this.trackMapService.exitFromLiveTracking();
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.store.dispatch(loadVehicles());
  }

}
