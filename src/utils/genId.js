import _ from 'lodash';

export default (mainId, posts) => {
  posts.forEach((post) => {
    post.feedId = mainId;
    post.id = _.uniqueId();
  });
};
