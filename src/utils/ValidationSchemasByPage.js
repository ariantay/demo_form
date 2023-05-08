
import { string, date, setLocale, } from "yup";
//
import { differenceInYears } from 'date-fns'; //, differenceInCalendarDays, differenceInYears, differenceInMonths, getDay, isSameDay, format, subYears, parseISO, addDays, getISODay,
import { today, maxBirthDate, } from './FieldsConfig' // , minBirthDate, fieldsConfig, getFieldConfig,
import { getPageConfig } from './PageConfig'
import { getFieldConfig } from './FieldsConfig'
setLocale({
  mixed: {
    default: `invalid value entered`,
    required: `required`,
    oneOf: `invalid value selected`,
  },
  date: {
    min: `Enter a valid birthDate`,
    max: `Age must be over ${differenceInYears(today, maxBirthDate)}`,
  },
});
//
const getSchema = ({fieldName, apiPath}) => {
  const config = getFieldConfig({fieldName, apiPath});
  let schema = config.type==='date' ? date() : string();
  schema = config.required ? schema.required(config['required.error']) : schema;
  schema = config.required && config.length ? schema.length(config.length, config.length.error) : schema;
  schema = config.min ? schema.min(config.min, config['min.error']) : schema;
  schema = config.max ? schema.max(config.max, config['max.error']) : schema;  
  schema = config.type==='email' ? schema.email() : schema;
  schema = config.inputMode==='numeric' ? schema.matches(/^\d*$/, 'enter numeric values only') : schema;
  schema = config.type==='tel' ? schema.matches(/^\d*$/, 'enter numeric values only') : schema;
  schema = config.required && config.items ? schema.oneOf(config.items.map(e => e.value).filter(e => !e.disabled)) : schema;
  return schema;
}
//
const getValue = controlValue => inputValue => {    
  return !!inputValue===controlValue || inputValue===controlValue
}
// 220524 - nvm its necessary, like for businessType, or is it
const whenValueIs = ( controlName, controlValue, fieldName, apiPath ) => {
  return string().when(controlName, {is: getValue(controlValue), then: schema => getSchema({fieldName, apiPath}),}); // otherwise: schema => string().length(0)
}
const whenValueOtherwise = ( controlName, controlValue, fieldName, apiPath ) => {
  return string().when(controlName, {is: getValue(controlValue), otherwise: schema => getSchema({fieldName, apiPath}),}); // then: schema => string().length(0)
}
const customSchemasByPage = {
  'BusinessInfo': {    
    // businessType: SolePropietor
    firstName: apiPath => whenValueIs('businessType', 'SolePropietor', 'firstName', apiPath),
    lastName: apiPath => whenValueIs('businessType', 'SolePropietor', 'lastName', apiPath),
    dateOfBirth: apiPath => whenValueIs('businessType', 'SolePropietor', 'dateOfBirth', apiPath),
    ssn: apiPath => whenValueIs('businessType', 'SolePropietor', 'ssn', apiPath),    
    ssnUpload: apiPath => whenValueIs('businessType', 'SolePropietor', 'ssnUpload', apiPath),
    driverLicenseState: apiPath => whenValueIs('businessType', 'SolePropietor', 'driverLicenseState', apiPath),
    driverLicenseNumber: apiPath => whenValueIs('businessType', 'SolePropietor', 'driverLicenseNumber', apiPath),
    idUpload: apiPath => whenValueIs('businessType', 'SolePropietor', 'idUpload', apiPath),
    taxID: apiPath => whenValueOtherwise('businessType', 'SolePropietor', 'taxID', apiPath),
    corporateOfficerName: apiPath => whenValueOtherwise('businessType', 'SolePropietor', 'corporateOfficerName', apiPath),
    corporateOfficerPhone: apiPath => whenValueOtherwise('businessType', 'SolePropietor', 'corporateOfficerPhone', apiPath),
    accountsPayableName: apiPath => whenValueOtherwise('businessType', 'SolePropietor', 'accountsPayableName', apiPath),
    accountsPayablePhone: apiPath => whenValueOtherwise('businessType', 'SolePropietor', 'accountsPayablePhone', apiPath),
  }, 
  'HouseHoldInfo': {
    // 220520 - ** now returns base member prefixed fields from fieldsconfig **
    // 220501 - ** note that the schemas are constructed from the base fields (no prefix) **
    //
    member1relation: apiPath => whenValueIs('member1exists', true, 'memberrelation', apiPath),
    member1firstName: apiPath => whenValueIs('member1exists', true, 'memberfirstName', apiPath),      
    member1lastName: apiPath => whenValueIs('member1exists', true, 'memberlastName', apiPath),      
    member1email: apiPath => whenValueIs('member1exists', true, 'memberemail', apiPath),      
    member1phoneNumber: apiPath => whenValueIs('member1exists', true, 'memberphoneNumber', apiPath),            
    member1dateOfBirth: apiPath => whenValueIs('member1exists', true, 'memberdateOfBirth', apiPath),      
    member1ssn: apiPath => whenValueIs('member1exists', true, 'memberssn', apiPath),      
    member1driverLicenseState: apiPath => whenValueIs('member1exists', true, 'memberdriverLicenseState', apiPath),      
    member1driverLicenseNumber: apiPath => whenValueIs('member1exists', true, 'memberdriverLicenseNumber', apiPath),      
    //
    member2relation: apiPath => whenValueIs('member2exists', true, 'memberrelation', apiPath),
    member2firstName: apiPath => whenValueIs('member2exists', true, 'memberfirstName', apiPath),      
    member2lastName: apiPath => whenValueIs('member2exists', true, 'memberlastName', apiPath),      
    member2email: apiPath => whenValueIs('member2exists', true, 'memberemail', apiPath),      
    member2phoneNumber: apiPath => whenValueIs('member2exists', true, 'memberphoneNumber', apiPath),            
    member2dateOfBirth: apiPath => whenValueIs('member2exists', true, 'memberdateOfBirth', apiPath),      
    member2ssn: apiPath => whenValueIs('member2exists', true, 'memberssn', apiPath),      
    member2driverLicenseState: apiPath => whenValueIs('member2exists', true, 'memberdriverLicenseState', apiPath),      
    member2driverLicenseNumber: apiPath => whenValueIs('member2exists', true, 'memberdriverLicenseNumber', apiPath),     
    //
    member3relation: apiPath => whenValueIs('member3exists', true, 'memberrelation', apiPath),
    member3firstName: apiPath => whenValueIs('member3exists', true, 'memberfirstName', apiPath),      
    member3lastName: apiPath => whenValueIs('member3exists', true, 'memberlastName', apiPath),      
    member3email: apiPath => whenValueIs('member3exists', true, 'memberemail', apiPath),      
    member3phoneNumber: apiPath => whenValueIs('member3exists', true, 'memberphoneNumber', apiPath),            
    member3dateOfBirth: apiPath => whenValueIs('member3exists', true, 'memberdateOfBirth', apiPath),      
    member3ssn: apiPath => whenValueIs('member3exists', true, 'memberssn', apiPath),      
    member3driverLicenseState: apiPath => whenValueIs('member3exists', true, 'memberdriverLicenseState', apiPath),      
    member3driverLicenseNumber: apiPath => whenValueIs('member3exists', true, 'memberdriverLicenseNumber', apiPath),     
    //      
  },
}
//

  //
  const getValidationSchemasByPage = (page='', apiPath='') => {
    
    const pageConfig = getPageConfig({pageName: page, apiPath});
    
    const fields = pageConfig.pageFields ?? [];        
    const customSchemaByPage = customSchemasByPage[page] ?? {};    
    const validationSchema = fields.reduce((schema, fieldName) => {    
      schema[fieldName] = (fieldName in customSchemaByPage) ?
        customSchemaByPage[fieldName](apiPath) 
      : getSchema({fieldName, apiPath});
      
      return schema;
    }, {});
    //
    return validationSchema;
    //
  }
  //
  // 220428 - use for when validations have co-dependence 
  // 211014 - added function to export yup object.shape dependency array
  const getYupShapeDependency = (page) => (
    []
  );
 //
 export {
   customSchemasByPage,
   getValidationSchemasByPage,
   getYupShapeDependency,
   getSchema,
 }
//
export default customSchemasByPage
//
