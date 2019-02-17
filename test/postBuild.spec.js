import { statSync } from 'fs';
import { resolve } from 'path';

import ESPackageDefault from '../dist/html-app.es';

const esPackageStats = statSync(resolve(__dirname, '../dist/html-app.es.js'));
const browserPackageStats = statSync(resolve(__dirname, '../dist/html-app.browser.js'));
const browserMinPackageStats = statSync(resolve(__dirname, '../dist/html-app.browser.min.js'));

const esFileSizeThreshold = [7000, 12000];
const browserFileSizeThreshold = [7000, 12000];
const browserMinFileSizeThreshold = [2500, 7000];

describe('Post-build tests', () => {
  describe('ES package', () => {
    const { size } = esPackageStats;

    it('Should have built a minified ES package of a reasonable size', () => {
      expect(size).toBeGreaterThan(esFileSizeThreshold[0]);
      expect(size).toBeLessThan(esFileSizeThreshold[1]);
    });

    it('Should export the main app function as a default export', () => {
      expect(typeof ESPackageDefault).toBe('function');
    });
  });

  describe('Browser package', () => {
    const { size } = browserPackageStats;

    it('Should have built a browser package of a reasonable size', () => {
      expect(size).toBeGreaterThan(browserFileSizeThreshold[0]);
      expect(size).toBeLessThan(browserFileSizeThreshold[1]);
    });
  });

  describe('Minified browser package', () => {
    const { size } = browserMinPackageStats;
    const { size: unminifiedSize } = browserPackageStats;

    it('Should have built a minified browser package of a reasonable size', () => {
      expect(size).toBeGreaterThan(browserMinFileSizeThreshold[0]);
      expect(size).toBeLessThan(browserMinFileSizeThreshold[1]);
    });

    it('Should have built a minified browser package much smaller than the non-minified one', () => {
      expect(size).toBeLessThan(unminifiedSize / 2);
    });
  });
});
