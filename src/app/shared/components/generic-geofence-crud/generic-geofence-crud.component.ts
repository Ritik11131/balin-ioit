import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UiService } from '../../../layout/service/ui.service';
import * as L from 'leaflet';
import 'leaflet-draw';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { GeofenceService } from '../../../pages/service/geofence.service';
import { GenericFormGeneratorComponent } from "../generic-form-generator/generic-form-generator.component";
import { CREATE_GEOFENCE_FORM_FIELDS } from '../../constants/forms';
import { WhitelabelThemeService } from '../../../pages/service/whitelabel-theme.service';

export interface GeofencePayload {
  id?: number;
  fkCustomerUserId?: number;
  color: string;
  radius?: number;
  geometryName: string;
  Geojson: string;
}

@Component({
  selector: 'app-geofence-crud',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    LeafletModule,
    InputTextModule,
    ColorPickerModule,
    InputNumberModule,
    ToastModule,
    ConfirmDialogModule,
    GenericFormGeneratorComponent
  ],
  templateUrl: './generic-geofence-crud.component.html',
  styleUrl: './generic-geofence-crud.component.scss'
})
export class GeofenceCrudComponent implements OnInit, OnDestroy {
  @Input() editGeofence?: GeofencePayload;

  private themeService = inject(WhitelabelThemeService);
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private drawControl!: L.Control.Draw;
  private currentLayer: L.Layer | null = null;
  private geometryType: 'circle' | 'polygon' | null = null;

  formData: any = { color: '', radius: 1000, geometryName: '' };
  formFields = CREATE_GEOFENCE_FORM_FIELDS;
  isSaving = false;

  tailwindColors500: Record<string, string> = {
    emerald: '#10B981', green: '#22C55E', lime: '#84CC16', orange: '#F97316',
    amber: '#F59E0B', yellow: '#EAB308', teal: '#14B8A6', cyan: '#06B6D4',
    sky: '#0EA5E9', blue: '#3B82F6', indigo: '#6366F1', violet: '#8B5CF6',
    purple: '#A855F7', fuchsia: '#D946EF', pink: '#EC4899', rose: '#F43F5E'
  };

  mapLayers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors', maxZoom: 18 }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: '&copy; Esri', maxZoom: 18 }),
  };

  editData!:any;

  options = {
    layers: [this.mapLayers.street],
    zoom: 7,
    center: L.latLng([46.879966, -121.726909]),
    zoomControl: false
  };

  constructor(
    private geofenceService: GeofenceService,
    private uiService: UiService
  ) {}

  ngOnInit() {
    // Set default color from theme
    this.themeService.theme$.subscribe(theme => {
      if (theme?.themeColor) this.formData.color = theme.themeColor;
    });

    if (this.editGeofence) this.loadEditData();
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  onMapReady(map: L.Map) {
    this.map = map;
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: { allowIntersection: false, drawError: { color: '#e1e100', message: 'Shape edges cannot cross!' }, shapeOptions: { color: this.formData.color, weight: 3, fillOpacity: 0.2 } },
        circle: { shapeOptions: { color: this.formData.color, weight: 3, fillOpacity: 0.2 } },
        rectangle: false, polyline: false, marker: false, circlemarker: false
      },
      edit: { featureGroup: this.drawnItems, remove: true }
    });

    this.map.addControl(this.drawControl);

    this.map.on(L.Draw.Event.CREATED, (e: any) => this.onDrawCreated(e));
    this.map.on(L.Draw.Event.EDITED, (e: any) => this.onDrawEdited(e));
    this.map.on(L.Draw.Event.DELETED, (e: any) => this.onDrawDeleted(e));
  }

  private onDrawCreated(event: any) {
    const layer = event.layer;
    this.drawnItems.clearLayers();
    this.drawnItems.addLayer(layer);
    this.currentLayer = layer;

    if (layer instanceof L.Circle) {
      this.geometryType = 'circle';
      const radius = Math.round(layer.getRadius());
      this.formData.radius = radius;
      layer.feature = {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [layer.getLatLng().lng, layer.getLatLng().lat] },
        properties: { radius, color: this.formData.color }
      };
    } else if (layer instanceof L.Polygon) {
      this.geometryType = 'polygon';
    }

    this.updateLayerColors(this.formData.color);
    this.uiService.showToast('success', 'Success', `${this.geometryType} created successfully`);
  }

  private onDrawEdited(event: any) {
    const layers = event.layers;
    layers.eachLayer((layer: any) => {
      if (layer instanceof L.Circle) {
        const radius = Math.round(layer.getRadius());
        this.formData.radius = radius;
        if (layer.feature) layer.feature.properties.radius = radius;
        else layer.feature = {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [layer.getLatLng().lng, layer.getLatLng().lat] },
          properties: { radius, color: this.formData.color }
        };
      }
    });
    this.uiService.showToast('info', 'Updated', `${this.geometryType} modified successfully`);
  }

  private onDrawDeleted(_: any) {
    this.currentLayer = null;
    this.geometryType = null;
    this.uiService.showToast('warn', 'Deleted', `${this.geometryType} deleted successfully`);
  }

  private updateLayerColors(color: string) {
    if (this.currentLayer && (this.currentLayer as any).setStyle) {
      (this.currentLayer as any).setStyle({ color, fillColor: color });
      // if (this.currentLayer.feature) this.currentLayer.feature.properties.color = color;
    }
  }

  private loadEditData() {
    if (!this.editGeofence) return;

    this.formData = {
      geometryName: this.editGeofence.geometryName,
      color: this.editGeofence.color,
      radius: this.editGeofence.radius || 1000
    };

    try {
      const geoJson = JSON.parse(this.editGeofence.Geojson);
      const geoLayer = L.geoJSON(geoJson, {
        style: { color: this.editGeofence.color, weight: 3, fillOpacity: 0.2 },
        pointToLayer: (feature, latlng) => {
          if (feature.properties?.radius) {
            const circle = L.circle(latlng, { radius: feature.properties.radius, color: this.editGeofence!.color, weight: 3, fillOpacity: 0.2 });
            circle.feature = feature;
            return circle;
          }
          return L.marker(latlng);
        }
      });

      geoLayer.eachLayer((layer: L.Layer) => {
        this.drawnItems.addLayer(layer);
        this.currentLayer = layer;
        this.geometryType = layer instanceof L.Circle ? 'circle' : 'polygon';
      });

      this.fitMapToGeometry();
    } catch {
      this.uiService.showToast('error', 'Error', 'Failed to load geometry data');
    }
  }

  private generateGeoJSON(): any {
    if (!this.currentLayer) throw new Error('No geometry selected');

    if (this.currentLayer instanceof L.Circle) {
      const center = this.currentLayer.getLatLng();
      const radius = Math.round(this.currentLayer.getRadius());
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [center.lng, center.lat] },
          properties: { radius, color: this.formData.color }
        }]
      };
    } else if (this.currentLayer instanceof L.Polygon) {
      const latLngs = (this.currentLayer as any).getLatLngs()[0] || [];
      if (latLngs.length < 3) throw new Error('Polygon must have at least 3 points');
      const coordinates = latLngs.map((ll: L.LatLng) => [ll.lng, ll.lat]);
      coordinates.push(coordinates[0]);
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: { type: 'Polygon', coordinates: [coordinates] },
          properties: { color: this.formData.color }
        }]
      };
    }

    throw new Error('Unsupported geometry');
  }

  onFormValueChange(values: any) {
    this.formData = { ...this.formData, ...values };
    if (values.color) this.updateLayerColors(values.color);
    if (values.radius && this.currentLayer instanceof L.Circle) {
      this.currentLayer.setRadius(values.radius);
      if (this.currentLayer.feature) this.currentLayer.feature.properties.radius = values.radius;
    }
  }

  clearMap() {
    this.drawnItems.clearLayers();
    this.currentLayer = null;
    this.geometryType = null;
  }

  fitMapToGeometry() {
    if (this.drawnItems.getLayers().length > 0) {
      this.map.fitBounds(this.drawnItems.getBounds(), { padding: [10, 10] });
    }
  }

  getPolygonArea(): string {
    if (this.currentLayer instanceof L.Polygon) {
      const area = L.GeometryUtil?.geodesicArea((this.currentLayer as any).getLatLngs()[0]) || 0;
      return (area / 1000000).toFixed(2);
    }
    return '0';
  }

  async onGeofenceFormSubmit(event: any): Promise<void> {
    const { isEditMode, formValue } = event;
    this.formData = { ...this.formData, ...formValue };

    if (!this.currentLayer) return;

    this.isSaving = true;
    try {
      const geoJsonData = this.generateGeoJSON();
      const payload: GeofencePayload = {
        ...this.formData,
        Geojson: JSON.stringify(geoJsonData),
        color: this.tailwindColors500[this.formData.color]
      };

      if (this.formFields.isEditMode && this.editGeofence?.id) {
        payload.id = this.editGeofence.id;
        payload.fkCustomerUserId = this.editGeofence.fkCustomerUserId;
        console.log('Update payload:', payload);
      } else {
        console.log('Create payload:', payload);
      }

      this.isSaving = false;
    } catch (err) {
      this.isSaving = false;
    }
  }

  onFormCancel() {
    this.formFields = CREATE_GEOFENCE_FORM_FIELDS;
    this.uiService.closeDrawer();
  }
}
