const searchContainer = document.querySelector('.searchContainer');
const inputSearch = document.querySelector('.inputSearch');

searchContainer.addEventListener('mouseover', () => {
    inputSearch.style.display = 'flex';
});

inputSearch.addEventListener('click', () => {
    inputSearch.style.display = 'flex';
});

document.addEventListener('click', (event) => {
    if (!searchContainer.contains(event.target)) {
        inputSearch.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    upButton.style.display = 'none';
    inputSearch.style.display = 'none';
});