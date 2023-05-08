
// 211114 - creates pending promise that resolves in ms time
export const pendingResolve = ms => new Promise(resolve => setTimeout(resolve, ms));

// 220929
// from: https://stackoverflow.com/questions/5999998/check-if-a-variable-is-of-function-type
//
export const isFunction = value => value && (Object.prototype.toString.call(value)==="[object Function]" || "function"===typeof value || value instanceof Function);

export default pendingResolve;
