import { getByText, fireEvent } from 'dom-testing-library';

import { ROOT_EVENT_NODE_NAME } from './constants';

import { getGroupedEvents, bindEventListeners } from './events';

describe('events', () => {
  const noop = () => undefined;

  describe('getGroupedEvents', () => {
    it('should return event handlers grouped into event type and keyed by node name', () => {
      const eventHandlers = {
        node1: {
          onClick: noop,
          onKeyDown: noop
        },
        node2: {
          onClick: noop
        },
        node3: {
          onKeyDown: noop,
          onKeyUp: noop
        }
      };

      expect(getGroupedEvents(eventHandlers)).toEqual({
        click: {
          node1: noop,
          node2: noop
        },
        keydown: {
          node1: noop,
          node3: noop
        },
        keyup: {
          node3: noop
        }
      });
    });
  });

  describe('bindEventListeners', () => {
    const getDom = () => {
      const div = document.createElement('div');
      div.innerHTML =
        '<button data-ha="button1">HA Button 1</button>' +
        '<button data-ha="button2">HA Button 2</button>' +
        '<button>Not HA Button</button>';

      jest.spyOn(div, 'addEventListener');

      return div;
    };

    const button1ClickHandler = jest.fn();
    const button2ClickHandler = jest.fn();
    const rootClickHandler = jest.fn();

    const eventHandlers = {
      button1: {
        onClick: button1ClickHandler,
        onKeyDown: noop
      },
      button2: {
        onClick: button2ClickHandler
      },
      unknownNode: {
        onClick: noop,
        onKeyDown: noop
      }
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should bind one event listener for each event type', () => {
      const dom = getDom();

      bindEventListeners(dom, eventHandlers);

      expect(dom.addEventListener).toHaveBeenCalledTimes(2);
    });

    it('Should trigger one callback when a matching data-ha node event is triggered', () => {
      const dom = getDom();

      bindEventListeners(dom, eventHandlers);

      fireEvent.click(getByText(dom, 'HA Button 1'));

      expect(button1ClickHandler).toHaveBeenCalledTimes(1);
      expect(button2ClickHandler).toHaveBeenCalledTimes(0);
    });

    it('Should not trigger callbacks when a non data-ha node event is triggered', () => {
      const dom = getDom();

      bindEventListeners(dom, eventHandlers);

      fireEvent.click(getByText(dom, 'Not HA Button'));

      expect(button1ClickHandler).toHaveBeenCalledTimes(0);
      expect(button2ClickHandler).toHaveBeenCalledTimes(0);
    });

    it('Should trigger root callback when an event is triggered on a data-ha node', () => {
      const dom = getDom();

      bindEventListeners(dom, {
        [ROOT_EVENT_NODE_NAME]: {
          onClick: rootClickHandler
        }
      });

      fireEvent.click(getByText(dom, 'HA Button 2'));

      expect(rootClickHandler).toHaveBeenCalledTimes(1);
    });

    it('Should trigger root and matching node callback when an event is triggered on a data-ha node', () => {
      const dom = getDom();

      bindEventListeners(dom, {
        button2: {
          onClick: button2ClickHandler
        },
        [ROOT_EVENT_NODE_NAME]: {
          onClick: rootClickHandler
        }
      });

      fireEvent.click(getByText(dom, 'HA Button 2'));

      expect(button2ClickHandler).toHaveBeenCalledTimes(1);
      expect(rootClickHandler).toHaveBeenCalledTimes(1);
    });

    it('Should trigger root callback when an event is triggered on a non data-ha node', () => {
      const dom = getDom();

      bindEventListeners(dom, {
        [ROOT_EVENT_NODE_NAME]: {
          onClick: rootClickHandler
        }
      });

      fireEvent.click(getByText(dom, 'Not HA Button'));

      expect(rootClickHandler).toHaveBeenCalledTimes(1);
    });
  });
});
