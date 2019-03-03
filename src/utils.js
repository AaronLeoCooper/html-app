import { CHILD_ATTR, LIB_NAME, ROOT_ATTR } from './constants';

/**
 * Log an arbitrary message to the console if options.debug is `true`.
 * @param options {LibOptions}
 * @param logMessageParts {*}
 */
export function logDebug(options, ...logMessageParts) {
  if (options.debug) {
    const suffix = options.appName
      ? ` ${options.appName}`
      : '';

    console.info(
      `%c[DEBUG ${LIB_NAME}${suffix}]:`,
      'color: blue; font-weight: bold;',
      ...logMessageParts
    );
  }
}

/**
 * Returns an Error instance with a message prefixed by the lib name. Expects one or many
 * string parameters to be joined together in the error message by spaces.
 * @param errorMessageParts
 * @constructor
 * @returns {Error}
 */
export function AppError(...errorMessageParts) {
  return new Error(`${LIB_NAME} - ${errorMessageParts.join(' ')}`);
}

/**
 * Returns the root node for an app instance, based on the optionally passed appName value.
 * @param appName {string}
 * @returns {Element|null}
 */
export function getRootNode(appName = '') {
  const attr = `${ROOT_ATTR}="${appName}"`;
  const selector = `[${attr}]`;

  return document.querySelector(selector);
}

/**
 * Returns an array of child elements within the root element that have the child attribute,
 * or an empty array if there are no child elements.
 * @param rootNode {Element}
 * @returns {Element[]}
 */
export function getChildNodes(rootNode) {
  const childrenNodeList = rootNode.querySelectorAll(`[${CHILD_ATTR}]`);

  return Array.prototype.slice.call(childrenNodeList);
}

/**
 * Returns a specific child node by its name.
 * @param rootNode {Element}
 * @param childName {string}
 * @returns {Element|null}
 */
export function getChildNode(rootNode, childName) {
  return rootNode.querySelector(`[${CHILD_ATTR}="${childName}"]`);
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
 * Returns true if the passed string is a camelCase event name, starting with "on".
 * Positive examples: onClick, onKeyDown, onTouch.
 * Negative examples: onclick, click, keyDown.
 * @param event {string}
 * @returns {boolean}
 */
export function isCamelcaseEventName(event) {
  return /^on[A-Z]/.test(event);
}
