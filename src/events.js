/**
 * Binds multiple events by the array of listeners.
 * @param rootElement {Element}
 * @param listeners {array}
 */
export function bindEventListeners(rootElement, listeners) {
  listeners.forEach(({ event, handlers }) => {
    rootElement.addEventListener(event, (e) => {
      if (e.target.hasAttribute('data-ha')) {
        handlers.forEach((handler) => handler(e));
      }
    });
  });
}
