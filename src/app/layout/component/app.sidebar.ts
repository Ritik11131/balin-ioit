// sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, inject } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../pages/service/auth.service';
import { SidebarService } from '../../pages/service/sidebar.service';
import { WhitelabelThemeService } from '../../pages/service/whitelabel-theme.service';



@Component({
    selector: 'app-sidebar',
    imports: [CommonModule],
    template: `
       <div class="fixed top-0 left-0 h-screen bg-white flex flex-col py-6 transition-all duration-300 ease-in-out z-50 border-r border-gray-200" [ngClass]="isExpanded ? 'w-[280px]' : 'w-[88px]'"
>
  <!-- 1. LOGO SECTION -->
  <div class="flex flex-col items-center px-4">
    @if (theme$ | async; as theme) {
      <img [src]="theme.logo" alt="Logo" class="w-[45px] h-[45px]" />
    }
  </div>

  <!-- 2. NAVIGATION ICONS -->
  <div class="flex-1 flex flex-col items-center mt-16 w-full px-7 space-y-4">
    @for (item of sidebarItems$ | async; track $index) {
      <ng-container>
        <div
          (click)="setActive(item.key, item.route)"
          class="flex items-center cursor-pointer transition-all duration-200 ease-in-out rounded-xl group"
          [ngClass]="{
            'w-12 h-12 justify-center p-3': !isExpanded,
            'w-full h-12 justify-start px-4': isExpanded,
            'bg-primary text-white shadow-md': activeItem === item.key,
            'hover:bg-primary/10 hover:text-primary': activeItem !== item.key
          }"
        >
          <i [ngClass]="item.icon" class="text-lg ml-2 transition-transform duration-200 group-hover:scale-110"></i>

          <span
            class="ml-3 text-md font-semibold truncate transition-all duration-200"
            [ngClass]="{
              'opacity-0 w-0 overflow-hidden': !isExpanded,
              'opacity-100 w-auto': isExpanded,
              'text-white': activeItem === item.key,
              'text-gray-700 group-hover:text-primary': activeItem !== item.key
            }"
          >
            {{ item.name }}
          </span>
        </div>
      </ng-container>
    }
  </div>

  <!-- 3. SUPPORT + LOGOUT SECTION -->
  <div class="flex flex-col gap-4 mb-4 w-full" [ngClass]="isExpanded ? 'px-4' : 'items-center'">
    <!-- Support Icon -->
    <div
      class="h-[48px] rounded-[12px] flex items-center cursor-pointer transition-all duration-200 relative overflow-hidden hover:bg-gray-50"
      [ngClass]="{
        'w-[48px] justify-center mx-auto': !isExpanded,
        'w-full justify-start px-3': isExpanded
      }"
    >
      <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
        <img src="assets/icon_support.png" alt="Support" class="w-[20px] h-[20px]" />
      </div>

      <div
        class="ml-3 whitespace-nowrap transition-all duration-200 ease-in-out"
        [ngClass]="{
          'opacity-0 w-0 overflow-hidden ml-0': !isExpanded,
          'opacity-100 w-auto ml-3': isExpanded
        }"
      >
        <span class="text-sm font-medium text-gray-700">Support</span>
      </div>
    </div>

    <!-- Logout Icon -->
    <div
      class="h-[48px] rounded-[12px] flex items-center cursor-pointer transition-all duration-200 relative overflow-hidden hover:bg-red-50"
      [ngClass]="{
        'w-[48px] justify-center mx-auto': !isExpanded,
        'w-full justify-start px-3': isExpanded
      }"
      (click)="handleLogout()"
    >
      <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
        <img src="images/sidebar/icon_logout.svg" alt="Logout" class="w-[20px] h-[20px]" />
      </div>

      <div
        class="ml-3 whitespace-nowrap transition-all duration-200 ease-in-out"
        [ngClass]="{
          'opacity-0 w-0 overflow-hidden ml-0': !isExpanded,
          'opacity-100 w-auto ml-3': isExpanded
        }"
      >
        <span class="text-sm font-medium text-red-600">Logout</span>
      </div>
    </div>
  </div>

  <!-- EXPAND/COLLAPSE BUTTON -->
  <button
    (click)="toggleSidebar()"
    class="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
  >
    <i class="pi text-gray-600 transition-transform duration-200" [ngClass]="isExpanded ? 'pi-chevron-left' : 'pi-chevron-right'"></i>
  </button>
</div>
    `,
    styles: [
        `
            /* Custom animation for smooth transitions */
            @keyframes pop {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }
        `
    ]
})
export class AppSidebar {
    @Output() sidebarToggle = new EventEmitter<boolean>();

    isExpanded = false;
    activeItem = '';
    clickedItem = '';
    sidebarItems$!: Observable<any[]>;
    private routerSubscription!: Subscription;
    private themeService = inject(WhitelabelThemeService);

    theme$ = this.themeService.theme$;

    constructor(
        private router: Router,
        private authService: AuthService,
        private sidebarService: SidebarService
    ) {}

    ngOnInit() {
        // filter items based on config
        this.sidebarItems$ = this.sidebarService.getSidebarItems();

        // set active item initially
        this.activeItem = this.sidebarService.getActiveKeyFromRoute(this.router.url);

        // listen to route changes
        this.routerSubscription = this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            this.activeItem = this.sidebarService.getActiveKeyFromRoute(event.urlAfterRedirects);
        });
    }

    ngOnDestroy() {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }

    setActive(key: string, route: string) {
        this.activeItem = key;
        this.clickedItem = key;
        this.router.navigate([route]);

        setTimeout(() => (this.clickedItem = ''), 300);
        if (this.isExpanded) {
            this.toggleSidebar();
        }
    }

    toggleSidebar() {
        this.isExpanded = !this.isExpanded;
        this.sidebarToggle.emit(this.isExpanded);
    }

    handleLogout() {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }
}