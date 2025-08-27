import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-offline',
  imports: [ButtonModule, RippleModule, RouterModule],
  standalone: true,
  template: `
    <div class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div class="rounded-3xl p-1 bg-gradient-to-b from-pink-300/40 to-blue-300/10">
          <div class="bg-white dark:bg-gray-800 py-20 px-8 sm:px-20 rounded-3xl flex flex-col items-center shadow-lg">
            <!-- Icon -->
            <div class="flex justify-center items-center border-2 border-pink-500 rounded-full h-16 w-16 mb-4">
              <i class="pi pi-fw pi-wifi-off text-pink-500 text-3xl"></i>
            </div>

            <!-- Title -->
            <h1 class="text-gray-900 dark:text-gray-100 font-bold text-4xl sm:text-5xl mb-2">No Internet Connection</h1>

            <!-- Subtitle -->
            <p class="text-gray-500 dark:text-gray-400 mb-8 text-center">
              You are currently offline. Please check your internet connection to continue.
            </p>

            <!-- Illustration -->
            <img src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg" 
                 alt="Offline" 
                 class="mb-8 w-80 sm:w-[400px] object-contain" />

            <!-- Button -->
            <div class="text-center">
              <p-button label="Retry" (click)="retry()" icon="pi pi-refresh" class="p-button-rounded p-button-lg"></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OfflineComponent {
  retry() {
    // Reload page or re-check network
    window.location.reload();
  }
}
