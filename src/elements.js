import { CHILD_EL_ATTR } from './constants';

/**
 * Returns an object wrapping the passed DOM element with helper functions.
 * @param element {Element}
 * @returns {{setInnerHtml: setHtml, el: Element}}
 */
export function getEnhancedElement(element) {
  /**
   * Returns a function that invokes the passed callback before returning the whole
   * wrapper object to allow chaining methods.
   * @param cb {Function}
   * @returns {Function}
   */
  const withWrapper = (cb) => (...args) => {
    cb(...args);
    return wrapper;
  };

  const wrapper = {
    el: element,
    id: element.getAttribute(CHILD_EL_ATTR),
    setInnerHtml: withWrapper(htmlStr => {
      element.innerHTML = htmlStr;
    })
  };

  return wrapper;
}
