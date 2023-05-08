
import { 
  // useState, 
  // useEffect,
  useMemo,
  // memo,
  // useRef,
} from 'react';
// import { differenceInYears, parseISO, } from 'date-fns';
//
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ErrorIcon from '@mui/icons-material/Error';
import CheckIcon from '@mui/icons-material/Check';
//
import { memberFields, memberIds } from '../utils/AppConfig'
//
import { getFileInputs } from '../utils/FieldsConfig';
//
import { useFormikErrors } from '../utils/PageHooks' // useFormikErrorsWithFields 

function RenderStatusIcon ( params ){
  // 220602 - memoize the error fields
  const memberField = useMemo(() => [...getFileInputs(), ...memberFields].map( field => `${memberIds[params?.id]}${field}`), [params?.id] )
  const [hasErrors,] = useFormikErrors('', memberField)
  return (
    <IconButton>
      {/* {(fieldErrors?.length>0 && <ErrorIcon color='error' />) || <CheckIcon color='success' />} */}
      {(hasErrors && <ErrorIcon color='error' />) || <CheckIcon color='success' />}
    </IconButton>
  )
}
//
function renderEditIcon (params){
  return (
    <IconButton disabled={params?.id===0}>    
      {(params?.id>0 && <EditIcon color='primary' />) || <AccountCircleIcon/>}
    </IconButton> 
    // <IconButton disabled={params?.id===''}>    
    //   {(params?.id==='' && <AccountCircleIcon/>) || <EditIcon color='primary' />}
    // </IconButton> 
  )
}
//
function nameValueGetter (params){
  return `${params.row.firstName} ${params.row.lastName}`;
}
//
function relationValueGetter (params){
  return `${params.row.relation}`;
}
//
function getColumns(){
  return (
    [
      { 
        field: 'ID', headerName: 'Edit', sortable: false, width: 80, 
        renderCell : renderEditIcon,
      },
      {
        field: 'fullName', headerName: 'Full name', sortable: false, flex: 1.4, //width: 160, //description: 'This column has a value getter and is not sortable.',        
        disableClickEventBubbling: true,        
        valueGetter: nameValueGetter,
      },
      {
        field: 'Relation',
        headerName: 'Relation to Owner',
        flex: 1.2,
        //width: 160,
        sortable: false,
        disableClickEventBubbling: true,   
        valueGetter: relationValueGetter,     
      },
      { 
        field: 'memberStatus', headerName: 'Status', sortable: false, width: 80, // flex: 1.0,
        renderCell: RenderStatusIcon,
      },
    ]
  )
}
//
export default getColumns;