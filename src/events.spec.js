import { getByText, fireEvent } from 'dom-testing-library';

import { bindEventListeners } from './events';

describe('events', () => {
  describe('bindEventListeners', () => {
    const clickHandlerA = jest.fn();
    const clickHandlerB = jest.fn();
    const clickHandlerC = jest.fn();

    const getDom = () => {
      const div = document.createElement('div');
      div.innerHTML =
        '<button data-ha="button">HA Button</button>' +
        '<button>Not HA Button</button>';

      jest.spyOn(div, 'addEventListener');

      return div;
    };

    const noop = () => undefined;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should bind multiple common event handlers to one event listener', () => {
      const dom = getDom();

      bindEventListeners(dom, [
        {
          event: 'click',
          handlers: [noop, noop, noop]
        },
        {
          event: 'keyDown',
          handlers: [noop, noop]
        }
      ]);

      expect(dom.addEventListener).toHaveBeenCalledTimes(2);
    });

    it('Should trigger multiple callbacks when a data-ha node event is triggered', () => {
      const dom = getDom();

      bindEventListeners(dom, [
        {
          event: 'click',
          handlers: [clickHandlerA, clickHandlerB, clickHandlerC]
        }
      ]);

      fireEvent.click(getByText(dom, 'HA Button'));

      expect(clickHandlerA).toHaveBeenCalledTimes(1);
      expect(clickHandlerB).toHaveBeenCalledTimes(1);
      expect(clickHandlerC).toHaveBeenCalledTimes(1);
    });

    it('Should not trigger callbacks when a non data-ha node event is triggered', () => {
      const dom = getDom();

      bindEventListeners(dom, [
        {
          event: 'click',
          handlers: [clickHandlerA, clickHandlerB, clickHandlerC]
        }
      ]);

      fireEvent.click(getByText(dom, 'Not HA Button'));

      expect(clickHandlerA).toHaveBeenCalledTimes(0);
      expect(clickHandlerB).toHaveBeenCalledTimes(0);
      expect(clickHandlerC).toHaveBeenCalledTimes(0);
    });
  });
});
