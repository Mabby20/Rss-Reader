import axios from 'axios';
import generateId from './genId.js';
import parser from './parser.js';
import getProxy from './getProxy.js';

const updaterRss = (state, timeout = 5000) => {
  const promises = state.rssLinks.map((link) => {
    const curFeed = state.data.feedList.find((feed) => feed.rssLink === link);
    const mainId = curFeed.id;
    const proxyRss = getProxy(link);
    return axios.get(proxyRss)
      .then((response) => {
        const content = response.data.contents;
        const { posts: uploadedPosts } = parser(content);
        const loadedPosts = state.data.postList.filter((post) => post.feedId === mainId);
        const loadedPostsLinks = loadedPosts.map((post) => post.link);
        const coll = new Set(loadedPostsLinks);
        const newPosts = uploadedPosts.filter(({ link: curLink }) => !coll.has(curLink));

        if (newPosts.length === 0) {
          return [];
        }

        generateId(mainId, newPosts);
        return newPosts;
      });
  });

  return Promise
    .all(promises)
    .then((res) => {
      const flatRes = res.flatMap((post) => post);
      state.data.postList = [...flatRes, ...state.data.postList];
      state.form.processState = 'spying';
    })
    .catch(console.error)// eslint-disable-line no-console
    .finally(() => {
      state.form.processState = 'filling';
      setTimeout(() => updaterRss(state), timeout);
    });
};

export default updaterRss;
