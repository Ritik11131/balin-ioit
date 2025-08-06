import { Component, inject, OnInit } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { TrackMapComponent } from './components/track-map/track-map.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { Store } from '@ngrx/store';
import { loadVehicles } from '../../store/vehicle/vehicle.actions';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectVehiclesLoaded } from '../../store/vehicle/vehicle.selectors';

@Component({
    selector: 'app-home',
    imports: [TabsModule, TrackMapComponent, ListViewComponent],
    template: `
        <div class="w-full h-[calc(100vh-60px)]">
            <!-- Subtract topbar height -->
            <div class="flex flex-col lg:flex-row h-full">
                <!-- Left Panel -->
                <div class="w-full lg:w-[340px] lg:flex-shrink-0 h-full">
                    <app-list-view />
                </div>

                <!-- Right Panel -->
                <div class="flex-1 min-w-0 h-full">
                        <app-track-map />
                </div>
            </div>
        </div>
    `
})
export class HomeComponent implements OnInit {

      private store = inject(Store);
      private destroy$ = new Subject<void>();

      vehiclesLoaded$: Observable<boolean> = this.store.select(selectVehiclesLoaded);
    
    
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
         this.vehiclesLoaded$.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
              if (!loaded) {
                this.store.dispatch(loadVehicles());
              }
            });
       
    }

    
}
