import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import view from './view.js';
import parser from '../utils/parser.js';
import generateId from '../utils/genId.js';
import updateRss from '../utils/updater.js';
import getProxy from '../utils/getProxy.js';

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
      processState: 'filling', // filling, sending, success, error
      errors: {},
      validate: 'valid', // valid, invalid
    },
    rssLinks: [],
    feedList: [],
    postList: [],
  };

  const state = onChange(initState, view(elements, initState, i18n));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputValue = formData.get('url').trim();

    validator(inputValue, state.rssLinks)
      .then(() => {
        state.form.validate = 'valid';
        state.rssLinks.push(inputValue);
      })
      .then(() => {
        state.form.processState = 'sending';
        const proxy = new Proxy(inputValue);
        return axios.get(proxy.getResWithoutHash());
      })
      .then((response) => {
        checkCodeResponse(response, state);
        const content = response.data.contents;
        const rawData = parser(content);
        const data = addId(rawData);
        state.feedList = [...state.feedList, data.feed];
        state.postList = [...state.postList, ...data.posts];
        state.form.processState = 'access';
      })
      .catch((error) => {
        state.form.processState = 'error';
        if (error.name === 'AxiosError') {
          error.message = 'feedback.errors.network';
        }
        if (error.name === 'ValidationError') {
          state.form.validate = 'invalid';
        }
        state.form.errors = error;
      });
  });
};
