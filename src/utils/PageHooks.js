//
import { useEffect, useState, useRef, useMemo, } from 'react';
//
import debounce from 'lodash.debounce';
import { useFormikContext } from 'formik';
import { getPageConfig } from '../utils/PageConfig';
//
import { usePage } from '../utils/PageContext';
const FormStepLogger = props => {
  const { stepName } = usePage()
  const stepRef = useRef('')
  const { pageLabel='', pageFields=[] } = getPageConfig( stepName );
  const fns = {
    logKeys: values => console.log( Object.keys(values)??['no keys'] ),
    logObject: values => console.log(values),
    logFilteredKeys: values => console.log( Object.keys(values)??[].filter(e => pageFields.includes(e)) ),
  };  
  const setupFns = { 
    Introduction: [fns.logKeys, fns.logObject],
    AddressInfo: [fns.logFilteredKeys, (() => console.log(pageLabel, pageFields))], 
    ContactInfo: [fns.logFilteredKeys, fns.logObject, (() => console.log(pageLabel, pageFields))],
  };
  // const setFns = useFormikStepHelper( setupFns, );
  console.log('called useFormikStepHelper with ', setupFns)
  useEffect(() => {
    stepRef.current = stepName
    console.log('stepRef value should be one behind',stepRef.current, stepName)
  }, [stepName])
  return null
}
//
const useFormikStepHelper = ( initialFns={}, cleanupFns={}, ) => {
  const { stepName } = usePage()
  // const currentStep = stepNames[ stepNumber ]
  const { values, setValues } = useFormikContext()
  const [fns, setFns] = useState([]);
  // const [args, setArgs] = useState()
  const fnsRef = useRef({}); 
  useEffect(() => {
    fnsRef.current = initialFns
  },[])
  //
  useEffect(() => {
    setFns((fnsRef.current && fnsRef.current[stepName]) ?? [])
  },[stepName])
  // 
  useEffect(() => {
    let active = true;
    console.log(`in useFormikStepHelper with   stepname: ${stepName}, fns: `, fns);
    [...fns].forEach(fn => fn && fn(values));
    return (() => active = false)    
  }, [stepName, fns, values, setValues, ]) //args
  return setFns //setArgs
}
//
// 220606 - does not update with fields/step 
// 220604 - hook for returning the error state from formik context
const useFormikErrors = ( page='', fields=[], ) => {
  const { apiPath } = usePage()
  const { pageLabel = page, pageFields = fields } = getPageConfig({pageName: page, apiPath});
  const [ hasErrors, setHasErrors ] = useState(false)
  const { errors, touched } = useFormikContext()

  // 220608 - try using debounce 
  const debouncedSetErrors = useMemo(
    () => debounce(setHasErrors, 400)
  , [apiPath, pageLabel, pageFields]);

  useEffect(() => {
    return(() => debouncedSetErrors.cancel())
  },[debouncedSetErrors])

  useEffect(() => {
    let active = true
    const hasErrors = pageFields.some( field => field in errors && field in touched )
    if (active) {
      // setHasErrors(hasErrors)
      debouncedSetErrors(hasErrors)
    }
    return (() => active = false)
  },[errors, touched])

  return [hasErrors, {pageLabel, pageFields,}]
}
//
// 220606 - updates with pagecontext - formikerrors with pages/fields
const useFormikErrorsWithPage = () => {
  const { stepName, apiPath } = usePage()
  const [page, setPage] = useState({pageLabel: '', pageFields: []})
  useEffect(() => {
    const { pageLabel = stepName, pageFields = [] } = getPageConfig({pageName: [stepName], apiPath});
    setPage({pageLabel, pageFields})
  },[stepName, apiPath])

  const [ hasErrors, setHasErrors ] = useState(false)

  // 220608 - try using debounce 
  const debouncedSetErrors = useMemo(
    () => debounce(setHasErrors, 280)
  , [stepName, apiPath, page.pageFields, setHasErrors]);
  // 220608 - discard after unmount
  useEffect(() => {
    return(() => debouncedSetErrors.cancel())
  },[debouncedSetErrors])
  //

  const { errors, touched } = useFormikContext()
  useEffect(() => {
    let active = true
    const hasErrors = page.pageFields.some( field => field in errors && field in touched )
    if (active) {
      // setHasErrors(hasErrors)
      debouncedSetErrors(hasErrors)
    }
    return (() => active = false)
  },[errors, touched, page.pageFields])

  return [hasErrors, page]
}
// //
export { 
  useFormikErrors,
  useFormikErrorsWithPage,
  // useFormikErrorsWithFields,
  useFormikStepHelper,  
  FormStepLogger,  
}
