import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { environment } from '../../../environments/environment';
import { Observable, Subject, takeUntil } from 'rxjs';
import { loadVehicles } from '../../store/vehicle/vehicle.actions';
import { Store } from '@ngrx/store';
import { selectVehicles, selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';

interface CameraDevice {
  imei: string;
  name: string;
  channels: any[];
}

interface CameraGrid {
  id: number;
  imei: string;
  channel: any;
  videoSrc: string;
}

@Component({
  selector: 'app-cctv-camera',
  imports: [CarouselModule, SelectModule, DialogModule, FormsModule, CommonModule, ButtonModule],
  templateUrl: './cctv-camera.component.html',
  styleUrls: ['./cctv-camera.component.scss']
})
export class CctvCameraComponent implements OnInit, OnDestroy {

  private store = inject(Store);
  private destroy$ = new Subject<void>();

  videoBaseUrl: string = environment.cctcCameraFlv;
  channels = []
  vehiclesLoaded$: Observable<boolean> = this.store.select(selectVehiclesLoaded);
  vehicles$: Observable<any[]> = this.store.select(selectVehicles);

  cameraDevices: CameraDevice[] = [];

  // Carousel data - 5 pages of 5x5 grids (250 total cameras)
  carouselPages: CameraGrid[][] = [];
  currentPageIndex: number = 0;

  // Fullscreen modal properties
  showFullscreenModal: boolean = false;
  selectedFullscreenCamera: CameraGrid | null = null;

  ALLOWED_VEHICLE_TYPES = [20, 16];

  ngOnInit(): void {
    // Load vehicles if not already loaded
    this.vehiclesLoaded$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loaded) => {
        if (!loaded) {
          this.store.dispatch(loadVehicles());
        }
      });

    // Subscribe to vehicles and filter by vehicleId = 20
    this.vehicles$
      .pipe(takeUntil(this.destroy$))
      .subscribe((vehicles) => {
        this.cameraDevices = vehicles.filter((vehicle)=>
          this.ALLOWED_VEHICLE_TYPES.includes(vehicle?.apiObject?.device?.vehicleType))
      .map(v => this.mapVehicleToCameraDevice(v));
        this.initializeCarouselPages();
      });
  }

  private mapVehicleToCameraDevice(vehicle: any): CameraDevice {
    return {
      imei: vehicle?.apiObject?.device?.deviceId ?? '',
      name: vehicle?.vehicleNo ?? `Vehicle ${vehicle.id}`,
      channels: Array.from({ length: 4 }, (_, i) => ({
        label: `CH ${i + 1}`,
        value: i + 1
      })),
    };
  }

  initializeCarouselPages(): void {
  this.carouselPages = [];
  const camerasPerPage = 8; // max 8 per page (grid will handle layout)
  const totalPages = Math.ceil(this.cameraDevices.length / camerasPerPage);

  let cameraId = 1;
  for (let page = 0; page < totalPages; page++) {
    const start = page * camerasPerPage;
    const end = start + camerasPerPage;
    const pageDevices = this.cameraDevices.slice(start, end);

    const pageGrids: CameraGrid[] = pageDevices.map((device) => {
      const channel = device.channels[0];
      return {
        id: cameraId++,
        imei: device.imei,
        channel,
        channels: device.channels, // keep channels for dropdown
        channelName: channel.value,
        videoSrc: `${this.videoBaseUrl}${device.imei}-${channel.value}.live.flv`,
      };
    });

    this.carouselPages.push(pageGrids);
  }

}


  onChannelSelect(camera: CameraGrid, newChannel: any): void {
    
    camera.channel = newChannel; // update the object
    camera.videoSrc = `${this.videoBaseUrl}${camera.imei}-${newChannel}.live.flv`;
  }


  onPageChange(event: any): void {
    this.currentPageIndex = event.page;
  }

  onVideoError(camera: CameraGrid, event: any): void {
    console.error(`Video error for camera ${camera.id}:`, event);
    // Handle video loading errors here
  }

  onVideoLoaded(camera: CameraGrid): void {
    console.log(`Video loaded for camera ${camera.id}`);
  }

  // Additional methods for template functionality
  trackByCamera(index: number, camera: CameraGrid): number {
    return camera.id;
  }



  toggleVideoPlay(videoElement: HTMLVideoElement): void {
    if (videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

  toggleFullscreen(camera: CameraGrid): void {
    this.selectedFullscreenCamera = camera;
    this.showFullscreenModal = true;
  }

  closeFullscreen(): void {
    this.showFullscreenModal = false;
    this.selectedFullscreenCamera = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}