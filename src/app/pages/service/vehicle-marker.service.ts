import { DivIcon, divIcon, marker, Marker } from 'leaflet';
import { Store } from '@ngrx/store';
import { Injectable, inject } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { selectVehicleTypes } from '../../store/vehicle-type/selectors';
import { VehicleData } from '../../shared/interfaces/vehicle';

export interface VehicleIconConfig {
  vehicleTypeId: number;
  status: string;
  heading: number;
  size?: [number, number];
  className?: string;
}

export interface MarkerTooltipConfig {
  vehicle: VehicleData;
  className?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  permanent?: boolean;
}

@Injectable({ providedIn: 'root' })
export class VehicleMarkerService {
  private store = inject(Store);
  private vehicleTypes: { id: number; name: string }[] = [];
  private loaded = false;
  vehicleTypes$ = this.store.select(selectVehicleTypes);

  public singleVehicleMarker:any;
  // Default icon configurations
  private readonly defaultIconSize: [number, number] = [32, 32];
  private readonly defaultIconAnchor: [number, number] = [16, 16];

  constructor() {
    // Only subscribe once
    this.vehicleTypes$.pipe(filter(types => !!types)).subscribe((types: any) => {
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

  public getVehicleIcon(config: VehicleIconConfig): DivIcon {
     const {
      vehicleTypeId,
      status,
      heading,
      size = this.defaultIconSize,
      className = 'vehicle-marker'
    } = config;
    if (!this.loaded) {
      console.warn('Vehicle types not loaded yet.');
    }

    const vehicleName = this.getVehicleNameById(vehicleTypeId).toLowerCase().replace(/\s+/g, '_');
    const color = this.getStatusColor(status);

    const iconFile = `images/vehicles/rp_marker_${vehicleName}_${color}.png`;

    return divIcon({
      className: `${className} vehicle-${vehicleTypeId} status-${status}`,
      html: `<img src="${iconFile}" alt="${vehicleName}" class="w-12 h-12"  style="transform: rotate(${heading}deg); transform-origin: center center;" />`,
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1] / 2]
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

  generateTooltipContent(vehicle: VehicleData): string {
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



  /**
   * Sets up tooltip for a marker
   */
  private setupMarkerTooltip(marker: L.Marker, config: MarkerTooltipConfig): void {
    const {
      vehicle,
      className = 'vehicle-tooltip',
      direction = 'top',
      permanent = false
    } = config;

    const tooltipContent = this.generateTooltipContent(vehicle);
    
    marker.bindTooltip(tooltipContent, {
      direction,
      className,
      permanent,
      offset: [0, -10]
    });
  }


  /**
   * Sets up click handler for a marker
   */
  private setupMarkerClickHandler(marker: L.Marker, vehicle: VehicleData): void {
    marker.on('click', () => {
      console.log('Vehicle marker clicked:', vehicle.name);
      // Emit event or call callback if needed
      this.onVehicleMarkerClick(vehicle);
    });
  }

  /**
   * Handles vehicle marker click events
   */
  private onVehicleMarkerClick(vehicle: VehicleData): void {
    // This can be extended to emit events or call callbacks
    console.log('Vehicle selected:', vehicle);
  }


  /**
   * Creates a vehicle marker with icon, tooltip, and click handlers
   */
  createVehicleMarker(vehicle: VehicleData): L.Marker | null {

    const { latitude, longitude } = vehicle.apiObject.position;
    const vehicleIcon = this.getVehicleIcon({
      vehicleTypeId: vehicle.apiObject.device?.vehicleType,
      status: vehicle.apiObject?.position.status.status,
      heading: vehicle.apiObject?.position.heading || 0
    });

    const vehicleMarker = marker([latitude, longitude], {
      icon: vehicleIcon,
      title: vehicle.name,
      alt: `Vehicle: ${vehicle.name}`
    });

    this.setupMarkerTooltip(vehicleMarker, { vehicle });
    this.setupMarkerClickHandler(vehicleMarker, vehicle);

    return vehicleMarker;
  }

    /**
   * Creates multiple vehicle markers from array
   */
  createVehicleMarkers(vehicles: VehicleData[]): L.Marker[] {
    return vehicles
      .map(vehicle => this.createVehicleMarker(vehicle))
      .filter(marker => marker !== null) as L.Marker[];
  }



    /**
   * Creates an animated vehicle marker for single vehicle tracking
   */
  createAnimatedVehicleMarker(
    currentVehicle: VehicleData, 
    previousVehicle?: VehicleData
  ): L.Marker | null {

    const vehicleIcon = this.getVehicleIcon({
      vehicleTypeId: currentVehicle.apiObject.device?.vehicleType,
      status: currentVehicle.apiObject?.position.status.status,
      heading: currentVehicle.apiObject?.position.heading
    });

    const startPosition = previousVehicle?.apiObject?.position || currentVehicle.apiObject?.position;
    const endPosition = currentVehicle.apiObject?.position;

    const vehicleMarker = marker(
      [startPosition.latitude, startPosition.longitude],
      {
        icon: vehicleIcon,
        title: currentVehicle.name
      }
    );

    // Animate to new position
    vehicleMarker.setLatLng([endPosition.latitude, endPosition.longitude]);
    
    this.setupMarkerTooltip(vehicleMarker, { vehicle: currentVehicle });
    this.setupMarkerClickHandler(vehicleMarker, currentVehicle);

    return vehicleMarker;
  }

  /**
   * Validates if vehicle has valid position data
   */
  private isValidVehiclePosition(vehicle: VehicleData): boolean {
    const position = vehicle.apiObject?.position;
    return !!(
      position?.latitude &&
      position?.longitude &&
      !isNaN(position.latitude) &&
      !isNaN(position.longitude)
    );
  }

   /**
   * Validates array of vehicles for mapping
   */
  filterValidVehicles(vehicles: VehicleData[]): VehicleData[] {
    return vehicles.filter(vehicle => this.isValidVehiclePosition(vehicle));
  }


}
