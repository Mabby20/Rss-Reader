import axios from 'axios';
import assignUniqueId from './genId.js';
import parse from './parser.js';
import getProxy from './getProxy.js';

const updaterRss = (state, timeout = 5000) => {
  if (state.rssLinks.length === 0) {
    return;
  }
  const promises = state.rssLinks.map((link) => {
    const curFeed = state.data.feedList.find((feed) => feed.rssLink === link);
    const mainId = curFeed.id;
    const proxyRss = getProxy(link);
    return axios.get(proxyRss)
      .then((response) => {
        const content = response.data.contents;
        const { posts: uploadedPosts } = parse(content);
        const loadedPosts = state.data.postList.filter((post) => post.feedId === mainId);
        const loadedPostsLinks = loadedPosts.map((post) => post.link);
        const coll = new Set(loadedPostsLinks);
        const newPosts = uploadedPosts.filter(({ link: curLink }) => !coll.has(curLink));

        if (newPosts.length === 0) {
          return [];
        }

        assignUniqueId(mainId, newPosts);
        return newPosts;
      });
  });

  Promise
    .allSettled(promises)
    .then((results) => {
      const rejectedPost = results.filter(({ status }) => status === 'rejected');
      rejectedPost.forEach((error) => {
        const curError = error.reason;
        console.error('Error', curError);// eslint-disable-line no-console
      });
      const posts = results
        .filter(({ status }) => status === 'fulfilled')
        .flatMap((post) => post.value);
      state.data.postList = [...posts, ...state.data.postList];
    })
    .finally(() => {
      setTimeout(() => updaterRss(state), timeout);
    });
};

export default updaterRss;
