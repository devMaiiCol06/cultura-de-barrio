/* ======================================================
-- FUNCIÓN: Mostrar información del usuario logueado --
====================================================== */

// Función para mostar el header con la información del usuario logueado
export default function showUserHeader(users, events) {
    // Verificar si hay un usuario logueado
    // Obtener los datos del usuario logueado del localStorage o sessionStorage
    const userData =
        JSON.parse(localStorage.getItem("userData")) ??
        JSON.parse(sessionStorage.getItem("userData"));

    if (userData) {
        // Verificar si hay un usuario loguead
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

        // Obtener solo el primer nombre y primer apellido del usuario
        userInfo.user_name = userInfo.user_name.split(" ")[0];
        userInfo.user_lastname = userInfo.user_lastname.split(" ")[0];

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
            `;

        userInfoElement.addEventListener("click", () => {
            window.location.href = "../../templates/profile.html";
        });
    }
    return;
}
