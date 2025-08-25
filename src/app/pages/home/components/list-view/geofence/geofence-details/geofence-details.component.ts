import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'app-geofence-details',
  imports: [ButtonModule, TieredMenuModule, CommonModule, TabsModule, SkeletonModule],
  templateUrl: './geofence-details.component.html',
  styleUrl: './geofence-details.component.scss'
})
export class GeofenceDetailsComponent {

  @Input() geofence: any;
  @Input() geofenceLinkedVehicles: any[] = [];

  @Output() actionExecuted = new EventEmitter<any>();

  geofenceMenuItems = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.handleCommand('edit', 'command')
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.handleCommand('delete', 'command')
    },
  ];

  handleCommand(actionKey: string, actionType: string) {
     this.actionExecuted.emit({ actionKey, actionType });
  }
  

}
