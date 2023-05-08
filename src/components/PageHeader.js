

// import { memo } from 'react';
// import { getPageAttributes } from '../utils/FieldProperty';
//
// 220524 - the default export in utils/PageConfig is now the pageConfig object itself
// 220501 - now exported from utils/PageConfig
import { getPageConfig } from '../utils/PageConfig';
// import getPageHeaders from '../utils/PageHeaders';
//
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@material-ui/core/CardActions';
import CardContent from '@mui/material/CardContent';
//
// 220530 - update to use pagecontext
import { usePage } from '../utils/PageContext'
//

// 220526 - updated to pagename prop
const PageHeader = props => {
  const { stepName, apiPath } = usePage();
  const { pageLabel = '', pageHeader = '' } = getPageConfig({pageName: [stepName], apiPath});
  return (    
    <div {...props}>  
      <Box p={1} />
        <Typography variant='h5' align='center'>         
          { pageLabel }
        </Typography>  
      <Box p={2} />
      <Card variant='outlined' >                                   
        <CardContent sx={{ bgcolor: 'grey.100', }}>       
          <Box p={1} sx={{ whiteSpace: 'pre-line', }}>       
            <Typography variant='body2' fontSize={16}> 
              { pageHeader }
            </Typography> 
          </Box>
          </CardContent>
        </Card> 
      <Box p={2} />         
    </div>
  )
} 

//
export { PageHeader }
//
export default PageHeader
//
// export default memo( PageHeader );
//
