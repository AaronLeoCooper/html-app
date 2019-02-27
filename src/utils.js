import { EL_TARGET_ATTR, LIB_NAME, ROOT_ATTR } from './constants';

/**
 * Log an arbitrary message to the console if opts.debug is `true`.
 * @param app {{opts: LibOptions}}
 * @param logMessageParts {*}
 */
export function logDebug(app, ...logMessageParts) {
  if (app.opts.debug) {
    const suffix = app.opts.appName
      ? ` ${app.opts.appName}`
      : '';

    console.info(
      `%c[DEBUG ${LIB_NAME}${suffix}]:`,
      'color: green; font-weight: bold;',
      ...logMessageParts
    );
  }
}

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
  const attr = `${ROOT_ATTR}="${appName}"`;
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
  return rootNode.querySelector(`[${EL_TARGET_ATTR}="${childName}"]`);
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
