//
import { useRef } from 'react';
import { useFormikContext } from 'formik';
// 
// 211015 - can update multiple fields with object
//  https://github.com/formium/formik/issues/581
//
//  when:  formik.values = { key: ...items }, updateValues = { key: ...items }
//
//  call:  setFieldValue( 'key', updateValues )
//
function useFormikHelpers() {
// setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
// setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
  const { setFieldValue, setFieldTouched } = useFormikContext();
  // ref is instance variable
  const helperRef = useRef({});
  // On every render save newest helpers to latestRef
  helperRef.current.setFieldValue = setFieldValue;
  helperRef.current.setFieldTouched = setFieldTouched;  
  // On the first render create new function which will never change
  // but call newest helper function
  if (!helperRef.current.helpers) {
    helperRef.current.helpers = {
      setFieldValue: (...args) => helperRef.current.setFieldValue(...args),
      setFieldTouched: (...args) => helperRef.current.setFieldTouched(...args),      
    };
  }
  return [helperRef.current.helpers.setFieldValue, helperRef.current.helpers.setFieldTouched];
}
//
export { useFormikHelpers };
//