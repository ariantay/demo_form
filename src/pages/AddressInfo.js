// import React, { useState, useRef } from 'react';
//
import { useEffect, useRef } from 'react';
import { useField } from 'formik';
import { usePageHelpers, } from '../utils/FormikHooks';
import FormikField from '../components/FormikField'
// import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
import { FormikCheckbox } from '../components/BaseFields'; //ErrorField
import FormikAutocomplete from '../components/FormikAutocomplete'
import { usePage } from '../utils/PageContext'
import { TypographySectionTitle, StackFields, StackFieldsRow, TypographySubLabel } from '../components/FieldLayouts';

const copyAddress = values => ({...values, ...{billingAddress1: values.serviceAddress1, billingAddress2: values.serviceAddress2, billingCity: values.serviceCity, billingState: values.serviceState, billingZip: values.serviceZip}});
const resetAddress = values => ({...values, ...{ billingAddress1: '', billingAddress2:'', billingCity:'', billingState:'', billingZip:''}});

export const AddressInfo = props => {
  // console.log('page')
  const { apiPath } = usePage()  

  const addressCheckbox = apiPath.startsWith('start')||apiPath.startsWith('transfer') ? (
    <Box my={3}>
      <FormikCheckbox name='isBillingAddressSame' /> 
    </Box>
  ) : null

  const {setValue: setBillingAddress1} = useField('billingAddress1')[2];
  const {setValue: setBillingAddress2} = useField('billingAddress2')[2];
  const {setValue: setBillingCity} = useField('billingCity')[2];
  // const [{value: billingState}, , {setValue: setBillingState, setTouched: setBillingStateTouched}] = useField('billingState');
  const {setValue: setBillingState} = useField('billingState')[2];
  const {setValue: setBillingZip} = useField('billingZip')[2];
  const {value: isBillingAddressSame} = useField('isBillingAddressSame')[0];  

  const { updateValues } = usePageHelpers();
  
  const clickRef = useRef(null);
  useEffect(() => {
    let active = true
    if (active&&clickRef.current!==null&&clickRef.current!==isBillingAddressSame){
      const updateFn = isBillingAddressSame ? copyAddress : resetAddress
      updateValues(updateFn)
    }    
    // updateValues(updater)
    return (() => {
      clickRef.current = isBillingAddressSame ?? null;
      active = false      
    })
  },[isBillingAddressSame])
  return ( 
    <>

      {apiPath.startsWith('transfer') && (
        <>
          <TypographySectionTitle>
            {'Current Service Address'}
          </TypographySectionTitle>  
          <StackFields>
            <TypographySubLabel>
              SERVICE WILL BE STOPPED AT THIS ADDRESS<br/>          
            </TypographySubLabel>
            <FormikField
              name='previousAddress1'                                  
            />          
            <FormikField                
              name='previousAddress2'                                  
            />      
            <StackFieldsRow>
              <FormikField                     
                name='previousCity'                                
              />         
              <FormikField          
                name='previousState'                  
              />      
              <FormikField     
                name='previousZip'                         
              />
            </StackFieldsRow>
          </StackFields>
        </>
      )}

      <TypographySectionTitle>
        {(apiPath.startsWith('transfer') ? 'New ' : '') + 'Service Address'}
      </TypographySectionTitle>  
      <StackFields>
        {apiPath.startsWith('transfer') &&
          <TypographySubLabel>
            SERVICE WILL BE STARTED AT THIS ADDRESS<br/>          
          </TypographySubLabel>
        }
        <FormikField
          name='serviceAddress1'                        
          onInput={ event => {
            const { value } = event.target;
            if (isBillingAddressSame) {               
              setBillingAddress1(value, false)
            }
          }}
        />          
        <FormikField                
          name='serviceAddress2'                                  
          onInput={ event => {
            const { value } = event.target;
            if (isBillingAddressSame) {               
              setBillingAddress2(value, false)
            }
          }}
        />      
        <StackFieldsRow>
          <FormikField                     
            name='serviceCity'                                
            onInput={ event => {
              const { value } = event.target;
              if (isBillingAddressSame) {               
                setBillingCity(value, false)
              }
            }}
          />         
          <FormikField          
            name='serviceState'                  
            onChange={ event => {
              const { value } = event.target;
              if (isBillingAddressSame) {               
                setBillingState(value, false)
              }
            }}
          />      
          <FormikField     
            name='serviceZip'                         
            onChange={ event => {
              const { value } = event.target;
              if (isBillingAddressSame) {               
                setBillingZip(value, false)
                // 220621 - doesnt work, but doesnt matter it'll validate on blur              
                // setBillingZipTouched(true,true)
              }
            }}
          />
        </StackFieldsRow>
      </StackFields>

      {addressCheckbox}

      <TypographySectionTitle>
        Mailing Address
      </TypographySectionTitle> 
      <StackFields>     
        <FormikField             
          name='billingAddress1'           
          disabled={Boolean(isBillingAddressSame)}     
        />      
        <FormikField         
          name='billingAddress2'                          
          disabled={Boolean(isBillingAddressSame)}     
        />  
        <StackFieldsRow>  
          <FormikField                 
            name='billingCity'                          
            disabled={Boolean(isBillingAddressSame)}     
          />      
          <FormikAutocomplete                    
            name='billingState'            
            disabled={Boolean(isBillingAddressSame)}
          />
          <FormikField                                                     
            name='billingZip'
            disabled={Boolean(isBillingAddressSame)}     
          />
        </StackFieldsRow>        
      </StackFields>

    </>
  )     
}
//
export default AddressInfo;
//