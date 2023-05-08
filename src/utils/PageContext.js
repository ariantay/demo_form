// 220530 - PageContext for formikwizard values

import { createContext, useContext, useMemo } from 'react'

const PageContext = createContext();

const PageProvider = ({ children, ...props }) => {
  const { stepNames, stepNumber, furthestStep, apiPath } = props;
  const value = useMemo(
    () => {
      const stepName = stepNames[stepNumber];    
      return {
        stepNames,
        stepNumber,
        furthestStep,
        stepName,
        apiPath,
      }
    }, 
    [stepNames, stepNumber, furthestStep, apiPath]
  )

  return (
    <PageContext.Provider value={value} {...props} >
      {children}
    </PageContext.Provider>
  )
}


const usePage = () => {
  // 220610 - no need to destructure, just return as is
  // const { stepNames, stepNumber, furthestStep, stepName } = useContext(PageContext);
  // return { stepNames, stepNumber, furthestStep, stepName };
  //
  const value = useContext(PageContext)
  return value
}

export { PageProvider, usePage };