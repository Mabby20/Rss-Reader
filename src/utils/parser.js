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
  const rss = parser.parseFromString(content, 'text/xml');

  const feed = extractFeed(rss);
  const posts = extractPosts(rss);

  return { feed, posts };
};
