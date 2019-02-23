import { LIB_NAME, ROOT_EL_ATTR } from './constants';

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
 * Returns the root element for an app instance, based on the optionally passed
 * root app namespace value.
 * @param rootNamespace
 * @returns {Element}
 */
export function getRootElement(rootNamespace = '') {
  const attr = `${ROOT_EL_ATTR}="${rootNamespace}"`;
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
 * @returns {{setHtml: setHtml, element: Element}}
 */
export function getEnhancedElement(element) {
  return {
    element,
    setHtml: htmlStr => {
      element.innerHTML = htmlStr;
    }
  };
}
