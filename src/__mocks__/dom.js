export const getNewEl = ({ tagName = 'div', attributes = [], content = '' }) => {
  const el = document.createElement(tagName);

  attributes.forEach(([name, value = '']) => {
    el.setAttribute(name, value);
  });

  if (content) {
    el.innerHTML = content;
  }

  return el;
};
