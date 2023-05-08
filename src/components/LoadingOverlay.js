
import Box from '@mui/material/Box';
// import Backdrop from '@material-ui/core/Backdrop';
// import CircularProgress from '@mui/material/CircularProgress';
//
function LoadingOverlay( props ){
  const { Wrapper = Box, wrapperProps = {}, isLoading, loading, doneLoading } = props;
  //
  return (
    <Wrapper
      sx={wrapperProps} 
      // children={(isLoading && loading) || doneLoading}
    >                       
      {(isLoading && loading) || doneLoading}
    </Wrapper>
  )
}
//
export {
  LoadingOverlay,
}
//
export default LoadingOverlay;
//
