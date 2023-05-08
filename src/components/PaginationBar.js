// import * as React from 'react';
import {
  useRef,
  useEffect,
  // useLayoutEffect, 
  // useState, 
} from 'react';
// import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
// import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
// import { setConstantValue } from 'typescript';

function PaginationBar( props ) {
  const { totalPages, pageNumber = 1, changePage } = props; 
  // https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
  const countRef = useRef(1);
  useEffect(() => {
    countRef.current = totalPages;
  })
  //
  const handleChange = (event, value) => {    
    // console.log(value);
    
    if (value!==pageNumber) changePage(value)
    // 220208 - for now lets assume validation is the responsibility of function creator
    // if (value>=0 && value<=totalPages){
    //   changePage({pageNumber: value});
    // }
  };
  //
  // 220210 - set upper limit
  // const count = Math.max(countRef.current,totalPages,5)>5 ? 5 : (totalPages||countRef.current);
  //
  return (
    <Stack spacing={2}>
      {/* <Typography>Page: {pageNumber}</Typography> */}
      <Pagination 
        size='large' variant='outlined' color='primary' shape='rounded'
        hidePrevButton hideNextButton 
        boundaryCount={1} siblingCount={1}
        // 220208 - ref as fallback, will keep current size until totalPages is populated from API 
        count={totalPages??countRef.current} page={pageNumber} // siblingCount=2, boundaryCount=1
        onChange={handleChange} 
      />
    </Stack>
  );
}
//
// 220314 - moved from pagefiltersearchnav
function NavigationBar({ pageMeta, ...props }) {
  const { changePage, decrementPage, incrementPage, } = props;
  const { pageNumber, totalPages, } = pageMeta;
  return (
      <Stack direction='row' justifyContent='space-between'>
        <Stack alignItems={'flex-start'} >
          <Button disableElevation onClick={decrementPage} color='primary' variant='contained' size='small' disabled={!pageMeta?.hasPrevious}>
            <ArrowLeftIcon />
          </Button>
        </Stack>
        <Stack alignItems={'center'}>  
          <PaginationBar 
            changePage={changePage}
            // pageMeta={pageMeta}
            pageNumber={pageNumber} totalPages={totalPages}  
          />  
        </Stack>               
        <Stack alignItems={'flex-end'}>          
          <Button disableElevation onClick={incrementPage} color='primary' variant='contained' size='small' disabled={!pageMeta?.hasNext}>
            <ArrowRightIcon />
          </Button>
        </Stack>
      </Stack>      
  );
}
//
export {
  NavigationBar,
  // PaginationBar,
}
//
export default NavigationBar;
//