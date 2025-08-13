import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../shared/components/generic-table/generic-table.component';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { DEVICE_TABLE_TOOLBAR } from '../../shared/constants/table-toolbar';
import { DEVICE_TABLE_CONFIG } from '../../shared/constants/table-config';
import { selectVehicleLoading, selectVehicles, selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';
import { CommonModule } from '@angular/common';
import { loadVehicles } from '../../store/vehicle/vehicle.actions';
import { selectAllDevices, selectDevicesLoaded, selectDevicesLoading } from '../../store/devices/devices.selectors';
import { loadDevices } from '../../store/devices/devices.actions';

@Component({
    selector: 'app-devices',
    imports: [GenericTableComponent, CommonModule],
    templateUrl: './devices.component.html',
    styleUrl: './devices.component.scss'
})
export class DevicesComponent implements OnDestroy, OnInit {
    private store = inject(Store);
    private destroy$ = new Subject<void>();

    devices$: Observable<any[]> = this.store.select(selectAllDevices);
    isLoading$: Observable<boolean> = this.store.select(selectDevicesLoading);
    devicesLoaded$: Observable<boolean> = this.store.select(selectDevicesLoaded);

    toolbarItems = DEVICE_TABLE_TOOLBAR;
    tableConfig = DEVICE_TABLE_CONFIG;
    selectedRowItems: any[] = [];

    ngOnInit(): void {
        // Default load vehicles tab
        this.devicesLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
            if (!loaded) this.store.dispatch(loadDevices());
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    async handleToolBarActions(event: any): Promise<void> {
        if (event.key === 'create') {
            console.log(event);
        }
    }
}
