import { CHILD_EL_ATTR } from './constants';
import { logDebug, getEnhancedElement, getRootNode } from './utils';
import { bindChildEventHandlers } from './events';

/**
 * Options object used when the library is instantiated.
 * @typedef LibOptions
 * @property appName {string|undefined}
 * @property eventHandlers {{eventType: string, handlers: Object[]}[]}
 * @property onLoadApp {Function|undefined}
 * @property onUnloadApp {Function|undefined}
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
   * Returns all elements within the root element that have the app child attribute.
   * @returns {Object[]}
   */
  getAllChildNodes() {
    const childNodes = this.rootNode.querySelectorAll(`[${CHILD_EL_ATTR}]`);

    this.withApp(logDebug, 'childNodes:', childNodes);

    return Array.prototype.map.call(childNodes, getEnhancedElement);
  }

  /**
   * Returns true if the app currently has any provided eventHandlers.
   * @returns {boolean}
   */
  hasChildListeners() {
    return this.opts.eventHandlers.length > 0;
  }

  /**
   * Side-effects triggered when the app initialises.
   */
  handleLoadApp() {
    const { onLoadApp } = this.opts;

    this.withApp(logDebug, 'loading app');

    this.handleBindAllListeners();

    if (onLoadApp) {
      const childNodes = this.getAllChildNodes();

      onLoadApp(childNodes);
    }
  }

  /**
   * Side-effects triggered when the app is unloaded.
   */
  handleUnloadApp() {
    this.withApp(logDebug, 'unloading app');
  }

  /**
   * Binds all provided eventHandlers to root element event eventHandlers.
   */
  handleBindAllListeners() {
    if (this.hasChildListeners()) {
      bindChildEventHandlers(this.rootNode, this.opts.eventHandlers);
    }
  }

  /**
   * Unbinds all provided eventHandlers from root element event eventHandlers.
   */
  // handleUnBindAllListeners() {}

  /**
   * A wrapper method that will call the passed function with the current app instance
   * (`this`) as the first argument and spread all other arguments afterwards.
   * Usage:
   *   this.withApp(myFunc, 'abc', 123);
   * Result:
   *   myFunc(this, 'abc', 123);
   * @param {Function} callback - The function to be invoked with the app instance provided
   * @param {*} args - Any arguments to be passed from the second argument onwards
   * @return {*}
   */
  withApp(callback, ...args) {
    return callback(this, ...args);
  }
}

export default HTMLApp;
