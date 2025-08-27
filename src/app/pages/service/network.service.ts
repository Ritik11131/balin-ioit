import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  // Signal to track online/offline status
  isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    // Listen to network changes
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
  }

  private updateStatus(status: boolean) {
    this.isOnline.set(status);
  }
}
