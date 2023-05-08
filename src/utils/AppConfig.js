
import { getFileInputs } from './FieldsConfig';

// 220512 - getValues by key array
function getProps ( values = {}, keys = [] ) {
  // 
  const data = keys.reduce(( collection, item ) => {
    collection[ item ] = values[ item ];
    return collection;
  }, []);
  return data;
}  

const memberIds = ['', 'member1', 'member2', 'member3'];
const memberFields = [
  'exists','relation',
  'firstName','lastName','dateOfBirth','phoneNumber','email',
  'ssn','driverLicenseNumber','driverLicenseState',
  'employerName','employerCity','employerPhone',
];
const getHouseMemberArray = values => {
  const housemember = [];
  memberIds.forEach( memberId => {
    const memberexists = !!( memberId && values[ `${memberId}exists` ] );
    const member = {};
    if ( memberexists ) {
      memberFields.forEach( field => {
        member[ `m${field}` ] = values[ `${memberId}${field}` ]
      });
      housemember.push(member);
    }
  })
  // console.log(housemember)
  return housemember;  
}
// 220512 - rename ssn, driverlicensenumber with old suffix to match api
const renameKeys = ({ 
  ssn: ssn_old, 
  driverLicenseNumber: driverLicenseNumber_old, 
  mssn: mssn_old,
  mdriverLicenseNumber: mdriverLicenseNumber_old,
  ...rest 
}) => ({    
  ssn_old,
  driverLicenseNumber_old, 
  mssn_old,
  mdriverLicenseNumber_old,
  ...rest
});

const getFormData = ( values, apiPath ) => {
  const formData = new FormData();  
  // key is routepath in index.js: apipath,pages,keys  
  const config = Object.values( appConfigs ).find( config => config?.apiPath===apiPath );
  // get values
  let data = getProps( values, config?.keys );
  // get members
  // 220516 - get config from apiPath
  if ( apiPath==='startresidential' || apiPath==='transferresidential' ){
    const housemember = getHouseMemberArray( values );
    data.housemembers = housemember.map( item => renameKeys( item ) );    
  }
  // rename keys in data
  data = renameKeys( data );  
  // append values
  formData.append('values', JSON.stringify( data, null, 2 ));
  // append files
  getFileInputs().forEach( file => {
    // 220512 - name will be assigned a random guid by the api per security best practice.
    //  but having the fieldname as part of the filename will help with matching filename to fieldname
    if ( values[ file ] instanceof File ) {
      const filename = `${file}_${values[ file ]?.name}`;
      formData.append( 'files', values[ file ], filename );     
    }
  })
  //
  return formData;
}
// 220524 - getConfigbyPath
const getAppConfigByPath = path => {
  const config = appConfigs[ path ] ?? {};
  return config;
}
//
const appConfigs = {
  '/startresi': {
    apiPath: 'startresidential',
    pages: [ 
      'AddressInfo', 'ContactInfo', 'HouseHoldInfo', 'ReviewEntries', 
    ],
    keys: [
      'firstName', 'lastName', 'email', 'phoneNumber',   
      'dateOfBirth','ssn', 'driverLicenseNumber', 'driverLicenseState',
      'employerName', 'employerPhone', 'employerCity',      
      'serviceAddress1', 'serviceAddress2', 'serviceZip', 'serviceCity', 'serviceState',
      'billingAddress1', 'billingAddress2', 'billingZip', 'billingCity', 'billingState',
      'previousAddress1', 'previousAddress2', 'previousCity', 'previousState', 'previousZip',
      'serviceDate', 'serviceInstructions',
      'paperless',
    ],
    submitSuccess: `Submission Successful`,
    submitError: `There are errors with your submission.\n\n`,    
  },
  '/startcomm': {
    apiPath: 'startcommercial',
    pages: [ 
      'AddressInfo', 'ContactInfo', 'BusinessInfo', 'ReviewEntries',
    ],
    keys: [
      'requestorFirstName', 'requestorLastName', 'requestorEmail', 'requestorPhoneNumber',   
      'firstName', 'lastName', 'dateOfBirth', 'ssn', 'driverLicenseNumber', 'driverLicenseState',      
      'serviceAddress1', 'serviceAddress2', 'serviceZip', 'serviceCity', 'serviceState',
      'billingAddress1', 'billingAddress2', 'billingZip', 'billingCity', 'billingState',
      'previousAddress1', 'previousAddress2', 'previousCity', 'previousState', 'previousZip',
      'serviceDate', 'serviceInstructions',
      'requestorRole', 'businessType',
      'businessName', 'doingBusinessAs', 'industry', 'naicsCode', 'businessOnsitePhone',
      'taxID', 'corporateOfficerName', 'corporateOfficerPhone', 'accountsPayableName', 'accountsPayablePhone', 
      'paperless',
    ],
    submitSuccess: `Submission Successful`,
    submitError: `There are errors with your submission.\n\n`,    
  },
  '/stopresi': {
    apiPath: 'stopresidential',
    pages: [
      'AddressInfo', 'ContactInfo', 'ReviewEntries',
    ],
    keys: [
      // 220520 - add requestor fields
      'requestorFirstName', 'requestorLastName', 'requestorEmail', 'requestorPhoneNumber',
      'firstName', 'lastName', 'phoneNumber',         
      'serviceAddress1', 'serviceAddress2', 'serviceZip', 'serviceCity', 'serviceState',
      'billingAddress1', 'billingAddress2', 'billingZip', 'billingCity', 'billingState',              
      'serviceDate', 'serviceInstructions',
    ],
    submitSuccess: `Submission Successful`,
    submitError: `There are errors with your submission.\n\n`,    
  },
  '/stopcomm': {
    apiPath: 'stopcommercial',
    pages: [
      'AddressInfo', 'ContactInfo', 'ReviewEntries',
    ],
    keys: [
      'requestorRole', 'requestorFirstName', 'requestorLastName', 'requestorEmail', 'requestorPhoneNumber',
      'businessName', 'doingBusinessAs', 'businessOnsitePhone',
      'serviceAddress1', 'serviceAddress2', 'serviceZip', 'serviceCity', 'serviceState',
      'billingAddress1', 'billingAddress2', 'billingZip', 'billingCity', 'billingState',      
      'serviceDate', 'serviceInstructions',
    ],
    submitSuccess: `Submission Successful`,
    submitError: `There are errors with your submission.\n\n`,    
  },  
}
//
export {
  // appIndex,
  memberIds,
  memberFields,
  appConfigs,
  getProps,
  getHouseMemberArray,
  getFormData, 
  getAppConfigByPath,
}
//
export default appConfigs;
//