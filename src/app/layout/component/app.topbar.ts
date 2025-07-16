import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, AvatarModule, ButtonModule],
    template: `
        <!-- Topbar -->
    <div class="fixed top-0 h-[60px] bg-white z-40 transition-all duration-300 ease-in-out"
         [ngClass]="isSidebarExpanded ? 'left-[280px]' : 'left-[88px]'"
         [ngStyle]="{ 'right': '0' }">
      
      <!-- TOP: Title section (60px) -->
      <div class="h-[60px] flex items-center justify-between px-6 border-b border-[#F1F3F9]">
        <!-- Left: Page title -->
        <div class="text-lg font-semibold text-gray-800"></div>

        <!-- Right: Notifications and avatar -->
        <div class="flex items-center gap-4">
          <div class="relative">
            <button
              pButton
              outlined
              text
              class="layout-topbar-action layout-topbar-action-highlight"
              pStyleClass="@next"
              enterFromClass="hidden"
              enterActiveClass="animate-scalein"
              leaveToClass="hidden"
              leaveActiveClass="animate-fadeout"
              [hideOnOutsideClick]="true"
            >
              <i class="pi pi-palette"></i>
            </button>
            <app-configurator />
          </div>
          <p-avatar icon="pi pi-user" class="mr-2" size="large" />
        </div>
      </div>

      
    </div>
    `
})
export class AppTopbar {
    @Input() isSidebarExpanded = false;


    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
