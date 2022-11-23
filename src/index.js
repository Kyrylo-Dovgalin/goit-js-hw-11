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
let imagesShown = 0;

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onFormSubmit(e) {
  e.preventDefault();
  clearMarkUp();
  imagesShown = 0;

  imagesApiService.resetPage();

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
    .then(({ hits, totalHits, total } = {}) => {
      if (!hits.length) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      createImagesMarkUp(hits);
      if (!imagesShown) {
        Notify.success(
          `We found ${totalHits} , buy licence to get more, total found ${total}`
        );
      }

      imagesShown += hits.length;
      if (imagesShown < totalHits) {
        Notify.info(`Totally shown: ${imagesShown} images`);

        refs.loadMoreBtn.classList.remove('is-hidden');
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          `We are sorry, but you have reached the end of search results. Totally shown: ${imagesShown} images`
        );
      }
    })
    .catch(error => Notify.failure(`${error}`));
}

function createImagesMarkUp(imagesData) {
  const markup = imagesData
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
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

function onLoadMore() {
  fetchImages();
}
