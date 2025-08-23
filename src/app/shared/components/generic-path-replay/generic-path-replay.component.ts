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
import { PlaybackPathInfoComponent } from "./playback-path-info/playback-path-info.component";
import { PlaybackControlPanelComponent } from "./playback-control-panel/playback-control-panel.component";

@Component({
  selector: 'app-generic-path-replay',
  imports: [GenericFormGeneratorComponent, ButtonModule, SliderModule, FormsModule, DragDropModule, CommonModule, TooltipModule, SkeletonModule, PlaybackPathInfoComponent, PlaybackControlPanelComponent],
  templateUrl: './generic-path-replay.component.html',
  styleUrl: './generic-path-replay.component.scss'
})
export class GenericPathReplayComponent implements OnChanges {

  @Input() vehicle: any;
  @Input() formFields: any;

  defaultPlaybackObj = {}

  private destroy$ = new Subject<void>();
  public pathReplayService = inject(PathReplayService);

  onFormSubmit(e: any) {
    console.log(e);
    this.pathReplayService.startPathReplay(e);
  }


  ngOnChanges(changes: SimpleChanges): void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
