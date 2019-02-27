import { getDom } from './__mocks__/dom';
import { EL_TARGET_ATTR, LIB_NAME, ROOT_ATTR } from './constants';

import {
  logDebug,
  getRootNode,
  getNormalisedEventName,
  getChildNode,
  isCamelcaseEventName
} from './utils';

describe('utils', () => {
  describe('logDebug', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should not log a message to the console when opts.debug is false', () => {
      jest.spyOn(console, 'info');

      const app = {
        opts: { debug: false }
      };

      logDebug(app, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(0);
    });

    it('Should log a prefixed message to the console when opts.debug is true', () => {
      jest.spyOn(console, 'info');

      const app = {
        opts: { debug: true }
      };

      logDebug(app, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info.mock.calls[0][0]).toBe(`%c[DEBUG ${LIB_NAME}]:`);
      expect(console.info.mock.calls[0][2]).toBe('abc');
      expect(console.info.mock.calls[0][3]).toBe(123);
    });

    it('Should log a prefixed message with the appName to the console when opts.debug is true', () => {
      jest.spyOn(console, 'info');

      const app = {
        opts: { debug: true, appName: 'testApp' }
      };

      logDebug(app, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info.mock.calls[0][0]).toBe(`%c[DEBUG ${LIB_NAME} testApp]:`);
      expect(console.info.mock.calls[0][2]).toBe('abc');
      expect(console.info.mock.calls[0][3]).toBe(123);
    });
  });

  describe('getRootNode', () => {
    const div = getDom(`<div ${ROOT_ATTR} id="test-htmlapp"></div>`);

    afterEach(() => {
      if (document.querySelector('#test-htmlapp')) {
        document.querySelector('#test-htmlapp').remove();
      }
    });

    it('Should return the element with the root attribute', () => {
      document.querySelector('body').appendChild(div);

      const rootElement = getRootNode();

      expect(rootElement.id).toBe('test-htmlapp');
    });

    it('Should throw an app error when there is no root element found', () => {
      expect(() => getRootNode()).toThrowError();
    });
  });

  describe('getNormalisedEventName', () => {
    it('Should convert "onEventName" to "eventname"', () => {
      const result = getNormalisedEventName('onEventName');

      expect(result).toBe('eventname');
    });
  });

  describe('getChildNode', () => {
    it('Should return null when the child element is not within the rootNode', () => {
      const rootNode = getDom('<div><div></div></div>');

      const result = getChildNode(rootNode, '');

      expect(result).toBeNull();
    });

    it('Should return null when the child element is not within the rootNode', () => {
      const rootNode = getDom(
        `<div><div ${EL_TARGET_ATTR}="test-child" id="test-child-node"></div></div>`
      );

      const result = getChildNode(rootNode, 'test-child');

      expect(result).toBeInstanceOf(Node);
      expect(result.id).toBe('test-child-node');
    });
  });

  describe('isCamelcaseEventName', () => {
    it('Should return true when the passed string starts with "on" followed by a capital letter', () => {
      ['onAbc', 'onBCd', 'onCDE', 'onXyz', 'onYZa', 'onZAB'].forEach((name) => {
        const result = isCamelcaseEventName(name);

        expect(result).toBe(true);
      });
    });

    it('Should return false when the passed string does not start with "on"', () => {
      const result = isCamelcaseEventName('keyDown');

      expect(result).toBe(false);
    });

    it('Should return false when the passed starts with "on" followed by a lower case letter', () => {
      ['onaBc', 'onbcD', 'oncde'].forEach((name) => {
        const result = isCamelcaseEventName(name);

        expect(result).toBe(false);
      });
    });

    it('Should return false when only "on" is passed', () => {
      const result = isCamelcaseEventName('on');

      expect(result).toBe(false);
    });
  });
});
