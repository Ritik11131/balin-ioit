import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

export interface SelectionAction {
  id: string;
  label: string;
  icon: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast';
}

@Component({
  selector: 'app-multiselect-action-panel',
  imports: [DragDropModule, ButtonModule, DividerModule, CommonModule],
  template:`

    <!-- Wrapper (handles centering + position) -->
<div class="fixed bottom-36 left-1/2 z-50 w-[95%] sm:w-auto" style="transform: translateX(-50%);">

  <!-- Animated child -->
  <div 
    cdkDrag 
    cdkDragHandle 
    [ngClass]="selectedCount ? 'animate-slide-up' : 'animate-slide-down'"
    class="bg-[#272838] text-white rounded-xl shadow-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 px-4 py-3"
  >
    <!-- Left Section -->
    <div class="flex items-center space-x-2 sm:space-x-4">
      <p-button 
        icon="pi pi-times" 
        (click)="onClose()" 
        [text]="true"
        severity="danger"
        size="small"
        class="p-button-rounded">
      </p-button>
      <span class="text-sm font-medium whitespace-nowrap">{{selectedCount}} Selected</span>
    </div>

    <!-- Right Section -->
    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:ml-12">
      @for(action of actions; track action.id; let i = $index) {
        <p-button 
          [label]="action.label"
          [icon]="action.icon"
          (click)="onActionClick(action)"
          [severity]="action.severity || 'primary'"
          [text]="true"
          size="small"
          class="text-sm whitespace-nowrap">
        </p-button>

        <!-- Separator (only on large screens) -->
        @if(i < actions.length - 1) {
          <p-divider class="hidden sm:block" layout="vertical" />
        }
      }
    </div>
  </div>
</div>


  `
  
})
export class MultiselectActionPanelComponent {

  @Input() selectedCount: number = 0;
  @Input() actions: SelectionAction[] = [
    { id: 'share', label: 'Share', icon: 'pi pi-share-alt', severity: 'contrast' },
    { id: 'immobilize', label: 'Immobilize', icon: 'pi pi-lock', severity: 'contrast' },
    { id: 'replay', label: 'Path Replay', icon: 'pi pi-replay', severity: 'contrast' },
    { id: 'download', label: 'Download Report', icon: 'pi pi-download', severity: 'contrast' }
  ];

  @Output() actionClicked = new EventEmitter<SelectionAction>();
  @Output() closeClicked = new EventEmitter<void>();

  onActionClick(action: SelectionAction): void {
    this.actionClicked.emit(action);
  }

  onClose(): void {
    this.closeClicked.emit();
  }

}
