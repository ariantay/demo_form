
// import { format, subYears, parseISO, addDays, getISODay, differenceInYears, } from 'date-fns'; 
//
// 230415 - safer tree shaking import 
// https://mui.com/material-ui/guides/minimizing-bundle-size/ 
// import { MenuItem } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
//
import { subYears, addDays, format } from 'date-fns'; 
//
// 220511 - define onInput masking here
import {
  phonemask,
  phoneunmask,
  ssnmask,
  ssnunmask,
  numbersonly,
// 221103 - add ein masking
  einmask,
  einunmask,
}
from '../utils/StringFormats';
//
// 220520 - memberids for memberfield translation
import { memberIds } from './AppConfig';
//
// 220529 - for updating fields that depend on context
import getEnvironmentVariables from './EnvironmentVariables';

const { isProduction } = getEnvironmentVariables();

const today = new Date();
const minBirthDate = subYears(today, 100);
const maxBirthDate = subYears(today, 18);
const minServiceDate = addDays(today, 1);
const maxServiceDate = addDays(today, 30);
//
// 220524 - length attribute is for yup.validation, maxLength attribute is for textfield.inputProps
// 
const fieldsConfig = {
// Addresses  
  isBillingAddressSame: {
    label: 'Use Service Address as Billing Address',
    // 220520 - initialValue defined if it needs to be something other than ''
    initialValue: false,
    contextOverrides: {      
      transferresidential: {label: 'Use New Service Address as Billing Address'},
      transfercommercial: {label: 'Use New Service Address as Billing Address'},
    },
  },
  serviceAddress1: {
    label: 'Street Address',
    required: true,
    review: true,
    maxLength: 100,
    autoComplete: 'address-line1',
  },
  serviceAddress2: {
    label: 'Apartment, Suite, Unit, etc.',
    review: true,
    maxLength: 100,
    autoComplete: 'address-line2',
    // 220501 - empty key for initial value check
  },
  serviceCity: {
    label: 'City',    
    required: true,        
    maxLength: 100,
    // autoComplete: 'address-level2',
    autoComplete: 'off',
    initialValue: 'Boston',
    review: true,
  },
  serviceState: { 
    label: 'State',    
    required: true,            
    length: 2,
    maxLength: 2,
    select: true,
    items: [
      {label: 'CA', value: 'CA'},
    ],
    review: true,   
    initialValue: 'CA',    
    // autoComplete: 'address-level1',
  },
  serviceZip: {
    label: 'ZIP Code',
    required: true,         
    // inputMode: 'numeric',    
    length: 5,
    maxLength: 5,  
    select: true,  
    items:[
      {label:'92010',value:'92010'},
      {label:'91795',value:'91795'},
      {label:'91701',value:'91701'},
      {label:'90210',value:'90210'},        
    ],
    review: true,
    // autoComplete: 'postal-code',
  },
  billingAddress1: {
    label: 'Billing Address',
    required: true,
    maxLength: 100,
    autoComplete: 'address-line1',
  },
  billingAddress2: {
    label: 'Apartment, Suite, Unit, etc.',
    maxLength: 100,
    autoComplete: 'address-line2',
  },
  billingCity: {
    label: 'Billing City',
    required: true,       
    maxLength: 100,
    autoComplete: 'address-level2',
  },
  billingState: {  
    label: 'Billing State',  
    required: true,   
    length: 2,
    maxLength: 2,
    // autoComplete: 'address-level1',
    autoComplete: 'off',
    // contextOverrides: {
    //   startresidential: {required: false},
    // }
  },
  billingZip: {
    label: 'Billing ZIP Code',
    required: true,
    inputMode: 'numeric',    
    length: 5,
    maxLength: 5,
    autoComplete: 'postal-code',
  },
  previousAddress1: {
    label: 'Previous Street Address',
    required: true,
    maxLength: 100,
    autoComplete: 'address-line1',
    contextOverrides: {      
      transferresidential: {label: 'Current Street Address'},
      transfercommercial: {label: 'Current Street Address'},
    },
  },
  previousAddress2: {
    label: 'Previous Apartment, Suite, Unit, etc.',
    maxLength: 100,
    autoComplete: 'address-line2',
    contextOverrides: {      
      transferresidential: {label: 'Current Apartment, Suite, Unit, etc.'},
      transfercommercial: {label: 'Current Apartment, Suite, Unit, etc.'},
    },
  },
  previousCity: {
    label: 'Previous City',
    required: true,
    maxLength: 100,
    autoComplete: 'address-level2',
    contextOverrides: {      
      transferresidential: {label: 'Current City'},
      transfercommercial: {label: 'Current City'},
    },
  },
  previousState: { 
    label: 'Previous State',   
    required: true,   
    length: 2,
    maxLength: 2,
    // autoComplete: 'address-level1',
    autoComplete: 'off',
    contextOverrides: {      
      transferresidential: {label: 'Current State'},
      transfercommercial: {label: 'Current State'},
    },
  },
  // 221103 - zip dropdown requested for transfer service requests current address
  previousZip: {
    label: 'Previous ZIP',
    required: true,
    inputMode: 'numeric',    
    length: 5,
    maxLength: 5,
    autoComplete: 'postal-code',
    contextOverrides: {      
      transferresidential: {
        label: 'Current ZIP',
        select: true,  
        items:[
          {label:'92010',value:'92010'},
          {label:'91795',value:'91795'},
          {label:'91701',value:'91701'},
          {label:'90210',value:'90210'},        
        ],
      },
      transfercommercial: {
        label: 'Current ZIP',
        select: true,  
        items:[
          {label:'92010',value:'92010'},
          {label:'91795',value:'91795'},
          {label:'91701',value:'91701'},
          {label:'90210',value:'90210'},        
        ],
      },
    },
  },  
// Contact  
  firstName: {
    label: 'First Name',
    required: true,
    review: true,
    maxLength: 100,
    autoComplete: 'given-name',
  },
  lastName: {
    label: 'Last Name',
    required: true,
    review: true,
    maxLength: 100,
    autoComplete: 'family-name',
  },
  email: {
    label: 'Email',
    required: true,
    type: 'email',
    review: true,
    maxLength: 100,
    autoComplete: 'email',
  },
  phoneNumber: {
    label: 'Phone Number',
    required: true,
    review: true,
    type: 'tel',    
    // inputMode: 'numeric',
    // pattern: /^\d*$/,
    length: 10,
    maxLength: 14,
    masked: 'phone',
    lockCursor: true,
    autoComplete: 'tel-national',
  },
  dateOfBirth: {
    label: 'Date of Birth',
    type: 'date',
    required: true,
    // min: subYears(parseISO(todayString),120),
    // 220511 - use minbirthdate and maxbirthdate to sync values with validationschemas 
    min: minBirthDate,
    max: maxBirthDate,
    // min: subYears(today,120),
    // max: subYears(today,18), 
    autoComplete: 'bday',    
  },
  ssn: {
    label: 'SSN',
    required: true,
    inputMode: 'numeric',    
    length: 9,
    masked: 'ssn',
    lockCursor: true,
    maxLength: 11,
    autoComplete: 'off',
  },
  driverLicenseNumber: {
    label: 'Driver License Number',
    required: true,
    maxLength: 20, 
    autoComplete: 'off',
    // contextOverrides: {
    //   stopresidential: {required: false},
    //   stopcommercial: {required: false},
    // },   
  },
  driverLicenseState: {
    label: 'Driver License State',
    required: true,    
    length: 2,
    maxLength: 2,
    autoComplete: 'off',
    // contextOverrides: {
    //   stopresidential: {required: false},
    //   stopcommercial: {required: false},
    // },
  },
  employerName: {
    label: "Current Employer's Name / Source of Income",
    maxLength: 100,
    autoComplete: 'off',
  },
  employerPhone: {
    label: 'Employer Phone Number',
    type: 'tel',
    masked: 'phone',
    length: 10,
    maxLength: 14,
    autoComplete: 'off',
  },
  employerCity: {
    label: 'Employer City',
    maxLength: 100,
    autoComplete: 'off',
  },
// BusinessContact  
  requestorRole: {
    label: 'Title/Position',
    required: true,
    select: true,
    items: [    
      {label: 'Owner', value: 'owner',},
      {label: 'Administrator', value: 'administrator',},
      {label: 'Assistant', value: 'assistant',},
      // {label: 'Owner', value: , disabled: },
    ],
  },
// 220520 - add requestor fields
// 220523 - test requestor fields optional
// 220527 - Fields shared between Apps, 
//    but with conflicting validation requirements 
//    will be resolved in ValidationSchema.customSchema
//
//    same with upload fields that is required in Test
//
  requestorFirstName: {
    label: 'Requestor First Name',
    required: true,
    review: true,
    maxLength: 100,
    autoComplete: 'given-name',
  },
  requestorLastName: {
    label: 'Requestor Last Name',
    required: true,
    review: true,
    maxLength: 100,
    autoComplete: 'family-name',
  },
  requestorEmail: {
    label: 'Requestor Email',
    required: true,
    type: 'email',
    review: true,
    maxLength: 100,    
    // inputMode: 'email',
    autoComplete: 'email',
  },
  requestorPhoneNumber: {
    label: 'Requestor Phone Number',
    required: true,
    review: true,
    type: 'tel',
    // inputMode: 'numeric',
    // pattern: /^\d*$/,
    length: 10,
    maxLength: 14,
    masked: 'phone',
    lockCursor: true,
    autoComplete: 'tel-national',
  },
//
// BusinessInfo  
  businessName: {
    label: 'Business Name',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
    review: true,
    contextOverrides: {      
      stopcommercial: {label: 'Account Name'},
    },
  },
  doingBusinessAs: {
    label: 'Doing Business As',
    // 221006 - make required
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  industry: {
    label: 'Industry',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  naicsCode: {
    label: 'NAICS Code',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  businessOnsitePhone:  {
    label: 'Business Onsite Phone',
    required: true,
    type: 'tel',
    review: true,
    // inputMode: 'numeric',    
    length: 10,
    masked: 'phone',
    maxLength: 14,
    autoComplete: 'off',
  },
  businessType: {
    label: 'Type of Business',
    required: true,
    select: true,
    items: [
      {label: 'Sole Propietor', value:'SolePropietor'},
      {label:'Corporation', value:'Corporation'},
      {label:'LLC', value:'LLC'},
      {label:'LP', value:'LP'},
    ],
  },
  taxID: {
    label: 'Tax Identification Number',
    required: true,
    inputMode: 'numeric',
    length: 9,  
    // 221103 - make it masked xx-xxxxxxx
    maxLength: 10,
    masked: 'ein',
    lockCursor: true,
    autoComplete: 'off',
  },
  corporateOfficerName: {
    label: 'Corporate Officer Name',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  corporateOfficerPhone: {
    label: 'Corporate Officer Phone',
    required: true,
    type: 'tel',
    // inputMode: 'numeric',    
    masked: 'phone',
    length: 10,
    maxLength: 14,
    autoComplete: 'off',
  },
  accountsPayableName: {
    label: 'Accounts Payable Name',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  accountsPayablePhone: {
    label: 'Accounts Payable Phone',
    required: true,
    type: 'tel',    
    length: 10,
    maxLength: 14,
    autoComplete: 'off',
    // inputMode: 'numeric',       
    masked: 'phone',
  },
// HouseHold  
  exists: {
    initialValue: true,
  },
  relation: {
    //html props
    label: 'Relation to Head of Household',    
    required: true,
    select: true,
    //mui props
    items: [
      {label:'Self', value:'SELF',}, // , disabled: index => index>0     
      {label:'Spouse / Domestic Partner', value:'SPOUSE', disabled: true,}, //, disabled: index => index===0
      {label:'Roommate', value:'ROOMMATE', disabled: true,}, //, disabled: index => index===0
    ],    
    //states
    initialValue: 'SELF',
  },
  // 220520 - as long as the field is in PageConfig.page.fields it will have an initialvalue of ''
  member1exists: {
    // initialValue: '',
  },
  member2exists: {
    // initialValue: '',
  },
  member3exists: {
    // initialValue: '',
  },
  memberrelation: {
    label: 'Relation to Head of Household',    
    required: true,
    select: true,
    items: [
      {label:'Self', value:'SELF', disabled: true,}, // , disabled: index => index>0     
      {label:'Spouse / Domestic Partner', value:'SPOUSE',}, //, disabled: index => index===0
      {label:'Roommate', value:'ROOMMATE',}, //, disabled: index => index===0
    ],
  },
  memberfirstName: {
    label: 'First Name',
    required: true,    
    maxLength: 100,
    autoComplete: 'off',    
  },
  memberlastName: {
    label: 'Last Name',
    required: true,
    maxLength: 100,
    autoComplete: 'off',
  },
  memberemail: {
    label: 'Email',
    required: true,
    type: 'email',
    maxLength: 100,
    autoComplete: 'off',
  },
  memberphoneNumber: {
    label: 'Phone Number',
    required: true,
    type: 'tel',
    masked: 'phone',
    length: 10,
    lockCursor: true,
    maxLength: 14,
    autoComplete: 'off',
  },
  memberdateOfBirth: {
    label: 'Date of Birth',
    required: true,
    type: 'date',    
    min: minBirthDate,
    max: maxBirthDate,
    autoComplete: 'off',    
  },
  memberssn: {
    label: 'SSN',
    required: true,
    inputMode: 'numeric',    
    lockCursor: true,
    masked: 'ssn',
    length: 9,
    maxLength: 11,
    autoComplete: 'off',
  },
  memberdriverLicenseNumber: {
    label: 'Driver License Number',
    required: true,
    maxLength: 20,
    autoComplete: 'off',
  },
  memberdriverLicenseState: {
    label: 'Driver License State',
    required: true,
    length: 2,
    autoComplete: 'off',
  },
  memberemployerName: {
    label: "Current Employer's Name",
    maxLength: 100,
    autoComplete: 'off',
  },
  memberemployerPhone: {    
    label: 'Employer Phone Number',
    type: 'tel',
    masked: 'phone',
    length: 10,
    maxLength: 14,
    autoComplete: 'off',
  },
  memberemployerCity: {
    label: 'Employer City',
    maxLength: 100,
    autoComplete: 'off',
  },
// MeterAccess
  serviceInstructions: {   
    label: 'Please provide additional instructions to access meter', 
    review: true,
    initialValue: 'N/A',
    required: true,
    'required.error': 'enter instructions or "N/A" if none is necessary',
    maxLength: 150,
    autoComplete: 'off',
  },
  serviceDate: {
    label: 'Date of Service Request',
    review: true,
    type: 'date',
    required: true,    
    min: addDays(today,1),
    'min.error': 'Pick a date within 30 days from tomorrow',
    max: addDays(today,30),    
    'max.error': 'Pick a date within 30 days from tomorrow',
    autoComplete: 'off',
  },
  previousServiceDate: {
    label: 'Date of Service Request',
    review: true,
    type: 'date',
    required: true,    
    min: addDays(today,1),
    'min.error': 'Pick a date within 30 days from tomorrow',
    max: addDays(today,30),    
    'max.error': 'Pick a date within 30 days from tomorrow',
    autoComplete: 'off',
  },
  // 220916- serviceType was requested to be removed by CoreAdmin
  serviceType: {       
    label: 'Type of Service Request',
    required: true,
    select: true,          
    items: [
      {label:'Electric', value:'ELECTRIC'},
      {label:'Water', value:'WATER'},
      {label:'Both', value:'BOTH'},
    ],
    review: true,
  },
  paperless: {
    label: 'Click to enroll in Paperless Billing',        
    // 220825 - let initialvalue set to empty string by default
    //    added jsonConverter for empty string to nullable boolean at models/ServiceRequest
    //
    // 220810 - set initial value to false, exception thrown by api during desearialization
    //    PageConfig.getInitialValuesByPage sets all fields without initialValue to false
    //    System.text.Json does not convert empty string to null/false by default
    //
    // initialValue: false,        
  },
  ssnUpload: {
    label: 'Upload a picture of your SSN',
// 220529 - should be defined here. if defined in schema, then the field label would not reflect the required property
// 220527 - this should be moved to validationSchema.customSchema   
// 220524 - not required in production
    required: !isProduction,
    // required: true,
    type: 'file',
    // contextOverrides: {
    //   startresidential: {required: false},
    //   stopresidential: {required: false},
    //   stopcommercial: {required: false},
    // },
  },
  idUpload: {
    label: 'Upload a picture of your ID',
    // 220524 - not required in production
    // 220529 - should be defined here. if defined in schema, then the field label would not reflect the required property
    // 220527 - this should be moved to validationSchema.customSchema   
    // required: true,
    required: !isProduction,    
    // required: true,
    type: 'file',
    // contextOverrides: {      
    //   stopresidential: {required: false},
    //   stopcommercial: {required: false},
    // },
  },
}
// 220512 - get name of file fields as array
const getFileInputs = () => {
  const fileInputs = Object.keys( fieldsConfig ).filter( field => fieldsConfig[field].type==='file' );
  return fileInputs ?? [];
}
// 220511 - formalize getInputProps
const getInputProps = config => {
  // 220609
  const inputProps = { 
    // 220609 - don't need to include {}, nulls/undefined are ignored
    ...config.inputMode && {inputMode: config.inputMode},
    ...config.maxLength && {maxLength: config.maxLength},
    // 220609 - also check min to not get min: undefined
    ...(config.type==='date' && config.min) && {min: format(config.min, 'yyyy-MM-dd')},
    ...(config.type==='date' && config.max) && {max: format(config.max, 'yyyy-MM-dd')},
  };

  return inputProps;
}
// 220511 - formalize getMaskedProps
const getMaskedProps = config => {
  const maskedProps = {};  
  if (config?.masked) {    
    // pass the masking function to formikfield
    maskedProps.inputMask = 
      config.masked==='ssn' ? ssnmask 
      : config.masked==='phone' ? phonemask 
    // 221103 - add einmask
      : config.masked==='ein' ? einmask
      : undefined;
    // unmask value oninput
    maskedProps.onInput = event => {
      event.target.value = 
        config.masked==='ssn' ? ssnunmask(event.target.value)
        : config.masked==='phone' ? phoneunmask(event.target.value)
    // 221103 - add einmask
        : config.masked==='ein' ? einunmask(event.target.value)
        : event.target.value;
    }
    // set cursor to end onselect
    maskedProps.onSelect = event => {
      const { value } = event.target
      event.target.selectionStart = value.length;
      event.target.selectionEnd = value.length;
    }
  }

  return maskedProps;
}

const getSelectProps = config => {
  const selectProps = config?.select && config?.items?.length>0 &&     
    {children: config.items.map(item => {
      // 220609 - this will throw if item.value and item.label is missing
      return <MenuItem key={item.value} value={item.value} disabled={item?.disabled} children={item.label} />
    })}

  return selectProps  
}
// 220529 - get fieldprops by config
const getRenderProps = config => {
  const configProps = {
  // textfield props 
    ...config.label && {label: config.label},
    ...config.type && {type: config.type},
    ...config.required && {required: true},   
    ...config.autoComplete && {autoComplete: config.autoComplete},
  // always minimize textfield.date label     
    ...config.type==='date' && {InputLabelProps: {shrink: true}},
  // for fields with numeric values only
    ...config.inputMode==='numeric' && {
        onInput: event => event.target.value=numbersonly(event.target.value)
      },
  // 220609 - mui textfield expects inputprops as single wrapped object 
  //      inputProps: maxLength, inputmode, or min/max date
    ...{ inputProps: getInputProps( config ) },
  // selectprops: select, menuitems
    ...config.select && {select: config.select, ...getSelectProps(config)},
  // maskedprops: get the input mask and unmask functions, also force cursor to end of value
  //    cursor jumps to end when mask/unmask functions are applied to the value
    ...getMaskedProps(config), 
  }  
  // console.log(configProps)
  return configProps;  
}
// 220609 ** updated to spread contextOverrides if appContext **
const getFieldConfig = ({fieldName='', apiPath=''}) => {
  const config = fieldsConfig[fieldName]
    || (memberIds.includes(fieldName.slice(0,7)) && fieldsConfig[`member${fieldName.slice(7)}`])   
    || {}
  // 220609 - fieldOverrides now in fieldsConfig
  // const fieldOverrides = (config.contextOverrides && config.contextOverrides[ apiPath ]) ?? {}
  const fieldOverrides = (config?.contextOverrides??{})[ apiPath ] ?? {}
  // console.log(config, fieldOverrides)
  return {...config, ...fieldOverrides}
}
//
const getFieldProps = ({fieldName='', apiPath=''}) => {
  const config = getFieldConfig({fieldName, apiPath})
  return getRenderProps(config);  
}
//
// 220929 - get field config, ignore case
const getFieldConfigIgnoreCase = ({ fieldName='' }) => {
  const key = fieldName ? Object.keys(fieldsConfig).find(key => key.toLowerCase()===fieldName) : ''
  return (key&&fieldsConfig[key]) || {}
}
//
export {
  fieldsConfig,
  getFileInputs,
  getFieldConfig,
  getFieldConfigIgnoreCase,
  getFieldProps,
  getRenderProps,
  today,
  minBirthDate,
  maxBirthDate,
  minServiceDate,
  maxServiceDate,
}
//
