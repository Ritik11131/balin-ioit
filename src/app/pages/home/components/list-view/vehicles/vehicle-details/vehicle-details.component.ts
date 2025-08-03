import { Component, Input } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'app-vehicle-details',
  imports: [ButtonModule, TieredMenuModule],
  templateUrl: './vehicle-details.component.html',
  styleUrl: './vehicle-details.component.scss'
})
export class VehicleDetailsComponent {

  @Input() vehicle: any;

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
