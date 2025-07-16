import { Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { listViewTabs } from '../../../../shared/constants/list-view';
@Component({
    selector: 'app-list-view',
    imports: [TabsModule, NgComponentOutlet],
    template: `
            <div class="bg-[#F9F9F9] shadow-sm border border-gray-200 p-4 h-full">
    <p-tabs [(value)]="activeTabIndex" class="h-full">
        <p-tablist>
            @for (tab of tabs; track tab.value) {
                <p-tab [value]="tab.value">{{ tab.title }}</p-tab>
            }
        </p-tablist>
        <p-tabpanels>
            <p-tabpanel [value]="activeTabIndex">
                <ng-container *ngComponentOutlet="getActiveComponent()"></ng-container>
            </p-tabpanel>
        </p-tabpanels>
    </p-tabs>
</div>
    `,
    styles: [
        `
            :host ::ng-deep .p-tablist-tab-list,
            :host ::ng-deep .p-tabpanels {
                background: none;
            }

            :host ::ng-deep .p-tabpanels {
                padding: 0;
            }
        `
    ]
})
export class ListViewComponent {
    activeTabIndex = 0;
    
    tabs = listViewTabs

    getActiveComponent() {
        const activeTab = this.tabs.find(tab => tab.value === this.activeTabIndex);
        return activeTab?.component || null;
    }
}
