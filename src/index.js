import axios from 'axios';
// all modules
import Notiflix from 'notiflix';
// // one by one
// import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Report } from 'notiflix/build/notiflix-report-aio';
// import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
// import { Block } from 'notiflix/build/notiflix-block-aio';

const refs = {
  form: document.querySelector('.search-form'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const searchQuery = formData.get('searchQuery');
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  Notiflix.Notify.success(searchQuery);
}
