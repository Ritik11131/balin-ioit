import { Component, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiService } from './app/layout/service/ui.service';
import { TitleService } from './app/pages/service/title.service';
import { ToastModule } from 'primeng/toast';
import { GenericLoaderComponent } from './app/shared/components/generic-loader/generic-loader.component';
import { GenericDrawerComponent } from './app/shared/components/generic-drawer/generic-drawer.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StoreService } from './app/pages/service/store.service';
import { NetworkService } from './app/pages/service/network.service';
import { OfflineComponent } from "./app/shared/components/offline/offline.component";
import { Store } from '@ngrx/store';
import { logout } from './app/store/core/action';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ConfirmDialogModule, ToastModule, GenericLoaderComponent, GenericDrawerComponent, OfflineComponent],
    template: `

    @if(network.isOnline()) {
        <router-outlet></router-outlet>
        @if (uiService.isLoading()) {
            <app-generic-loader />
        }

        <app-generic-drawer [modal]="uiService.isDrawerModal()" [isOpen]="uiService.isDrawerOpen()" [contentTemplate]="uiService.drawerContent()" [header]="uiService.drawerHeader()" [styleClass]="uiService.drawerStyleClass()" />

        <p-toast
            [life]="2000"
            [breakpoints]="{
                '920px': { width: '50%' },
                '768px': { width: '60%' },
                '640px': { width: '70%' },
                '568px': { width: '80%' },
                '480px': { width: '90%' },
                '414px': { width: '80%' },
                '375px': { width: '80%' },
                '320px': { width: '80%' }
            }"
        />

        <p-confirmdialog />
    } @else {
        <app-offline></app-offline>
    }
    `
})
export class AppComponent {
    network = inject(NetworkService);
    private storeService = inject(StoreService);
    private store = inject(Store);

    constructor(public uiService: UiService, private titleService: TitleService) {
        effect(() => {
            if (this.network.isOnline()) {
                this.store.dispatch(logout());
                this.storeService.startAutoRefresh();
            } else {
                this.storeService.stopAutoRefresh();
            }
        });
     }

    ngOnInit(): void {
        this.titleService.init();
    }
}
