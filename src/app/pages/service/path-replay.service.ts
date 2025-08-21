import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, map, Subject } from 'rxjs';
import { CREATE_USER_FORM_FIELDS } from '../../shared/constants/forms';
import { PATH_REPLAY_FORM_FIELDS } from '../../shared/constants/path-replay';
import { FormEnricherService } from './form-enricher.service';
import { HttpService } from './http.service';
import { UiService } from '../../layout/service/ui.service';
import { pathReplayConvertedValidJson } from '../../shared/utils/helper_functions';

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
  formFields$ = this.formConfigEnricher.enrichForms([PATH_REPLAY_FORM_FIELDS]).pipe(map((res) => res[0]));

  trackPlayer!: any;
  playbackControlObject: any = {};
  vehicleHistoryInfo: any = {
    speed: 0,
    timestamp: '00:00:00'
  };

  startPathReplay(formObj: any) {
    this._replayActive.next({ value: true, formObj });
  }

  stopPathReplay() {
    this._replayActive.next({ value: false });
  }

  async fetchHistory(payload: any): Promise<any> {
    try {
      const response = await this.http.post('history', payload);
      return response;
    } catch (error: any) {
      this.uiService.showToast('error', 'Error', error?.error?.data);
      throw error;
    }
  }

  async _initPathReplayFunc(historyPayload: any, map: any): Promise<any> {
    this.uiService.toggleLoader(true);
    const response = await this.fetchHistory({
      DeviceId: '316',
      FromTime: '2025-08-20T00:00:00+05:30',
      ToTime: '2025-08-20T23:59:59+05:30'
    });
    this.uiService.toggleLoader(false);
    const uniqueTrackPath = pathReplayConvertedValidJson(response?.data);
    this._historyData.next(uniqueTrackPath);
    map.fitBounds(uniqueTrackPath);

    this.initilizeTrackPlayer(uniqueTrackPath, map);
    console.log('📡 Path Replay API Response:', response);
  }

  public initilizeTrackPlayer(trackPathData: any[], map: any) {
    if (this.trackPlayer) {
      this.trackPlayer.remove();
      this.trackPlayer = null;
    }

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
      status: 'PlayBack'
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
      this.vehicleHistoryInfo = {
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
    this.vehicleHistoryInfo = {
      speed: 0,
      timestamp: '00:00:00'
    };

    console.log('♻️ Path Replay fully reset');
  }

}
