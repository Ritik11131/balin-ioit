import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-geofence-filter',
    imports: [IconFieldModule, InputIconModule, ButtonModule, InputTextModule, CommonModule],
    template: `
        <div class="w-full h-[60px] bg-transparent py-4 flex flex-col justify-between gap-4">
            <div class="flex items-center justify-between w-full">
                <div class="flex">
                    <p-button icon="pi pi-plus" outlined label="Create"></p-button>
                </div>

                <p-iconfield>
                    <p-inputicon styleClass="pi pi-search" />
                    <input type="text" pInputText placeholder="Search" />
                </p-iconfield>

            </div>
        </div>
    `,
    styles: ``
})
export class GeofenceFilterComponent {}
