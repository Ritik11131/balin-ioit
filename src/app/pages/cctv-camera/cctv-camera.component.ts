import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { environment } from '../../../environments/environment';

interface CameraDevice {
  imei: string;
  name: string;
  channels: string[];
}

interface CameraGrid {
  id: number;
  deviceImei: string;
  channelName: string;
  videoSrc: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-cctv-camera',
  imports:[CarouselModule, SelectModule, DialogModule, FormsModule, CommonModule, ButtonModule],
  templateUrl: './cctv-camera.component.html',
  styleUrls: ['./cctv-camera.component.scss']
})
export class CctvCameraComponent implements OnInit {
  
  // Configuration for camera devices
  cameraDevices: CameraDevice[] = [
    {
      imei: '865166050123456',
      name: 'Camera Device 1',
      channels: ['Ch1', 'Ch2', 'Ch3', 'Ch4']
    },
    {
      imei: '865166050234567',
      name: 'Camera Device 2', 
      channels: ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5']
    },
    {
      imei: '865166050345678',
      name: 'Camera Device 3',
      channels: ['Ch1', 'Ch2', 'Ch3']
    },
    {
      imei: '865166050456789',
      name: 'Camera Device 4',
      channels: ['Ch1', 'Ch2', 'Ch3', 'Ch4', 'Ch5', 'Ch6']
    },
    {
      imei: '865166050567890',
      name: 'Camera Device 5',
      channels: ['Ch1', 'Ch2']
    }
  ];

  // Carousel data - 5 pages of 5x5 grids (250 total cameras)
  carouselPages: CameraGrid[][] = [];
  currentPageIndex: number = 0;
  selectedCameras: Set<number> = new Set();

  // Video player settings
  videoBaseUrl: string = environment.cctcCameraFlv;
  
  // Fullscreen modal properties
  showFullscreenModal: boolean = false;
  selectedFullscreenCamera: CameraGrid | null = null;
  
  constructor() {}

  ngOnInit(): void {
    this.initializeCarouselPages();
  }

  initializeCarouselPages(): void {
    const totalPages = 5;
    const camerasPerPage = 8; // 5x5 grid
    let cameraId = 1;

    for (let page = 0; page < totalPages; page++) {
      const pageGrids: CameraGrid[] = [];
      
      for (let i = 0; i < camerasPerPage; i++) {
        const deviceIndex = (cameraId - 1) % this.cameraDevices.length;
        const device = this.cameraDevices[deviceIndex];
        const channelIndex = (cameraId - 1) % device.channels.length;
        const channelName = device.channels[channelIndex];
        
        const cameraGrid: CameraGrid = {
          id: cameraId,
          deviceImei: device.imei,
          channelName: channelName,
          videoSrc: `${this.videoBaseUrl}${device.imei}-${channelName}`,
          isSelected: false
        };
        
        pageGrids.push(cameraGrid);
        cameraId++;
      }
      
      this.carouselPages.push(pageGrids);
    }
  }

  onChannelSelect(camera: CameraGrid, newChannel: string): void {
    // Update the camera's channel and video source
    camera.channelName = newChannel;
    camera.videoSrc = `${this.videoBaseUrl}${camera.deviceImei}-${newChannel}`;
    
    // Toggle selection
    if (this.selectedCameras.has(camera.id)) {
      this.selectedCameras.delete(camera.id);
      camera.isSelected = false;
    } else {
      this.selectedCameras.add(camera.id);
      camera.isSelected = true;
    }
    
    console.log(`Camera ${camera.id} switched to ${newChannel}:`, camera.videoSrc);
  }

  onPageChange(event: any): void {
    this.currentPageIndex = event.page;
  }

  getAvailableChannels(deviceImei: string): string[] {
    const device = this.cameraDevices.find(d => d.imei === deviceImei);
    return device ? device.channels : [];
  }

  getSelectedCamerasCount(): number {
    return this.selectedCameras.size;
  }

  clearAllSelections(): void {
    this.selectedCameras.clear();
    this.carouselPages.forEach(page => {
      page.forEach(camera => {
        camera.isSelected = false;
      });
    });
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

  getChannelOptions(deviceImei: string): { label: string, value: string }[] {
    const device = this.cameraDevices.find(d => d.imei === deviceImei);
    if (!device) return [];
    
    return device.channels.map(channel => ({
      label: channel,
      value: channel
    }));
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
}