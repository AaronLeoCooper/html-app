import { getDom } from './__mocks__/dom';
import { CHILD_EL_ATTR, ROOT_EL_ATTR } from './constants';

import { bindEventHandlers } from './events';

import HTMLApp from './HTMLApp';

jest.mock('./events');
jest.mock('./elements');

const loadWindow = () => {
  const loadEvent = new CustomEvent('load');
  window.dispatchEvent(loadEvent);
};

describe('HTMLApp', () => {
  describe('Root node not in the DOM', () => {
    it('Should throw an error when no root element is in the DOM when initialised', () => {
      expect(() => new HTMLApp()).toThrowError();
    });
  });

  describe('Root node in the DOM', () => {
    beforeEach(() => {
      jest.spyOn(window, 'addEventListener');

      const div = getDom(`<div id="temp-div" ${ROOT_EL_ATTR}></div>`);
      document.body.appendChild(div);
    });

    afterEach(() => {
      jest.clearAllMocks();

      const tempDiv = document.body.querySelector('#temp-div');

      if (tempDiv) {
        tempDiv.remove();
      }
    });

    it('Should bind a window load event listener when initialised', () => {
      new HTMLApp();

      expect(window.addEventListener).toHaveBeenCalledTimes(2);

      const firstEventListener = window.addEventListener.mock.calls[0];

      expect(firstEventListener[0]).toBe('load');
      expect(typeof firstEventListener[1]).toBe('function');
    });

    it('Should bind a window beforeunload event listener when initialised', () => {
      new HTMLApp();

      expect(window.addEventListener).toHaveBeenCalledTimes(2);

      const secondEventListener = window.addEventListener.mock.calls[1];

      expect(secondEventListener[0]).toBe('beforeunload');
      expect(typeof secondEventListener[1]).toBe('function');
    });

    it('Should call onLoadApp if provided when the window is loaded', () => {
      const onLoadApp = jest.fn();

      new HTMLApp({ onLoadApp });

      loadWindow();

      expect(onLoadApp).toHaveBeenCalledTimes(1);
      expect(onLoadApp).toHaveBeenCalledWith([]);
    });

    it('Should call onLoadApp if provided with all child nodes when the window is loaded', () => {
      document.body
        .querySelector('#temp-div')
        .innerHTML = `<button ${CHILD_EL_ATTR}="button1"></button><button ${CHILD_EL_ATTR}="button2"></button>`;

      const onLoadApp = jest.fn();

      new HTMLApp({ onLoadApp });

      loadWindow();

      expect(onLoadApp).toHaveBeenCalledTimes(1);
      expect(onLoadApp.mock.calls[0][0]).toHaveLength(2);
    });

    it('Should not call bindEventHandlers when no eventHandlers are provided', () => {
      new HTMLApp();

      loadWindow();

      expect(bindEventHandlers).toHaveBeenCalledTimes(0);
    });

    it('Should call bindEventHandlers when eventHandlers are provided', () => {
      new HTMLApp({
        eventHandlers: [
          {
            id: 'node',
            onClick: () => undefined
          }
        ]
      });

      loadWindow();

      expect(bindEventHandlers).toHaveBeenCalledTimes(1);
    });
  });
});
