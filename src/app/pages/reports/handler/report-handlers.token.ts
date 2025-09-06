import { InjectionToken } from '@angular/core';

export interface ReportHandler {
  supports(type: string): boolean;
  init(report: any): void;
}

export const REPORT_HANDLERS = new InjectionToken<ReportHandler[]>('REPORT_HANDLERS');

