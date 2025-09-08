// point-markers-report.handler.ts
import { Injectable } from '@angular/core';
import { REPORT_HANDLERS, ReportHandler } from './report-handlers.token';
import { ReportsService } from '../../service/reports.service';
import { PointMarkerService } from '../../service/point-markers.service';

@Injectable()
export class PointMarkersReportHandler implements ReportHandler {
    constructor(private pointMarkerService: PointMarkerService, private reportService: ReportsService) {}
  supports(type: string): boolean {
    return type === 'pointMarkers';
  }

  init(report: any): void {    
    this.reportService.setTableUpdateContext('reports');
    this.pointMarkerService.startPointMarkers(null, report);
  }
}

export const POINT_MARKERS_PROVIDER = {
  provide: REPORT_HANDLERS,
  useClass: PointMarkersReportHandler,
  multi: true
};
