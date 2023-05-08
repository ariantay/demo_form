import { usePage } from '../utils/PageContext'
// import { TypographySectionTitle, StackFields, StackFieldsRow, FieldSection } from '../components/FieldLayouts';
import { FieldSection } from '../components/FieldLayouts';


const getAccountInfoItems = apiPath => {
  const sectionLabel = apiPath.startsWith('transfer') ? 'Existing Utility Account Information' : 'Utility Account Information'
  const sectionItems = 
    apiPath.endsWith('residential') ?
      [{name:'firstName'}, {name:'lastName'}, {name:'phoneNumber'}, apiPath!=='stopresidential'&&{name:'email'}]
    : apiPath==='stopcommercial' ?
    // 221007 - doingbusinessas added to stopcommercial
      [{name:'businessName'}, {name:'doingBusinessAs'}, {name:'businessOnsitePhone'}]
    : []
  return { label: sectionLabel, items: sectionItems }
}

const ContactInfo = props => {
  const { apiPath } = usePage()
  return(    
    <>            
      {(apiPath.endsWith('commercial') || apiPath==='stopresidential') && //['stopresidential','startcommercial','stopcommercial'].includes(apiPath) && 
        FieldSection({ label: 'Requestor Information', items: [apiPath.endsWith('commercial')&&{name:'requestorRole'}, {name:'requestorFirstName'}, {name:'requestorLastName'}, {name:'requestorPhoneNumber'}, {name:'requestorEmail'}]})       
      }      
      {/* {AccountInfo} */}
      {FieldSection({ ...getAccountInfoItems(apiPath) })}
      {(apiPath.startsWith('start') || apiPath.startsWith('transfer')) && 
        FieldSection({ label: 'Paperless Billing', items: [{name:'paperless', type:'toggle'}]})
      }
      {(apiPath==='startresidential' || apiPath==='transferresidential') && 
        FieldSection({ label: 'Personal Identification', items: [{name:'dateOfBirth'}, {name:'ssn', type:'password'}, {name:'ssnUpload', type:'upload'}, {name:'driverLicenseNumber'}, {name:'driverLicenseState', type:'autocomplete'}, {name:'idUpload', type:'upload'}]})         
      }     
      {apiPath.startsWith('start') && 
        // 221011 - row of multiple fields are in items as arrays
        // FieldSection({ label: 'Previous Address', items: [{name:'previousAddress1'}, {name:'previousAddress2'}, {name:'row1', type: 'row', rowItems:[{name:'previousCity'}, {name:'previousState',type:'autocomplete'}, {name:'previousZip'}]}]})        
        FieldSection({ label: 'Previous Address', items: [{name:'previousAddress1'}, {name:'previousAddress2'}, [{name:'previousCity'}, {name:'previousState',type:'autocomplete'}, {name:'previousZip'}] ]})        
      }
      {(apiPath==='startresidential'||apiPath==='transferresidential') && 
        FieldSection({ label: 'Employment or Source of Income', items: [{name:'employerName'}, {name:'employerPhone'}, {name:'employerCity'}] })         
      }          
    </>
  )     
}
//
export { ContactInfo };
//
export default ContactInfo;
//
