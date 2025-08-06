import { TimeAgoPipe } from './../../../../../../../shared/pipes/time-ago.pipe';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { VehicleStatusPipe } from '../../../../../../../shared/pipes/vehicle-status.pipe';

@Component({
  selector: 'app-vehicle-card',
  imports: [CommonModule, VehicleStatusPipe,TimeAgoPipe],
  template: `
    <div [ngClass]="cardClasses"
         class="w-full h-[126px] bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group"
         [style.border-color]="isSelected ? 'var(--primary-color)' : 'transparent'"
         [style.opacity]="isSelected ? '0.7' : '1'"
         (click)="onCardClick()">
      
      <!-- Row 1: Pulse + Icons -->
      <div class="flex justify-between items-start">
        <div class="flex items-center gap-2">
          <span [ngClass]="vehicle | vehicleStatus" 
                class="relative w-2.5 h-2.5 rounded-full transition-all duration-300 group-hover:scale-110">
            <span [ngClass]="vehicle | vehicleStatus" 
                  class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
          </span>
          <span class="text-sm font-semibold text-gray-800 transition-all duration-300 group-hover:text-gray-900">
            {{ vehicle.name }}
          </span>
        </div>
        <div class="flex gap-2">
          <img src="images/home/icon_share.svg" 
               alt="Share" 
               class="w-4 h-4 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 opacity-70 hover:opacity-100" />
        </div>
      </div>

      <!-- Vehicle Name -->
      <div class="mt-1 text-sm text-gray-500 transition-all duration-300 group-hover:text-gray-600">
        GJ27-V-XXXX
      </div>

      <!-- Time Info -->
      <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
        <i class="pi pi-calendar-times w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110" ></i>
        <span>{{ vehicle.lastUpdated | timeAgo }}</span>
      </div>

      <!-- Address Info -->
      <div class="flex items-center gap-2 mt-1 text-xs text-gray-500 transition-all duration-300 group-hover:text-gray-600">
        <i class="pi pi-map-marker w-3.5 h-3.5 transition-all duration-300 group-hover:scale-110" ></i>
        <span>{{ vehicle.location }}</span>
      </div>


    </div>
  `,
  styles: ``
})
export class VehicleCardComponent {
  @Input() vehicle: any;
  @Input() isSelected: boolean = false;
  @Output() cardSelected = new EventEmitter<any>();

  get cardClasses() {
    return {
      'border-2': this.isSelected,
      'border-transparent': !this.isSelected,
      'relative': true,
      'overflow-hidden': true,
      'shadow-xl': this.isSelected,
      'transform': true
    };
  }

  onCardClick() {
    this.cardSelected.emit(this.vehicle);
  }

}