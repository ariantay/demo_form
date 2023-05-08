

// 220527 - useCallback is to memoize functions and not objects/results
import { memo } from 'react';
// import { memo, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const MemberGrid = ({columns, rows, handleOpen, ...props}) => {

  return(
  <div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid 
            {...props}
            columns={columns} rows={rows} 
            pageSize={5} //rowLength={14} 
            rowCount={5} //rowHeight={36}
            //headerHeight
            hideFooterPagination 
            disableMultipleSelection
            disableColumnReorder  
            disableColumnSelector 
            disableColumnMenu  
            disableSelectionOnClick
            //checkboxSelection
            density={'standard'} //density={'compact'}        
            //disableCellSelection checkboxSelection disableMultipleSelection={true} disableColumnMenu={true} disableColumnSelector={true} disableColumnReorder={true}
            // onRowSelected={ row => {
            //   // console.log('row from onRowSelected',row);
            //   // if((row['isSelected']){setId(dataObj[id])}          
            //   //set currentstate of row           
            //   // setrow(row['data']);
            //   handleOpen(row['data']['id']);
            //   //pass row selected back to parent
            //   //getSelected(row);                        
            // }}
            //
            //211004 - updated for materialui 5 
            //onRowSelected={e => handleOpen(e['data']['id'])}  
            // 220514 - add comments detailing fn
            //
            // 220526 - try limit render
            // onCellClick={handleCellClick}
            //
            onCellClick={(params, event) => {
              // 220514 - prevent default muiaction
              event.defaultMuiPrevented=true; 
              // 220514 - p.field is column header defined in MemberGridHelper.getColumns
              if (params.field==='ID') {
                // 220514 - returns index of row clicked to HouseHoldInfo
                handleOpen(params.id)
              }
            }}
            // 220514 - prevent row level click action  
            // onRowClick={(p,e) => e.defaultMuiPrevented=true}  
          />    
        </div>   
  </div>
  )
}
//
export { MemberGrid }
//
export default memo(MemberGrid)
//