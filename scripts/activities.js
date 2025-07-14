document.addEventListener("DOMContentLoaded", function () {
    // Lista de imágenes
    const imagesList = [
        "../resources/images/party.jpg",
        "../resources/images/graffiti_workbench.jpg",
        "../resources/images/football_tournoment.jpg",
        "../resources/images/kitchen_class.jpg",
        "../resources/images/cine_park.jpg",
        "../resources/images/dance.jpg",
        "../resources/images/child_tale.jpg",
        "../resources/images/gamer_zone.jpg",
        "../resources/images/street_market.jpg",
        "../resources/images/poetry_microphone.jpg",
        "../resources/images/yoga.jpg",
    ];

    // Obtener datos del archivo JSON
    fetch("../resources/data/data.json")
        // Verifica si la respuesta es exitosa
        .then((response) => {
            if (!response.ok)
                throw new Error("No se pudo cargar el archivo JSON");
            return response.json();
        })
        // Procesa los datos JSON
        .then((data) => {
            // Accede a los datos JSON y los guarda en variables
            const categories = data.CATEGORIES;
            const category_event = data.CATEGORY_EVENT;
            const events = data.EVENTS;
            const locations = data.LOCATIONS;
            const participants = data.PARTICIPANTS;

            // Llama a la función para renderizar eventos
            renderEventos(
                events,
                categories,
                category_event,
                locations,
                participants
            );

            // Llama a la función para contar y mostrar el total de eventos
            countTotalEvents(events);
        })
        // Maneja errores
        .catch((error) => console.error("Error:", error));

    
    // Función para contar el total de eventos
    function countTotalEvents(events) {
        return events.length;
    }
    // Llama a la función para contar el total de eventos
    const totalEvents = countTotalEvents(events);
    // Obtener el elemento HTML donde se mostrará el total de actividades
    const activitiesCountElement = document.getElementById("activitiesCount");
    // Verificar si el elemento existe
    if (activitiesCountElement) {
        // Establecer el contenido del elemento con el total de actividades
        activitiesCountElement.innerHTML = `${totalEvents} actividades`;
    }

    // Función para obtener las categorías de un evento
    function obtenerCategoriasDeEvento(evt_id, categories, category_event) {
        // Paso 1: Filtrar las relaciones donde FK_evt coincide con el evt_id
        const relaciones = category_event.filter(
            (rel) => rel.FK_evt === evt_id
        );

        // Paso 2: Por cada relación, buscar el nombre de la categoría
        const nombresCategorias = relaciones.map((rel) => {
            const cat = categories.find((c) => c.cat_id === rel.FK_cat);
            return cat ? cat.cat_name : "Categoría desconocida";
        });

        return nombresCategorias;
    }

    // Función para contar participantes en un evento
    function contarParticipantes(evt_id, participants) {
        return participants.filter((p) => p.FK_evt === evt_id).length;
    }

    // Funcion para saber la ubicación del evento
    function obtenerUbicacionEvento(event, locations) {
        const location = locations.find((loc) => loc.loc_id === event.fk_loc);
        return location ? location.loc_name : "Ubicación desconocida";
    }

    // Función para renderizar eventos
    function renderEventos(
        events,
        categories,
        category_event,
        locations,
        participants
    ) {

        // Obtener el contenedor de actividades
        const activitiesContainer = document.querySelector(".activitiesContainer");
        // Limpiar el contenido anterior
        activitiesContainer.innerHTML = "";
        // Verificar si hay eventos disponibles
        if (events.length === 0) {
            activitiesContainer.innerHTML =
                "<p>No hay eventos disponibles.</p>";
            return;
        }

        // Iterar sobre los eventos y crear tarjetas de actividades
        events.forEach((event, index) => {
            // Guardar categorias del evento en la variable mediante el llamado a la funcion
            const catEvt = obtenerCategoriasDeEvento(
                event.evt_id,
                categories,
                category_event
            );
            // Guardar participantes del evento en la variable mediante el llamado a la funcion
            const evt_participants = contarParticipantes(
                event.evt_id,
                participants
            );
            // Obtener la ubicación del evento mediante el llamado a la funcion
            const locationName = obtenerUbicacionEvento(
                event,
                locations
            )

            // Generar botón que enlaza a la vista detallada del evento usando su identificador único (evt_id)
            const buttonHTML = `<button onclick="window.location.href='activity.html?id=${event.evt_id}'">Ver más</button>`;

            // Seleccionar una imagen de la lista basada en el índice del evento
            const imageIndex = index % imagesList.length;
            const selectedImage = imagesList[imageIndex];

            // Crear un div para la actividad/evento
            const eventCard = document.createElement("div");
            // Agregar una clase CSS al div anterior
            eventCard.classList.add("activity");
            // Agregar contenido al div anterior
            eventCard.innerHTML = `
                    <div class="activityImage">
                        <img src="${selectedImage}" alt="${event.evt_tittle}" />
                    </div>
                    <div class="activityInfo">
                        <div class="activityHeaderSection">
                            <span class="activityTitle">${
                                event.evt_tittle
                            }</span>
                            <div class="categoriesActivity">
                                ${catEvt.map((cat) => `<p>${cat}</p>`).join("")}
                            </div>
                            <div class="activityDescription"
                            ><p>${event.evt_description}</p></div>
                        </div>
                        <div class="activityDetailsSection">
                            <div class="locationDatetime_activity">
                                <span class="activityDatetime"
                                    ><i class="ti ti-clock"></i> 15/12, 6:00
                                    PM</span
                                >
                                <span class="activityLocation"
                                ><i class="ti ti-map-pin"></i> ${locationName}</span
                                >
                            </div>
                            <progress value="${evt_participants}" max="${
                event.evt_capacity
            }"></progress>
                            <div class="activityRegistered">
                                <span class="activityRegisteredV1"
                                        >${evt_participants}/${
                event.evt_capacity
            } inscritos</span
                                    >
                                <span class="activityRegisteredV2"
                                    >${
                                        event.evt_capacity - evt_participants
                                    } cupos disponibles</span
                                >
                            </div>
                            <div class="priceRegistered_activity">
                                <span class="activityPrice">${
                                    event.evt_price ? event.evt_price : "Gratis"
                                }</span>
                                ${buttonHTML}
                            </div>
                        </div>
                    </div>
                `;
            // Agregar el div anterior al contenedor de actividades
            activitiesContainer.appendChild(eventCard);
        });

    }

});

// Función para volver a la página principal
function back_to_home() {
    window.location.href = "../index.html";
}
// Función para ir a la página de calendario
function go_to_calendar() {
    window.location.href = "../templates/calendar.html";
}
// Función para ir a la página de estadísticas
function go_to_statistics() {
    window.location.href = "../templates/statistics.html";
}
// Función para ir a la página de autenticación
function go_to_login() {
    window.location.href = "../templates/login.html";
}
