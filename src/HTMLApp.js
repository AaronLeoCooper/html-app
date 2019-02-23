import { CHILD_EL_ATTR, LIB_NAME } from './constants';
import { getEnhancedElement, getRootNode } from './utils';
import { bindChildEventHandlers } from './events';

const DEFAULT_OPTIONS = {
  appName: undefined,
  eventHandlers: [],
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

    this.rootNode = getRootNode(this.opts.appName);

    window.onload = this.handleLoadApp.bind(this);
    window.onunload = this.handleUnloadApp.bind(this);
  }

  /**
   * Returns all elements within the root element that have the app child attribute.
   * @returns {Object[]}
   */
  getAllChildNodes() {
    const childNodes = this.rootNode.querySelectorAll(`[${CHILD_EL_ATTR}]`);

    this.debug('childNodes:', childNodes);

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

    this.debug('loading app');

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
    this.debug('unloading app');
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
  // handleUnBindAllListeners() {
  // }

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
