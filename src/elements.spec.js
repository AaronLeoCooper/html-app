import { getDom } from './__mocks__/dom';
import { CHILD_EL_ATTR } from './constants';

import { getEnhancedElement } from './elements';

describe('elements', () => {
  describe('getEnhancedElement', () => {
    it('Should return the passed element wrapped with helper methods', () => {
      const div = getDom(`<button id="test-child" ${CHILD_EL_ATTR}="button1"></button>`);
      const childDiv = div.querySelector('#test-child');

      const result = getEnhancedElement(childDiv);

      expect(result.id).toBe('button1');
      expect(result.el).toEqual(childDiv);
    });
  });
});
