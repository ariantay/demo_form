

import { useEffect, } from 'react';
import { useFormikContext } from 'formik';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SendIcon from '@mui/icons-material/Send';
// import pendingResolve from '../utils/HelperFunctions'

function NavEvents ( props ) {
  const { pagePrev, pageNext, isDisabled } = props;    
  useEffect(() => {  
    const handleKeyUp = event => {
      if (isDisabled) { // || isLastStep 
        return null;
      }
      if (event.keyCode===13) {        
        document.activeElement.blur();
      }      
      if (document.activeElement.tagName!=='INPUT' && document.activeElement.tagName!=='TEXTAREA') {  
        if (event.keyCode===39) {               
            pageNext();
        }      
        if (event.keyCode===37) {      
            pagePrev();
        }        
      }
    }     
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    }  
  }, [pagePrev, pageNext, isDisabled])
  // 220526 - components should always return a render result or return null
  return null;
}

function FormikNavButtons ({ 
  stepNames, stepNumber, furthestStep,
  handlePrev, handleNext, // handleSubmit,
  apiResponse, mergedTouch,  
  loading,
  setAlert, alert,
  validateFormWizard,
  ...props
}) { 
  const { isSubmitting, touched, setTouched, errors, values, handleSubmit, setSubmitting } = useFormikContext()
  const isLastStep = stepNumber===stepNames.length-1
  const showError = stepNumber===furthestStep && Object.keys(errors).some(key => key in touched)
  const isDisabled = loading || isSubmitting || !!apiResponse || !!alert
  const buttonProps = {
    disabled: isDisabled,
    size: 'large',    
  }
  const pagePrev = () => {
    handlePrev()
  }  
  const validateValues = async () => {    
    if (stepNumber===furthestStep) {
      setSubmitting(true)
      // await pendingResolve(1000)
      setTouched(mergedTouch, true)
      await validateFormWizard(values)  
      .catch(yupErrors => {
        throw yupErrors
      })    
      .finally(setSubmitting(false))   
    }
  }
  const pageNext = () => {
    validateValues()
    .then(handleNext)
    .catch(setAlert) // .catch(yupErrors => setAlert(yupErrors))
  }  
  const pageSubmit = () => {
    validateValues()
    .then(() => handleSubmit(values))
    .catch(setAlert)
  }
  const navEventProps = { pagePrev, pageNext, isDisabled }
  
  return (        
    <Box 
      {...props}
      sx={{
        display:'flex', 
        justifyContent: 'space-between',
        mt: 4,
      }} 
    >      
      <NavEvents {...navEventProps} />        
      <Button       
        {...buttonProps}        
        sx={{visibility: stepNumber>0 ? 'visible' : 'hidden'}}        
        color='inherit' 
        startIcon={<ArrowLeftIcon />}      
        onClick={pagePrev} 
        children='Back'
      />
      <Button 
        {...buttonProps}
        color={showError ? 'error' : isLastStep ? 'success' : 'primary'}
        endIcon={isLastStep ? <SendIcon /> : <ArrowRightIcon />}               
        onClick={isLastStep ? pageSubmit: pageNext}              
        children={isLastStep ? 'Submit' : 'Next'}
      />     
    </Box>
  );
}
//
// export default memo(FormikNavButtons);
export default FormikNavButtons;
//