/* ======================================================
-- FUNCIÓN: Mostrar información del usuario logueado --
====================================================== */

import checkAuth from "./checkAuth.js"; // Importar la función checkAuth

// Función para mostar el header con la información del usuario logueado
export default function showUserHeader(users, events) {
    if (checkAuth()) {
        // Verificar si hay un usuario logueado
        // Obtener los datos del usuario logueado del localStorage o sessionStorage
        const userData =
            JSON.parse(localStorage.getItem("userData")) ??
            JSON.parse(sessionStorage.getItem("userData"));
        const userId = parseInt(atob(userData.user_id)); // Convertir a entero

        // Obtener la información del usuario logueado
        const userInfo = users.find((user) => user.user_id === userId);

        // Obtener los eventos del usuario logueado
        const userEvents = events.filter(
            (event) => event.FK_creator === userId
        );

        // Obtener el botón de Suscribirse
        const subscribeButton = document.getElementById("subscribe-button");
        if (subscribeButton) {
            subscribeButton.style.display = "none";
        } else {
            console.warn("subscribeButton not found in the DOM");
        }
        // Obtener el elemento HTML donde se mostrará la información del usuario
        const userInfoElement = document.querySelector(".infoHeaderUserLogged");
        // Cambiar la visibilidad del contenedor a flex
        if (userInfoElement) {
            userInfoElement.style.display = "flex";
        } else {
            console.warn("userInfoElement not found in the DOM");
        }
        // Insertar la información del usuario en el elemento HTML
        userInfoElement.innerHTML = `
            <img src="../resources/images/user.png" alt="Foto de perfil">
            <div class="userInfo">
                <span class="userName">${userInfo.user_name} ${
            userInfo.user_lastname
        }</span>
                <span class="userEventsCount">${userEvents.length} ${
            userEvents.length === 1 ? "actividad" : "actividades"
        }</span>
            </div>
            <i class="ti ti-caret-down"></i>
            `;
    }
    return;
}
