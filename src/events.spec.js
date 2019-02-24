import { getByText, fireEvent } from 'dom-testing-library';

import { CHILD_EL_ATTR } from './constants';

import { getDom } from './__mocks__/dom';
import {
  dummyEventHandlers,
  node1Events,
  node2Events,
  node3Events
} from './__mocks__/eventHandlers';

import { getMatchingHandlers, getGroupedHandlers, bindChildEventHandlers } from './events';

const noop = () => undefined;

describe('events', () => {
  describe('getMatchingHandlers', () => {
    it('Should return all handlers that match the event target', () => {
      const rootNode = getDom(`<div><button ${CHILD_EL_ATTR}="button1">Button</button></div>`);

      const e = {
        target: rootNode.querySelector('button')
      };

      const handlers =  [
        { id: 'button1', callback: noop },
        { id: 'button2', callback: noop },
        { id: 'button1', callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(rootNode, e, handlers);

      expect(matchingHandlers).toEqual([
        handlers[0],
        handlers[2]
      ]);
    });

    it('Should return an empty array when no handlers match the event target', () => {
      const rootNode = getDom(`<div><button ${CHILD_EL_ATTR}="button1">Button</button></div>`);

      const e = {
        target: rootNode.querySelector('button')
      };

      const handlers =  [
        { id: 'button3', callback: noop },
        { id: 'button2', callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(rootNode, e, handlers);

      expect(matchingHandlers).toEqual([]);
    });
  });
  
  describe('getGroupedHandlers', () => {
    it('Should return event handlers grouped by event type', () => {
      expect(getGroupedHandlers(dummyEventHandlers)).toEqual([
        {
          eventType: 'click',
          handlers: [
            {
              id: 'node1',
              callback: node1Events.onClick
            },
            {
              id: 'node2',
              callback: node2Events.onClick,
              otherOption: 'abc'
            }
          ]
        },
        {
          eventType: 'keydown',
          handlers: [
            {
              id: 'node1',
              callback: node1Events.onKeyDown
            },
            {
              id: 'node3',
              callback: node3Events.onKeyDown,
              otherOption: 'def'
            }
          ]
        },
        {
          eventType: 'keyup',
          handlers: [
            {
              id: 'node3',
              callback: node3Events.onKeyUp,
              otherOption: 'def'
            }
          ]
        }
      ]);
    });
  });

  describe('bindChildEventHandlers', () => {
    const getPopulatedDom = () => getDom(
      `<button ${CHILD_EL_ATTR}="button1">HA Button 1</button>` +
      `<button ${CHILD_EL_ATTR}="button2">HA Button 2</button>` +
      '<button>Not HA Button</button>'
    );

    const button1ClickHandler = jest.fn();
    const button2ClickHandler = jest.fn();

    const eventHandlers = [
      {
        id: 'button1',
        onClick: button1ClickHandler,
        onKeyDown: noop
      },
      {
        id: 'button2',
        onClick: button2ClickHandler
      },
      {
        id: 'unknownNode',
        onClick: noop,
        onKeyDown: noop
      }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should bind one event listener for each event type', () => {
      const dom = getPopulatedDom();

      jest.spyOn(dom, 'addEventListener');

      bindChildEventHandlers(dom, eventHandlers);

      expect(dom.addEventListener).toHaveBeenCalledTimes(2);
    });

    it('Should trigger one callback when a matching data-ha node event is triggered', () => {
      const dom = getPopulatedDom();

      bindChildEventHandlers(dom, eventHandlers);

      fireEvent.click(getByText(dom, 'HA Button 1'));

      expect(button1ClickHandler).toHaveBeenCalledTimes(1);
      expect(button2ClickHandler).toHaveBeenCalledTimes(0);
    });

    it('Should not trigger callbacks when a non data-ha node event is triggered', () => {
      const dom = getPopulatedDom();

      bindChildEventHandlers(dom, eventHandlers);

      fireEvent.click(getByText(dom, 'Not HA Button'));

      expect(button1ClickHandler).toHaveBeenCalledTimes(0);
      expect(button2ClickHandler).toHaveBeenCalledTimes(0);
    });
  });
});
