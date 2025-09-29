// utils/debounce.js
export function debounce(fn, delay = 500) {
  let timeout; //stores the ID of the active setTimeout
  let lastArgs;

  function debounced(...args) {
    if (timeout) clearTimeout(timeout); // reset timer if still counting down
    lastArgs = args; // save the latest args
    timeout = setTimeout(() => {
      fn(...lastArgs); // call fn with latest args if no new arguements hit before the delay/timer is finished
      timeout = null; // reset timer
      lastArgs = null;
    }, delay);
  }

  // Lets us cancel any pending call
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = null;
    lastArgs = null;
  };

  // immediately fire pending call (if any). So if the 1. user closes the tab, 2 component unmounts
  debounced.flush = () => {
    if (timeout) {
      clearTimeout(timeout); // stop waiting
      fn(...lastArgs); // call immediately
      timeout = null;
      lastArgs = null;
    }
  };

  return debounced;
}
