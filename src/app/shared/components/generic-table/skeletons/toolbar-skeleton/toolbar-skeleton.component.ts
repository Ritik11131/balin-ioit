import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-toolbar-skeleton',
  imports: [ToolbarModule,SkeletonModule],
 template:`
   <p-toolbar styleClass="mb-6">
    <ng-template pTemplate="start">
      <div class="flex items-center gap-2">
        <!-- Action buttons with varying widths -->
        <p-skeleton height="2.5rem" width="5rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
        <p-skeleton height="2.5rem" width="7rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
        
      </div>
    </ng-template>
    
    <ng-template pTemplate="end">
      <div class="flex items-center gap-2">
        <!-- Search field -->
        <p-skeleton height="2.5rem" width="12rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
        <!-- Clear button -->
        <p-skeleton height="2.5rem" width="5rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
        <!-- Export button -->
        <p-skeleton height="2.5rem" width="6rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
      </div>
    </ng-template>
  </p-toolbar>
 `
  
})
export class ToolbarSkeletonComponent {

}
