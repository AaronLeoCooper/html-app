import { getByText, fireEvent } from 'dom-testing-library';

import { CHILD_ATTR, ROOT_ATTR } from './constants';

import { getNewEl } from './__mocks__/dom';
import {
  dummyEventHandlers,
  documentEvents,
  rootEvents,
  node1Events,
  node2Events,
  node3Events
} from './__mocks__/eventHandlers';

import { getMatchingHandlers, getGroupedEventHandlers, bindEventHandlers } from './events';
import { getEnhancedElement } from './elements';

const noop = () => undefined;

describe('events', () => {
  describe('getMatchingHandlers', () => {
    const getEnhancedRootNode = (content) => {
      const rootNode = getNewEl({ content });

      return getEnhancedElement(rootNode);
    };

    it('Should return all handlers that match the event target', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
          `<button ${CHILD_ATTR}="button2">Button 2</button>` +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);
      const button2Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button2"]`);

      const e = { target: button1Node };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop },
        { enhancedEl: getEnhancedElement(button2Node), callback: noop },
        { enhancedEl: getEnhancedElement(button1Node), callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[0],
        handlers[2]
      ]);
    });

    it('Should return an empty array when no handlers match the event target', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
          '<p></p>' +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);

      const e = { target: enhancedRootNode.el.querySelector('p') };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([]);
    });

    it('Should return matching handlers when event target is a child element', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">` +
            'Button 1' +
            '<span>Span</span>' +
          '</button>' +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);
      const spanNode = enhancedRootNode.el.querySelector('span');

      const e = { target: spanNode };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[0]
      ]);
    });

    it('Should return no matching handlers when target is a child and ignoreChildren: true', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">` +
            'Button 1' +
            '<span>Span</span>' +
          '</button>' +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);
      const spanNode = enhancedRootNode.el.querySelector('span');

      const e = { target: spanNode };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop, ignoreChildren: true }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([]);
    });

    it('Should return matching handlers when target matches handler exactly and ignoreChildren: true', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);

      const e = { target: button1Node };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop, ignoreChildren: true }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[0]
      ]);
    });

    it('Should return matching root and child handlers', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);

      const e = { target: button1Node };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop },
        { root: true, callback: noop }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[0],
        handlers[1]
      ]);
    });

    it('Should return matching root handler when target is root and ignoreChildren: true', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);

      const e = { target: enhancedRootNode.el };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop },
        { root: true, callback: noop, ignoreChildren: true }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[1]
      ]);
    });

    it('Should return no root handler when target is a child node and ignoreChildren: true', () => {
      const enhancedRootNode = getEnhancedRootNode(
        '<div>' +
          `<button ${CHILD_ATTR}="button1">Button 1</button>` +
        '</div>'
      );

      const button1Node = enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`);

      const e = { target: button1Node };

      const handlers =  [
        { enhancedEl: getEnhancedElement(button1Node), callback: noop },
        { root: true, callback: noop, ignoreChildren: true }
      ];

      const matchingHandlers = getMatchingHandlers(e, handlers, enhancedRootNode);

      expect(matchingHandlers).toEqual([
        handlers[0]
      ]);
    });
  });
  
  describe('getGroupedEventHandlers', () => {
    it('Should return event handlers grouped by event type', () => {
      expect(getGroupedEventHandlers(dummyEventHandlers)).toEqual([
        {
          eventType: 'click',
          handlers: [
            { document: true, callback: documentEvents.onClick },
            { root: true, callback: rootEvents.onClick },
            { id: 'node1', callback: node1Events.onClick },
            { id: 'node2', callback: node2Events.onClick, otherOption: 'abc' }
          ]
        },
        {
          eventType: 'change',
          handlers: [
            { root: true, callback: rootEvents.onChange }
          ]
        },
        {
          eventType: 'keydown',
          handlers: [
            { id: 'node1', callback: node1Events.onKeyDown },
            { id: 'node3', callback: node3Events.onKeyDown, otherOption: 'def' }
          ]
        },
        {
          eventType: 'keyup',
          handlers: [
            { id: 'node3', callback: node3Events.onKeyUp, otherOption: 'def' }
          ]
        }
      ]);
    });
  });

  describe('bindEventHandlers', () => {
    const button1ClickHandler = jest.fn();
    const button2ClickHandler = jest.fn();

    const appInstance = { isTestApp: true };

    let enhancedRootNode;
    let eventHandlers;

    beforeEach(() => {
      jest.clearAllMocks();

      enhancedRootNode = getEnhancedElement(
        getNewEl({
          attributes: [[ROOT_ATTR]],
          content:
            `<button ${CHILD_ATTR}="button1">HA Button 1</button>` +
            `<button ${CHILD_ATTR}="button2">HA Button 2</button>` +
            '<button>Not HA Button</button>'
        })
      );

      const button1 = getEnhancedElement(enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button1"]`));
      const button2 = getEnhancedElement(enhancedRootNode.el.querySelector(`[${CHILD_ATTR}="button2"]`));

      eventHandlers = [
        { enhancedEl: button1, onClick: button1ClickHandler, onKeyDown: noop },
        { enhancedEl: button2, onClick: button2ClickHandler },
        { enhancedEl: button2, onClick: button2ClickHandler, ignoreChildren: true }
      ];
    });

    describe('Child events', () => {
      it('Should bind one event listener for each event type', () => {
        jest.spyOn(enhancedRootNode.el, 'addEventListener');

        bindEventHandlers(enhancedRootNode, eventHandlers, appInstance);

        expect(enhancedRootNode.el.addEventListener).toHaveBeenCalledTimes(2);
      });

      it('Should trigger one callback with event and enhanced node when matching node event triggered', () => {
        bindEventHandlers(enhancedRootNode, eventHandlers, appInstance);

        const button1 = getByText(enhancedRootNode.el, 'HA Button 1');
        fireEvent.click(button1);

        expect(button1ClickHandler).toHaveBeenCalledTimes(1);
        expect(button1ClickHandler.mock.calls[0][0].target).toEqual(button1);
        expect(button1ClickHandler.mock.calls[0][1].id).toBe('button1');
        expect(button1ClickHandler.mock.calls[0][2]).toEqual(appInstance);

        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should trigger multiple callbacks with event and enhanced node when matching data-ha node event triggered', () => {
        bindEventHandlers(enhancedRootNode, eventHandlers, appInstance);

        const button2 = getByText(enhancedRootNode.el, 'HA Button 2');
        fireEvent.click(button2);

        expect(button2ClickHandler).toHaveBeenCalledTimes(2);
        expect(button2ClickHandler.mock.calls[0][0].target).toEqual(button2);
        expect(button2ClickHandler.mock.calls[0][1].id).toBe('button2');
        expect(button2ClickHandler.mock.calls[0][2]).toEqual(appInstance);

        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should not trigger callbacks when a non data-ha node event is triggered', () => {
        bindEventHandlers(enhancedRootNode, eventHandlers, appInstance);

        fireEvent.click(getByText(enhancedRootNode.el, 'Not HA Button'));

        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should not trigger callbacks when an unmatched event type is triggered', () => {
        bindEventHandlers(enhancedRootNode, eventHandlers, appInstance);

        fireEvent.change(getByText(enhancedRootNode.el, 'HA Button 1'));

        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });
    });

    describe('Root events', () => {
      const rootOnClick = jest.fn();
      const rootOnKeyDown = jest.fn();
      const strictRootOnClick = jest.fn();

      let rootEventHandlers;

      beforeEach(() => {
        rootEventHandlers = [
          ...eventHandlers,
          { root: true, onClick: rootOnClick, onKeyDown: rootOnKeyDown },
          { root: true, onClick: strictRootOnClick, ignoreChildren: true }
        ];
      });

      it('Should trigger root callback with expected target and enhanced root node when child data-ha node event triggered', () => {
        bindEventHandlers(enhancedRootNode, rootEventHandlers, appInstance);

        const button1 = getByText(enhancedRootNode.el, 'HA Button 1');
        fireEvent.click(button1);

        expect(rootOnClick).toHaveBeenCalledTimes(1);
        expect(rootOnClick.mock.calls[0][0].target).toEqual(button1);
        expect(rootOnClick.mock.calls[0][1].el).toEqual(enhancedRootNode.el);
        expect(rootOnClick.mock.calls[0][2]).toEqual(appInstance);

        expect(rootOnKeyDown).toHaveBeenCalledTimes(0);
      });

      it('Should trigger root callback with expected target and enhanced root node when non data-ha node event triggered', () => {
        bindEventHandlers(enhancedRootNode, rootEventHandlers, appInstance);

        const nonHaButton = getByText(enhancedRootNode.el, 'Not HA Button');
        fireEvent.click(nonHaButton);

        expect(rootOnClick).toHaveBeenCalledTimes(1);
        expect(rootOnClick.mock.calls[0][0].target).toEqual(nonHaButton);
        expect(rootOnClick.mock.calls[0][1].el).toEqual(enhancedRootNode.el);
        expect(rootOnClick.mock.calls[0][2]).toEqual(appInstance);

        expect(rootOnKeyDown).toHaveBeenCalledTimes(0);
      });

      it('Should trigger a root callback with ignoreChildren: true when a root node event is triggered', () => {
        bindEventHandlers(enhancedRootNode, rootEventHandlers, appInstance);

        fireEvent.click(enhancedRootNode.el);

        expect(strictRootOnClick).toHaveBeenCalledTimes(1);
      });

      it('Should not trigger a root callback with ignoreChildren: true when a non data-ha node event is triggered', () => {
        bindEventHandlers(enhancedRootNode, rootEventHandlers, appInstance);

        fireEvent.click(getByText(enhancedRootNode.el, 'Not HA Button'));

        expect(strictRootOnClick).toHaveBeenCalledTimes(0);
      });
    });

    describe('Document events', () => {
      const documentOnClick = jest.fn();
      const documentOnChange = jest.fn();

      let documentEventHandlers;

      beforeEach(() => {
        document.body.appendChild(enhancedRootNode.el);

        documentEventHandlers = [
          ...eventHandlers,
          { document: true, onClick: documentOnClick, onChange: documentOnChange }
        ];
      });

      afterEach(() => {
        if (enhancedRootNode.el) {
          enhancedRootNode.el.remove();
        }
      });

      it('Should trigger a document event callback when any node event is trigger', () => {
        bindEventHandlers(enhancedRootNode, documentEventHandlers, appInstance);

        const nonHaButton = getByText(enhancedRootNode.el, 'Not HA Button');
        fireEvent.click(nonHaButton);

        expect(documentOnClick).toHaveBeenCalledTimes(1);
        expect(documentOnClick.mock.calls[0][0].target).toEqual(nonHaButton);
        expect(documentOnClick.mock.calls[0][1]).toEqual(appInstance);

        expect(documentOnChange).toHaveBeenCalledTimes(0);
      });
    });
  });
});
