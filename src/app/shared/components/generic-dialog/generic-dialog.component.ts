import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { UiService } from '../../../layout/service/ui.service';
import { DialogConfig } from '../../interfaces/generic-components';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-generic-dialog',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="dialogConfig?.header"
            [modal]="dialogConfig?.modal ?? true"
            [closable]="dialogConfig?.closable ?? true"
            [dismissableMask]="dialogConfig?.dismissableMask ?? true"
            [resizable]="dialogConfig?.resizable ?? false"
            [draggable]="dialogConfig?.draggable ?? true"
            [blockScroll]="dialogConfig?.blockScroll ?? false"
            [position]="dialogConfig?.position ?? 'center'"
            [minY]="dialogConfig?.minY"
            [maximizable]="dialogConfig?.maximizable ?? false"
            [baseZIndex]="dialogConfig?.baseZIndex ?? 1000"
            [styleClass]="dialogConfig?.styleClass ?? '!w-full md:!w-96 lg:!w-[35rem]'"
            (onHide)="close()"
        >
            <ng-template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <i [ngClass]="dialogConfig.headerIcon" class="text-white text-xl"></i>
                        </div>
                        <div>
                            <span class="text-xl font-bold text-gray-800">{{ dialogConfig.header }}</span>
                            <p class="text-sm text-gray-600">{{dialogConfig.subheader}}</p>
                        </div>
                    </div>
                </div>
            </ng-template>

            <ng-container *ngIf="dialogConfig?.content; else defaultContent">
                <ng-container *ngTemplateOutlet="dialogConfig?.content"></ng-container>
            </ng-container>
            <ng-template #defaultContent>
                <h2>Dialog Content</h2>
            </ng-template>
        </p-dialog>
    `
})
export class GenericDialogComponent {
    dialogConfig: DialogConfig | any = null;
    visible = false;

    constructor(private uiService: UiService) {
        effect(() => {
            this.dialogConfig = this.uiService.dialogConfig();
            console.log(this.dialogConfig);

            this.visible = !!this.dialogConfig;
        });
    }

    close(): void {
        this.uiService.closeDialog();
    }
}
