/* global HTMLApp */

const formState = {
  firstName: '',
  lastName: '',
  aboutYou: '',
  gender: '',
  preferredOs: 'none'
};

const getChangeHandler = (name) => (e) => formState[name] = e.target.value;

new HTMLApp({
  appName: 'main',
  debug: true,
  onLoadApp: (childNodes) => {
    console.info('childNodes', childNodes);

    Object.keys(formState).forEach((fieldName) => {
      const field = childNodes.find(({ id }) => id === fieldName);

      if (!field.el.type || field.el.type !== 'radio') {
        field.el.value = formState[fieldName];
      }
    });

    childNodes
      .filter(({ id }) => id === 'preferredOs')
      .forEach(({ el }) => {
        if (el.value === formState.preferredOs) {
          el.checked = true;
        }
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
        e.preventDefault();

        Object.keys(formState).forEach((key) => {
          const fieldWrapper = document.querySelector(`[data-ha="${key}Field"]`);

          if (!formState[key]) {
            fieldWrapper.classList.add('required');
          } else {
            fieldWrapper.classList.remove('required');
          }
        });
      }
    }
  ]
});
