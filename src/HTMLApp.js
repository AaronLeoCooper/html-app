import { CHILD_EL_ATTR, LIB_NAME } from './constants';
import { getEnhancedElement, getRootElement } from './utils';
import { bindEventListeners } from './events';

const DEFAULT_OPTIONS = {
  appName: undefined,
  listeners: undefined,
  onLoadApp: undefined,
  onUnloadApp: undefined,
  debug: false
};

/**
 * Core HTMLApp class.
 */
class HTMLApp {
  constructor(options = {}) {
    this.opts = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    this.rootElement = getRootElement(this.opts.appName);

    window.onload = this.handleLoadApp.bind(this);
    window.onunload = this.handleUnloadApp.bind(this);
  }

  /**
   * Returns all elements within the root element that have the app child attribute.
   * @returns {object[]}
   */
  getChildNodes() {
    const childNodes = this.rootElement.querySelectorAll(`[${CHILD_EL_ATTR}]`);

    this.debug('childNodes:', childNodes);

    return Array.prototype.map.call(childNodes, getEnhancedElement);
  }

  /**
   * Returns true if the app currently has any provided listeners.
   * @returns {boolean}
   */
  hasListeners() {
    return Object.keys(this.opts.listeners).length > 0;
  }

  /**
   * Side-effects triggered when the app initialises.
   */
  handleLoadApp() {
    this.debug('loading app');

    if (this.hasListeners()) {
      this.handleBindListeners();
    }

    if (this.opts.onLoadApp) {
      const childNodes = this.getChildNodes();

      this.opts.onLoadApp(childNodes);
    }
  }

  /**
   * Side-effects triggered when the app is unloaded.
   */
  handleUnloadApp() {
    this.debug('unloading app');

    if (this.hasListeners()) {
      this.handleUnBindListeners();
    }
  }

  /**
   * Binds all provided listeners to root element event listeners.
   */
  handleBindListeners() {
    bindEventListeners(this.rootElement, this.opts.listeners);
  }

  /**
   * Unbinds all provided listeners from root element event listeners.
   */
  handleUnBindListeners() {
    /**
     * TODO: Remove all event listeners
     */
  }

  debug(...logMessageParts) {
    if (this.opts.debug) {
      const suffix = this.opts.appName
        ? ` ${this.opts.appName}`
        : '';

      console.info(`${LIB_NAME}${suffix} DEBUG:`, ...logMessageParts);
    }
  }
}

export default HTMLApp;
