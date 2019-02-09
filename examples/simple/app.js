/* global HTMLApp */

const mainApp = new HTMLApp({
  appName: 'main',
  debug: true,
  onLoadApp: (childNodes) => {
    console.info('app loaded');
    console.info('childNodes', childNodes);
  }
});