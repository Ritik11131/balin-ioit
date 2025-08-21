import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GenericFormGeneratorComponent } from '../generic-form-generator/generic-form-generator.component';
import { UiService } from '../../../layout/service/ui.service';
import { PathReplayService } from '../../../pages/service/path-replay.service';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { map, Subject, takeUntil } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-generic-path-replay',
  imports: [GenericFormGeneratorComponent, ButtonModule, SliderModule, FormsModule, DragDropModule, CommonModule, TooltipModule],
  templateUrl: './generic-path-replay.component.html',
  styleUrl: './generic-path-replay.component.scss'
})
export class GenericPathReplayComponent {

  @Input() vehicle:any;
  @Input() formFields:any;

  public pathReplayService = inject(PathReplayService);

  onFormSubmit(e: any) {
    console.log(e);
    this.pathReplayService.startPathReplay(e);
  }


   private destroy$ = new Subject<void>();
  
  // Computed properties using observables
  isPlaying$ = this.pathReplayService.replayActive$.pipe(
    map(replay => {
      const status = this.pathReplayService.playbackControlObject?.status;
      return status === 'Moving' || status === 'Started';
    })
  );

  isPaused$ = this.pathReplayService.replayActive$.pipe(
    map(() => this.pathReplayService.playbackControlObject?.status === 'Paused')
  );

  isFinished$ = this.pathReplayService.replayActive$.pipe(
    map(() => this.pathReplayService.playbackControlObject?.status === 'Finished')
  );

  speedMultiplier$ = this.pathReplayService.replayActive$.pipe(
    map(() => {
      const speedValue = this.pathReplayService.playbackControlObject?.speed || 500;
      return (speedValue / 1000).toFixed(1) + 'x';
    })
  );

  progressTime$ = this.pathReplayService.replayActive$.pipe(
    map(() => {
      const progress = this.pathReplayService.playbackControlObject?.progress || 0;
      const totalMinutes = 72; // Based on 01:12:20
      const currentMinutes = Math.floor((progress / 100) * totalMinutes);
      const minutes = Math.floor(currentMinutes);
      const seconds = Math.floor((currentMinutes - minutes) * 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    })
  );

  formattedTimestamp$ = this.pathReplayService.replayActive$.pipe(
    map(() => {
      const timestamp = this.pathReplayService.vehicleHistoryInfo?.timestamp;
      if (!timestamp || timestamp === 'N/A') return 'N/A';
      try {
        const timePart = timestamp.split(', ')[1]?.split(' ')[0] || timestamp;
        return timePart;
      } catch {
        return timestamp;
      }
    })
  );

  statusColors$ = this.pathReplayService.replayActive$.pipe(
    map(() => {
      const status = this.pathReplayService.playbackControlObject?.status;
      switch (status) {
        case 'Moving':
        case 'Started':
          return {
            color: 'var(--primary-color, #10b981)',
            background: 'color-mix(in srgb, var(--primary-color, #10b981) 20%, white)'
          };
        case 'Paused':
          return {
            color: '#f59e0b',
            background: '#fef3c7'
          };
        case 'Finished':
          return {
            color: '#ef4444',
            background: '#fee2e2'
          };
        default:
          return {
            color: 'var(--primary-color, #10b981)',
            background: 'color-mix(in srgb, var(--primary-color, #10b981) 20%, white)'
          };
      }
    })
  );

  // Static properties
  readonly totalTime = '01:12:20';
  
  // Component state properties (updated via observables)
  playButtonIcon = 'pi pi-play';
  playButtonTooltip = 'Play';


  ngOnInit(): void {
    // Update play button icon and tooltip based on playing state
    this.isPlaying$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(isPlaying => {
      this.playButtonIcon = isPlaying ? 'pi pi-pause' : 'pi pi-play';
      this.playButtonTooltip = isPlaying ? 'Pause' : 'Play';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  onStop(): void {
    this.pathReplayService.handlePlaybackControls('pause');
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
