const extractFeed = (rss) => {
  const titleEl = rss.querySelector('channel > title');
  const descriptionEl = rss.querySelector('channel > description');

  if (!titleEl || !descriptionEl) {
    throw new Error('Error parser');
  }

  const title = titleEl.textContent;
  const description = descriptionEl.textContent;

  return { title, description };
};

const extractPosts = (rss) => {
  const items = rss.querySelectorAll('channel > item');

  if (!items) {
    throw new Error('Error parser');
  }

  return [...items].map((post) => {
    const titleEl = post.querySelector('title');
    const descriptionEl = post.querySelector('description');
    const linkEl = post.querySelector('link');

    const title = titleEl.textContent;
    const description = descriptionEl.textContent;
    const link = linkEl.textContent;

    return { title, description, link };
  });
};

export default (content) => {
  const parser = new DOMParser();
  const rss = parser.parseFromString(content, 'application/xml');
  console.log('получившийся rss', rss);
  const elements = {
    title: rss.querySelector('title'),
    description: rss.querySelector('description'),
    link: rss.querySelector('link'),
    posts: rss.querySelectorAll('item'),
  };
  const feed = {
    title: elements.title.textContent,
    description: elements.description.textContent,
    url: elements.link.textContent,
  };

  const posts = [...elements.posts].reduce((acc, item) => {
    const postElements = {
      title: item.querySelector('title'),
      description: item.querySelector('description'),
      url: item.querySelector('link'),
    };

    const post = {
      title: postElements.title.textContent,
      description: postElements.description.textContent,
      url: postElements.url.textContent,
    };

    return [...acc, post];
  }, []);

  return { feed, posts };
};
