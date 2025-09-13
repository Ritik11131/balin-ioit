import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { UiService } from '../../../layout/service/ui.service';

@Component({
    selector: 'app-generic-drawer',
    imports: [CommonModule, DrawerModule, ButtonModule],
    template: ` <p-drawer [modal]="modal" [(visible)]="isOpen" [dismissible]="false" position="right" (onHide)="close()" [styleClass]="styleClass">
        <ng-template #header>
            <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <i [ngClass]="headerIcon" class="text-white text-xl"></i>
                        </div>
                        <div>
                            <span class="text-xl font-bold text-gray-800">{{ headerName }}</span>
                            <p class="text-sm text-gray-600">{{subHeaderName}}</p>
                        </div>
                    </div>
                </div>
        </ng-template>
        @if (contentTemplate) {
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
        } @else {
            <ng-template #defaultContent>
                <h2 class="text-xl font-semibold mb-4">Drawer Content</h2>
                <p>This is the default content of the drawer.</p>
            </ng-template>
        }
    </p-drawer>`
})
export class GenericDrawerComponent {
    @Input() modal = false;
    @Input() isOpen = false;
    @Input() styleClass = '!w-full md:!w-96 lg:!w-[35rem]';
    @Input() headerName = 'Default Header';
    @Input() headerIcon = 'pi pi-file';
    @Input() subHeaderName = 'Default SubHeader'
    @Input() contentTemplate: TemplateRef<any> | null = null;

  constructor(private uiService: UiService) { }

    close() {
        this.uiService.closeDrawer();
    }
}
