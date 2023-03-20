const buildFeed = (state) => {
  const { feedList } = state.data;

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
  const { postList } = state.data;

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

    const item = `
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
            <a href=${url} class="fw-bold"
                data-id=${id} target="_blank" rel="noopener noreferrer">${title}</a>
            <button type="button" class="btn btn-outline-primary btn-sm" data-id=${id} data-bs-toggle="modal"
                    data-bs-target="#modal">Просмотр</button>
        </li>`;
    return item;
  }).join('\n');

  listGroup.outerHTML = `<ul class="list-group border-0 rounded-0">${elements}</ul>`;
  return card;
};

const outputFeed = (elements, state) => {
  elements.outputFeed.innerHTML = '';
  const feedList = buildFeed(state);
  elements.outputFeed.append(feedList);
};

const outputPost = (elements, state) => {
  elements.outputPost.innerHTML = '';
  const postList = buildPost(state);
  elements.outputPost.append(postList);
};

const outputSuccess = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');
  elements.status.classList.remove('text-danger');
  elements.status.classList.add('text-success');
  elements.status.textContent = i18n.t('feedback.success');
};

const handleState = (elements, initState, curValue, i18n) => {
  switch (curValue) {
    case 'filling':
      break;
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    case 'success':
      elements.submitButton.disabled = false;
      elements.form.reset();
      elements.input.focus();
      outputSuccess(elements, i18n);
      outputFeed(elements, initState);
      outputPost(elements, initState);
      break;
    case 'error':
      elements.submitButton.disabled = false;
      elements.status.classList.add('text-danger');
      elements.status.classList.remove('text-success');
      break;
    case 'spying':
      outputPost(elements, initState);
      break;

    default:
      break;
  }
};

const handleValidate = (elements, valid) => {
  if (valid === 'valid') {
    elements.input.classList.remove('is-invalid');
    return;
  }
  if (valid === 'invalid') {
    elements.input.classList.add('is-invalid');
  }
};

const outputError = (elements, error, i18n) => {
  const { message } = error;
  elements.status.textContent = i18n.t(message);
};

export default (elements, initState, i18n) => (path, value) => {
  switch (path) {
    case 'form.validate':
      handleValidate(elements, value);
      break;
    case 'form.processState':
      handleState(elements, initState, value, i18n);
      break;
    case 'form.errors':
      outputError(elements, value, i18n);
      break;
    default:
      break;
  }
};
