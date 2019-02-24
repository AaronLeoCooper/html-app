import  { CHILD_EL_ATTR } from './constants';
import { getNormalisedEventName, getChildNode, isCamelcaseEventName } from './utils';

/**
 * Returns an array of matching handler objects for the given event, if any.
 * @param rootNode {Element}
 * @param e {Event}
 * @param handlers {{id: string, root: boolean, document: boolean, callback: Function}[]}
 * @returns {{id: string, callback: Function}[]}
 */
export function getMatchingHandlers(rootNode, e, handlers) {
  const targetNode = e.target;
  const targetNodeName = targetNode.getAttribute(CHILD_EL_ATTR);

  return handlers.filter(({ id, root, ignoreChildren }) => {
    if (root) {
      const isRootNode = e.target === e.currentTarget;

      return isRootNode || !ignoreChildren;
    }

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
 * @param eventHandlers {EventHandler[]}
 * @returns {{eventType: string, handlers: Object[]}[]}
 */
export function getGroupedEventHandlers(eventHandlers) {
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
 * Binds multiple event handlers based on their event types.
 * @param rootNode {Element}
 * @param eventHandlers {EventHandler[]}
 */
export function bindEventHandlers(rootNode, eventHandlers) {
  const groupedEventHandlers = getGroupedEventHandlers(eventHandlers);

  groupedEventHandlers.forEach(({ eventType, handlers }) => {
    rootNode.addEventListener(eventType, (e) => {
      getMatchingHandlers(rootNode, e, handlers).forEach(({ callback }) => {
        callback(e);
      });
    });

    const documentHandlers = handlers.filter((handler) => handler.document);

    if (documentHandlers.length > 0) {
      document.addEventListener(eventType, (e) => {
        documentHandlers.forEach(({ callback }) => {
          callback(e);
        });
      });
    }
  });
}
