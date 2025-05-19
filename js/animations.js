const upButton = document.querySelector('.up');

// Función para mostrar/ocultar el botón basado en el scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 800) { // Mostrar después de 300px de scroll
        upButton.style.display = 'flex';
    } else {
        upButton.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    upButton.style.display = 'none';
});