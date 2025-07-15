document.addEventListener("DOMContentLoaded", function () {
    // Lista de imágenes
    const selectedImage = "../resources/images/activities.jpg";

    // Variables para almacenar datos
    let categories;
    let category_event;
    let events;
    let locations;
    let participants;

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
            categories = data.CATEGORIES;
            category_event = data.CATEGORY_EVENT;
            events = data.EVENTS;
            locations = data.LOCATIONS;
            participants = data.PARTICIPANTS;

            // Llama a la función para manejar el filtro de categorías
            categoryFilter(
                categories,
                events,
                category_event,
                locations,
                participants
            );

            // Llama a la función para manejar el ordenamiento
            // orderFilter(events);

            // Llama a la función para contar y mostrar el total de eventos
            countTotalEvents(events);

            // Llama a la función para renderizar eventos
            renderEventos(
                events,
                categories,
                category_event,
                locations,
                participants
            );

            // Obtener el contenedor del input de búsqueda
            const searchContainer = document.getElementById("search");

            // Agregar un evento de entrada al campo de búsqueda
            searchContainer.addEventListener("input", function () {
                filterEventsByName(
                    events,
                    participants,
                    locations,
                    categories,
                    category_event
                );
            });
        })
        // Maneja errores
        .catch((error) => console.error("Error:", error));

    // Función para contar el total de eventos
    function countTotalEvents(events) {
        // Guardar el total de eventos en una variable
        const totalEvents = events.length;
        // Obtener el elemento HTML donde se mostrará el total de actividades
        const activitiesCountElement =
            document.getElementById("activitiesCount");
        // Verificar si el elemento existe o tiene contenido
        if (activitiesCountElement) {
            // Establecer el contenido del elemento con el total de actividades
            activitiesCountElement.innerHTML = `${totalEvents} actividades`;
        }
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
        const activitiesContainer = document.querySelector(
            ".activitiesContainer"
        );
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
            const locationName = obtenerUbicacionEvento(event, locations);

            // Generar botón que enlaza a la vista detallada del evento usando su identificador único (evt_id)
            const buttonHTML = `<button onclick="window.location.href='activity.html?id=${event.evt_id}'">Ver más</button>`;

            // Crear un div para la actividad/evento
            const eventCard = document.createElement("div");
            // Agregar una clase CSS al div anterior
            eventCard.classList.add("activity");
            eventCard.classList.add("cuadriculeOrder");
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
                                    event.evt_price
                                        ? `$${event.evt_price}`
                                        : "Gratis"
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

    // Función para obtener todas las categorías
    function categoryFilter(
        categories,
        events,
        category_event,
        locations,
        participants
    ) {
        // Obtener el menu desplegable de categorías
        const categoriesMenuContainer =
            document.getElementById("dropdown-menu");
        // Obtener el botón de filtro de categorias
        const categoriesFilterButton =
            document.querySelector(".categoryFilter");
        // Obtener el contenedor del contenido del botón de filtro
        const filterButtonContent = document.getElementById(
            "filterButtonContent"
        );

        // Validar que los elementos HTML existen antes de continuar.
        if (
            !categoriesMenuContainer ||
            !categoriesFilterButton ||
            !filterButtonContent
        ) {
            console.error(
                "Error: No se encontraron los elementos HTML necesarios (dropdown-menu, categoryFilter o categoryFilterContent)."
            );
            return;
        }

        // Verificar si hay categorías disponibles
        if (categories.length === 0) {
            categoriesMenuContainer.innerHTML =
                "<label>No hay categorías disponibles</label>";
            // Deshabilitar el botón si no hay categorías para filtrar
            categoriesFilterButton.disabled = true;
            return;
        }

        // Limpiar el contenido actual del contenedor antes de agregar las categorías y se agrega la opción de todas las categorías
        categoriesMenuContainer.innerHTML =
            "<div data-value='allCategories'>Todas las categorias</div>";

        // Agregar evento de clic para alternar la visibilidad del menú desplegable
        categoriesFilterButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evitar la propagación del evento
            categoriesMenuContainer.classList.toggle("show");
        });

        // Event listener para cerrar el menú si se hace clic fuera de él
        document.addEventListener("click", function (event) {
            if (
                !categoriesFilterButton.contains(event.target) &&
                !categoriesMenuContainer.contains(event.target) && // Asegurarse de que el clic no fue dentro del menú
                categoriesMenuContainer.classList.contains("show")
            ) {
                categoriesMenuContainer.classList.remove("show");
            }
        });

        // Iterar sobre las categorías y crear opciones de menú desplegable
        categories.forEach((category) => {
            // Crear un elemento de opción para cada categoría
            const optionCategory = document.createElement("div");
            // Agregar contenido al elemento de opción
            optionCategory.dataset.value = category.cat_id;
            optionCategory.textContent = category.cat_name;
            // Agregar el elemento de opción al contenedor del menú desplegable
            categoriesMenuContainer.appendChild(optionCategory);
        });

        // Agregar evento de clic para cada opción de categoría
        categoriesMenuContainer.addEventListener("click", function (event) {
            // Verificar si el elemento clickeado es una opción de categoría comprobando que su etiqueta HTML sea DIV
            if (event.target.tagName === "DIV") {
                // Obtener el valor de la categoría seleccionada
                const selectedCategoryId = event.target.dataset.value;
                // Actualizar el texto del botón con la categoría seleccionada
                filterButtonContent.textContent = event.target.textContent;
                // Cerrar el menú desplegable
                categoriesMenuContainer.classList.remove("show");
                // Llamar a la función para filtrar eventos por categoría
                filterEventsByCategory(
                    selectedCategoryId,
                    events,
                    categories,
                    category_event,
                    locations,
                    participants
                );
            }
        });

        // Nueva función para filtrar eventos por categoría
        function filterEventsByCategory(
            selectedCategoryId,
            allEvents,
            categories,
            category_event,
            locations,
            participants
        ) {
            // Crear un array para almacenar los eventos filtrados
            let filteredEvents = [];

            // Si se selecciona "Todas las categorías", mostrar todos los eventos
            if (selectedCategoryId === "allCategories") {
                filteredEvents = allEvents; // Mostrar todos los eventos
            } else {
                // Convertir el valor de selectedCategoryId a un número entero
                selectedCategoryId = parseInt(selectedCategoryId, 10);
                // Filtrar las relaciones category_event por la categoría seleccionada
                const eventIdsInCategory = category_event
                    .filter((rel) => rel.FK_cat === selectedCategoryId)
                    .map((rel) => rel.FK_evt);

                // Filtrar los eventos que tienen los IDs encontrados
                filteredEvents = allEvents.filter((event) =>
                    eventIdsInCategory.includes(event.evt_id)
                );
            }

            countTotalEvents(filteredEvents); // Actualizar el conteo de actividades

            // Volver a renderizar los eventos filtrados
            renderEventos(
                filteredEvents,
                categories,
                category_event,
                locations,
                participants
            );
        }
    }

    // Función para filtrar eventos por nombre
    function filterEventsByName(
        allEvents,
        participants,
        locations,
        categories,
        category_event
    ) {
        // Obtener el valor del input de búsqueda
        const searchData = document
            .getElementById("search")
            .value.toLowerCase();

        // Verificar si el input de búsqueda está vacío
        if (searchData === "") {
            // Actualizar el conteo total de eventos
            countTotalEvents(allEvents);
            // Si el input de búsqueda está vacío, mostrar todos los eventos
            renderEventos(
                allEvents,
                categories,
                category_event,
                locations,
                participants
            );
            return;
        }

        // Filtra los eventos cuyo título contiene el texto de búsqueda (sin distinguir mayúsculas/minúsculas)
        const filteredEvents = allEvents.filter((event) => {
            // Eliminar acentos y caracteres especiales de ambas cadenas para la comparación
            const normalizedTitle = event.evt_tittle
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/,/g, "");
            const normalizedSearch = searchData
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/,/g, "");

            return normalizedTitle.includes(normalizedSearch);
        });

        // Actualizar el conteo total de eventos y renderizar los resultados filtrados
        countTotalEvents(filteredEvents);
        renderEventos(
            filteredEvents,
            categories,
            category_event,
            locations,
            participants
        );
    }

    const cuadriculeOrderButton = document.querySelector(".btnCuadricule");
    const listOrderButton = document.querySelector(".btnList");
    const activitiesContainer = document.getElementById("activitiesContainer");
    
    cuadriculeOrderButton.addEventListener("click", () => {
        changeView("cuadricule");
    });
    
    listOrderButton.addEventListener("click", () => {
        changeView("list");
    });
    
    function changeView(type) {
        if (!activitiesContainer) {
            console.error(
                "No se puede cambiar la vista: activitiesContainer no está definido."
            );
            return;
        }

        const activityContents = document.querySelectorAll(".activity");

        // Quitar activeOrder a ambos íconos
        cuadriculeOrderButton.classList.remove("activeOrder");
        listOrderButton.classList.remove("activeOrder");

        // Elimina clases de todas las actividades
        activityContents.forEach((activity) => {
            activity.classList.remove("listOrder", "cuadriculeOrder");
        });

        if (type === "cuadricule") {
            activitiesContainer.classList.remove("listOrder");
            activitiesContainer.classList.add("cuadriculeOrder");
            activityContents.forEach((activity) => {
                activity.classList.add("cuadriculeOrder");
            });
            cuadriculeOrderButton.classList.add("activeOrder");
        } else {
            activitiesContainer.classList.remove("cuadriculeOrder");
            activitiesContainer.classList.add("listOrder");
            activityContents.forEach((activity) => {
                activity.classList.add("listOrder");
            });
            listOrderButton.classList.add("activeOrder");
        }
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
