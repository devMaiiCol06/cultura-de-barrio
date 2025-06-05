const upButton = document.querySelector('.up');

/* FUNCION MOSTRAR BOTON */
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        upButton.style.display = 'flex';
    } else {
        upButton.style.display = 'none';
    }
});

/* FUNCION MOSTRAR ENCABEZADO */
function up_screen() {
    window.location.href = "#topPage";
}