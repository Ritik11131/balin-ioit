import { Component, Input, SimpleChanges } from '@angular/core';
import { Button } from "primeng/button";
import { GenericFormGeneratorComponent } from "../generic-form-generator/generic-form-generator.component";

@Component({
  selector: 'app-generic-point-markers',
  imports: [Button, GenericFormGeneratorComponent],
  templateUrl: './generic-point-markers.component.html',
  styleUrl: './generic-point-markers.component.scss'
})
export class GenericPointMarkersComponent {

    @Input() vehicle: any;
    @Input() formFields: any;

    defaultPlaybackObj = {}


    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['vehicle']?.currentValue) return;
    
        const vehicleId = changes['vehicle'].currentValue.id;
    
        // Prepare today's date range in local timezone (+05:30)
        const today = new Date();
        const formatDate = (d: Date, hour: number, min: number, sec: number) =>
          new Date(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}+05:30`);
    
        this.defaultPlaybackObj = {
          vehicle: vehicleId,
          date: [
            formatDate(today, 0, 0, 0),   // start of today
            formatDate(today, 23, 59, 59) // end of today
          ]
        };
    
        this.onFormSubmit({ isEditMode: true, formValue: this.defaultPlaybackObj });
      }



    handleBackClick() {

    }

    onFormSubmit(e: any) {

    }

}
