//
import { useMemo, useState, useCallback, useEffect } from 'react';
import MemberGrid from '../components/MemberGrid';
import { MemberDialog } from './MemberDialog';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
import { usePageHelpers, } from '../utils/FormikHooks';
import getColumns from '../utils/MemberGridHelper';
import { getRows, findAvailableRow } from '../utils/HouseHoldInfoHelper';


const HouseHoldInfo = props => {
  // const { getValues, updateValues } = usePageHelpers()
  const { getValues } = usePageHelpers()
  const columns = useMemo(
    () => getColumns(),
    []
  )
  const [rows, setRows] = useState([])
  const [nextid, setNextid] = useState(0)
  const [rowid, setid] = useState(0)
  const [isOpen, setOpen] = useState(false)
  useEffect(() => {
    if (!isOpen){
      setRows(getValues(getRows));  
      setNextid(getValues(findAvailableRow));    
    }    
  }, [isOpen])

  const handleAdd = useCallback(() => {        
    setid(nextid);
    setOpen(true)
  },[nextid]); // updateTouched

  const handleOpen = useCallback(id => {
    setid(id)
    setOpen(id>0)
  },[]);

  const handleClose = useCallback(newValues => {           
    setOpen(false);    
    // setUpdateObject(newValues)
  },[]);
  // console.log('page')
  return(
    <Box>       
      <Box p={2}/>
      <Button 
        sx={{my: 2}}
        color='primary' 
        onClick={handleAdd} 
        children={`Add Member`}
      />
      <MemberGrid 
        columns={columns}// columns={getColumns()} 
        rows={rows} 
        handleOpen={handleOpen} // handleAdd={handleAdd}
      />         
      <MemberDialog 
        isOpen={isOpen} 
        memberIndex={rowid}
        handleClose={handleClose}
      />
    </Box >
  )     
}
export {HouseHoldInfo};
//
export default HouseHoldInfo;
//
