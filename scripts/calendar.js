import showUserHeader from "./functions/showUserHeader.js";
import getLocalUsers from "./functions/getLocalUsers.js";
import dataFusion from "./functions/dataFusion.js";

/* []**[]**[]**[]**[]**[]**[]**[] VARIABLES GLOBALES []**[]**[]**[]**[]**[]**[]**[] */

// Variable para la URL base del proyecto
const BASE_URL = window.location.hostname.includes("github.io")
    ? "/cultura-de-barrio" // Ruta en GitHub Pages
    : ""; // Ruta en entorno local

/* ------------------------------ */

// Posición inicial del mes a seleccionar/mostrar
let selectedMonthPosition = 0;

/* -------------------------------------------------------------------------------- */

/* []**[]**[]**[]**[]**[]**[]**[] CARGA DEL DOM []**[]**[]**[]**[]**[]**[]**[] */

document.addEventListener("DOMContentLoaded", function () {
    /* []**[]**[]**[]**[]**[]**[]**[] FUNCIÓN/MÉTODO FETCH[]**[]**[]**[]**[]**[]**[]**[] */
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

            /* []**[]**[]**[]**[]**[]**[]**[] LLAMADAS - FUNCIONES []**[]**[]**[]**[]**[]**[]**[] */

            // Llamar a la función de mostrar infomación del usuario en el header
            showUserHeader(
                (users = dataFusion(users, getLocalUsers())),
                events
            );
            // Llamar el renderizado del encabezado
            renderizarEncabezado(events);
            // Llamar el rendirazado de eventos
            renderizarEventos(
                events,
                locations,
                participants,
                categories,
                category_event
            );

            /* =================== EVENTO =================== */
            // EVENTO: Selecionar mes en el encabezado

            const buttonsSeletorsMonth = document.querySelectorAll(
                ".calendarFilterButton"
            ); // Obtener botones de selección de mes
            const amountMonths = obtenerListaMeses(events).length - 1; // Obtener la cantidad de meses
            buttonsSeletorsMonth.forEach((button) => {
                // Por cada botón de selección
                button.addEventListener("click", function () {
                    // Añadir un evento de click
                    const buttonAttribute = String(
                        button.getAttribute("data-month-selector")
                    ); // Obtener el atributo del botón clickeado
                    const previousMonthPosition = selectedMonthPosition; // Crear punto de comparación
                    switch (
                        buttonAttribute // Comparar los atributos que indican que tipo de selección se está realizando
                    ) {
                        case "previous":
                            if (selectedMonthPosition > 0) {
                                selectedMonthPosition =
                                    selectedMonthPosition - 1;
                            }
                            break;
                        case "next":
                            if (selectedMonthPosition < amountMonths) {
                                selectedMonthPosition =
                                    selectedMonthPosition + 1;
                            }
                            break;
                    }
                    if (selectedMonthPosition !== previousMonthPosition) {
                        // Verificar si hubo algun cambio en la seleccion de posición del mes
                        renderizarEncabezado(events); // Llamar el renderizado del encabezado para actulizar datos
                        renderizarEventos(
                            events,
                            locations,
                            participants,
                            categories,
                            category_event
                        ); // Llamar el renderizado de los eventos para actulizar datos
                    }
                    return;
                });
            });
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
        .catch((error) => console.error("Error:", error));

    /* []**[]**[]**[]**[]**[]**[]**[] EVENTOS DE REDIRECCIONAMIENTO []**[]**[]**[]**[]**[]**[]**[] */

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
});

/* []**[]**[]**[]**[]**[]**[]**[]  SECTOR - FUNCIONES []**[]**[]**[]**[]**[]**[]**[] */

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Para ir a la página de detalles de la actividad

function verActividad(idEvent) {
    try {
        // Intentar la ejecución del código
        // Obtener los datos del usuario almacenados en localStorage o sessionStorage
        const userData =
            localStorage.getItem("userData") ??
            sessionStorage.getItem("userData");

        // Intentar analizar solo si userData existe y es una cadena JSON válida
        const parsedUserData = userData ? JSON.parse(userData) : null;

        // Verificar si el usuario esta autenticado
        if (parsedUserData) {
            // Redireccionar a la pagina de detalles de la actividad con el ID especificado
            window.location.href = `activity.html?id=${idEvent}`;
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
        sessionStorage.removeItem("userData"); // Borrar los datos corruptos
        alert(
            "Error al acceder a los datos del usuario. Intente iniciar sesión de nuevo."
        );
    }
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener cantidad de eventos por mes, lista que contenga una lista por cada mes que contenga eventos

function organizarEventosMes(events) {
    const organizedEvents = {}; // Crear lista de eventos por mes

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

    return organizedEvents; // Devolver los eventos organizados por mes
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener lista de meses con eventos

function obtenerListaMeses(events) {
    const organizedEvents = organizarEventosMes(events); // Obtener los eventos organizados por mes
    const monthList = Object.keys(organizedEvents); // Lista de los meses con eventos

    return monthList; // Devolver la lista con los meses
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener todo lo relacionado con el mes selecionado

function obtenerInfoMes(events) {
    const monthList = obtenerListaMeses(events); // Obtener lista de los nombres de meses con eventos
    const organizedMonths = organizarEventosMes(events); //  Obtener los eventos organizados por mes
    const monthName = monthList[selectedMonthPosition]; // Obtener el nombre del mes seleccionado
    const monthEvents = organizedMonths[monthName]; // Obtener los eventos del mes seleccionado

    return {
        // Devolver un objeto con la información del mes seleccioando
        monthName: monthName,
        monthEvents: monthEvents,
    };
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener la lista de categorias del evento

function obtenerCategoriasEvento(event, categories, category_event) {
    // Filtrar las relaciones donde fk_event coincide con el evt_id
    const relations = category_event.filter(
        (rel) => rel.fk_event === event.evt_id
    );

    // Verificar si hay relaciones de categorías
    if (relations.length === 0) {
        // Salir de la función
        return null;
    }

    const categoriesEvent = relations
        .map((rel) => {
            // Por cada relación
            const cat = categories.find((c) => c.cat_id === rel.FK_cat); // Crear variable con la categoria
            return cat ? cat.cat_name : null; // Verificador verificar si la categoria es nula o no
        })
        .filter(Boolean); // Eliminar todos los falsy de la lista de categorias

    return categoriesEvent; // Devolver una lista con las categorias del evento
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener la locación/ubicación del evento

function obtenerLocationEvento(event, locations) {
    // Buscar la locación que conicida con la del evento
    const locationEvent = locations.find(
        (location) => location.loc_id === event.fk_loc
    ).loc_name;

    return locationEvent; // Devolver el nombre de la locación del evento
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Obtener cantidad particpantes del evento

function obtenerParticipantesEvento(event, participants) {
    // Obtener los participantes del local
    const participantsLocal = JSON.parse(
        localStorage.getItem("eventParticipants")
    );
    // Unir los participantes del local con los de la API
    const totalParticipants = dataFusion(participants, participantsLocal);
    // Filtrar solo los participantes que coincidan con el evento
    const participantsEvent = totalParticipants.filter(
        (participant) => participant.fk_event === event.evt_id
    );

    return participantsEvent; // Devolver una lista de todos los participantes del evento
}

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Desmenusar información del evento

function desmenusarEvento(
    event,
    locations,
    participants,
    categories,
    category_event
) {
    const categoriesEvent = obtenerCategoriasEvento(
        event,
        categories,
        category_event
    ); // Obtener las categorias del evento
    const locationEvent = obtenerLocationEvento(event, locations); // Obtener la locación del evento
    const dayEvent = new Date(event.evt_eventDate).toLocaleDateString("es-CO", {
        day: "numeric", // Obtener el dia numérico del evento
    });
    const weekdayEvent = new Date(event.evt_eventDate)
        .toLocaleDateString("es-CO", {
            weekday: "short", // Obtener el dia alfabético del evento
        })
        .toUpperCase();
    const timeEvent = new Date(event.evt_eventDate).toLocaleTimeString(
        "es-CO",
        { hour: "2-digit", minute: "2-digit", hour12: true } // Obtener hora del evento
    );
    // Obtener la cantidad de participantes del evento
    const amountParticipanstEvent = obtenerParticipantesEvento(
        event,
        participants
    ).length;
    const spotsEvent = event.evt_capacity - amountParticipanstEvent; // Obtener la cantidad de cupos disponibles del evento

    return (event = {
        // Agregar llaves del objeto del evento y los devuelve
        ...event,
        timeEvent: timeEvent,
        weekdayEvent: weekdayEvent,
        dayEvent: dayEvent,
        categoriesEvent: categoriesEvent,
        locationEvent: locationEvent,
        spotsEvent: spotsEvent,
        amountParticipanstEvent: amountParticipanstEvent,
    });
}

/* []**[]**[]**[]**[]**[]**[]**[] SECTOR - RENDERIZADO []**[]**[]**[]**[]**[]**[]**[] */

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Mostrar información del encabezado

function renderizarEncabezado(events) {
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

/* =================== FUNCIÓN =================== */
// FUNCIÓN: Mostrar información del encabezado

function renderizarEventos(
    events,
    locations,
    participants,
    categories,
    category_event
) {
    const eventsContainer = document.querySelector(
        ".calendarActivityContainer"
    ); // Obtener el contenedor de actividades
    eventsContainer.innerHTML = ``; // Limpiar el contedor de actividades para evitar duplicados
    const monthInfo = obtenerInfoMes(events);
    // Usar un fragmento para optimizar la adición al DOM
    const virtualDOM = document.createDocumentFragment(); // Crear un DOM Virtual para rendimiento

    monthInfo.monthEvents.forEach((event) => {
        // Por cada evento
        event = desmenusarEvento(
            event,
            locations,
            participants,
            categories,
            category_event
        ); // Actualizar los atributos del evento
        const actvityContainer = document.createElement("div"); // Crear un contenedor para la actividad
        actvityContainer.classList.add("activity"); // Añadir clase al contenedor de la actividad
        actvityContainer.setAttribute("data-event-id", event.evt_id); // Asignarle un atributo con el id del evento/actividad al contenedor de la actividad
        // Añadir el contenido al contenedor de la actividad
        actvityContainer.innerHTML = `
            <div class="datetimeActivity">
                <div class="date">
                    <span class="day">${event.dayEvent}</span>
                    <span class="weekday">${event.weekdayEvent}</span>
                </div>
                <div class="time">
                    <span class="hour">${event.timeEvent}</span>
                </div>
            </div>
            <div class="informationActivity">
                <div class="titleActivityContainer">
                    <span class="titleActivity"
                        >${event.evt_tittle}</span
                    >
                </div>
                <div class="tags">
                    ${
                        event.categoriesEvent
                            ?.map(
                                (category) =>
                                    `<span class="tag">${category}</span>`
                            )
                            .join("") || ""
                    }
                </div>
                <div class="detailsActivity">
                    <span class="location"
                        ><i class="ti ti-map-pin"></i> ${
                            event.locationEvent
                        }</span
                    >
                    <span class="participants"
                        ><i class="ti ti-users"></i> ${
                            event.amountParticipanstEvent
                        }/${event.evt_capacity}
                        participantes</span
                    >
                </div>
            </div>
            <div class="priceActivity">
                <span class="price">${
                    event.evt_price > 0 ? "$" + event.evt_price : "Gratis"
                }</span>
                <span class="spots">${
                    event.spotsEvent === 0
                        ? "No hay cupos disponibles"
                        : event.spotsEvent > 1
                        ? event.spotsEvent + " cupos disponibles"
                        : event.spotsEvent + " cupo disponible"
                }</span>
            </div>
        `;
        virtualDOM.appendChild(actvityContainer); // Introducir cada contenedor de actividad al DOM Virtual previamente creado
    });

    eventsContainer.appendChild(virtualDOM); // Renderizar el DOM virtual en el DOM real

    const linksActivity = document.querySelectorAll(".activity"); // Obtener el contenedor de cada actividad renderizada

    linksActivity.forEach(
        (
            link // Por cada actividad
        ) =>
            link.addEventListener(
                "click",
                () =>
                    // Añadir evento de clic
                    verActividad(link.getAttribute("data-event-id")) // Llamar función de redireccionamiento a los detalles de la actividad
            )
    );
}
