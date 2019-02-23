import { CHILD_EL_ATTR, LIB_NAME, ROOT_EL_ATTR } from './constants';

/**
 * Returns an Error instance with a message prefixed by the lib name. Expects one or many
 * string parameters to be joined together in the error message by spaces.
 * @param errorMessageParts
 * @returns {Error}
 */
function getAppError(...errorMessageParts) {
  return new Error(`${LIB_NAME} - ${errorMessageParts.join(' ')}`);
}

/**
 * Returns the root node for an app instance, based on the optionally passed appName value.
 * @param appName {string}
 * @returns {Element}
 */
export function getRootNode(appName = '') {
  const attr = `${ROOT_EL_ATTR}="${appName}"`;
  const selector = `[${attr}]`;

  const rootElement = document.querySelector(selector);

  if (!rootElement) {
    throw getAppError(
      'Unable to locate app root element with attribute:',
      attr,
      'Make sure an element is present in the HTML document with this attribute.'
    );
  }

  return rootElement;
}

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
    setInnerHtml: withWrapper(htmlStr => {
      element.innerHTML = htmlStr;
    })
  };

  return wrapper;
}

/**
 * Returns an event name with the leading "on" trimmed and then converted to lowercase.
 * @param event {string}
 * @returns {string}
 */
export function getNormalisedEventName(event) {
  return event.toLowerCase().slice(2);
}

/**
 * Returns a specific child node by its name.
 * @param rootNode {Element}
 * @param childName {string}
 * @returns {Element | null}
 */
export function getChildNode(rootNode, childName) {
  return rootNode.querySelector(`[${CHILD_EL_ATTR}="${childName}"]`);
}

/**
 * Returns true if the passed string is a camelCase event name, starting with "on".
 * Positive examples: onClick, onKeyDown, onTouch.
 * Negative examples: onclick, click, keyDown.
 * @param event {string}
 * @returns {boolean}
 */
export function isCamelcaseEventName(event) {
  return /^on[A-Z]/.test(event);
}
