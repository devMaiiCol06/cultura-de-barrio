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
// let users;
// let events;
// let categories;
// let category_event;
// let locations;
// let participants;

/* ------------------------------ */

let selectedMonthPosition = 0;

/* -------------------------------------------------------------------------------- */

/* =================== CARGA DEL DOM =================== */

document.addEventListener("DOMContentLoaded", function () {
    /* =================== FUNCIÓN/MÉTODO FETCH =================== */
    /* Se utiliza el método fetch para obtener datos de una API o archivo JSON */

    // Obtener datos del archivo JSON
    fetch(`${BASE_URL}/resources/data/data.json`)
        // Verifica si la respuesta es exitosa
        .then((response) => {
            if (!response.ok)
                // Si la respuesta no es exitosa, lanza un error
                throw new Error("No se pudo cargar el archivo JSON");
            return response.json();
        })
        // Procesa los datos JSON
        .then((data) => {
            // Las variables se asignan después de que la promesa se resuelve
            let users = data.USERS;
            let categories = data.CATEGORIES;
            let category_event = data.CATEGORY_EVENT;
            let events = data.EVENTS;
            let locations = data.LOCATIONS;
            let participants = data.PARTICIPANTS;

            // Llamar a la función de mostrar infomación del usuario en el header
            showUserHeader(
                (users = dataFusion(users, getLocalUsers())),
                events
            );
            mostrarEncabezado(events);
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
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

    /* =================== EVENTO =================== */
    // EVENTO: Subir al tope de la página

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

    /* =================== EVENTO =================== */
    // EVENTO: Selecionar mes en el encabezado

    const buttonsSeletorsMonth = document.querySelectorAll(
        "calendarFilterButton"
    );
    buttonsSeletorsMonth.forEach((button) => {
        button.addEventListener("click", function () {
            const buttonAttribute = button.getAttribute("data-direction");
            let selectedMonth = 0;
            switch (buttonAttribute) {
                case "previous":
                    selectedMonth -= 1;
                    break;
                case "next":
                    selectedMonth += 1;
                    break;

                default:
                    break;
            }
            const organizedEvents = organizarEventosMes(events);
            const monthPlace = document.querySelector(".month");
            monthPlace.innerHTML = `${organizedEvents[selectedMonth]}`;

            return organizedEvents[selectedMonth];
        });
    });
});

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener lista de meses con eventos

function obtenerListaMeses(events) {
    const organizedEvents = organizarEventosMes(events);
    const monthList = Object.keys(organizedEvents); // Lista de los meses con eventos

    return monthList;
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener cantidad de eventos por mes, lista que contenga una lista por cada mes que contenga eventos

function organizarEventosMes(events) {
    const organizedEvents = []; // Crear lista de eventos por mes

    events.forEach((event) => {
        // Por cada evento
        const eventDate = new Date(event.evt_eventDate); // Crear una fecha manejable
        let month = eventDate.toLocaleString("es-ES", { month: "long" }); // Obtener el mes de la fecha del evento
        // Capitalizar el nombre del mes
        month = String(month.charAt(0).toUpperCase() + month.slice(1));

        if (!organizedEvents[month]) {
            // Si no hay un mes en la objeto de eventos por mes
            organizedEvents[month] = []; // Crear una lista del mes del evento
        }

        organizedEvents[month].push(event); // Añadir el evento a la lista del mes
    });

    return organizedEvents;
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener todo lo relacionado con el mes selecionado

function obtenerInfoMes(events) {
    const monthList = obtenerListaMeses(events); // Obtener lista de los nombres de meses con eventos
    const organizedMonths = organizarEventosMes(events); //  Obtener los eventos organizados por mes
    const monthEvents = organizedMonths[monthList[selectedMonthPosition]]; // Obtener los eventos del mes seleccionado
    const monthName = monthList[selectedMonthPosition]; // Obtener el nombre del mes seleccionado

    return {
        // Devolver un objeto con la información del mes seleccioando
        monthName: monthName,
        monthEvents: monthEvents,
    };
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Mostrar información del encabezado

function mostrarEncabezado(events) {
    // Obtener contenedores de la información de contador de eventos, el mes y la cantidad de eventos del mes
    const eventsCountPlace = document.querySelector(".calendarSubtitle");
    const monthPlace = document.querySelector(".month");
    const monthCountPlace = document.querySelector(".activityCount");
    const monthSubtitle = document.querySelector(".monthSubtitle");

    // Verificar los tres contenedores
    if (
        !eventsCountPlace ||
        !monthCountPlace ||
        !monthPlace ||
        !monthSubtitle
    ) {
        if (!eventsCountPlace) {
            console.error(
                "No se encontró el elemento con la clase 'calendarSubtitle'"
            );
        }
        if (!monthCountPlace) {
            console.error(
                "No se encontró el elemento con la clase 'activityCount'"
            );
        }
        if (!monthPlace) {
            console.error("No se encontró el elemento con la clase 'month'");
        }
        if (!monthSubtitle) {
            console.error(
                "No se encontró el elemento con la clase 'monthSubtitle'"
            );
        }
        return;
    }

    const monthInfo = obtenerInfoMes(events); // Obtener toda la información relacionada con el mes seleccionado
    const countEvents = events.length; // Obtener la cantidad de eventos de todos los meses disponibles

    monthPlace.innerHTML = `${monthInfo.monthName}`; // Insertar el mes en su contenedor
    // Insertar el contenido dependiendo de la cantidad de eventos disponibles
    eventsCountPlace.innerHTML =
        countEvents === 0
            ? "No hay actividades disponibles aún"
            : `${countEvents} ${
                  countEvents === 1
                      ? "actividad disponible"
                      : "actividades disponibles"
              } entre todos los meses`;
    // Insertar la cantidad de eventos del mes seleccionado
    monthCountPlace.innerHTML = `${monthInfo.monthEvents.length} ${
        monthInfo.monthEvents.length > 1 ? "actividades" : "actividad"
    }`;
    monthSubtitle.innerHTML = `Actividades de ${monthInfo.monthName}`; // Insertar en nombre del mes
}
