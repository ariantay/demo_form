import { FormikConsumer } from 'formik';
//
// 211007 test
// import { 
//   getDebugFormData,
//   // 220502 - nvm not exported
//   // getProps, 
// } from '../utils/SubmitFunctions';
//
// 220501 - TODO:  fix getMappingFn to export from SubmitFunctions 
// import { getMappingFn } from '../utils/SubmitFunctions';
//
// 220510 - test getHouseMemberArray
// import { getHouseMemberArray } from '../utils/AppConfig';
import { getProps } from '../utils/AppConfig';
import { appConfigs } from '../utils/AppConfig';
// 220524 - getFormData format submitted to api
import { getFormData } from '../utils/AppConfig';
// 220512 - use pathname
import { useLocation } from 'react-router-dom';
//

const FormikDebug = props => {
  const { pathname } = useLocation();
  const config = appConfigs[ pathname ];
  // console.log(location.pathname, config)  
  return (
    <div
      style={{
        margin: '3rem 1rem',
        borderRadius: 4,
        background: '#f6f8fa',
        boxShadow: '0 0 1px  #eee inset',
      }}
    >
      <div
        style={{
          textTransform: 'uppercase',
          fontSize: 11,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 500,
          padding: '.5rem',
          background: '#555',
          color: '#fff',
          letterSpacing: '1px',
        }}
      >
        Formik State
      </div>
      <FormikConsumer>    
        { ({ values, errors, touched, initialValues, ...rest }) => {
          //
          const formData = getFormData( values, config?.apiPath );
          //
          let fdata = {};
          // let files = [];
          for (let pair of formData.entries()){
            // console.log(`${pair[0]}: ${pair[0]==='files' ? pair[1]?.name : pair[1]}`);
            // fdata[`${pair[0]}_${pair[1]?.name?.slice(0,pair[1]?.name?.indexOf('_'))}`] = pair[0]==='files' ? pair[1]?.name : JSON.parse(pair[1]);
            if (pair[0]==='files') {
              (fdata[pair[0]] = fdata[pair[0]] || []).push(pair[1]?.name);
            } else {
              fdata[pair[0]] = JSON.parse(pair[1]);
            }
          }
          //
          // let fdata = Object.fromEntries(
          // fdata = Object.fromEntries(
          //   Array.from(formData.keys()).map(key => [
          //     key, 
          //     key==='files' ? formData.getAll(key).forEach(item => item?.name ?? item) : formData.getAll(key)
          //     // formData.getAll(key).length > 1 ? formData.getAll(key).forEach(item => key==='files' ? item?.name : item) : formData.get(key)?.name ?? formData.get(key)
          // //       // key === 'files' ?
          // //       // formData.getAll(key).length > 1 ? formData.getAll(key).forEach(file => file?.name) : formData.get(key)?.name
          // //       // : formData.getAll(key).length > 1 ? formData.getAll(key) : formData.get(key)          
          // //       //
          //   ]).map(([key, value]) => [key, value])            
          // )
          //
          // console.log(fdata)
          //          
          // fdata = Object.fromEntries(formData.entries());
          //
          return (
            <pre
              style={{
                fontSize: '.85rem',
                padding: '.25rem .5rem',
                overflowX: 'scroll',
              }}
            >
              {                
                JSON.stringify({...props, fdata, errors, touched, values: { ...values, ...getProps( values, config?.keys )}}, null, 2)
                //
                // 220501 - TODO:  fix getMappingFn to export from SubmitFunctions 
                // JSON.stringify({...props, errors, touched, initialValues, values: {...getDebugFormData(values)}}, null, 2)
                // 220501 tests
                // JSON.stringify({ values: {...getProps(values, inlineKeys)}, errors, ...props }, null, 2)
                //
                // 220427 - show all values
                //JSON.stringify({...props, errors, touched, values}, null, 2)            
              }          
            </pre>
          )
        }}
      </FormikConsumer>
    </div>
  )
};
//
export {
  FormikDebug,
}
//
export default FormikDebug
//
