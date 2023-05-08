import { 
  format, 
  parseISO, 
  parse,
  isValid,  
  // parseJSON,
} from 'date-fns'; //, isValid 

// 211109 - isValid can throw a rangeerror exception because isValid attempts to toDate, dont use isValid.
// https://date-fns.org/v2.25.0/docs/isValid
//
// parseISO( isValid(date)? date : new Date(), 'MM-dd-yy h:mm a' ), 
//
// 211109 - isValid throws rangeerror in reviewentries because isValid attempts to toDate, dont use isValid.
// 220203 - we want the exception to occur, don't have fallback dates
//

// Oct 22nd, 2021
function applicationListDateFormat(date) {
  return format(
    //parseISO(isValid(date)? date : new Date(), 'MM-dd-yy h:mm a'), 
    parseISO(date),
    "MMM do',' yyyy"
  );
}   
//
function applicationListDateTimeFormat(date) {
  return format(
    // parseISO(date ? date : new Date(), 'MM-dd-yy h:mm a'),
    parseISO(date),
    "MM'/'dd' @ 'h:mm a"
  );
}
//
// 11/06 @ 12:20 AM
function statusHistoryDateTimeFormat(date) {
  // console.log(date);
  return format(
    parseISO(date),
    "MM'/'dd'/'yy' @ 'h:mm a"
  );
}   
//
// 211109 - from ReviewEntries
// format(parseISO(values[e]),'MM-dd-yyyy')
// 11/06 @ 12:20 AM
function reviewEntriesDateFormat(date) {
  // 220512 - ** maybe we should throw the error and handle with try catch when calling the function **
  // 220511 - prevent application crash due to call to parseISO with invalid date, 
  //
  return !!(date && parseISO(date)) ? format(parseISO(date), "MM'/'dd'/'yyyy") : 'Invalid Date';
}  
// 220512 - convert a string OR date to yyyy-MM-dd string
function toDateObject( item ) {
  // 220512 - if date else parse
  let date = (item instanceof Date && !isNaN(item)) ? item : parseISO(item);
  // 220512 - if valid, return the date, else try parse
  date = isValid(date) ? date : parse(item, 'MM/dd/yyyy', new Date());
  // 220512 - return null if parse fails
  return isValid(date) ? date : null;
}
//
// 220512 - convert a string OR date to MM-dd-yyyy string
function toDateString( item, pattern = "yyyy-MM-dd" ) {
  return !!toDateObject(item) ? format(toDateObject(item), pattern) : "";
}
//


export {
  applicationListDateFormat,
  applicationListDateTimeFormat,
  reviewEntriesDateFormat,
  statusHistoryDateTimeFormat,
  toDateString,
  toDateObject, 
};
//