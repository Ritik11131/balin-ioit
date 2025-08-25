import { StoreService } from './../../pages/service/store.service';
import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../pages/service/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, ButtonModule, TieredMenuModule],
  template: `
    <div class="fixed top-0 h-[60px] bg-white z-40 transition-all duration-300 ease-in-out" 
         [ngClass]="isSidebarExpanded ? 'left-[280px]' : 'left-[88px]'" 
         [ngStyle]="{ right: '0' }">
      <div class="h-[60px] flex items-center justify-between px-6 border-b border-[#F1F3F9]">
        <div class="text-lg font-semibold text-gray-800"></div>

        <div class="flex items-center gap-4">
          <div class="relative">
            <app-configurator />
          </div>

          <div class="flex items-center cursor-pointer relative" (click)="menu.toggle($event)">
            <p-button icon="pi pi-user" [rounded]="true" [outlined]="true" class="mr-2"></p-button>
            <div class="flex flex-col mr-2">
              <span class="font-medium text-gray-800">{{ userName }}</span>
              <span class="text-xs text-gray-500">{{ userType }}</span>
            </div>
            <p-tieredMenu #menu [model]="items" [popup]="true" appendTo="body"></p-tieredMenu>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppTopbar implements OnInit {
  @Input() isSidebarExpanded = false;

  items: MenuItem[] = [];
  userName!: string;
  userType!: string;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.userName = this.authService.userName;
    this.userType = this.authService.userType;
    this.buildMenu();
  }

  buildMenu() {
    const children = this.authService.getChildren();
    const childItems = children.map((child, index) => ({
      label: `Go To ${child.userName}`,
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.switchToChild(index);
        this.userName = this.authService.userName;
        this.userType = this.authService.userType;
        this.buildMenu(); // Rebuild menu after removing later children
        this.storeService.startAutoRefresh();
        
      }
    }));

    this.items = [
      {
        label: 'Switch to Parent',
        icon: 'pi pi-user-edit',
        command: () => {
          console.log('okk');
          this.authService.switchToParent();
          this.userName = this.authService.userName;
          this.userType = this.authService.userType;
          this.buildMenu();
          this.storeService.startAutoRefresh();
          
        }
      },
      {
        label: 'Child Accounts',
        icon: 'pi pi-users',
        items: childItems
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
      },
      { separator: true }
    ];
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }
}
