import { Component, inject } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { PathReplayService } from '../../../../pages/service/path-replay.service';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-playback-path-info',
    imports: [SkeletonModule, TabsModule, BadgeModule, CommonModule],
    template: `
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Path Info</h2>

        <div class="mb-6">
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-4">
                    <i class="pi pi-circle-fill" style="color: var(--primary-color);"></i>
                </div>

                <div class="flex-grow">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        @if (pathReplayService.vehicleStartEndInfo.startInfo.address) {
                            <div class="text-sm text-gray-500">{{ pathReplayService.vehicleStartEndInfo.startInfo.address }}</div>
                            <div class="text-sm text-gray-800 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.startInfo.timestamp }}]</div>
                        } @else {
                            <div>
                                <p-skeleton width="15rem" styleClass="mb-2" />
                                <p-skeleton width="5rem" />
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div class="flex justify-start">
                <div class="dotted-line w-0.5 h-10 ml-2"></div>
            </div>

            <div class="flex items-center">
                <div class="flex-shrink-0 mr-4">
                    <i class="pi pi-map-marker" style="color: var(--primary-color);"></i>
                </div>

                <div class="flex-grow">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        @if (pathReplayService.vehicleStartEndInfo.endInfo.address) {
                            <div class="text-sm text-gray-500">{{ pathReplayService.vehicleStartEndInfo.endInfo.address }}</div>
                            <div class="text-sm text-gray-800 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.endInfo.timestamp }}]</div>
                        } @else {
                            <div>
                                <p-skeleton width="15rem" styleClass="mb-2" />
                                <p-skeleton width="5rem" />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-6 mb-4">
            <!-- Distance Card -->
            <div class="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <!-- Icon Container -->
                <div class="rounded-full icon-bg flex justify-start mb-4">
                    <i class="pi pi-map" style="color: var(--primary-color);"></i>
                </div>

                <!-- Stats Content -->
                <div class="">
                    <div class="text-2xl font-bold text-gray-900">{{ pathReplayService.vehicleStartEndInfo.totalDistance }}<span class="text-sm font-medium text-gray-600">km</span></div>
                    <div class="text-gray-600 font-medium text-sm">Distance</div>
                </div>
            </div>

            <!-- Max Speed Card -->
            <div class="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <!-- Icon Container -->
                <div class="rounded-full icon-bg flex justify-start mb-4">
                    <i class="pi pi-gauge" style="color: var(--primary-color);"></i>
                </div>

                <!-- Stats Content -->
                <div class="">
                    <div class="text-2xl font-bold text-gray-900">{{ pathReplayService.vehicleStartEndInfo.maxSpeed }}<span class="text-sm font-medium text-gray-600">kmph</span></div>
                    <div class="text-gray-600 font-medium text-sm">Max Speed</div>
                </div>
            </div>
        </div>

        <div>
            <p-tabs value="0" scrollable>
                <p-tablist>
                    <p-tab value="0" class="flex items-center !gap-2">
                        <span class="font-bold whitespace-nowrap">Stops</span>
                        <p-badge [value]="pathReplayService.vehicleStartEndInfo?.stopsData?.total" />
                    </p-tab>
                </p-tablist>
                <p-tabpanels>
                    <p-tabpanel value="0">
                        <div class="max-h-[160px] overflow-y-auto space-y-3 mt-4 px-2">
                            @for (stop of pathReplayService.vehicleStartEndInfo?.stopsData?.data; track stop) {
                                <div class="flex items-center">
                                    <div class="stop-marker-container mr-4">
                                        <div class="relative flex items-center justify-center">
                                            <!-- Outer pulsing ring -->
                                            <div class="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg opacity-30" [ngStyle]="{ 'background-color': 'var(--primary-color)' }"></div>

                                            <!-- Main marker -->
                                            <div class="relative w-5 h-5 rounded-full shadow-lg z-10" [ngStyle]="{ 'background-color': 'var(--primary-color)' }">
                                                <!-- Inner ping animation -->
                                                <div class="absolute inset-0 rounded-full opacity-25" [ngStyle]="{ 'background-color': 'var(--primary-color)' }"></div>

                                                <!-- White square at center -->
                                                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-sm z-20"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex-grow">
                                        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                            <div class="text-md text-gray-500">
                                                <span>{{ stop.label }}</span>
                                                <span class="ml-2">[{{ stop.duration || '-' }}]</span>
                                            </div>
                                            <div class="truncate max-w-[200px] text-sm text-gray-800 font-medium mt-1">
                                                {{ stop.address || 'Address not available' }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `,
    styles: [
        `
            .dotted-line {
                background-image: linear-gradient(to bottom, var(--primary-color) 40%, transparent 40%);
                background-size: 2px 8px;
                background-repeat: repeat-y;
            }

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
export class PlaybackPathInfoComponent {
    public pathReplayService = inject(PathReplayService);
}
