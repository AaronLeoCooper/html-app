import { EL_TARGET_ATTR } from './constants';
import { logDebug, getRootNode } from './utils';
import { bindEventHandlers } from './events';
import { getEnhancedElement } from './elements';

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
 */
class HTMLApp {
  /**
   * @param options {LibOptions}
   */
  constructor(options = {}) {
    this.opts = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    this.rootNode = getRootNode(this.opts.appName);

    window.addEventListener('load', this.handleLoadApp.bind(this));
    window.addEventListener('beforeunload', this.handleUnloadApp.bind(this));
  }

  /**
   * Returns all nodes within the root element that have the element target attribute.
   * Nodes are enhanced with wrapper properties/methods.
   * @returns {EnhancedElement[]}
   */
  getEnhancedChildNodes() {
    const childNodes = this.rootNode.querySelectorAll(`[${EL_TARGET_ATTR}]`);

    this.withApp(logDebug, 'childNodes:', childNodes);

    return Array.prototype.map.call(childNodes, getEnhancedElement);
  }

  /**
   * Side-effects triggered when the app initialises.
   */
  handleLoadApp() {
    const { onLoadApp } = this.opts;

    this.withApp(logDebug, 'loading app');

    this.handleBindEventHandlers();

    if (onLoadApp) {
      const childNodes = this.getEnhancedChildNodes();

      onLoadApp(childNodes);
    }
  }

  /**
   * Side-effects triggered when the app is unloaded.
   */
  handleUnloadApp() {
    const { onUnloadApp } = this.opts;

    this.withApp(logDebug, 'unloading app');

    if (onUnloadApp) {
      onUnloadApp();
    }
  }

  /**
   * Binds all provided eventHandlers to root element event eventHandlers.
   */
  handleBindEventHandlers() {
    const { eventHandlers } = this.opts;

    if (eventHandlers.length > 0) {
      bindEventHandlers(this.rootNode, eventHandlers);
    }
  }

  /**
   * A wrapper method that will call the passed function with the current app instance
   * (`this`) as the first argument and spread all other arguments afterwards.
   * Usage: this.withApp(myFunc, 'abc', 123);
   * Result: myFunc(this, 'abc', 123);
   * @param {Function} callback - The function to be invoked with the app instance provided
   * @param {*} args - Any arguments to be passed from the second argument onwards
   * @return {*}
   */
  withApp(callback, ...args) {
    return callback(this, ...args);
  }
}

export default HTMLApp;
