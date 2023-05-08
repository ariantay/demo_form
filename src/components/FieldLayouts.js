import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//
import { UploadButton } from '../components/BaseFields';
import FormikField from '../components/FormikField'
import { PasswordField } from '../components/FormikField'
import FormikAutocomplete from '../components/FormikAutocomplete'
import { FormikToggleButton } from '../components/BaseFields'
//
import { getEnvironmentVariables } from '../utils/EnvironmentVariables';
//

const titleProps = {
  variant: 'h6',
  mt: 4,
}
const subLabelProps = {
  variant: 'subtitle2',
  color: 'primary.dark',
  fontSize: '.84em',
  fontWeight: 400,
  // py: -1, //, spacing: -1,
  my: -1, 
  mx: 2
  
}
const stackFieldsProps = {
  spacing: 3,
  my: 1.5,
}
const stackFieldsRowProps = {
  spacing: 3,
  direction: {xs: 'column', sm: 'row'},
}
const TypographySectionTitle = props => {
  const {sx = {}} = props
  return (
    <Typography {...titleProps} {...sx}>
      {props.children}
    </Typography>  
  )
}
const TypographySubLabel = props => {  
  return props.children && (
    <Typography {...subLabelProps}>
      {props.children}
    </Typography>  
  )
}
const StackFields = props => {
  return (
    <Stack {...stackFieldsProps}>
      {props.children}
    </Stack>  
  )
}
const StackFieldsRow = props => {
  return (
    <Stack {...stackFieldsRowProps}>
      {props.children}
    </Stack>  
  )
}
const GetField = ({ type='', ...props}) => {
  // 221007 - optimize by returning the most common default case first
 return type==='' ?
  <FormikField {...props} />
  : type==='upload' ?
    (!getEnvironmentVariables().isProduction && <UploadButton {...props} />)
  : type==='password' ? 
    <PasswordField {...props} />        
  : type==='autocomplete' ?
    <FormikAutocomplete {...props} />
  : type==='toggle' ?
    <FormikToggleButton {...props} />
  // 221011 - reduce uneccessary checks    
  // : type==='row' ?
  //   null
  :
    null
}
// 221011 - getRow
const GetRow = ({ item }) => {
  return (
    Array.isArray(item) ? 
      <StackFieldsRow children={item.map((e, i) => <GetField key={`${e?.name}${e?.type}${i}`} {...e} />)} />
      : <GetField {...item} />
    // 221011 - need to find css setting to fill parent container when direction is row for below to work
    // <StackFieldsRow>
    //   {Array.isArray(item) ? item.map((e, i) => <GetField key={`${e?.name}${e?.type}${i}`} {...e} />) : <GetField {...item} />}
    // </StackFieldsRow>
  )
}
// 221011 - FieldSection v2, reduce props destructuring, and extra checks
// 221007 - returns a section
const FieldSection = ({ label='', sublabel='', items=[] }) => {
  return label && items.length>0 && (
    <>
      <TypographySectionTitle children={label} />              
        <StackFields>
          <TypographySubLabel children={sublabel} />
          {items.map((item, index) => {
            // 221025 - if item is falsy, ignore the element so it wont be rendered
            // 221025 - TODO: implement a stricter check that allows only objects and arrays
            return item && <GetRow key={`${item?.name}${item?.type}${index}`} item={item} />
          })}
          {/* {items.map((item, index) => {
            return Array.isArray(item) ? 
              <StackFieldsRow children={item.map((e, i) => <GetField key={`${e?.name}${e?.type}${i}`} {...e} />)} />
              : <GetField {...item} />
          })}     */}
        </StackFields>
    </>
  )
}
// 221007 - returns a section
export {
  TypographySectionTitle,
  TypographySubLabel,
  StackFields,
  StackFieldsRow,
  FieldSection,
}
