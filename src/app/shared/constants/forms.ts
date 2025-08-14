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