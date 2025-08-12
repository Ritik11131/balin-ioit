import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-geofence-skeleton-card',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  template: `
    <div
      class="w-full h-[60px] bg-white rounded-lg shadow-sm p-4 flex items-center justify-start cursor-default"
    >
      <!-- Left Circle Skeleton -->
      <p-skeleton shape="circle" size="32px" class="flex-shrink-0"></p-skeleton>

      <!-- Right Content Skeleton -->
      <div class="ml-4 flex flex-col flex-1 overflow-hidden">
        <p-skeleton width="80%" height="12px" class="mb-2"></p-skeleton>
        <p-skeleton width="50%" height="10px"></p-skeleton>
      </div>
    </div>
  `
})
export class GeofenceSkeletonCardComponent {}
