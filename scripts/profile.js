document.addEventListener("DOMContentLoaded", () => {
    const modalActivation = document.querySelector(".notification-btn");
    const modalContainer = document.querySelector(".container-modal");
    const modalContent = document.querySelector(".content-modal")
    const closeModal = document.querySelector(".btn-cerrar-modal")

    modalActivation.addEventListener("click", (event) => {
        event.stopPropagation();
        modalContainer.classList.add("view");
        modalContainer.classList.remove("hidden");
        document.body.style.overflow = "hidden";
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

        //
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

    // Tabs para el modal
    const tabs_modal = document.querySelectorAll(".btn_modal");
    const notification_content = document.querySelectorAll(".notification_content");

    tabs_modal.forEach((tab, index) => {
        tab.addEventListener("click", () => {
            // Remueve la clase "active" de todos los tabs y oculta todos los contenidos
            tabs_modal.forEach((t) => t.classList.remove("active"));
            notification_content.forEach((c) => {
            c.classList.remove("active");
            c.classList.add("hidden");
            });

            // Activa el tab clicado y muestra su contenido correspondiente
            tab.classList.add("active");
            notification_content[index].classList.add("active");
            notification_content[index].classList.remove("hidden");
        });
    });
    // Nota: Se corrigió el comentario para mayor claridad y se agregó explicación.
});


