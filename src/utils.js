import { CHILD_ATTR, LIB_NAME, ROOT_ATTR } from './constants';
import { getEnhancedElement } from './elements';

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
 * Returns all nodes within the root element that have the element target attribute.
 * Nodes are enhanced with wrapper properties/methods.
 * @param enhancedRootNode {EnhancedElement}
 * @returns {EnhancedElement[]}
 */
export function getEnhancedChildNodes(enhancedRootNode) {
  const childNodes = getChildNodes(enhancedRootNode.el);

  if (childNodes.length === 0) {
    /**
     * TODO: Add warning for no child nodes being found
     */
  }

  /**
   * TODO: Add warning for duplicate child node ids
   */

  return childNodes.map(getEnhancedElement);
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
 * Returns an array of event handlers with ids replaced with their respective
 * enhanced child node. Event handlers with ids that don't match a child node
 * will be filtered out. Root and Document event handlers are returned unmodified.
 * @param eventHandlers {EventHandler[]}
 * @param enhancedChildNodes {EnhancedElement[]}
 * @returns {{enhancedEl: EnhancedElement}[]}
 */
export function getEnhancedEventHandlers(eventHandlers, enhancedChildNodes) {
  return eventHandlers
    .filter((eventHandler) =>
      enhancedChildNodes.some(({ id }) => id === eventHandler.id) ||
      eventHandler.root ||
      eventHandler.document
    )
    .map((eventHandler) => {
      if (eventHandler.document || eventHandler.root) {
        return eventHandler;
      }

      return {
        ...eventHandler,
        enhancedEl: enhancedChildNodes.find(({ id }) => id === eventHandler.id)
      };
    });
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
