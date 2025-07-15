// sidebar.component.ts
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { sidebarItems } from '../../shared/constants/sidebar';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  template: `
    <div class="fixed top-0 left-0 h-screen bg-white flex flex-col py-6 justify-between transition-all duration-300 ease-in-out z-50 border-r border-gray-200"
         [ngClass]="isExpanded ? 'w-[280px]' : 'w-[88px]'">
      
      <!-- 1. LOGO SECTION -->
      <div class="flex flex-col items-center gap-4 px-4">
        <img src="images/sidebar/logo.svg" alt="Logo" class="w-[32px] h-[32px]" />
      </div>

      <!-- 2. NAVIGATION ICONS -->
      <div class="flex flex-col items-center gap-4 mt-3 w-full px-7">
        @for (item of sidebarNavigationItems; track $index) {
          <ng-container>
            <div
              (click)="setActive(item.key, item.route)"
              class="rounded-[12px] flex items-center cursor-pointer transition-all duration-200"
              [ngClass]="{
                'w-[48px] h-[48px] justify-center p-3 gap-3': !isExpanded,
                'w-full h-[48px] justify-start px-3 gap-3': isExpanded,
                'bg-[var(--primary-color)]': activeItem === item.key,
                'animate-[pop_0.3s_ease-in-out]': clickedItem === item.key
              }"
            >
              <img
                [src]="activeItem === item.key ? item.iconFilled : item.icon"
                [alt]="item.name"
                class="w-[20px] h-[20px]"
              />
              <span 
                class="text-sm font-medium text-gray-700 transition-all duration-200"
                [ngClass]="{
                  'opacity-0 w-0 overflow-hidden': !isExpanded,
                  'opacity-100 w-auto': isExpanded,
                  'text-white': activeItem === item.key
                }"
              >
                {{ item.name }}
              </span>
            </div>
          </ng-container>
        }
      </div>

      <!-- 3. SUPPORT + LOGOUT SECTION -->
      <div class="flex flex-col gap-4 mb-4 w-full" 
           [ngClass]="isExpanded ? 'px-4' : 'items-center'">
        
        <!-- Support Icon -->
        <div
          class="h-[48px] rounded-[12px] flex items-center cursor-pointer transition-all duration-200 relative overflow-hidden hover:bg-gray-50"
          [ngClass]="{
            'w-[48px] justify-center mx-auto': !isExpanded,
            'w-full justify-start px-3': isExpanded
          }"
        >
          <!-- Icon container - fixed width to prevent shifting -->
          <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
            <img src="assets/icon_support.png" alt="Support" class="w-[20px] h-[20px]" />
          </div>
          
          <!-- Label with proper spacing -->
          <div class="ml-3 whitespace-nowrap transition-all duration-200 ease-in-out"
               [ngClass]="{
                 'opacity-0 w-0 overflow-hidden ml-0': !isExpanded,
                 'opacity-100 w-auto ml-3': isExpanded
               }">
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
        >
          <!-- Icon container - fixed width to prevent shifting -->
          <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
            <img src="images/sidebar/icon_logout.svg" alt="Logout" class="w-[20px] h-[20px]" />
          </div>
          
          <!-- Label with proper spacing -->
          <div class="ml-3 whitespace-nowrap transition-all duration-200 ease-in-out"
               [ngClass]="{
                 'opacity-0 w-0 overflow-hidden ml-0': !isExpanded,
                 'opacity-100 w-auto ml-3': isExpanded
               }">
            <span class="text-sm font-medium text-red-600">Logout</span>
          </div>
        </div>
      </div>

      <!-- EXPAND/COLLAPSE BUTTON -->
      <button
        (click)="toggleSidebar()"
        class="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
      >
        <i 
          class="pi text-gray-600 transition-transform duration-200"
          [ngClass]="isExpanded ? 'pi-chevron-left' : 'pi-chevron-right'"
        ></i>
      </button>
    </div>
  `,
  styles: [`
    /* Custom animation for smooth transitions */
    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `]
})
export class AppSidebar {
  @Output() sidebarToggle = new EventEmitter<boolean>();
  
  isExpanded = false;
  activeItem = '';
  clickedItem = '';
  
  sidebarNavigationItems = sidebarItems;
  private routerSubscription: Subscription = new Subscription();

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial active item based on current route
    this.setActiveItemFromRoute(this.router.url);
    
    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveItemFromRoute(event.urlAfterRedirects);
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private setActiveItemFromRoute(url: string) {
    console.log(url);
    
    // Find the navigation item that matches the current route
    const matchedItem = this.sidebarNavigationItems.find(item => url === `/${item.key}`);
    console.log(matchedItem);
    
    
    if (matchedItem) {
      this.activeItem = matchedItem.key;
    }
  }


  setActive(key: string, route: string) {
    console.log(key,route);
    
    this.activeItem = key;
    this.clickedItem = key;
    
    // Navigate to the route
    this.router.navigate([route]);
    
    // Reset animation after delay
    setTimeout(() => {
      this.clickedItem = '';
    }, 300);
    if(this.isExpanded) {
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.sidebarToggle.emit(this.isExpanded);
  }
}