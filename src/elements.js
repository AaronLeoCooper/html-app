import { CHILD_EL_ATTR } from './constants';

/**
 * Returns an object wrapping the passed DOM element with helper functions.
 * @param el {Element} The DOM element being wrapped
 * @returns {{el: Element, id: string}}
 */
export function getEnhancedElement(el) {
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
    el,
    id: el.getAttribute(CHILD_EL_ATTR),

    // Setters
    setInnerHtml: withWrapper(htmlStr => {
      el.innerHTML = htmlStr;
    }),
    setText: withWrapper(text => {
      el.textContent = text;
    }),
    setClass: withWrapper((...classes) => {
      el.classList.add(...classes);
    }),
    setAttribute: withWrapper((attributeName, value) => {
      el.setAttribute(attributeName, value);
    }),

    // Getters
    getInnerHtml: withWrapper(() => el.innerHTML),
    getText: withWrapper(() => el.textContent),
    getClasses: withWrapper(() => {
      const classes = el.className.split(' ');

      return classes.length === 0
        ? []
        : classes;
    }),
    getAttribute: withWrapper((attributeName) => el.getAttribute(attributeName)),
    getAttributes: withWrapper(() => {
      const attributesList = Array.prototype.slice.call(el.attributes);

      return attributesList.reduce((acc, attribute) => ({
        ...acc,
        [attribute.name]: attribute.value
      }), {});
    })
  };

  return wrapper;
}
