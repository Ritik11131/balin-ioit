import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { GeofenceComponent } from './geofence/geofence.component';
import { PoiComponent } from './poi/poi.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { listViewTabs } from '../../../../shared/constants/list-view';

@Component({
    selector: 'app-list-view',
    imports: [TabsModule, GeofenceComponent, PoiComponent, VehiclesComponent],
    template: `
            <div class="bg-[#F9F9F9] shadow-sm border border-gray-200 p-4 h-full">
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
                                        <app-vehicles />
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
    `,
    styles: [
        `
            :host ::ng-deep .p-tablist-tab-list,
            :host ::ng-deep .p-tabpanels {
                background: none;
            }

            :host ::ng-deep .p-tabpanels {
                padding: 0;
            }
        `
    ]
})
export class ListViewComponent {
    tabs = listViewTabs;
}
