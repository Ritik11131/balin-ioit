import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { selectDeviceTypes } from '../../store/device-type/selectors';
import { selectVehicleTypes } from '../../store/vehicle-type/selectors';
import { selectUsers } from '../../store/users/users.selectors';
import { selectVehicles } from '../../store/vehicle/vehicle.selectors';

@Injectable({
  providedIn: 'root'
})
export class FormEnricherService {

   constructor(private store: Store) {}

  enrichForms(configs: any[]): Observable<any[]> {
    return combineLatest([
      this.store.select(selectDeviceTypes),
      this.store.select(selectVehicleTypes),
      this.store.select(selectUsers),
      this.store.select(selectVehicles)
    ]).pipe(
      map(([deviceTypes, vehicleTypes, users, vehicles]) => {
        const sourceMap: Record<string, any[]> = {
          deviceTypes,
          vehicleTypes,
          users,
          vehicles
        };

        console.log(sourceMap,'map');
        

        const mapOptions = (data: any[], labelKey: string = 'name') =>
          data?.map(d => ({ label: d[labelKey], value: d.id })) || [];
        

        const fillField = (field: any) => {
          if (field.dataSource && sourceMap[field.dataSource]) {
            const labelKey = field.dataSource === 'users' ? 'userName' : 'name';
            field.options = mapOptions(sourceMap[field.dataSource], labelKey);
          }
          return field;
        };


        return configs.map(config => {
          if (config.fields) {
            config.fields = config.fields.map(fillField);
          }
          if (config.formGroups) {
            config.formGroups.forEach((g: any) => g.fields = g.fields.map(fillField));
          }
          return config;
        });
      })
    );
  }
}
