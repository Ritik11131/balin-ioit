import { FormConfig } from "../components/generic-form-generator/generic-form-generator.component";

export const PATH_REPLAY_FORM_FIELDS: FormConfig = {
  formTitle: 'Path Replay',
  columns: 1,
  isEditMode: true,
  saveButtonText:'Query',
  showCancelButton: false,
  fields: [
    {
      key: 'vehicle',
      label: 'Select Vehicle',
      type: 'select',
      placeholder: 'Select a vehicle',
      gridCol: 2,
      required: true,
      options: [], // dynamic from API
       dataSource: 'vehicles'
    },
    {
      key: 'date',
      label: 'Select Date',
      type: 'date',
      required: true,
      placeholder: 'Select date',
      gridCol: 2,
      selectionMode:'range'
    },
  ]
};