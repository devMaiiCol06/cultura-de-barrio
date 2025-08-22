document.addEventListener("DOMContentLoaded", () => {
    const modalActivation = document.querySelector(".notification-btn");
    const modalContainer = document.querySelector(".container-modal");
    const modalContent = document.querySelector(".content-modal")
    const closeModal = document.querySelector(".btn-cerrar-modal")

    modalActivation.addEventListener("click", (event) => {
        event.stopPropagation();
        modalContainer.classList.add("view");
        modalContainer.classList.remove("hidden");
    });

    // Ocultar el modal si se da clic fuera de él
    document.addEventListener("click", (event) => {
        if (
            modalContainer.classList.contains("view") &&
            !modalContent.contains(event.target) &&
            !modalActivation.contains(event.target)
        ) {
            modalContainer.classList.remove("view");
            modalContainer.classList.add("hidden");
        }
    });

    closeModal.addEventListener('click', (event) => {
        event.stopPropagation();
        modalContainer.classList.remove("view");
        modalContainer.classList.add("hidden");
    }) 

    // LLamar el nav
    const tabs = document.querySelectorAll(".tab_btn");
    //LLamar al contigo que deas mostrar
    const contents = document.querySelectorAll(".container-box");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Quitar clase "active" de todos
            tabs.forEach((t) => t.classList.remove("active"));
            contents.forEach((c) => c.classList.remove("active"));

            // Activar solo el clicado
            tab.classList.add("active");
            contents[index].classList.add("active");
        });
    });
});


