//
import { useEffect } from 'react';
import { useField } from 'formik';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormikAutocomplete from '../components/FormikAutocomplete';
import { usePageHelpers, usePageTouch, } from '../utils/FormikHooks';
// import { usePageTouch } from '../utils/FormikHooks';
import { getMemberResetObject, getTouchFields } from '../utils/HouseHoldInfoHelper';
import { FormikField, PasswordField } from '../components/FormikField';
import { memberIds } from '../utils/AppConfig' //memberFields, 
import { TypographySectionTitle, StackFields } from '../components/FieldLayouts' //TypographySubLabel,

const MemberDialog = ({isOpen, handleClose, memberIndex}) => {  
  const prefix = memberIds[memberIndex];
  const maxCount = memberIds.length - 1;
  const invalidIndex = memberIndex>maxCount || memberIndex<0
  const [{value: exists},] = useField(`${prefix}exists`); 
  const { updateValues } = usePageHelpers();
  const { updateTouched } = usePageTouch();

  const handleCancel = event => {
    const updateObject = exists ? {[`${prefix}exists`]: exists} : getMemberResetObject(memberIndex);
    // updateValues(values => ({...values, ...updateObject}));    
    if (!exists){
      updateValues(values => ({...values, ...updateObject}));
    }
    handleClose(updateObject)
  }
  const handleAdd = event => {  
    const updateObject = {[`${prefix}exists`]: true}
    updateValues(values => ({...values, ...updateObject}));
    handleClose(updateObject)    
  }  
  const handleDelete = event => {  
    const updateObject = getMemberResetObject(memberIndex)
    updateValues(values => ({...values, ...updateObject}))
    handleClose(updateObject) 
  }
    
  useEffect(() => {    
    if (!exists && isOpen){
      updateTouched(getTouchFields(memberIndex))
    }
  }, [memberIndex])
  
  return (
    <Dialog
      open={isOpen}      
      onClose={(event, reason) => { 
        // if (!!invalidIndex){
        //   handleClose()
        // }    
        // possible reason codes: escapeKeyDown, backdropClick
        if (reason==='backdropClick' || reason==='escapeKeyDown') { return null; }              
      }}   
      fullWidth   
      maxWidth='xs'
      // aria-labelledby="form-dialog-title"
      scroll='paper'         
    >    
    {invalidIndex ? 
      <Box
        onClick={handleClose} 
        sx={{typography: 'h6', textAlign: 'center', color: 'white', bgcolor: 'error.main', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4}}
      >
        Only 3 additional Applicants may be added to an Account
      </Box>
    : (   
      <>

        <DialogTitle >   
          {`Member${memberIndex} Details`} 
        </DialogTitle>

        <DialogContent dividers>      
          <form autoComplete="off" noValidate>                 
            <TypographySectionTitle sx={{mt: 1}}>
              {`Relation to Account Owner`}
            </TypographySectionTitle>
            <StackFields>
              <FormikField name={`${prefix}relation`} />               
            </StackFields>

            <TypographySectionTitle>
            {`Contact Info`}
            </TypographySectionTitle>
            <StackFields>
              <FormikField name={`${prefix}firstName`} />      
              <FormikField name={`${prefix}lastName`} />      
              <FormikField name={`${prefix}email`} />      
              <FormikField name={`${prefix}phoneNumber`} />     
            </StackFields>         
        
            <TypographySectionTitle>
            {`Personal Identification`}
            </TypographySectionTitle>
            <StackFields>
              <FormikField name={`${prefix}dateOfBirth`} />        
              <PasswordField name={`${prefix}ssn`} /> 
              <FormikField name={`${prefix}driverLicenseNumber`} /> 
              <FormikAutocomplete name={`${prefix}driverLicenseState`} />         
            </StackFields>

            <TypographySectionTitle>
              {`Employment`}
            </TypographySectionTitle>
            <StackFields>
              <FormikField name={`${prefix}employerName`} />
              <FormikField name={`${prefix}employerPhone`} />
              <FormikField name={`${prefix}employerCity`} />
            </StackFields>
          </form>   
        </DialogContent>      

      </> 
    )}

    <DialogActions sx={{color: 'white', bgcolor: invalidIndex ? 'error.main' : 'background.default', display: 'flex', justifyContent: invalidIndex ? 'flex-end' : 'space-between'}}>
      <Button onClick={handleCancel} variant={invalidIndex ? 'text' : 'outlined'} color={invalidIndex ? 'inherit' : 'primary'} size='large' sx={{m: 1, px: exists ? 4 : 3}}>
        {exists ? 'Done' : 'Cancel'}
      </Button>    
      {invalidIndex ? 
        null 
      : exists ? 
        <Button onClick={handleDelete} color='error' size='large' sx={{m: 1}}>
          Delete
        </Button>                
      : 
        <Button onClick={handleAdd} color='success' size='large' sx={{m: 1, px: 5}}>
          Add
        </Button>
      }                
    </DialogActions>

  </Dialog>    
)}    
//
export { MemberDialog };
// export default memo(MemberDialog);
export default MemberDialog;
//
//
