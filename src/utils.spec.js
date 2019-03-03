import { getNewEl } from './__mocks__/dom';
import { CHILD_ATTR, LIB_NAME, ROOT_ATTR } from './constants';

import {
  logDebug,
  getRootNode,
  getChildNodes,
  getNormalisedEventName,
  getChildNode,
  isCamelcaseEventName
} from './utils';

describe('utils', () => {
  describe('logDebug', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('Should not log a message to the console when options.debug is false', () => {
      jest.spyOn(console, 'info');

      const options = { debug: false };

      logDebug(options, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(0);
    });

    it('Should log a prefixed message to the console when options.debug is true', () => {
      jest.spyOn(console, 'info');

      const options = { debug: true };

      logDebug(options, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info.mock.calls[0][0]).toBe(`%c[DEBUG ${LIB_NAME}]:`);
      expect(console.info.mock.calls[0][2]).toBe('abc');
      expect(console.info.mock.calls[0][3]).toBe(123);
    });

    it('Should log a prefixed message with the appName to the console when opts.debug is true', () => {
      jest.spyOn(console, 'info');

      const options = { debug: true, appName: 'testApp' };

      logDebug(options, 'abc', 123);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info.mock.calls[0][0]).toBe(`%c[DEBUG ${LIB_NAME} testApp]:`);
      expect(console.info.mock.calls[0][2]).toBe('abc');
      expect(console.info.mock.calls[0][3]).toBe(123);
    });
  });

  describe('getRootNode', () => {
    const div = getNewEl({ content: `<div ${ROOT_ATTR} id="test-htmlapp"></div>` });

    afterEach(() => {
      if (div) {
        div.remove();
      }
    });

    it('Should return the element with the root attribute', () => {
      document.querySelector('body').appendChild(div);

      const rootElement = getRootNode();

      expect(rootElement.id).toBe('test-htmlapp');
    });

    it('Should return null when there is no root element found', () => {
      const rootElement = getRootNode();

      expect(rootElement).toBeNull();
    });
  });

  describe('getChildNodes', () => {
    it('Should return an empty array when no child elements appear within the root node', () => {
      const dom = getNewEl({
        content: `<div ${ROOT_ATTR}><p></p></div><span ${CHILD_ATTR}></span>`
      });

      const rootNode = dom.querySelector(`[${ROOT_ATTR}]`);

      const result = getChildNodes(rootNode);

      expect(result).toEqual([]);
    });

    it('Should return an iterable array of child nodes when child elements appear within the root node', () => {
      const dom = getNewEl({
        content:
          `<div ${ROOT_ATTR}>` +
            `<span ${CHILD_ATTR}="child1"></span>` +
            '<p></p>' +
            `<span ${CHILD_ATTR}="child2"></span>` +
          '</div>'
      });

      const rootNode = dom.querySelector(`[${ROOT_ATTR}]`);
      const child1 = dom.querySelector(`[${CHILD_ATTR}="child1"]`);
      const child2 = dom.querySelector(`[${CHILD_ATTR}="child2"]`);

      const result = getChildNodes(rootNode);

      expect(result).toEqual([child1, child2]);
    });
  });

  describe('getChildNode', () => {
    it('Should return null when the child element is not within the rootNode', () => {
      const rootNode = getNewEl({ content: '<div><div></div></div>' });

      const result = getChildNode(rootNode, '');

      expect(result).toBeNull();
    });

    it('Should return null when the child element is not within the rootNode', () => {
      const rootNode = getNewEl({
        content: `<div><div ${CHILD_ATTR}="test-child" id="test-child-node"></div></div>`
      });

      const result = getChildNode(rootNode, 'test-child');

      expect(result).toBeInstanceOf(Node);
      expect(result.id).toBe('test-child-node');
    });
  });

  describe('getNormalisedEventName', () => {
    it('Should convert "onEventName" to "eventname"', () => {
      const result = getNormalisedEventName('onEventName');

      expect(result).toBe('eventname');
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
