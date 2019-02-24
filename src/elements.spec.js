import { getDom } from './__mocks__/dom';

import { getEnhancedElement } from './elements';

describe('elements', () => {
  describe('getEnhancedElement', () => {
    it('Should return the passed element wrapped with helper methods', () => {
      const div = getDom();

      const result = getEnhancedElement(div);

      expect(result.el).toEqual(div);
    });
  });
});
