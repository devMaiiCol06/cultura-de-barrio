const upButton = document.querySelector('.up');
const searchContainer = document.querySelector('.searchContainer');
const inputSearch = document.querySelector('.inputSearch');

window.addEventListener('scroll', () => {
    if (window.scrollY > 800) { // Mostrar después de 300px de scroll
        upButton.style.display = 'flex';
    } else {
        upButton.style.display = 'none';
    }
});

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