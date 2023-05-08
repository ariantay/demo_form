

import { useState, useEffect } from 'react'
import { Form } from 'formik'
import FormikDebug from './FormikDebug'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import ReCAPTCHA from "react-google-recaptcha";
import pendingResolve from '../utils/HelperFunctions'
import getEnvironmentVariables from '../utils/EnvironmentVariables'
import { FormikPage } from '../utils/PageComponents'
import PageHeader from './PageHeader'
import FormikStepper from './FormikStepper'
import FormikNavButtons from './FormikNavButtons'
import FocusDiv from '../components/FocusDiv'
import LoadingOverlay from '../components/LoadingOverlay'
import FormikSubmitDialog from './FormikSubmitDialog'
import { PageProvider } from '../utils/PageContext';
import { AlertDialog } from '../components/AlertDialogs';
import { AlertFeedbackWithPage } from '../components/AlertDialogs';


function FormLayout ({ 
  // 220623 - PageContext props
  stepNames, stepNumber, furthestStep, apiPath, 
  //
  mergedTouch,
  handleNext, handlePrev,  
  validateFormWizard,
  apiResponse, setResponse,     
  captchaRef,
  ...props
}) {

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true
    setLoading(true)
    pendingResolve(580)
    .then(() => {
      if (active) setLoading(false)
    })          
    return () => active = false
  },[stepNumber])  
  
  const [alert, setAlert] = useState(null);

  const buttonProps = ({stepNames, stepNumber, furthestStep, loading, apiResponse, mergedTouch, handlePrev, handleNext, setAlert, alert, validateFormWizard});  
  const submitDialogProps = ({apiResponse, setResponse});
  
  // console.log('hi')
  return (            
    <PageProvider {...{stepNames, stepNumber, furthestStep, apiPath}}>
      <Box component='main' sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>                                          
        <Paper variant='outlined' sx={{p: {xs: 3, md: 9.5}, mx: {xs: -2, md: 11}, maxWidth: {xs: 'sm', md: 'md'}}}>        
          {/* <img src={bannerImage} alt='' style={{minWidth:'100%', maxHeight: '320px', maxWidth:'100%', borderRadius: '4px'}} />           */}
          {getEnvironmentVariables().isProduction ? null : (
            <Box my={1} id="google_translate_element" />
          )}
          <Form autoComplete='off' noValidate>     

            <FocusDiv loading={loading} />   
            
            <Stack spacing={1}>             
              <PageHeader />
              <FormikStepper />              
              <AlertFeedbackWithPage />                
              <LoadingOverlay                
                isLoading={loading}
                loading={
                  <Box sx={{minHeight: 500, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress color="inherit" />
                  </Box>
                }
                doneLoading={                
                  <Fade appear={true} in={!loading} timeout={400} unmountOnExit>     
                    <Box>           
                      <FormikPage />                      
                    </Box>
                  </Fade>
                }
              />                                                                              
              <Divider sx={{my:6}}/>            
              <FormikNavButtons {...buttonProps} />                        
            </Stack>

            <ReCAPTCHA
              ref={captchaRef}
              size='invisible'                            
              sitekey={getEnvironmentVariables().sitekey_invis}
            />           

          </Form>            
        </Paper>
      </Box>      
      <AlertDialog alert={alert} setAlert={setAlert} />
      <FormikSubmitDialog {...submitDialogProps} targetURL='https://aftersubmit.com' />
      {(getEnvironmentVariables().isProduction ? null : (
        <FormikDebug {...{'envProps': getEnvironmentVariables()}} {...{'appProps': {apiPath, stepNames}}} />
      ))}       
    </PageProvider>   
  )        
}

// export default memo(FormLayout);
export default FormLayout;