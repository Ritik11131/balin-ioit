import { DivIcon, divIcon, marker, Marker } from 'leaflet';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { selectVehicleTypes } from '../../store/vehicle-type/selectors';
import { VehicleData } from '../home/components/track-map/track-map.component';

@Injectable({ providedIn: 'root' })
export class VehicleMarkerService {
  private store = inject(Store);
  private vehicleTypes: { id: number; name: string }[] = [];
  private loaded = false;
  vehicleTypes$ = this.store.select(selectVehicleTypes);

  constructor() {
    // Only subscribe once
    this.vehicleTypes$.pipe(filter(types => !!types)).subscribe((types: any) => {
      console.log(types, 'types');

      this.vehicleTypes = types || [];
      this.loaded = true;
    });
  }

  private getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'green';
      case 'stop':
        return 'red';
      case 'dormant':
        return 'yellow';
      case 'offline':
        return 'gray';
      default:
        return 'gray';
    }
  }

  private getVehicleNameById(id: number): string {
    const vehicle = this.vehicleTypes.find(v => v.id === id);
    return vehicle?.name || 'default';
  }

  public getVehicleIcon(vehicleTypeId: number, status: string, angle: number = 0): DivIcon {
    if (!this.loaded) {
      console.warn('Vehicle types not loaded yet.');
    }

    const vehicleName = this.getVehicleNameById(vehicleTypeId).toLowerCase().replace(/\s+/g, '_');
    const color = this.getStatusColor(status);

    const iconFile = `images/vehicles/rp_marker_${vehicleName}_${color}.png`;

    return divIcon({
      className: 'custom-vehicle-marker',
      html: `<img src="${iconFile}" alt="${vehicleName}" class="w-12 h-12"  style="transform: rotate(${angle}deg); transform-origin: center center;" />`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  private getStatusColorClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'running': 'bg-green-100 text-green-800',
      'dormant': 'bg-yellow-100 text-yellow-800',
      'stop': 'bg-red-100 text-red-800',
      'maintenance': 'bg-purple-100 text-purple-800',
      'offline': 'bg-gray-100 text-gray-800',
      'default': 'bg-gray-100 text-gray-500'
    };
    return statusClasses[status?.toLowerCase()] || statusClasses['default'];
  }

  createPopupContent(vehicle: VehicleData): string {
    const position = vehicle.apiObject.position;
    const device = vehicle.apiObject.device;
    const statusColorClass = this.getStatusColorClass(position.status.status);

    return `
        <div class="p-3 min-w-[280px]">
          <div class="border-b border-gray-200 pb-3 mb-3">
            <h3 class="font-semibold text-gray-900 text-lg">${vehicle.name}</h3>
            <p class="text-sm text-gray-600">ID: ${device.deviceId}</p>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Status:</span>
              <span class="px-2 py-1 rounded-full text-xs font-medium ${statusColorClass}">
                ${position.status.status.toUpperCase()}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Speed:</span>
              <span class="text-gray-900 font-semibold">${position.speed} km/h</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Heading:</span>
              <span class="text-gray-900">${position.heading?.toFixed(1)}°</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">Battery:</span>
              <span class="text-gray-900 font-semibold">${position.details.battPer || '-'}%</span>
            </div>
            <div class="pt-2 border-t border-gray-100">
              <div class="text-xs text-gray-500 space-y-1">
                <div><span class="font-medium">Location:</span> ${position.latitude?.toFixed(6)}, ${position.longitude?.toFixed(6)}</div>
                <div><span class="font-medium">Last Update:</span> ${new Date(vehicle.lastUpdated).toLocaleString()}</div>
                <div><span class="font-medium">Duration:</span> ${position.status.duration}</div>
              </div>
            </div>
          </div>
        </div>
      `;
  }

  createVehicleMarker(vehicle: VehicleData): Marker | null {
    try {
      const device = vehicle.apiObject.device;
      const position = vehicle.apiObject.position;
      const vehicleIcon = this.getVehicleIcon(device?.vehicleType, position.status.status, position.heading);

      const vehicleMarker = marker([position.latitude, position.longitude], {
        icon: vehicleIcon,
        title: vehicle.name
      });

      // Create popup content
      const popupContent = this.createPopupContent(vehicle);
      vehicleMarker.bindPopup(popupContent, {
        className: 'custom-popup',
        maxWidth: 320,
        closeButton: true
      });

      vehicleMarker.on('click', () => {
        console.log('Vehicle clicked:', vehicle);
      });

      return vehicleMarker;
    } catch (error) {
      console.error('Error creating marker for vehicle:', vehicle, error);
      return null;
    }
  }
}
