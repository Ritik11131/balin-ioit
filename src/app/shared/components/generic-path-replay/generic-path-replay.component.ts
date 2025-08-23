import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GenericFormGeneratorComponent } from '../generic-form-generator/generic-form-generator.component';
import { PathReplayService } from '../../../pages/service/path-replay.service';
import { ButtonModule } from 'primeng/button';
import { SliderModule } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-generic-path-replay',
  imports: [GenericFormGeneratorComponent, ButtonModule, SliderModule, FormsModule, DragDropModule, CommonModule, TooltipModule, SkeletonModule],
  templateUrl: './generic-path-replay.component.html',
  styleUrl: './generic-path-replay.component.scss'
})
export class GenericPathReplayComponent implements OnChanges {

  @Input() vehicle: any;
  @Input() formFields:any;

  defaultPlaybackObj = {}

  private destroy$ = new Subject<void>();
  public pathReplayService = inject(PathReplayService);

  onFormSubmit(e: any) {
    console.log(e);
    this.pathReplayService.startPathReplay(e);
  }


ngOnChanges(changes: SimpleChanges): void {
  console.log(changes, 'pathReplay');

  if (!changes['vehicle']?.currentValue) return;

  const vehicleId = changes['vehicle'].currentValue.id;

  // Prepare today's date range in local timezone (+05:30)
  const today = new Date();
  const formatDate = (d: Date, hour: number, min: number, sec: number) =>
    new Date(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}+05:30`);

  this.defaultPlaybackObj = {
    vehicle: vehicleId,
    date: [
      formatDate(today, 0, 0, 0),   // start of today
      formatDate(today, 23, 59, 59) // end of today
    ]
  };

  this.onFormSubmit({ isEditMode: true, formValue: this.defaultPlaybackObj });
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
