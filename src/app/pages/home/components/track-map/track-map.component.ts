import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { 
  icon, 
  latLng, 
  Map, 
  marker, 
  tileLayer, 
  Marker, 
  LayerGroup,
  DivIcon,
  divIcon,
  MarkerClusterGroup,
  control
} from 'leaflet';
import 'leaflet.markercluster';
import { Observable, Subject, takeUntil, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { 
  selectVehicleLoading, 
  selectVehiclePolling, 
  selectFilteredVehicles,
  selectVehiclesLoaded,
  selectCurrentFilter,
  selectSearchTerm,
  selectSelectedVehicle
} from '../../../../store/vehicle/vehicle.selectors';
import { loadVehicles, searchVehicles } from '../../../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';

// Extend the Leaflet namespace to include MarkerClusterGroup
declare global {
  namespace L {
    function markerClusterGroup(options?: any): MarkerClusterGroup;
  }
}

interface VehicleData {
  id: number;
  name: string;
  lastUpdated: string;
  location: string;
  status: string;
  apiObject: {
    device: {
      deviceId: string;
      vehicleNo: string;
      vehicleType: number;
      deviceType: number;
      id: number;
      details: {
        lastOdometer: number;
        lastEngineHours: number;
      };
    };
    parking: any;
    position: {
      status: {
        status: string;
        duration: string;
      };
      protocol: string;
      servertime: string;
      deviceTime: string;
      valid: number;
      latitude: number;
      longitude: number;
      speed: number;
      heading: number;
      altitude: number;
      accuracy: number;
      details: {
        adc: number;
        armed: boolean;
        battPer:number
        bmsSOC: number;
        charge: boolean;
        distance: number;
        door: boolean;
        engHours: number;
        extVolt: number;
        ign: boolean;
        intVolt: number;
        motion: boolean;
        rssi: number;
        sat: number;
        temp: number;
        totalDistance: number;
        vDuration: number;
        vStatus: string;
        versionFw: string;
      };
    };
    validity: {
      installationOn: string;
      nextRechargeDate: string;
      customerRechargeDate: string;
    };
  };
}

@Component({
  selector: 'app-track-map',
  standalone: true,
  imports: [LeafletModule, CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
  template: `
    <div class="relative">
      <!-- Loading overlay -->
      <div *ngIf="loading$ | async" 
           class="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
          <span class="text-sm text-gray-700 font-medium">Loading vehicles...</span>
        </div>
      </div>
      
      <!-- Search Input -->
      <!-- <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-80">
        <p-iconField iconPosition="left" class="w-full">
          <p-inputIcon>
            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </p-inputIcon>
          <input 
            pInputText 
            [(ngModel)]="searchTerm"
            (input)="onSearchChange($event)"
            placeholder="Search vehicles on map..." 
            class="w-full pl-10 pr-4 py-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg focus:border-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)]/20 transition-all duration-200"
          />
        </p-iconField>
      </div> -->

      <!-- Right side controls -->
      <div class="absolute top-4 right-4 z-[1000] flex flex-col space-y-3">
        <!-- Your Location Button -->
        <button 
          (click)="goToUserLocation()"
          [disabled]="gettingLocation"
          class="bg-white/95 backdrop-blur-sm hover:bg-[var(--primary-color)] hover:text-white disabled:opacity-50 p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 group"
          title="Go to your location">
          <svg *ngIf="!gettingLocation" class="w-5 h-5 text-gray-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <div *ngIf="gettingLocation" class="w-5 h-5 border-2 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin"></div>
        </button>

        <!-- Layer Switching Button -->
        <button 
          (click)="switchMapLayer()"
          class="bg-white/95 backdrop-blur-sm hover:bg-[var(--primary-color)] hover:text-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 group"
          title="Switch map layer">
          <svg class="w-5 h-5 text-gray-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
          </svg>
        </button>

        <!-- Fit All Markers Button -->
        <button 
          (click)="fitAllMarkers()"
          class="bg-white/95 backdrop-blur-sm hover:bg-[var(--primary-color)] hover:text-white p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 group"
          title="Fit all vehicles">
          <svg class="w-5 h-5 text-gray-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
          </svg>
        </button>

        <!-- Toggle Clustering Button -->
        <button 
          (click)="toggleClustering()"
          [class]="clusteringEnabled ? 'bg-[var(--primary-color)] text-white' : 'bg-white/95 text-gray-700 hover:bg-[var(--primary-color)] hover:text-white'"
          class="backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200 transition-all duration-200 group"
          title="Toggle clustering">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </button>
      </div>
      
      <div
        leaflet
        [leafletOptions]="options"
        (leafletMapReady)="onMapReady($event)"
        class="h-[calc(100vh-60px)] w-[calc(100vw-430px)] lg:w-[calc(100vw-430px)] lg:h-[calc(100vh-60px)]">
      </div>

      <!-- User location marker (hidden, used for animation) -->
      <div *ngIf="userLocationMarker" class="hidden"></div>
    </div>
  `,
  styles: [`
    /* User location marker styles */
.user-location-marker {
  background: transparent !important;
  border: none !important;
}

.user-location-popup .leaflet-popup-content-wrapper {
  background-color: var(--primary-color);
  color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.user-location-popup .leaflet-popup-tip {
  background-color: var(--primary-color);
  border: none;
}

/* Map layer transition effects */
.leaflet-layer {
  transition: opacity 0.3s ease-in-out;
}

/* Search input focus effects with CSS variables */
.p-inputtext:focus {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb, 59, 130, 246), 0.2) !important;
}

/* Button hover effects using CSS variables */
.map-control-button:hover {
  background-color: var(--primary-color) !important;
  color: white !important;
}

/* Zoom control positioning */
.leaflet-control-zoom {
  position: absolute !important;
  bottom: 20px !important;
  right: 20px !important;
  top: auto !important;
}

.leaflet-control-zoom a {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(4px) !important;
  border: 1px solid #e5e7eb !important;
  color: #374151 !important;
  transition: all 0.2s ease-in-out !important;
}

.leaflet-control-zoom a:hover {
  background-color: var(--primary-color) !important;
  color: white !important;
  border-color: var(--primary-color) !important;
}

/* Custom scrollbar for popup content */
.leaflet-popup-content::-webkit-scrollbar {
  width: 4px;
}

.leaflet-popup-content::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.leaflet-popup-content::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 2px;
  opacity: 0.7;
}

.leaflet-popup-content::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}

/* Responsive adjustments for mobile */
@media (max-width: 768px) {
  .marker-cluster-small,
  .marker-cluster-medium,
  .marker-cluster-large {
    width: 35px !important;
    height: 35px !important;
  }
  
  .marker-cluster-small div,
  .marker-cluster-medium div,
  .marker-cluster-large div {
    width: 35px !important;
    height: 35px !important;
    line-height: 35px !important;
  }
  
  /* Adjust control button sizes for mobile */
  .leaflet-control-zoom a {
    width: 35px !important;
    height: 35px !important;
    line-height: 35px !important;
    font-size: 16px !important;
  }
  
  /* Make search input smaller on mobile */
  .search-input-mobile {
    width: 280px !important;
  }
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Pulse animation for active vehicles */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Ping animation for user location */
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}/* track-map.component.css - Styles that require CSS variables or can't be done with Tailwind */

/* Marker cluster background colors */
.marker-cluster-small {
  background-color: rgba(59, 130, 246, 0.8); /* bg-blue-500 with opacity */
}

.marker-cluster-medium {
  background-color: rgba(34, 197, 94, 0.8); /* bg-green-500 with opacity */
}

.marker-cluster-large {
  background-color: rgba(239, 68, 68, 0.8); /* bg-red-500 with opacity */
}

/* Cluster hover effects */
.marker-cluster-small:hover {
  background-color: rgba(59, 130, 246, 0.9);
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.marker-cluster-medium:hover {
  background-color: rgba(34, 197, 94, 0.9);
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

.marker-cluster-large:hover {
  background-color: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
  transition: all 0.2s ease-in-out;
}

/* Remove default leaflet cluster styles */
.leaflet-cluster-anim .leaflet-marker-icon, 
.leaflet-cluster-anim .leaflet-marker-shadow {
  transition: transform 0.3s ease-out, opacity 0.3s ease-in;
}

/* Custom popup styles for better integration with Tailwind */
.leaflet-popup-content-wrapper.custom-popup {
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  border: 1px solid #e5e7eb; /* border-gray-200 */
}

.leaflet-popup-content {
  margin: 0 !important;
}

.leaflet-popup-tip {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Remove default marker background */
.custom-vehicle-marker {
  background: transparent !important;
  border: none !important;
}

/* Responsive cluster sizes */
@media (max-width: 768px) {
  .marker-cluster-small,
  .marker-cluster-medium,
  .marker-cluster-large {
    width: 35px !important;
    height: 35px !important;
  }
  
  .marker-cluster-small div,
  .marker-cluster-medium div,
  .marker-cluster-large div {
    width: 35px !important;
    height: 35px !important;
    line-height: 35px !important;
  }
}
    
    `]
})
export class TrackMapComponent implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markersLayer!: LayerGroup;
  private clusterGroup!: MarkerClusterGroup;
  userLocationMarker?: Marker;
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  public clusteringEnabled = true;
  public searchTerm = '';
  public gettingLocation = false;
  public currentMapLayer = 'street';

  // Map layers
  private mapLayers = {
    street: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }),
    satellite: tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    }),
  };

  // NgRx Observables
  filteredVehicles$: Observable<any[]> = this.store.select(selectFilteredVehicles);
  loading$: Observable<boolean> = this.store.select(selectVehicleLoading);
  polling$: Observable<boolean> = this.store.select(selectVehiclePolling);
  vehiclesLoaded$: Observable<boolean> = this.store.select(selectVehiclesLoaded);
  currentFilter$: Observable<any> = this.store.select(selectCurrentFilter);
  searchTerm$: Observable<string> = this.store.select(selectSearchTerm);
  selectedVehicle$ = this.store.select(selectSelectedVehicle);

  options = {
    layers: [this.mapLayers.street],
    zoom: 7,
    center: latLng([46.879966, -121.726909]),
    zoomControl: false // Remove default zoom controls
  };

  ngAfterViewInit(): void {
    // Subscribe to filtered vehicles to update map markers
    this.subscribeToVehicleUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMapReady(map: Map): void {
    this.map = map;
    
    // Add custom zoom control to bottom right
    control.zoom({ position: 'bottomright' }).addTo(this.map);
    
    // Initialize marker cluster group
    this.initializeClusterGroup();
    
    // Initialize regular markers layer
    this.markersLayer = new LayerGroup();

    // Add the appropriate layer to map
    if (this.clusteringEnabled) {
      this.clusterGroup.addTo(this.map);
    } else {
      this.markersLayer.addTo(this.map);
    }

    // Set up map event handlers
    this.setupMapEventHandlers();
  }

  private initializeClusterGroup(): void {
    this.clusterGroup = (L as any).markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 15,
      animate: true,
      animateAddingMarkers: true
    });

    this.clusterGroup.on('clustermouseover', (e: any) => {
      e.layer.bindTooltip(`${e.layer.getChildCount()} vehicles`, {
        direction: 'top',
        className: 'bg-gray-800 text-white px-2 py-1 rounded text-xs'
      }).openTooltip();
    });
  }

  private subscribeToVehicleUpdates(): void {
    this.filteredVehicles$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((vehicles) => {
      if (this.map) {
        this.updateMapMarkers(vehicles);
      }
    });

    this.selectedVehicle$.pipe(
      takeUntil(this.destroy$)).subscribe((vehicle) => {
        if(this.map && vehicle) {
          this.updateMapMarkers([vehicle],true);
        }
      })
  }

  private updateMapMarkers(vehicles: VehicleData[], isSingleSubscribed?:boolean): void {
    // Clear existing markers
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.clearLayers();
    } else if (this.markersLayer) {
      this.markersLayer.clearLayers();
    }

    if (!vehicles || vehicles.length === 0) {
      console.log('No vehicles to display on map');
      return;
    }

    const validVehicles = vehicles.filter(vehicle => 
      vehicle.apiObject?.position?.latitude && 
      vehicle.apiObject?.position?.longitude && 
      !isNaN(vehicle.apiObject.position.latitude) && 
      !isNaN(vehicle.apiObject.position.longitude)
    );

    console.log(`Displaying ${validVehicles.length} vehicles on map`);

    // Create markers for each vehicle
    const markers: Marker[] = [];
    validVehicles.forEach(vehicle => {
      const vehicleMarker = this.createVehicleMarker(vehicle);
      if (vehicleMarker) {
        markers.push(vehicleMarker);
      }
    });

    // Add markers to appropriate layer
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.addLayers(markers);
    } else if (this.markersLayer) {
      markers.forEach(marker => this.markersLayer.addLayer(marker));
    }

    // Fit map bounds to show all markers if there are vehicles
    if (validVehicles.length > 0) {
      setTimeout(() => this.fitMapToMarkers(validVehicles, isSingleSubscribed), 100);
    }
  }

  private createVehicleMarker(vehicle: VehicleData): Marker | null {
    try {
      const position = vehicle.apiObject.position;
      const vehicleIcon = this.getVehicleIcon(position.status.status);
      
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

  private getVehicleIcon(status: string): DivIcon {
    const statusConfig: { [key: string]: { color: string; bgColor: string; pulseColor: string } } = {
      'running': { color: 'text-white', bgColor: 'bg-green-500', pulseColor: 'shadow-green-400' },
      'dormant': { color: 'text-white', bgColor: 'bg-yellow-500', pulseColor: 'shadow-yellow-400' },
      'stop': { color: 'text-white', bgColor: 'bg-red-500', pulseColor: 'shadow-red-400' },
      // 'maintenance': { color: 'text-white', bgColor: 'bg-purple-500', pulseColor: 'shadow-purple-400' },
      'offline': { color: 'text-white', bgColor: 'bg-gray-500', pulseColor: 'shadow-gray-400' },
      'default': { color: 'text-white', bgColor: 'bg-grey-200', pulseColor: 'shadow-grey-300' }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig['default'];
    const isRunning = status?.toLowerCase() === 'running';
    
    return divIcon({
      className: 'custom-vehicle-marker',
      html: `
        <div class="relative">
          <div class="w-4 h-4 ${config.bgColor} rounded-full border-2 border-white shadow-lg ${config.color} flex items-center justify-center ${isRunning ? 'animate-pulse' : ''}">
            <div class="w-2 h-2 bg-white rounded-full opacity-80"></div>
          </div>
          ${isRunning ? `<div class="absolute inset-0 ${config.bgColor} rounded-full animate-ping opacity-25"></div>` : ''}
        </div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  }

  private createPopupContent(vehicle: VehicleData): string {
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

  private fitMapToMarkers(vehicles: VehicleData[], isSingleSubscribed?:boolean): void {
    if (vehicles.length === 1) {
      const pos = vehicles[0].apiObject.position;
      this.map.setView([pos.latitude, pos.longitude], !isSingleSubscribed ? 12 : 18);
    } else if (vehicles.length > 1) {
      const bounds = vehicles.map(v => [v.apiObject.position.latitude, v.apiObject.position.longitude] as [number, number]);
      this.map.fitBounds(bounds, { padding: [20, 20] });
    }
  }

  private setupMapEventHandlers(): void {
    this.map.on('zoomend', () => {
      console.log('Map zoom level:', this.map.getZoom());
    });
  }

  // Search functionality
  onSearchChange(event: any): void {
    const searchTerm = event.target.value || '';
    this.store.dispatch(searchVehicles({ searchTerm }));
  }

  // Get user location
  goToUserLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    this.gettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Remove existing user location marker
        if (this.userLocationMarker) {
          this.map.removeLayer(this.userLocationMarker);
        }

        // Create animated user location marker
        const userIcon = divIcon({
          className: 'user-location-marker',
          html: `
            <div class="relative">
              <div class="w-6 h-6 bg-[var(--primary-color)] rounded-full border-4 border-white shadow-lg animate-pulse">
                <div class="absolute inset-0 bg-[var(--primary-color)] rounded-full animate-ping opacity-25"></div>
              </div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        this.userLocationMarker = marker([lat, lng], { icon: userIcon });
        this.userLocationMarker.bindPopup('Your Location', {
          className: 'user-location-popup'
        });
        
        this.userLocationMarker.addTo(this.map);
        
        // Animate to user location
        this.map.flyTo([lat, lng], 18, {
          animate: true,
          duration: 2
        });

        this.gettingLocation = false;
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your browser settings.');
        this.gettingLocation = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  // Switch map layers
  switchMapLayer(): void {
    const layers = Object.keys(this.mapLayers);
    const currentIndex = layers.indexOf(this.currentMapLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    const nextLayer = layers[nextIndex];

    // Remove current layer
    this.map.removeLayer(this.mapLayers[this.currentMapLayer as keyof typeof this.mapLayers]);
    
    // Add new layer
    this.map.addLayer(this.mapLayers[nextLayer as keyof typeof this.mapLayers]);
    
    this.currentMapLayer = nextLayer;
    console.log('Switched to map layer:', nextLayer);
  }

  // Public methods
  public fitAllMarkers(): void {
    this.filteredVehicles$.pipe(takeUntil(this.destroy$)).subscribe(vehicles => {
      if (vehicles && vehicles.length > 0) {
        this.fitMapToMarkers(vehicles);
      }
    });
  }

  public toggleClustering(): void {
    this.clusteringEnabled = !this.clusteringEnabled;
    
    if (this.clusteringEnabled) {
      this.map.removeLayer(this.markersLayer);
      this.clusterGroup.addTo(this.map);
    } else {
      this.map.removeLayer(this.clusterGroup);
      this.markersLayer.addTo(this.map);
    }

    this.filteredVehicles$.pipe(takeUntil(this.destroy$)).subscribe(vehicles => {
      this.updateMapMarkers(vehicles);
    });
  }

  public refreshMap(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  public centerOnVehicle(vehicleId: string): void {
    this.filteredVehicles$.pipe(takeUntil(this.destroy$)).subscribe(vehicles => {
      const vehicle = vehicles.find(v => v.id.toString() === vehicleId);
      if (vehicle && vehicle.apiObject?.position) {
        const pos = vehicle.apiObject.position;
        this.map.setView([pos.latitude, pos.longitude], 15);
      }
    });
  }
}