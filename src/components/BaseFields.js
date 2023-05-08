



import { useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import DoneIcon from '@mui/icons-material/Done';
// import CloseIcon from '@mui/icons-material/Close';
//
import { useField } from 'formik'
import { getFieldProps } from '../utils/FieldsConfig'
import { usePage } from '../utils/PageContext'
// import Zoom from '@mui/material/Zoom';
// import Alert from '@mui/material/Alert';


const FormikToggleButton = props => {
  const { apiPath } = usePage()
  const configProps = getFieldProps({fieldName: props.name, apiPath})
  const [field, meta, helpers] = useField(props.name)  
  const { onChange, ...rest } = props
  const showerror = !!meta.error && meta.touched
  return(
    <Box sx={{padding: 2, borderRadius: 1, backgroundColor: 'grey.100'}} >        
      <Card               
        sx={{borderColor: theme => (showerror&&theme.palette.error.main+'80') || 'grey.300'}}        
        variant='outlined'        
      >
        <CardContent>                            
          <Typography p={1} color={showerror ? 'error.main' : 'text.primary'}>                  
            {`${configProps.label} ${configProps.required ? '*' : ''}`} 
          </Typography>          
          <Button                         
            {...rest}    
            sx={{m: 1}}        
            variant={!!field.value ? 'contained' : 'outlined'}
            color={!!field.value ? 'success' : 'primary'}                      
            onClick={event => {
              if (props.onChange){
                props.onChange(!field.value)
              }
              helpers.setValue(!field.value, showerror)
            }}   
            endIcon={!!field.value && <DoneIcon />}             
            children={!!field.value ? 'Successfuly Enrolled' : 'Click to enroll'}             
          />                  
        </CardContent>
      </Card>         
    </Box>       
  )
}

//210105 - base input, memoized
const InputCheckbox = ({ onChange: fieldOnChange, error, helperText, ...props }) => (  
  <Box sx={{p: 1.4, borderRadius: 1.5, backgroundColor: 'grey.100',}} >        
    <FormControl disabled={Boolean(props.disabled)} error={error}>
      <FormControlLabel
        label={
          <Typography 
            variant="body1" color="textPrimary" 
            fontSize={18} // fontWeight={400}
            // 220929 - reduce px if label.length > 40, consider using {xs: 2, md: 3}  
            textAlign="right" px={props.label.length>40 ? 3 : 5} // pl={4} pr={4}
          >
            {props.label}
          </Typography>
        }
        // label={props.label}
        control={
          <Checkbox
            {...props}
            // 220929 - reduce px
            sx={{px: 3}}   
            color={props.color}
            id={props.name}
            // 211006 - difference between ?? and || is that ?? is only for underfined and null
            checked={props.checked??false}
            onChange={e => fieldOnChange(e.target.checked)}      
            disabled={Boolean(props.disabled)}                
          >
          </Checkbox>
        }
      >      
      </FormControlLabel>               
      <FormHelperText>
        {helperText}
      </FormHelperText>
    </FormControl>
  </Box>
)


//
//Added Checkbox for regular use
const FormikCheckbox = props => {
  const { apiPath } = usePage();
  const configProps = getFieldProps({fieldName: props.name, apiPath});
  //console.log('MyCheckboxIsBillingAddressSame',props.name);
  const [field, meta, helpers] = useField(props.name);
  //  
  const { onChange, ...rest } = props;
  //
  return(     
    <InputCheckbox             
      {...field} 
      {...rest}
      checked={!!field.value}
      // 220530 - ** not spreading configProps until its cleaned up of undefineds attributes **
      label={configProps?.label}
      required={configProps?.required}
      onChange={ checked => {
        if( props.onChange ){
          props.onChange( checked )
        } 
        helpers.setValue( checked )       
      }}   
      error={!!meta.error && meta.touched}
      helperText={(!!meta.error && meta.touched) && meta.error}             
    />          
  )
} 

function UploadButton ( props ) {
  const { apiPath } = usePage();
  const configProps = getFieldProps({fieldName: props.name, apiPath});
  const inputRef = useRef(null);
  const[field,meta,helpers] = useField(props.name);

  const handleChange = e => { 
    const file  =  e.currentTarget?.files[0];
    if (file && file.size<1024*1024*10){  
      helpers.setValue(file);
    }else{
      alert(`\nInvalid selection; files must be smaller than 10 MB\n`);      
    }
  }
  
  const handleClick = (e) => {        
    helpers.setTouched(false);
    helpers.setValue(meta.initialValue);
    //210304 - set html input to empty otherwise onchange wont trigger
    if (inputRef && inputRef.current) {
      inputRef.current.value = []
    }    
    inputRef.current?.click();
  }

  return (
    <div>
      <input        
        ref={inputRef} 
        name={props.name}
        id={props.name}
        accept={'.doc, .docx, .jpg, .jpeg, .pdf, .png'}
        type="file"
        hidden
        onChange={handleChange}        
      />
      <Box sx={{padding: 2, borderRadius: 1, backgroundColor: 'grey.100'}} >        
      <Card       
        // 211006 - add 2 digit hex to mui colors to determine opacity, or use @mui/styles.alpha
        sx={{
          borderColor: theme => (!!meta.error&&meta.touched&&theme.palette.error.main+'80') || 'grey.300',          
          //borderColor: (Boolean(meta.error)&&meta.touched&&'error.main'+'50')  || 'grey.300',
        }}
        variant='outlined'        
      >
        <CardContent>
          <Box sx={{
            color: (!!meta.error&&meta.touched &&'error.main') || 'text.primary',
            typography: 'body1',
            p: 1,
          }}>          
            { `${configProps.label} ${configProps.required ? '*' : ''}` }         
          </Box>
          
          <Button    
            sx={{m: 1}}    
            disableElevation  
            variant='contained'            
            color={(field.value&&'primary')||'secondary'}            
            endIcon={(field.value&&<SaveIcon />)||<CloudUploadIcon />} 
            onClick={handleClick}            
          >
            {(field.value&&field.value.name)||'Upload File'}            
          </Button>
        </CardContent>
      </Card>         
      </Box>  
    </div>
  );
} 

export {
  FormikCheckbox,
  // ControlCheckbox,
  UploadButton,
  FormikToggleButton,
  // ErrorField,
}  
//
