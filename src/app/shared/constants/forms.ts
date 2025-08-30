import { FormConfig } from "../components/generic-form-generator/generic-form-generator.component";
import { USER_TYPES } from "./user";

export const CREATE_USER_FORM_FIELDS: FormConfig = {
  formTitle: 'Create User',
  columns: 1,
  isEditMode: false,
  fields: [
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      gridCol: 1 // Spans 2 columns
    },
    {
      key: 'userName',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username',
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
      key: 'userType',
      label: 'User Type',
      type: 'select',
      placeholder: 'Select type of user',
      gridCol: 1,
      required: true,
      options: USER_TYPES
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Tell us your Address',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 1
    }
  ]
};


export const UPDATE_USER_FORM_FIELDS: FormConfig = {
  formTitle: 'Update User',
  columns: 1,
  isEditMode: true,
  fields: [
    {
      key: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'Enter your email address',
      gridCol: 1 // Spans 2 columns
    },
    {
      key: 'userName',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username',
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
      key: 'userType',
      label: 'User Type',
      type: 'select',
      placeholder: 'Select type of user',
      gridCol: 1,
      required: true,
      options: USER_TYPES
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'Tell us your Address',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 1
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
      gridCol: 1,
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
      gridCol: 1,
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
      gridCol: 1
    },
    {
      key: 'fkDeviceType',
      label: 'Device Type',
      type: 'select',
      placeholder: 'Select device type',
      gridCol: 1,
      required: true,
      options: [], // dynamic from API
       dataSource: 'deviceTypes'
    },
    {
      key: 'fkVehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      placeholder: 'Select vehicle type',
      gridCol: 1,
      options: [], // dynamic from API
      dataSource: 'vehicleTypes'
    },
    {
      key: 'simPhoneNumber',
      label: 'Primary Sim Number',
      type: 'text',
      required: true,
      placeholder: 'Enter primary sim number',
      gridCol: 1,
      validators: [
        { type: 'required', message: 'Primary sim number is required' }
      ]
    },
    {
      key: 'fkSimOperator',
      label: 'Primary Sim Operator',
      type: 'select',
      placeholder: 'Select operator',
      required: true,
      gridCol: 1,
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
      gridCol: 1
    },
    {
      key: 'fkSecSimOperator',
      label: 'Secondary Sim Operator',
      type: 'select',
      required: true,
      placeholder: 'Select operator',
      gridCol: 1,
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
      gridCol: 1,
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
      gridCol: 1,
      selectionMode:'single'
    },
    {
      key: 'planType',
      label: 'Plan',
      type: 'select',
      placeholder: 'Select plan',
      gridCol: 1,
      options: [],
      dataSource: 'plans'
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
      gridCol: 1,
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
      gridCol: 1,
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
      gridCol: 1
    },
    {
      key: 'fkDeviceType',
      label: 'Device Type',
      type: 'select',
      placeholder: 'Select device type',
      gridCol: 1,
      required: true,
      options: [],
      dataSource: 'deviceTypes' 
    },
    {
      key: 'fkVehicleType',
      label: 'Vehicle Type',
      type: 'select',
      required: true,
      placeholder: 'Select vehicle type',
      gridCol: 1,
      options: [], // dynamic from API
      dataSource: 'vehicleTypes'
    },
    {
      key: 'simPhoneNumber',
      label: 'Primary Sim Number',
      type: 'text',
      required: true,
      placeholder: 'Enter primary sim number',
      gridCol: 1,
      validators: [
        { type: 'required', message: 'Primary sim number is required' }
      ]
    },
    {
      key: 'fkSimOperator',
      label: 'Primary Sim Operator',
      type: 'select',
      required: true,
      placeholder: 'Select operator',
      gridCol: 1,
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
      gridCol: 1
    },
    {
      key: 'fkSecSimOperator',
      label: 'Secondary Sim Operator',
      type: 'select',
      placeholder: 'Select operator',
      gridCol: 1,
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
      gridCol: 1,
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
      gridCol: 1,
      selectionMode:'single'
    },
    {
      key: 'planType',
      label: 'Plan',
      type: 'select',
      placeholder: 'Select plan',
      gridCol: 1,
      options: [],
      dataSource: 'plans'
    }
  ]
};


export const CREATE_WHITELABEL_FORM_FIELDS: FormConfig = {
  formTitle: 'Create WhiteLabel',
  columns: 2,
  isEditMode: false,
  fields: [
      {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. Title',
      gridCol: 1
    },
    {
      key: 'personName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Person Name',
      gridCol: 1
    },
    {
      key: 'url',
      label: 'Domain Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. mycompany.com',
      gridCol: 1
    },
    {
      key: 'baseUrl',
      label: 'Base URL',
      type: 'text',
      required: true,
      placeholder: 'e.g. https://mycompany.com',
      gridCol: 1
    },
    {
     key: 'themeColor',
     label: 'Theme Color',
     type: 'colorpicker',
     required: true,
     gridCol: 2
   },
    {
     key: 'logo',
     label: 'Logo',
     type: 'fileupload',
     multiple: false,
     accept: 'image/*',
     maxFileSize: 5000000, // 5MB
     gridCol: 1
   },
   {
     key: 'favicon',
     label: 'Favicon',
     type: 'fileupload',
     multiple: false,
     accept: 'image/*',
     maxFileSize: 10000000, // 10MB
     gridCol: 1
   },
    {
      key: 'message',
      label: 'Custom Message',
      type: 'textarea',
      placeholder: 'Write a message or note (max 500 characters)',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 2
    },
  ]
};


export const UPDATE_WHITELABEL_FORM_FIELDS: FormConfig = {
  formTitle: 'Update WhiteLabel',
  columns: 2,
  isEditMode: true,
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'e.g. Title',
      gridCol: 1
    },
    {
      key: 'personName',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. Person Name',
      gridCol: 1
    },
    {
      key: 'url',
      label: 'Domain Name',
      type: 'text',
      required: true,
      placeholder: 'e.g. mycompany.com',
      gridCol: 1
    },
    {
      key: 'baseUrl',
      label: 'Base URL',
      type: 'text',
      required: true,
      placeholder: 'e.g. https://mycompany.com',
      gridCol: 1
    },
        {
     key: 'themeColor',
     label: 'Theme Color',
     type: 'colorpicker',
     required: true,
     gridCol: 2
   },
    {
     key: 'logo',
     label: 'Logo',
     type: 'fileupload',
     multiple: false,
     accept: 'image/*',
     maxFileSize: 5000000, // 5MB
     gridCol: 1
   },
   {
     key: 'favicon',
     label: 'Favicon',
     type: 'fileupload',
     multiple: false,
     accept: 'image/*',
     maxFileSize: 10000000, // 10MB
     gridCol: 1
   },
    {
      key: 'message',
      label: 'Custom Message',
      type: 'textarea',
      placeholder: 'Write a message or note (max 500 characters)',
      rows: 4,
      required: true,
      maxLength: 500,
      gridCol: 2
    },

  ]
};


export const CREATE_GEOFENCE_FORM_FIELDS: FormConfig = {
  formTitle: 'Create Geofence',
  columns: 1,
  isEditMode: false,
  fields: [
      {
      key: 'geometryName',
      label: 'Geometry Name',
      type: 'text',
      required: true,
      placeholder: 'Enter geometry name',
      gridCol: 1
    },
     {
     key: 'color',
     label: 'Geometry Color',
     type: 'colorpicker',
     required: true,
     gridCol: 1
   },
     {
      key: 'linkedDevices',
      label: 'Link Vehicles',
      type: 'multiselect',
      placeholder: 'Select vehicles to link',
      gridCol: 1,
      required: true,
      options: [],
      dataSource: 'vehicles'
    },
  ]
};

export const UPDATE_GEOFENCE_FORM_FIELDS: FormConfig = {
  formTitle: 'Create Geofence',
  columns: 1,
  isEditMode: true,
  fields: [
      {
      key: 'geometryName',
      label: 'Geometry Name',
      type: 'text',
      required: true,
      placeholder: 'Enter geometry name',
      gridCol: 1
    },
     {
     key: 'color',
     label: 'Geometry Color',
     type: 'colorpicker',
     required: true,
     gridCol: 1
   },
    {
      key: 'linkedDevices',
      label: 'Link Vehicles',
      type: 'multiselect',
      placeholder: 'Select vehicles to link',
      gridCol: 1,
      required: true,
      options: [],
      dataSource: 'vehicles'
    },
  ]
}


