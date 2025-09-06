// report-handler.factory.ts
import { Injectable, Inject } from '@angular/core';
import { REPORT_HANDLERS, ReportHandler } from './report-handlers.token';

@Injectable({ providedIn: 'root' })
export class ReportHandlerFactory {
  constructor(@Inject(REPORT_HANDLERS) private handlers: ReportHandler[]) {}

  getHandler(type: string): ReportHandler | null {
    return this.handlers.find(h => h.supports(type)) ?? null;
  }
}
