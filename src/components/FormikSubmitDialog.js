
import { memo } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
//
import Backdrop from '@mui/material/Backdrop';
//
import CircularProgress from '@mui/material/CircularProgress';
//
import { useFormikContext } from 'formik';
//

//
const SubmitDialog = memo (function BaseSubmitDialog ({isOpen, isApiError, apiMessage, setResponse, targetURL, ...props}) {

  return (
    <div> 
      {/* <div style={{ padding:8, overflow: "hidden", overflowX: "hidden", }}>     */}
      <Dialog
        open={isOpen}
        // onClose={handleClose} // disableBackdropClick={true}      
        onClose={(event, reason) => reason==='backdropClick'&&null}
        maxWidth='xs'
        fullWidth
        aria-labelledby="submit-dialog-title"
        scroll='paper'
        // fullScreen={true} // fullWidth={true}            
      >      
        <DialogTitle 
          // id="submit-dialog-title" 
          sx={{
            textAlign: 'center',
            // backgroundColor: theme => isApiError ? theme.palette.error.main : theme.palette.success.main,
            bgcolor: isApiError ? 'error.main' : 'success.main',
            color: 'white',
          }}
        >
          {isApiError ? 'SUBMISSION ERROR' : 'APPLICATION RECEIVED'}  
        </DialogTitle>
        <DialogContent dividers>
          <Box         
            sx={{
              whiteSpace: 'pre-line', typography: 'h6', p: 2.5,
              // color: theme => isApiError ? theme.palette.error.dark : theme.palette.success.dark, 
              color: isApiError ? 'error.dark' : 'success.dark',              
            }}
          >        
            {`${apiMessage}`} 
          </Box>
          <Box p={2}/>
        </DialogContent>  
        <Box display='flex' alignItems='row' justifyContent={'flex-end'}p={2} component={(DialogActions)}>        
          <Button 
            disableElevation 
            onClick={e => isApiError ? setResponse(null) : window.location.replace(targetURL)} 
            color={`${isApiError ? 'error' : 'success'}`} 
            variant='contained' 
            size='large'
          >
            {`${isApiError ? 'RETURN TO FORM' : 'COMPLETE'}`}
          </Button>
        </Box>
      </Dialog>    
    </div>    
  )
})
//
function FormikSubmitDialog ( props ){
  const {isSubmitting} = useFormikContext();
  const {apiResponse, setResponse, targetURL} = props;
  return (
    <Backdrop 
        // open={isSubmitting || Boolean(apiResponse)} 
        open={isSubmitting || !!apiResponse} 
        style={{zIndex: 1, color: '#fff',}}
      >        
        {(!!apiResponse && (    //(Boolean(apiResponse)&&(
          <SubmitDialog 
            isOpen={!!apiResponse} 
            // isOpen={Boolean(apiResponse)} 
            // isApiError={Boolean(apiResponse?.defaultError)} 
            isApiError={!!apiResponse?.defaultError} 
            apiMessage={(!apiResponse&&'Error retrieving apiResponse') || apiResponse.defaultError || apiResponse.successMessage}
            setResponse={setResponse}
            targetURL={targetURL} 
          />
        ))||(
          <CircularProgress color="inherit" />
        )}                
    </Backdrop>
  )
}
//
export {FormikSubmitDialog};
//
export default FormikSubmitDialog;
//