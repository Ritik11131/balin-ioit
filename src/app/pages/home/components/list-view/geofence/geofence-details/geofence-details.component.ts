import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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
    console.log(`Executing command: ${actionKey} - ${actionType}`);
    // Emit an event or perform an action based on the command
  }
  

}
