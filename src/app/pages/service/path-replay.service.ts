import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Subject } from 'rxjs';
import { CREATE_USER_FORM_FIELDS } from '../../shared/constants/forms';
import { PATH_REPLAY_FORM_FIELDS } from '../../shared/constants/path-replay';
import { FormEnricherService } from './form-enricher.service';
import { HttpService } from './http.service';
import { UiService } from '../../layout/service/ui.service';
import { buildHistoryRequests, extractStopCoordinates, formatStopDuration, formatStopTime, isValidCoordinate, isValidStopData, pathReplayConvertedValidJson } from '../../shared/utils/helper_functions';
import { AddressService } from './address.service';
import moment from 'moment';
import * as turf from "@turf/turf";
import { ReportsService } from './reports.service';

@Injectable({
  providedIn: 'root'
})
export class PathReplayService {
  private _replayActive = new BehaviorSubject<{ value: boolean; formObj?: any }>({ value: false });
  replayActive$ = this._replayActive.asObservable();

  private _historyData = new BehaviorSubject<any[]>([]);
  historyData$ = this._historyData.asObservable();
  hasHistory$ = this.historyData$.pipe(map(d => d.length > 0));

  private _replayClosed = new Subject<void>();
  replayClosed$ = this._replayClosed.asObservable();
  private formConfigEnricher = inject(FormEnricherService);
  private http = inject(HttpService);
  private uiService = inject(UiService);
  private addressService = inject(AddressService);
  private reportsService = inject(ReportsService);
  private stopMarkers: L.Marker[] = [];
  formFields$ = this.formConfigEnricher.enrichForms([PATH_REPLAY_FORM_FIELDS]).pipe(map((res) => res[0]));

  trackPlayer!: any;
  playbackControlObject: any = {};
  vehiclePlaybackObject: any = {
    speed: 0,
    timestamp: '00:00:00'
  };
  vehicleStartEndInfo: any = {
    startInfo: { address: '', timestamp: '' },
    endInfo: { address: '', timestamp: '' },
    maxSpeed: 0,
    totalDistance: 0
  }

  startPathReplay(formObj: any) {
    this._replayActive.next({ value: true, formObj });
  }

  stopPathReplay() {
    this._replayActive.next({ value: false });
  }

  async fetchHistory(payload: any): Promise<any> {
    this.uiService.toggleLoader(true);
    try {
      const response = await this.http.post('history', payload);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    } finally {
      this.uiService.toggleLoader(false);
    }
  }

  async setVehicleStartEndInfo(track: any[]) {
    if (!track?.length) {
      this.vehicleStartEndInfo = {
        startInfo: { address: '', timestamp: '' },
        endInfo: { address: '', timestamp: '' },
        maxSpeed: 0,
        totalDistance: 0
      };
      return;
    }

    const [start, end] = [track[0], track.at(-1)];

    // Fetch addresses in parallel
    const [startAddress, endAddress] = await Promise.all([
      this.addressService.getAddress(start.lat, start.lng),
      this.addressService.getAddress(end.lat, end.lng),
    ]);

    // Max speed
    const maxSpeed = track.reduce((max, point) => Math.max(max, point.speed || 0), 0);

    // Total distance using Turf.js
    const line = turf.lineString(track.map(p => [p.lng, p.lat])); // [lng, lat] order
    const totalDistance = turf.length(line, { units: 'kilometers' }); // in km

    this.vehicleStartEndInfo = {
      startInfo: {
        address: startAddress,
        timestamp: moment(start.timestamp).format('DD MMM YYYY, hh:mm A')
      },
      endInfo: {
        address: endAddress,
        timestamp: moment(end.timestamp).format('DD MMM YYYY, hh:mm A')
      },
      maxSpeed,
      totalDistance: totalDistance?.toFixed(2)
    };
  }


  /**
   * Plots stop points on the map with animated pulse markers
   * @param stopsData - Array of stop data from API
   * @param map - Leaflet map instance
   */
  public plotStopPoints(stopsData: any[], map: any): void {
    try {
      // Reset/clear existing stop markers first
      this.clearStopPoints();

      // Validate inputs
      if (!map) {
        console.warn('Map instance not provided for plotting stop points');
        return;
      }

      if (!stopsData || !Array.isArray(stopsData) || stopsData.length === 0) {
        console.info('No stop data available to plot');
        return;
      }

      // Get primary color for consistent theming
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color')
        .trim() || '#3B82F6'; // fallback color

      console.log(`Plotting ${stopsData.length} stop points`);

      // Process each stop point
      stopsData.forEach((stop, index) => {
        try {
          // Validate stop data structure
          if (!isValidStopData(stop)) {
            console.warn(`Invalid stop data at index ${index}:`, stop);
            return;
          }

          const { latitude, longitude } = extractStopCoordinates(stop);

          if (!isValidCoordinate(latitude, longitude)) {
            console.warn(`Invalid coordinates for stop ${index}: lat=${latitude}, lng=${longitude}`);
            return;
          }

          // Create animated HTML marker
          const stopMarkerElement = this.createAnimatedStopMarker(primaryColor, stop, index);

          // Create custom icon using the HTML element
          const customIcon = L.divIcon({
            html: stopMarkerElement,
            className: 'custom-stop-marker',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          // Create and add marker to map
          const marker = L.marker([latitude, longitude], {
            icon: customIcon,
            zIndexOffset: 1000 // Ensure stops appear above other elements
          });

          // Add popup with stop information
          const popupContent = this.createStopPopupContent(stop, index);
          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'stop-popup'
          });

          // Add marker to map and track it
          marker.addTo(map);
          this.stopMarkers.push(marker);

        } catch (error) {
          console.error(`Error creating stop marker at index ${index}:`, error);
        }
      });

      // Add CSS for animations if not already present
      this.injectStopMarkerStyles();

      console.log(`Successfully plotted ${this.stopMarkers.length} stop points`);

    } catch (error) {
      console.error('Error plotting stop points:', error);
    }
  }

  /**
   * Clears all existing stop markers from the map
   */
  public clearStopPoints(): void {
    try {
      if (this.stopMarkers && this.stopMarkers.length > 0) {
        console.log(`Clearing ${this.stopMarkers.length} existing stop markers`);

        this.stopMarkers.forEach(marker => {
          try {
            marker.remove();
          } catch (error) {
            console.warn('Error removing stop marker:', error);
          }
        });

        this.stopMarkers = [];
      }
    } catch (error) {
      console.error('Error clearing stop points:', error);
    }
  }

  /**
   * Creates animated HTML element for stop marker
   */
  private createAnimatedStopMarker(primaryColor: string, stop: any, index: number): string {
    const stopDuration = formatStopDuration(stop);
    const stopTime = formatStopTime(stop);

    return `
     <div class="stop-marker-container" title="Stop ${index + 1} - Duration: ${stopDuration}">
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
          
          <!-- White square at center -->
          <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-sm z-20"></div>
        </div>
      </div>
    </div>
  `;
  }

  /**
   * Creates popup content for stop markers
   */
  private createStopPopupContent(stop: any, index: number): string {
    const duration = formatStopDuration(stop);
    const startTime = formatStopTime(stop.StartTime || stop.startTime);
    const endTime = formatStopTime(stop.EndTime || stop.endTime);
    const address = stop.Address || stop.address || 'Address not available';

    return `
    <div class="stop-popup-content">
      <h4 class="font-bold text-lg mb-2">Stop ${index + 1}</h4>
      <div class="space-y-1 text-sm">
        <p><strong>Duration:</strong> ${duration}</p>
        <p><strong>Start:</strong> ${startTime}</p>
        <p><strong>End:</strong> ${endTime}</p>
        <p><strong>Location:</strong> ${address}</p>
      </div>
    </div>
  `;
  }

  


  /**
   * Injects CSS styles for stop marker animations
   */
  private injectStopMarkerStyles(): void {
    const styleId = 'stop-marker-styles';

    // Check if styles already exist
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
    .stop-marker-container {
      pointer-events: auto;
      cursor: pointer;
    }
    
    .custom-stop-marker {
      background: transparent !important;
      border: none !important;
    }
    
    .stop-popup-content {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
    
    @keyframes ping {
      75%, 100% { transform: scale(2); opacity: 0; }
    }
    
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .animate-ping {
      animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
  `;

    document.head.appendChild(style);
  }

  // Updated _initPathReplayFunc method
  async _initPathReplayFunc(historyPayload: any, map: any): Promise<any> {
    if (this.trackPlayer) {
      this.trackPlayer.remove();
      this.trackPlayer = null;
    }
    this._historyData.next([]);

    // Clear existing stop points
    this.clearStopPoints();

    // Reset playback controls
    this.playbackControlObject = {
      speed: 500,
      progress: 0,
      status: 'Idle',
      start: () => { },
      pause: () => { },
      remove: () => { },
      updateSpeed: () => { },
      updateProgress: () => { },
      reset: () => { }
    };

    // Reset vehicle history info
    this.vehiclePlaybackObject = {
      speed: 0,
      timestamp: '00:00:00'
    };

    this.vehicleStartEndInfo = {
      startInfo: { address: '', timestamp: '' },
      endInfo: { address: '', timestamp: '' }
    }

    const { formValue } = historyPayload;

    const requests = buildHistoryRequests(
      formValue?.vehicle,
      formValue?.date[0],
      formValue?.date[1]
    );

    const [historyResults, stopsResults] = await Promise.all([
      Promise.allSettled(requests.map(r =>
        this.fetchHistory({
          DeviceId: r.deviceId,
          FromTime: r.fromTime,
          ToTime: r.toTime
        }).catch(err => ({ error: err.message, data: [] }))
      )),
      Promise.allSettled(requests.map(r =>
        this.reportsService.fetchStopReport({
          DeviceId: r.deviceId,
          FromTime: r.fromTime,
          ToTime: r.toTime
        }).catch(err => ({ error: err.message, data: [] }))
      ))
    ]);

    // Extract successful data
    const historyData = historyResults.filter(r => r.status === 'fulfilled').flatMap(r => r.value?.data || []);
    const stopsData = stopsResults.filter(r => r.status === 'fulfilled').flatMap(r => r.value?.data || []);

    console.log(historyData, 'historyData');
    console.log(stopsData, 'stopsData');
    
    const uniqueTrackPath = pathReplayConvertedValidJson(historyData);
    this.setVehicleStartEndInfo(uniqueTrackPath);
    this._historyData.next(uniqueTrackPath);
    if (uniqueTrackPath && uniqueTrackPath.length > 0) {
      map.fitBounds(uniqueTrackPath);
      this.initilizeTrackPlayer(uniqueTrackPath, map);
    }

    // Plot stop points after track initialization
    this.plotStopPoints(stopsData, map);
  }


  public initilizeTrackPlayer(trackPathData: any[], map: any) {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    console.log(primaryColor, 'primary');

    this.trackPlayer = new (L as any).TrackPlayer(trackPathData, {
      speed: 500,
      weight: 4,
      markerIcon: L.icon({
        iconUrl: 'images/home/car.png',
        iconSize: [27, 54],
        iconAnchor: [13.5, 27],
        shadowUrl:
          'data:image/svg+xml;base64,' +
          btoa(`
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="90" viewBox="0 0 32 60">
            <ellipse cx="16" cy="50" rx="12" ry="8" fill="rgba(0,0,0,0.3)"/>
          </svg>
        `),
        shadowSize: [32, 60],
        shadowAnchor: [16, 30]
      }),
      passedLineColor: primaryColor,
      notPassedLineColor: '#2196F3',
      polylineDecoratorOptions: {
        patterns: [
          {
            offset: 30,
            repeat: 60,
            symbol: (L as any).Symbol.arrowHead({
              pixelSize: 8,
              headAngle: 75,
              polygon: false,
              pathOptions: { stroke: true, weight: 3, color: primaryColor },
            }),
          },
        ],
      },
    });

    this.trackPlayer.addTo(map); // <-- map is explicitly passed

    this.initializetrackListeners(trackPathData);
    this.playbackControlObject = this.initializePlayBackControlObject(map);
  }


  initializePlayBackControlObject(map: any) {
    return {
      speed: this.trackPlayer.options.speed,
      progress: this.trackPlayer.options.progress * 100,
      start: () => {
        map.setZoom(17, {
          animate: false
        });
        this.trackPlayer.start();
      },
      pause: () => {
        this.trackPlayer.pause();
      },
      remove: () => {
        this.stopPathReplay();
        this.resetPathReplayService();
      },
      updateSpeed: (updatedSpeed: any) => {
        this.playbackControlObject.speed = updatedSpeed;
        this.trackPlayer.setSpeed(updatedSpeed);
      },
      updateProgress: (updatedProgress: any) => {
        this.playbackControlObject.progress = updatedProgress;
        this.trackPlayer.setProgress(updatedProgress);
      },
      reset: () => {
        this.playbackControlObject.progress = 0;
        this.playbackControlObject.speed = 500;
        this.trackPlayer.setSpeed(500);
        this.trackPlayer.setProgress(0);
      },
      status: 'Playback'
    };
  }

  handlePlaybackControls(control: string, event?: any) {
    if (control === 'play') {
      this.playbackControlObject.start();
    } else if (control === 'pause') {
      this.playbackControlObject.pause();
    } else if (control === 'updatespeed') {
      this.playbackControlObject.updateSpeed(event?.value);
      // this.playbackControlObject.speed = event.value;
      // this.trackPlayer.setSpeed(event.value);
    } else if (control === 'updateprogress') {
      // this.playbackControlObject.progress = event.value / 100
      // this.trackPlayer.setProgress(event.value / 100);
      this.playbackControlObject.updateProgress(event?.value / 100);
    } else if (control === 'close') {
      this.playbackControlObject.remove();
      this._replayClosed.next();
    } else if (control === 'reset') {
      this.playbackControlObject.reset();
    }
  }

  public initializetrackListeners(trackPathData: any[]) {
    this.trackPlayer.on('start', () => {
      this.playbackControlObject.status = 'Started';
    });
    this.trackPlayer.on('pause', () => {
      this.playbackControlObject.status = 'Paused';
    });
    this.trackPlayer.on('finished', () => {
      this.playbackControlObject.status = 'Finished';
    });
    this.trackPlayer.on('progress', (progress: any, { lng, lat }: any, index: any) => {
      this.vehiclePlaybackObject = {
        speed: trackPathData[index]?.speed || 0,
        timestamp: trackPathData[index]?.timestamp ? new Date(trackPathData[index].timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'
      };
      this.playbackControlObject.status = 'Moving';
      this.playbackControlObject.progress = progress * 100;
    });
  }

  resetPathReplayService() {
    // Stop and remove track player if exists
    if (this.trackPlayer) {
      this.trackPlayer.remove();
      this.trackPlayer = null;
    }

    // Reset replay state
    this._replayActive.next({ value: false });
    this._historyData.next([]);   // clear history data
    this._replayClosed.next();    // notify listeners

    // Reset playback controls
    this.playbackControlObject = {
      speed: 500,
      progress: 0,
      status: 'Idle',
      start: () => { },
      pause: () => { },
      remove: () => { },
      updateSpeed: () => { },
      updateProgress: () => { },
      reset: () => { }
    };

    // Reset vehicle history info
    this.vehiclePlaybackObject = {
      speed: 0,
      timestamp: '00:00:00'
    };


    this.clearStopPoints();

    console.log('♻️ Path Replay fully reset');
  }

}
