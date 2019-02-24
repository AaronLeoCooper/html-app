import HTMLApp from './index';

describe('index', () => {
  it('Should export HTMLApp as a default export', () => {
    expect(typeof HTMLApp).toBe('function');
  });
});
