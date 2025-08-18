import showUserHeader from "./functions/showUserHeader.js";
import getLocalUsers from "./functions/getLocalUsers.js";
import dataFusion from "./functions/dataFusion.js";

/* --------------------------- VARIABLES GLOBALES ---------------------------- */

// Variable para la URL base del proyecto
const BASE_URL = window.location.hostname.includes("github.io")
    ? "/cultura-de-barrio" // Ruta en GitHub Pages
    : ""; // Ruta en entorno local

/* ------------------------------ */

// Variables de datos de la API
let users;
let events;
let categories;
let category_event;
let locations;
let participants;

/* -------------------------------------------------------------------------------- */

/* =================== CARGA DEL DOM =================== */

document.addEventListener("DOMContentLoaded", function () {
    /* =================== FUNCIÓN/MÉTODO FETCH =================== */
    /* Se utiliza el método fetch para obtener datos de una API o archivo JSON */

    // Obtener datos del archivo JSON
    fetch(`${BASE_URL}/resources/data/data.json`)
        .then((response) => {
            if (!response.ok)
                throw new Error("No se pudo cargar el archivo JSON");
            return response.json();
        })
        // Procesa los datos JSON
        .then((data) => {
            // Accede a los datos JSON y los guarda en variables
            users = data.USERS;
            categories = data.CATEGORIES;
            category_event = data.CATEGORY_EVENT;
            events = data.EVENTS;
            locations = data.LOCATIONS;
            participants = data.PARTICIPANTS;

            // Llamar a la función de mostrar información del usuario logueado
            showUserHeader(
                (users = dataFusion(users, getLocalUsers())),
                events
            );
        })
        // Maneja errores
        .catch((error) => console.error("Error:", error));

    /* =================== EVENTOS DE REDIRECCIONAMIENTO =================== */

    // Función para volver a la página principal
    document
        .querySelector(".backButton")
        .addEventListener("click", function () {
            window.location.href = "../index.html";
        });
    // Función para ir a la página de actividades
    document
        .querySelector(".activitiesButton")
        .addEventListener("click", function () {
            window.location.href = "../templates/activities.html";
        });
    // Función para ir a la página de estadísticas
    document
        .querySelector(".statisticsButton")
        .addEventListener("click", function () {
            window.location.href = "../templates/statistics.html";
        });
    // Función para ir a la página de autenticación
    document
        .getElementById("subscribe-button")
        .addEventListener("click", function () {
            window.location.href = "../templates/auth.html";
        });

    // ======================================================
    // -- FUNCIÓN: Ir a la página de detalles de la actividad --
    // ======================================================

    // Función para ir a la página de detalles de la actividad
    function go_to_detailsActivity(eventId) {
        try {
            // Obtener los datos del usuario almacenados en localStorage o sessionStorage
            const userData =
                localStorage.getItem("userData") ??
                sessionStorage.getItem("userData");

            // Intentar analizar solo si userData existe y es una cadena JSON válida
            const parsedUserData = userData ? JSON.parse(userData) : null;

            // Verificar si el usuario esta autenticado
            if (parsedUserData) {
                // Redireccionar a la pagina de detalles de la actividad con el ID especificado
                window.location.href = `activity.html?id=${eventId}`;
            } else {
                // Mostrar mensaje tipo error por no estar autenticado tanto en la consola como en un alert
                console.error(
                    "Usuario no autenticado. Redireccionando a la página de inicio de sesión.."
                );
                alert(
                    "Usuario no autenticado. Redireccionando a la página de inicio de sesión."
                );
                // Redireccionar a la pagina de inicio de sesión
                window.location.href = "../templates/auth.html";
            }
        } catch (error) {
            console.error("Error al analizar los datos del usuario:", error);
            localStorage.removeItem("userData"); // Borrar los datos corruptos
            alert(
                "Error al acceder a los datos del usuario. Intente iniciar sesión de nuevo."
            );
        }
    }

    /* =================== EVENTOS DE REDIRECCIONAMIENTO =================== */
    // FUNCIÓN: subir al tope de la página

    const upButton = document.querySelector(".up"); // Obtener el botón del html

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            upButton.style.display = "flex";
        } else {
            upButton.style.display = "none";
        }
    });

    upButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
});