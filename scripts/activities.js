import showUserHeader from "./functions/showUserHeader.js";
import getLocalUsers from "./functions/getLocalUsers.js";

/* --------------------------- VARIABLES GLOBALES ---------------------------- */

// Variable para la URL base del proyecto
const BASE_URL = window.location.hostname.includes("github.io")
    ? "/cultura-de-barrio" // Ruta en GitHub Pages
    : ""; // Ruta en entorno local

document.addEventListener("DOMContentLoaded", function () {
    // Lista de imágenes
    const selectedImage = "../resources/images/activities.jpg";

    // Variables para almacenar datos
    let users;
    let categories;
    let category_event;
    let events;
    let locations;
    let participants;
    let activityId;

    // Obtener datos del archivo JSON
    fetch(`${BASE_URL}/resources/data/data.json`)
        // Verifica si la respuesta es exitosa
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
            showUserHeader(users = unirDatosJsonLocal(users, getLocalUsers()), events);

            // Llama a la función para manejar el filtro de categorías
            categoryFilter(
                categories,
                events,
                category_event,
                locations,
                participants
            );

            // Llama a la función para manejar el ordenamiento
            orderFilter(
                events,
                participants,
                locations,
                categories,
                category_event
            );

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
        // Obtener la lista de participantes de eventos desde el localStorage o crearla como un array vacío
        let participacionesEventos =
            JSON.parse(localStorage.getItem("eventParticipants")) || [];
        const participantes = unirDatosJsonLocal(
            participants,
            participacionesEventos
        );
        return participantes.filter((p) => p.fk_event === evt_id).length;
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

        // Usar un fragmento para optimizar la adición al DOM
        const fragment = document.createDocumentFragment();

        // Iterar sobre los eventos y crear tarjetas de actividades
        events.forEach((event) => {
            // Guardar el id del evento en la variable
            activityId = event.evt_id;
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
            const isListView = document
                .getElementById("activitiesContainer")
                .classList.contains("listOrder");
            // Crear un div para la actividad/evento
            const eventCard = document.createElement("div");
            // Agregar una clase CSS al div anterior
            eventCard.classList.add("activity");
            eventCard.classList.add(
                isListView ? "listOrder" : "cuadriculeOrder"
            );

            // Agregar contenido al div anterior
            eventCard.innerHTML = `
                    <div class="activityImage goToDetailsButton" data-event-id="${
                        event.evt_id
                    }">
                        <img src="${selectedImage}" alt="${event.evt_tittle}" />
                    </div>
                    <div class="activityInfo">
                        <div class="activityHeaderSection">
                            <span class="activityTitle goToDetailsButton" data-event-id="${
                                event.evt_id
                            }">${event.evt_tittle}</span>
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
                                <button class="goToDetailsButton" data-event-id="${
                                    event.evt_id
                                }">Ver más</button>
                            </div>
                        </div>
                    </div>
                `;

            // Agregar la tarjeta al fragmento en lugar de al DOM
            fragment.appendChild(eventCard);
        });

        // Añadir todos los elementos del fragmento al contenedor en una sola operación
        activitiesContainer.appendChild(fragment);

        // Obtener los botones de ir a detalles
        const goToDetailsButtons =
            document.querySelectorAll(".goToDetailsButton");

        // Verificar si el botón existe antes de añadir el event listener
        if (goToDetailsButtons.length > 0) {
            goToDetailsButtons.forEach((button) => { // Por cada botón añadir un escuchador de eventos que se ejecuta con un evento de clic
                button.addEventListener("click", () => {
                    // Obtener el ID del evento desde el atributo 'data-event-id'
                    const eventId = button.getAttribute("data-event-id");

                    // Llamar a tu función con el ID
                    go_to_detailsActivity(eventId);
                });
            });
        }
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
                    .map((rel) => rel.fk_event);

                // Filtrar los eventos que tienen los IDs encontrados
                filteredEvents = allEvents.filter((event) =>
                    eventIdsInCategory.includes(event.evt_id)
                );
            }

            // Obtener el input de búsqueda
            const searchInput = document.getElementById("search");
            // Limpiar el input de búsqueda
            searchInput.value = "";

            // Obtener el botón de orden
            const orderButtonContent =
                document.getElementById("orderButtonContent");
            // Actualizar el texto del botón a su estado original
            orderButtonContent.textContent = "Orden";

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
        // Obtener el valor del input de búsqueda en minúsculas
        const searchData = document
            .getElementById("search")
            .value.toLowerCase();

        // Verificar si el input de búsqueda está vacío
        if (searchData === "") {
            // Si esta vacío se cargan todos los eventos
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

        // Obtener el botón de filtro de categorias
        const filterButtonContent = document.getElementById(
            "filterButtonContent"
        );
        // Actualizar el texto del botón a su estado original
        filterButtonContent.textContent = "Todas las categorias";

        // Obtener el botón de orden
        const orderButtonContent =
            document.getElementById("orderButtonContent");
        // Actualizar el texto del botón a su estado original
        orderButtonContent.textContent = "Orden";

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

    // Obtener el botón/icono de vista de cuadricula y lista
    const cuadriculeOrderButton = document.querySelector(".btnCuadricule");
    const listOrderButton = document.querySelector(".btnList");
    // Obtener el contenedor de actividades
    const activitiesContainer = document.getElementById("activitiesContainer");

    // Agregar eventos de clic a los botones/iconos
    cuadriculeOrderButton.addEventListener("click", () => {
        changeView("cuadricule");
    });

    listOrderButton.addEventListener("click", () => {
        changeView("list");
    });

    // Función para cambiar la vista entre cuadricula y lista
    function changeView(type) {
        // Verificar si el contenedor de actividades existe
        if (!activitiesContainer) {
            console.error(
                "No se puede cambiar la vista: activitiesContainer no está definido."
            );
            return;
        }

        // Obtener todas las actividades
        const activityContents = document.querySelectorAll(".activity");

        // Quitar activeOrder a ambos íconos
        cuadriculeOrderButton.classList.remove("activeOrder");
        listOrderButton.classList.remove("activeOrder");

        // Elimina clases de todas las actividades
        activityContents.forEach((activity) => {
            activity.classList.remove("listOrder", "cuadriculeOrder");
        });

        // Agregar clases según el tipo de vista seleccionada
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

    // Función para ordenar eventos/actividades
    function orderFilter(
        events,
        participants,
        locations,
        categories,
        category_event
    ) {
        // Obtener el menu desplegable de categorías
        const orderMenuContainer = document.getElementById(
            "dropdown-menu-order"
        );
        // Obtener el botón de filtro de categorias
        const orderFilterButton = document.querySelector(".orderFilter");
        // Obtener el contenedor del contenido del botón de filtro
        const orderButtonContent =
            document.getElementById("orderButtonContent");

        // Validar que los elementos HTML existen antes de continuar.
        if (!orderMenuContainer || !orderFilterButton || !orderButtonContent) {
            console.error(
                "Error: No se encontraron los elementos HTML necesarios (dropdown-menu-order, orderFilter o orderButtonContent)."
            );
            return;
        }

        // Declarar una lista de categorías para ordenar
        let categoriesList = [
            "Menor precio",
            "Mayor precio",
            "Fecha más reciente",
            "Fecha más antigua",
            "Menor cupos",
            "Mayor cupos",
        ];

        // Verificar si hay categorías de orden disponibles
        if (categoriesList.length === 0) {
            orderMenuContainer.innerHTML =
                "<label>No hay categorías disponibles</label>";
            // Deshabilitar el botón si no hay categorías para filtrar
            orderFilterButton.disabled = true;
            return;
        }

        // Limpiar el contenido actual del contenedor antes de agregar las categorías de orden
        orderMenuContainer.innerHTML = "";

        // Agregar evento de clic para alternar la visibilidad del menú desplegable
        orderFilterButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Evitar la propagación del evento
            orderMenuContainer.classList.toggle("show");
        });

        // Event listener para cerrar el menú si se hace clic fuera de él
        document.addEventListener("click", function (event) {
            if (
                !orderFilterButton.contains(event.target) &&
                !orderMenuContainer.contains(event.target) && // Asegurarse de que el clic no fue dentro del menú
                orderMenuContainer.classList.contains("show")
            ) {
                orderMenuContainer.classList.remove("show");
            }
        });

        // Iterar sobre las categorías y crear opciones de menú desplegable
        categoriesList.forEach((category) => {
            // Crear un elemento de opción para cada categoría
            const optionCategory = document.createElement("div");
            // Agregar contenido al elemento de opción
            optionCategory.dataset.value = category;
            optionCategory.textContent = category;
            // Agregar el elemento de opción al contenedor del menú desplegable
            orderMenuContainer.appendChild(optionCategory);
        });

        // Agregar evento de clic para cada opción de categoría
        orderMenuContainer.addEventListener("click", function (event) {
            // Verificar si el elemento clickeado es una opción de categoría comprobando que su etiqueta HTML sea DIV
            if (event.target.tagName === "DIV") {
                // Obtener el valor de la categoría seleccionada
                const selectedOrderId = event.target.dataset.value;
                // Actualizar el texto del botón con el orden seleccionado
                orderButtonContent.textContent = event.target.textContent;
                // Cerrar el menú desplegable
                orderMenuContainer.classList.remove("show");
                // Llamar a la función para filtrar eventos por orden
                orderEvents(
                    selectedOrderId,
                    events,
                    participants,
                    locations,
                    categories,
                    category_event
                );
            }
        });

        // Nueva función para filtrar eventos por categoría de orden
        function orderEvents(
            selectedOrderId,
            allEvents,
            categories,
            category_event,
            locations,
            participants
        ) {
            // Crear un array para almacenar los eventos filtrados
            let orderedEvents = [];

            // Ordenar los eventos de acuerdo al orden seleccionado
            if (selectedOrderId === "Menor precio") {
                orderedEvents = allEvents.sort(
                    (a, b) => a.evt_price - b.evt_price
                );
            } else if (selectedOrderId === "Mayor precio") {
                orderedEvents = allEvents.sort(
                    (a, b) => b.evt_price - a.evt_price
                );
            } else if (selectedOrderId === "Fecha más reciente") {
                orderedEvents = allEvents.sort((a, b) => {
                    const dateA = new Date(
                        a.evt_registerDate.replace(" ", "T")
                    );
                    const dateB = new Date(
                        b.evt_registerDate.replace(" ", "T")
                    );
                    return dateB - dateA;
                });
            } else if (selectedOrderId === "Fecha más antigua") {
                orderedEvents = allEvents.sort((a, b) => {
                    const dateA = new Date(
                        a.evt_registerDate.replace(" ", "T")
                    );
                    const dateB = new Date(
                        b.evt_registerDate.replace(" ", "T")
                    );
                    return dateA - dateB;
                });
            } else if (selectedOrderId === "Menor cupos") {
                orderedEvents = allEvents.sort(
                    (a, b) => a.evt_capacity - b.evt_capacity
                );
            } else if (selectedOrderId === "Mayor cupos") {
                orderedEvents = allEvents.sort(
                    (a, b) => b.evt_capacity - a.evt_capacity
                );
            }

            // Obtener el botón de filtro de categorias
            const filterButtonContent = document.getElementById(
                "filterButtonContent"
            );
            // Actualizar el texto del botón a su estado original
            filterButtonContent.textContent = "Todas las categorias";

            // Obtener el input de búsqueda
            const searchInput = document.getElementById("search");
            // Limpiar el input de búsqueda
            searchInput.value = "";

            countTotalEvents(orderedEvents); // Actualizar el conteo de actividades

            // Volver a renderizar los eventos filtrados
            renderEventos(
                orderedEvents,
                categories,
                category_event,
                locations,
                participants
            );
        }
    }

    // ======================================================
    // -- FUNCIÓNES: Volver a la página principal, ir a la página de calendario, ir a la página de estadísticas, ir a la página de autenticación e ir a la página de detalles de la actividad --
    // ======================================================

    // Función para volver a la página principal
    document
        .querySelector(".backButton")
        .addEventListener("click", function () {
            window.location.href = "../index.html";
        });
    // Función para ir a la página de calendario
    document
        .querySelector(".calendarButton")
        .addEventListener("click", function () {
            window.location.href = "../templates/calendar.html";
        });
    // Función para ir a la página de estadísticas
    document
        .querySelector(".statisticsButton")
        .addEventListener("click", function () {
            window.location.href = "../templates/statistics.html";
        });
    // Función para ir a la página de autenticación
    document
        .querySelector(".subscribeButton")
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

    // ======================================================
    // -- FUNCIÓN: Subir al tope de la página --
    // ======================================================
    // Función para subir al tope de la página
    const upButton = document.querySelector(".up");

    /* FUNCTION SHOW BUTTON (UP) */
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

/* ======================================================
    -- FUNCIÓN: Juntar datos de JSON y LocalStorage --
    ====================================================== */

// Función para unir la información obtenida de la API de JSON y LocalStorage
function unirDatosJsonLocal(dataJSON, dataLOCAL) {
    // Verificar si estan los parametros
    if (!dataJSON || !dataLOCAL) {
        // Si alguno de los dos parametros faltan mostrar mensaje de error
        console.error(
            "Falta los datos del parametro " +
                (!dataJSON ? "JSON" : "") +
                (!dataLOCAL ? "LocalStorage" : "") +
                " para poder proceder con la función de unir los datos"
        );
        // Salir de la función
        return;
    }

    const dataUnitedStringified = new Set(); // Creamos un Set para cadenas de texto y poder evitar duplicados

    // Agregar datos desde el JSON
    dataJSON.forEach((data) => {
        dataUnitedStringified.add(JSON.stringify(data)); // Agregamos la versión en cadena
    });

    // Agregar datos desde el LOCAL STORAGE
    dataLOCAL.forEach((data) => {
        dataUnitedStringified.add(JSON.stringify(data)); // Agregamos la versión en cadena
    });

    // Convertir las cadenas de vuelta a objetos
    const DataUnited = Array.from(dataUnitedStringified).map((str) =>
        JSON.parse(str)
    );

    return DataUnited; // Retornamos un Array de objetos únicos
}
