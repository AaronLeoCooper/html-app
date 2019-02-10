import { bindEventListeners } from './events';

const LIB_NAME = 'HTMLApp';
const ROOT_EL_ATTR = 'data-htmlapp';
const CHILD_EL_ATTR = 'data-ha';

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
 * Returns the root element for an app instance, based on the optionally passed
 * root app namespace value.
 * @param rootNamespace
 * @returns {Element}
 */
function getRootElement(rootNamespace = '') {
  const attr = `${ROOT_EL_ATTR}="${rootNamespace}"`;
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

const DEFAULT_OPTS = {
  appName: undefined,
  listeners: [],
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

    window.onload = this.handleLoadApp;
    window.onunload = this.handleUnloadApp;
  }

  getChildNodes() {
    const childNodes = this.rootElement.querySelectorAll(`[${CHILD_EL_ATTR}]`);

    this.debug('childNodes:', childNodes);

    return childNodes.map(node => ({
      setHtml: htmlStr => {
        node.innerHTML = htmlStr;
      }
    }));
  }

  hasListeners() {
    return this.opts.listeners.length > 0;
  }

  handleLoadApp() {
    if (this.hasListeners()) {
      this.handleBindListeners();
    }

    if (this.opts.onLoadApp) {
      const childNodes = this.getChildNodes();

      this.opts.onLoadApp(childNodes);
    }
  }

  handleUnloadApp() {
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
        ? `, ${this.opts.appName}`
        : '';

      console.info(`${LIB_NAME}${suffix} DEBUG:`, ...logMessageParts);
    }
  }
}

export default HTMLApp;
