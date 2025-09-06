import { Component, inject } from '@angular/core';
import { TrackMapComponent } from "../../home/components/track-map/track-map.component";
import { GenericPathReplayComponent } from "../../../shared/components/generic-path-replay/generic-path-replay.component";
import { PathReplayService } from '../../service/path-replay.service';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
import { selectVehicles } from '../../../store/vehicle/vehicle.selectors';
import { Store } from '@ngrx/store';
import { ReportsService } from '../../service/reports.service';
import { ActivatedRoute } from '@angular/router';
import { ReportHandlerFactory } from '../handler/report-handler.factory';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { GenericTableComponent } from "../../../shared/components/generic-table/generic-table.component";
import { reportViewOptions } from '../../../shared/constants/reports';
import { GenericFormGeneratorComponent } from "../../../shared/components/generic-form-generator/generic-form-generator.component";
import { Button } from "primeng/button";
import { GenericPointMarkersComponent } from "../../../shared/components/generic-point-markers/generic-point-markers.component";

@Component({
  selector: 'app-report-detail',
  imports: [TrackMapComponent, GenericPathReplayComponent, CommonModule, SelectButtonModule, FormsModule, GenericTableComponent, GenericFormGeneratorComponent, Button, GenericPointMarkersComponent],
  templateUrl: './report-detail.component.html',
  styleUrl: './report-detail.component.scss'
})
export class ReportDetailComponent {
  private reportFactory = inject(ReportHandlerFactory);
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  public pathReplayService = inject(PathReplayService);
  
  vehicles$ = this.store.select(selectVehicles);
  selectedVehicle$ = this.vehicles$.pipe(map(vehicles => vehicles.length ? vehicles[0] : null));
  currentReport = this.route.snapshot.data['report'];
  reportViewOptions = reportViewOptions;

  ngOnInit() {
    if (this.currentReport) {
      const handler = this.reportFactory.getHandler(this.currentReport.type);
      handler?.init(this.currentReport);
    }
  }

}
