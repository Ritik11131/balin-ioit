import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VehicleStatusPipe } from '../../../../../../../shared/pipes/vehicle-status.pipe';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, VehicleStatusPipe],
  template: `
    <div class="w-full h-[126px] bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between">
        <!-- Row 1: Pulse + Icons -->
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2">
            <span [ngClass]="vehicle | vehicleStatus" class="relative w-2.5 h-2.5 rounded-full">
              <span [ngClass]="vehicle | vehicleStatus" class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
            </span>
             <span class="text-sm font-semibold text-gray-800">{{ vehicle.name }}</span>
          </div>
          <div class="flex gap-2">
            <img src="images/home/icon_share.svg" alt="Share" class="w-4 h-4 cursor-pointer" />
          </div>
        </div>

        <!-- Vehicle Name -->
        <div class="mt-1 text-sm text-gray-500">
GJ27-V-XXXX
        </div>

        <!-- Time Info -->
        <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <img src="assets/icon_time.svg" alt="Time" class="w-3.5 h-3.5" />
          <span>{{ vehicle.lastUpdated }}</span>
        </div>

        <!-- Address Info -->
        <div class="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <img src="assets/icon_pin.svg" alt="Location" class="w-3.5 h-3.5" />
          <span>{{ vehicle.location }}</span>
        </div>
      </div>
  `,
  styles: ``
})
export class VehicleCardComponent {
  @Input() vehicle: any;

}
