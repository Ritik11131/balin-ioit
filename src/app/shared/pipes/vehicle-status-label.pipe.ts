import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleStatusLabel'
})
export class VehicleStatusLabelPipe implements PipeTransform {
  transform(status: string): string {
    const map: Record<string, string> = {
      stop: 'STOPPED',
      dormant: 'DORMANT',
      offline: 'OFFLINE',
      running: 'RUNNING',
      all: 'ALL',
    };
    return map[status?.toLowerCase()] || 'NEVER';
  }
}
