import i18n from 'i18next';
import { setLocale } from 'yup';
import model from './model.js';
import resources from '../locales/index.js';

export default () => {
  const defaultLng = 'ru';

  setLocale({
    mixed: {
      default: 'feedback.errors.default',
      notOneOf: 'feedback.errors.doubleRss',
    },
    string: {
      url: 'feedback.errors.invalidUrl',
    },
  });

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: defaultLng,
    debug: true,
    resources,
  }).then(() => model(i18nInstance));
};
