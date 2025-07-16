import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'app-vehicle-skeleton-card',
    imports: [SkeletonModule],
    template: `
        <div class="w-full h-[126px] bg-white rounded-lg shadow-sm p-4 flex flex-col justify-between animate-pulse">
            <!-- Row 1: Pulse + Icons -->
            <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                    <!-- Status Dot -->
                    <div class="relative w-2.5 h-2.5 rounded-full bg-gray-300">
                        <div class="absolute top-0 left-0 w-full h-full rounded-full bg-gray-300 opacity-75 animate-ping"></div>
                    </div>

                    <!-- Vehicle Name -->
                    <p-skeleton width="100px" height="16px" class="rounded-sm" />
                </div>

                <!-- Icons -->
                <div class="flex gap-2">
                    <p-skeleton width="16px" height="16px" shape="circle" />
                </div>
            </div>

            <!-- Vehicle Number -->
            <p-skeleton width="80px" height="14px" class="mt-1 rounded-sm" />

            <!-- Time Info -->
            <div class="flex items-center gap-2 mt-1">
                <p-skeleton width="14px" height="14px" shape="circle" />
                <p-skeleton width="60px" height="12px" class="rounded-sm" />
            </div>

            <!-- Address Info -->
            <div class="flex items-center gap-2 mt-1">
                <p-skeleton width="14px" height="14px" shape="circle" />
                <p-skeleton width="100px" height="12px" class="rounded-sm" />
            </div>
        </div>
    `,
    styles: ``
})
export class VehicleSkeletonCardComponent {}
