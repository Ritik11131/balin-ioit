import { Component, AfterViewInit, ElementRef, ViewChild, inject } from '@angular/core';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { icon, latLng, Map, marker, point, polyline, tileLayer } from 'leaflet';
import { Observable, Subject, takeUntil } from 'rxjs';
import { selectVehicleLoading, selectVehiclePolling, selectVehicles } from '../../../../store/vehicle/vehicle.selectors';
import { Store } from '@ngrx/store';
import { constructVehicleData, sortVehiclesByStatus } from '../../../../shared/utils/helper_functions';

@Component({
  selector: 'app-track-map',
  standalone: true,
  imports: [LeafletModule],
  template: `
      
      <div
        leaflet
        [leafletOptions]="options"
        (leafletMapReady)="onMapReady($event)"
        class="h-[calc(100vh-60px)] w-[100vw-43 0px] lg:w-[calc(100vw-430px)] lg:h-[calc(100vh-60px)]"
      ></div>
   
  `,
})
export class TrackMapComponent implements AfterViewInit {

  private map!: L.Map;
  private store = inject(Store);
  private destroy$ = new Subject<void>();

  vehicles$: Observable<any[]> = this.store.select(selectVehicles);
  loading$: Observable<boolean> = this.store.select(selectVehicleLoading);
  polling$: Observable<boolean> = this.store.select(selectVehiclePolling);

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&amp;copy; OpenStreetMap contributors'
      })
    ],
    zoom: 7,
    center: latLng([ 46.879966, -121.726909 ])
  };

  ngAfterViewInit(): void {
    
  }

  onMapReady(map: Map) {
    this.map = map;
  }
}
