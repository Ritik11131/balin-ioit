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
            <div class="flex items-center gap-2 border-b border-surface">
              <span class="font-bold text-2xl py-4 ">{{headerName}}</span>
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
    @Input() contentTemplate: TemplateRef<any> | null = null;

  constructor(private uiService: UiService) { }

    close() {
        this.uiService.closeDrawer();
    }
}
