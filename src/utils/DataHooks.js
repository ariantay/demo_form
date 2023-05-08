import {
  useState,
  useEffect,
} from 'react';
import {
  admAPI,
} from '../utils/webapi';
import { pendingResolve } from './HelperFunctions';
//
// 220223
// https://www.robinwieruch.de/react-hooks-fetch-data/
// https://www.npmjs.com/package/axios
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
//
// 220303 - allow delay to be set from arg
function useFetch ( initialURL='', initialData=null, recall=null, delay=600 ) {
  // console.log('in useFetch', initialURL)
  const [data, setData] = useState(initialData)
  const [url, setURL] = useState(initialURL)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  // const delay = 600

  useEffect(() => {
    // let active = true
    let active = !!url
    //
    async function fetchData () {
      admAPI.get(url)
      .then( response => {
        if (active) setData(response)
      }).catch( error => {
        if (active) setError(error)
      })
      // .then( function() {
      //   setLoading(false)
      // });
    }
    // let active=true
    if (active) {
      setLoading(true)    
      Promise.all([fetchData(), pendingResolve(delay)])
      .then( values => {
        if (active) setLoading(false)
      })
    }
    // if (active) setLoading(false)
    return () => active=false
  },[url, recall])
  //
  // console.log('in useFetch', url, data)
  return [{ data, error, loading }, setURL]
}
//
export {
  useFetch,
}
//
export default useFetch
//





// async function fetchData() {
//   admAPI.get(url)
//   .then( function(response) {
//     setData(response)
//   }).catch( function(error) {
//     setError(error)
//   }).then( function() {
//     setLoading(false)
//   });
// }