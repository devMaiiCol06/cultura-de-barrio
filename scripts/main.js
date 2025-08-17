/* --------------------------- VARIABLES GLOBALES ---------------------------- */

// Variable para la URL base del proyecto
const BASE_URL = window.location.hostname.includes("github.io")
    ? "/cultura-de-barrio" // Ruta en GitHub Pages
    : ""; // Ruta en entorno local

document.addEventListener("DOMContentLoaded", function () {
    /* ==================================================
    -- FUNCIÓN UP SCREEN
    ================================================== */
    // Se utiliza para mostrar y ocultar un botón que suba al tope de la pagina
    const upButton = document.querySelector(".up"); // Obtener boton de acción

    window.addEventListener("scroll", () => {
        // Añadir un escuchador de eventos a la pantalla
        if (window.scrollY > 500) {
            // Si la pantalla a sido escroleada por mas de 500px
            upButton.style.display = "flex"; // Mostrar botón de acción
        } else {
            // Si la pantalla no ha sido escroleado mayor a 500px
            upButton.style.display = "none"; // Ocultar botón de acción
        }
    });

    /* ==================================================
    -- FUNCIÓN/MÉTODO FETCH 
    ================================================== */
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
            /* ----------------- VARIABLES DEL JSON -------------------- */

            // Accede a los datos JSON y los guarda en variables
            const events = data.EVENTS;
            const locations = data.LOCATIONS;
            const participants = data.PARTICIPANTS;

            /* ------------------ LLAMAR FUNCIÓN "renderizarTarjetaEvento"" ------------------- */

            // Llama a la función para renderizar eventos
            renderizarContenidoEvento(events, locations, participants);
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
        .catch((error) => console.error("Error:", error));

    /* -------------------------------------------------------------------------------------------- */

    /* ======================================================
    -- FUNCIÓN: Obtener los 3 eventos mas populares por participantes --
    ====================================================== */
    // Función para obtener los 3 eventos con más participantes
    function obtenerEventosPopulares(events, participants) {
        // Crea un map para almacenar el número de participantes del evento
        const eventParticipantCounts = new Map();

        // Contar participantes por cada evento
        for (const participant of participants) {
            const eventId = participant.fk_event;
            const currentCount = eventParticipantCounts.get(eventId) || 0;
            eventParticipantCounts.set(eventId, currentCount + 1);
        }

        // Convertir los eventos en arrays con su cantidad de participantes
        const eventsWithCounts = events.map((event) => ({
            ...event,
            participantCount: eventParticipantCounts.get(event.id) || 0,
        }));

        // Ordenar por cantidad de participantes y separar los 3 primeros con mas participantes
        return eventsWithCounts
            .sort((a, b) => b.participantCount - a.participantCount) // Ordernar
            .slice(0, 3); // Obtener los 3 con más participantes
    }

    /* ======================================================
    -- FUNCIÓN: Convertir formato de fecha --
    ====================================================== */
    // Función para formatear la fecha de 2025-08-15 18:00:00 a 15/08, 6:00 PM
    function formatearFechaEvento(dateString) {
        // Convertir el parametro a una fecha
        const date = new Date(dateString);

        // Darle formato a la fecha
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");

        // Convertir a PM o AM según la cantidad de horas
        const period = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;

        // Devolver la fecha formateada
        return `${day}/${month}, ${hours12}:${minutes} ${period}`;
    }

    /* ======================================================
    -- FUNCIÓN: Obtener la ubicación del evento/Actividad --
    ====================================================== */
    // Función para obtener la ubicación del evento/actividad
    function obtenerUbicacionEvento(event, locations) {
        const location = locations.find(
            (location) => location.loc_id === event.fk_loc
        );
        return location ? location.loc_name : null;
    }

    /* ======================================================
    -- FUNCIÓN: Obtener cantidad de participantes del event/actividad --
    ====================================================== */
    // Función para obtener la cantidad de participantes del evento/actividad
    function obtenerParticipantesEvento(event, participants) {
        const participantsLenght = participants.filter(
            (participant) => participant.fk_event === event.evt_id
        );

        return participantsLenght.length;
    }

    /* ======================================================
    -- FUNCIÓN: Renderizar las tarjetas de eventos populares --
    ====================================================== */
    // Función para renderizar las tarjetas de los eventos/actividades
    function renderizarContenidoEvento(events, locations, participants) {
        const activitiesContainer = document.querySelector(".activities"); // Obtener el contenedor de actividades
        const topThreeEvents = obtenerEventosPopulares(events, participants); // Obtener los 3 eventos más populares

        // Por cada evento crear una tarjeta de este
        topThreeEvents.forEach((event) => {
            const eventCard = document.createElement("div"); // Crear un nuevo div para la tarjeta
            eventCard.classList.add("activity"); // Añadir clase al contenedor anterior
            eventCard.onclick = () => go_to_detailsActivity(event.evt_id); // Añadir función de click que ejecute otra función
            // Insertar contenido al contenedor anterior
            eventCard.innerHTML = `
                <div class="activityImage">
                    <img
                        src="resources/images/activities.jpg"
                        alt="${event.evt_tittle}"
                    />
                </div>
                <div class="activityInfo">
                    <span class="activityTitle"
                        >${event.evt_tittle}</span
                    >
                    <span class="activityDescription"
                        >${event.evt_description}</span
                    >
                    <div class="locationDatetime_activity">
                        <span class="activityDatetime"
                            ><i class="ti ti-clock"></i> ${formatearFechaEvento(
                                event.evt_eventDate
                            )}</span
                        >
                        <span class="activityLocation"
                            ><i class="ti ti-map-pin"></i> ${obtenerUbicacionEvento(
                                event,
                                locations
                            )}</span
                        >
                    </div>
                    <div class="priceRegistered_activity">
                        <span class="activityPrice">${
                            event.evt_price ? event.evt_price : "Gratis"
                        }</span>
                        <span class="activityRegistered"
                            >${obtenerParticipantesEvento(
                                event,
                                participants
                            )}/${event.evt_capacity} inscritos</span
                        >
                    </div>
                </div>
            `;

            activitiesContainer.appendChild(eventCard); // Insertar la tarjeta/contenedor con su contenido y clase al contenedor principal de actividades
        });
    }
});

/* ======================================================
-- FUNCIÓN: Redireccionar a Autenticación --
====================================================== */
function go_auth() {
    window.location.href = "templates/auth.html";
}

/* ======================================================
-- FUNCIÓN: Redireccionar a Actividades --
====================================================== */
function go_activities() {
    window.location.href = "templates/activities.html";
}

/* ======================================================
-- FUNCIÓN: Redireccionar a Calendario --
====================================================== */
function go_calendar() {
    window.location.href = "templates/calendar.html";
}

/* ======================================================
-- FUNCIÓN: Redireccionar a Estadísticas --
====================================================== */
function go_statistics() {
    window.location.href = "templates/statistics.html";
}

/* ======================================================
-- FUNCIÓN: Redireccionar a detalles de la Actividad/Evento --
====================================================== */
function go_to_detailsActivity(eventId) {
    try {
        // Obtener los datos del usuario almacenados en localStorage
        const userData = localStorage.getItem("userData");
        // Intentar analizar solo si userData existe y es una cadena JSON válida
        const parsedUserData = userData ? JSON.parse(userData) : null;

        // Verificar si el usuario esta autenticado
        if (parsedUserData) {
            // Redireccionar a la pagina de detalles de la actividad con el ID especificado
            window.location.href = `templates/activity.html?id=${eventId}`;
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

/* ======================================================
-- FUNCIÓN: Subir al tope de la página --
====================================================== */
// Función para subir al tope de la página
function up_screen() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}