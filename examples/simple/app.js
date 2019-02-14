/* global HTMLApp */

new HTMLApp({
  appName: 'main',
  debug: true,
  onLoadApp: (childNodes) => {
    console.info('app loaded');
    console.info('childNodes', childNodes);
  },
  listeners: {
    firstName: {
      onChange: (e, app) => {
        app.setState({
          formValues: e.target.value
        });
      }
    }
  }
});
