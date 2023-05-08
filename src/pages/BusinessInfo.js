
// import React, { useState } from 'react';
import { useState, useEffect, useRef } from 'react';
//
import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton'
import Fade from '@mui/material/Fade';
import { useField } from 'formik';
//
import { pendingResolve } from '../utils/HelperFunctions';
import { usePageHelpers } from '../utils/FormikHooks'
// import { getEnvironmentVariables } from '../utils/EnvironmentVariables';
import { usePage } from '../utils/PageContext'
//
// 221007 - FieldLayouts now exports printsection (FieldSection)
// import { TypographySectionTitle, StackFields, TypographySubLabel, FieldSection } from '../components/FieldLayouts'; //, StackFieldsRow
import { TypographySectionTitle, FieldSection } from '../components/FieldLayouts'; //, StackFieldsRow
// 221007 - use along with usePageHelpers.updateValues to reset fields when businesstype changed
const resetSolePropietor = {ssn: '', driverLicenseNumber: '', driverLicenseState: '', idUpload: '', ssnUpload: '', dateOfBirth: '',}
const resetOthers = {taxID: '', corporateOfficerName: '', corporateOfficerPhone: '', accountsPayableName: '', accountsPayablePhone: '',}
const resetValues = values => ({...values, ...resetSolePropietor, ...resetOthers});
const RequiredSolePropietor = () => {
  const { apiPath } = usePage()
  return (
    <>
    {FieldSection({ label: 'Applicant Details', items: [{name:'firstName'}, {name:'lastName'}, apiPath!=='stopcommercial'&&{name:'dateOfBirth'}] })}
    {FieldSection({ label: 'Social Security Number', items: [{name:'ssn', type:'password'}, apiPath!=='stopcommercial'&&{name:'ssnUpload', type:'upload'}] })}
    {FieldSection({ label: 'Driver License', items: [{name:'driverLicenseNumber'}, {name:'driverLicenseState', type:'autocomplete'}, apiPath!=='stopcommercial'&&{name:'idUpload', type:'upload'}] })}
    </>
  )
}
//
const RequiredOther = () => {
  const { apiPath } = usePage()
  return (
    <>
    {FieldSection({ label: 'TIN/EIN', items: [{name:'taxID', type:'password'}] })}
    {FieldSection({ label: 'Corporate Officer', items: apiPath!=='stopcommercial' && [{name:'corporateOfficerName'}, {name:'corporateOfficerPhone'}] })}
    {FieldSection({ label: 'Accounts Payable', items: apiPath!=='stopcommercial' && [{name:'accountsPayableName'}, {name:'accountsPayablePhone'}] })}
    </>
  )  
}
//
function RequiredLoading(){
  return (    
    <Box>
      <Stack>
      <Skeleton variant='text' height={80} />        
      <Skeleton variant='rectangular' height={80} />
      <Skeleton variant='text' height={80} />     
      <Skeleton variant='rectangular' height={80} />  
      <Skeleton variant='text' height={80} />     
      <Skeleton variant='rectangular' height={80} />  
      </Stack>       
    </Box> 
  )
}
const BusinessInfo = props => {
  const { apiPath } = usePage()
  const [isLoading, setLoading] = useState(false)
  const [{value: businessType}, ] = useField('businessType')
  // 220328 - prevRef captures the previous value of businessType   
  const prevRef = useRef(businessType)
  const { updateValues } = usePageHelpers()
  
  useEffect(() => {
    let active = true    
    const shouldUpdate = prevRef.current!==businessType && (businessType==='SolePropietor' || prevRef.current==='SolePropietor');
    if (active&&shouldUpdate){
      updateValues(resetValues)
      setLoading(true)
    }
    //    
    pendingResolve(280)
    .then(() => {
      if (active) {        
        setLoading(false)
      }
    });      
    return (() => {      
      prevRef.current = businessType;
      active = false;
    })
  }, [businessType])

  return(
    <Box>
      {FieldSection({ label: 'Business Information', items: [{name:'businessName'}, {name:'doingBusinessAs'}, apiPath!=='stopcommercial'&&{name:'industry'}, apiPath!=='stopcommercial'&&{name:'naicsCode'}, {name:'businessOnsitePhone'}] })}
      {FieldSection({ label: 'Business Type', sublabel: 'Additional required fields will apppear after selecting your Business Type.', items: [{name:'businessType'}] })}            
      {!businessType && (
        <TypographySectionTitle sx={{mt: 2, textAlign: 'center'}}>        
         {`Choose your Business Type to proceed`}
        </TypographySectionTitle>
      )}                  
      {(isLoading||!businessType) && (    
        <RequiredLoading />
      )}
      <Fade appear={true} in={!isLoading} timeout={400} > 
        <Box>
        {businessType && (
          businessType==='SolePropietor' ? <RequiredSolePropietor /> : <RequiredOther />
        )}    
        </Box>      
      </Fade>
    </Box>
  )     
}
//
export { BusinessInfo };
//
export default BusinessInfo;
//

