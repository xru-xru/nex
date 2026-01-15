// Comment:
// this is in React components where we want to check
// if a callback function is provided for some event.
// If so, we call it.
// Example is: input field handles internal "onChange"
// and after internal change is handled, it will
// check if we pass "onChange" from the parent and
// trigger it.
export function conditionalCb(
  cb: (...args: Array<any>) => any,
  checkFn?: (cb: (...args: Array<any>) => any) => boolean
): void {
  let triggerCb: boolean = typeof cb === 'function';

  if (typeof checkFn === 'function') {
    triggerCb = checkFn(cb);
  }

  if (triggerCb) {
    cb();
  }
}
