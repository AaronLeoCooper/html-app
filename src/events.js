import { getNormalisedEventName, isCamelcaseEventName } from './utils';

/**
 * Returns an array of matching handler objects for the given event, if any.
 * @param e {Event}
 * @param handlers {{enhancedEl: EnhancedElement, id: string, root: boolean, document: boolean, callback: Function}[]}
 * @param enhancedRootNode {EnhancedElement}
 * @returns {{id: string, callback: Function}[]}
 */
export function getMatchingHandlers(e, handlers, enhancedRootNode) {
  const targetNode = e.target;

  return handlers.filter(({ enhancedEl, root, ignoreChildren }) => {
    if (root) {
      const isRootNode = targetNode === enhancedRootNode.el;

      return isRootNode || !ignoreChildren;
    }

    if (targetNode === enhancedEl.el) {
      return true;
    } else if (!ignoreChildren) {
      return enhancedEl.el.contains(targetNode);
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
  return eventHandlers.reduce((accFinalEventGroups, eventHandler) => {
    const newHandler = Object.keys(eventHandler)
      .filter((optionKey) => !isCamelcaseEventName(optionKey))
      .reduce((accHandler, optionKey) => ({
        ...accHandler,
        [optionKey]: eventHandler[optionKey]
      }), {});

    const newEvents = Object.keys(eventHandler)
      .filter(isCamelcaseEventName)
      .reduce((accEventGroups, eventKey) => {
        const handlerWithCallback = {
          ...newHandler,
          callback: eventHandler[eventKey]
        };

        const eventType = getNormalisedEventName(eventKey);

        const existingEventGroup = accEventGroups
          .find((eventGroup) => eventGroup.eventType === eventType);

        if (existingEventGroup) {
          return accEventGroups.map((accEvent) => {
            if (accEvent.eventType === eventType) {
              return {
                eventType,
                handlers: [...existingEventGroup.handlers, handlerWithCallback]
              };
            }

            return accEvent;
          });
        }

        return [
          ...accEventGroups,
          {
            eventType,
            handlers: [handlerWithCallback]
          }
        ];
      }, accFinalEventGroups);

    return newEvents;
  }, []);
}

/**
 * Binds multiple event handlers based on their event types.
 * @param enhancedRootNode {EnhancedElement}
 * @param eventHandlers {EventHandler[]}
 * @param appInstance {Object} - The main app instance object
 */
export function bindEventHandlers(enhancedRootNode, eventHandlers, appInstance) {
  const groupedEventHandlers = getGroupedEventHandlers(eventHandlers);

  groupedEventHandlers.forEach(({ eventType, handlers }) => {
    const nonDocumentHandlers = handlers.filter((handler) => !handler.document);

    enhancedRootNode.el.addEventListener(eventType, (e) => {
      getMatchingHandlers(e, nonDocumentHandlers, enhancedRootNode)
        .forEach(({ callback, root, enhancedEl }) => {
          const callbackEnhancedEl = root
            ? enhancedRootNode
            : enhancedEl;

          callback(e, callbackEnhancedEl, appInstance);
        });
    });

    const documentHandlers = handlers.filter((handler) => handler.document);

    if (documentHandlers.length > 0) {
      document.addEventListener(eventType, (e) => {
        documentHandlers.forEach(({ callback }) => {
          callback(e, appInstance);
        });
      });
    }
  });
}
