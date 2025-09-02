import { ButtonModule } from 'primeng/button';
import 'leaflet-trackplayer';
import 'leaflet-ant-path';
import { Component, OnDestroy, inject, Input, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { 
  latLng, 
  Map, 
  tileLayer, 
  Marker, 
  divIcon,
  marker
} from 'leaflet';
import 'leaflet.markercluster';
import { Observable, Subject, takeUntil, withLatestFrom, filter, combineLatest, map, pairwise } from 'rxjs';
import { 
  selectFilteredVehicles,
  selectVehiclePolling,
  selectSelectedVehicle,
  selectVehicleLoading
} from '../../../../store/vehicle/vehicle.selectors';
import { filterVehicles, loadVehicles, searchVehicles, selectVehicle, stopSingleVehiclePolling } from '../../../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';
import { selectGeofences, selectSelectedGeofence } from '../../../../store/geofence/geofence.selectors';
import { PathReplayService } from '../../../service/path-replay.service';
import { VehicleMarkerService } from '../../../service/vehicle-marker.service';
import { LiveTrackingControl, TrackMapService } from '../../../service/track-map.service';
import { VehicleData } from '../../../../shared/interfaces/vehicle';
import { VehicleStatusLabelPipe } from '../../../../shared/pipes/vehicle-status-label.pipe';
import { VehicleStatusPipe } from '../../../../shared/pipes/vehicle-status.pipe';
import { CdkDrag, CdkDragHandle } from "@angular/cdk/drag-drop";
import { UiService } from '../../../../layout/service/ui.service';
import { TRIAL_PATH_COLORS } from '../../../../shared/utils/helper_functions';

@Component({
  selector: 'app-track-map',
  standalone: true,
  imports: [ButtonModule, LeafletModule, CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule, VehicleStatusPipe, CdkDrag, CdkDragHandle],
  templateUrl: './track-map.component.html',
  styleUrl: './track-map.component.scss'
})
export class TrackMapComponent implements OnDestroy, OnChanges {
  @Input() activeTab: 'vehicles' | 'geofences' = 'vehicles';
  
  public userLocationMarker?: Marker;
  private uiService = inject(UiService);
  private store = inject(Store);
  private pathReplayService = inject(PathReplayService);
  private vehicleMarkerService = inject(VehicleMarkerService);
  public trackMapService = inject(TrackMapService);
  private destroy$ = new Subject<void>();
  private firstVehicleUpdate = true;

  public clusteringEnabled = true;
  public searchTerm = '';
  public gettingLocation = false;
  public currentMapLayer = 'street';

  // Map layers configuration
  private readonly mapLayers = {
    street: tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }),
    satellite: tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    }),
  };

  // Store selectors
  private readonly filteredVehicles$ = this.store.select(selectFilteredVehicles);
  private readonly polling$ = this.store.select(selectVehiclePolling);
  public readonly loading$: Observable<boolean> = this.store.select(selectVehicleLoading);

  private readonly selectedVehicle$ = this.store.select(selectSelectedVehicle);
  private readonly geofences$ = this.store.select(selectGeofences);
  private readonly selectedGeofence$ = this.store.select(selectSelectedGeofence);

  readonly options = {
    layers: [this.mapLayers.street],
    zoom: 7,
    center: latLng([46.879966, -121.726909]),
    zoomControl: false
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['activeTab']) return;

    this.destroy$.next();
    
    switch (this.activeTab) {
      case 'vehicles':
        setTimeout(() => this.initializeVehicleSubscriptions(), 100);
        break;
      case 'geofences':
        this.initializeGeofenceSubscriptions();
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMapReady(map: Map): void {
    this.trackMapService.initializeMap(map, this.clusteringEnabled);
    this.setupMapEventHandlers();
  }

  private initializeVehicleSubscriptions(): void {
    this.setupFilteredVehiclesSubscription();
    this.setupSingleVehiclePolling();
    this.setupPathReplaySubscriptions();
  }

  private setupFilteredVehiclesSubscription(): void {
    this.filteredVehicles$.pipe(
      takeUntil(this.destroy$),
      withLatestFrom(this.polling$),
      filter(([vehicles, polling]) => !polling)
    ).subscribe(([vehicles]) => {
      console.log('Filtered vehicles update (non-polling)');
      this.updateVehicleMarkers(vehicles);
    });
  }

  private setupSingleVehiclePolling(): void {
    combineLatest([this.selectedVehicle$, this.polling$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([vehicle, polling]) => !!vehicle && polling),
        map(([vehicle]) => vehicle ? { ...vehicle, apiObject: { ...vehicle.apiObject } } : null),
        pairwise(),
        filter(([prev, curr]) => this.shouldUpdateVehicle(prev, curr))
      )
      .subscribe(([previousVehicle, currentVehicle]) => {
        this.handleSingleVehicleUpdate(previousVehicle, currentVehicle);
      });
  }

  private shouldUpdateVehicle(prev: VehicleData | null, curr: VehicleData | null): boolean {
    if (!prev || prev.id !== curr?.id) {
      // Clear trail when vehicle changes
      if (prev && curr && prev.id !== curr.id) {
        this.trackMapService.clearVehicleTrail();
      }
      this.firstVehicleUpdate = true;
      return true;
    }

    if (this.firstVehicleUpdate) return true;

    const prevPos = prev.apiObject?.position;
    const currPos = curr.apiObject?.position;

    return prevPos?.latitude !== currPos?.latitude ||
           prevPos?.longitude !== currPos?.longitude ||
           prev.status !== curr.status ||
           prev.lastUpdated !== curr.lastUpdated;
  }

  private handleSingleVehicleUpdate(previousVehicle: VehicleData, currentVehicle: VehicleData): void {
    const prevPos = previousVehicle?.apiObject?.position;
    const currPos = currentVehicle?.apiObject?.position;

    console.log('Previous Lat/Lng:', prevPos?.latitude, prevPos?.longitude);
    console.log('Current Lat/Lng:', currPos?.latitude, currPos?.longitude);

    this.updateSingleVehicleMarker(currentVehicle, previousVehicle);
    this.trackMapService.updateLiveTrackingControlObj(
      {
        status: currentVehicle.status, 
        vehicleName: currentVehicle?.name,
        vehicleSpeed: currentVehicle?.apiObject?.position?.speed + ' Km/hr',
        vehicleTimestamp: currentVehicle.lastUpdated, 
        visible: true 
      } as LiveTrackingControl);
    if (this.firstVehicleUpdate && currPos) {
      this.trackMapService.flyToPosition(currPos.latitude, currPos.longitude, 16, 3);
      this.firstVehicleUpdate = false;
    }
  }

  private setupPathReplaySubscriptions(): void {
    this.pathReplayService.replayActive$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => this.handleReplayActive(active));

    this.pathReplayService.replayClosed$
      .pipe(
        withLatestFrom(this.filteredVehicles$),
        takeUntil(this.destroy$)
      )
      .subscribe(([_, vehicles]) => this.handleReplayClosed(vehicles));
  }

  private handleReplayActive(active: any): void {
    console.log(active, 'replay active');

    if (!active?.value) {
      console.log('Replay disabled');
      return;
    }

    if (active.value && !active.formObj) {
      this.store.dispatch(stopSingleVehiclePolling());
      this.trackMapService.clearAllLayers(); // This will also clear trails
      console.log("Replay mode enabled 🚀");
    }

    if (active.value && active.formObj) {
      this.pathReplayService._initPathReplayFunc(active.formObj, this.trackMapService.getMapInstance());
    }
  }

  private handleReplayClosed(vehicles: VehicleData[]): void {
    console.log(vehicles, 'replay closed, restoring vehicles');
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.updateVehicleMarkers(vehicles);
  }

  private initializeGeofenceSubscriptions(): void {
    this.geofences$
      .pipe(takeUntil(this.destroy$))
      .subscribe((geofences) => {
        console.log('Geofences updated:', geofences);
        this.updateGeofences([]);
      });

    this.selectedGeofence$
      .pipe(takeUntil(this.destroy$))
      .subscribe((geofence) => {
        if (geofence) {
          console.log('Selected geofence:', geofence.geofence);
          this.updateGeofences([geofence.geofence]);
        }
      });
  }

  private updateVehicleMarkers(vehicles: VehicleData[]): void {
    this.trackMapService.clearGeofenceLayers();
    this.trackMapService.clearVehicleLayers();

    if (!vehicles?.length) {
      console.log('No vehicles to display on map');
      return;
    }

    const validVehicles = this.vehicleMarkerService.filterValidVehicles(vehicles);
    console.log(`Displaying ${validVehicles.length} vehicles on map`);

    const markers = this.vehicleMarkerService.createVehicleMarkers(validVehicles);
    this.trackMapService.addMarkersToLayer(markers);
    
    if (validVehicles.length > 0) {
      setTimeout(() => this.trackMapService.fitMapToMarkers(validVehicles), 100);
    }
  }

  private updateSingleVehicleMarker(currentVehicle: VehicleData, previousVehicle?: VehicleData): void {
    this.trackMapService.clearVehicleLayers();
    this.trackMapService.clearGeofenceLayers();

    // Add current position to vehicle trail
    const currentPos = currentVehicle.apiObject?.position;
    if (currentPos) {
      this.trackMapService.addToVehicleTrail(
        currentVehicle.id.toString(), 
        currentPos.latitude, 
        currentPos.longitude,
        TRIAL_PATH_COLORS[currentPos?.status?.status]
      );
    }

    const vehicleMarker = this.vehicleMarkerService.createAnimatedVehicleMarker(currentVehicle, previousVehicle);
    
    if (vehicleMarker) {
      this.trackMapService.addSingleMarkerToLayer(vehicleMarker);
    }
  }

  private updateGeofences(geofences: any[]): void {
    this.trackMapService.clearAllLayers();

    if (!geofences?.length) {
      console.log('No geofences to display on map');
      return;
    }

    geofences.forEach(geofence => {
      const geofenceLayer = this.trackMapService.createGeofenceLayer(geofence);
      this.trackMapService.addGeofenceToLayer(geofenceLayer);
    });

    this.trackMapService.addGeofenceLayerToMap();
    this.trackMapService.fitMapToGeofences();
  }

  private setupMapEventHandlers(): void {
    this.trackMapService.setupMapEventHandlers((zoom) => {
      console.log('Map zoom level:', zoom);
    });
  }

  // Public methods - User Interactions
  onSearchChange(event: any): void {
    const searchTerm = event.target.value || '';
    this.store.dispatch(searchVehicles({ searchTerm }));
  }

  goToUserLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    this.gettingLocation = true;

    navigator.geolocation.getCurrentPosition(
      (position) => this.handleLocationSuccess(position),
      (error) => this.handleLocationError(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }

  private handleLocationSuccess(position: GeolocationPosition): void {
    const { latitude: lat, longitude: lng } = position.coords;
    
    this.removeExistingUserMarker();
    this.createUserLocationMarker(lat, lng);
    this.trackMapService.flyToPosition(lat, lng, 18, 2);
    this.gettingLocation = false;
  }

  private handleLocationError(error: GeolocationPositionError): void {
    console.error('Error getting location:', error);
    alert('Unable to get your location. Please check your browser settings.');
    this.gettingLocation = false;
  }

  private removeExistingUserMarker(): void {
    if (this.userLocationMarker) {
      this.trackMapService.getMapInstance().removeLayer(this.userLocationMarker);
    }
  }

  private createUserLocationMarker(lat: number, lng: number): void {
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
    
    this.userLocationMarker.addTo(this.trackMapService.getMapInstance());
  }

  switchMapLayer(): void {
    const layers = Object.keys(this.mapLayers);
    const currentIndex = layers.indexOf(this.currentMapLayer);
    const nextIndex = (currentIndex + 1) % layers.length;
    const nextLayer = layers[nextIndex];

    const mapInstance = this.trackMapService.getMapInstance();
    mapInstance.removeLayer(this.mapLayers[this.currentMapLayer as keyof typeof this.mapLayers]);
    mapInstance.addLayer(this.mapLayers[nextLayer as keyof typeof this.mapLayers]);
    
    this.currentMapLayer = nextLayer;
    console.log('Switched to map layer:', nextLayer);
  }

  // Public API methods
  fitAllMarkers(): void {
    this.filteredVehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicles => {
        if (vehicles?.length > 0) {
          this.trackMapService.fitMapToMarkers(vehicles);
        }
      });
  }

  toggleClustering(): void {
    this.clusteringEnabled = !this.clusteringEnabled;
    this.trackMapService.toggleClustering(this.clusteringEnabled);
    
    this.filteredVehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicles => {
        this.updateVehicleMarkers(vehicles);
      });
  }

  refreshMap(): void {
    this.trackMapService.invalidateMapSize();
  }

  centerOnVehicle(vehicleId: string): void {
    this.filteredVehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(vehicles => {
        this.trackMapService.centerOnVehicle(vehicleId, vehicles);
      });
  }

  // Trail Management Methods
  clearVehicleTrail(): void {
    this.trackMapService.clearVehicleTrail();
  }

  toggleTrailVisibility(): void {
    const trailLayer = this.trackMapService.getVehicleTrailLayer();
    const mapInstance = this.trackMapService.getMapInstance();
    
    if(mapInstance.hasLayer(trailLayer)) {
      mapInstance.removeLayer(trailLayer)
    } else {
      trailLayer.addTo(mapInstance);
    }
  }

  getCurrentTrackedVehicleId(): string | null {
    return this.trackMapService.getCurrentTrailVehicleId();
  }

  exitTracking() {
    this.trackMapService.clearAllLayers();
    this.uiService.closeDrawer();
    this.trackMapService.updateLiveTrackingControlObj({} as LiveTrackingControl)
    this.store.dispatch(stopSingleVehiclePolling());
    this.store.dispatch(selectVehicle({ vehicle: null }));
    this.store.dispatch(loadVehicles());

  }
}