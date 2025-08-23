import { Component, inject } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { PathReplayService } from '../../../../pages/service/path-replay.service';

@Component({
    selector: 'app-playback-path-info',
    imports: [SkeletonModule],
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

         <div class="max-w-6xl mx-auto">
        <!-- Driving Statistics Cards -->
        <div class="grid grid-cols-2 gap-6">
            <!-- Distance Card -->
            <div class="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <!-- Icon Container -->
                <div class="rounded-full icon-bg flex justify-start mb-4">
                    <i class="pi pi-map" style="color: var(--primary-color);"></i>
                </div>
                
                <!-- Stats Content -->
                <div class="">
                    <div class="text-2xl font-bold text-gray-900">
                        {{pathReplayService.vehicleStartEndInfo.totalDistance}}<span class="text-sm font-medium text-gray-600">km</span>
                    </div>
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
                    <div class="text-2xl font-bold text-gray-900">
                        {{pathReplayService.vehicleStartEndInfo.maxSpeed}}<span class="text-sm font-medium text-gray-600">kmph</span>
                    </div>
                    <div class="text-gray-600 font-medium text-sm">Max Speed</div>
                </div>
            </div>
        </div>

    </div>
    `,
    styles: [
        `
            .dotted-line {
                background-image: linear-gradient(to bottom, var(--primary-color) 40%, transparent 40%);
                background-size: 2px 8px;
                background-repeat: repeat-y;
            }
        `
    ]
})
export class PlaybackPathInfoComponent {
    public pathReplayService = inject(PathReplayService);
}
