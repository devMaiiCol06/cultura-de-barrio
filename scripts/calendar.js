import showUserHeader from "./functions/showUserHeader.js";
import getLocalUsers from "./functions/getLocalUsers.js";

/* --------------------------- VARIABLES GLOBALES ---------------------------- */

// Variable para la URL base del proyecto
const BASE_URL = window.location.hostname.includes("github.io")
    ? "/cultura-de-barrio" // Ruta en GitHub Pages
    : ""; // Ruta en entorno local

document.addEventListener("DOMContentLoaded", function () {
    fetch(`${BASE_URL}/resources/data/data.json`)
        .then((response) => {
            if (!response.ok)
                throw new Error("No se pudo cargar el archivo JSON");
            return response.json();
        })
        // Procesa los datos JSON
        .then((data) => {
            // Accede a los datos JSON y los guarda en variables
            const users = data.USERS;
            const categories = data.CATEGORIES;
            const category_event = data.CATEGORY_EVENT;
            const events = data.EVENTS;
            const locations = data.LOCATIONS;
            const participants = data.PARTICIPANTS;

            // Llamar a la función de mostrar información del usuario logueado
            showUserHeader(
                (users = unirDatosJsonLocal(users, getLocalUsers())),
                events
            );
        })
        // Maneja errores
        .catch((error) => console.error("Error:", error));
});
