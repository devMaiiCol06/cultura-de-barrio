/* --------------------------- VARIABLES GLOBALES ---------------------------- */

/* Aquí se obtiene el ID del evento de la URL */

// Obtener el ID del evento desde la URL
const url = new URL(window.location); // Obtener la url de la pagina
const id_evento_url = parseInt(url.searchParams.get("id")); // Buscar la llave 'id' en la url y obtener su valor en formato entero

// Verificar si hay un id en la url
if (!id_evento_url) {
    // Si no hay un id, redirige a la pagina de actividades
    window.location.href = "../templates/activities.html";
}

/* ------------------- */

/* 
    Aquí se intenta obtener el ID del usuario del localStorage
    Y si no hay un id, redirige a la pagina de login
*/

// Obtener la información del usuario del localStorage
let userData = JSON.parse(localStorage.getItem("userData")); // Obtener la información del usuario del localStorage y convertirlo en un objeto

// Verificar si la variable userData tiene un valor
if (!userData || !userData.user_id) {
    // Si no hay información en la variable creada en base al localstorage, redirige a la pagina de autenticación
    window.location.href = "../templates/login.html";
}

/* ------------------- */

// Obtener el botón de inscripción del evento
const subscribeButtonPlace = document.getElementById("subscribeButton");

/* ------------------- */

// Imagen global de usuario para cada participante
const userGlobalImage = "../resources/images/user.png";

/* ------------------- */

// Obtener la lista de participantes de eventos desde el localStorage o crearla como un array vacío
let participacionesEventos =
    JSON.parse(localStorage.getItem("eventParticipants")) || [];

/* ------------------- */

// Obtener la lista de preguntas de eventos desde el localStorage o crearla como un array vacío
let preguntasEvento = JSON.parse(localStorage.getItem("eventQuestions")) || [];

/* ------------------- */

let tooltipTimeout; // Variable global para el temporizador de ocultamiento

/* -------------------------------------------------------------------------------------------- */

// Evento que se ejecuta cuando todos los recursos esten completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    /* ------------------ FUNCIÓN UP SCREEN ------------------- */

    // Se utiliza para mostrar y ocultar un botón que suba al tope de la pagina

    const upButton = document.querySelector('.up'); // Obtener boton de acción

    window.addEventListener('scroll', () => { // Añadir un escuchador de eventos a la pantalla
        if (window.scrollY > 500) { // Si la pantalla a sido escroleada por mas de 500px
            upButton.style.display = 'flex'; // Mostrar botón de acción
        } else { // Si la pantalla no ha sido escroleado mayor a 500px
            upButton.style.display = 'none'; // Ocultar botón de acción
        }
    });

    /* ------------------ FUNCIÓN/MÉTODO FETCH ------------------- */

    /* Se utiliza el método fetch para obtener datos de una API o archivo JSON */

    // Obtener datos del archivo JSON
    fetch("../resources/data/data.json")
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
            const categories = data.CATEGORIES;
            const category_event = data.CATEGORY_EVENT;
            const events = data.EVENTS;
            const locations = data.LOCATIONS;
            const participants = data.PARTICIPANTS;
            const users = data.USERS;
            const answers = data.ANSWERS;
            const questions = data.QUESTIONS;
            const accessibilities = data.ACCESSIBILITY;
            const requirements = data.REQUIREMENTS;
            const event_requirements = data.EVENT_REQUIREMENT;
            const carrys = data.CARRYS;

            /* ------------------ BUSCAR Y VERIFICAR EL ID DEL EVENTO -------------------- */

            // Buscar el evento con el ID proporcionado de la URL
            const event = events.find((event) => event.evt_id == id_evento_url);
            // Verificar si se encontró el evento
            if (!event) {
                // Si no se encuentra el evento, redirige a la pagina de actividades
                window.location.href = "../templates/activities.html";
            }

            /* ------------------ LLAMAR FUNCIÓN obtenerInfoCreadorEvento ------------------- */

            // Llama a la función para obtener el usuario creador del evento
            const creatorUser = obtenerInfoCreadorEvento(event, users);

            /* ------------------ LLAMAR FUNCIÓN "renderizarDetallesEvento"" ------------------- */

            // Llama a la función para renderizar eventos
            renderizarContenidoEvento(
                event,
                categories,
                category_event,
                locations,
                participants,
                users,
                answers,
                questions,
                accessibilities,
                requirements,
                event_requirements,
                subscribeButtonPlace,
                creatorUser,
                carrys,
                events
            );
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
        .catch((error) => console.error("Error:", error));

    /* -------------------------------------------------------------------------------------------- */

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
        const DataUnited = Array.from(dataUnitedStringified).map(str => JSON.parse(str));

        return DataUnited; // Retornamos un Array de objetos únicos
    }

    /* ======================================================
    -- FUNCIÓN: Motrar minimodal de respuesta en header --
    ====================================================== */

    // Función para mostar minimodal en header
    function showModal(response) {
        // Borrar el temporizador anterior si existe
        clearTimeout(tooltipTimeout);

        // Obtener el tooltip una sola vez
        const tooltip = document.querySelector(".tooltip");

        // Si no se encuentra el tooltip, salimos de la función
        if (!tooltip) {
            console.error("No se encontró el elemento .tooltip en el DOM.");
            return;
        }

        // Usar classList para controlar la visibilidad y los estilos
        tooltip.classList.add("is-visible");

        // Crear el icono dinámicamente
        let iconClass; // Crear contenedor del tipo de icono
        switch (
            response.state // Por cada caso verificar
        ) {
            case "success":
                iconClass = "ti-check";
                break;
            case "error":
                iconClass = "ti-alert-circle";
                break;
            default:
                iconClass = "ti-info-circle";
        }

        // Añadir color de fondo según sea el tipo de mensaje
        tooltip.classList.remove("success", "error", "info"); // Eliminar fondos anteriores
        if (response.state === "success") {
            tooltip.style.backgroundColor = "rgba(76, 175, 80, 0.85)"; // Verde claro opaco
        } else if (response.state === "error") {
            tooltip.style.backgroundColor = "rgba(244, 67, 54, 0.85)"; // Rojo claro opaco
        } else {
            tooltip.style.backgroundColor = "rgba(55, 71, 79, 0.85)"; // Gris oscuro opaco
        }

        // Inyectar el HTML
        tooltip.innerHTML = `
            <i class='ti ${iconClass}'></i>
            <span>${response.message}</span>
        `;

        // Ocultar el tooltip después de 3 segundos con un temporizador
        tooltipTimeout = setTimeout(() => {
            tooltip.classList.remove("is-visible");
        }, 3000);
    };

    /* ======================================================
    -- FUNCIÓN: Obtener participantes del evento --
    ====================================================== */

    // Función para obtener el precio del evento
    function obtenerParticipantesEvento(event, participants) {
        // Obtener los participantes del evento desde el JSON
        const participantsEventJson = participants.filter((participant) => participant.fk_event === event.evt_id);
        // Obtener las participaciones del evento desde el LocalStorage
        const participantsEventLocal = participacionesEventos.filter((participant) => participant.fk_event === event.evt_id);
        // Unir los datos de los participantes del evento mediante el llamado a la función unirDatosJsonLocal
        const participantsEventUnited = unirDatosJsonLocal(participantsEventJson, participantsEventLocal);

        // Devolver los participantes del evento
        return participantsEventUnited;
    }

    /* ======================================================
    -- FUNCIÓN: Devolver cantidad de participantes por evento --
    ====================================================== */

    // Función para contar participantes en un evento
    function contarParticipantes(event, participants) {
        return obtenerParticipantesEvento(event, participants).length;
    }

    /* ======================================================
    -- FUNCIÓN: Obtener información del creador del evento --
    ====================================================== */

    // Función para obtener el usuario creador del evento
    function obtenerInfoCreadorEvento(event, users) {
        // Busca en los usuarios y devuelve el usuario con el user_id correspondiente al creador del evento
        const userCreator = users.find(
            (user) => user.user_id === event.FK_creator
        );
        // Verificar si el usuario creador existe
        if (!userCreator) {
            // Si no existe, devuelve un mensaje
            console.error("No se encontró el usuario creador del evento");
            // Salir de la función
            return;
        }
        // Devuelve el usuario creador del evento
        return userCreator;
    }

    /* ======================================================
    -- FUNCIÓN: Obtener información de la participación del usuario en el evento --
    ====================================================== */

    // Función para obtener el usuario creador del evento
    function obtenerInfoParticipanteEvento(event, participants) {
        // Obtener los participantes del evento
        const participantsEventUnited = obtenerParticipantesEvento(event, participants);

        // Verificar si el usuario ya está inscrito en el evento
        const participationExists = participantsEventUnited.find(
            (participation) =>
                participation.fk_user === userData.user_id &&
            participation.fk_event === event.evt_id
        );
        // Devuelve si existe la participación o no
        return participationExists;
    }

    /* ======================================================
    -- FUNCIÓN: Actualizar estado del botón de inscripción --
    ====================================================== */

    // Función para obtener el precio del evento
    function actualizarEstadoBotonInscripcion(
        event,
        userData,
        subscribeButtonPlace,
        participants,
        users,
        userGlobalImage,
        creatorUser
    ) {
        // Verificar si hay un botón para mostrar el precio del evento
        if (!subscribeButtonPlace) {
            // Si no hay un botón, devuelve un mensaje de error
            console.error("No hay un botón para mostrar el precio del evento");
            // Salir de la función
            return;
        }

        // Obtener la información de la participación del usuario en el evento
        const participationExists = obtenerInfoParticipanteEvento(event, participants);

        // Eliminar todas las clases de estilo del boton
        subscribeButtonPlace.className = "";
        // Eliminar todos los onclicks y funciones del boton
        subscribeButtonPlace.onclick = null;

        // Contar los participantes del evento
        const inscritos = contarParticipantes(event, participants);

        // Obtener la información del creador del evento
        const userCreator = obtenerInfoCreadorEvento(event, users);

        if (userCreator.user_id === userData.user_id) { // Si el usuario es el creador del evento
            subscribeButtonPlace.innerHTML = "Mi evento";
            // Añadir clase para estilos CSS correspondientes
            subscribeButtonPlace.classList.add("buttonHeader");

        } else if (inscritos > event.evt_capacity) { // Si el evento está lleno
            // Si el evento está lleno, y mostrar un mensaje
            subscribeButtonPlace.innerHTML = "Cupos llenos";
            // Añadir clase para estilos CSS correspondientes
            subscribeButtonPlace.classList.add("buttonHeader");

        } else { // Si el usuario no es el creador del evento y el evento no está lleno

            if (participationExists) { // Si el usuario ya está inscrito en el evento
                // Cambiar el onclick/llamado a la función de eliminar participación en el botón que ya esta
                subscribeButtonPlace.onclick = function () {
                    eliminarInscripcionUsuario(userData, event, subscribeButtonPlace, participants, users, userGlobalImage, creatorUser);
                };

                // Agregar la clase de estilo para el botón de eliminar participación
                subscribeButtonPlace.classList.add("deleteParticipationButton");

                // Mostrar el botón de eliminar participación en el botón
                subscribeButtonPlace.innerHTML = `
                    Eliminar Inscripción
                `;

            } else { // Si el usuario no está inscrito en el evento

                // Obtener el precio del evento
                const precioEvento = event.evt_price;
    
                // Declarar una variable para mostrar el texto
                let priceText = (!precioEvento ? "Inscribirse - Gratis" : `Inscribirse - $${event.evt_price}`);

                // Agregar una clase al botón
                subscribeButtonPlace.classList.add("addParticipationButton");
    
                // Mostrar el precio del evento en el contenedor
                subscribeButtonPlace.innerHTML = priceText;
    
                // Añadir el onclick/llamado a la función de inscribirse en el botón
                subscribeButtonPlace.onclick = function () {
                    inscribirUsuarioAEvento(
                        userData,
                        event,
                        subscribeButtonPlace,
                        participants,
                        users,
                        userGlobalImage,
                        creatorUser
                    );
                };
            }
        }
        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Establecer imagen principal del evento --
    ====================================================== */

    // Función para obtener el contenedor de la imagen del evento
    function establecerImagenPrincipalEvento() {
        // Obtener el contenedor de la imagen del evento
        const imagePlace = document.getElementById("principalSection");

        // Verificar si hay un contenedor para mostrar la imagen del evento
        if (!imagePlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la imagen del evento"
            );

            // Salir de la función
            return;
        }

        // Obtener la imagen del evento
        /* De momento toca manejar la misma imagen para todas las actividades/eventos 
        ya que en el archivo data.json no se manejan archivos de imagen */
        const eventImage = "../resources/images/activities.jpg";

        // Verificar si la imagen del evento existe
        if (!eventImage) {
            // Si no hay una imagen, devuelve un mensaje en el contenedor y agrega una clase al contenedor

            // Agregar una clase al contenedor de la imagen del evento
            imagePlace.classList.add("noImage");
            // Agregar el mensaje en el contenedor de la imagen del evento
            imagePlace.innerHTML = `
                No hay imagen para este evento
            `;

            // Salir de la función
            return;
        }

        // Mostrar la imagen del evento en el contenedor mediante un estilo CSS
        imagePlace.style.backgroundImage = `url(${eventImage})`;

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar categorías del evento --
    ====================================================== */

    // Función para obtener las categorías del evento
    function mostrarCategoriasEvento(event, categories, category_event) {
        // Obtener el contenedor de las categorías en en el contenedor principal
        const categoriesInPrincipal = document.getElementById(
            "principalCategoriesList"
        );

        // Verificar si hay un contenedor de categorías
        if (!categoriesInPrincipal) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar las categorías del evento"
            );

            // Salir de la función
            return;
        }

        // Filtrar las relaciones donde fk_event coincide con el evt_id
        const relaciones = category_event.filter(
            (rel) => rel.fk_event === event.evt_id
        );

        // Verificar si hay relaciones de categorías
        if (relaciones.length === 0) {
            // Si no hay relaciones, devolver un mensaje y salir de la función
            categoriesInPrincipal.innerHTML =
                "<p class='nullInfoInDescription'>No hay categorías definidas</p>";

            // Salir de la función
            return;
        }

        // Por cada relación, buscar el nombre de la categoría
        const nombresCategorias = relaciones.map((rel) => {
            const cat = categories.find((c) => c.cat_id === rel.FK_cat);
            // Verificar si la categoría existe y devolver su nombre
            return cat ? cat.cat_name : "Categoría desconocida";
        });

        nombresCategorias.forEach((nombreCategoria) => {
            // Crear un p que contenga cada categoría
            const categoryCard = document.createElement("p");
            // Agregar una clase al p anterior
            categoryCard.classList.add("categoryItem");
            // Agregar el nombre del categoría al p anterior
            categoryCard.textContent = `
                ${nombreCategoria}
            `;
            // Agregar el p anterior al contenedor de categorias
            categoriesInPrincipal.appendChild(categoryCard);
        });

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Actualizar títulos del evento --
    ====================================================== */

    // Función para obtener el título del evento
    function mostrarTituloEvento(event) {
        // Obtener el contenedor donde se mostrará el título del evento
        const titlePlace = document.getElementById("titlePrincipal");
        // Obtener el contenedor del titulo de la pagina
        const tabTitlePlace = document.getElementById("tabTitlePlace");

        // Verificar si hay un contenedor para mostrar el título del evento
        if (!titlePlace || !tabTitlePlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                `No hay un contenedor para mostrar el título del evento: ${titlePlace} o ${tabTitlePlace}`
            );

            // Salir de la función
            return;
        }

        // Obtener el título del evento
        const tituloEvento = event.evt_tittle;

        // Verificar si el evento tiene un título
        if (!tituloEvento) {
            // Si no hay un título, devuelve un mensaje en el contenedor
            titlePlace.innerHTML = `
                No hay título para este evento
            `;

            // Salir de la función
            return;
        }

        // Mostrar el titulo del evento en la pestaña de la pagina
        tabTitlePlace.innerHTML = `
            Cultura de Barrio - ${tituloEvento}
        `;

        // Mostrar el título del evento en el contenedor
        titlePlace.innerHTML = `
            ${tituloEvento}
        `;

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar conteo de participantes --
    ====================================================== */

    // Función para contar participantes en un evento
    function mostrarConteoParticipantes(event, participants) {
        // Obtener el contenedor donde se mostrará la cantidad de participantes del evento
        const participantsPlace = document.getElementById("mini-infoPrincipal");

        // Verificar si hay un contenedor para mostrar la cantidad de participantes del evento
        if (!participantsPlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la cantidad de participantes del evento"
            );

            // Salir de la función
            return;
        }

        // Obtener la cantidad de participantes del evento
        const cantidadParticipantes = contarParticipantes(event, participants);
        // Obtener cantidad de cupos del evento
        const cuposEvento = event.evt_capacity || 0;

        // Declarar una variable para mostrar el texto
        let text = "";

        // Verificar si hay cupos definidos
        if (cuposEvento > 0) {
            // Si hay cupos definidos, muestra la cantidad de participantes y los cupos
            text = `<i class="ti ti-users"></i> ${cantidadParticipantes} de ${cuposEvento} inscritos`;
        } else {
            // Esto cubre casos donde evt_capacity es 0 o indefinido/null
            text = `<i class="ti ti-users"></i> ${cantidadParticipantes}/0 inscritos`;
        }

        // Mostrar la cantidad de participantes en el contenedor
        participantsPlace.innerHTML = text;
        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar descripción del evento --
    ====================================================== */

    // Función para obtener la descripción del evento
    function mostrarDescripcionEvento(event) {
        // Obtener el contenedor donde se mostrará la descripción del evento
        const descriptionPlace = document.getElementById("descriptionPlace");

        // Verificar si hay un contenedor
        if (!descriptionPlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la descripción del evento"
            );
        }

        // Obtener la descripción del evento
        const descripcionEvento = event.evt_description;

        // Verificar si el evento tiene una descripción
        if (!descripcionEvento) {
            // Si no hay una descripción, devuelve un mensaje en el contenedor
            descriptionPlace.innerHTML = `
                No hay descripción para este evento
            `;
            // Salir de la función
            return;
        }

        // Mostrar la descripción del evento en el contenedor
        descriptionPlace.innerHTML = `
            ${descripcionEvento}
        `;

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Listar requerimientos del evento --
    ====================================================== */

    // Función para obtener los requerimientos del evento
    function mostrarListaRequerimientosEvento(
        event,
        requirements,
        event_requirements
    ) {
        // Obtener el contenedor de la lista de requerimientos en en el contenedor de descripción
        const requirementsInDescription =
            document.getElementById("requirementsList");

        // Verificar si hay un contenedor de requerimientos
        if (!requirementsInDescription) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar los requerimientos del evento"
            );

            // Salir de la función
            return;
        }

        // Filtrar las relaciones donde fk_event coincide con el evt_id
        const relaciones = event_requirements.filter(
            (rel) => rel.fk_event === event.evt_id
        );

        // Verificar si hay relaciones de requerimientos
        if (relaciones.length === 0) {
            // Si no hay relaciones, devolver un mensaje y salir de la función
            requirementsInDescription.innerHTML =
                "<p class='nullInfoInDescription'>No hay requeriemientos definidos</p>";

            // Salir de la función
            return;
        }

        // Por cada relación, buscar el nombre del requerimiento
        const nombresRequerimientos = relaciones.map((rel) => {
            const req = requirements.find(
                (requerimiento) => requerimiento.req_id === rel.FK_req
            );
            // Verificar si el requerimiento existe y devolver su nombre
            return req ? req.req_name : null;
        });

        // Para cada requerimiento en la lista de requerimientos crear una tarjeta con el nombre de cada requerimiento
        nombresRequerimientos.forEach((nombreRequerimiento) => {
            // Crear un p que contenga cada requerimiento
            const requerimientCard = document.createElement("p");
            // Agregar una clase al p anterior
            requerimientCard.classList.add("requerimentItem");
            // Agregar el nombre del requerimiento al p anterior
            requerimientCard.innerHTML = `
                <i class="ti ti-progress-check"></i> ${nombreRequerimiento}
            `;
            // Agregar el p anterior al contenedor de requerimientos
            requirementsInDescription.appendChild(requerimientCard);
        });

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Listar elementos a traer --
    ====================================================== */

    // Función para obtener los "Que traer" del evento
    function mostrarListaElementosATraer(event, carrys) {
        // Obtener el contenedor de la lista de "Que traer" en en el contenedor de descripción
        const carryInDescription = document.getElementById("carryList");

        // Verificar si hay un contenedor de "Que traer"
        if (!carryInDescription) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar los 'Que traer' del evento"
            );

            // Salir de la función
            return;
        }

        // Filtrar las relaciones donde fk_event coincide con el evt_id
        const relaciones = carrys.filter((rel) => rel.fk_event === event.evt_id);

        // Verificar si hay relaciones de "Que traer"
        if (relaciones.length === 0) {
            // Si no hay relaciones, devolver un mensaje y salir de la función
            carryInDescription.innerHTML =
                "<p class='nullInfoInDescription'>No hay 'Que traer' definidos</p>";

            // Salir de la función
            return;
        }

        // Crear una lista de "Que traer"
        const carryList = [];
        // Agregar los "Que traer" a la lista con sus nombres
        relaciones.forEach((rel) => {
            // Agregar la "Que traer" a la lista
            carryList.push({
                // Obtener el nombre del "Que traer" a partir de su ID
                carry_name: rel.carry_name,
            });
        });

        // Para cada "Que traer" en la lista de "Que traer" crear una tarjeta con el nombre de cada "Que traer"
        carryList.forEach((nombreCarry) => {
            // Crear un p que contenga cada "Que traer"
            const carryCard = document.createElement("p");
            // Agregar una clase al p anterior
            carryCard.classList.add("carryItem");
            // Agregar el nombre del "Que traer" al p anterior
            carryCard.innerHTML = `
                <i class="ti ti-progress-check"></i> ${nombreCarry.carry_name}
            `;
            // Agregar el p anterior al contenedor de "Que traer"
            carryInDescription.appendChild(carryCard);
        });

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Listar accesibilidades del evento --
    ====================================================== */

    // Función para obtener las accesibilidades del evento
    function mostrarListaAccesibilidadesEvento(event, accessibilities) {
        // Obtener contenedor de accesibilidad en en el contenedor de descripción
        const accessibilitiesInDescription =
            document.getElementById("accessibilityList");

        // Verificar si hay accesibilidades
        if (!accessibilitiesInDescription) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar las accesibilidades del evento"
            );

            // Salir de la función
            return;
        }

        // Obtener las accesibilidades del evento
        const accesibilidadesEvento = accessibilities.filter(
            (accesibility) => accesibility.fk_event === event.evt_id
        );

        // Verificar si hay accesibilidades
        if (accesibilidadesEvento.length === 0) {
            // Si no hay accesibilidades, devolver un mensaje y salir de la función
            accessibilitiesInDescription.innerHTML = `<p class='nullInfoInDescription'>No hay accesibilidades definidas</p>`;

            // Salir de la función
            return;
        }

        // Crear una lista de accesibilidades
        const accesibilidades = [];
        // Agregar los accesibilidades a la lista con sus nombres
        accesibilidadesEvento.forEach((accesibility) => {
            // Agregar la accesibilidad a la lista
            accesibilidades.push({
                // Obtener el nombre del accesibilidad a partir de su ID
                accesibility_name: accesibility.acc_name,
            });
        });

        // Para cada accesibilidad en la lista de accesibilidades crear un p con el nombre de cada accesibilidad
        accesibilidades.forEach((accesibility) => {
            // Crear un p que contenga la información de cada accesibilidad
            const accesibilityCard = document.createElement("p");
            // Agregar una clase al p anterior
            accesibilityCard.classList.add("accessibilityItem");
            // Agregar la información de la accesibilidad al p anterior
            accesibilityCard.innerHTML = `
                <p>${accesibility.accesibility_name}</p>
            `;
            // Agregar el p anterior al contenedor de accesibilidad
            accessibilitiesInDescription.appendChild(accesibilityCard);
        });

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Renderizar participantes del evento --
    ====================================================== */

    // Función para obtener los participantes del evento
    function renderizarParticipantesEvento(
        event,
        participants,
        users,
        userGlobalImage,
        creatorUser
    ) {
        // Obtener contenedor izquierdo de la lista de participantes en en el contenedor de "leftContent"
        const participantsInLeftContent =
            document.getElementById("participantList");

        // Obtener el contenedor de la cantidad de participantes en en el contenedor de "leftContent"
        const participantsLengthPlace = document.getElementById(
            "participantsLengthPlace"
        );

        if (!participantsInLeftContent || !participantsLengthPlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error("No hay un contenedor para mostrar " + (!participantsInLeftContent ? "el contenedor de participantes" : "el contenedor de la cantidad de participantes") + " del evento");

            // Salir de la función
            return;
        }

        // Obtener las participaciones del evento
        const participantsEventUnited = obtenerParticipantesEvento(event, participants);

        // Verificar si hay participantes
        if (participantsEventUnited.length === 0) {
            console.error("No hay participantes para este evento");
            // Si no hay participantes, devolver un mensaje
            return participantsInLeftContent.innerHTML = "¡No hay participantes aun!";
        }

        // Crear una lista de participantes con los datos necesarios
        const participantes = participantsEventUnited.map((participacion) => { // Por cada participación
            const user = users.find(user => user.user_id === participacion.fk_user); // Obtener el usuario
            return { // Devolver los datos necesarios del usuario
                user_id: user?.user_id ?? null,
                user_name: user?.user_name ?? "Desconocido",
                user_lastname: user?.user_lastname ?? "",
                prt_date: participacion.prt_date,
            };
        });

        // Insertar la cantidad de participantes en el contenedor
        participantsLengthPlace.innerHTML = `(${participantes.length})`;
        // Limpiar el contenedor de participantes para evitar duplicados
        participantsInLeftContent.innerHTML = ``;
        // Para cada participante en la lista de participantes crear una tarjeta con la información de cada participante
        participantes.forEach((participante) => {
            // Crear un div que contenga la información de cada participante
            const participantCard = document.createElement("div");
            // Agregar una clase CSS al div anterior
            participantCard.classList.add("participantCard");
            participantCard.innerHTML = `
                <div class="cardContent">
                    <div class="cardPrincipalInfo">
                        <img class="cardImage" src="${userGlobalImage}" alt="Imagen de perfil de ${
                participante.user_name
            } ${participante.user_lastname}">
                        <div class="cardText">
                            <p class="completeNameUser">${
                                participante.user_name
                            } ${
                participante.user_lastname
            } <i class="ti ti-progress-check"></i> ${
                participante.user_id === creatorUser.user_id
                    ? "<i class='ti ti-crown' style='color: gold;'></i>"
                    : ""
            }
                            </p>
                            <p class="dateParticipation">Se unió el ${new Date(
                                participante.prt_date
                            ).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}</p>
                        </div>
                    </div>
                    <p class="cardUserType ${
                        participante.user_id === creatorUser.user_id
                            ? 'organizer"> Organizador'
                            : 'participant"> Participante'
                    }
                    </p>
                </div>
            `;

            // Agregar el div anterior al contenedor de participantes
            participantsInLeftContent.appendChild(participantCard);
        });
    }

   /* ======================================================
    -- FUNCIÓN: Formatear textos largos (con saltos de linea) --
    ====================================================== */

    // Función para formatear un texto largo con saltos de línea
    // texto: texto a formatear
    // maxSaltos: número máximo de saltos de línea
    function formatearTexto(texto, maxSaltos = 6) {
        let resultado = texto.trimStart(); // Eliminar espacios al inicio
        resultado = resultado.trimEnd(); // Eliminar espacios al final
        const regexMultiplesSaltos = new RegExp(`\\n{${maxSaltos + 1},}`, 'g'); // Regex para buscar más de maxSaltos saltos de línea
        resultado = resultado.replace(regexMultiplesSaltos, '\n'.repeat(maxSaltos)); // Reemplazar más de maxSaltos saltos de línea por maxSaltos saltos de línea
        resultado = resultado.trim(); // Eliminar espacios al inicio y al final
        // Convertir \n a <br> para HTML
        return resultado.replace(/\n/g, '<br>');
    }

    /* ======================================================
    -- FUNCIÓN: Gestionar tiempo en segundos, minutos, horas, semanas, meses y años --
    ====================================================== */

    // Función interna para obtener el tiempo transcurrido desde la fecha de la respuesta
    function getTimeAgo(date) {
        // Obtener la fecha actual
        const now = new Date();
        // Convertir la fecha a un objeto Date
        date = new Date(date);

        // Validar que la fecha sea válida
        if (isNaN(date.getTime())) {
            // Devolver un mensaje de error
            return 'fecha inválida';
        }

        // Verificar si la fecha está en el futuro
        if (date > now) {
            // Devolver un mensaje de error
            return 'fecha en el futuro';
        }

        // Calcular la diferencia en segundos
        const diffInSeconds = Math.floor((now - date) / 1000);

        // Verificar si la diferencia es menor a 60 segundos
        if (diffInSeconds < 60) {
            return 'hace un momento';
        }

        // Calcular la diferencia en minutos
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        // Devolver el mensaje correspondiente para minutos
        if (diffInMinutes < 60) {
            return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
        }

        // Calcular la diferencia en horas
        const diffInHours = Math.floor(diffInMinutes / 60);
        // Devolver el mensaje correspondiente para horas
        if (diffInHours < 24) {
            return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
        }

        // Calcular la diferencia en días
        const diffInDays = Math.floor(diffInHours / 24);
        // Devolver el mensaje correspondiente para días
        if (diffInDays < 30) {
            return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
        }

        // Calcular la diferenca en semanas
        const diffInWeeks = Math.floor(diffInDays / 7);
        // Devolver el mensaje correspondiente para semanas
        if (diffInWeeks < 4) {
            return `hace ${diffInWeeks} ${diffInWeeks === 1? 'semana' : 'semanas'}`;
        }

        // Calcular la diferencia en meses
        const diffInMonths = Math.floor(diffInDays / 30);
        // Devolver el mensaje correspondiente para meses
        if (diffInMonths < 12) {
            return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
        }

        // Calcular la diferencia en años
        const diffInYears = Math.floor(diffInMonths / 12);
        // Devolver el mensaje correspondiente para años
        return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
    }

    /* ======================================================
    -- FUNCIÓN: Gestionar y mostrar preguntas --
    ====================================================== */

    // Función para obtener las preguntas del evento/actividad
    function mostrarGestionPreguntas(event, questions, users, answers, creatorUser) {
        // Obtener contenedor izquierdo de la lista de preguntas en en el contenedor de "leftContent"
        const questionsInLeftContent = document.getElementById("questionsList");

        // Obtener el contenedor de la cantidad de preguntas en en el contenedor de "leftContent"
        const questionsLengthPlace = document.getElementById(
            "questionsLengthPlace"
        );

        // Verificar la existencia de los contenedores de preguntas y cantidad de preguntas
        if (!questionsInLeftContent || !questionsLengthPlace) {
            console.error(
                "No hay un contenedor para mostrar las preguntas/cantidad de preguntas del evento"
            );

        } else { // Si el contenedor de preguntas y cantidad de preguntas existen

            // Crear lista de preguntas
            const preguntasEventoLista = [];

            // Obtener las preguntas del evento a partir del JSON
            const questionsDataJSON = questions.filter(
                (question) => question.event_id === event.evt_id
            );

            // Obtener las preguntas del localStorage
            const preguntasEventoFiltradas = preguntasEvento.filter(
                (pregunta) => pregunta.event_id === event.evt_id
            );

            // Agrupar en una sola lista las preguntas del evento tanto del localStorage como de la API (data.json)
            questionsDataJSON.forEach((question) => {
                preguntasEventoLista.push({
                    question_id: question.question_id,
                    user_id: question.user_id,
                    question: question.question,
                    question_date: question.question_date,
                    event_id: question.event_id
                });
            });

            preguntasEventoFiltradas.forEach((pregunta) => {
                preguntasEventoLista.push({
                    question_id: pregunta.question_id,
                    user_id: pregunta.user_id,
                    question: pregunta.question,
                    question_date: pregunta.question_date,
                    event_id: pregunta.event_id
                });
            })

            // Verificar si hay preguntas
            if (preguntasEventoLista.length === 0) {
                // Si no hay preguntas, devolver un mensaje
                questionsInLeftContent.innerHTML =
                    "<p class='nullInfoInDescription'>No hay preguntas aun. ¡Ten fé!</p>";

            } else { // Si hay preguntas

                // Insertar la cantidad de preguntas en el contenedor
                questionsLengthPlace.innerHTML = `(${preguntasEventoLista.length})`;
                
                // Ordenar las preguntas por fecha de más reciente a más antigua
                preguntasEventoLista.sort((a, b) => {
                    return new Date(b.question_date) - new Date(a.question_date);
                }); 

                // Limpiar el contenedor de preguntas
                questionsInLeftContent.innerHTML = "";

                // Para cada pregunta en la lista de preguntas crear una tarjeta con la información de cada pregunta
                preguntasEventoLista.forEach((pregunta) => {
                    // Crear un div que contenga la información de cada pregunta
                    const questionCard = document.createElement("div");
                    // Agregar una clase CSS al div anterior
                    questionCard.classList.add("questionCard");
                    // Obtener los datos del usuario (Foto, nombre, apellido) que hizo la pregunta
                    const user = users.filter(
                        (user) => user.user_id === pregunta.user_id
                    )[0];
                    // Agregar la información de la pregunta al div anterior
                    questionCard.innerHTML = `
                        <div class="cardQuestionContent">
                            <div class="cardQuestionPrincipalInfo">
                                <img class="cardQuestionImage" src="${userGlobalImage}" alt="Imagen de perfil de ${
                        user.user_name
                    } ${user.user_lastname}">
                                <div class="cardQuestionText">
                                    <div class="cardNameAndDate">
                                        <span class="completeNameUser">${
                                            user.user_name
                                        } ${user.user_lastname}</span>
                                        <span class="dateQuestion">${getTimeAgo(new Date(pregunta.question_date))}</span>
                                    </div>
                                    <p class="questionText">${formatearTexto(pregunta.question)}</p>
                                    </div>
                                    </div>
                                    <div class="answersContainer">
                                    </div>
                                    <div class="questionButtonsContainer">
                                    </div>
                                    </div>
                                    `;

                    // Agregar el div anterior al contenedor de preguntas
                    questionsInLeftContent.appendChild(questionCard);
                    // Obtener el contenedor de botones DENTRO de esta tarjeta recién creada
                    const botonesContenedor = questionCard.querySelector(".questionButtonsContainer");
                    // Obtener el contenedor de respuestas
                    const answersContainer = questionCard.querySelector(".answersContainer");

                    // Renderizar/Mostrar las respuestas
                    mostrarRespuestas(event, users, answers, pregunta, answersContainer , creatorUser);

                    // Renderizar botones solo para esta pregunta
                    renderizarBotonesPreguntas(botonesContenedor);
                });
            }
        }

        // Obtener el botón de guardar pregunta
        const sendQuestionButton = document.getElementById("sendQuestionButton");

        // Verificar si el botón de guardar pregunta existe
        if (!sendQuestionButton) {
            // Si no existe, devuelve un mensaje de error
            console.error(
                "No hay un botón para guardar la pregunta del evento"
            );
        } else { // Si el botón de guardar pregunta existe

            // Agregar un evento al botón de guardar pregunta
            sendQuestionButton.onclick = function () {
                guardarNuevaPregunta(event, questions, users, answers, creatorUser);
            };

        }

        // Salir de la función
            return;

    }

    /* ======================================================
    -- FUNCIÓN: Renderizar botones de pregunta (Útil, Reportar y Responder) --
    ====================================================== */

    // Función para renderizar por cada pregunta los botones de útil, reportar y responder (en caso de ser el usuario creador)
    function renderizarBotonesPreguntas(botonesContenedor) {
        // Obtener el contenedor de los botones de pregunta
        const questionButtonsContainer = botonesContenedor;

        // Verificar si el contenedor de los botones de pregunta existe
        if (!questionButtonsContainer) {
            // Si no existe, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar los botones de pregunta"
            );
        } else { // Si el contenedor de los botones de pregunta existe

            // Crear lista de objetos con los botones de pregunta (Útil y Responder)
            const questionButtons = [
                {
                    buttonName: "Útil",
                    buttonClass: "usefulQuestionButton",
                    buttonIcon: "ti ti-thumb-up",
                },
                {
                    buttonName: "Responder",
                    buttonClass: "answerQuestionButton",
                    buttonIcon: "ti ti-bubble-plus",
                }
            ]

            // Limpiar el contenedor de los botones de pregunta
            questionButtonsContainer.innerHTML = "";

            // Crear un contenedor para dividir la ubicación de los botones
            const buttonContainer = document.createElement("div");
            // Agregar una clase CSS al contenedor anterior
            buttonContainer.classList.add("buttonsContainer");

            // Agregar el contenedor anterior al contenedor de los botones de pregunta general
            questionButtonsContainer.appendChild(buttonContainer) // Contenedor para los botones (Útil y Responder)

            // Para cada botón en la lista de botones de pregunta crear un botón con la información de cada botón
            questionButtons.forEach((button) => {
                // Crear un botón que contenga la información de cada botón
                const buttonCard = document.createElement("button");
                // Agregar una clase CSS al botón anterior
                buttonCard.classList.add(button.buttonClass);
                // Agregar el icono al botón anterior
                buttonCard.innerHTML = `
                    <i class="${button.buttonIcon}"></i> ${button.buttonName}
                `;

                // Agregar el botón anterior al contenedor de los botones de pregunta
                buttonContainer.appendChild(buttonCard);
            })

            // Crear un botón de reportar
            const reportQuestionButton = `
                <button class="reportQuestionButton">
                    <i class="ti ti-flag"></i> Reportar
                </button>
            `;

            // Agregar el botón de reportar al contenedor general de botones de pregunta
            questionButtonsContainer.innerHTML += reportQuestionButton;
        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Renderizar las respuestas de cada pregunta --
    ====================================================== */

    // Función para renderizar por cada pregunta sus respuestas
    function mostrarRespuestas(event, users, answers, pregunta, answersContainer , creatorUser) {
        // Verificar el contenedor de las respuestas
        if (!answersContainer) {
            console.error("El contenedor de las respuestas es inexistente")
        } else { // Si el contenedor de respuesta existe
            // Crear lista de respuestas
            const answersList = [];

            // Obtener las respuestas de la pregunta a partir del JSON
            const answersJSON = answers.filter(
                (answer) => answer.FK_qst === pregunta.question_id
            );

            // Obtener las respuestas del localStorage
            const answerLocalStorage = localStorage.getItem("listAnswersToQuestions")
                ? JSON.parse(localStorage.getItem("listAnswersToQuestions")).filter(
                    (respuesta) => respuesta.FK_qst === pregunta.question_id
                )
                : [];


            // Agrupar en una sola lista las respuestas de la pregunta tanto del localStorage como de la API (data.json)
            answersJSON.forEach((respuesta) => {
                answersList.push({
                    ans_id: respuesta.ans_id,
                    user_id: respuesta.user_id,
                    ans_message: respuesta.ans_message,
                    FK_qst: respuesta.FK_qst,
                    ans_date: respuesta.ans_date
                });
            });

            answerLocalStorage.forEach((respuesta) => {
                answersList.push({
                    ans_id: respuesta.ans_id,
                    user_id: respuesta.user_id,
                    ans_message: respuesta.ans_message,
                    FK_qst: respuesta.FK_qst,
                    ans_date: respuesta.ans_date
                });
            })

            // Verificar si hay respuestas para la pregunta
            if (!answersList) {
                // Mostrar un mensaje de error en la consola
                console.error(`No hay respuestas a la pregunta con id '${pregunta.question_id}'`)

            } else { // Si hay respuestas a la pregunta
                // Ordenar las respuestas por fecha de más reciente a más antigua
                answersList.sort((a, b) => {
                    return new Date(b.ans_date) - new Date(a.ans_date);
                }); 

                // Para cada respuesta en la lista de respuestas crear una tarjeta con la información de cada respuesta
                answersList.forEach((answer) => {

                    // Obtener información del usuario creador de la respuesta
                    const userAnswerCreator = users.filter(
                        (user) => user.user_id === answer.user_id
                    )[0];

                    // Verificar si el usuario creador de la respuesta existe
                    if (!userAnswerCreator) {
                        // Mostrar un mensaje de error en la consola
                        console.error("El Usuario creador de la respuesta no existe")
                    } else { // Si el usuario creador de la respuesta existe
                        // Crear un nuevo elemento HTML
                        const answerCard = document.createElement('Div');
                        // Agregar una clase al div anterior
                        answerCard.classList.add("answerCard");
                        // Agregar el contenido HTML al div anterior
                        answerCard.innerHTML = `
                            <div class="answerCardContent">
                                <div class="answerCardHeader">
                                    <div class="answerCardUserInfo">
                                    <span class="answerCardUser">${userAnswerCreator.user_name} ${userAnswerCreator.user_lastname}</span>
                                    <i class="ti ti-${creatorUser.user_id === userAnswerCreator.user_id ? 'crown' : 'user-check'}"></i>
                                    ${creatorUser.user_id === userAnswerCreator.user_id ? '<span class="answerUserType">Organizador</span>' : ''}
                                    </div>
                                    <span class="answerCardDate">${getTimeAgo(new Date(answer.ans_date))}</span>
                                </div>
                                <p class="answerCardText">${formatearTexto(answer.ans_message)}</p>
                            </div>
                        `;
                        // Agregar tarjeta de respuesta al contenedor de respuestas
                        answersContainer.appendChild(answerCard);
                    }
                })
            }

        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostar fecha y hora del evento --
    ====================================================== */

    // Funcion para saber y mostrar la fecha y hora del evento
    function mostrarFechaHoraEvento(event) {
        // Obtener el contenedor de la fecha y hora del evento
        const eventDatetime = document.querySelector(".dateTime");

        // Verificar si hay un contenedor para mostrar la fecha y hora del evento
        if (!eventDatetime) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la fecha y hora del evento"
            );
        } else { // Si hay un contenedor para la fecha y hora del evento
            // Obtener el contenedor de la fecha y hora
            const placeTime = document.getElementById("placeTime");
            const placeDate = document.getElementById("placeDate");

            // Verificar los contenedores de fecha y hora
            if (!placeTime || !placeDate) {
                // Su no hay contenedores, mostrar mensaje de error
                console.error(
                        "Error: No hay un contenedor para la " +
                        (!placeTime ? "hora" : "") +
                        (!placeDate ? "fecha" : "") +
                        " del evento a mostrar"
                );
            } else { // Si hay contenedores para fecha y hora
                // Obtener la fecha y hora por separado
                const eventTime = new Date (event.evt_eventDate).toLocaleTimeString("es-CO", {hour: '2-digit', minute: '2-digit', hour12: true});
                const eventDate = new Date(event.evt_eventDate).toLocaleDateString('es-CO', {
                    weekday: 'short',
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric'
                });

                // Verificar si hay Fecha y hora para el evento
                if (!eventTime || !eventDate) {
                    // Si no hay una fecha y hora, devuelve un mensaje de error
                    console.error(
                        "Error: No hay una " +
                        (!eventTime ? "hora" : "") +
                        (!eventDate ? "fecha" : "") +
                        " del evento a mostrar"
                    );
                } else { // Si hay datos de fecha y hora
                    // Renderizar en el HTML los datos de fecha y hora
                    placeDate.innerHTML = eventDate;
                    placeTime.innerHTML = eventTime;
                }
            }
        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar ubicación del evento --
    ====================================================== */

    // Funcion para saber la ubicación del evento
    function mostrarUbicacionEvento(event, locations) {
        // Obtener el contenedor de la ubicación del evento
        const locationPlace = document.getElementById("locationPlace");

        // Verificar si hay un contenedor para mostrar la ubicación del evento
        if (!locationPlace) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la ubicación del evento"
            );

            // Salir de la función
            return;
        }

        // Obtener la ubicación del evento a partir de su ID
        const location = locations.find((loc) => loc.loc_id === event.fk_loc);

        // Verificar si la ubicación existe
        if (!location) {
            // Si no existe, devuelve un mensaje
            locationPlace.innerHTML = `
                Ubicación desconocida
            `;

            // Salir de la función
            return;
        }

        // Mostrar la ubicación del evento en el contenedor
        locationPlace.innerHTML = `
            ${location.loc_name}
        `;

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostar duración del evento --
    ====================================================== */

    // Funcion para saber y mostrar la duración del evento
    function mostrarDuracionEvento(event) {
        // Obtener el contenedor de la duración del evento
        const durationDificultyContainer = document.querySelector(".durationDetails");

        // Verificar si hay un contenedor para mostrar la duración del evento
        if (!durationDificultyContainer) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la duración del evento"
            );
        } else { // Si hay un contenedor para la duración del evento
            // Obtener el contenedor de la duración
            const placeDuration = document.getElementById("placeDuration");

            // Verificar el contenedor de duración
            if (!placeDuration) {
                // Si no hay contenedor, mostrar mensaje de error
                console.error(
                        "Error: No hay un contenedor para la duración del evento a mostrar"
                );
            } else { // Si hay contenedor para duración
                // Obtener la duración por separado
                const eventDuration = event.evt_duraction;

                // Verificar si hay duración para el evento
                if (!eventDuration) {
                    // Si no hay una duración, devuelve un mensaje de error
                    console.error(
                        "Error: No hay una duración del evento a mostrar"
                    );
                } else { // Si hay datos de duración
                    // Renderizar en el HTML los datos de duración
                    placeDuration.innerHTML = `${eventDuration} hora(s)`;
                }
            }
        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostar precio del evento --
    ====================================================== */

    // Funcion para mostrar el precio del evento
    function mostrarPrecioEvento(event) {
        // Obtener el contenedor de el precio del evento
        const priceContainer = document.getElementById("placePrice");

        // Verificar si hay un contenedor para mostrar el precio del evento
        if (!priceContainer) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar el precio del evento"
            );
        } else { // Si hay un contenedor para el precio del evento
                // Obtener el precio
                const eventPrice = event.evt_price ? `$${event.evt_price}` : "Gratis";

                // Verificar si hay precio para el evento
                if (!eventPrice) {
                    // Si no hay un precio, devuelve un mensaje de error
                    console.error(
                        "Error: No hay un precio del evento a mostrar"
                    );
                } else { // Si hay datos de precio
                    // Renderizar en el HTML los datos de precio
                    placePrice.innerHTML = `${eventPrice}`;
                }
        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar cantidad de participantes del evento --
    ====================================================== */

    // Funcion para mostrar cantidad de participantes del evento
    function mostrarCantidadParticipantesEvento(event, participants) {
        // Obtener el contenedor de la cantidad de participantes del evento en general
        const participantsCountContainer = document.querySelector(".contentAvailability");

        // Verificar si hay un contenedor para mostrar la cantidad de participantes del evento
        if (!participantsCountContainer) {
            // Si no hay un contenedor, devuelve un mensaje de error
            console.error(
                "No hay un contenedor para mostrar la cantidad de participantes del evento"
            );
        } else { // Si hay un contenedor para la cantidad de participantes del evento
            // Obtener el contenedor de la cantidad de participantes del evento especifico
            const disponibilitytContainer = document.querySelector(".disponibilityCounter");
            // Obtener el contenedor de la barra de progreso del contador del evento
            const progresstContainer = document.getElementById("placeProgress");
            // Obtener el contenedor de la cantidad sobre los cupos iniciales del evento
            const countContainer = document.querySelector(".inscriptionCounter");

            // Verificar si hay un contenedor de los anteriores que no se encuentra
            if (!disponibilitytContainer || !progresstContainer || !countContainer) {
                // Si no hay un contenedor, devuelve un mensaje de error
                console.error(
                    "No hay un contenedor para mostrar " +
                    (!disponibilitytContainer ? "la disponibilidad" : "") + 
                    (!progresstContainer ? "la barra de progreso" : "") +
                    (!countContainer ? "el contador de participantes" : "") +
                    " del evento"
                );
            } else {
                // Obtener la cantidad de participaciones del evento
                const eventCountParticipants = contarParticipantes(event, participants);
                // Obtener la cantidad de cupos disponibles del evento
                const eventDisponibility = event.evt_capacity - eventCountParticipants;

                // Renderizar la cantidad de cupos disponibles del evento
                disponibilitytContainer.innerHTML = `${eventDisponibility} cupos`;
                // Renderizar en el HTML los datos de cantidad de participantes
                countContainer.innerHTML = `${eventCountParticipants} inscritos de ${event.evt_capacity} cupos iniciales`;
                // Añadir un valor como atributo a la barra de progreso
                progresstContainer.value = parseInt(contarParticipantes(event, participants));
                // Añadir un atributo de maximo de valores a la barra de progreso
                progresstContainer.setAttribute('max', parseInt(event.evt_capacity));
            }
        }

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Inscribir usuario al evento --
    ====================================================== */

    // Función para inscribirse al evento
    function inscribirUsuarioAEvento(
        userData,
        event,
        subscribeButtonPlace,
        participants,
        users,
        userGlobalImage,
        creatorUser
    ) {

        // Introducir la nueva participación en la lista de participaciones del localStorage
        participacionesEventos.push({
            fk_user: userData.user_id, // Obtener el ID del usuario logueado
            fk_event: event.evt_id, // Obtener el ID del evento al que se está inscribiendo
            prt_date: new Date().toISOString().split('T')[0] // Obtener la fecha actual en formato YYYY-MM-DD
        });

        // Guardar en localStorage la lista de participaciones
        localStorage.setItem(
            "eventParticipants",
            JSON.stringify(participacionesEventos)
        );

        // Crear Mensaje de respuesta
        const response = {
            state: "success",
            message: "Inscrito",
        };

        // Llamar la función externa de mostrar mensaje
        showModal(response);

        // Llamar función que renderiza el botón con el estado correspondiente
        actualizarEstadoBotonInscripcion(event, userData, subscribeButtonPlace, participants, users, userGlobalImage, creatorUser);

        // Llamar a la funcion de "renderizarParticipantesEvento" para actualizar los datos de participantes
        renderizarParticipantesEvento(event,
            participants,
            users,
            userGlobalImage,
            creatorUser
        );

        // Llamar a la funcion de "mostrarCantidadParticipantesEvento" para actualizar los datos de participaciones
        mostrarCantidadParticipantesEvento(event, participants)

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Eliminar inscripción del usuario --
    ====================================================== */

    function eliminarInscripcionUsuario(userData, event, subscribeButtonPlace, participants, users, userGlobalImage, creatorUser) {
        // Filtra el array, manteniendo solo las participaciones que NO coinciden con la que queremos eliminar.
        const participacionesActualizadas = participacionesEventos.filter(
            (participation) =>
                // Condición: Retorna 'true' si el item NO es el que queremos eliminar
                !(
                    participation.fk_user === userData.user_id &&
                    participation.fk_event === event.evt_id
                )
        );

        // Verifica si se eliminó algo para el mensaje de éxito o error
        if (participacionesActualizadas.length >= participacionesEventos.length) {
            console.error("La Inscripción especificada no se encontró.");
        } else {
            // Actualiza el array original con las participaciones actualizadas
            participacionesEventos = participacionesActualizadas;

            // Guardar en localStorage la lista de participaciones
            localStorage.setItem(
                "eventParticipants",
                JSON.stringify(participacionesEventos)
            );

            // Crear Mensaje de respuesta
            const response = {
                state: "info",
                message: "Eliminado",
            };

            // Llamar la función externa de mostrar mensaje
            showModal(response);
        }

        // Llamar función que renderiza el botón con el estado correspondiente
        actualizarEstadoBotonInscripcion(event, userData, subscribeButtonPlace, participants, users, userGlobalImage, creatorUser);

        // Llamar a la funcion de "renderizarParticipantesEvento" para actualizar los datos de participantes
        renderizarParticipantesEvento(
            event,
            participants,
            users,
            userGlobalImage,
            creatorUser
        )

        // Llamar a la funcion de "mostrarCantidadParticipantesEvento" para actualizar los datos de participaciones
        mostrarCantidadParticipantesEvento(event, participants)

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Guardar nueva pregunta --
    ====================================================== */

    // Función para guardar pregunta en evento
    function guardarNuevaPregunta(event, questions, users, answers, creatorUser) {
        // Obtener el contenedor del input de la pregunta
        const questionInput = document.getElementById("questionInput");
        // Obtener el valor del input de la pregunta
        const questionInputData = questionInput.value;
        // Obtener el contenedor de la respuesta del intento de la inserción
        const questionResponsePlace = document.getElementById(
            "questionResponsePlace"
        );

        // Verificar si hay contenido en el input de la pregunta
        if (!questionInputData) {
            // Si no hay contenido, mostrar un mensaje de error
            // Mostrar el mensaje de error
            questionResponsePlace.innerHTML = `¡Debes ingresar el contenido de tu pregunta!`;
            // Salir de la función
            return;
        } else if (questionInputData.length < 20) {
            // Verificar si la pregunta tiene al menos 20 caracteres
            // Si no, mostrar un mensaje de error
            questionResponsePlace.innerHTML = `¡La pregunta debe tener al menos 20 caracteres!`;
            // Salir de la función
            return;
        }

        // Introducir la nueva pregunta en la lista de preguntas del localStorage
        preguntasEvento.push({
            user_id: userData.user_id, // Directamente en el objeto
            event_id: event.evt_id, // Directamente en el objeto
            question: questionInputData, // Directamente en el objeto
            question_date: new Date().toISOString(), // Fecha actual en formato ISO
        });

        // Guardar en localStorage la lista de preguntas del evento
        localStorage.setItem("eventQuestions", JSON.stringify(preguntasEvento));

        // Mostrar un mensaje de éxito
        alert("Pregunta realizada con éxito.");

        // Limpiar el input
        questionInput.value = "";
        // Limpiar el contenedor de la respuesta del intento de la inserción
        questionResponsePlace.innerHTML = "";

        // Llamar función que renderiza la lista de preguntas
        mostrarGestionPreguntas(event, questions, users, answers, creatorUser);

        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Obtener cantidad de eventos del organizador --
    ====================================================== */

    // Función para obtener la cantidad de eventos del organizador del evento
    function obtenerEventosOrganizador(event, events, users) {
        const creatorUser = obtenerInfoCreadorEvento(event, users); // Obtener la información del usuario creador/organizador del evento
        const eventCount = events.filter((event) => event.FK_creator === creatorUser.user_id).length; // Filtrar los eventos del creador y calcular la cantidad de estos
        return eventCount; // Devolver la cantidad de eventos del organizador del evento
    }

    /* ======================================================
    -- FUNCIÓN: Mostrar información del organizador del evento --
    ====================================================== */

    // Función para mostrar la información del organizador del evento
    function mostrarOrganizadorEvento(event, events, users) {
        const organizerImageContainer = document.getElementById("organizerImgPlace"); // Obtener el contendeor de la imagen del organizador
        const organizerNamePlace = document.querySelector(".organizerNamePlace"); // Obtener el contendeor de el nombre del organizador
        const organizerEventsCountPlace = document.querySelector(".organizerEventsCount"); // Obtener el contendeor de la cantidad de eventos del organizador
        const creatorUser = obtenerInfoCreadorEvento(event, users); // Obtener la información del usuario creador/organizador del evento

        // Verificar si todos los contenedores existen
        if (!organizerImageContainer && !organizerNamePlace && !organizerEventsCountPlace) { // Si no existe ningun contenedor
            // Mostrar mensaje de error
            console.error("Contendores de información del organizador no encontrados");
        } else { // SI existe al menos uno de los contenedores
            const missingContainers = []; // Lista de contenedores no existentes
            if (!organizerImageContainer) missingContainers.push("imagen"); // Insertar en lista si el contendor no existe
            if (!organizerNamePlace) missingContainers.push("nombre"); // Insertar en lista si el contendor no existe
            if (!organizerEventsCountPlace) missingContainers.push("contador de eventos"); // Insertar en lista si el contendor no existe
            // Mostrar mensaje de error de el/los contenedor(es) faltante(s)
            console.error(`Contedor(es) no encontrado(s) ${missingContainers.join(", ")} del organizador`);

            if (organizerImageContainer) { // Si el contenedor de imagen existe
                organizerImageContainer.src = ""; // Limpiar contenedor
                organizerImageContainer.src = userGlobalImage; // Introducir la url de la imagen del organizador
            }

            if (organizerNamePlace) { // Si el contendor de el nombre existe
                organizerNamePlace.innerHTML = ""; // Limpiar contenedor
                // Insertar el nombre completo del organizador
                organizerNamePlace.innerHTML = `
                    ${creatorUser.user_name} ${creatorUser.user_lastname}
                    <i class="ti ti-crown"></i>
                `;
            }

            if (organizerEventsCountPlace) { // Si el contenedor de cantidad de eventos existe
                organizerEventsCountPlace.innerHTML = ""; // Limpiar contenedor
                const organizerEventsCount = obtenerEventosOrganizador(event, events, users); // Obtener cantidad de eventos del organizador con otra función
                // Insertar la cantidad de eventos del organizador
                organizerEventsCountPlace.innerHTML = `(${organizerEventsCount} ${(organizerEventsCount > 1 ? "eventos" : "evento")})`;
            }

        }
        // Salir de la función
        return;
    }

    /* ======================================================
    -- FUNCIÓN: Renderizar todo el contenido del evento --
    ====================================================== */

    // Función para renderizar el evento o actividad en el HTML
    function renderizarContenidoEvento(
        event,
        categories,
        category_event,
        locations,
        participants,
        users,
        answers,
        questions,
        accessibilities,
        requirements,
        event_requirements,
        subscribeButtonPlace,
        creatorUser,
        carrys,
        events
    ) {
        establecerImagenPrincipalEvento();
        actualizarEstadoBotonInscripcion( event, userData, subscribeButtonPlace, participants, users, userGlobalImage, creatorUser);
        mostrarCategoriasEvento(event, categories, category_event);
        mostrarTituloEvento(event);
        mostrarConteoParticipantes(event, participants);
        mostrarDescripcionEvento(event);
        mostrarListaRequerimientosEvento(event, requirements, event_requirements);
        mostrarListaElementosATraer(event, carrys);
        mostrarListaAccesibilidadesEvento(event, accessibilities);
        renderizarParticipantesEvento(
            event,
            participants,
            users,
            userGlobalImage,
            creatorUser
        );
        mostrarGestionPreguntas(event, questions, users, answers, creatorUser);
        mostrarFechaHoraEvento(event);
        mostrarUbicacionEvento(event, locations);
        mostrarDuracionEvento(event);
        mostrarPrecioEvento(event);
        mostrarCantidadParticipantesEvento(event, participants);
        mostrarOrganizadorEvento(event, events, users);
    }
});

/* -------------------------------------------------------------------------------------------- */

    /* ======================================================
    -- FUNCIÓN: Volver a actividades --
    ====================================================== */

// Función para volver a la página principal
function redireccionarActividades() {
    // Redirigir a la página principal de actividades
    window.location.href = "../templates/activities.html";
}

    /* ======================================================
    -- FUNCIÓN: Cambiar visibilidad de categoría --
    ====================================================== */

// Función para mostrar categoría mediante los botones y sus cambios de estado
function cambiarVisibilidadCategoria(category) {
    // Eliminar la clase selected de todos los botones de categoría
    document.querySelectorAll(".buttonCategory").forEach((btn) => {
        btn.classList.remove("selectedCategory");
    });

    // Añadir la clase selected al botón de la categoría seleccionada
    document
        .getElementById(`${category}Category`)
        .classList.add("selectedCategory");

    // Ocultar todas las categorías
    document.querySelectorAll(".categoryContent").forEach((content) => {
        content.classList.add("oculto");
    });

    // Mostrar la categoría seleccionada
    document.querySelectorAll(`.${category}Content`).forEach((content) => {
        content.classList.remove("oculto");
    });
}

    /* ======================================================
    -- FUNCIÓN: Subir al tope de la página --
    ====================================================== */
// Función para subir al tope de la página
function up_screen() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}