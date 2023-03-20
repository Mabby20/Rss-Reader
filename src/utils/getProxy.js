export default (url) => {
  const proxyBase = 'https://allorigins.hexlet.app/get';
  const proxyRss = new URL(proxyBase);
  proxyRss.searchParams.append('disableCache', 'true');
  proxyRss.searchParams.append('url', url);
  return proxyRss;
};
