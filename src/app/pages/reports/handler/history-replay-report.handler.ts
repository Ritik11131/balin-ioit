// history-replay-report.handler.ts
import { Injectable } from '@angular/core';
import { REPORT_HANDLERS, ReportHandler } from './report-handlers.token';
import { PathReplayService } from '../../service/path-replay.service';
import { ReportsService } from '../../service/reports.service';

@Injectable()
export class HistoryReplayReportHandler implements ReportHandler {
  constructor(private pathReplayService: PathReplayService, private reportService: ReportsService) {}

  supports(type: string): boolean {
    return type === 'historyReplay';
  }

  init(report: any): void {
    this.reportService.setTableUpdateContext('reports');
    this.pathReplayService.startPathReplay(null);
  }
}

export const HISTORY_REPLAY_PROVIDER = {
  provide: REPORT_HANDLERS,
  useClass: HistoryReplayReportHandler,
  multi: true
};
