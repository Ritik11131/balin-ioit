import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import { PathReplayService } from '../../../../pages/service/path-replay.service';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-playback-control-panel',
  imports: [CommonModule, SliderModule, FormsModule, DragDropModule],
  template: `
  
  <!-- Professional Playback Controls Panel -->
@if (pathReplayService.hasHistory$ | async) {
<div cdkDrag
    class="fixed bottom-6 left-2/3 transform -translate-x-1/2 control-panel rounded-xl shadow-lg border border-gray-200 bg-white"
    style="width: 580px; z-index: 9999">
    <!-- Drag Handle -->
    <div cdkDragHandle
        class="drag-handle bg-gray-50 text-gray-700 px-4 py-2 rounded-t-xl flex items-center justify-between cursor-move border-b border-gray-100">
        <div class="flex items-center gap-2">
            <i class="pi pi-bars text-xs text-gray-400"></i>
            <span class="font-medium text-sm text-gray-600">Playback Controls</span>
        </div>
    </div>

    <div class="p-4">
        <!-- Status and Info Row -->
        <div class="flex items-center justify-between mb-4">
            <!-- Status Badge -->
            <div class="flex items-center gap-4">
                <div class="px-3 py-1 rounded-full text-xs font-medium border" [ngClass]="{
                            'bg-green-50 text-green-700 border-green-200': (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'Started' || (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'Moving',
                            'bg-yellow-50 text-yellow-700 border-yellow-200': (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'Paused',
                            'bg-blue-50 text-blue-700 border-blue-200': (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'Finished',
                            'bg-gray-50 text-gray-700 border-gray-200': (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'PlayBack'
                        }">
                    {{ pathReplayService.playbackControlObject?.status || 'PlayBack' }}
                </div>

                <!-- Vehicle Info -->
                <div class="flex items-center gap-4 text-sm">
                    <div class="flex items-center gap-1">
                        <span class="text-gray-500">Speed:</span>
                        <span class="font-semibold text-gray-800">{{ pathReplayService.vehiclePlaybackObject?.speed || 0 }}
                            km/h</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <span class="text-gray-500">Time:</span>
                        <span class="font-semibold text-gray-800">{{ pathReplayService.vehiclePlaybackObject?.timestamp
                            }}</span>
                    </div>
                </div>
            </div>

            <!-- Progress Percentage -->
            <div class="text-sm text-gray-600">
                <span class="font-semibold">{{ (pathReplayService.playbackControlObject?.progress || 0).toFixed(1)
                    }}%</span>
            </div>
        </div>

        <!-- Progress Bar Row -->
        <div class="mb-4">
            <div class="flex items-center gap-3 text-xs text-gray-500">
                <div class="flex-1">
                    <p-slider styleClass="w-full progress-slider"
                        [ngModel]="pathReplayService.playbackControlObject?.progress || 0" [min]="0" [max]="100"
                        [step]="0.1" (onChange)="onProgressChange($event)"> </p-slider>
                </div>
            </div>
        </div>

        <!-- Controls Row -->
        <div class="flex items-center justify-between">
            <!-- Control Buttons -->
            <div class="flex items-center gap-2">
                <button
                    class="control-btn w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    (click)="onReset()" title="Reset">
                    <i class="pi pi-step-backward text-sm"></i>
                </button>

                <button
                    class="play-btn w-12 h-12 rounded-full bg-[var(--primary-color)] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-md"
                    (click)="onTogglePlayPause()" [ngClass]="{ 
                            'bg-yellow-500': (pathReplayService.playbackControlObject?.status || 'PlayBack') === 'Paused'
                            }"
                    [title]="pathReplayService.playbackControlObject?.status === 'Started' || pathReplayService.playbackControlObject?.status === 'Moving' ? 'Pause' : 'Play'">
                    <i [class]="pathReplayService.playbackControlObject?.status === 'Started' || pathReplayService.playbackControlObject?.status === 'Moving' ? 'pi pi-pause' : 'pi pi-play'"
                        class="text-lg"></i>
                </button>

                <button
                    class="control-btn w-9 h-9 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-all duration-200 hover:scale-105 ml-2"
                    (click)="onClose()" title="Close">
                    <i class="pi pi-times text-sm"></i>
                </button>
            </div>

            <!-- Speed Control -->
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600 whitespace-nowrap">Playback Speed:</span>
                <div class="w-24">
                    <p-slider styleClass="speed-slider"
                        [ngModel]="pathReplayService.playbackControlObject?.speed || 500" [min]="500" [max]="10000"
                        [step]="250" (onChange)="onSpeedChange($event)"> </p-slider>
                </div>
                <span class="text-sm font-semibold text-blue-600 min-w-fit">
                    {{ (pathReplayService.playbackControlObject?.speed / 1000).toFixed(1) + 'x' }}
                </span>
            </div>
        </div>
    </div>
</div>
}
  
  `,
  styles:[``]
})
export class PlaybackControlPanelComponent {

  public pathReplayService = inject(PathReplayService);
  readonly totalTime = '01:12:20';



    // Event handlers (no computation in template)
  onTogglePlayPause(): void {
    const status = this.pathReplayService.playbackControlObject?.status;
    if (status === 'Moving' || status === 'Started') {
      this.pathReplayService.handlePlaybackControls('pause');
    } else {
      this.pathReplayService.handlePlaybackControls('play');
    }
  }

  onReset(): void {
    this.pathReplayService.handlePlaybackControls('reset');
  }

  onClose(): void {
    this.pathReplayService.handlePlaybackControls('close');
  }

  onProgressChange(event: any): void {
    this.pathReplayService.handlePlaybackControls('updateprogress', event);
  }

  onSpeedChange(event: any): void {
    this.pathReplayService.handlePlaybackControls('updatespeed', event);
  }

  // Trackby functions for ngFor (if needed in future)
  trackByIndex(index: number): number {
    return index;
  }

}
