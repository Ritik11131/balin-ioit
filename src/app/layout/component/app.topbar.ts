import { Component } from '@angular/core';
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
        <div class="fixed top-0 left-[88px] right-0 h-[84px] bg-white z-40">
            <!-- TOP: Title section (60px) -->
            <div class="h-[60px] flex items-center justify-between px-6 border-b border-[#F1F3F9]">
                <!-- Left: Page title -->
                <div class="text-lg font-semibold text-gray-800">Dashboard</div>

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

            <!-- BOTTOM: Breadcrumb section (24px) -->
            <div class="h-[24px] flex items-center px-6 text-sm text-gray-500 gap-1">
                <!-- Breadcrumb icon -->
                <img src="images/topbar/icon_breadcrumb_home.svg" alt="Breadcrumb Icon" class="mr-1" />

                <span class="mx-2">/</span>

                <!-- Breadcrumb trail -->
                <span class="text-gray-400">Dashboard</span>
            </div>
        </div>
    `
})
export class AppTopbar {
    items!: MenuItem[];

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
