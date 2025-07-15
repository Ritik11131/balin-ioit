import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { listViewFilters } from '../../../../../../shared/constants/list-view';
import { VehicleStatusPipe } from '../../../../../../shared/pipes/vehicle-status.pipe';

@Component({
  selector: 'app-vehicle-filter',
  imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule, VehicleStatusPipe],
      template: `
          <div class="w-full h-[90px] bg-transparent py-4 flex flex-col justify-between gap-4">
              <!-- Row 1: Filter Buttons -->
              <div class="flex gap-4 items-center">
                  @for (filter of filters; track filter.key) {
                      <button class="flex items-center justify-center gap-2 h-[30px] bg-[#FFFF] rounded-[4px] shadow-sm" [ngClass]="filter.width ?? 'w-[52px]'">
                          <span [ngClass]="filter | vehicleStatus" class="relative w-2.5 h-2.5 rounded-full">
                              <span [ngClass]="filter | vehicleStatus"  class="absolute top-0 left-0 w-full h-full rounded-full opacity-75 animate-ping"></span>
                          </span>
                          @if (filter.showText) {
                              <span class="text-sm font-medium">{{ filter.label }}</span>
                          }
                      </button>
                  }
              </div>
  
              <!-- Row 2: Search + Buttons -->
              <div class="flex items-center justify-between w-full">
                  <!-- Search Input -->
  
                  <p-iconfield>
                      <p-inputicon styleClass="pi pi-search" />
                      <input type="text" pInputText placeholder="Search" />
                  </p-iconfield>
  
                  <!-- Action Buttons -->
                  <div class="flex gap-2">
                      <p-button icon="pi pi-heart" outlined>
                          <ng-template #icon>
                              <img src="images/home/icon_refresh.svg" alt="Refresh" class="w-[20px] h-[20px] transition-transform duration-500 hover:animate-spin" />
                          </ng-template>
                      </p-button>
                      <p-button icon="pi pi-heart" outlined>
                          <ng-template #icon>
                              <img [src]="'images/home/icon_filter.svg'" [alt]="'Filter'" class="w-[20px] h-[20px]" />
                          </ng-template>
                      </p-button>
                  </div>
              </div>
          </div>

           <div class="flex items-center justify-between w-full">

           </div>

      `,
      styles: ``
})
export class VehicleFilterComponent {

      filters = listViewFilters;
  

}
