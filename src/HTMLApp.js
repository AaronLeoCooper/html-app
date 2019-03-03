import { AppError, getEnhancedChildNodes, getEnhancedEventHandlers, getRootNode, logDebug } from './utils';
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

  const rootNode = getRootNode(this.__opts.appName);

  if (!rootNode) {
    throw new AppError(
      'Unable to locate the app root element with attribute:',
      `${ROOT_ATTR}="${this.__opts.appName}".`,
      'Make sure an element is present in the document with this attribute.'
    );
  }

  this.__enhancedRootNode = getEnhancedElement(rootNode);
  this.__enhancedChildNodes = getEnhancedChildNodes(this.__enhancedRootNode);

  window.addEventListener('load', handleLoadApp.bind(this));
  window.addEventListener('beforeunload', handleUnloadApp.bind(this));
}

/**
 * Side-effects triggered when the app initialises.
 */
function handleLoadApp() {
  const { eventHandlers, onLoadApp } = this.__opts;

  logDebug(this.__opts, 'loading app');

  const enhancedEventHandlers = getEnhancedEventHandlers(
    eventHandlers,
    this.__enhancedChildNodes
  );

  if (enhancedEventHandlers.length > 0) {
    bindEventHandlers(this.__enhancedRootNode, enhancedEventHandlers);
  }

  if (onLoadApp) {
    onLoadApp(this.__enhancedRootNode, this.__enhancedChildNodes);
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

export default HTMLApp;
