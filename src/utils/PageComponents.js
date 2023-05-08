//
import ContactInfo from '../pages/ContactInfo';
import AddressInfo from '../pages/AddressInfo';
import HouseHoldInfo from '../pages/HouseHoldInfo';
//
import ReviewEntries from '../pages/ReviewEntries';
// 220228 - default not found page
import PageNotFound from '../pages/PageNotFound';
//
// 220228 - business
//
import BusinessInfo from '../pages/BusinessInfo'
import { usePage } from '../utils/PageContext'
//210122 - export component functions
const pageComponents = {  
  'ContactInfo': ContactInfo,
  'AddressInfo': AddressInfo,
  'HouseHoldInfo': HouseHoldInfo,  
  'ReviewEntries': ReviewEntries,
// 220228 - business
  'BusinessInfo' : BusinessInfo,
  'PageNotFound' : PageNotFound,  
}
//
const getPageComponents = ( name='' ) => {
  return ( name && name in pageComponents ) ? pageComponents[ name ] : PageNotFound
}
// 220530 - update to use context
// 220525 - have pageComponents exported as component
const FormikPage = props => {
  const { stepName } = usePage()
  const PageComponent = pageComponents[ stepName ] ?? PageNotFound;
  // 
  return (
    <PageComponent stepName={ stepName } {...props} />    
  )
}
//
export { 
  pageComponents,
  getPageComponents,
  FormikPage,
}
//
// export default getPageComponents
export default pageComponents;
//