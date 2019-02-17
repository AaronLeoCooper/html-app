import { CHILD_EL_ATTR, LIB_NAME } from './constants';
import { getRootElement } from './utils';
import { bindEventListeners } from './events';

const DEFAULT_OPTS = {
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
  constructor(userOpts = {}) {
    this.opts = {
      ...DEFAULT_OPTS,
      ...userOpts
    };

    this.rootElement = getRootElement(this.opts.appName);

    window.onload = this.handleLoadApp.bind(this);
    window.onunload = this.handleUnloadApp.bind(this);
  }

  getChildNodes() {
    const childNodes = this.rootElement.querySelectorAll(`[${CHILD_EL_ATTR}]`);

    this.debug('childNodes:', childNodes);

    return Array.prototype.map.call(childNodes, node => ({
      node,
      setHtml: htmlStr => {
        node.innerHTML = htmlStr;
      }
    }));
  }

  hasListeners() {
    return Object.keys(this.opts.listeners).length > 0;
  }

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

  handleUnloadApp() {
    this.debug('unloading app');

    if (this.hasListeners()) {
      this.handleUnBindListeners();
    }
  }

  handleBindListeners() {
    bindEventListeners(this.rootElement, this.opts.listeners);
  }

  handleUnBindListeners() {
    this.rootElement.removeEventListener();
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
