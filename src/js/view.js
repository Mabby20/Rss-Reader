const handleErrors = (elements, error, i18n) => {
  elements.input.classList.add('is-invalid');

  elements.status.classList.add('text-danger');
  elements.status.classList.remove('text-success');
  const [{ values }] = error.errors;
  elements.status.textContent = i18n.t(values);
};

const handleLinks = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');

  elements.status.classList.remove('text-danger');
  elements.status.classList.add('text-success');
  elements.status.textContent = i18n.t('feedback.access');
};

export default (elements, initState, i18n) => (path, value) => {
  switch (path) {
    case 'rssLinks':
      handleLinks(elements, i18n);
      break;
    case 'error':
      handleErrors(elements, value, i18n);
      break;
    case '':

      break;
    default:
      break;
  }
};
