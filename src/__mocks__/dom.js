/**
 * Creates a new HTML element node with optional attributes and
 * inner HTML content and returns it.
 * @param tagName {string=}
 * @param attributes {string[][]=}
 * @param content {string=}
 * @returns {HTMLElement}
 */
export const getNewEl = ({ tagName = 'div', attributes = [], content = '' }) => {
  const el = document.createElement(tagName);

  attributes.forEach(([name, value = '']) => {
    el.setAttribute(name, value);
  });

  if (content) {
    el.innerHTML = content;
  }

  return el;
};

/**
 * Dispatches an arbitrary named event on an element.
 * @param el {Element|Window}
 * @param eventName {string}
 */
export const dispatchEvent = (el, eventName) => {
  const event = new CustomEvent(eventName);

  el.dispatchEvent(event);
};
