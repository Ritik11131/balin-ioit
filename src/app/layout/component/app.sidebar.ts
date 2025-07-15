import { Component, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sidebarItems } from '../../shared/constants/sidebar';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    template: `
       <div class="fixed top-0 left-0 h-screen w-[88px] bg-white flex flex-col items-center py-4 justify-between">
  <!-- 1. LOGO SECTION -->
  <div class="flex flex-col items-center gap-4">
    <img src="images/sidebar/logo.svg" alt="Logo" class="w-[32px] h-[32px]" />
  </div>

  <!-- 2. NAVIGATION ICONS -->
  <div class="flex flex-col items-center gap-4 mt-3">
    @for (item of sidebarNavigationItems; track $index) {
      <ng-container>
        <div
          (click)="setActive(item.key)"
          class="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
          [ngClass]="{
            'bg-[var(--primary-color)]': activeItem === item.key,
            'animate-[pop_0.3s_ease-in-out]': clickedItem === item.key
          }"
        >
          <img
            [src]="activeItem === item.key ? item.iconFilled : item.icon"
            [alt]="item.name"
            class="w-[20px] h-[20px]"
          />
        </div>
      </ng-container>
    }
  </div>

  <!-- 3. SUPPORT + LOGOUT SECTION -->
  <div class="flex flex-col items-center gap-6 mb-4">
    <!-- Support Icon -->
    <div
      class="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center cursor-pointer hover:bg-[var(--primary-color)] transition-colors"
    >
      <img src="assets/icon_support.png" alt="Support" class="w-[20px] h-[20px]" />
    </div>

    <!-- Logout Icon -->
    <div
      class="w-[48px] h-[48px] rounded-[12px] flex items-center justify-center cursor-pointer transition-colors"
    >
      <img src="images/sidebar/icon_logout.svg" alt="Logout" class="w-[20px] h-[20px]" />
    </div>
  </div>
</div>

    `
})
export class AppSidebar {
    constructor(public el: ElementRef) {}

    // Current active item key
    activeItem = 'dashboard';
    sidebarNavigationItems = sidebarItems;
    clickedItem: string | null = null;

    setActive(key: string): void {
        this.activeItem = key;
        this.clickedItem = key;

        // Remove the animation class after it finishes (~300ms)
        setTimeout(() => {
            this.clickedItem = null;
        }, 300);
    }
}
