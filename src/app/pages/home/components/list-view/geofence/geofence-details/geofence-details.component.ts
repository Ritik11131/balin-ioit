import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { GenericTableComponent } from "../../../../../../shared/components/generic-table/generic-table.component";
import { LINKED_DEVICE_TABLE_CONFIG, USER_TABLE_CONFIG } from '../../../../../../shared/constants/table-config';
import { GeofenceService } from '../../../../../service/geofence.service';
import { UiService } from '../../../../../../layout/service/ui.service';

@Component({
  selector: 'app-geofence-details',
  imports: [ButtonModule, TieredMenuModule, CommonModule, TabsModule, SkeletonModule, GenericTableComponent],
  templateUrl: './geofence-details.component.html',
  styleUrl: './geofence-details.component.scss'
})
export class GeofenceDetailsComponent {

  @Input() geofence: any;

  @Output() actionExecuted = new EventEmitter<any>();

  private actionHandlers: Record<string, (row: any) => void> = {
    'Unlink': (row) => this.unlinkGeofenceHandler(row),
  };

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
    tableConfig = LINKED_DEVICE_TABLE_CONFIG;

    constructor(private geofenceService: GeofenceService, private uiService: UiService) {}
  

  handleCommand(actionKey: string, actionType: string) {
     this.actionExecuted.emit({ actionKey, actionType });
  }

  handleInTableActions(event: any) {
    const { label, row } = event;
    this.actionHandlers[label]?.(row);
  }

  unlinkGeofenceHandler(row: any) {
     this.actionExecuted.emit({ actionKey:'unlink', actionType:'command', data:{deviceId:row.id, geofenceId: this.geofence?.geofence?.id} });
  }
  

}
