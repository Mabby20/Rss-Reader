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
    data: {
      feedList: [],
      postList: [],
    },
    rssLinks: [],
  };

  const state = onChange(initState, view(elements, initState, i18n));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputUrl = formData.get('url').trim();

    validator(inputUrl, state.rssLinks)
      .then(() => {
        state.form.validate = 'valid';
      })
      .then(() => {
        state.form.processState = 'sending';
        const proxyRss = getProxy(inputUrl);
        return axios.get(proxyRss);
      })
      .then((response) => {
        checkCodeResponse(response, state);
        const content = response.data.contents;
        const { feed, posts } = parser(content);

        state.rssLinks.push(inputUrl);
        feed.rssLink = inputUrl;
        feed.id = _.uniqueId();
        const mainId = feed.id;
        generateId(mainId, posts);

        state.data.feedList = [...state.data.feedList, feed];
        state.data.postList = [...state.data.postList, ...posts];

        state.form.processState = 'success';
        state.form.processState = 'filling';
      })
      .then(() => {
        setTimeout(() => updateRss(state), 5000);
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
