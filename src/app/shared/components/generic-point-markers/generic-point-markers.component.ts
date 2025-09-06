import { Component, Input } from '@angular/core';
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

}
