const buildFeed = (feedList) => {
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

const buildPost = (postList, visitedPostId, i18n) => {
  const cardEl = document.createElement('div');
  const cardBodyEl = document.createElement('div');
  const listGroupEl = document.createElement('ul');

  cardEl.classList.add('card', 'border-0');
  cardEl.append(cardBodyEl, listGroupEl);
  cardBodyEl.outerHTML = '<div class="card-body"><h2 class="card-title h4">Посты</h2></div>';

  const elements = postList.map((post) => {
    const {
      title, id, link,
    } = post;
    const style = visitedPostId.has(id) ? 'fw-normal link-secondary' : 'fw-bold';
    return `
        <li class="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
            <a href="${link}" class="${style}" data-id="${id}" target="_blank" rel="noopener noreferrer">${title}</a>
            <button type="button" class="btn btn-outline-primary btn-sm" data-id="${id}" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('buttons.postBtn')}</button>
        </li>`;
  }).join('\n');

  listGroupEl.outerHTML = `<ul class="list-group border-0 rounded-0">${elements}</ul>`;
  return cardEl;
};

const outputFeed = (elements, state) => {
  elements.outputFeed.innerHTML = '';
  const { feedList } = state.data;
  const containerWithFeeds = buildFeed(feedList);
  elements.outputFeed.append(containerWithFeeds);
};

const outputPost = (elements, state, i18n) => {
  elements.outputPost.innerHTML = '';
  const { postList } = state.data;
  const { visitedPostId } = state.uiState;
  const containerWithPosts = buildPost(postList, visitedPostId, i18n);
  elements.outputPost.append(containerWithPosts);
};

const outputSuccess = (elements, i18n) => {
  elements.input.classList.remove('is-invalid');
  elements.status.classList.remove('text-danger');
  elements.status.classList.add('text-success');
  elements.status.textContent = i18n.t('feedback.success');
};

const outputError = (elements, error, i18n) => {
  const { message } = error;
  elements.status.textContent = i18n.t(message);
};

const handleState = (elements, initState, curValue, i18n) => {
  switch (curValue) {
    case 'sending':
      elements.submitButton.disabled = true;
      break;
    case 'success':
      elements.submitButton.disabled = false;
      elements.form.reset();
      elements.input.focus();
      outputSuccess(elements, i18n);
      break;
    case 'error':
      elements.submitButton.disabled = false;
      elements.status.classList.add('text-danger');
      elements.status.classList.remove('text-success');
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

const handleModal = (state, elements) => {
  const titleContent = state.uiState.modal.title;
  const descriptionContent = state.uiState.modal.description;
  const { link } = state.uiState.modal;

  elements.modal.title.textContent = titleContent;
  elements.modal.body.textContent = descriptionContent;
  elements.modal.link.setAttribute('href', link);
};

export default (elements, initState, i18n) => (path, value) => {
  switch (path) {
    case 'form.validate':
      handleValidate(elements, value);
      break;
    case 'form.processState':
      handleState(elements, initState, value, i18n);
      break;
    case 'data.feedList':
      outputFeed(elements, initState);
      break;
    case 'data.postList':
      outputPost(elements, initState, i18n);
      break;
    case 'form.errors':
      outputError(elements, value, i18n);
      break;
    case 'uiState.modal':
      handleModal(initState, elements);
      break;
    case 'uiState.visitedPostId':
      initState.uiState.visitedPostId.forEach((id) => {
        const link = elements.outputPost.querySelector(`a[data-id="${id}"]`);
        link.classList.remove('fw-bold');
        link.classList.add('fw-normal', 'link-secondary');
      });
      break;
    default:
      break;
  }
};
