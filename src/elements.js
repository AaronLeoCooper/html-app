import { EL_TARGET_ATTR } from './constants';

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
    id: el.getAttribute(EL_TARGET_ATTR),

    /**
     * Safely sets element text content.
     * @param {string} text
     */
    setText: withWrapper(text => {
      el.textContent = text;
    }),

    /**
     * Unsafely sets element innerHTML.
     * @param {string} htmlStr
     */
    setInnerHtml: withWrapper(htmlStr => {
      el.innerHTML = htmlStr;
    }),

    /**
     * Adds one or more classes to the element. Invalid values will be ignored.
     * @param {...string} classes
     */
    setClass: withWrapper((...classes) => {
      el.classList.add(...classes.filter(Boolean));
    }),

    /**
     * Removes one or more classes from the element. Invalid values will be ignored.
     * @param {...string} classes
     */
    removeClass: withWrapper((...classes) => {
      el.classList.remove(...classes.filter(Boolean));
    }),

    /**
     * Sets a single named attribute value.
     * @param {string} attributeName
     * @param {string} value
     */
    setAttribute: withWrapper((attributeName, value) => {
      el.setAttribute(attributeName, value);
    }),

    /**
     * Removes a single named attribute.
     * @param {string} attributeName
     */
    removeAttribute: withWrapper((attributeName) => {
      el.removeAttribute(attributeName);
    }),

    /**
     * Sets a single named style value.
     * @param {string} styleName
     * @param {string} value
     */
    setStyle: withWrapper((styleName, value) => {
      el.style[styleName] = value;
    }),

    /**
     * Returns the text content of the element.
     * @return {string}
     */
    getText: () => el.textContent,

    /**
     * Returns the innerHTML content of the element.
     * @returns {string}
     */
    getInnerHtml: () => el.innerHTML,

    /**
     * Returns an array of class names on the element, or an empty array if
     * the element has no classes.
     * @returns {string[]}
     */
    getClasses: () => Array.prototype.slice.call(el.classList),

    /**
     * Returns the value of a single attribute by its name.
     * @param {string} attributeName
     * @returns {string}
     */
    getAttribute: (attributeName) => el.getAttribute(attributeName),

    /**
     * Returns an object representing all attributes on the element
     * and their respective values.
     * @returns {Object}
     */
    getAttributes: () => {
      const attributesList = Array.prototype.slice.call(el.attributes);

      return attributesList.reduce((acc, attribute) => ({
        ...acc,
        [attribute.name]: attribute.value
      }), {});
    },

    /**
     * Returns the value of a single style by its name.
     * @param {string} styleName
     * @returns {string}
     */
    getStyle: (styleName) => el.style[styleName]
  };

  return wrapper;
}
