import { Component, OnInit, OnDestroy, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
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
import { LeafletDrawModule } from '@bluehalo/ngx-leaflet-draw';
import { GeofenceService } from '../../../pages/service/geofence.service';
import { GenericFormGeneratorComponent } from '../generic-form-generator/generic-form-generator.component';
import { CREATE_GEOFENCE_FORM_FIELDS } from '../../constants/forms';
import { WhitelabelThemeService } from '../../../pages/service/whitelabel-theme.service';
import { Subscription } from 'rxjs';
import { loadGeofences } from '../../../store/geofence/geofence.actions';
import { Store } from '@ngrx/store';



export interface GeofencePayload {
    id?: number;
    fkCustomerUserId?: number;
    color: string;
    radius?: number;
    geometryName: string;
    geojson?: string;
    geofenceGeometry?: any;
}

@Component({
    selector: 'app-geofence-crud',
    standalone: true,
    imports: [CommonModule, ButtonModule, LeafletModule, LeafletDrawModule, InputTextModule, ColorPickerModule, InputNumberModule, ToastModule, ConfirmDialogModule, GenericFormGeneratorComponent],
    templateUrl: './generic-geofence-crud.component.html',
    styleUrl: './generic-geofence-crud.component.scss'
})
export class GeofenceCrudComponent implements OnInit, OnDestroy, OnChanges {
    @Input() editGeofence?: GeofencePayload;

    private themeService = inject(WhitelabelThemeService);
    private store = inject(Store);
    private themeSubscription?: Subscription;

    private map!: L.Map;
    private drawnItems!: L.FeatureGroup;
    private drawControl!: L.Control.Draw;
    public currentLayer: L.Layer | null = null;
    public geometryType: 'circle' | 'polygon' | null = null;

    formData: any = {
        color: '#3B82F6', // Default blue color
        radius: 0,
        geometryName: ''
    };
    formFields = { ...CREATE_GEOFENCE_FORM_FIELDS };

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

    mapLayers = {
        street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }),
        satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; Esri',
            maxZoom: 18
        })
    };

    editData: any = {};

    options = {
        layers: [this.mapLayers.street],
        zoom: 7,
        center: L.latLng([46.879966, -121.726909]),
        zoomControl: false
    };

    drawOptions: any = {
        position: 'topleft' as L.ControlPosition,
        draw: {
            polygon: {
                allowIntersection: false,
                drawError: {
                    color: '#e1e100',
                    message: 'Shape edges cannot cross!'
                },
                shapeOptions: {
                    color: '#3B82F6',
                    weight: 3,
                    fillOpacity: 0.2
                }
            },
            circle: {
                shapeOptions: {
                    color: '#3B82F6',
                    weight: 3,
                    fillOpacity: 0.2
                }
            },
            polyline: false,
            marker: false,
            rectangle: false,
            circlemarker: false
        },
        edit: {
            featureGroup: undefined as any // Will be set after drawnItems is created
        }
    };

    constructor(
        private uiService: UiService,
        private geofenceService: GeofenceService
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['editGeofence'] && changes['editGeofence'].currentValue) {
            // Only run when editGeofence changes and has a value
            this.loadEditData();
            if (this.editGeofence) {
                setTimeout(() => this.loadGeometry(), 100);
            }
        }
    }

    ngOnInit() {
        this.themeSubscription = this.themeService.theme$.subscribe((theme) => {
            if (theme?.themeColor) {
                this.formData.color = theme.themeColor;
                this.updateDrawControlColors(theme.themeColor);
            }
        });
    }

    ngOnDestroy() {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }

    onMapReady(map: L.Map) {
        if (this.map) {
            this.map.remove();
        }

        this.map = map;

        // Add zoom control to bottom right
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // Initialize drawn items layer group
        this.drawnItems = new L.FeatureGroup();
        this.map.addLayer(this.drawnItems);

        // Update draw options with the created drawnItems
        this.drawOptions.edit.featureGroup = this.drawnItems;

        // Bind draw events
        this.bindDrawEvents();

        // If editing, load the geometry after map is ready

        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);

        // Patch buggy _resize
(L.Edit.Circle.prototype as any)._resize = function (t: L.LatLng) {
    const e = this._moveMarker.getLatLng();
    let radius;
    if ((L as any).GeometryUtil.isVersion07x()) {
        radius = e.distanceTo(t);
    } else {
        radius = this._map.distance(e, t);
    }
    this._shape.setRadius(radius);

    if (this._map.editTooltip) {
        this._map._editTooltip.updateContent({
            text: L.drawLocal.edit.handlers.edit.tooltip.subtext + '<br />' + L.drawLocal.edit.handlers.edit.tooltip.text,
            subtext: L.drawLocal.draw.handlers.circle.radius + ': ' + (L as any).GeometryUtil.readableDistance(radius, true, this.options.feet, this.options.nautic)
        });
    }

    this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape });
};
    }

    private bindDrawEvents() {
        this.map.on(L.Draw.Event.CREATED, (e: any) => this.onDrawCreated(e));
        this.map.on(L.Draw.Event.EDITED, (e: any) => this.onDrawEdited(e));
        this.map.on(L.Draw.Event.DELETED, (e: any) => this.onDrawDeleted(e));
        this.map.on(L.Draw.Event.EDITRESIZE, (e: any) => this.onCircleResize(e));
    }

    private onCircleResize(e: any) {
        const layer = e.layer;
        if (layer instanceof L.Circle) {
            const radius = Math.round(layer.getRadius());
            this.formData.radius = radius;

            // Update GeoJSON feature properties if present
            if (layer.feature?.properties) {
                layer.feature.properties.radius = radius;
            }

            // Optionally: show a toast or update UI binding
            // this.uiService.showToast('info', 'Radius Updated', `New radius: ${radius} meters`);
        }
    }

    public onDrawCreated(e: any) {
        console.log(e);

        const layer = e.layer;

        // Clear existing layers (only allow one geometry at a time)
        // this.drawnItems.clearLayers();
        this.drawnItems.addLayer(layer);
        this.currentLayer = layer;

        // Determine geometry type and set properties
        if (layer instanceof L.Circle) {
            this.geometryType = 'circle';
            const radius = Math.round(layer.getRadius());
            this.formData.radius = radius;

            // Add feature property for GeoJSON export
            layer.feature = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [layer.getLatLng().lng, layer.getLatLng().lat]
                },
                properties: {
                    radius,
                    color: this.formData.color
                }
            };
        } else if (layer instanceof L.Polygon) {
            this.geometryType = e.layerType;

            // Add feature property for GeoJSON export
            const coordinates = this.getPolygonCoordinates(layer);
            layer.feature = {
                type: 'Feature',
                geometry: {
                    type: 'Polygon',
                    coordinates: [coordinates]
                },
                properties: {
                    color: this.formData.color
                }
            };
        }

        // Apply current color to the new layer
        this.updateLayerColors(this.formData.color);

        this.uiService.showToast('success', 'Success', `${this.geometryType} created successfully`);
    }

    private onDrawEdited(event: any) {
        const layers = event.layers;
        layers.eachLayer((layer: any) => {
            this.currentLayer = layer;

            if (layer instanceof L.Circle) {
                const radius = Math.round(layer.getRadius());
                this.formData.radius = radius;

                if (layer.feature) {
                    layer.feature.geometry.coordinates = [layer.getLatLng().lng, layer.getLatLng().lat];
                    layer.feature.properties.radius = radius;
                } else {
                    layer.feature = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [layer.getLatLng().lng, layer.getLatLng().lat]
                        },
                        properties: {
                            radius: radius, // ✅ explicit assignment
                            color: this.formData.color
                        }
                    };
                }
            } else if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                // Update polygon coordinates
                const coordinates = this.getPolygonCoordinates(layer);
                if (layer.feature) {
                    layer.feature.geometry.coordinates = [coordinates];
                } else {
                    layer.feature = {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [coordinates]
                        },
                        properties: {
                            color: this.formData.color
                        }
                    };
                }
            }
        });

        this.uiService.showToast('info', 'Updated', `${this.geometryType} modified successfully`);
    }

    private onDrawDeleted(event: any) {
        this.currentLayer = null;
        this.geometryType = null;
        this.uiService.showToast('warn', 'Deleted', 'Geometry deleted successfully');
    }

    private getPolygonCoordinates(layer: L.Polygon | L.Rectangle): number[][] {
        const latLngs = (layer as any).getLatLngs();
        // Handle nested array structure (polygon might have holes)
        const outerRing = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
        const coordinates = outerRing.map((ll: L.LatLng) => [ll.lng, ll.lat]);
        // Close the polygon by adding the first point at the end
        if (coordinates.length > 0) {
            coordinates.push(coordinates[0]);
        }
        return coordinates;
    }

    private updateLayerColors(color: string) {
        if (this.currentLayer && (this.currentLayer as any).setStyle) {
            (this.currentLayer as any).setStyle({
                color,
                fillColor: color
            });

            // Update feature properties if they exist
            if ((this.currentLayer as any).feature) {
                (this.currentLayer as any).feature.properties.color = color;
            }
        }
    }

    private updateDrawControlColors(color: string) {
        // Update draw options colors
        if (this.drawOptions.draw.polygon) {
            this.drawOptions.draw.polygon.shapeOptions.color = color;
        }
        if (this.drawOptions.draw.circle) {
            this.drawOptions.draw.circle.shapeOptions.color = color;
        }
        if (this.drawOptions.draw.rectangle) {
            this.drawOptions.draw.rectangle.shapeOptions.color = color;
        }

        // Recreate draw control if map exists
        if (this.map && this.drawControl) {
            this.map.removeControl(this.drawControl);
            this.drawControl = new L.Control.Draw(this.drawOptions);
            this.map.addControl(this.drawControl);
        }
    }

    private loadEditData() {
        if (!this.editGeofence) return;

        this.formData = {
            geometryName: this.editGeofence.geometryName || '',
            color: this.editGeofence.color || '#3B82F6',
            radius: this.editGeofence.radius || 1000
        };

        // Set edit data for the form
        this.editData = { ...this.formData };

        // Mark form as edit mode
        this.formFields = {
            ...CREATE_GEOFENCE_FORM_FIELDS,
            isEditMode: true
        };
    }

    private loadGeometry() {
        if (!this.editGeofence?.geojson) return;

        try {
            const geoJson = JSON.parse(this.editGeofence.geojson);

            const geoLayer = L.geoJSON(geoJson, {
                style: () => ({
                    color: this.editGeofence!.color,
                    weight: 3,
                    fillOpacity: 0.2
                }),
                pointToLayer: (feature, latlng) => {
                    if (feature.properties?.radius) {
                        const circle = L.circle(latlng, {
                            radius: feature.properties.radius,
                            color: this.editGeofence!.color,
                            weight: 3,
                            fillOpacity: 0.2
                        });
                        circle.feature = feature;
                        return circle;
                    }
                    return L.marker(latlng);
                }
            });

            // Add each layer to drawnItems
            geoLayer.eachLayer((layer: L.Layer) => {
                this.drawnItems.addLayer(layer);
                this.currentLayer = layer;

                // Determine geometry type
                if (layer instanceof L.Circle) {
                    this.geometryType = 'circle';
                } else if (layer instanceof L.Polygon) {
                    this.geometryType = 'polygon';
                }
            });

            // Fit map to loaded geometry
            this.fitMapToGeometry();
        } catch (error) {
            console.error('Error loading geometry:', error);
            this.uiService.showToast('error', 'Error', 'Failed to load geometry data');
        }
    }

    private generateGeoJSON(): any {
        if (!this.currentLayer) {
            throw new Error('No geometry selected');
        }

        if (this.currentLayer instanceof L.Circle) {
            const center = this.currentLayer.getLatLng();
            const radius = Math.round(this.currentLayer.getRadius());

            return {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [center.lng, center.lat]
                        },
                        properties: {
                            radius,
                            color: this.formData.color
                        }
                    }
                ]
            };
        } else if (this.currentLayer instanceof L.Polygon || this.currentLayer instanceof L.Rectangle) {
            const coordinates = this.getPolygonCoordinates(this.currentLayer as L.Polygon);

            if (coordinates.length < 4) {
                // Need at least 3 points + closing point
                throw new Error('Polygon must have at least 3 points');
            }

            return {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [coordinates]
                        },
                        properties: {
                            color: this.formData.color
                        }
                    }
                ]
            };
        }

        throw new Error('Unsupported geometry type');
    }

    onFormValueChange(values: any) {
        this.formData = { ...this.formData, ...values };

        // Update layer colors if color changed
        if (values.color) {
            this.updateLayerColors(values.color);
            this.updateDrawControlColors(values.color);
        }

        // Update circle radius if changed
        if (values.radius && this.currentLayer instanceof L.Circle) {
            this.currentLayer.setRadius(values.radius);
            if ((this.currentLayer as any).feature) {
                (this.currentLayer as any).feature.properties.radius = values.radius;
            }
        }
    }

    clearMap() {
        this.drawnItems.clearLayers();
        this.currentLayer = null;
        this.geometryType = null;
        // this.uiService.showToast('info', 'Cleared', 'Map cleared successfully');
    }

    fitMapToGeometry() {
        if (this.drawnItems.getLayers().length > 0) {
            const bounds = this.drawnItems.getBounds();
            if (bounds.isValid()) {
                this.map.fitBounds(bounds, { padding: [20, 20] });
                this.map.setZoom(14)
            }
        }
    }

    getPolygonArea(): string {
        if (this.currentLayer instanceof L.Polygon) {
            try {
                // Use Leaflet's built-in area calculation if available
                const latLngs = (this.currentLayer as any).getLatLngs()[0];
                if (latLngs && latLngs.length > 2) {
                    // Simple area calculation using shoelace formula
                    let area = 0;
                    for (let i = 0; i < latLngs.length - 1; i++) {
                        const p1 = latLngs[i];
                        const p2 = latLngs[i + 1];
                        area += (p2.lng - p1.lng) * (p2.lat + p1.lat);
                    }
                    area = (Math.abs(area) * 111319.9 * 111319.9) / 2; // Approximate conversion to square meters
                    return (area / 1000000).toFixed(2); // Convert to square kilometers
                }
            } catch (error) {
                console.error('Error calculating area:', error);
            }
        }
        return '0';
    }

    async onGeofenceFormSubmit(event: any): Promise<void> {
        const { isEditMode, formValue } = event;
        this.formData = { ...this.formData, ...formValue };

        if (!this.currentLayer) {
            this.uiService.showToast('error', 'Error', 'Please draw a geometry first');
            return;
        }

        if (!this.formData.geometryName?.trim()) {
            this.uiService.showToast('error', 'Error', 'Please enter a geometry name');
            return;
        }

       this.uiService.toggleLoader(true)

        try {
            const geoJsonData = this.generateGeoJSON();
            const selectedColor = this.tailwindColors500[this.formData.color] || this.formData.color;

            const payload: GeofencePayload = {
                geometryName: this.formData.geometryName.trim(),
                color: selectedColor,
                geojson: JSON.stringify(geoJsonData),
                radius: this.formData.radius
            };

            // Add radius for circles
            if (this.geometryType === 'circle') {
                payload.radius = this.formData.radius;
            }

            if (isEditMode && this.editGeofence?.id) {
                payload.id = this.editGeofence.id;
                payload.fkCustomerUserId = this.editGeofence.fkCustomerUserId;
                console.log('Update payload:', payload);

                // Call update service
                await this.updateGeofence(this.editGeofence.id, payload);
                // this.uiService.showToast('success', 'Success', 'Geofence updated successfully');
            } else {
                console.log('Create payload:', payload);

                // Call create service
                await this.createGeofence(payload);
                // this.uiService.showToast('success', 'Success', 'Geofence created successfully');
            }
        } catch (error) {
            console.error('Error saving geofence:', error);
            this.uiService.showToast('error', 'Error', 'Failed to save geofence');
        } finally {
            this.uiService.toggleLoader(false);
        }
    }

    onFormCancel() {
        this.formFields = { ...CREATE_GEOFENCE_FORM_FIELDS };
        this.clearMap();
        this.uiService.closeDrawer();
    }

    private async createGeofence(data: any): Promise<void> {
        const res = await this.geofenceService.createGeofence(data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', res?.data);
        this.store.dispatch(loadGeofences());
    }

    private async updateGeofence(id: any, data: any): Promise<void> {
        const res = await this.geofenceService.updateGeofence(id, data);
        this.uiService.closeDrawer();
        this.uiService.showToast('success', 'Success', res?.data);
        this.store.dispatch(loadGeofences());
    }
}
