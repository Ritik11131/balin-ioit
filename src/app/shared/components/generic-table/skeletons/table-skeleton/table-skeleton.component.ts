import { Component } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table-skeleton',
  imports: [SkeletonModule,TableModule],
  template:`
    <div class="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
    <!-- Table Header/Caption Skeleton -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <p-skeleton height="1.75rem" width="10rem" styleClass="animate-pulse"></p-skeleton>
        <div class="flex items-center gap-2">
          <p-skeleton height="2.25rem" width="12rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2.25rem" width="5rem" borderRadius="6px" styleClass="animate-pulse"></p-skeleton>
        </div>
      </div>
    </div>

    <!-- Table Content -->
    <p-table 
      [value]="skeletonRows" 
      [paginator]="true" 
      [rows]="10" 
      [rowsPerPageOptions]="[10, 20, 50]"
      [showCurrentPageReport]="true"
      styleClass="p-datatable-sm w-full"
      [tableStyle]="{ 'width': '100%' }"
    >
      <ng-template pTemplate="header">
        <tr>
          <!-- Checkbox column -->
          <th style="width: 4rem; padding: 1rem 0.75rem;">
            <div class="flex justify-center">
              <p-skeleton width="1.25rem" height="1.25rem" shape="circle" styleClass="animate-pulse"></p-skeleton>
            </div>
          </th>
          <!-- Dynamic columns based on typical table structure -->
          @for (col of [
            { width: '8rem' },  
            { width: '10rem' }, 
            { width: '6rem' },  
            { width: '8rem' },  
            { width: '6rem' },  
            { width: '7rem' }    
          ]; track $index) {
            <th [style.min-width]="col.width" style="padding: 1rem 0.75rem;">
              <div class="flex items-center gap-2">
                <p-skeleton height="1.25rem" [width]="col.width" styleClass="animate-pulse"></p-skeleton>
                <!-- Filter icon skeleton -->
                <p-skeleton width="1rem" height="1rem" shape="circle" styleClass="animate-pulse"></p-skeleton>
              </div>
            </th>
          }
        </tr>
      </ng-template>
      
      <ng-template pTemplate="body" let-row let-ri="rowIndex">
        <tr [class.bg-gray-50]="ri % 2 === 1">
          <!-- Checkbox -->
          <td style="padding: 0.75rem;">
            <div class="flex justify-center">
              <p-skeleton shape="circle" width="1.25rem" height="1.25rem" styleClass="animate-pulse"></p-skeleton>
            </div>
          </td>
          <!-- Data columns with varied content -->
          @for (col of [
            { type: 'text', width: '90%' },
            { type: 'text', width: '85%' },
            { type: 'badge', width: '4rem' },
            { type: 'date', width: '6rem' },
            { type: 'actions', width: '3rem' },
            { type: 'text', width: '75%' }
          ]; track $index) {
            <td style="padding: 0.75rem;">
              @if (col.type === 'badge') {
                <p-skeleton height="1.5rem" [width]="col.width" borderRadius="12px" styleClass="animate-pulse"></p-skeleton>
              } @else if (col.type === 'actions') {
                <div class="flex gap-1">
                  <p-skeleton shape="circle" width="1.75rem" height="1.75rem" styleClass="animate-pulse"></p-skeleton>
                  <p-skeleton shape="circle" width="1.75rem" height="1.75rem" styleClass="animate-pulse"></p-skeleton>
                </div>
              } @else if (col.type === 'date') {
                <p-skeleton height="1.25rem" [width]="col.width" styleClass="animate-pulse"></p-skeleton>
              } @else {
                <p-skeleton height="1.25rem" [width]="col.width" styleClass="animate-pulse"></p-skeleton>
              }
            </td>
          }
        </tr>
      </ng-template>
    </p-table>
    
    <!-- Pagination Skeleton -->
    <div class="p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center justify-between">
        <!-- Page info -->
        <p-skeleton height="1.25rem" width="8rem" styleClass="animate-pulse"></p-skeleton>
        
        <!-- Pagination controls -->
        <div class="flex items-center gap-1">
          <p-skeleton height="2rem" width="2rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2rem" width="2rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2rem" width="2rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2rem" width="2rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2rem" width="2rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
        </div>
        
        <!-- Rows per page -->
        <div class="flex items-center gap-2">
          <p-skeleton height="1.25rem" width="4rem" styleClass="animate-pulse"></p-skeleton>
          <p-skeleton height="2rem" width="4rem" borderRadius="4px" styleClass="animate-pulse"></p-skeleton>
        </div>
      </div>
    </div>
  </div>
  `
})
export class TableSkeletonComponent {

      skeletonRows = Array(10).fill({});
  

}
