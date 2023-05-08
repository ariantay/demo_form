//
import { useRef, useEffect, useState } from 'react';
// 220603 - switching to use fields stabilized the janky renders
import { useField } from 'formik'
//
import TextField from '@mui/material/TextField';
//
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
//

// 220525 - order of events seem to be:  oninput, onchange, onkeyup

// 220529 - use getFieldProps from PageConfig
import { getFieldProps } from '../utils/FieldsConfig';
// import { getFieldProps } from '../utils/PageConfig';

import { usePage } from '../utils/PageContext'

function FormikField( props ) {
  const { apiPath } = usePage()
  
  const configRef = useRef(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (configRef.current === null) {
      configRef.current = getFieldProps({fieldName: props.name, apiPath})
      setShow(true)
    }    
  }, [props.name, apiPath])
  const { inputMask, ...configProps } = configRef.current ?? {}

  const [field, meta, { setValue, setTouched }] = useField(props.name)
  const showerror = !!meta.error && meta.touched

  return show && (
    <TextField
      {...configProps}
      {...props}
      // {...rest}
      {...field}        
      // 220502 - apply unmask function to onInput 
      onChange={ event => {
        // 220514 - call props.onChange if passed as props (see AddressInfo.serviceZip)
        if ( props.onChange ){
          props.onChange( event )
        }
        setValue( event.target.value, showerror )
      }}      
      error={showerror}
      // 220502 - hide helper text, only show when error && touched. currently showing even on !touched      
      helperText={showerror && meta.error}
      // 220502 - apply input mask to the underlying input value
      value={inputMask ? inputMask(field.value) : field.value}

      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
      //
      // new Date()
      // exhibits legacy undesirable, inconsistent behavior with two-digit year values;
      // specifically, when a new Date() call is given a two-digit year value, 
      // that year value does not get treated as a literal year and used as-is 
      // but instead gets interpreted as a relative offset
      //  — in some cases as an offset from the year 1900, but in other cases, as an offset from the year 2000.
      // 220530 - these fixed the issues with the date input going out of sync when values is out of range
      {... configProps.type==='date' ? ({ 
          onBlur: event => {
            event.target.value = field.value;
            setTouched(true, true);
          }, 
          onKeyUp: event => {
            setValue(event.target.value, false);
          },
        }) 
        : {}
      }
      //         
    />
  )
} 
//
//
function PasswordField ( props ) {
  const [show, setShow] = useState(false)
  //
  return (
    <FormikField
      {...props}      
      // 220511 - setcursor to end onselect, moved to fieldconfig
      //
      // onSelect={ event => {
      //   const { value } = event.target;
      //   event.target.selectionStart=value.length;
      //   event.target.selectionEnd=value.length;
      //   console.log(value)
      // }}
      //
      type={show ? 'text' : 'password'}
      // InputLabelProps={{shrink: true,}}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              onClick={e => setShow(current => !current)}
              onMouseDown={e => e.preventDefault()}
            >
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
} 
//
export { 
  FormikField, 
  PasswordField,
}
//
export default FormikField
//