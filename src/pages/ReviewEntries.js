//
import { useFormikContext } from 'formik';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'
import { getFieldConfig } from '../utils/FieldsConfig'
import { reviewEntriesDateFormat } from '../utils/DateFormats';
import { 
  formatPhone,
  formatStreetAddress,
  formatFileSize,
} from '../utils/StringFormats';
import getEnvironmentVariables from '../utils/EnvironmentVariables';
import { usePage } from '../utils/PageContext'
import { isFunction } from '../utils/HelperFunctions'

function SectionLabel ({ label, sx={} }) {
  return (
    <Typography       
      mt={4}
      mb={1.0} 
      // mb={-.2}
      variant='h5' 
      fontWeight={400}
      // gutterBottom 
      color='primary'
      children={label}
      {...sx}
    />
  )
}
//
function SectionFields ({ children }) {
  return (
    <Stack ml={1} spacing={1.0}>
      {children}
    </Stack>
  )
}
//
function FieldInfo ({ apiPath, fieldName, fieldValue, fieldLabel, fieldFormat }) {
  const config = getFieldConfig({apiPath, fieldName})
  return (
    <Stack spacing={0.1}>   
      <Typography 
        variant='subtitle2' 
        color='grey.700'   
        fontSize={{lg: '.80rem', sm: '.75rem', xs: '.70rem'}}      
        sx={{fontWeight: 300, lineHeight: .9, letterSpacing: '0.0001em',}} 
        children={`${fieldLabel||config?.label||fieldName}`.toLowerCase()}
      />
      <Typography 
        // mt={-1.6}
        variant='h6' 
        color='text.primary'   
        fontSize='1.24rem'     
        // 220929 - if not a function, false will take precedence over nulls and the null coalesce wont happen
        // children={(isFunction(fieldFormat) ? fieldFormat(fieldValue) : fieldValue) ?? 'N/A'}
        children={((isFunction(fieldFormat)&&fieldFormat(fieldValue)) || fieldValue) ?? 'N/A'}
        //
      />   
    </Stack>
  )   
}
//
const printSection = ({ apiPath, values, section: {label='', items=[]} = {} }) => {  
  return label && items.length>0 && (
    <>
      <SectionLabel label={label} />
      <SectionFields>
        <>
          {items.map(e => (
            <FieldInfo 
              key={`${e.name}${e.label}`} 
              apiPath={apiPath} 
              fieldName={e.name}
              // 220929 - add get function for custom extracts from values (ie serviceaddress, fullname) 
              // fieldValue={e.value??values[e.name]}
              fieldValue={(isFunction(e.get)&&e.get(values)) || (e.value??values[e.name])}
              fieldLabel={e.label} 
              fieldFormat={e.format} 
            />)
          )}
        </>
      </SectionFields>
    </>
  )
}
//
const getRequestorInformationItems = ({ apiPath }) => {
  const requestorInformationItems = [{name: 'requestorFirstName'}, {name: 'requestorLastName'}, {name: 'requestorPhoneNumber', format: formatPhone}, {name: 'requestorEmail'}]
  return apiPath.endsWith('commercial') ? 
      [{name: 'requestorRole'}, ...requestorInformationItems] 
    : apiPath==='stopresidential' ?
      requestorInformationItems
    : []
}
//
const getAccountInformationItems = ({ apiPath }) => {
  const paperless = {name: 'paperless', format: val => val ? 'E-Bill' : 'Standard Mail'}
  const accountInfoItems = 
    apiPath.endsWith('residential') ? 
      // [{name: 'firstName'}, {name: 'lastName'}, {name: 'phoneNumber', format: formatPhone}, paperless]
      [{name: 'firstName'}, {name: 'lastName'}, {name: 'phoneNumber', format: formatPhone}]
    : apiPath.endsWith('commercial') ?
      // [{name: 'businessName'}, {name: 'businessOnsitePhone', format: formatPhone}, paperless]
      // 221007 - add doingBusinessAs as it is now required for all commercial applications
      [{name: 'businessName'}, {name: 'doingBusinessAs'}, {name: 'businessOnsitePhone', format: formatPhone}]
    : []
  // return apiPath.startsWith('stop') ? accountInfoItems.slice(0,-1) : accountInfoItems
  return apiPath.startsWith('stop') ? accountInfoItems : [...accountInfoItems, paperless]
}
//
const getFileInformationItems = ({ apiPath, values }) => {
  const getFileName = value => value?.name
  const getFileSize = value => formatFileSize(value?.size) 
  const fileInformationItems = [
    {name: 'ssnUpload', label: 'SSN File Name', format: getFileName}, 
    {name: 'ssnUpload', label: 'SSN File Size', format: getFileSize},
    {name: 'idUpload', label: 'ID File Name', format: getFileName}, 
    {name: 'idUpload', label: 'ID File Size', format: getFileSize},
  ]
  // const { businessType } = values;
  return (
    getEnvironmentVariables().isProduction ?
      []
    : apiPath.startsWith('stop') ? 
      [] 
    // : (apiPath.endsWith('residential') || (businessType&&businessType==='SolePropietor')) ?
    : ( apiPath.endsWith('residential') || values['businessType']==='SolePropietor' ) ?
      fileInformationItems
    : []
  )
}
//
const getServiceInformationItems = ({ apiPath, values }) => {
  const requestType = 
    apiPath.startsWith('start') ? 
      'Start Service'
    : apiPath.startsWith('stop') ? 
      'Stop Service'
    : apiPath.startsWith('transfer') ? 
      'Transfer Service'
    : ''  
  const serviceDates = 
    apiPath.startsWith('transfer') ? [
        {name: 'previousServiceDate', label: `Date to Stop Service at ${formatStreetAddress(values['previousAddress1'], values['previousAddress2'])}`, format: reviewEntriesDateFormat},
        {name: 'serviceDate', label: `Date to Start Service at ${formatStreetAddress(values['serviceAddress1'], values['serviceAddress2'])}`, format: reviewEntriesDateFormat},
      ]
    :
      [{name: 'serviceDate', format: reviewEntriesDateFormat}]
  return [{value: requestType, label: 'Request Type'}, ...serviceDates, {name: 'serviceInstructions'}]
}
// 221006 - for printAddress, accept sectionLabel in props
const printAddress = ({ apiPath, values, prefix='', sectionLabel }) => {
  return prefix && sectionLabel && (
    <>
      <SectionLabel label={sectionLabel} />
      <SectionFields>
        <>
          <FieldInfo apiPath={apiPath} fieldLabel='Street Address' fieldValue={formatStreetAddress(values[`${prefix}Address1`], values[`${prefix}Address2`])} />
          <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 0, sm: 2.6}}>                
            <FieldInfo apiPath={apiPath} fieldLabel='City' fieldValue={values[`${prefix}City`]} />                
            <FieldInfo apiPath={apiPath} fieldLabel='State' fieldValue={values[`${prefix}State`]} />
            <FieldInfo apiPath={apiPath} fieldLabel='Zip' fieldValue={values[`${prefix}Zip`]} />                      
          </Stack>
        </>
      </SectionFields>
    </>
  )
}
//
const ReviewEntries = props => {

  const { apiPath } = usePage();    // stepNames, 
  const { values } = useFormikContext();
  
  return (    
    <>
      {/* {RequestorInformation}       */}
      {printSection({apiPath, values, section: {label: 'Requestor Information', items: getRequestorInformationItems({apiPath})}})}     
      {/* {AccountInformation} */}
      {printSection({apiPath, values, section: {label: 'Account Information', items: getAccountInformationItems({apiPath})}})}
      {/* {PremiseInformation} */}
      {/* 221006 - print current address fields for transfer service */}
      {printAddress({apiPath, values, prefix: 'previous', sectionLabel: apiPath.startsWith('transfer') ? 'Current Address' : null})}
      {printAddress({apiPath, values, prefix: 'service', sectionLabel: apiPath.startsWith('transfer') ? 'New Service Address' : 'Service Address'})}
      {/* {ServiceInformation} */}
      {printSection({apiPath, values, section: {label: 'Service Request', items: getServiceInformationItems({apiPath, values})}})}
      {/* {FileInformation} */}
      {printSection({apiPath, values, section: {label: 'Document Uploads', items: getFileInformationItems({apiPath, values})}})}
      {/* {printSection({apiPath, values})} */}
    </>
  )
}
//
export { ReviewEntries };
//
export default ReviewEntries;
//
