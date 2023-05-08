
// 220522 - can just use the fieldname
import { getFieldConfig } from './FieldsConfig'; //getRenderProps //fieldsConfig
//
const pageConfig = {  
  AddressInfo: {
    pageLabel: 'Service Address', 
    pageHeader: 'Please enter address.',
    pageFields: [ 
      'isBillingAddressSame', 
      'serviceAddress1', 
      'serviceAddress2', 
      'serviceCity', 
      'serviceState', 
      'serviceZip', 
      'billingAddress1',
      'billingAddress2', 
      'billingCity', 
      'billingState', 
      'billingZip', 
    ],
    contextOverrides: {
      stopresidential: {
        pageHeader: 'Provide the service address.',
        pageFields: ['serviceAddress1', 'serviceAddress2', 'serviceCity', 'serviceState', 'serviceZip', 'billingAddress1', 'billingAddress2', 'billingCity', 'billingState', 'billingZip'],
      },
      stopcommercial: {
        pageHeader: 'Provide the service address.',
        pageFields: ['serviceAddress1', 'serviceAddress2', 'serviceCity', 'serviceState', 'serviceZip', 'billingAddress1', 'billingAddress2', 'billingCity', 'billingState', 'billingZip'],
      },
      transferresidential: {
        pageHeader: 'Provide your current address.',
        // 221006 - isBillingAddressSame needs to be included for the checkbox to work on first click
        pageFields: ['isBillingAddressSame', 'previousAddress1', 'previousAddress2', 'previousCity', 'previousState', 'previousZip','serviceAddress1', 'serviceAddress2', 'serviceCity', 'serviceState', 'serviceZip', 'billingAddress1', 'billingAddress2', 'billingCity', 'billingState', 'billingZip'],
      },
      transfercommercial: {
        pageHeader: 'Provide your current address.',
        // 221006 - isBillingAddressSame needs to be included for the checkbox to work on first click
        pageFields: ['isBillingAddressSame', 'previousAddress1', 'previousAddress2', 'previousCity', 'previousState', 'previousZip','serviceAddress1', 'serviceAddress2', 'serviceCity', 'serviceState', 'serviceZip', 'billingAddress1', 'billingAddress2', 'billingCity', 'billingState', 'billingZip'],
      },
    },
  },    
  ContactInfo: {
    pageLabel: 'Contact Details', 
    pageHeader: 'Provide information for the owner.',
    pageFields: [
      'firstName', 
      'lastName',       
      'email', 
      'phoneNumber',       
      'dateOfBirth',
      'ssn',
      'ssnUpload', 
      'driverLicenseState',
      'driverLicenseNumber',
      'idUpload',
      'previousAddress1',
      'previousAddress2',
      'previousCity',
      'previousState',
      'previousZip',
      'employerName',
      'employerPhone',
      'employerCity',
      'paperless',
    ],
    contextOverrides: {
      startcommercial: {
        pageHeader: 'Please provide your contact details.',
        pageFields: ['requestorRole', 'requestorFirstName', 'requestorLastName', 'requestorPhoneNumber', 'requestorEmail', 'previousAddress1', 'previousAddress2', 'previousCity', 'previousState', 'previousZip', 'paperless'],
      },
      stopresidential: {
        pageHeader: 'Please provide your contact details.',
        pageFields: ['requestorFirstName', 'requestorLastName', 'requestorPhoneNumber', 'requestorEmail', 'firstName', 'lastName', 'phoneNumber'],
      },
      stopcommercial: {
        pageHeader: 'Please provide your contact details.',
        // 221007 - doingbusinessas added to stopcommercial
        pageFields: ['requestorRole', 'requestorFirstName', 'requestorLastName', 'requestorPhoneNumber', 'requestorEmail', 'businessName', 'doingBusinessAs', 'businessOnsitePhone'],
      },
      transferresidential: {
        pageHeader: 'Please provide your contact details.',
        pageFields: ['firstName', 'lastName', 'email', 'phoneNumber', 'dateOfBirth', 'ssn', 'ssnUpload', 'driverLicenseState', 'driverLicenseNumber', 'idUpload', 'paperless'],
      },
      transfercommercial: {
        pageHeader: 'Please provide your contact details.',
        // 220929 - businessName and businessOnsitePhone is in contactinfo only for stop commercial, stop commercial has no businessinfo page
        pageFields: ['requestorRole', 'requestorFirstName', 'requestorLastName', 'requestorPhoneNumber', 'requestorEmail', 'paperless'], //'businessName', 'businessOnsitePhone',
      },
    },
  },
// 220228 - business info
  BusinessInfo: {
    pageLabel: 'Business Info', 
    pageHeader: "Complete the following.",
    pageFields: [
      'businessName',
      'doingBusinessAs',
      'industry',
      'naicsCode',
      'businessOnsitePhone',
      'businessType',
      // businessType: SolePropietor
      'firstName',
      'lastName',
      'dateOfBirth',
      'ssn',
      'ssnUpload',
      'driverLicenseState',
      'driverLicenseNumber',
      'idUpload',
      // businessType: other
      'taxID',
      'corporateOfficerName',
      'corporateOfficerPhone',
      'accountsPayableName',
      'accountsPayablePhone',
    ],
  },  
  HouseHoldInfo: {
    pageLabel: 'Household', 
    pageHeader: 'If you wish to add additional applicants select "Add Member".',
    pageFields: [
      'exists',
      'relation',
      //    
      'member1exists',
      'member1relation',
      'member1firstName',
      'member1lastName',
      'member1email',
      'member1phoneNumber',
      'member1dateOfBirth',
      'member1ssn',
      'member1driverLicenseState',
      'member1driverLicenseNumber',      
      'member1employerName',
      'member1employerPhone',
      'member1employerCity',
      //      
      'member2exists',
      'member2relation',
      'member2firstName',
      'member2lastName',
      'member2email',
      'member2phoneNumber',
      'member2dateOfBirth',
      'member2ssn',
      'member2driverLicenseState',
      'member2driverLicenseNumber',      
      'member2employerName',
      'member2employerPhone',
      'member2employerCity',
      //            
      'member3exists',
      'member3relation',
      'member3firstName',
      'member3lastName',
      'member3email',
      'member3phoneNumber',
      'member3dateOfBirth',
      'member3ssn',
      'member3driverLicenseState',
      'member3driverLicenseNumber',      
      'member3employerName',
      'member3employerPhone',
      'member3employerCity',
    ],
  },  
  MeterAccess: {
    pageLabel: 'Meter Access',     
    pageHeader: 'We require access to your meter',
    pageFields: [
      'serviceInstructions', 
      'serviceDate', 
    ],
    contextOverrides: {
      transferresidential: {
        pageFields: ['serviceInstructions', 'serviceDate', 'previousServiceDate'], //'serviceType'
      },
      transfercommercial: {
        pageFields: ['serviceInstructions', 'serviceDate', 'previousServiceDate'], //'serviceType'
      },
    },
  },  
  ReviewEntries: {
    pageLabel: 'Review',       
    pageHeader: 'Please review',    
    pageFields: [],
  },
  FileUpload: {
    pageLabel: 'File Upload',     
    pageHeader: 'TEST PAGE',
    pageFields: [],
  },
}

const getPageConfig = ({pageName, apiPath}) => {
  const config = pageConfig[pageName] ?? {};
  const configOverrides = (config?.contextOverrides??{})[apiPath] ?? {};
  // console.log(apiPath, {...config, ...configOverrides})
  return {...config, ...configOverrides};
}
// 220520 - initialValue defaults to ''
const getInitialValuesByPage = (pageName, apiPath='') => {  
  const config = getPageConfig({pageName, apiPath});
  const pageFields = config?.pageFields ?? [];  
  const initialValues = pageFields.reduce((object, element) => {
    object[element] = getFieldConfig({fieldName: element, apiPath})?.initialValue??'';
    return object;
  }, {});
  
  return initialValues;
}
//
export {
  // 220524 - export the full config object also
  pageConfig, 
  getPageConfig,  
  getInitialValuesByPage,
}
//
export default pageConfig;
//
