import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { GenericFormGeneratorComponent } from '../generic-form-generator/generic-form-generator.component';
import { UiService } from '../../../layout/service/ui.service';
import { PathReplayService } from '../../../pages/service/path-replay.service';

@Component({
  selector: 'app-generic-path-replay',
  imports: [GenericFormGeneratorComponent],
  templateUrl: './generic-path-replay.component.html',
  styleUrl: './generic-path-replay.component.scss'
})
export class GenericPathReplayComponent {

  @Input() vehicle:any;
  @Input() formFields:any;

  private pathReplayService = inject(PathReplayService);

  onFormSubmit(e: any) {
    console.log(e);
    this.pathReplayService.startPathReplay(e);
  }

}
