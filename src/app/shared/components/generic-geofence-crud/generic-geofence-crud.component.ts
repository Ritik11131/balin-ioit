import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import * as L from 'leaflet';
import 'leaflet-draw';
import { GeofenceService } from '../../../pages/service/geofence.service';
import { GenericFormGeneratorComponent } from "../generic-form-generator/generic-form-generator.component";
import { CREATE_GEOFENCE_FORM_FIELDS } from '../../constants/forms';
import { UiService } from '../../../layout/service/ui.service';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { WhitelabelThemeService } from '../../../pages/service/whitelabel-theme.service';

// geofence.model.ts
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
  providers: [MessageService, ConfirmationService],
  templateUrl: './generic-geofence-crud.component.html',
  styleUrl: './generic-geofence-crud.component.scss'
})
export class GeofenceCrudComponent implements OnInit, OnDestroy {
  @Input() editGeofence?: GeofencePayload;

  private themeService = inject(WhitelabelThemeService);

  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  private drawControl!: L.Control.Draw;
  private mapLayers = {
    street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18
    }),
    satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri',
      maxZoom: 18
    }),
  };

  currentLayer: L.Layer | null = null;
  geometryType: 'circle' | 'polygon' | null = null;
  editData!: any;

  options = {
    layers: [this.mapLayers.street],
    zoom: 7,
    center: L.latLng([46.879966, -121.726909]),
    zoomControl: false
  };

  tailwindColors500: Record<string, string> = {
  emerald: '#10B981',
  green: '#22C55E',
  lime: '#84CC16',
  orange: '#F97316',
  amber: '#F59E0B',
  yellow: '#EAB308',
  teal: '#14B8A6',
  cyan: '#06B6D4',
  sky: '#0EA5E9',
  blue: '#3B82F6',
  indigo: '#6366F1',
  violet: '#8B5CF6',
  purple: '#A855F7',
  fuchsia: '#D946EF',
  pink: '#EC4899',
  rose: '#F43F5E'
};

  isSaving = false;
  formFields = CREATE_GEOFENCE_FORM_FIELDS;
  formData: any = { color: '#FF5733', radius: 1000, geometryName: '' }; // initial defaults

  constructor(
    private geofenceService: GeofenceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private uiService: UiService,
  ) {}

  ngOnInit() {
     // Subscribe to theme service to get default color
  this.themeService.theme$.subscribe(theme => {
    if (theme?.themeColor) {
      this.formData.color = theme.themeColor;
    }
  });
    if (this.editGeofence) {
      this.loadEditData();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  onMapReady(map: L.Map): void {
    this.map = map;

    // Zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Init drawn items
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // Draw control
    this.drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: 'Shape edges cannot cross!'
          },
          shapeOptions: {
            color: this.formData.color,
            weight: 3,
            fillOpacity: 0.2
          }
        },
        circle: {
          shapeOptions: {
            color: this.formData.color,
            weight: 3,
            fillOpacity: 0.2
          }
        },
        rectangle: false,
        polyline: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      }
    });

    this.map.addControl(this.drawControl);

    // Events
    this.map.on(L.Draw.Event.CREATED, (event: any) => this.onDrawCreated(event));
    this.map.on(L.Draw.Event.EDITED, (event: any) => this.onDrawEdited(event));
    this.map.on(L.Draw.Event.DELETED, (event: any) => this.onDrawDeleted(event));
  }

  private onDrawCreated(event: any) {
    const layer = event.layer;
    this.drawnItems.clearLayers();
    this.drawnItems.addLayer(layer);
    this.currentLayer = layer;

    if (layer instanceof L.Circle) {
      this.geometryType = 'circle';
      this.formData.radius = Math.round(layer.getRadius());
    } else if (layer instanceof L.Polygon) {
      this.geometryType = 'polygon';
    }

    this.updateLayerColors(this.formData.color);

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.geometryType} created successfully`
    });
  }

  private onDrawEdited(event: any) {
    const layers = event.layers;
    layers.eachLayer((layer: any) => {
      if (layer instanceof L.Circle) {
        this.formData.radius = Math.round(layer.getRadius());
      }
    });

    this.messageService.add({ severity: 'info', summary: 'Updated', detail: 'Geometry modified' });
  }

  private onDrawDeleted(_: any) {
    this.currentLayer = null;
    this.geometryType = null;
    this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Geometry removed' });
  }

  private updateLayerColors(color: string) {
    if (this.currentLayer && (this.currentLayer as any).setStyle) {
      (this.currentLayer as any).setStyle({ color, fillColor: color });
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
      const layer = L.geoJSON(geoJson, {
        style: {
          color: this.editGeofence.color,
          weight: 3,
          fillOpacity: 0.2
        },
        pointToLayer: (feature, latlng) => {
          if (feature.properties?.radius) {
            return L.circle(latlng, {
              radius: feature.properties.radius,
              color: this.editGeofence!.color,
              weight: 3,
              fillOpacity: 0.2
            });
          }
          return L.marker(latlng);
        }
      });

      this.drawnItems.addLayer(layer);
      layer.eachLayer((l: L.Layer) => {
        this.currentLayer = l;
        this.geometryType = l instanceof L.Circle ? 'circle' : 'polygon';
      });
      this.fitMapToGeometry();
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load geometry data' });
    }
  }

  private generateGeoJSON(): any {
    if (!this.currentLayer) throw new Error('No geometry selected');

    if (this.currentLayer instanceof L.Circle) {
      const center = this.currentLayer.getLatLng();
      const radius = this.currentLayer.getRadius();
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
      coordinates.push(coordinates[0]); // close polygon
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
    if (isEditMode) {
      console.log('Update:', this.formData);
    } else {
      console.log('Create:', this.formData);
    }


     if (!this.currentLayer) {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please draw a geometry' });
      return;
    }

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
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate geometry data' });
      this.isSaving = false;
    }
  }

  onFormValueChange(values: any) {
    console.log(values,'values');
    
    this.formData = { ...this.formData, ...values };
    if (values.color) this.updateLayerColors(values.color);
    if (values.radius && this.currentLayer instanceof L.Circle) {
      this.currentLayer.setRadius(values.radius);
    }
  }

  onFormCancel() {
    this.formFields = CREATE_GEOFENCE_FORM_FIELDS;
    this.uiService.closeDrawer();
  }
}
