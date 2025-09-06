import { Component, inject } from '@angular/core';
import { TrackMapComponent } from "../../home/components/track-map/track-map.component";
import { GenericPathReplayComponent } from "../../../shared/components/generic-path-replay/generic-path-replay.component";
import { PathReplayService } from '../../service/path-replay.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { selectVehicles } from '../../../store/vehicle/vehicle.selectors';
import { Store } from '@ngrx/store';
import { ReportsService } from '../../service/reports.service';

@Component({
  selector: 'app-report-detail',
  imports: [TrackMapComponent, GenericPathReplayComponent, CommonModule],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent {
  private reportsService = inject(ReportsService);
  private store = inject(Store);
  public pathReplayService = inject(PathReplayService);
  
  vehicles$ = this.store.select(selectVehicles);
  selectedVehicle$ = this.vehicles$.pipe(map(vehicles => vehicles.length ? vehicles[0] : null));

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.pathReplayService.startPathReplay(null);
    
  }

}
