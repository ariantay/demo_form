
//
import { useRef, useEffect, useState, useCallback } from 'react'
// import { useFormikContext, useField } from 'formik';
import { useFormikContext } from 'formik';
//
//
// import { pendingResolve } from '../utils/HelperFunctions';

function usePageHelpers () {
  const { values, setValues } = useFormikContext();
 
  const pageHelpers = ({
    updateValues: newValuesFn => {
      setValues(newValuesFn(values), true)
    },
    getValues: getFn => getFn(values),
  });
  return pageHelpers;    
}
//
function usePageTouch () {
  const { touched, setTouched } = useFormikContext();
  const updateTouched = newTouchFn => setTouched(newTouchFn(touched), true)
  return { updateTouched };  
}  
//
export {
  usePageHelpers,  
  usePageTouch,
}
