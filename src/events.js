import { CHILD_EL_ATTR } from './constants';
import { getNormalisedEventName, getChildNode, isCamelcaseEventName } from './utils';

/**
 * Returns an array of matching handler objects for the given event, if any.
 * @param rootNode {Element}
 * @param e {Event}
 * @param handlers {{id: string, callback: Function}[]}
 * @returns {{id: string, callback: Function}[]}
 */
export function getMatchingHandlers(rootNode, e, handlers) {
  const targetNode = e.target;
  const targetNodeName = targetNode.getAttribute(CHILD_EL_ATTR);

  return handlers.filter(({ id, ignoreChildren }) => {
    if (targetNodeName === id) {
      return true;
    } else if (!ignoreChildren) {

      const node = getChildNode(rootNode, id);

      if (node) {
        return node.contains(targetNode);
      }
    }

    return false;
  });
}

/**
 * Returns an array of event handler objects grouped by event type.
 * @param eventHandlers {{id: string}[]}
 * @returns {{eventType: string, handlers: Object[]}[]}
 */
export function getGroupedHandlers(eventHandlers) {
  return eventHandlers.reduce((accFinalEvents, eventHandler) => {
    const newHandler = Object.keys(eventHandler)
      .filter((optionKey) => !isCamelcaseEventName(optionKey))
      .reduce((accHandler, optionKey) => ({
        ...accHandler,
        [optionKey]: eventHandler[optionKey]
      }), {});

    const newEvents = Object.keys(eventHandler)
      .filter(isCamelcaseEventName)
      .reduce((accEvents, eventKey) => {
        const callbackNewHandler = {
          ...newHandler,
          callback: eventHandler[eventKey]
        };

        const eventType = getNormalisedEventName(eventKey);

        const existingEventHandler = accEvents
          .find((existingEvent) => existingEvent.eventType === eventType);

        if (existingEventHandler) {
          return accEvents.map((accEvent) => {
            if (accEvent.eventType === eventType) {
              return {
                eventType,
                handlers: [...existingEventHandler.handlers, callbackNewHandler]
              };
            }

            return accEvent;
          });
        }

        return [
          ...accEvents,
          {
            eventType,
            handlers: [callbackNewHandler]
          }
        ];
      }, accFinalEvents);

    return newEvents;
  }, []);
}

/**
 * Binds multiple child event handlers to their required eventHandlers based on their event types.
 * @param rootNode {Element}
 * @param eventHandlers {{id: string}[]}
 */
export function bindChildEventHandlers(rootNode, eventHandlers) {
  const groupedEvents = getGroupedHandlers(eventHandlers);

  groupedEvents.forEach(({ eventType, handlers }) => {
    rootNode.addEventListener(eventType, (e) => {
      getMatchingHandlers(rootNode, e, handlers).forEach(({ callback }) => {
        callback(e);
      });
    });
  });
}
