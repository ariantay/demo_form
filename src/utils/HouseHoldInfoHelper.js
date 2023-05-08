import { memberIds, memberFields, } from '../utils/AppConfig'

const gridColumns = ['firstName','lastName','relation',];

// 220211 - only 4 housemembers
// 220527 - getRow closed from values
const getRows = values => {  
  // 220526 - rowItems
  const rowItems = memberIds.map( (memberId, index) => {    
    const gridRow = gridColumns.reduce( (rowItem, field) => {
      rowItem[field] = values[`${memberId}${field}`];
      return rowItem;
    }, {})
    return {id: index, ...gridRow}
  }, []);
  return rowItems.filter( item => values[ `${memberIds[item.id]}exists` ] );
  //
}
// 220211 - only 4 housemembers
function findAvailableRow (values) {
  // console.log('find Available rows')
  const nextAvailable = memberIds.findIndex( memberId => values[`${memberId}exists`]!==true );
  // 220514 - if no available rows found, return the array length so memberdialog can display the over maxCount message
  return nextAvailable < 0 ? memberIds.length : nextAvailable;
}  
// eslint-disable-next-line
function getMemberResetObject (id) {
  const resetObject = memberFields.reduce( (object, field) => {
    object[`${memberIds[id]}${field}`]='';
    return object;
  }, {});
  return resetObject;
}
// create fn to update formik.touched
function getTouchFields (id) {  
  const touchFields = memberFields.reduce( (object, field) => {
    object[`${memberIds[id]}${field}`]=true;
    return object;
  }, {} );    
  return ({...touched}) => ({...touched, ...touchFields});
  //
}
//
export {
  // prefix,
  // getAllMemberExistsId,
  getRows,
  // getRows2,
  findAvailableRow,
  getMemberResetObject,
  getTouchFields,
  // getGridColumns,
  gridColumns,
};
//