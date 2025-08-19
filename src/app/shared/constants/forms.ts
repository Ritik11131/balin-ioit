import { FormConfig } from "../components/generic-form-generator/generic-form-generator.component";

export const CREATE_USER_FORM_FIELDS: FormConfig = {
  formTitle: 'Create User',
  columns: 1,
  isEditMode: false,
  fields: [
    {
      key: 'userName',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username',
      gridCol: 1
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      gridCol: 2 // Spans 2 columns
    },
    {
      key: 'mobileNo',
      label: 'Mobile No.',
      type: 'text',
      required: true,
      // inputId:'withoutgrouping',
      // useGrouping: false,
      // min: 10,
      // max: 10,
      gridCol: 1
    },
    {
      key: 'loginId',
      label: 'Login ID',
      type: 'text',
      required: true,
      placeholder: 'Enter loginID',
      gridCol: 1
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      gridCol: 1
    },
    {
      key: 'userType',
      label: 'User Type',
      type: 'select',
      placeholder: 'Select type of user',
      gridCol: 2,
      required: true,
      options: [
        { label: 'Technology', value: 1 },
        { label: 'Sports', value: 2 },
      ]
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Tell us your Address',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 2
    }
  ]
};


export const UPDATE_USER_FORM_FIELDS: FormConfig = {
  formTitle: 'Update User',
  columns: 1,
  isEditMode: true,
  fields: [
    {
      key: 'userName',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username',
      gridCol: 1
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      gridCol: 2 // Spans 2 columns
    },
    {
      key: 'mobileNo',
      label: 'Mobile No.',
      type: 'text',
      required: true,
      // inputId:'withoutgrouping',
      // useGrouping: false,
      // min: 10,
      // max: 10,
      gridCol: 1
    },
    {
      key: 'loginId',
      label: 'Login ID',
      type: 'text',
      required: true,
      placeholder: 'Enter loginID',
      gridCol: 1
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: 'Enter password',
      gridCol: 1
    },
    {
      key: 'userType',
      label: 'User Type',
      type: 'select',
      placeholder: 'Select type of user',
      gridCol: 2,
      required: true,
      options: [
        { label: 'Admin', value: 1 },
        { label: 'Customer', value: 2 },
      ]
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Tell us your Address',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 2
    }
  ]
};


export const CREATE_DEVICE_FORM_FIELDS: FormConfig = {
  formTitle: 'Create Device',
  columns: 2,
  isEditMode: false,
  fields: [
    {
      key: 'deviceId',
      label: 'Unique Id',
      type: 'text',
      required: true,
      placeholder: 'Enter unique ID',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Unique Id is required' }
      ]
    },
    {
      key: 'deviceImei',
      label: 'Device IMEI',
      type: 'text',
      required: true,
      placeholder: 'Enter IMEI (15 digits)',
      gridCol: 2,
      minLength: 15,
      validators: [
        { type: 'minLength', value: 15, message: 'IMEI must be at least 15 digits' }
      ]
    },
    {
      key: 'deviceUid',
      label: 'Serial Number',
      type: 'text',
      required: true,
      placeholder: 'Enter serial number',
      gridCol: 3
    },
    {
      key: 'fkDeviceType',
      label: 'Device Type',
      type: 'select',
      placeholder: 'Select device type',
      gridCol: 2,
      required: true,
      options: [] // dynamic from API
    },
    {
      key: 'fkVehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      placeholder: 'Select vehicle type',
      gridCol: 2,
      options: [] // dynamic from API
    },
    {
      key: 'simPhoneNumber',
      label: 'Primary Sim Number',
      type: 'text',
      required: true,
      placeholder: 'Enter primary sim number',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Primary sim number is required' }
      ]
    },
    {
      key: 'fkSimOperator',
      label: 'Primary Sim Operator',
      type: 'select',
      placeholder: 'Select operator',
      gridCol: 2,
      options: [
        {
          "label": "Airtel",
          "value": 1
        },
        {
          "label": "Vodafone",
          "value": 2
        },
        {
          "label": "Jio",
          "value": 3
        },
        {
          "label": "BSNL",
          "value": 5
        },
        {
          "label": "Gipl-88",
          "value": 6
        }
      ]
    },
    {
      key: 'simSecPhoneNumber',
      label: 'Secondary Sim Number',
      type: 'text',
      placeholder: 'Enter secondary sim number',
      gridCol: 2
    },
    {
      key: 'fkSecSimOperator',
      label: 'Secondary Sim Operator',
      type: 'select',
      required: true,
      placeholder: 'Select operator',
      gridCol: 2,
      options: [
        {
          "label": "Airtel",
          "value": 1
        },
        {
          "label": "Vodafone",
          "value": 2
        },
        {
          "label": "Jio",
          "value": 3
        },
        {
          "label": "BSNL",
          "value": 5
        },
        {
          "label": "Gipl-88",
          "value": 6
        }
      ]
    },
    {
      key: 'vehicleNo',
      label: 'Vehicle Number',
      type: 'text',
      required: true,
      placeholder: 'Enter vehicle number',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Vehicle number is required' }
      ]
    },
    {
      key: 'installationOn',
      label: 'Installation Date',
      type: 'date',
      required: true,
      placeholder: 'Select installation date',
      gridCol: 2
    },
    {
      key: 'planType',
      label: 'Plan',
      type: 'select',
      placeholder: 'Select plan',
      gridCol: 2,
      options: []
    }
  ]
};


export const UPDATE_DEVICE_FORM_FIELDS: FormConfig = {
  formTitle: 'Update Device',
  columns: 2,
  isEditMode: true,
  fields: [
    {
      key: 'deviceId',
      label: 'Unique Id',
      type: 'text',
      required: true,
      placeholder: 'Enter unique ID',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Unique Id is required' }
      ]
    },
    {
      key: 'deviceImei',
      label: 'Device IMEI',
      type: 'text',
      required: true,
      placeholder: 'Enter IMEI (15 digits)',
      gridCol: 2,
      minLength: 15,
      validators: [
        { type: 'minLength', value: 15, message: 'IMEI must be at least 15 digits' }
      ]
    },
    {
      key: 'deviceUid',
      label: 'Serial Number',
      type: 'text',
      required: true,
      placeholder: 'Enter serial number',
      gridCol: 3
    },
    {
      key: 'fkDeviceType',
      label: 'Device Type',
      type: 'select',
      placeholder: 'Select device type',
      gridCol: 2,
      required: true,
      options: [] // dynamic from API
    },
    {
      key: 'fkVehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      placeholder: 'Select vehicle type',
      gridCol: 2,
      options: [] // dynamic from API
    },
    {
      key: 'simPhoneNumber',
      label: 'Primary Sim Number',
      type: 'text',
      required: true,
      placeholder: 'Enter primary sim number',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Primary sim number is required' }
      ]
    },
    {
      key: 'fkSimOperator',
      label: 'Primary Sim Operator',
      type: 'select',
      placeholder: 'Select operator',
      gridCol: 2,
      options: [
        {
          "label": "Airtel",
          "value": 1
        },
        {
          "label": "Vodafone",
          "value": 2
        },
        {
          "label": "Jio",
          "value": 3
        },
        {
          "label": "BSNL",
          "value": 5
        },
        {
          "label": "Gipl-88",
          "value": 6
        }
      ]
    },
    {
      key: 'simSecPhoneNumber',
      label: 'Secondary Sim Number',
      type: 'text',
      placeholder: 'Enter secondary sim number',
      gridCol: 2
    },
    {
      key: 'fkSecSimOperator',
      label: 'Secondary Sim Operator',
      type: 'select',
      required: true,
      placeholder: 'Select operator',
      gridCol: 2,
      options: [
        {
          "label": "Airtel",
          "value": 1
        },
        {
          "label": "Vodafone",
          "value": 2
        },
        {
          "label": "Jio",
          "value": 3
        },
        {
          "label": "BSNL",
          "value": 5
        },
        {
          "label": "Gipl-88",
          "value": 6
        }
      ]
    },
    {
      key: 'vehicleNo',
      label: 'Vehicle Number',
      type: 'text',
      required: true,
      placeholder: 'Enter vehicle number',
      gridCol: 2,
      validators: [
        { type: 'required', message: 'Vehicle number is required' }
      ]
    },
    {
      key: 'installationOn',
      label: 'Installation Date',
      type: 'date',
      required: true,
      placeholder: 'Select installation date',
      gridCol: 2
    },
    {
      key: 'planType',
      label: 'Plan',
      type: 'select',
      placeholder: 'Select plan',
      gridCol: 2,
      options: []
    }
  ]
};
