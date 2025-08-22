// LLamar el nav
const tabs = document.querySelectorAll('.tab_btn');
//LLamar al contigo que deas mostrar
const contents = document.querySelectorAll('.container-box');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        // Quitar clase "active" de todos
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        // Activar solo el clicado
        tab.classList.add('active');
        contents[index].classList.add('active');
    });
});
