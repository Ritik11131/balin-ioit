import { Injectable } from '@angular/core';
import { 
  Map, 
  LayerGroup, 
  MarkerClusterGroup,
  FeatureGroup,
  control
} from 'leaflet';
import { VehicleData } from '../../shared/interfaces/vehicle';

// Extend the Leaflet namespace to include MarkerClusterGroup
declare global {
  namespace L {
    function markerClusterGroup(options?: any): MarkerClusterGroup;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TrackMapService {
  private map!: L.Map;
  private vehicleLayer!: LayerGroup;
  private geofenceLayer!: L.FeatureGroup;
  private clusterGroup!: MarkerClusterGroup;
  private vehicleTrailLayer!: LayerGroup;
  private clusteringEnabled = true;
  private currentTrailVehicleId: string | null = null;
  private trailCoordinates: L.LatLng[] = [];

  initializeMap(map: L.Map, clusteringEnabled: boolean = true): void {
    this.map = map;
    this.clusteringEnabled = clusteringEnabled;
    this.initializeLayers();
    this.setupMapControls();
    this.addActiveLayerToMap();
  }

  private setupMapControls(): void {
    control.zoom({ position: 'bottomright' }).addTo(this.map);
  }

  private initializeLayers(): void {
    this.initializeClusterGroup();
    this.vehicleLayer = new LayerGroup();
    this.geofenceLayer = L.featureGroup();
    this.vehicleTrailLayer = new LayerGroup();
    this.vehicleTrailLayer.addTo(this.map);
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

    this.setupClusterEventHandlers();
  }

  private setupClusterEventHandlers(): void {
    this.clusterGroup.on('clustermouseover', (e: any) => {
      e.layer.bindTooltip(`${e.layer.getChildCount()} vehicles`, {
        direction: 'top',
        className: 'bg-gray-800 text-white px-2 py-1 rounded text-xs'
      }).openTooltip();
    });
  }

  private addActiveLayerToMap(): void {
    if (this.clusteringEnabled) {
      this.clusterGroup.addTo(this.map);
    } else {
      this.vehicleLayer.addTo(this.map);
    }
  }

  // Layer Management
  getVehicleLayer(): LayerGroup {
    return this.vehicleLayer;
  }

  getClusterGroup(): MarkerClusterGroup {
    return this.clusterGroup;
  }

  getGeofenceLayer(): L.FeatureGroup {
    return this.geofenceLayer;
  }

  isClusteringEnabled(): boolean {
    return this.clusteringEnabled;
  }

  // Layer Operations
  addMarkersToLayer(markers: L.Marker[]): void {
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.addLayers(markers);
    } else if (this.vehicleLayer) {
      markers.forEach(marker => this.vehicleLayer.addLayer(marker));
    }
  }

  addSingleMarkerToLayer(marker: L.Marker): void {
    if (this.clusteringEnabled && this.clusterGroup) {
      this.clusterGroup.addLayer(marker);
    } else if (this.vehicleLayer) {
      this.vehicleLayer.addLayer(marker);
    }
  }

  addGeofenceToLayer(geofenceLayer: L.Layer): void {
    geofenceLayer.addTo(this.geofenceLayer);
  }

  addGeofenceLayerToMap(): void {
    this.geofenceLayer.addTo(this.map);
  }

  getVehicleTrailLayer(): LayerGroup {
    return this.vehicleTrailLayer;
  }

  getCurrentTrailVehicleId(): string | null {
    return this.currentTrailVehicleId;
  }

  // Vehicle Trail Management
  addToVehicleTrail(vehicleId: string, lat: number, lng: number, heading: number): void {
    // If different vehicle selected, clear previous trail
    if (this.currentTrailVehicleId && this.currentTrailVehicleId !== vehicleId) {
      this.clearVehicleTrail();
    }

    this.currentTrailVehicleId = vehicleId;
    const newPoint = L.latLng(lat, lng);
    
    // Avoid duplicate points (if vehicle hasn't moved much)
    if (this.trailCoordinates.length === 0 || 
        this.getDistanceFromLastPoint(newPoint) > 10) { // 10 meters threshold
      this.trailCoordinates.push(newPoint);
      this.updateTrailPolyline(heading);
    }
  }

  private getDistanceFromLastPoint(newPoint: L.LatLng): number {
    if (this.trailCoordinates.length === 0) return Infinity;
    
    const lastPoint = this.trailCoordinates[this.trailCoordinates.length - 1];
    return newPoint.distanceTo(lastPoint);
  }

  private updateTrailPolyline(heading: number): void {
    // Clear existing trail polyline
    this.vehicleTrailLayer.clearLayers();

    if (this.trailCoordinates.length < 2) return;  

    // Create polyline with gradient effect
    const polyline = L.polyline(this.trailCoordinates, {
      color: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
      weight: 4,
      opacity: 0.8,
      smoothFactor: 1,
      className: 'vehicle-trail'
    });

    // Add fade effect by creating multiple segments with different opacities
    this.createFadingTrailSegments();
    
    // Add main polyline
    this.vehicleTrailLayer.addLayer(polyline);

    // Add direction arrows along the trail
    // this.addTrailDirectionArrows(heading);
  }

  private createFadingTrailSegments(): void {
    const segmentCount = Math.min(this.trailCoordinates.length - 1, 20); // Max 20 segments
    const startIndex = Math.max(0, this.trailCoordinates.length - segmentCount - 1);

    for (let i = startIndex; i < this.trailCoordinates.length - 1; i++) {
      const segmentIndex = i - startIndex;
      const opacity = 0.3 + (segmentIndex / segmentCount) * 0.5; // 0.3 to 0.8 opacity
      
      const segment = L.polyline(
        [this.trailCoordinates[i], this.trailCoordinates[i + 1]], 
        {
          color: '#3b82f6',
          weight: 3,
          opacity: opacity,
          className: 'vehicle-trail-segment'
        }
      );
      
      this.vehicleTrailLayer.addLayer(segment);
    }
  }

  private addTrailDirectionArrows(heading: number): void {
    if (this.trailCoordinates.length < 2) return;

    // Add arrows every few points to show direction
    const arrowInterval = Math.max(1, Math.floor(this.trailCoordinates.length / 5));
    
    for (let i = arrowInterval; i < this.trailCoordinates.length; i += arrowInterval) {
      const currentPoint = this.trailCoordinates[i];
      const previousPoint = this.trailCoordinates[i - 1];
      
      // const bearing = this.calculateBearing(previousPoint, currentPoint);
      const arrowMarker = this.createArrowMarker(currentPoint, heading);
      
      this.vehicleTrailLayer.addLayer(arrowMarker);
    }
  }

  private createArrowMarker(position: L.LatLng, bearing: number): L.Marker {
    const arrowIcon = L.divIcon({
      className: 'trail-arrow',
      html: `<div style="transform: rotate(${bearing}deg); color: #3b82f6; font-size: 12px;">➤</div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });

    return L.marker(position, { icon: arrowIcon });
  }

  private calculateBearing(from: L.LatLng, to: L.LatLng): number {
    const fromLat = from.lat * Math.PI / 180;
    const fromLng = from.lng * Math.PI / 180;
    const toLat = to.lat * Math.PI / 180;
    const toLng = to.lng * Math.PI / 180;

    const deltaLng = toLng - fromLng;
    
    const x = Math.sin(deltaLng) * Math.cos(toLat);
    const y = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(deltaLng);
    
    const bearing = Math.atan2(x, y) * 180 / Math.PI;
    return (bearing + 360) % 360;
  }

  clearVehicleTrail(): void {
    this.vehicleTrailLayer.clearLayers();
    this.trailCoordinates = [];
    this.currentTrailVehicleId = null;
  }

  // Enhanced clearing operations
  clearVehicleLayers(): void {
    this.clusterGroup?.clearLayers();
    this.vehicleLayer?.clearLayers();
  }

  clearGeofenceLayers(): void {
    this.geofenceLayer?.clearLayers();
  }

  clearAllLayers(): void {
    this.clearVehicleLayers();
    this.clearGeofenceLayers();
    this.clearVehicleTrail();
  }

  // Map View Operations
  fitMapToMarkers(vehicles: VehicleData[]): void {
    if (!vehicles?.length) return;
    
    const bounds = vehicles.map(v => 
      [v.apiObject.position.latitude, v.apiObject.position.longitude] as [number, number]
    );
    this.map.fitBounds(bounds, { padding: [20, 20] });
  }

  fitMapToGeofences(): void {
    if (this.geofenceLayer && this.geofenceLayer.getLayers().length > 0) {
      this.map.fitBounds(this.geofenceLayer.getBounds(), { padding: [20, 20] });
    }
  }

  centerOnPosition(lat: number, lng: number, zoom: number = 15): void {
    this.map.setView([lat, lng], zoom);
  }

  flyToPosition(lat: number, lng: number, zoom: number = 14, duration: number = 3): void {
    this.map.flyTo([lat, lng], zoom, { animate: true, duration });
  }

  // Clustering Operations
  toggleClustering(enabled: boolean): void {
    this.clusteringEnabled = enabled;
    
    if (enabled) {
      this.map.removeLayer(this.vehicleLayer);
      this.clusterGroup.addTo(this.map);
    } else {
      this.map.removeLayer(this.clusterGroup);
      this.vehicleLayer.addTo(this.map);
    }
  }

  // Geofence Operations
  updateGeofences(geofences: any[]): void {
    this.clearAllLayers();

    if (!geofences?.length) {
      console.log('No geofences to display on map');
      return;
    }

    geofences.forEach(geofence => {
      const geofenceLayer = this.createGeofenceLayer(geofence);
      this.addGeofenceToLayer(geofenceLayer);
    });

    this.addGeofenceLayerToMap();
    this.fitMapToGeofences();
  }

  createGeofenceLayer(geofence: any): L.Layer {
    try {
      const parsedGeometry = JSON.parse(geofence.geojson);
      const color = geofence.color || '#3388ff';
      const geofenceGroup = L.featureGroup();

      if (parsedGeometry.type === 'FeatureCollection') {
        this.processGeofenceFeatures(parsedGeometry.features, color, geofenceGroup, geofence);
      }

      return geofenceGroup;
    } catch (error) {
      console.error('Error parsing geofence geometry:', error);
      return L.featureGroup();
    }
  }

  private createPolygonGeofence(geometry: any, color: string, geofenceGroup: L.FeatureGroup): void {
    const coords = geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
    const polygon = L.polygon(coords, {
      color: color,
      weight: 2,
      fillOpacity: 0.3
    });
    geofenceGroup.addLayer(polygon);
  }

  private processGeofenceFeatures(features: any[], color: string, geofenceGroup: L.FeatureGroup, geofence: any): void {
    features.forEach((feature: any) => {
      const { geometry, properties } = feature;

      if (geometry.type === 'Polygon') {
        this.createPolygonGeofence(geometry, color, geofenceGroup);
      } else if (geometry.type === 'Point') {
        this.createCircleGeofence(geometry, properties, color, geofenceGroup, geofence);
      }
    });
  }

  private createCircleGeofence(geometry: any, properties: any, color: string, geofenceGroup: L.FeatureGroup, geofence: any): void {
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

  // Utility Methods
  invalidateMapSize(): void {
    this.map?.invalidateSize();
  }

  getMapInstance(): L.Map {
    return this.map;
  }

  // Vehicle-specific operations
  findVehicleById(vehicleId: string, vehicles: VehicleData[]): VehicleData | undefined {
    return vehicles.find(v => v.id.toString() === vehicleId);
  }

  centerOnVehicle(vehicleId: string, vehicles: VehicleData[]): void {
    const vehicle = this.findVehicleById(vehicleId, vehicles);
    if (vehicle?.apiObject?.position) {
      const { latitude, longitude } = vehicle.apiObject.position;
      this.centerOnPosition(latitude, longitude);
    }
  }

  // Event Handlers Setup
  setupMapEventHandlers(onZoomEnd?: (zoom: number) => void): void {
    if (onZoomEnd) {
      this.map.on('zoomend', () => {
        onZoomEnd(this.map.getZoom());
      });
    }
  }
}