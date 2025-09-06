import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Subject, combineLatest } from 'rxjs';
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

// Loading state interfaces
interface LoadingStates {
  initializing: boolean;
  fetchingHistory: boolean;
  fetchingStops: boolean;
  processingData: boolean;
  fetchingAddresses: boolean;
  plottingStops: boolean;
  initializingPlayer: boolean;
}

interface DataStates {
  hasHistoryData: boolean;
  hasStopsData: boolean;
  hasVehicleInfo: boolean;
  hasTrackPlayer: boolean;
}

interface ErrorStates {
  historyError: string | null;
  stopsError: string | null;
  addressError: string | null;
  playerError: string | null;
  generalError: string | null;
}

interface ServiceState {
  loading: LoadingStates;
  data: DataStates;
  errors: ErrorStates;
  isReady: boolean;
  // progress: number; // 0-100
}

@Injectable({
  providedIn: 'root'
})
export class PathReplayService {
  private _replayActive = new BehaviorSubject<{ value: boolean; formObj?: any }>({ value: false });
  replayActive$ = this._replayActive.asObservable();

  private _historyData = new BehaviorSubject<any[]>([]);
  historyData$ = this._historyData.asObservable();

  private _stopsData = new BehaviorSubject<any[]>([]);
  stopsData$ = this._stopsData.asObservable();

  private _replayClosed = new Subject<void>();
  replayClosed$ = this._replayClosed.asObservable();

  // Enhanced state management
  private _serviceState = new BehaviorSubject<ServiceState>({
    loading: {
      initializing: false,
      fetchingHistory: false,
      fetchingStops: false,
      processingData: false,
      fetchingAddresses: false,
      plottingStops: false,
      initializingPlayer: false
    },
    data: {
      hasHistoryData: false,
      hasStopsData: false,
      hasVehicleInfo: false,
      hasTrackPlayer: false
    },
    errors: {
      historyError: null,
      stopsError: null,
      addressError: null,
      playerError: null,
      generalError: null
    },
    isReady: false,
    // progress: 0
  });

  // Public observables for state management
  serviceState$ = this._serviceState.asObservable();
  
  // Convenience observables
  isLoading$ = this.serviceState$.pipe(
    map(state => Object.values(state.loading).some(loading => loading))
  );
  
  hasAnyError$ = this.serviceState$.pipe(
    map(state => Object.values(state.errors).some(error => error !== null))
  );
  
  // loadingProgress$ = this.serviceState$.pipe(
  //   map(state => state.progress)
  // );
  
  isReady$ = this.serviceState$.pipe(
    map(state => state.isReady)
  );

  // Legacy computed observables for backward compatibility
  hasHistory$ = combineLatest([this.historyData$, this.serviceState$]).pipe(
    map(([data, state]) => data.length > 0 && state.data.hasHistoryData)
  );

  hasStops$ = combineLatest([this.stopsData$, this.serviceState$]).pipe(
    map(([data, state]) => data.length > 0 && state.data.hasStopsData)
  );

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
    totalDistance: 0,
    stopsData: { total: 0, data: [] },
    historyData: { total: 0, data: [] }
  };

  // State management helper methods
  private updateLoadingState(updates: Partial<LoadingStates>) {
    const currentState = this._serviceState.value;
    const newLoadingState = { ...currentState.loading, ...updates };
    
    // Calculate progress based on completed operations
    const operations = Object.keys(newLoadingState);
    const completedOperations = operations.filter(op => !newLoadingState[op as keyof LoadingStates]);
    // const progress = (completedOperations.length / operations.length) * 100;
    
    this._serviceState.next({
      ...currentState,
      loading: newLoadingState,
      // progress: Math.round(progress)
    });
  }

  private updateDataState(updates: Partial<DataStates>) {
    const currentState = this._serviceState.value;
    const newDataState = { ...currentState.data, ...updates };
    
    // Check if service is ready
    const isReady = newDataState.hasHistoryData || newDataState.hasVehicleInfo;
    
    this._serviceState.next({
      ...currentState,
      data: newDataState,
      isReady
    });
  }

  private updateErrorState(updates: Partial<ErrorStates>) {
    const currentState = this._serviceState.value;
    this._serviceState.next({
      ...currentState,
      errors: { ...currentState.errors, ...updates }
    });
  }

  private clearErrors() {
    this.updateErrorState({
      historyError: null,
      stopsError: null,
      addressError: null,
      playerError: null,
      generalError: null
    });
  }

  private resetServiceState() {
    this._serviceState.next({
      loading: {
        initializing: false,
        fetchingHistory: false,
        fetchingStops: false,
        processingData: false,
        fetchingAddresses: false,
        plottingStops: false,
        initializingPlayer: false
      },
      data: {
        hasHistoryData: false,
        hasStopsData: false,
        hasVehicleInfo: false,
        hasTrackPlayer: false
      },
      errors: {
        historyError: null,
        stopsError: null,
        addressError: null,
        playerError: null,
        generalError: null
      },
      isReady: false,
      // progress: 0
    });
  }

  // Getters for easy access to current state
  get currentState(): ServiceState {
    return this._serviceState.value;
  }

  get isCurrentlyLoading(): boolean {
    return Object.values(this.currentState.loading).some(loading => loading);
  }

  get hasCurrentErrors(): boolean {
    return Object.values(this.currentState.errors).some(error => error !== null);
  }

  startPathReplay(formObj: any) {
    this._replayActive.next({ value: true, formObj });
  }

  stopPathReplay() {
    this._replayActive.next({ value: false });
  }

  async fetchHistory(payload: any): Promise<any> {
    this.updateLoadingState({ fetchingHistory: true });
    
    try {
      const response = await this.http.post('history', payload);
      this.updateLoadingState({ fetchingHistory: false });
      this.updateErrorState({ historyError: null });
      return response;
    } catch (error: any) {
      this.updateLoadingState({ fetchingHistory: false });
      const errorMessage = error?.error?.data || 'Failed to fetch history data';
      this.updateErrorState({ historyError: errorMessage });
      this.uiService.showToast('error', 'Error', errorMessage);
      throw error;
    }
  }

  async setVehicleStartEndInfo(track: any[], stops: any[]) {
    this.updateLoadingState({ processingData: true, fetchingAddresses: true });
    
    try {
      if (!track?.length) {
        this.vehicleStartEndInfo = {
          startInfo: { address: '', timestamp: '' },
          endInfo: { address: '', timestamp: '' },
          maxSpeed: 0,
          totalDistance: 0,
          stopsData: { total: 0, data: [] },
          historyData: { total: 0, data: [] }
        };
        this.updateDataState({ hasVehicleInfo: false });
        this.updateLoadingState({ processingData: false, fetchingAddresses: false });
        return;
      }

      const [start, end] = [track[0], track.at(-1)];

      // Fetch addresses in parallel
      const [startAddress, endAddress] = await Promise.all([
        this.addressService.getAddress(start.lat, start.lng),
        this.addressService.getAddress(end.lat, end.lng),
      ]);

      this.updateLoadingState({ fetchingAddresses: false });

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
        totalDistance: totalDistance?.toFixed(2),
        stopsData: {
          total: stops?.length || 0,
          data: await Promise.all(
            stops.map(async (stop, index) => {
              const address = await this.addressService.getAddress(stop.latitude, stop.longitude);
              return {
                label: `Stop ${index + 1}`,
                address,
                duration: formatStopDuration(stop),
              };
            })
          )
        },
        historyData: { total: track?.length || 0, data: track || [] }
      };

      this.updateDataState({ hasVehicleInfo: true });
      this.updateLoadingState({ processingData: false });
      this.updateErrorState({ addressError: null });

    } catch (error: any) {
      this.updateLoadingState({ processingData: false, fetchingAddresses: false });
      const errorMessage = 'Failed to process vehicle information';
      this.updateErrorState({ addressError: errorMessage });
      console.error('Error setting vehicle info:', error);
    }
  }

  /**
   * Plots stop points on the map with animated pulse markers
   */
  public plotStopPoints(stopsData: any[], map: any): void {
    this.updateLoadingState({ plottingStops: true });
    
    try {
      // Reset/clear existing stop markers first
      this.clearStopPoints();

      // Validate inputs
      if (!map) {
        console.warn('Map instance not provided for plotting stop points');
        this.updateLoadingState({ plottingStops: false });
        return;
      }

      if (!stopsData || !Array.isArray(stopsData) || stopsData.length === 0) {
        console.info('No stop data available to plot');
        this.updateDataState({ hasStopsData: false });
        this.updateLoadingState({ plottingStops: false });
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
      this.updateDataState({ hasStopsData: true });
      this.updateLoadingState({ plottingStops: false });

    } catch (error) {
      console.error('Error plotting stop points:', error);
      this.updateErrorState({ generalError: 'Failed to plot stop points' });
      this.updateLoadingState({ plottingStops: false });
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
        this.updateDataState({ hasStopsData: false });
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

  // Updated _initPathReplayFunc method with enhanced loading states
  async _initPathReplayFunc(historyPayload: any, map: any): Promise<any> {
    this.updateLoadingState({ initializing: true });
    this.clearErrors();

    try {
      if (this.trackPlayer) {
        this.trackPlayer.remove();
        this.trackPlayer = null;
        this.updateDataState({ hasTrackPlayer: false });
      }
      
      this._historyData.next([]);
      this._stopsData.next([]);

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
        endInfo: { address: '', timestamp: '' },
        maxSpeed: 0,
        totalDistance: 0,
        stopsData: { total: 0, data: [] },
        historyData: { total: 0, data: [] }
      }

      this.updateDataState({
        hasHistoryData: false,
        hasStopsData: false,
        hasVehicleInfo: false,
        hasTrackPlayer: false
      });

      const { formValue } = historyPayload;

      const requests = buildHistoryRequests(
        formValue?.vehicle,
        formValue?.date[0],
        formValue?.date[1]
      );

      // Fetch data with proper loading states
      this.updateLoadingState({ fetchingHistory: true, fetchingStops: true });

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

      this.updateLoadingState({ fetchingHistory: false, fetchingStops: false });

      // Extract successful data
      const historyData = historyResults.filter(r => r.status === 'fulfilled').flatMap(r => r.value?.data || []);
      const stopsData = stopsResults.filter(r => r.status === 'fulfilled').flatMap(r => r.value?.data || []);

      console.log(historyData, 'historyData');
      console.log(stopsData, 'stopsData');

      // Update data states
      this._stopsData.next(stopsData);

      if (!historyData.length) {
        this.updateErrorState({ historyError: 'No history data found' });
        this.uiService.showToast('warn', 'Warning', 'No Data Found');
        this.updateLoadingState({ initializing: false });
        return;
      }

      this.updateLoadingState({ processingData: true });
      
      const uniqueTrackPath = pathReplayConvertedValidJson(historyData);
      await this.setVehicleStartEndInfo(uniqueTrackPath, stopsData);
      
      this._historyData.next(uniqueTrackPath);
      this.updateDataState({ hasHistoryData: true });

      if (uniqueTrackPath && uniqueTrackPath.length > 0) {
        map.fitBounds(uniqueTrackPath);
        await this.initilizeTrackPlayer(uniqueTrackPath, map);
      }

      // Plot stop points after track initialization
      this.plotStopPoints(stopsData, map);
      
      this.updateLoadingState({ initializing: false });

    } catch (error: any) {
      console.error('Error in _initPathReplayFunc:', error);
      this.updateErrorState({ generalError: 'Failed to initialize path replay' });
      this.updateLoadingState({ initializing: false });
      this.uiService.toggleLoader(false);
    }
  }

  public async initilizeTrackPlayer(trackPathData: any[], map: any) {
    this.updateLoadingState({ initializingPlayer: true });
    
    try {
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

      this.trackPlayer.addTo(map);
      this.initializetrackListeners(trackPathData);
      this.playbackControlObject = this.initializePlayBackControlObject(map);
      
      this.updateDataState({ hasTrackPlayer: true });
      this.updateLoadingState({ initializingPlayer: false });
      this.updateErrorState({ playerError: null });
      
    } catch (error: any) {
      console.error('Error initializing track player:', error);
      this.updateErrorState({ playerError: 'Failed to initialize track player' });
      this.updateLoadingState({ initializingPlayer: false });
    }
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
    } else if (control === 'updateprogress') {
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
    this._historyData.next([]);
    this._stopsData.next([]);
    this._replayClosed.next();

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
    this.resetServiceState();

    console.log('♻️ Path Replay fully reset');
  }
}