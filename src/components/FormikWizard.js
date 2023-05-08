//
//
import { useRef, memo, useState, useMemo, useCallback } from 'react';
// import flatten from 'flat';
//
// 220526 - dynamic validation with yup.lazy is an option
// https://github.com/jaredpalmer/formik/issues/145
// https://github.com/jaredpalmer/formik/issues/1228
//
// import { object, lazy } from 'yup';
import { object } from 'yup';
import { Formik } from 'formik';
import { getInitialValuesByPage } from '../utils/PageConfig';
import { getValidationSchemasByPage, getYupShapeDependency, } from '../utils/ValidationSchemasByPage';
import { getFormData } from '../utils/AppConfig';
//
import { pendingResolve } from '../utils/HelperFunctions'; // pendingReject, 
//
import { getEnvironmentVariables } from '../utils/EnvironmentVariables';
//
import { api } from '../utils/webapi';
//
import FormLayout from './FormLayout';
//

// const getSchema = (stepNames, index) => {
//   console.log('merging schema')
//   let baseSchema = object().shape( 
//     getValidationSchemasByPage(stepNames[0]), 
//     getYupShapeDependency(stepNames[0]) 
//   )
//   if (index > 0) {
//     baseSchema = baseSchema.shape(
//       getValidationSchemasByPage(stepNames[index]), 
//       getYupShapeDependency(stepNames[index])
//     )
//   } 
//   return baseSchema
//   // return object().shape(
//   //   stepNames.slice(0, index+1).reduce((obj,key) => ({...obj, ...getValidationSchemasByPage(key)}),{}), 
//   //   stepNames.slice(0, index+1).reduce((obj,key) => ([...obj, ...getYupShapeDependency(key)]),[])
//   // )
// }

// 220427 - remove debug
const FormikWizard = ( props ) => {
  // 220207 - explicitly define required props through destructure 
  const { stepNames, apiPath, path } = props;
  // 220314 - test captchaRef
  const captchaRef = useRef(null)
  // 210504 state for apiresponse
  const[apiResponse, setResponse] = useState(null);
  // state for current page
  const [stepNumber, setStepNumber] = useState(0);
  // tracks furthest step completed  
  const stepRef = useRef(0);
  const furthestStep = stepRef.current;

  const initialValues = useMemo(
    () => {      
      return stepNames.reduce((arr,key) => ({...arr, ...getInitialValuesByPage(key, apiPath)}),{})      
    },
    [stepNames, apiPath],   
  )
  const mergedSchema = useMemo( 
    () => {
      return (
        object().shape( 
          stepNames.slice(0, furthestStep+1).reduce((arr,key) => ({...arr, ...getValidationSchemasByPage(key,apiPath)}),{}), 
          stepNames.slice(0, furthestStep+1).reduce((arr,key) => ([...arr, ...getYupShapeDependency(key)]),[])
        )
      )
    },
    [stepNames, furthestStep, apiPath],
  )
  const mergedTouch = useMemo(    
    () => {      
      return (
        Object.keys(mergedSchema.fields).reduce((arr,key) => ({...arr, ...{[key]:true}}),{}) 
      )
    },     
    [mergedSchema],
  )
  const validateFormWizard = useCallback( values => {
    return mergedSchema.validate(values, {abortEarly: false})
  }, [mergedSchema])
  //
  const handlePrev = useCallback( () => {      
    setStepNumber( currentStep => Math.max( currentStep-1, 0 ) );
  }, [] )
  //
  const handleNext = useCallback( () => {  
    setStepNumber( currentStep => {
      const nextStep = Math.min( currentStep+1, stepNames.length-1 );
      stepRef.current = nextStep>=furthestStep ? nextStep : furthestStep;
      return nextStep;
    })
  }, [stepNames, furthestStep] ) 
  //
  
  // https://github.com/formium/formik/issues/1730
  const handleSubmit = async (values, actions) => {  
    let active = true;  
    setResponse(null);   
    // 220503 - allow time for captcha to reset 
    await pendingResolve(2000);

    // 220502 - abortcontroller to safely cancel api requests
    // https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    // https://axios-http.com/docs/cancellation
    //
    // 220502 - if captcha challenge is dismissed, users will be stuck in submitting state
    // 220502 - safeguard against this with timeout
    //

    const controller = new AbortController();        
    // 220603 - just validate here too - no dont need to formik will call validate
    // await mergedSchema.validate(values).catch(errors => controller.abort())

    const captchaTimeout = pendingResolve(32000)
    .then( result => {
      // throw new Error('reCAPTCHA challenge timeout')
      return active ? Promise.reject(new Error('reCAPTCHA challenge timeout')) : result;
    })
    .catch( error => {
      // 220516 - ** aborting the axios request should result in request.success and response.error **
      controller.abort()
      // captchaRef.current.reset()     
      console.error(error)
      return error;
      // return error;
    });
    //
    // 220516 - promise.race returns first promise to resolve with success    
    // const captchaToken = await Promise.race([ captchaRef.current.executeAsync(), captchaTimeout ])         
    await Promise.race([ captchaRef.current.executeAsync(), captchaTimeout ])
    
    const formData = getFormData( values, apiPath );
    // 220314 - also submit captcha challenge response for validation
    // formData.append('captchaToken', captchaRef.current.getValue());
    formData.append('captchaToken', captchaRef.current.getValue())

    const result = await api.request({
      url: apiPath, 
      data: formData,  
      signal: controller.signal,
    })    
    // .then( result => {
    //   const captchaValue = captchaRef.current.getValue();
    //   console.log('captchaValues: ', captchaToken, captchaValue, captchaToken===captchaValue)
    // })
    .catch( error => {
      // 220514 - was this caught here?  yes
      // console.log( 'error caught in formikWizard.result.error', error );
      if ( !getEnvironmentVariables().isProduction ) {
        console.log( 'error caught in formikWizard.result.error', error );
        console.log( 'resetting captcha' ); 
      }
      // 220502 - need to reset captcha if submit failed to avoid timeouts or inconsistent captcha behavior
      // 220502 - each captcha token is only valid for 2minutes, and is only valid for verification once
      // console.log( 'resetting captcha' );      
      captchaRef.current.reset();
      // 220502 - return the error so setResponse can forward to SubmitDialog      
      // 220514 - returning promise.reject(error) results in uncaught exception
      // return Promise.reject(error);
      return error;      
    });   
    // 220516 - assumes request.error thrown by axios due to cancellation, result doesnt seem to have error when cancelled
    setResponse( result ) ;
    // 220514 - this assumes captchaTimeout doesnt cause axios to throw due to cancellation
    // const dialogMessage = !!captchaToken.name&&!!captchaToken.message ? {defaultError: `reCAPTCHA response was not completed within the time limit.\n\nPlease try again.\n`} : result;
    // setResponse(dialogMessage);    
    active = false;
    //    
  }  
  //console.log('formikwizard');
  const formProps = { 
    apiPath,
    stepNames, stepNumber, furthestStep,
    // 220524 - validateForm replaced with Formik.validateform 
    // validateForm, 
    handlePrev, handleNext,
    apiResponse, setResponse,
    mergedTouch, // PageComponent,   
    // 220314 - test captcha ref
    captchaRef,  
    // 220603 - test validateFormWizard
    validateFormWizard,
  };
  //
  // 220526 - ref value?
  // console.log( `formikwiz ref: ${stepRef.current}\nschemaFields: ${Object.keys(mergedSchema?.fields).length}` );
  //
  return (        
    <Formik      
// 220526 - dynamic validation with yup.lazy is an option
// https://github.com/jaredpalmer/formik/issues/145
// https://github.com/jaredpalmer/formik/issues/1228
//    
// validationSchema={() => lazy(values => mergedSchema)}
//
      validationSchema={mergedSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      <FormLayout {...formProps} />     
    </Formik>
  )
}
// 210817 - try memoize formikwizard
// export { FormikWizard };
// export default FormikWizard;
export default memo( FormikWizard );
//
