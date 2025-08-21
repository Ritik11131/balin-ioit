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

  private destroy$ = new Subject<void>();
  public pathReplayService = inject(PathReplayService);

  onFormSubmit(e: any) {
    console.log(e);
    this.pathReplayService.startPathReplay(e);
  }



  // Static properties
  readonly totalTime = '01:12:20';


  ngOnInit(): void {
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
