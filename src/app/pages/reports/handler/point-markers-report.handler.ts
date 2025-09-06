// point-markers-report.handler.ts
import { Injectable } from '@angular/core';
import { REPORT_HANDLERS, ReportHandler } from './report-handlers.token';

@Injectable()
export class PointMarkersReportHandler implements ReportHandler {
  supports(type: string): boolean {
    return type === 'pointMarkers';
  }

  init(report: any): void {
    // custom logic for marker plotting
    console.log('Initializing point markers report:', report);
  }
}

export const POINT_MARKERS_PROVIDER = {
  provide: REPORT_HANDLERS,
  useClass: PointMarkersReportHandler,
  multi: true
};
