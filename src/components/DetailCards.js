

import { useState } from 'react'
import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// 220713 - imports for replaced HiddenField 
// import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import Fade from '@mui/material/Fade';
// import { styled } from '@mui/material/styles';
import { 
  applicationListDateFormat,  
  reviewEntriesDateFormat, 
  statusHistoryDateTimeFormat,
} from '../utils/DateFormats';
import { 
  formatUsername,
  formatPhone, 
  formatSSN, 
  formatStreetAddress,
  // formatServiceType, 
} from '../utils/StringFormats';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import { isFunction } from '../utils/HelperFunctions'
import { getFieldConfigIgnoreCase } from '../utils/FieldsConfig'


// 220929 - copied from review entries
function SectionLabel ({sx={}, ...props}) {
  const { label='' } = props;
  return (
    <Typography            
      // variant='h4'      
      fontSize={{lg: '1.4rem', sm: '1.3rem', xs: '1.2rem'}}
      // fontWeight={400}
      // color={'primary.main'}
      // sx={{mt: 2, lineHeight: 1.3, letterSpacing: '0.00035em'}}      
      children={label}
      {...sx}
      //
      // 220929 - review entries section header
      mt={4}
      mb={.8} 
      // mb={-.2}
      variant='h5' 
      fontWeight={400}
      // gutterBottom 
      color='primary'
      // children={label}
      {...sx}
      //
    /> 
  )
}
// 220929 - copied from reviewentries
function SectionFields ({ children }) {
  return (
    <Stack ml={1} spacing={1.0}>
      {children}
    </Stack>
  )
}
// 220929 - copied from reviewentries
function FieldInfo ({fieldSx={}, ...props}) {
  const {fieldName='', fieldLabel='', fieldValue, fieldFormat, hidden} = props
  const config = getFieldConfigIgnoreCase({fieldName})
  const sxHidden = hidden ? {
    // transition: (theme) => (theme.transitions.create(['background-color', 'backgroundColor', 'color']), {
    //   duration: theme.transitions.duration.complex,
    // }),                    
    width: 'fit-content',
    pr: 1.5,
    borderRadius: 1,  
    backgroundColor: 'text.disabled',
    '& .MuiTypography-root': {
      opacity: .02,            
    },
    '&:hover': {
      backgroundColor: 'background.default',
      '& .MuiTypography-root': {
        opacity: 1,
      },
    },            
  } 
  : {}
  //console.log(config?.label)
  return (
    <Stack pl={0} sx={{maxWidth: 300}} spacing={0.1}>
      <Typography 
        variant='subtitle2' 
        color='grey.700'   
        fontSize={{lg: '.80rem', sm: '.75rem', xs: '.70rem'}}      
        sx={{fontWeight: 300, lineHeight: .9, letterSpacing: '0.0001em',}} 
        children={`${fieldLabel||config?.label||fieldName}`.toLowerCase()}
      />
      <Box sx={sxHidden}>
        <Typography 
          // 220929 - settings from reviewentries
          variant='h6' 
          color='text.primary'   
          // fontSize='1.24rem'   
          //
          // 220929 - replaced with settings from reviewentries     
          // variant='body1'
          // color='text.primary'
          // fontWeight={500}         
          // fontSize={{lg: '1.00rem', sm: '0.95rem', xs: '0.9rem'}}
          fontSize={{lg: '1.2rem', sm: '1.1rem', xs: '1rem'}}
          //
          sx={{wordWrap: 'break-word', lineHeight: 1.4, letterSpacing: '0.000235em',}}
          // component="div"
          // 220929 - if not a function, false will take precedence over nulls and the null coalesce wont happen
          // children={((isFunction(format) ? format(value)) : value) ?? 'N/A'}
          children={((isFunction(fieldFormat)&&fieldFormat(fieldValue)) || fieldValue) ?? 'N/A'}
          //
          {...fieldSx}
        />
      </Box>
    </Stack>
  )
}
// 220929 - copied from reviewentries
const printSection = ({ values, fieldSx = {}, Header, footer, section: {label='', labelSx={}, items=[]} = {} }) => {  
  return label && items.length>0 && (
    <>
      <SectionLabel label={label} sx={{...labelSx}} />
      <SectionFields>
        <>
          {Header}
          {items.map(e => (
            <FieldInfo 
              key={`${e.name}${e.label}`}
              fieldSx={{...fieldSx}}
              fieldName={e.name}
              fieldLabel={e.label}                             
              fieldFormat={e.format}
              // 220929 - add get function for custom extracts from values (ie serviceaddress, fullname) 
              // fieldValue={e.value??values[e.name]}
              fieldValue={(isFunction(e.get)&&e.get(values)) || (e.value??values[e.name])}
              // 230113 - pass hidden to fieldinfo
              hidden={!!e.hidden}
            />
          ))}
        </>
      </SectionFields>
    </>
  )
}
// 220621 - subapplicants
function SubApplicantsInformationCard (props) {
  const { housemembers } = props;
  const [index, setIndex] = useState(0);
  const member = housemembers.length>0 ? housemembers[index] : null
  const SelectButtons = housemembers.length>0 &&
    <Stack pb={0.0} direction='row' spacing={1}>
      {housemembers.map((elem, i) => (
        <IconButton 
          key={i+1} 
          size='large' 
          // variant='text'
          variant={index===i ? 'outlined' : 'contained'}
          // color={index===i ? 'primary' : 'default'}
          onClick={() => setIndex(i)}
          sx={{color: index===i ? 'primary.main' : 'grey.500'}}
        >
          <AccountCircleIcon sx={{fontSize: 30}}/>
        </IconButton>
      ))}
    </Stack>
  const fieldSx = {color: 'grey.700', fontWeight: 400}
  const memberItems = [
    {label: 'Name', get: values => `${values['mfirstname']} ${values['mlastname']}`},
    {name: 'mrelation', label: 'Relation'},
    {name: 'mphonenumber', label: 'Phone', format: formatPhone},
    {name: 'memail', label: 'Email'},
    {name: 'mdateofbirth', label: 'Date of Birth', format: applicationListDateFormat},
    {name: 'mssn_old', label: 'SSN', format: formatSSN},
    {name: 'mdriverlicensestate', label: 'Driver License State'},
    {name: 'mdriverlicensenumber_old', label: 'Driver License Number'},
    {name: 'memployername', label: 'Employer Name'},
    {name: 'memployerphone', label: 'Employer Phone', format: formatPhone},
    {name: 'memployercity', label: 'Employer City'},
  ]
  return member && (
    <>
      {printSection({ values: member, fieldSx, Header: SelectButtons, section: {label: 'SubApplicants', labelSx: {color: 'text.secondary', fontWeight: 400}, items: memberItems}})}
    </>
  )
}
// 220929 - replaces accountsummarycard
const getAccountSummaryItems = props => {
  const { requesttype } = props
  const residentialItems = [
    {label: 'Name', get: values => `${values['firstname']} ${values['lastname']}`},
    {name: 'phonenumber', format: formatPhone}, //, label: 'Phone'
    // start service 
    {name: 'email'}, //, label: 'Email'
  ]
  const commercialItems = [
    {name: 'businessname'}, //, label: 'Business Name'
    // 221007 - add doingBusinessAs as it is now required for all commercial applications
    {name: 'doingbusinessas'},
    {name: 'businessonsitephone', format: formatPhone}, //, label: 'Onsite Phone'
    // start service
    // {name: 'doingbusinessas'}, //, label: 'Email'}
    {name: 'industry'},
    {name: 'naicscode'},
  ]
  const paperless = {name: 'paperless', label: 'Billing Type', format: value => value ? 'E-Bill' : 'Standard Mail'}
  const accountSummaryItems = 
    requesttype.endsWith('Residential') ? 
      [...residentialItems, paperless]
    : requesttype.endsWith('Commercial') ?
      [...commercialItems, paperless]
    : []
  // 220929 - stopservice requests only requires name and phonenumber
  // return requesttype.startsWith('Stop') ? accountSummaryItems.slice(0,2) : accountSummaryItems
  // 221007 - add doingBusinessAs as it is now required for all commercial applications
  return requesttype.startsWith('Stop') ? accountSummaryItems.slice(0, requesttype.endsWith('Commercial') ? 3 : 2) : accountSummaryItems
}
// 220929 - replaces accountdetailscard
const getAccountDetailsItems = props => {
  const { requesttype, businesstype, ssn_old, driverlicensenumber_old } = props
  const personItems = [    
    {name: 'dateofbirth', format: applicationListDateFormat}, 
    {name: 'ssn_old', label: 'SSN', hidden: true},
    {name: 'driverlicensestate'},
    {name: 'driverlicensenumber_old', label: 'Driver License Number', hidden: true},  
  ]
  const businessItems = [
    {name: 'businesstype'},
    {name: 'taxid'},
    {name: 'corporateofficername'},
    {name: 'corporateofficerphone', format: formatPhone}, 
    {name: 'accountspayablename'},
    {name: 'accountspayablephone', format: formatPhone},
  ]  
  const accountDetailsItems = 
    requesttype.endsWith('Residential') || businesstype==='SolePropietor' ? 
    // 220929 - the api will return null if the person viewing doesn't have access to pii
      personItems.filter(e => ssn_old!==null&&driverlicensenumber_old!==null ? true : e.name!=='ssn_old'&&e.name!=='driverlicensenumber_old')      
    : requesttype.endsWith('Commercial') ?
      businessItems
    : []
  // 220929 - stopservice requests will not have these fields populated    
  return requesttype.startsWith('Stop') ? [] : accountDetailsItems
}
// 220929 - replaces employerdetailscard
const getEmployerDetailsItems = props => {
  const { requesttype } = props
  const employerDetailsItems = [    
    {name: 'employername'},
    {name: 'employerphone', format: formatPhone}, 
    {name: 'employercity'},
  ]
  // 220929 - only start service requests shows previous address in account details tab  
  return requesttype==='StartResidential'||requesttype==='TransferResidential' ? employerDetailsItems : []
}
// 220929 - just have one component return all address items
const getAddressItems = ({ prefix }) => {
  const addressItems = [    
    {name: 'Street Address', get: values => formatStreetAddress(values[`${prefix}address1`], values[`${prefix}address2`])}, 
    {name: 'City State Zip', get: values => `${values[`${prefix}city`]}, ${values[`${prefix}state`]} ${values[`${prefix}zip`]}`},
  ]
  // 220929 - let conditional rendering be handled by calling function
  return addressItems
}
// 220929 - replaces requestordetailscard
const getRequestorDetailsItems = props => {
  const { requesttype } = props
  const requestorrole = {name: 'requestorrole'}
  const requestordetailsitems = [
    {label: 'Name', get: values => `${values['requestorfirstname']} ${values['requestorlastname']}`},
    {name: 'requestorphonenumber', format: formatPhone}, //, label: 'Phone'
    {name: 'requestoremail'}, //, label: 'Email'
  ]
  return requesttype.endsWith('Commercial') ?
      [requestorrole, ...requestordetailsitems]
    : requesttype==='StopResidential' ?
      requestordetailsitems
    : []
}
// 220929
const getRequestDetailsItems = props => {
  return [
    {name: 'id', label: 'Request ID'},
    {name: 'status', label: 'Request Status'},
    {name: 'requestdate', label: 'Opened On', format: reviewEntriesDateFormat},
    {name: 'lastmodifieddate', label: 'Updated On', format: statusHistoryDateTimeFormat},
    {name: 'lastmodifieduser', label: 'Updated By', format: formatUsername},    
    {name: 'lastmodifiedcomment', label: 'Update Comments'},
    {name: 'emailsent', label: 'Email Notification Status', format: value => value ? 'Success' : 'Fail'},    
  ]
}
// 220929 - servicetype removed from all apps
// 220929 - replaces ServiceRequestCard
const getServiceRequestItems = props => {
  const { requesttype, serviceaddress1, serviceaddress2, previousaddress1, previousaddress2 } = props
  const serviceDateItems = 
    requesttype.startsWith('Transfer') ? [
      { name: 'previousservicedate', label: `Date to Stop Service at ${formatStreetAddress(previousaddress1, previousaddress2)}`, format: reviewEntriesDateFormat },
      { name: 'servicedate', label: `Date to Start Service at ${formatStreetAddress(serviceaddress1, serviceaddress2)}`, format: reviewEntriesDateFormat },
    ] 
    : [{ name: 'servicedate', format: reviewEntriesDateFormat }]

  return [
    { name: 'requesttype', label: 'Request Type'},
    { name: 'serviceinstructions', label: 'Special Instructions'},
    ...serviceDateItems,
  ]
}
// 220713 - standardize tab layout
function TabLayout (props) {
  const { LeftPane, RightPane } = props
  return (
    <Stack direction='row' sx={{minHeight: 400}}>
      <Stack sx={{width: 300}}>
        {LeftPane}
      </Stack>
      <Stack sx={{width: 240}}>
        {RightPane}
      </Stack>
    </Stack>
  )
}
// 220713 - updated to use tablayout
const ApplicantsTab = props => {  
  const { requesttype } = props  
  const LeftPane = 
    <>
      {/* 220929 - replaced cards with getItem configs and printsection */}
      {/* <AccountSummaryCard {...props} /> */}
      {printSection({ values: props, section: {label: requesttype.endsWith('Residential') ? 'Residential Account' : 'Commercial Account', items: getAccountSummaryItems(props)}})}
      {/* {(requesttype.startsWith('Start')||requesttype.startsWith('Transfer')) && <AccountDetailsCard {...props} />} */}
      {printSection({ values: props, section: {label: 'Account Details', items: getAccountDetailsItems(props)}})}
      {/* {requesttype.startsWith('Start') && <PreviousAddressCard {...props} />} */}
      {requesttype.startsWith('Start') && printSection({ values: props, section: {label: 'Previous Address', items: getAddressItems({prefix: 'previous'})}})}
      {/* 220928 - employer details checks requesttype, will return null if check doesn't pass */}
      {/* {(requesttype==='startresidential'||requesttype==='transferresidential') && <EmployerDetailsCard {...props} />}     */}
      {/* {<EmployerDetailsCard {...props} />}    */}
      {printSection({ values: props, section: {label: 'Employer Details', items: getEmployerDetailsItems(props)}})} 
    </>
  //    
  // const RightPane = 
  //   (requesttype==='StartResidential'||requesttype==='TransferResidential') ?     
  //     <SubApplicantsInformationCard {...props} />    
  //   : requesttype==='StartCommercial' || requesttype.startsWith('Stop') ? 
  //     <RequestorDetailsCard {...props} />
  //   : null
  //
  // 220929 - conditional rendering handled by subapplicantscard and getrequestordetailsitems
  const RightPane =
    <>
      <SubApplicantsInformationCard {...props} />
      {printSection({ values: props, section: {label: 'Requestor', items: getRequestorDetailsItems(props)}})} 
    </>
  return <TabLayout LeftPane={LeftPane} RightPane={RightPane} />
}
//
const ServiceRequestTab = props => {
  const { requesttype } = props  
  const LeftPane = 
    <>  
      {printSection({ values: props, section: {label: 'Service Request', items: getServiceRequestItems(props)} })}
      {/* <ServiceRequestCard {...props} />  */}
      {/* {requesttype.startsWith('Transfer')&&<PreviousAddressCard {...props} />}  */}
      {requesttype.startsWith('Transfer') && printSection({ values: props, section: {label: 'Current Service Address', items: getAddressItems({prefix: 'previous'})} })}            
      {/* <ServiceAddressCard {...props} /> */}
      {printSection({ values: props, section: {label: requesttype.startsWith('Transfer') ? 'New Service Address' : 'Service Address', items: getAddressItems({prefix: 'service'})} })}  
      {/* <BillingAddressCard {...props} />      */}
      {printSection({ values: props, section: {label: 'Mailing Address', items: getAddressItems({prefix: 'billing'})} })}
    </>
  // 220929 - replaced by getRequestDetailsItems
  // const RightPane = <RequestDetailsCard {...props} /> 
  const RightPane = 
    <>
      {printSection({ values: props, section: {label: 'Request Details', items: getRequestDetailsItems(props)} })}
    </>
  return <TabLayout LeftPane={LeftPane} RightPane={RightPane} />
}
//
export {
  ServiceRequestTab,
  ApplicantsTab,
}
//
export default ApplicantsTab;
//
