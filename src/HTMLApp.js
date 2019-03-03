import { AppError, logDebug, getRootNode, getChildNodes } from './utils';
import { bindEventHandlers } from './events';
import { getEnhancedElement } from './elements';
import { ROOT_ATTR } from './constants';

/**
 * @typedef EventHandler
 * @property id {string=}
 * @property root {boolean=}
 * @property document {boolean=}
 */

/**
 * Options object used when the library is instantiated.
 * @typedef LibOptions
 * @property appName {string=}
 * @property eventHandlers {EventHandler[]}
 * @property onLoadApp {Function=}
 * @property onUnloadApp {Function=}
 * @property debug {boolean}
 */

/**
 * @type {LibOptions}
 */
const DEFAULT_OPTIONS = {
  appName: undefined,
  eventHandlers: [],
  onLoadApp: undefined,
  onUnloadApp: undefined,
  debug: false
};

/**
 * Core library class.
 * @param {LibOptions=} options - User-defined options object
 * @constructor
 */
function HTMLApp(options) {
  this.__opts = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  this.__rootNode = getRootNode(this.__opts.appName);

  if (!this.__rootNode) {
    throw new AppError(
      'Unable to locate the app root element with attribute:',
      `${ROOT_ATTR}="${this.__opts.appName}".`,
      'Make sure an element is present in the document with this attribute.'
    );
  }

  window.addEventListener('load', handleLoadApp.bind(this));
  window.addEventListener('beforeunload', handleUnloadApp.bind(this));
}

/**
 * Side-effects triggered when the app initialises.
 */
function handleLoadApp() {
  const { eventHandlers, onLoadApp } = this.__opts;

  logDebug(this.__opts, 'loading app');

  if (eventHandlers.length > 0) {
    bindEventHandlers(this.__rootNode, eventHandlers);
  }

  if (onLoadApp) {
    const childNodes = getEnhancedChildNodes(this.__rootNode);

    onLoadApp(childNodes);
  }
}

/**
 * Side-effects triggered when the app is unloaded.
 */
function handleUnloadApp() {
  const { onUnloadApp } = this.__opts;

  logDebug(this.__opts, 'unloading app');

  if (onUnloadApp) {
    onUnloadApp();
  }
}

/**
 * Returns all nodes within the root element that have the element target attribute.
 * Nodes are enhanced with wrapper properties/methods.
 * @returns {EnhancedElement[]}
 */
function getEnhancedChildNodes(rootNode) {
  const childNodes = getChildNodes(rootNode);

  if (childNodes.length === 0) {
    /**
     * TODO: Add warning for no child nodes being found
     */
  }

  return childNodes.map(getEnhancedElement);
}

export default HTMLApp;
