// form-field.interface.ts
export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'calendar' | 'autocomplete';
  required?: boolean;
  placeholder?: string;
  value?: any;
  inputId?:string;
  useGrouping?:any;
  options?: { label: string; value: any }[];
  validators?: ValidationRule[];
  gridCol?: number; // 1-12 for specific column span
  dataSource?: 'users' | 'deviceTypes' | 'vehicleTypes' | 'plans' | 'vehicles'; // NEW
  disabled?: any;
  rows?: number; // for textarea
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message?: string;
}

export interface FormConfig {
  fields: FormField[];
  columns?: 1 | 2 | 3 | 4 | 6 | 12; // Grid columns
  showSaveButton?: boolean;
  showCancelButton?: boolean;
  saveButtonText?: string;
  cancelButtonText?: string;
  formTitle?: string;
  isEditMode?: boolean;
}

// generic-form-generator.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

// PrimeNG Imports
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-generic-form-generator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule,
    CheckboxModule,
    RadioButtonModule,
    CalendarModule,
    DatePickerModule,
    AutoCompleteModule,
    ButtonModule,
    CardModule,
    FloatLabelModule
  ],
  template: `
<div class="w-full">
   <!-- Form Title -->
  @if (config.formTitle) {
    <h2 class="text-xl font-semibold text-gray-800 mb-6">
      {{ config.formTitle }}
    </h2>
  }
  <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()" class="space-y-4">

    <div 
      class="grid gap-4"
      [ngClass]="{
        'grid-cols-1': config.columns === 1,
        'grid-cols-2': config.columns === 2,
        'grid-cols-3': config.columns === 3,
        'grid-cols-4': config.columns === 4,
        'grid-cols-6': config.columns === 6,
        'grid-cols-12': config.columns === 12
      }"
    >

      @for (field of config.fields; track field.key) {
        <div [ngClass]="getFieldGridClass(field)" class="flex flex-col gap-2">

          @switch (field.type) {

            @case ('text') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: textInput }"></ng-container>
              <ng-template #textInput>
                <input
                  pInputText
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  type="text"
                  class="w-full"
                />
              </ng-template>
            }

            @case ('email') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: emailInput }"></ng-container>
              <ng-template #emailInput>
                <input
                  pInputText
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  type="email"
                  class="w-full"
                />
              </ng-template>
            }

             @case ('password') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: commonInput }"></ng-container>
              <ng-template #commonInput>
                <input
                  pInputText
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [type]="field.type"
                  class="w-full"
                />
              </ng-template>
            }

            @case ('number') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: numberInput }"></ng-container>
              <ng-template #numberInput>
                <p-inputNumber
                  [id]="field.key"
                  [inputId]="field.inputId"
                  [formControlName]="field.key"
                  [useGrouping]="field.useGrouping"
                  [min]="field.min"
                  [max]="field.max"
                  styleClass="w-full"
                ></p-inputNumber>
              </ng-template>
            }

            @case ('textarea') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: textareaInput }"></ng-container>
              <ng-template #textareaInput>
                <textarea
                  pInputTextarea
                  [id]="field.key"
                  [formControlName]="field.key"
                  [rows]="field.rows || 3"
                  class="w-full"
                ></textarea>
              </ng-template>
            }

            @case ('select') {
              <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: selectInput }"></ng-container>
              <ng-template #selectInput>
                <p-select
                  [id]="field.key"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [options]="field.options || []"
                  [filter]="true"
                  [virtualScroll]="true"
                  [virtualScrollItemSize]="38"
                  optionLabel="label"
                  optionValue="value"
                  styleClass="w-full"
                ></p-select>
              </ng-template>
            }

            @case ('date') {
               <ng-container *ngTemplateOutlet="fieldWrapper; context: { field: field, input: dateInput }"></ng-container>
                <ng-template #dateInput>
                  <p-datepicker styleClass="w-full" [id]="field.key" [formControlName]="field.key" [showIcon]="true" inputId="buttondisplay" [showOnFocus]="false" />
                </ng-template>
            }

          }
        </div>
      }
    </div>

    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
      @if (config.showCancelButton !== false) {
        <p-button [label]="config.cancelButtonText || 'Cancel'" severity="secondary" (onClick)="onCancel()" type="button"></p-button>
      }
      @if (config.showSaveButton !== false) {
        <p-button [label]="config.saveButtonText || (config.isEditMode ? 'Update' : 'Save')" type="submit" [disabled]="!dynamicForm.valid"></p-button>
      }
    </div>
  </form>

  <!-- Shared wrapper for label + error -->
  <ng-template #fieldWrapper let-field="field" let-input="input">
    <label [for]="field.key" class="font-medium">
      {{ field.label }} <span class="text-red-500" *ngIf="field.required">*</span>
    </label>
    <ng-container *ngTemplateOutlet="input"></ng-container>
    @if (isFieldInvalid(field.key)) {
      <small class="text-red-500 mt-1">{{ getFieldError(field.key) }}</small>
    }
  </ng-template>
</div>




  `
})
export class GenericFormGeneratorComponent implements OnInit, OnChanges {
  @Input() config!: FormConfig;
  @Input() initialData?: any;
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();
  @Output() formValueChanges = new EventEmitter<any>();

  dynamicForm!: FormGroup;
  filteredSuggestions: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] || changes['initialData']) {
      this.buildForm();
    }
  }

  private buildForm() {
    if (!this.config?.fields) return;

    const formControls: any = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const initialValue = this.getInitialValue(field);
      
      formControls[field.key] = [
        { value: initialValue, disabled: field.disabled === true },
        validators
      ];
    });

    this.dynamicForm = this.fb.group(formControls);

    // Subscribe to form changes
    this.dynamicForm.valueChanges.subscribe(value => {
      this.formValueChanges.emit(value);
    });
  }

  private getInitialValue(field: FormField): any {
    if (this.initialData && this.initialData.hasOwnProperty(field.key)) {
      return this.initialData[field.key];
    }
    return field.value || this.getDefaultValue(field.type);
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'multiselect':
        return [];
      case 'number':
        return null;
      default:
        return '';
    }
  }

  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    // Custom validators from field configuration
    if (field.validators) {
      field.validators.forEach(rule => {
        switch (rule.type) {
          case 'pattern':
            validators.push(Validators.pattern(rule.value));
            break;
          // Add more custom validators as needed
        }
      });
    }

    return validators;
  }

  getFieldGridClass(field: FormField): string {
    if (field.gridCol) {
      return `col-span-${field.gridCol}`;
    }
    return '';
  }

  isFieldInvalid(fieldKey: string): boolean {
    const field = this.dynamicForm.get(fieldKey);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldKey: string): string {
    const field = this.dynamicForm.get(fieldKey);
    if (!field || !field.errors) return '';

    const fieldConfig = this.config.fields.find(f => f.key === fieldKey);
    
    if (field.errors['required']) {
      return `${fieldConfig?.label || fieldKey} is required`;
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
    if (field.errors['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
    }
    if (field.errors['min']) {
      return `Minimum value is ${field.errors['min'].min}`;
    }
    if (field.errors['max']) {
      return `Maximum value is ${field.errors['max'].max}`;
    }
    if (field.errors['pattern']) {
      return 'Please enter a valid format';
    }

    return 'This field is invalid';
  }

  onAutoCompleteSearch(event: any, field: FormField) {
    // This would typically involve calling a service to search
    // For now, just filter the existing options
    if (field.options) {
      this.filteredSuggestions = field.options.filter(option =>
        option.label.toLowerCase().includes(event.query.toLowerCase())
      );
    }
  }

  onSubmit() {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit({isEditMode:this.config.isEditMode, formValue:this.dynamicForm.value});
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.dynamicForm.controls).forEach(key => {
        this.dynamicForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  // Public method to reset the form
  resetForm() {
    this.dynamicForm.reset();
    this.buildForm(); // Rebuild with initial values
  }

  // Public method to get current form value
  getFormValue() {
    return this.dynamicForm.value;
  }

  // Public method to validate form
  validateForm() {
    return this.dynamicForm.valid;
  }

  // Public method to set form value
  setFormValue(data: any) {
    this.dynamicForm.patchValue(data);
  }
}