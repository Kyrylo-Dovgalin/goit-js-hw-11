import axios from 'axios';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import './css/styles.css';

import { ImagesApiService } from './api/imgs-api-service';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();
  imagesApiService.resetPage();

  clearMarkUp();
  refs.loadMoreBtn.classList.add('is-hidden');
  //   const formData = new FormData(e.currentTarget);
  //   const searchQuery = formData.get('searchQuery');
  imagesApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (!imagesApiService.query) {
    Notify.info('Empty request, please type not only spaces');
    return;
  }

  fetchImages();
}

function fetchImages() {
  imagesApiService
    .fetchImages()
    .then(images => {
      console.log(images.hits.length);
      if (!images.hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      createImagesMarkUp(images.hits);
      refs.loadMoreBtn.classList.remove('is-hidden');

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

  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearMarkUp() {
  refs.gallery.innerHTML = ``;
}

function onLoadMore(e) {
  imagesApiService
    .fetchImages()
    .then(images => {
      console.log(images.hits.length);
      if (!images.hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      createImagesMarkUp(images.hits);
      refs.loadMoreBtn.classList.remove('is-hidden');

      Notify.success(
        `We found ${images.totalHits} , buy licence to get more, total found ${images.total}`
      );
    })
    .catch(error => Notify.failure(`${error}`));
}
