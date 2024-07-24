const inputElement = document.querySelector('#search-input');
const searchIcon = document.querySelector('#search-close-icon');
const sortWrapper = document.querySelector('.sort-wrapper');

function search() {
  document.querySelector('#search-input').value = '';
  document
    .querySelector('#search-close-icon')
    .classList.remove('search-close-icon-visible');
}

function sort() {
  document
    .querySelector('.filter-wrapper')
    .classList.toggle('filter-wrapper-open');
  document.querySelector('body').classList.toggle('filter-wrapper-overlay');
}

function handleInputChange(inputElement) {
  const inputValue = inputElement.value;

  if (inputValue !== '') {
    document
      .querySelector('#search-close-icon')
      .classList.add('search-close-icon-visible');
  } else {
    document
      .querySelector('#search-close-icon')
      .classList.remove('search-close-icon-visible');
  }
}

inputElement.addEventListener('input', () => {
  handleInputChange(inputElement);
});
searchIcon.addEventListener('click', search);
sortWrapper.addEventListener('click', sort);
