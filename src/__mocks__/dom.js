export const getDom = (innerHtml) => {
  const div = document.createElement('div');
  div.innerHTML = innerHtml;

  return div;
};
