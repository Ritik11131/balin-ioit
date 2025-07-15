import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleStatus'
})
export class VehicleStatusPipe implements PipeTransform {

 transform(vehicle: any): string {
    if (!vehicle || !vehicle.color) {
      return '';
    }

    // Return a single class name string
    return vehicle?.color;
  }

}
