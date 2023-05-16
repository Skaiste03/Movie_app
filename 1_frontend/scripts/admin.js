import api from './api/api.js';

// VARIABLES
// -- Dom elements
const addMovieFormElement = document.querySelector('#add-movie-form');
const formSubmitMessageElement = document.querySelector('#form-submit-message');
const movieListContainerElement = document.querySelector(
  '#movie-list-container'
);
const movieUpdateDeleteMessageElement = document.querySelector(
  '#movie-update-delete-message'
);
const previousPageBtn = document.querySelector('#previous-page-btn');
const nextPageBtn = document.querySelector('#next-page-btn');
const currentPageBtn = document.querySelector('#current-page-btn');

//-- logic
let currentPage = 1;

// FUNCTIONS
const addMovie = async (e) => {
  e.preventDefault();
  const movie = {
    name: e.target.movieName.value,
    category: e.target.movieCategory.value,
    rentPrice: +e.target.movieRentPrice.value,
  };

  const response = await api.sendData(movie);

  formSubmitMessageElement.innerText = response.message;
  formSubmitMessageElement.classList.add('message');
  addMovieFormElement.reset();
  getMovies();
};

const getMovies = async () => {
  const data = await api.getLimitedData(currentPage);
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

const showMovies = (moviesArray) => {
  while (movieListContainerElement.firstChild) {
    movieListContainerElement.removeChild(movieListContainerElement.firstChild);
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const theadRow = document.createElement('tr');
  const th1 = document.createElement('th');
  const th2 = document.createElement('th');
  const th3 = document.createElement('th');
  const th4 = document.createElement('th');
  const th5 = document.createElement('th');
  th1.innerText = 'Movie name';
  th2.innerText = 'Movie category';
  th3.innerText = 'Movie rent price';
  th4.innerText = 'Update movie';
  th5.innerText = 'Delete movie';

  theadRow.append(th1, th2, th3, th4, th5);
  thead.appendChild(theadRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  moviesArray.forEach((movie) => {
    const tbodyRow = document.createElement('tr');
    tbodyRow.setAttribute('id', movie._id);
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');

    td1.innerText = movie.name;
    td2.innerText = movie.category;
    td3.innerText = `${movie.rentPrice.toFixed(2)}€`;
    td1.setAttribute('contenteditable', 'true');
    td2.setAttribute('contenteditable', 'true');
    td3.setAttribute('contenteditable', 'true');
    const updateButton = document.createElement('button');
    const deleteButton = document.createElement('button');
    td1.setAttribute('id', 'movieName');
    td2.setAttribute('id', 'movieCategory');
    td3.setAttribute('id', 'movieRentPrice');

    updateButton.innerText = 'Update';
    deleteButton.innerText = 'Delete';
    updateButton.setAttribute('data-movie-id', movie._id);
    deleteButton.setAttribute('data-movie-id', movie._id);

    updateButton.addEventListener('click', updateMovie);
    deleteButton.addEventListener('click', deleteMovie);

    td4.appendChild(updateButton);
    td5.appendChild(deleteButton);

    tbodyRow.append(td1, td2, td3, td4, td5);
    tbody.appendChild(tbodyRow);
  });
  table.appendChild(tbody);

  movieListContainerElement.appendChild(table);
};

const updateMovie = async (e) => {
  const { movieId } = e.target.dataset; // paima movieId ir priskiria const pavadinima
  const trs = document.querySelectorAll('tr');

  const trToUpdate = Array.from(trs).find((tr) => tr.id === movieId);

  const movie = {
    name: trToUpdate.children[0].innerText,
    category: trToUpdate.children[1].innerText,
    rentPrice: trToUpdate.children[2].innerText.substring(
      0,
      trToUpdate.children[2].innerText.length - 4
    ),
  };

  const response = await api.updateData(movieId, movie);
  movieUpdateDeleteMessageElement.innerText = response.message;
  movieUpdateDeleteMessageElement.classList.add('message');
};

const deleteMovie = async (e) => {
  const { movieId } = e.target.dataset;

  const response = await api.deleteData(movieId);
  movieUpdateDeleteMessageElement.innerText = response.message;
  movieUpdateDeleteMessageElement.classList.add('message');

  getMovies();
};

// EVENTS
document.addEventListener('DOMContentLoaded', getMovies);
addMovieFormElement.addEventListener('submit', addMovie);
previousPageBtn.addEventListener('click', () => {
  --currentPage;
  getMovies();
});
nextPageBtn.addEventListener('click', () => {
  ++currentPage;
  getMovies();
});
