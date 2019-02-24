/* global HTMLApp */

const formState = {
  firstName: '',
  lastName: '',
  aboutYou: '',
  gender: '',
  preferredOs: ''
};

const getChangeHandler = (name) => (e) => {
  formState[name] = e.target.value;

  console.info('new formState:', formState);
};

new HTMLApp({
  appName: 'main',
  debug: true,
  onLoadApp: (childNodes) => {
    console.info('app loaded');
    console.info('childNodes', childNodes);

    Object.keys(formState).forEach((fieldName) => {
      const field = childNodes.find(({ id }) => id === fieldName);

      field.el.value = formState[fieldName];
    });
  },
  eventHandlers: [
    {
      id: 'firstName',
      onChange: getChangeHandler('firstName')
    },
    {
      id: 'lastName',
      onChange: getChangeHandler('lastName')
    },
    {
      id: 'aboutYou',
      onChange: getChangeHandler('aboutYou')
    },
    {
      id: 'gender',
      onChange: getChangeHandler('gender')
    },
    {
      id: 'preferredOs',
      onChange: getChangeHandler('preferredOs')
    },
    {
      id: 'submitButton',
      onClick: (e) => {
        console.log('submit clicked', e);
      }
    }
  ]
});
