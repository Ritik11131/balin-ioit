import 'leaflet-trackplayer';

import { Component, AfterViewInit, OnDestroy, inject, Input, SimpleChanges, OnChanges } from '@angular/core';
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
import { loadVehicles, searchVehicles, stopSingleVehiclePolling } from '../../../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';
import { selectGeofences, selectSelectedGeofence } from '../../../../store/geofence/geofence.selectors';
import { PathReplayService } from '../../../service/path-replay.service';

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
 templateUrl:'./track-map.component.html',
 styleUrl:'./track-map.component.scss'
})
export class TrackMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() activeTab: 'vehicles' | 'geofences' = 'vehicles';
  
  private map!: L.Map;
  private vehicleLayer!: LayerGroup;
  private geofenceLayer!: L.FeatureGroup;
  private clusterGroup!: MarkerClusterGroup;
  userLocationMarker?: Marker;
  private store = inject(Store);
  private pathReplayService = inject(PathReplayService);
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

  geofences$ = this.store.select(selectGeofences);
  selectedGeofence$ = this.store.select(selectSelectedGeofence);

  options = {
    layers: [this.mapLayers.street],
    zoom: 7,
    center: latLng([46.879966, -121.726909]),
    zoomControl: false // Remove default zoom controls
  };

  ngOnChanges(changes: SimpleChanges) {
  if (changes['activeTab']) {
    this.destroy$.next(); // clean previous subscriptions

    if (this.activeTab === 'vehicles') {      
      this.subscribeToVehicleUpdates();
    } else if (this.activeTab === 'geofences') {      
      this.subscribeToGeofenceUpdates();
    }
  }
}


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
    this.vehicleLayer = new LayerGroup();
    this.geofenceLayer = L.featureGroup();

    // Add the appropriate layer to map
    if (this.clusteringEnabled) {
      this.clusterGroup.addTo(this.map);
    } else {
      this.vehicleLayer.addTo(this.map);
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
        if (this.map && vehicle) {
          this.updateMapMarkers([vehicle], true);
        }
      })

    this.pathReplayService.replayActive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        console.log(active, 'active');

        if (!active?.value) {
          console.log('Disabled');
          return
        };

        if (active?.value && !active.formObj) {
          this.store.dispatch(stopSingleVehiclePolling());
          this.clearLayers();
          console.log("Replay mode is enabled in Track Component 🚀");
        }

        if (active?.value && active.formObj) {
          this.pathReplayService._initPathReplayFunc(active.formObj, this.map);
        }

      });


  }

  private clearLayers() {
     if (this.clusteringEnabled && this.clusterGroup) {
            this.clusterGroup.clearLayers();
          }
          if (this.vehicleLayer) {
            this.vehicleLayer.clearLayers();
          }

          // 🧹 Clear old geofences
          if (this.geofenceLayer) {
            this.geofenceLayer.clearLayers();
          }
  }

  private subscribeToGeofenceUpdates(): void {
    this.geofences$
      .pipe(takeUntil(this.destroy$))
      .subscribe((geofences) => {
        if (this.map) {
          console.log(geofences);
          this.updateMapGeofences(geofences);
        }
      });

    this.selectedGeofence$
      .pipe(takeUntil(this.destroy$))
      .subscribe((geofence) => {
        if (this.map && geofence) {
          console.log(geofence);
        this.updateMapGeofences([geofence]);
        }
      });
  }

  private updateMapGeofences(geofences: any[]): void {
    // 🧹 Clear vehicle markers when showing geofences
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.clearLayers();
    }
    if (this.vehicleLayer) {
      this.vehicleLayer.clearLayers();
    }

    // 🧹 Clear old geofences
    if (this.geofenceLayer) {
      this.geofenceLayer.clearLayers();
    }

    if(!geofences || geofences.length === 0) {
      console.log('No geofences to display on map');
      return;
    }

    geofences.forEach(g => {
    const geofenceLayer = this.createGeofenceLayer(g);
    geofenceLayer.addTo(this.geofenceLayer);
  });

  this.geofenceLayer.addTo(this.map);

  if (this.geofenceLayer && this.geofenceLayer.getLayers().length > 0) {
  this.map.fitBounds(this.geofenceLayer.getBounds(), { padding: [20, 20] });
}

  }

  private updateMapMarkers(vehicles: VehicleData[], isSingleSubscribed?:boolean): void {
    // 🧹 Clear geofences when showing vehicles
    if (this.geofenceLayer) {
      this.geofenceLayer.clearLayers();
    }
    // Clear existing markers
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.clearLayers();
    } else if (this.vehicleLayer) {
      this.vehicleLayer.clearLayers();
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
    } else if (this.vehicleLayer) {
      markers.forEach(marker => this.vehicleLayer.addLayer(marker));
    }

    // Fit map bounds to show all markers if there are vehicles
    if (validVehicles.length > 0) {
      setTimeout(() => this.fitMapToMarkers(validVehicles, isSingleSubscribed), 100);
    }
  }


  private createGeofenceLayer(geofence: any): L.Layer {
  try {
    const parsedGeometry = JSON.parse(geofence.geofenceGeometry);
    const color = geofence.color || '#3388ff';

    // Create a FeatureGroup so we can call getBounds()
    const geofenceGroup = L.featureGroup();

    if (parsedGeometry.type === 'FeatureCollection') {
      parsedGeometry.features.forEach((feature: any) => {
        const { geometry, properties } = feature;

        if (geometry.type === 'Polygon') {
          const coords = geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
          const polygon = L.polygon(coords, {
            color: color,
            weight: 2,
            fillOpacity: 0.3
          });
          geofenceGroup.addLayer(polygon);
        } 
        
        else if (geometry.type === 'Point') {
          const lat = geometry.coordinates[1];
          const lng = geometry.coordinates[0];
          const radius = properties?.radius || geofence.radius || 100;

          const circle = L.circle([lat, lng], {
            radius: radius,
            color: color,
            weight: 2,
            fillOpacity: 0.3
          });
          geofenceGroup.addLayer(circle);
        }
      });
    }

    return geofenceGroup;
  } catch (error) {
    console.error('Error parsing geofence geometry:', error);
    return L.featureGroup(); // Return empty layer if failed
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
      this.map.removeLayer(this.vehicleLayer);
      this.clusterGroup.addTo(this.map);
    } else {
      this.map.removeLayer(this.clusterGroup);
      this.vehicleLayer.addTo(this.map);
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