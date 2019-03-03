/* global HTMLApp */

const formState = {
  firstName: '',
  lastName: '',
  aboutYou: '',
  gender: '',
  preferredOs: 'none'
};

const getChangeHandler = (name) => (e) => formState[name] = e.target.value;

function onLoadApp(rootNode, childNodes) {
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
}

function onSubmit(e, el) {
  e.preventDefault();

  let formHasErrors = false;

  Object.keys(formState)
    .forEach((key) => {
      const fieldWrapper = document.querySelector(`[data-ha="${key}Field"]`);

      if (!formState[key]) {
        fieldWrapper.classList.add('required');

        formHasErrors = true;
      } else {
        fieldWrapper.classList.remove('required');
      }
    });

  if (formHasErrors) {
    el.addClass('has-errors');
  } else {
    el.removeClass('has-errors');
  }
}

new HTMLApp({
  appName: 'main',
  debug: true,
  onLoadApp,
  eventHandlers: [
    { root: true, onSubmit },
    { id: 'firstName', onChange: getChangeHandler('firstName') },
    { id: 'lastName', onChange: getChangeHandler('lastName') },
    { id: 'aboutYou', onChange: getChangeHandler('aboutYou') },
    { id: 'gender', onChange: getChangeHandler('gender') },
    { id: 'preferredOs', onChange: getChangeHandler('preferredOs') }
  ]
});
