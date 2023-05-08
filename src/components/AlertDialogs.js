
//
import { useState, useEffect, useRef, } from 'react'; //useRef
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Zoom from '@mui/material/Zoom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useFormikContext } from 'formik';
import { useFormikErrorsWithPage } from '../utils/PageHooks'
import { usePage } from '../utils/PageContext'
import { getFieldConfig } from '../utils/FieldsConfig'
//

const AlertFeedback = props => {
  const { fieldErrors=[], hasError, loading } = props;
  const [stay, setStay] = useState(false)

  useEffect(() => {
    // 220601 - delay alert closing until validation success
    setStay( prev => !loading&&hasError ? true : prev );
    const timeId = setTimeout(() => {      
      setStay(hasError)
    }, 1200)
    return () => {
      clearTimeout(timeId)
    }
  }, [hasError])
  
  return (
    <Zoom in={hasError||stay} style={{ transitionDelay: hasError ? '0ms' : '0ms', timeout: hasError && 1000 }} >
      <Alert 
        sx={{ m:'auto',
          // visibility: hasError ? 'visible' : 'hidden',
          display: 'flex', width: '86%', justifyContent: 'center',
        }}              
        severity={(loading&&'info') || (hasError&&'error') || 'success'}
        >
          <AlertTitle sx={{pt:0.2, pb:0.2}}>{((loading&&'Validating...') || (hasError&&'Please correct the errors below') || 'Success')}</AlertTitle>          
           <Box sx={{ mx:'auto', px:0.4, pb:1.2, lineHeight:1.4, wordSpacing:4, }}>{fieldErrors.join(', ')}</Box> 
        </Alert>                
    </Zoom>   
  ) 
}


// 220621 - parse yupErrors
function parseYupErrors (yupErrors) {
  const parsedErrors = (yupErrors?.inner??[]).reduce((obj, elem) => {            
    const key = elem?.path ?? '';
    return key ? obj[key]='required' : obj
  }, {})
  return parsedErrors
}
function AlertDialog (props) {   
  //
  // 220607 - check if array
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
  //
  // 220603
  // https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
  //
  // 220604 - yupvalidation is returning the error before formik error populates  
  const { apiPath } = usePage()
  const [show, setShow] = useState(false)
  const { errors } = useFormikContext()
  const msgRef = useRef({})
  //
  const { alert , setAlert } = props;
  const handleClose = event => {
    event.defaultMuiPrevented = true;
    setAlert(null);
    setShow(false)
  }
  // const message = useRef({})
  useEffect(() => {
    // msgRef.current = Object.keys(errors).length===0 ? Message(alert ?? {}) : Message(errors);
    msgRef.current = Object.keys(errors).length===0 ? parseYupErrors(alert) : errors;
    setShow(true)
  },[alert])
  //
  // 220604 - useRef to get the latest message
  //  https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
  //
  // 220604 - how to defer showing the component while waiting for an async value
  // https://reactjs.org/docs/hooks-reference.html#uselayouteffect
  //
  return show && (  
    <Dialog 
      open={(!!alert && show)} 
      onClose={handleClose}
      // onClose={(event, reason) => reason===}
      // maxWidth='xs'     
      // fullWidth
      PaperProps={{sx: {width: '28%', minWidth: 300, maxWidth: 350}}}
      // TransitionProps={{ onEntering: handleEntering }}  
      scroll='paper'
      //
      // 220602 - aligns dialog to top and the margin adjusts it closer to the center
      sx={{
        "& .MuiDialog-container": {
          //justifyContent: "flex-start",
          alignItems: 'flex-start',
          marginTop: '12%',
        }
      }}
      // PaperProps={{maxWidth:'400px'}}
    >
      <Alert                    
        // sx={{mt: .5, ml: .5, position: 'absolute', width: '90%', pr: '10%', typography: 'h6', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'normal'}} 
        sx={{p: 2, position: 'absolute', width: '92%', typography: 'h6', textAlign: 'left', fontSize: '1.1rem', fontWeight: 'normal'}} 
        variant='filled' 
        severity='error'        
      >
        Required fields must be completed
      </Alert>        
      <DialogContent sx={{pt: '34%', pb: 5, pl: 6, bgcolor: 'error.main', br: 1.5, color: 'white', maxHeight: 400, overflow: 'auto'}} >        
        {Object.entries(errors).map( ( [field, message] ) => {    
          const fieldConfig = getFieldConfig({apiPath: apiPath, fieldName: field})
          const displayName = field.startsWith('member') || field==='serviceInstructions' ? 
            field
          : fieldConfig?.label ?? field
          return (
            <Box key={field} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p:.25}}>
              <Typography variant="subtitle2" fontWeight='normal' fontSize='1rem' noWrap 
                sx={{textTransform: 'capitalize', width: '86%'}}
              >
                {displayName}
              </Typography>          
            </Box>
          )  
        })}
      </DialogContent>  
      <DialogActions sx={{color: 'white', bgcolor: 'error.main', display: 'flex', justifyContent: 'flex-end'}}>
        <Button onClick={handleClose} variant='text' color='inherit' size='large' sx={{m:1, px:4}}>
          {'OK'}
        </Button>                           
      </DialogActions>  
    </Dialog>    
  )
}

// 220606 - alertfeedback with haserrrors
const AlertFeedbackWithPage = props => {
  // const {stepName} = usePage()
  const [hasErrors, ] = useFormikErrorsWithPage();
  return ( //&& hasErrors
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-end',}}>
      <Zoom       
        in={hasErrors} 
        unmountOnExit={true}
      >
        <Alert 
          severity='error' // severity={(hasErrors&&'error') || 'success'}       
          variant='filled'
          sx={{p: 1, m:'auto', display: 'flex', minWidth: 320, justifyContent: 'center', position: 'absolute', opacity: .94,}} //                       
        >          
          <Typography letterSpacing={0.2} fontWeight='medium' fontSize='18px'>
            Correct the errors below
          </Typography>            
        </Alert>                
      </Zoom>  
    </Box>
  ) 
}  









// 220621 this can be extracted to a custom component
{/* <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start',}}>
  <Zoom       
    in={!!field.value} 
    unmountOnExit={true}
  >
    <Alert 
      severity='success'        
      // variant='contained'
      sx={{p: 0, m:'auto', display: 'flex', minWidth: 320, justifyContent: 'center', position: 'absolute', opacity: 1,}} //                       
    >          
      <Typography variant='subtitle2' fontSize='.9rem'>
        You're all set!
      </Typography>            
    </Alert>                
  </Zoom>  
</Box> */}

// 220604 - alertfeedback with own state using useFormikErrorWithFields
// 220605 - need to troubleshoot this
// const AlertFeedbackWithErrorFieldsAsync = props => {
//   const {stepName} = usePage()
//   const [{fieldErrors=[], hasError}, loading, {setPage, }] = useFormikErrorsWithFieldsAsync(stepName);
//   console.log(`called useFormikErrorWithFields with Page: ${stepName}`)
//   //
//   useEffect(() => {
//     setPage(stepName)
//     console.log(`set useFormikErrorsWithHook to newPage: ${stepName}`)
//   }, [stepName,])

//   const [stay, setStay] = useState(false)
//   useEffect(() => {
//     console.log(`AlertDialog received new data:  stepName: ${stepName},  fieldErrors: ${fieldErrors}`)
//     // 220601 - delay alert closing until validation success
//     setStay( prev => !loading&&hasError ? true : prev );
//     const timeId = setTimeout(() => {      
//       setStay(hasError)
//     }, 1200)
//     return () => {
//       clearTimeout(timeId)
//     }
//   }, [hasError, fieldErrors, stepName])
//   console.log('data in alertdialog', {fieldErrors, hasError})
//   //
//   return (
//     <Zoom in={hasError||stay||true} style={{transitionDelay: hasError ? '0ms' : '0ms', timeout: hasError && 1000,}} >
//       <Alert 
//         sx={{ m:'auto',
//           // visibility: hasError ? 'visible' : 'hidden',
//           display: 'flex', width: '86%', justifyContent: 'center',
//         }}              
//         severity={(loading&&'info') || (hasError&&'error') || 'success'}
//       >
//         <AlertTitle sx={{pt:0.2, pb:0.2}}>{((loading&&'Validating...') || (hasError&&'Please correct the errors below') || 'Success')}</AlertTitle>          
//           <Box sx={{ mx:'auto', px:0.4, pb:1.2, lineHeight:1.4, wordSpacing:4, }}>
//             {fieldErrors.join(', ')}
//           </Box> 
//       </Alert>                
//     </Zoom>   
//   ) 
// }
//
export {
  AlertFeedback,
  AlertDialog,
  AlertFeedbackWithPage,
}
//
export default AlertFeedback
//


// <Box key={k} sx={{fontSize: 18, lineHeight:1.4, wordSpacing:8,}}>
// {`${k}: ${v}`}
// </Box>

// <Grid
// rowSpacing={1}
// justifyContent={'space-between'}
// container 
// pb={2}       
// >     
// <Grid item xs={6} sm={6}>          
//   <Typography variant="subtitle2" color="text.primary">
//     {`${item.user}`}
//   </Typography>
// </Grid>   
// <Grid item xs={6} sm={6}>          
//   <Typography variant="subtitle2" color="text.primary" textAlign="right">
//     {`${statusHistoryDateTimeFormat(item.dateTime)}`}
//   </Typography>
// </Grid> 