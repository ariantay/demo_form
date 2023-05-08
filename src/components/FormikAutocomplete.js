/* eslint-disable @typescript-eslint/no-use-before-define */
import { 
  // useRef, 
  // memo, 
  useState, 
  useEffect 
} from 'react';
//
// import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
//
// import { createFilterOptions } from '@mui/material/Autocomplete';
//
import Box from '@mui/material/Box';
//
// import { useField } from 'formik'; 
//
// import { MyField } from './BaseFields';
//
// 220604 - formik more performand and consistent
import  { useField }  from 'formik'
// import { useFieldFast } from '../utils/FormikHooks'
//
// 220530 - usepagecontext to get stepname
import { usePage } from '../utils/PageContext'
// 220530 - get configprops from pageconfig
// import { getFieldProps } from '../utils/PageConfig';
import { getFieldProps } from '../utils/FieldsConfig'
//
// import { usePageHelpers } from '../utils/FormikHooks'
//

// https://mui.com/api/autocomplete/
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const statesByPostalCode = [
  { label: 'Alabama', code: 'AL' },
  { label: 'Alaska', code: 'AK' },
  { label: 'Arizona', code: 'AZ' },
  { label: 'Arkansas', code: 'AR' },
  { label: 'California', code: 'CA' },
  { label: 'Colorado', code: 'CO' },
  { label: 'Connecticut', code: 'CT' },
  { label: 'Delaware', code: 'DE' },
  { label: 'Florida', code: 'FL' },
  { label: 'Georgia', code: 'GA' },
  { label: 'Hawaii', code: 'HI' },
  { label: 'Idaho', code: 'ID' },
  { label: 'Illinois', code: 'IL' },
  { label: 'Indiana', code: 'IN' },
  { label: 'Iowa', code: 'IA' },
  { label: 'Kansas', code: 'KS' },
  { label: 'Kentucky', code: 'KY' },
  { label: 'Louisiana', code: 'LA' },
  { label: 'Maine', code: 'ME' },
  { label: 'Maryland', code: 'MD' },
  { label: 'Massachusetts', code: 'MA' },
  { label: 'Michigan', code: 'MI' },
  { label: 'Minnesota', code: 'MN' },
  { label: 'Mississippi', code: 'MS' },
  { label: 'Missouri', code: 'MO' },
  { label: 'Montana', code: 'MT' },
  { label: 'Nebraska', code: 'NE' },
  { label: 'Nevada', code: 'NV' },
  { label: 'New Hampshire', code: 'NH' },
  { label: 'New Jersey', code: 'NJ' },
  { label: 'New Mexico', code: 'NM' },
  { label: 'New York', code: 'NY' },
  { label: 'North Carolina', code: 'NC' },
  { label: 'North Dakota', code: 'ND' },
  { label: 'Ohio', code: 'OH' },
  { label: 'Oklahoma', code: 'OK' },
  { label: 'Oregon', code: 'OR' },
  { label: 'Pennsylvania', code: 'PA' },
  { label: 'Rhode Island', code: 'RI' },
  { label: 'South Carolina', code: 'SC' },
  { label: 'South Dakota', code: 'SD' },
  { label: 'Tennessee', code: 'TN' },
  { label: 'Texas', code: 'TX' },
  { label: 'Utah', code: 'UT' },
  { label: 'Vermont', code: 'VT' },
  { label: 'Virginia', code: 'VA' },
  { label: 'Washington', code: 'WA' },
  { label: 'West Virginia', code: 'WV' },
  { label: 'Wisconsin', code: 'WI' },
  { label: 'Wyoming', code: 'WY' },
];
// export {states};

const FormikAutocomplete = props => {   

  const { apiPath } = usePage()
  const [field, {error, touched}, {setValue, setTouched}] = useField(props.name);    
  const configProps = getFieldProps({ fieldName: props.name, apiPath })

  const [open, setOpen] = useState(false)
  const [ inputValue, setInputValue ] = useState('');

  // 220621 - USEEFFECT TO SETTOUCHED 
  //      to update formik.error state when autocomplete.blurOnSelect is true
  useEffect(() => {
    if (!!field.value) {
      setTouched(true)
    }
  },[field.value])
  
  // 220607 - filteroptions updated with startwith
  // const filterOptions = createFilterOptions({
  //   matchFrom: 'any',
  //   // matchFrom: 'start',
  //   stringify: option => `${option.code} ${option.label}`,
  //   trim: true,
  //   ignoreCase: true,
  //   ignoreAccents: true,
  // })
  //
  const filterOptions = (options, {inputValue}) => {
    return options.filter(option => {
      return option.code.startsWith(inputValue.toUpperCase()) || option.label.toUpperCase().startsWith(inputValue.toUpperCase())
    })
  }
  //
  
  return (
    <Autocomplete
      {...props}
      {...field} 
      fullWidth     
      autoHighlight
      // 220530 - our us states obj      
      options={statesByPostalCode}
      //
      // 220607 - prevent input from opening when browser autofilled
      //      control open state, if open is requested and we dont have the current focus, ignore
      open={open}
      onOpen={event => {
        // console.log('onOpen', event)
        // 220607 - dont open unless input is focused
        // console.log(`selfid: ${event.target.id},  focusedid: ${document.activeElement.id}`)               
        // 220607 - when autofilled, onOpen is called with onChange
        // if (event.target.id!==document.activeElement.id) {
        //   // setOpen(false)
        //   event.preventDefault()
        // }
        // // 220607 - when input is clicked, autofill option will steal focus after open event.
        // //      dont allow open onclick
        if (event.type==='mousedown') {
          // console.log('ON MOUSEDOWN')
          // setOpen(false)
          // event.preventDefault()
          event.defaultMuiPrevented = true;
          // setOpen(false)
          // return
        }else{
          //
          setOpen(true)
        }
      }}
      // autoSelect
      // 220608 - bluronselect causes issues with validation state not being updated
      //      possibly due to some sort of race condition between formik state and mui state during transition
      blurOnSelect
      selectOnFocus
      openOnFocus={false}
      // clearOnBlur
      // clearOnEscape
      disabled={props.disabled}
      // 220530
      onClose={ event => {
        // console.log('onclose', event)
        // 220607 - lets use to setValue based on inputValue


        // if (!!field.value || typeof field.value !== 'string' || (error&&field.value) ) {
        //   setValue('') // setInputValue('')
        // }
        //
        // 220607 - if field.value was set to object, onclose won't even be called 
        // if (typeof field.value !== 'string') {
        //   setValue('')
        // }
        //
        // setInputValue(!!field.value ? inputValue : '')
        // setTouched(true,false)
        setOpen(false)
        // updateTouched( touched => touched )
        // 220531 - so far behavior is consistent with no additional touch required. 
        // 220531 - the consistency issues seen before was likely due to excessive state updates
        // setTouched(true, true)
      }}
      // autoComplete
      // autoHighlight      
      // 220530 got the warning mui popper to stop
      // disablePortal
      //      
      // getOptionLabel={(option) => `${option.code} - ${option.label}`}
      getOptionLabel={option => option.code ?? option}
      // getOptionLabel={option => option.code}
      renderOption={(props, option) => (
        <Box 
          sx={{ m:0, p:0, }}           
          {...props}
          component={'li'}
          children={`${option.code} - ${option.label}`}
        />         
      )}
      // 220607 - try startwith
      // filterOptions={(options, { inputValue }) => options.filter(option => option.code.startsWith(inputValue.toUpperCase()) || option.label.toUpperCase().startsWith(inputValue.toUpperCase()))}
      filterOptions={filterOptions}
      // 210817
      // getOptionSelected={(options,v) => options.code==v || v==''}
      // getOptionLabel={(option,v) => option.code || ''}
      // 220607 - this is for the popup option
      onChange={(event, value) => {
        // console.log('onCHANGE', event, value)
        setValue((!!value&&value.code) || '');
        // setValue((!!value&&value.code) || value || '' );
        // setTouched(true, true);
      }}
      // isOptionEqualToValue={(option, value) => option.code===value || option.label.toUpperCase()===value || value==='' }
      isOptionEqualToValue={(option, value) => option.code===value || value==='' }
      // 220607 - this is for the textbox search
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        // console.log('oninput', event, newInputValue) 
        // 220621 - JUST USE USEFFECT
        // 220621 - call settouched if blurOnSelect attribute is true
        //        the mui blur has a blur event, then immediately a null event
        //        call set touched on the null event
        // if (!event){
        //   setTouched(true)
        // }     
        // 220621 - if the option is opened manually, the null event isnt fired
        //        only the onlclick is fired
        //        ** doesn't work **
        // if (event?.type==='click' && !!newInputValue){
        //   setTouched(true, true)
        // }        
        //
        // 220607 - oninput from browser autofill doesn't have nativeEvent.data
        //        event.nativeEvent.data can be null or false, we need to specifically check for undefined
        if (event?.type==='change' && event?.nativeEvent?.type==='input' && event?.nativeEvent?.data===undefined) {
          // console.log(newInputValue) 
          // setOpen(false)
          // setInputValue(newInputValue.trimStart())
          //
          // setOpen(false)          
          setValue(statesByPostalCode.find(item => item.code===(!!newInputValue&&newInputValue.toUpperCase()) || item.label.toUpperCase()===newInputValue)?.code ?? '')
          // setValue(states[2])
          //

          // event.preventDefault();
          // event.defaultMuiPrevented = true;
        } else {
          // 220607 - event is null if input is changed from outside input scope
          setOpen(!!event && event?.type!=='blur' && !!newInputValue)        
          setInputValue(newInputValue.trimStart())
        }

      }}      
      // 220530 - some goes here some goes to the renderinput :/
      //
      // error={props.error}
      // inputValue={field.value}
      //sx={{ width: 300 }}
      // 220427 - add required
      // required={props.required}
      renderInput={ params => (
        <TextField 
          {...params} 
          {...props}
          // 220530 - ** spreading field.value here will set the value **
          // 220530 - theres nothing we want to pass on in field anyways
          // {...field}
          //
          // 220530 - TODO fix the config props to not have undefined
          // {...configProps}
          //
          autoComplete={configProps.autoComplete}
          label={configProps.label}
          required={configProps.required}
          error={!!error && touched} 
          helperText={!!error && touched && error}
          // onBlur={props.onBlur}           
          // helperText={props.helperText} 
          // label={props.label} 
          // variant={props.variant||'filled'} 
          // autoComplete={props.autoComplete||'new-password'} 
          // required={props.required} 
        />
      )} // disabled={props.disabled}
    />
  )
} 

//
export {
  FormikAutocomplete,
  // StatesSelect,
}
//
export default FormikAutocomplete
//
