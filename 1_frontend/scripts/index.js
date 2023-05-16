import api from './api/api.js';

// VARIABLES
// -- dom elements
const moviesContainerElement = document.querySelector('#movies-container');
const moviesFilterByCategoryElement = document.querySelector(
  '#movies-filter-by-category'
);
const moviesFilterByPriceElement = document.querySelector(
  '#movies-filter-by-price'
);
const previousPageBtn = document.querySelector('#previous-page-btn');
const nextPageBtn = document.querySelector('#next-page-btn');
const currentPageBtn = document.querySelector('#current-page-btn');
const searchElement = document.querySelector('#search');
const paginationContainer = document.querySelector('#pagination-container');
const submitBtn = document.querySelector('#submit-btn');
const resetBtn = document.querySelector('#reset-btn');
const movieSubmitMessage = document.querySelector('#movie-submit-message');

// -- logic elements
const movies = [];
let selectedCategory;
let currentPage = 1;

// FUNCTIONS

// -- get movies data
const getLimitedMovies = async () => {
  const data = await api.getLimitedData(currentPage);

  if (movies.length == 0) {
    movies.push(...data);
  } else {
    for (let i = 0; i < data.length; i++) {
      const isInMovieArray = movies.filter((movie) => movie._id == data[i]._id);

      if (isInMovieArray.length == 0) {
        movies.push(data[i]);
      }
    }
  }

  generateOptionTags(data);
  showMovies(data);
  pagination();
};

const pagination = async () => {
  // resets
  while (currentPageBtn.firstChild) {
    currentPageBtn.removeChild(currentPageBtn.firstChild);
  }
  while (previousPageBtn.firstChild) {
    previousPageBtn.removeChild(previousPageBtn.firstChild);
  }
  while (nextPageBtn.firstChild) {
    nextPageBtn.removeChild(nextPageBtn.firstChild);
  }

  const nextPageElementsLength = (await api.getLimitedData(currentPage + 1))
    .length;

  const pForCurrentPage = document.createElement('p');
  const pForPreviousPage = document.createElement('p');
  const pForNextPage = document.createElement('p');

  // Current page btn
  pForCurrentPage.innerText = currentPage;
  currentPageBtn.appendChild(pForCurrentPage);

  // Previous page btn
  if (currentPage >= 2) {
    pForPreviousPage.innerText = currentPage - 1;
    previousPageBtn.appendChild(pForPreviousPage);
  }

  // Next page btn
  if (nextPageElementsLength > 0) {
    pForNextPage.innerText = currentPage + 1;
    nextPageBtn.appendChild(pForNextPage);
  }
};
// -- generate <option> tags for <select>
const generateOptionTags = (moviesArray, filterType = null) => {
  // -- for category filter
  if (filterType === null) {
    while (moviesFilterByCategoryElement.firstChild) {
      moviesFilterByCategoryElement.removeChild(
        moviesFilterByCategoryElement.firstChild
      );
    }
    const categoriesArray = new Set(moviesArray.map((movie) => movie.category));

    // -- creating "All movies" option
    const allMoviesOption = document.createElement('option');
    allMoviesOption.setAttribute('value', 'all-movies');
    allMoviesOption.innerText = 'All movies';

    moviesFilterByCategoryElement.appendChild(allMoviesOption);

    // -- creating other options based on categoriesArray
    categoriesArray.forEach((category) => {
      const option = document.createElement('option');
      option.setAttribute('value', category.toLowerCase());
      option.innerText = category;

      moviesFilterByCategoryElement.appendChild(option);
    });
  }

  // -- for price filter
  if (filterType === null || filterType === 'category') {
    while (moviesFilterByPriceElement.firstChild) {
      moviesFilterByPriceElement.removeChild(
        moviesFilterByPriceElement.firstChild
      );
    }
    const rentPricesArray = new Set(
      moviesArray.map((movie) => movie.rentPrice).sort((a, b) => a - b)
    );

    // -- creating "All prices" option
    const allPricesOption = document.createElement('option');
    allPricesOption.setAttribute('value', 'all-prices');
    allPricesOption.innerText = 'All prices';

    moviesFilterByPriceElement.appendChild(allPricesOption);

    // -- creating other options based on categoriesArray
    rentPricesArray.forEach((price) => {
      const option = document.createElement('option');
      option.setAttribute('value', price);
      option.innerText = `${price.toFixed(2)}€`;

      moviesFilterByPriceElement.appendChild(option);
    });
  }
};

// -- show movies
const showMovies = (moviesArray) => {
  while (moviesContainerElement.firstChild) {
    moviesContainerElement.removeChild(moviesContainerElement.firstChild);
  }
  moviesArray.forEach((movie) => {
    const div = document.createElement('div');
    const h4 = document.createElement('h4');
    const pForCategory = document.createElement('p');
    const pForPrice = document.createElement('p');

    h4.innerText = movie.name;
    pForCategory.innerText = `Category: ${movie.category}`;
    pForPrice.innerText = `Rent price: ${movie.rentPrice.toFixed(2)}€`;

    div.append(h4, pForCategory, pForPrice);
    moviesContainerElement.appendChild(div);
  });
};

// -- filter movies
// ---  by category
const filterMoviesByCategory = (e) => {
  const currentCategory = e.target.value;

  selectedCategory = currentCategory;

  if (currentCategory === 'all-movies') {
    showMovies(movies);
    generateOptionTags(movies, 'category');

    return;
  }

  const filteredMovies = movies.filter(
    (movie) =>
      movie.category ===
      currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
  );
  showMovies(filteredMovies);
  generateOptionTags(filteredMovies, 'category');
};

// --- by price
const filterMoviesByPrice = (e) => {
  const currentPrice = e.target.value;

  if (currentPrice === 'all-prices' && selectedCategory === 'all-movies') {
    showMovies(movies);
    return;
  } else if (currentPrice === 'all-prices') {
    let filteredMovies = movies.filter(
      (movie) => movie.category.toLowerCase() === selectedCategory
    );
    showMovies(filteredMovies);
    return;
  }

  let filteredMovies;

  if (selectedCategory && selectedCategory !== 'all-movies') {
    filteredMovies = movies.filter(
      (movie) =>
        movie.rentPrice === +currentPrice &&
        movie.category.toLowerCase() === selectedCategory
    );
  } else {
    filteredMovies = movies.filter(
      (movie) => movie.rentPrice === +currentPrice
    );
  }

  showMovies(filteredMovies);
};

const search = async () => {
  const allMovies = await api.getAllData();

  const results = allMovies.filter((movie) =>
    movie.name.toLowerCase().includes(searchElement.value.toLowerCase())
  );
  if (results.length == 0) {
    movieSubmitMessage.innerText = 'Movie not found..';
    const emptyArray = [];
    showMovies(emptyArray);
    paginationContainer.style.display = 'none';
  } else showMovies(results);
};

const reset = () => {
  getLimitedMovies();
  searchElement.value = '';
  movieSubmitMessage.innerText = '';
  paginationContainer.style.display = 'flex';
};
// EVENTS
document.addEventListener('DOMContentLoaded', getLimitedMovies);
moviesFilterByCategoryElement.addEventListener(
  'change',
  filterMoviesByCategory
);
moviesFilterByPriceElement.addEventListener('change', filterMoviesByPrice);

previousPageBtn.addEventListener('click', () => {
  --currentPage;
  getLimitedMovies();
});
nextPageBtn.addEventListener('click', () => {
  ++currentPage;
  getLimitedMovies();
});

submitBtn.addEventListener('click', search);
resetBtn.addEventListener('click', reset);
