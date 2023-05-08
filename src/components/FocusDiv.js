import {
  useEffect,
  useRef,
  memo,
} from 'react';
//
// import { pendingResolve } from '../utils/HelperFunctions';
//

// 211123 - lets just move focusref to a custom component

function FocusDiv ( props ) {
  const { loading = true } = props;
  const focusRef = useRef(null);
  //
  useEffect(() => {          
    if (loading) {
      if (focusRef.current){
        // pendingResolve(200).then(() => {
          // 220530 - scroll behavior to instant. transition hidden by loading fade
          // 220531 - smooth seems to behave more consistent
          focusRef.current.scrollIntoView({behavior: 'smooth', block: 'start'})
          // focusRef.current.scrollIntoView({behavior: 'instant', block: 'start'})
          //
        // })
      }
    }
    // 220207 - stutters likely caused by improper event call or dependency 
    // 211123 - try calling focus twice per load -** no janky behavior **  
    // focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); //block: 'center',
    // 220317 - ref is not valid as dependency, is allowed to mutate
  // },[loading, focusRef.current])
  },[loading])   
  //
  return (
    <div ref={focusRef} />          
  )
  //
};
//
export { FocusDiv };
//
export default memo(FocusDiv);
//