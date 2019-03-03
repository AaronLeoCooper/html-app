import { getNewEl, dispatchEvent } from './__mocks__/dom';
import { CHILD_ATTR, ROOT_ATTR } from './constants';

import { bindEventHandlers } from './events';

import HTMLApp from './HTMLApp';

jest.mock('./events');

describe('HTMLApp', () => {
  describe('No root node in the DOM', () => {
    it('Should throw an error when no root element is in the DOM when initialised', () => {
      expect(() => new HTMLApp()).toThrowError();
    });
  });

  describe('Root node in the DOM', () => {
    let rootNode;

    beforeEach(() => {
      jest.spyOn(window, 'addEventListener');

      rootNode = getNewEl({
        attributes: [
          ['id', 'temp-div'],
          [ROOT_ATTR]
        ]
      });

      document.body.appendChild(rootNode);
    });

    afterEach(() => {
      jest.clearAllMocks();

      if (rootNode) {
        rootNode.remove();
      }
    });

    describe('On load', () => {
      it('Should bind a window load event listener when initialised', () => {
        new HTMLApp();

        expect(window.addEventListener).toHaveBeenCalledTimes(2);

        const firstEventListener = window.addEventListener.mock.calls[0];

        expect(firstEventListener[0]).toBe('load');
        expect(typeof firstEventListener[1]).toBe('function');
      });

      it('Should call onLoadApp if provided when the window is loaded', () => {
        const onLoadApp = jest.fn();

        new HTMLApp({ onLoadApp });

        dispatchEvent(window, 'load');

        expect(onLoadApp).toHaveBeenCalledTimes(1);
        expect(onLoadApp).toHaveBeenCalledWith([]);
      });

      it('Should call onLoadApp with all child nodes when the window is loaded', () => {
        rootNode.innerHTML =
          `<button ${CHILD_ATTR}="button1"></button>` +
          '<button></button>' +
          `<button ${CHILD_ATTR}="button2"></button>`;

        const onLoadApp = jest.fn();

        new HTMLApp({ onLoadApp });

        dispatchEvent(window, 'load');

        expect(onLoadApp).toHaveBeenCalledTimes(1);
        expect(onLoadApp).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ id: 'button1' }),
            expect.objectContaining({ id: 'button2' })
          ])
        );
      });
    });

    describe('On unload', () => {
      it('Should bind a window beforeunload event listener when initialised', () => {
        new HTMLApp();

        expect(window.addEventListener).toHaveBeenCalledTimes(2);

        const secondEventListener = window.addEventListener.mock.calls[1];

        expect(secondEventListener[0]).toBe('beforeunload');
        expect(typeof secondEventListener[1]).toBe('function');
      });

      it('Should call onUnloadApp is provided before the window unloads', () => {
        const onUnloadApp = jest.fn();

        new HTMLApp({ onUnloadApp });

        dispatchEvent(window, 'beforeunload');

        expect(onUnloadApp).toHaveBeenCalledTimes(1);
      });
    });

    describe('Binding event handlers', () => {
      it('Should not call bindEventHandlers when no eventHandlers are provided', () => {
        new HTMLApp();

        dispatchEvent(window, 'load');

        expect(bindEventHandlers).toHaveBeenCalledTimes(0);
      });

      it('Should not call bindEventHandlers when no eventHandlers have matching child nodes', () => {
        new HTMLApp({
          eventHandlers: [
            { id: 'unknownNode1', onClick: () => undefined },
            { id: 'unknownNode2', onClick: () => undefined }
          ]
        });

        dispatchEvent(window, 'load');

        expect(bindEventHandlers).toHaveBeenCalledTimes(0);
      });

      it('Should call bindEventHandlers with enhanced rootNode and event handlers', () => {
        rootNode.innerHTML =
          `<button ${CHILD_ATTR}="button1"></button>` +
          `<button ${CHILD_ATTR}="button2"></button>`;

        const button1 = rootNode.querySelector(`[${CHILD_ATTR}="button1"]`);
        const button2 = rootNode.querySelector(`[${CHILD_ATTR}="button2"]`);

        const eventHandlers = [
          { id: 'button1', onClick: () => undefined },
          { id: 'button2', onClick: () => undefined }
        ];

        new HTMLApp({ eventHandlers });

        dispatchEvent(window, 'load');

        expect(bindEventHandlers).toHaveBeenCalledTimes(1);

        expect(bindEventHandlers.mock.calls[0][0].el).toEqual(rootNode);

        expect(bindEventHandlers.mock.calls[0][1][0].enhancedEl.el).toEqual(button1);
        expect(bindEventHandlers.mock.calls[0][1][1].enhancedEl.el).toEqual(button2);
      });
    });
  });
});
