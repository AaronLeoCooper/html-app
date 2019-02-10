/**
 * Binds multiple events by the array of listeners.
 * @param rootElement {Element}
 * @param listeners {array}
 */
export function bindEvents(rootElement, listeners) {
  listeners.forEach(({ event, handlers }) => {
    rootElement.addEventListener(event, () => {
      handlers.forEach((handler) => handler(event));
    });
  });
}
