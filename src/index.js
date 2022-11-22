import axios from 'axios';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';
import { fetchImages } from './api/imgs-api-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let searchQuery = null;
let page = null;

function onFormSubmit(e) {
  page = 1;
  e.preventDefault();
  clearMarkUp();
  refs.loadMoreBtn.classList.add('is-hidden');
  //   const formData = new FormData(e.currentTarget);
  //   const searchQuery = formData.get('searchQuery');
  searchQuery = e.currentTarget.elements.searchQuery.value.trim();
  console.log(searchQuery);
  if (!searchQuery) {
    Notify.info('Empty request, please type not only spaces');
    return;
  }
  fetchImages(searchQuery, page)
    .then(images => {
      if (!images.hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      // for (const image of images.hits) {
      createImagesMarkUp(images.hits);
      refs.loadMoreBtn.classList.remove('is-hidden');
      // }

      console.log(images);
      Notify.success(
        `We found ${images.totalHits} , buy licence to get more, total found ${images.total}`
      );
    })
    .catch(error => Notify.failure(`${error}`));
}

function createImagesMarkUp(imagesData) {
  const markup = imagesData
    .map(image => {
      return `<div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${image.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join(' ');

  //   webformatURL - ссылка на маленькое изображение для списка карточек.
  // largeImageURL - ссылка на большое изображение.
  // tags - строка с описанием изображения. Подойдет для атрибута alt.
  // likes - количество лайков.
  // views - количество просмотров.
  // comments - количество комментариев.
  // downloads - количество загрузок.

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkUp() {
  refs.gallery.innerHTML = ``;
}

function onLoadMore(e) {
  page += 1;
  fetchImages(searchQuery, page)
    .then(images => {
      if (!images.hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      // for (const image of images.hits) {
      createImagesMarkUp(images.hits);
      refs.loadMoreBtn.classList.remove('is-hidden');
      // }

      console.log(images);
      Notify.success(
        `We found ${images.totalHits} , buy licence to get more, total found ${images.total}`
      );
    })
    .catch(error => Notify.failure(`${error}`));
}
