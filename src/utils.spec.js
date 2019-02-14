import { getRootElement } from './utils';

describe('utils', () => {
  describe('getRootElement', () => {
    const div = document.createElement('div');
    div.innerHTML = '<div data-htmlapp id="test-htmlapp"></div>';

    beforeEach(() => {
      if (document.querySelector('#test-htmlapp')) {
        document.querySelector('#test-htmlapp').remove();
      }
    });

    it('should return the element with the root attribute', () => {
      document.querySelector('body').appendChild(div);

      const rootElement = getRootElement();

      expect(rootElement.id).toBe('test-htmlapp');
    });

    it('should throw an app error when there is no root element found', () => {
      expect(() => getRootElement()).toThrowError();
    });
  });
});
