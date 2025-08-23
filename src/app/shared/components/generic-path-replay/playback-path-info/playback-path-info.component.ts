import { Component, inject } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { PathReplayService } from '../../../../pages/service/path-replay.service';

@Component({
    selector: 'app-playback-path-info',
    imports: [SkeletonModule],
    template: `
        <h2 class="text-xl font-semibold text-gray-800 mb-6">Path Info</h2>

        <div>
            <div class="flex items-center">
                <div class="flex-shrink-0 mr-4">
                    <i class="pi pi-circle-fill" style="color: var(--primary-color);"></i>
                </div>

                <div class="flex-grow">
                    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        @if (pathReplayService.vehicleStartEndInfo.startInfo.address) {
                            <div class="text-md text-gray-500">{{ pathReplayService.vehicleStartEndInfo.startInfo.address }}</div>
                            <div class="text-sm text-gray-600 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.startInfo.timestamp }}]</div>
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
                            <div class="text-md text-gray-500">{{ pathReplayService.vehicleStartEndInfo.endInfo.address }}</div>
                            <div class="text-sm text-gray-600 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.endInfo.timestamp }}]</div>
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
