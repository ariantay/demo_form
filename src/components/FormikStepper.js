

import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { usePage } from '../utils/PageContext'
import { useFormikErrors } from '../utils/PageHooks'

const StepperStep = props => {
  const {page, stepNumber, furthestStep, ...rest} = props
  const [hasErrors, { pageLabel }] = useFormikErrors(page)
  return (
    <Step completed={stepNumber<=furthestStep} {...rest}>
      <StepLabel error={hasErrors}>
        {pageLabel}
      </StepLabel>
    </Step>
  )
}
//
const FormikStepper = props => {
  const mobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const { stepNames, stepNumber, furthestStep } = usePage()

  return (
    mobile ?                
      <Typography variant='h5' fontWeight='regular' align='center'>                    
        Step {stepNumber + 1} / {stepNames.length}
      </Typography>
    :
      <Stepper activeStep={stepNumber} {...props} >      
        {stepNames.map((step, index) => {      
          return <StepperStep key={step} page={step} stepNumber={index} furthestStep={furthestStep} />
        })}
      </Stepper>
  )   
}

export {
  FormikStepper,  
}

export default FormikStepper;
//