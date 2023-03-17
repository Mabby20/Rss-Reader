import * as yup from 'yup';
import onChange from 'on-change';
import view from './view.js';
import Proxy from '../utils/proxy.js';
import parser from '../utils/parser.js';

const validator = (link, rssLinks) => {
  const schema = yup.string().url().notOneOf(rssLinks);
  return schema.validate(link);
};

const checkCodeResponse = (response, state) => {
  const code = response.data.status.http_code;
  if (code >= 400) {
    const error = new Error('feedback.errors.invalidRss');
    state.rssLinks.pop();
    throw error;
  }
};

const addId = (obj) => {
  const cloneObj = _.cloneDeep(obj);
  const { feed, posts } = cloneObj;
  feed.id = _.uniqueId();
  const mainId = feed.id;
  posts.forEach((post) => {
    post.feedId = mainId;
    post.id = _.uniqueId();
  });
  return cloneObj;
};

export default (i18n) => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('.form-control'),
    submitButton: document.querySelector('button[type="submit"]'),
    status: document.querySelector('.feedback'),
    outputPost: document.querySelector('.posts'),
    outputFeed: document.querySelector('.feeds'),
  };
  const initState = {
    form: {
      // url: null,
      validate: true,
    },
    error: {},
    rssLinks: [],
  };

  const state = onChange(initState, view(elements, initState, i18n));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputValue = formData.get('url').trim();

    const schema = yup.string().url().notOneOf(state.rssLinks);
    schema.validate(inputValue)
      .then(() => {
        state.rssLinks.push(inputValue);
        elements.form.reset();
        elements.input.focus();
      })
      .catch((error) => {
        state.error = error;
      });
  });
};
