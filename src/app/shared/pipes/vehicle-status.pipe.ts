import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleStatus',
  standalone: true
})
export class VehicleStatusPipe implements PipeTransform {
  
  transform(vehicle: any): string {
    if (!vehicle || !vehicle.status) {
      return 'bg-gray-400';
    }

    switch (vehicle.status.toLowerCase()) {
      case 'all':
        return 'bg-blue-400';
      case 'running':
        return 'bg-green-500';
      case 'stopped':
        return 'bg-red-500';
      case 'idle':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-200'; // Default case for unknown status
    }
  }
}