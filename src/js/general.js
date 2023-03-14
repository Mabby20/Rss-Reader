import i18n from 'i18next';
import { setLocale } from 'yup';
import resources from '../locales/index.js';
import model from './model.js';

export default () => {
  const defaultLng = 'ru';

  setLocale({
    mixed: {
      default: () => ({
        key: 'default',
        values: 'feedback.errors.default',
      }),
      notOneOf: () => ({
        key: 'doubleRss',
        values: 'feedback.errors.doubleRss',
      }),
    },
    string: {
      url: () => ({
        key: 'invalidUrl',
        values: 'feedback.errors.invalidUrl',
      }),
    },
  });

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: defaultLng,
    debug: true,
    resources,
  }).then(() => model(i18nInstance));
};
