const buildFeed = (state) => {
  const { feedList } = state;

  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const listGroup = document.createElement('ul');

  card.classList.add('card', 'border-0');
  card.append(cardBody, listGroup);
  cardBody.outerHTML = '<div class="card-body"><h2 class="card-title h4">Фиды</h2></div>';

  const elements = feedList.map((feed) => {
    const { title, description } = feed;
    return `
        <li class="list-group-item border-0 border-end-0">
            <h3 class="h6 m-0">${title}</h3
            <p class="m-0 small text-black-50">${description}</p>
        </li>`;
  }).join('\n');

  listGroup.outerHTML = `<ul class="list-group border-0 rounded-0">${elements}</ul>`;
  return card;
};

const buildPost = (state) => {
  const { postList } = state;

  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const listGroup = document.createElement('ul');

  card.classList.add('card', 'border-0');
  card.append(cardBody, listGroup);
  cardBody.outerHTML = '<div class="card-body"><h2 class="card-title h4">Посты</h2></div>';

  const elements = postList.map((post) => {
    const {
      title, id, url, // description, feedId
    } = post;

    return `
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
            <a href=${url} class="fw-bold"
                data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a>
            <button type="button" class="btn btn-outline-primary btn-sm" data-id=${id} data-bs-toggle="modal"
                    data-bs-target="#modal">Просмотр</button>
        </li>`;
  }).join('\n');
  listGroup.outerHTML = `<ul class="list-group border-0 rounded-0">${elements}</ul>`;
  return card;
};

const outputContent = (elements, state) => {
  elements.outputFeed.innerHTML = '';
  elements.outputPost.innerHTML = '';

  const feedList = buildFeed(state);
  const postList = buildPost(state);

  elements.outputFeed.append(feedList);
  elements.outputPost.append(postList);
};

const outputSuccess = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');

  elements.status.classList.remove('text-danger');
  elements.status.classList.add('text-success');
  elements.status.textContent = i18n.t('feedback.access');
};

export default (elements, initState, i18n) => (path, value) => {
  switch (path) {
    case 'rssLinks':
      handleLinks(elements, i18n);
      break;
    case 'error':
      handleErrors(elements, value, i18n);
      break;
    case '':

      break;
    default:
      break;
  }
};
