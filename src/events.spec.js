import { getByText, fireEvent } from 'dom-testing-library';

import { EL_TARGET_ATTR, ROOT_ATTR } from './constants';

import { getDom } from './__mocks__/dom';
import {
  dummyEventHandlers,
  documentEvents,
  rootEvents,
  node1Events,
  node2Events,
  node3Events
} from './__mocks__/eventHandlers';

import { getMatchingHandlers, getGroupedEventHandlers, bindEventHandlers } from './events';

const noop = () => undefined;

describe('events', () => {
  describe('getMatchingHandlers', () => {
    it('Should return all handlers that match the event target', () => {
      const rootNode = getDom(`<div><button ${EL_TARGET_ATTR}="button1">Button</button></div>`);

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
      const rootNode = getDom(`<div><button ${EL_TARGET_ATTR}="button1">Button</button></div>`);

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
    const getPopulatedDom = () => getDom(
      `<div ${ROOT_ATTR}>` +
        `<button ${EL_TARGET_ATTR}="button1">HA Button 1</button>` +
        `<button ${EL_TARGET_ATTR}="button2">HA Button 2</button>` +
        '<button>Not HA Button</button>' +
      '</div>'
    );

    const button1ClickHandler = jest.fn();
    const button2ClickHandler = jest.fn();

    const eventHandlers = [
      { id: 'button1', onClick: button1ClickHandler, onKeyDown: noop },
      { id: 'button2', onClick: button2ClickHandler },
      { id: 'button2', onClick: button2ClickHandler, ignoreChildren: true },
      { id: 'unknownNode', onClick: noop, onKeyDown: noop }
    ];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('Child events', () => {
      it('Should bind one event listener for each event type', () => {
        const dom = getPopulatedDom();

        jest.spyOn(dom, 'addEventListener');

        bindEventHandlers(dom, eventHandlers);

        expect(dom.addEventListener).toHaveBeenCalledTimes(2);
      });

      it('Should trigger one callback when a matching data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, eventHandlers);

        fireEvent.click(getByText(dom, 'HA Button 1'));

        expect(button1ClickHandler).toHaveBeenCalledTimes(1);
        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should trigger multiple callbacks when a matching data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, eventHandlers);

        fireEvent.click(getByText(dom, 'HA Button 2'));

        expect(button2ClickHandler).toHaveBeenCalledTimes(2);
        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should not trigger callbacks when a non data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, eventHandlers);

        fireEvent.click(getByText(dom, 'Not HA Button'));

        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });

      it('Should not trigger callbacks when an unmatched event type is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, eventHandlers);

        fireEvent.change(getByText(dom, 'HA Button 1'));

        expect(button1ClickHandler).toHaveBeenCalledTimes(0);
        expect(button2ClickHandler).toHaveBeenCalledTimes(0);
      });
    });

    describe('Root events', () => {
      const rootOnClick = jest.fn();
      const rootOnKeyDown = jest.fn();
      const strictRootOnClick = jest.fn();

      const rootEventHandlers = [
        ...eventHandlers,
        { root: true, onClick: rootOnClick, onKeyDown: rootOnKeyDown },
        { root: true, onClick: strictRootOnClick, ignoreChildren: true }
      ];

      it('Should trigger a root callback when a child data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, rootEventHandlers);

        fireEvent.click(getByText(dom, 'HA Button 1'));

        expect(rootOnClick).toHaveBeenCalledTimes(1);
        expect(rootOnKeyDown).toHaveBeenCalledTimes(0);
      });

      it('Should trigger a root callback when a non data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, rootEventHandlers);

        fireEvent.click(getByText(dom, 'Not HA Button'));

        expect(rootOnClick).toHaveBeenCalledTimes(1);
        expect(rootOnKeyDown).toHaveBeenCalledTimes(0);
      });

      it('Should should trigger a root callback with ignoreChildren: true when a root node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, rootEventHandlers);

        fireEvent.click(getByText(dom, 'Not HA Button'));

        expect(strictRootOnClick).toHaveBeenCalledTimes(0);
      });

      it('Should not trigger a root callback with ignoreChildren: true when a non data-ha node event is triggered', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, rootEventHandlers);

        fireEvent.click(getByText(dom, 'Not HA Button'));

        expect(strictRootOnClick).toHaveBeenCalledTimes(0);
      });
    });

    describe('Document events', () => {
      const documentOnClick = jest.fn();
      const documentOnChange = jest.fn();

      const documentEventHandlers = [
        ...eventHandlers,
        { root: true, onClick: documentOnClick, onChange: documentOnChange }
      ];

      it('Should trigger a document event callback when any node event is trigger', () => {
        const dom = getPopulatedDom();

        bindEventHandlers(dom, documentEventHandlers);

        fireEvent.click(getByText(dom, 'Not HA Button'));

        expect(documentOnClick).toHaveBeenCalledTimes(1);
        expect(documentOnChange).toHaveBeenCalledTimes(0);
      });
    });
  });
});
