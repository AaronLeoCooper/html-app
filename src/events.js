import { CHILD_EL_ATTR, ROOT_EVENT_NODE_NAME } from './constants';

/**
 * Returns an event name with the leading "on" trimmed and then converted to lowercase.
 * @param event {string}
 * @returns {string}
 */
function getNormalisedEventName(event) {
  return event.toLowerCase().slice(2);
}

/**
 * Returns a matching handler for the given event object if one exists, or undefined.
 * @param e {object}
 * @param handlers {object}
 * @returns {Function|undefined}
 */
function getMatchingHandler(e, handlers) {
  const nodeName = e.target.getAttribute(CHILD_EL_ATTR);

  return handlers[nodeName];
}

/**
 * Returns a collection of event handlers grouped by event type and keyed by their node name.
 * @param listeners {object}
 * @returns {object}
 */
export function getGroupedEvents(listeners) {
  return Object.keys(listeners).reduce((acc, nodeName) => {
    const nodeEvents = listeners[nodeName];

    return Object.keys(nodeEvents).reduce((accCallbacks, eventType) => {
      const eventName = getNormalisedEventName(eventType);

      return {
        ...accCallbacks,
        [eventName]: Object.assign({}, accCallbacks[eventName], {
          [nodeName]: nodeEvents[eventType]
        })
      };
    }, acc);
  }, {});
}

/**
 * Binds multiple events by a collection of listeners.
 * @param rootElement {Element}
 * @param eventHandlers {object}
 */
export function bindEventListeners(rootElement, eventHandlers) {
  const groupedEvents = getGroupedEvents(eventHandlers);

  Object.keys(groupedEvents).forEach((eventName) => {
    const handlers = groupedEvents[eventName];

    rootElement.addEventListener(eventName, (e) => {
      const handler = getMatchingHandler(e, handlers);

      if (handler) {
        handler(e);
      }

      if (handlers[ROOT_EVENT_NODE_NAME]) {
        handlers[ROOT_EVENT_NODE_NAME](e);
      }
    });
  });
}
