import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TrackMapComponent } from './components/track-map/track-map.component';
import { ListViewComponent } from './components/list-view/list-view.component';

@Component({
    selector: 'app-home',
    imports: [TabsModule, TrackMapComponent, ListViewComponent],
    template: `
        <div class="w-full h-[calc(100vh-60px)]">
            <!-- Subtract topbar height -->
            <div class="flex flex-col lg:flex-row h-full">
                <!-- Left Panel -->
                <div class="w-full lg:w-[340px] lg:flex-shrink-0 h-full">
                    <app-list-view />
                </div>

                <!-- Right Panel -->
                <div class="flex-1 min-w-0 h-full">
                    <div class="h-full">
                        <app-track-map />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HomeComponent {}
