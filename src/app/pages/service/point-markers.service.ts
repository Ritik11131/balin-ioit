import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportsService } from './reports.service';
import { TrackMapService } from './track-map.service';
import { Marker, marker, divIcon } from 'leaflet';
import { buildHistoryRequests } from '../../shared/utils/helper_functions';

@Injectable({ providedIn: 'root' })
export class PointMarkerService {
  private _pointMarkersActive = new BehaviorSubject<{ value: boolean; formObj?: any; reportConfig?: any } | null>(null);
  pointMarkersActive$: Observable<{ value: boolean; formObj?: any; reportConfig?: any } | null> = this._pointMarkersActive.asObservable();

  constructor(
    private reportsService: ReportsService,
    private trackMapService: TrackMapService
  ) {}

  /** Start point marker mode (similar to startPathReplay) */
  startPointMarkers(formObj: any, reportConfig: any) {
    this._pointMarkersActive.next({ value: true, formObj, reportConfig });
  }

  /** Stop point marker mode */
   stopPointMarkers() {
    this._pointMarkersActive.next({ value: false });
    this.trackMapService.clearPointMarkers();
  }

  /** Main initializer (like _initPathReplayFunc) */
  async _initPointMarkersFunc(reportConfig: any, historyPayload: any, map: any) {
    console.log(reportConfig,historyPayload);


     const { formValue } = historyPayload;
    
        const requests = buildHistoryRequests(
          formValue?.vehicle,
          formValue?.date[0],
          formValue?.date[1]
        );
    
    
        const response = await this.reportsService.fetchReport(reportConfig, requests);
        console.log(response,'results');
            
       const result = response[reportConfig.api.endpoints[0]];
       console.log(result,'result');
       const reportData = result.filter((r: any) => r.status === "fulfilled").flatMap((r: any) => r.value?.data || []);

    // Only update table if context is 'reports'
    if (this.reportsService.currentContext === 'reports') {
      this.reportsService.setTableData(reportData);
    }

    const markers = reportData.map((row: any, index: number) =>
      this.createPointMarker(row, index)
    );

    // Add all to point marker layer
    this.trackMapService.getPointMarkerLayer().addLayer(L.layerGroup(markers)).addTo(map);

    // Optionally fit map to bounds of point markers
    if (markers.length) {
      const bounds = L.latLngBounds(markers.map((m: any) => m.getLatLng()));
      this.trackMapService.getMapInstance().fitBounds(bounds, { padding: [20, 20] });
    }

       
    
  }

  /** Utility to create Leaflet Marker */
  private createPointMarker(point: any, index: number): Marker {
    // Get primary color for consistent theming
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#3B82F6'; // fallback color
    const icon = divIcon({
      className: 'point-marker',
      html: `
      <div class="stop-marker-container" title="Point ${index + 1}>
      <div class="relative flex items-center justify-center">
        <!-- Outer pulsing ring -->
        <div class="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg animate-ping opacity-30" 
             style="background-color: ${primaryColor}"></div>
        
        <!-- Main marker -->
        <div class="relative w-5 h-5 rounded-full shadow-lg animate-pulse z-10" 
             style="background-color: ${primaryColor}">
          <!-- Inner ping animation -->
          <div class="absolute inset-0 rounded-full animate-ping opacity-25" 
               style="background-color: ${primaryColor}"></div>
        </div>
      </div>
    </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    return marker([point.startLat, point.startLng], { icon });
  }
}
