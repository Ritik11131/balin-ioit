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
import { Observable, Subject, takeUntil, withLatestFrom, filter, combineLatest, distinctUntilChanged, startWith, map, pairwise } from 'rxjs';
import { 
  selectVehicleLoading, 
  selectVehiclePolling, 
  selectFilteredVehicles,
  selectVehiclesLoaded,
  selectCurrentFilter,
  selectSearchTerm,
  selectSelectedVehicle
} from '../../../../store/vehicle/vehicle.selectors';
import { loadVehicles, searchVehicles, selectVehicle, stopSingleVehiclePolling } from '../../../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';
import { selectGeofences, selectSelectedGeofence } from '../../../../store/geofence/geofence.selectors';
import { PathReplayService } from '../../../service/path-replay.service';
import { VehicleMarkerService } from '../../../service/vehicle-marker.service';

// Extend the Leaflet namespace to include MarkerClusterGroup
declare global {
  namespace L {
    function markerClusterGroup(options?: any): MarkerClusterGroup;
  }
}

export interface VehicleData {
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
  private vehicleMarkerService = inject(VehicleMarkerService);
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
  if (!changes['activeTab']) return;

  // Clean previous subscriptions
  this.destroy$.next();

  switch (this.activeTab) {
    case 'vehicles':
      // Delay to ensure map is initialized
      setTimeout(() => this.subscribeToVehicleUpdates(), 100);
      break;

    case 'geofences':
      this.subscribeToGeofenceUpdates();
      break;

    default:
      break;
  }
}



  ngAfterViewInit(): void {
    // Subscribe to filtered vehicles to update map markers
    // this.subscribeToVehicleUpdates();
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
     if (!this.map || !this.filteredVehicles$ || !this.selectedVehicle$ || !this.pathReplayService) return;

    this.filteredVehicles$.pipe(
    takeUntil(this.destroy$),
    withLatestFrom(this.polling$),
    filter(([vehicles, polling]) => !polling)).subscribe(([vehicles, _polling]) => {
    if (this.map) {
      console.log('filtered, polling not running');
      this.updateMapMarkers(vehicles);
    }
  });

    // this.selectedVehicle$.pipe(
    //   takeUntil(this.destroy$)).subscribe((vehicle) => {
    //     if (this.map && vehicle) {
    //         // this.cleanupAnimatedMarker();
    //     }
    //   })

    combineLatest([
      this.selectedVehicle$.pipe(startWith(null)),
      this.polling$
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([vehicle, polling]) => !!vehicle && polling),
        map(([vehicle]) => vehicle ? { ...vehicle, apiObject: { ...vehicle.apiObject } } : null),
        pairwise(),
        filter(([prev, curr]) => prev?.apiObject?.position?.latitude !== curr?.apiObject?.position?.latitude ||
          prev?.apiObject?.position?.longitude !== curr?.apiObject?.position?.longitude)
      )
      .subscribe(([previousVehicle, currentVehicle]) => {
        const prevPos = previousVehicle?.apiObject?.position;
        const currPos = currentVehicle?.apiObject?.position;

        console.log('Previous Lat/Lng:', prevPos?.latitude, prevPos?.longitude);
        console.log('Current Lat/Lng:', currPos?.latitude, currPos?.longitude);
        
        this.updateMapMarkers([currentVehicle], true, previousVehicle);
      });



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


    this.pathReplayService.replayClosed$
      .pipe(
        withLatestFrom(this.filteredVehicles$), // get latest vehicles from store
        takeUntil(this.destroy$)
      )
      .subscribe(([_, vehicles]) => {
        console.log(vehicles, 'okkkkk');
        this.store.dispatch(selectVehicle({vehicle: null}));
        if (this.map) {
          this.updateMapMarkers(vehicles); // redraw markers
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
          this.updateMapGeofences([]);
        }
      });

    this.selectedGeofence$
      .pipe(takeUntil(this.destroy$))
      .subscribe((geofence) => {
        if (this.map && geofence) {
          console.log(geofence.geofence);
        this.updateMapGeofences([geofence.geofence]);
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

private updateMapMarkers(
  vehicles: VehicleData[],
  isSingleSubscribed?: boolean,
  singleSubscribePreviousData?: any): void {
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
  console.log('isSingleSubscribed:', isSingleSubscribed);

  if (isSingleSubscribed) {
    const vehicle = vehicles[0];
    if (!vehicle) return;

    

  } else {
    // Multi-vehicle case
    const markers: L.Marker[] = [];

    validVehicles.forEach(vehicle => {
      const vehicleMarker = this.vehicleMarkerService.createVehicleMarker(vehicle);
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

    // Fit map bounds to show all markers
    if (validVehicles.length > 0) {
      setTimeout(() => this.fitMapToMarkers(validVehicles), 100);
    }
  }
}



  private createGeofenceLayer(geofence: any): L.Layer {
  try {
    const parsedGeometry = JSON.parse(geofence.geojson);
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

  private fitMapToMarkers(vehicles: VehicleData[]): void {
      const bounds = vehicles.map(v => [v.apiObject.position.latitude, v.apiObject.position.longitude] as [number, number]);
      this.map.fitBounds(bounds, { padding: [20, 20] });
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