import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  isOnline = signal<boolean>(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));
  }

  private updateStatus(status: boolean) {
    this.isOnline.set(status);
  }
}
