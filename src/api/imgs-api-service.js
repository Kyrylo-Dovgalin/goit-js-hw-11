const BASE_URL = 'https://pixabay.com/api/';

const options = {
  KEY: '31423107-978e712529a799d220018245f',
  imageType: 'photo',
  orientation: 'horizontal',
  safeSearch: 'true',
  perPage: 40,
};

function fetchImages(query, page) {
  return fetch(
    `${BASE_URL}?key=${options.KEY}&q=${query}&image_type=${options.imageType}&orientation=${options.orientation}&safesearch=${options.safeSearch}&per_page=${options.perPage}&page=${page}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

export { fetchImages };
