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
let participacionesEvento =
    JSON.parse(localStorage.getItem("eventParticipants")) || [];

/* ------------------- */

// Obtener la lista de preguntas de eventos desde el localStorage o crearla como un array vacío
let preguntasEvento = JSON.parse(localStorage.getItem("eventQuestions")) || [];

/* -------------------------------------------------------------------------------------------- */

// Evento que se ejecuta cuando todos los recursos esten completamente cargado
document.addEventListener("DOMContentLoaded", function () {
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

            /* ------------------ LLAMAR FUNCIÓN OBTENER USUARIO CREADOR DEL EVENTO ------------------- */

            // Llama a la función para obtener el usuario creador del evento
            const creatorUser = obtenerCreadorEvento(event, users);

            /* ------------------ LLAMAR FUNCIÓN "RENDER DE EVENTO(S)"" ------------------- */

            // Llama a la función para renderizar eventos
            renderEvento(
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
                carrys
            );
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
        .catch((error) => console.error("Error:", error));

    /* -------------------------------------------------------------------------------------------- */

    /* ------------------ FUNCIÓN OBTENER PRECIO DEL EVENTO ------------------- */

    // Función para obtener el precio del evento
    function obtenerBotonSuscribirEvento(
        event,
        userData,
        subscribeButtonPlace
    ) {
        // Verificar si hay un botón para mostrar el precio del evento
        if (!subscribeButtonPlace) {
            // Si no hay un botón, devuelve un mensaje de error
            console.error("No hay un botón para mostrar el precio del evento");
            // Salir de la función
            return;
        }

        // Verificar si el usuario ya está inscrito en el evento
        const participacionExistente = participacionesEvento.find(
            (participation) =>
                participation.user_id === userData.user_id &&
                participation.event_id === event.evt_id
        );

        // Verificar si el usuario está inscrito en el evento/actividad
        if (participacionExistente) {
            // Si el usuario ya esta inscrito en el evento/actividad se cambiará estados mediante clases y el onclick

            // Limpiar la clase del botón
            subscribeButtonPlace.className = "";
            // Agregar una clase al botón para que este cambie su apariencia
            subscribeButtonPlace.classList.add("deleteParticipationButton");

            // Cambiar el contenido del botón a eliminar participación/inscripción
            subscribeButtonPlace.innerHTML = `
                Eliminar Inscripción
            `;

            // Cambiar el onclick/llamado a la función de eliminar participación en el botón que ya está
            subscribeButtonPlace.onclick = function () {
                eliminarParticipacion(userData, event, subscribeButtonPlace);
            };

            // Salir de la función
            return;
        }

        // Obtener el precio del evento
        const precioEvento = event.evt_price;

        // Declarar una variable para mostrar el texto
        let priceText = "";

        // Verificar si el evento tiene un precio
        if (!precioEvento) {
            priceText = "Inscribirse - Gratis";
        } else {
            priceText = `Inscribirse - $${event.evt_price}`;
        }

        // Limpiar la clase del botón
        subscribeButtonPlace.className = "";
        // Agregar una clase al botón
        subscribeButtonPlace.classList.add("addParticipationButton");

        // Mostrar el precio del evento en el contenedor
        subscribeButtonPlace.innerHTML = priceText;

        // Añadir el onclick/llamado a la función de inscribirse en el botón
        subscribeButtonPlace.onclick = function () {
            inscribirParticipacion(
                userData,
                event,
                participacionesEvento,
                subscribeButtonPlace
            );
        };

        // Salir de la función
        return;
    }

    /* ------------------ FUNCIÓN OBTENER IMAGEN DEL EVENTO ------------------ */

    // Función para obtener el contenedor de la imagen del evento
    function obtenerImagenEvento() {
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

    /* ------------------ FUNCIÓN OBTENER CATEGORIAS DEL EVENTO ------------------- */

    // Función para obtener las categorías del evento
    function obtenerCategoriasDeEvento(event, categories, category_event) {
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

        // Filtrar las relaciones donde FK_evt coincide con el evt_id
        const relaciones = category_event.filter(
            (rel) => rel.FK_evt === event.evt_id
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

    /* ------------------ FUNCIÓN OBTENER TITULO DEL EVENTO ------------------- */

    // Función para obtener el título del evento
    function obtenerTituloEvento(event) {
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

    /* ------------------ FUNCIÓN CONTAR PARTICIPANTES DEL EVENTO ------------------ */

    // Función para contar participantes en un evento
    function contarParticipantes(event, participants) {
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
        const cantidadParticipantes = participants.filter(
            (p) => p.FK_evt === event.evt_id
        ).length;
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

    /* ------------------ FUNCIÓN OBTENER DESCRIPCIÓN DEL EVENTO ------------------- */

    // Función para obtener la descripción del evento
    function obtenerDescripcionEvento(event) {
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

    /* ------------------ FUNCIÓN OBTENER REQUERIMIENTOS DEL EVENTO ------------------ */

    // Función para obtener los requerimientos del evento
    function obtenerRequerimientosEvento(
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

        // Filtrar las relaciones donde FK_evt coincide con el evt_id
        const relaciones = event_requirements.filter(
            (rel) => rel.FK_evt === event.evt_id
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

    /* ------------------ FUNCIÓN OBTENER "QUE TRAER" DEL EVENTO ------------------ */

    // Función para obtener los "Que traer" del evento
    function obtenerQueTraerEvento(event, carrys) {
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

        // Filtrar las relaciones donde FK_evt coincide con el evt_id
        const relaciones = carrys.filter((rel) => rel.FK_evt === event.evt_id);

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

    /* ------------------ FUNCIÓN OBTENER ACCESIBILIDAD DEL EVENTO ------------------ */

    // Función para obtener las accesibilidades del evento
    function obtenerAccesibilidadEvento(event, accessibilities) {
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

    /* ------------------ FUNCIÓN OBTENER CREADOR DEL EVENTO ------------------- */

    // Función para obtener el usuario creador del evento
    function obtenerCreadorEvento(event, users) {
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

    /* ------------------ FUNCIÓN OBTENER UBICACIÓN DEL EVENTO ------------------ */

    // Funcion para saber la ubicación del evento
    function obtenerUbicacionEvento(event, locations) {
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

    /* ------------------ FUNCIÓN OBTENER PARTICIPANTES DEL EVENTO ------------------ */

    // Función para obtener los participantes del evento
    function obtenerParticipantesEvento(
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

        // Obtener las participaciones del evento
        const participacionesEvento = participants.filter(
            (participant) => participant.FK_evt === event.evt_id
        );

        // Verificar si hay participantes
        if (participacionesEvento.length === 0) {
            // Si no hay participantes, devolver un mensaje
            return "<p class='nullInfoInDescription'>No hay participantes aun. ¡Ten fé!</p>";
        }

        // Crear una lista de participantes
        const participantes = [];
        // Agregar los participantes a la lista con los siguientes datos: nombre, apellido y fecha de participación
        participacionesEvento.forEach((participacion) => {
            participantes.push({
                // Obtener el ID del usuario a partir de su ID
                user_id: users.find(
                    (user) => user.user_id === participacion.FK_user
                ).user_id,
                // Obtener el nombre del usuario a partir de su ID
                user_name: users.find(
                    (user) => user.user_id === participacion.FK_user
                ).user_name,
                // Obtener el apellido del usuario a partir de su ID
                user_lastname: users.find(
                    (user) => user.user_id === participacion.FK_user
                ).user_lastname,
                // Obtener la fecha de participación
                prt_date: participacion.prt_date,
            });
        });

        // Insertar la cantidad de participantes en el contenedor
        participantsLengthPlace.innerHTML = `(${participantes.length})`;

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

    /* ------------------ FUNCIÓN OBTENER PREGUNTAS EN EVENTO ------------------ */

    // Función para obtener las preguntas del evento/actividad
    function obtenerPreguntasEvento(event, questions, users) {
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

            // Salir de la función
            return;
        }

        // Obtener las preguntas del evento
        const questionsDataJSON = questions.filter(
            (question) => question.event_id === event.evt_id
        )

        // Agrupar en una sola lista las preguntas del evento tanto del localStorage como de la API (data.json)
        questionsDataJSON.forEach((question) => {
            preguntasEvento.push({
                user_id: question.user_id,
                question: question.question,
                question_date: question.question_date,
                event_id: question.event_id
            })
        })

        // Verificar si hay preguntas
        if (preguntasEvento.length === 0) {
            // Si no hay preguntas, devolver un mensaje
            questionsInLeftContent.innerHTML =
                "<p class='nullInfoInDescription'>No hay preguntas aun. ¡Ten fé!</p>";
            // Salir de la función
            return;
        }

        // Ordenar las preguntas por fecha de más reciente a más antigua
        preguntasEvento.sort((a, b) => {
            return new Date(b.question_date) - new Date(a.question_date);
        })

        // Insertar la cantidad de preguntas en el contenedor
        questionsLengthPlace.innerHTML = `(${preguntasEvento.length})`;

        // Para cada pregunta en la lista de preguntas crear una tarjeta con la información de cada pregunta
        preguntasEvento.forEach((pregunta) => {
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
                        <img class="cardQuestionImage" src="${userGlobalImage}" alt="Imagen de perfil de ${user.user_name} ${user.user_lastname}">
                        <div class="cardQuestionText">
                            <div class="cardNameAndDate">
                                <span class="completeNameUser">${
                                    user.user_name
                                } ${user.user_lastname}</span>
                                <span class="dateQuestion">${new Date(pregunta.question_date).toLocaleDateString('es-CO')}</span>
                            </div>
                            <p class="questionText">${pregunta.question}</p>
                        </div>
                    </div>
                </div>
            `;

            // Agregar el div anterior al contenedor de preguntas
            questionsInLeftContent.appendChild(questionCard);
        });

        // Salir de la función
        return;
    }

    /* ------------------ FUNCIÓN INSCRIBIRSE AL EVENTO ------------------ */

    // Función para inscribirse al evento
    function inscribirParticipacion(
        userData,
        event,
        participacionesEvento,
        subscribeButtonPlace
    ) {
        // Verificar si el usuario ya está inscrito en el evento
        const participacionExistente = participacionesEvento.find(
            (participation) =>
                participation.user_id === userData.user_id &&
                participation.event_id === event.evt_id
        );

        // Si el usuario ya está inscrito, mostrar un mensaje de error
        if (participacionExistente) {
            // Mostrar un mensaje de error
            alert("Ya estás inscrito en este evento");
            // Salir de la función
            return;
        }

        // Introducir la nueva participación en la lista de participaciones del localStorage
        participacionesEvento.push({
            user_id: userData.user_id, // Directamente en el objeto
            event_id: event.evt_id, // Directamente en el objeto
        });

        // Guardar en localStorage la lista de participaciones
        localStorage.setItem(
            "eventParticipants",
            JSON.stringify(participacionesEvento)
        );

        // Mostrar un mensaje de éxito
        alert("Inscripción realizada con éxito.");

        // Cambiar el onclick/llamado a la función de eliminar participación en el botón que ya esta
        subscribeButtonPlace.onclick = function () {
            eliminarParticipacion(userData, event, subscribeButtonPlace);
        };

        // Agregar una clase al botón para que este cambie su apariencia
        subscribeButtonPlace.className = "";
        subscribeButtonPlace.classList.add("deleteParticipationButton");

        // Mostrar el botón de eliminar participación en el botón
        subscribeButtonPlace.innerHTML = `
            Eliminar Inscripción
        `;

        // Salir de la función
        return;
    }

    /* ------------------ FUNCIÓN ELIMINAR INSCRIPCIÓN AL EVENTO ------------------ */

    function eliminarParticipacion(userData, event, subscribeButtonPlace) {
        // Filtra el array, manteniendo solo las participaciones que NO coinciden con la que queremos eliminar.
        const participacionesActualizadas = participacionesEvento.filter(
            (participation) =>
                // Condición: Retorna 'true' si el item NO es el que queremos eliminar
                !(
                    participation.user_id === userData.user_id &&
                    participation.event_id === event.evt_id
                )
        );

        // Verifica si se eliminó algo para el mensaje de éxito o error
        if (participacionesActualizadas.length < participacionesEvento.length) {
            alert("Inscripción eliminada con éxito.");
        } else {
            console.error("La Inscripción especificada no se encontró.");
        }

        // Actualiza el array original con las participaciones actualizadas
        participacionesEvento = participacionesActualizadas;

        // Guardar en localStorage la lista de participaciones
        localStorage.setItem(
            "eventParticipants",
            JSON.stringify(participacionesEvento)
        );

        // Quitar la clase al botón para que este cambie su apariencia
        subscribeButtonPlace.className = "";
        subscribeButtonPlace.classList.add("addParticipationButton");

        // Llamar función que renderiza el botón de inscribirse a su estado original
        obtenerBotonSuscribirEvento(event, userData, subscribeButtonPlace);

        // Salir de la función
        return;
    }

    /* ------------------ FUNCIÓN RENDER DE EVENTO(S) ------------------- */

    // Función para renderizar el evento o actividad en el HTML
    function renderEvento(
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
        carrys
    ) {
        obtenerImagenEvento();
        obtenerCategoriasDeEvento(event, categories, category_event);
        obtenerTituloEvento(event);
        contarParticipantes(event, participants);
        obtenerBotonSuscribirEvento(event, userData, subscribeButtonPlace);
        obtenerDescripcionEvento(event);
        obtenerRequerimientosEvento(event, requirements, event_requirements);
        obtenerQueTraerEvento(event, carrys);
        obtenerAccesibilidadEvento(event, accessibilities);
        obtenerParticipantesEvento(
            event,
            participants,
            users,
            userGlobalImage,
            creatorUser
        );
        obtenerPreguntasEvento(event, questions, users);
        obtenerUbicacionEvento(event, locations);
    }
});

/* -------------------------------------------------------------------------------------------- */

/* ------------------ FUNCIÓN VOLVER A ACTIVIDADES ------------------ */

// Función para volver a la página principal
function back_to_activities() {
    // Redirigir a la página principal de actividades
    window.location.href = "../templates/activities.html";
}

/* ------------------ FUNCIÓN MOSTRAR CATEGORIAS ------------------ */

// Función para mostrar categoría mediante los botones y sus cambios de estado
function show_category(category) {
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

/* ------------------ FUNCIÓN GUARDAR PREGUNTA EN EVENTO ------------------ */

// Función para guardar pregunta en evento
function saveQuestion() {
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
        event_id: id_evento_url, // Directamente en el objeto
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

    // Salir de la función
    return;
}
