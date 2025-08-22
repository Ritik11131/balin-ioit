import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { Observable } from 'rxjs';
import { MenuItem, VehicleDetailsMenuBuilderService } from '../../../../../service/vehicle-details-menu-builder.service';
import { CommonModule } from '@angular/common';
import { VehicleStatusPipe } from '../../../../../../shared/pipes/vehicle-status.pipe';
import { TabsModule } from 'primeng/tabs';
import { SkeletonModule } from 'primeng/skeleton';
import { TimeAgoPipe } from '../../../../../../shared/pipes/time-ago.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LiveStreamingService } from '../../../../../service/live-streaming.service';

export interface VehicleActionEvent {
  actionKey: string;
  actionType: string;
  data?: any;
}

@Component({
  selector: 'app-vehicle-details',
  imports: [ButtonModule, TieredMenuModule, CommonModule, VehicleStatusPipe, TabsModule, SkeletonModule, TimeAgoPipe],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent implements OnInit, OnChanges {

  @Input() vehicle: any;

  @Output() actionExecuted = new EventEmitter<VehicleActionEvent>();

  menuItems$!: Observable<MenuItem[]> | any;
  activeTabIndex = 'overview';
  iframeUrl!: SafeResourceUrl | null;
  primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();


  constructor(private menuBuilder: VehicleDetailsMenuBuilderService, private liveStreamingService: LiveStreamingService) {
    // const url = `https://live-streaming-6afbf.web.app/index.html?protocol=cvpro&uniqueId=175205591682&justStream=true&themeColor=${this.primaryColor.replace('#', '')}`;
    // this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngOnChanges(changes: any): void {
    // Handle changes to the vehicle input if necessary
    console.log('Vehicle Details Component Input Changed:', changes);
  }

  ngOnInit(): void {
    this.menuItems$ = this.menuBuilder.buildFlatMenuItems(
      (actionKey, actionType, item) => this.handleCommand(actionKey, actionType, item),
      (actionKey) => this.handleNavigation(actionKey)
    );

    this.iframeUrl = this.liveStreamingService.getStreamingUrl({
      protocol: this.vehicle?.apiObject?.device?.protocol,
      uniqueId: this.vehicle?.apiObject?.device?.deviceId,
      justStream: true,
      themeColor: this.primaryColor
    });    

    console.log('Vehicle Details Component Initialized', this.menuItems$);

  }

  private handleCommand(actionKey: string, actionType: string, item?: MenuItem) {
    console.log(`Executing command: ${actionKey} - ${actionType}`, item);

    this.actionExecuted.emit({
      actionKey,
      actionType,
      data: { item }
    });
  }

  private handleNavigation(actionKey: string) {
    console.log(`Navigating to: ${actionKey}`);

    this.actionExecuted.emit({
      actionKey,
      actionType: 'navigation'
    });
  }

  // this.canUseDashCam$ = this.store.select(selectIsFeatureEnabled('web', 'actions', 'dashCam'));
  //   this.canUseElocking$ = this.store.select(selectIsFeatureEnabled('web', 'actions', 'elocking'));
  //   this.canUseParking$ = this.store.select(selectIsFeatureEnabled('web', 'actions', 'parking'));
  //   this.canUseSecurity$ = this.store.select(selectIsFeatureEnabled('web', 'actions', 'security'));

  // this.userConfig$ = this.store.select(selectUserConfiguration);
  //   this.webConfig$ = this.store.select(selectWebConfig);
  //   this.androidConfig$ = this.store.select(selectAndroidConfig);
  //   this.loading$ = this.store.select(selectUserConfigurationLoading);
  //   this.error$ = this.store.select(selectUserConfigurationError);

  // Permission checks
  // this.hasDeleteUserPermission$ = this.store.select(selectHasPermission('web', 'deleteUser'));
  // this.canCreateDealer$ = this.store.select(selectHasPermission('web', 'createDealer'));

  // Helper method to check if a feature is enabled
  // isFeatureEnabled(platform: 'web' | 'android', section: string, feature: string): Observable<boolean> {
  //   return this.store.select(selectIsFeatureEnabled(platform, section, feature));
  // }

}
