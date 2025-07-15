import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TrackMapComponent } from './components/track-map/track-map.component';
import { listViewTabs } from '../../shared/constants/list-view';
import { ListViewComponent } from './components/list-view/list-view.component';
import { GeofenceComponent } from './components/list-view/geofence/geofence.component';
import { PoiComponent } from './components/list-view/poi/poi.component';

@Component({
    selector: 'app-home',
    imports: [TabsModule, TrackMapComponent, ListViewComponent, GeofenceComponent, PoiComponent],
    template: `
       <div class="w-full h-[calc(100vh-60px)]"> <!-- Subtract topbar height -->
  <div class="flex flex-col lg:flex-row h-full">
    
    <!-- Left Panel -->
    <div class="w-full lg:w-[340px] lg:flex-shrink-0 h-full">
      <div class="bg-[#F9F9F9] shadow-sm border border-gray-200 p-4 h-full overflow-auto">
        <p-tabs [value]="0" class="h-full">
          <p-tablist>
            @for (tab of tabs; track tab.value) {
                <p-tab [value]="tab.value">{{ tab.title }}</p-tab>
            }
        </p-tablist>
          <p-tabpanels>
            @for (tab of tabs; track tab.value) {
              <p-tabpanel [value]="tab.value">
                @switch (tab.key) {
                  @case ('vehicles') {
                    <app-list-view />
                  }
                  @case ('geofence') {
                    <app-geofence />
                  }
                  @case ('poi') {
                    <app-poi />
                  }
                  @default {
                    <p>No matching tab found</p>
                  }
                }
              </p-tabpanel>
            }
          </p-tabpanels>
        </p-tabs>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 min-w-0 h-full">
      <div class="h-full">
        <app-track-map />
      </div>
    </div>

  </div>
</div>

    `,
    styles: [
        `
            :host ::ng-deep .p-tablist-tab-list,
            :host ::ng-deep .p-tabpanels {
                background: none !important;
            }
        `
    ]
})
export class HomeComponent {
    tabs = listViewTabs;
}
