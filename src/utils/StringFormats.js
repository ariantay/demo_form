
function formatUsername ( username = '' ) {
  return username ? username.slice(username.lastIndexOf('\\')+1) : username;
}
// (123) 456 - 7890 
function formatPhone ( phonenumber = '' ) {
  return phonenumber ? `(${phonenumber.slice(0,3)})  ${phonenumber.slice(3,6)}  ${phonenumber.slice(6,10)}` : '';
}
//
// 123-45-6789
function formatSSN ( ssn = '' ) {
  return ssn ? `${ssn.slice(0,3)}-${ssn.slice(3,5)}-${ssn.slice(5,9)}` : '';
}
//
function formatStreetAddress ( address1 = '', address2 = '') {
  return address2 ? `${address1}, ${address2}` : `${address1}`;
}
//
function formatServiceType ( servicetype = '' ) {
  return servicetype&&servicetype==='BOTH' ? 'ELECTRIC, WATER' : servicetype;
}
//
function phonemask( value = "" ){
  return value.replace(/^(.{1,3})?(.{1,3})?(.{1,4})?.*$/, (_,x,y,z) => (x ? `(${x}` : '') + (y ? `) ${y}` : '') + (z ? `-${z}` : ''));  
}
//
function phoneunmask( value = "" ){
  return value.replace(/[^\d*]/g, "").slice(0,10);
}
//
function ssnmask( value = "" ){
  return value.replace(/^(.{1,3})(.{1,2})?(.{1,4})?.*$/, (_,x,y,z) => x + (y ? `-${y}` : '') + (z ? `-${z}` : ''));
}
//
function ssnunmask( value = "" ){
  return value.replace(/[^\d*]/g, "").slice(0,9);
}
// 221103 - mask ein
function einmask( value = "" ){
  return value.replace(/^(.{1,2})(.{1,7})?.*$/, (_,x,y) => x + (y ? `-${y}` : ''));
}
//
function einunmask( value = "" ){
  return value.replace(/[^\d*]/g, "").slice(0,9);
} 
//
function numbersonly ( value = "" ) {
  return value.replace(/[^\d*]/g, "")
}
// 220530 - add trim starting/trailing space
function trimspace ( text = '' ) {
  return text.trimStart().replace(/^\s|\s+$/g, ' ')
}
//
// 220514 - formatFileSize moved here
// 210216 - convert file size to proper units  
const formatFileSize = (size = 0) => {
  return ( 
    (size < 1024) ? `${size} bytes` 
    : (size >= 1024 && size < 1024*1024) ? `${(size/1024).toFixed(2)} KB` 
    : `${(size/(1024*1024)).toFixed(2)} MB` // (size >= 1024*1024)
  )
}
//
// 220929
// const getFileName = value => value?.name
// const getFileSize = value => value?.size
//

//
export default formatPhone;
//
export {
  formatUsername,
  formatPhone,
  formatSSN,
  formatStreetAddress,
  formatServiceType,
  phonemask,
  phoneunmask,
  ssnmask,
  ssnunmask,
  numbersonly,
  trimspace,
  formatFileSize,
  einmask,
  einunmask,
};
//