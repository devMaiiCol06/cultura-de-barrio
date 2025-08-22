import dataFusion from "./functions/dataFusion.js";
import getLocalUsers from "./functions/getLocalUsers.js";

// ======================================================
// VERIFICAR SI EL USUARIO HA INICIADO SESIÓN

const userData =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));

if (userData) {
    // El usuario ha iniciado sesión, redirigir a la página principal
    window.location.href = "../templates/activities.html";
}
// ======================================================

document.addEventListener("DOMContentLoaded", function () {
    /* =================== VARIABLES GLOBALES =================== */

    const formularioInicio = document.getElementById("formulario-inicio");
    const formularioRegistro = document.getElementById("formulario-registro");
    let usersJson;
    const usersLocal = getLocalUsers();

    /* =================== FUNCIÓN/MÉTODO FETCH =================== */

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
            /* =================== VARIABLES DEL JSON =================== */
            // Accede a los datos JSON y los guarda en variables
            usersJson = data.USERS;
        })
        // Maneja errores en caso de que ocurran al cargar los datos JSON y los muestra en la consola
        .catch((error) => console.error("Error:", error));

    /* -------------------------------------------------------------------------------------------- */

    // ======================================================
    // -- FUNCIÓN: Iniciar sesión --
    // ======================================================

    // Función para iniciar sesión con los datos ingresados por el usuario
    formularioInicio.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto
        // Evento submit del formulario
        const email = formularioInicio.elements["usuario-inicio"].value; // Obtener el valor del campo de correo electrónico
        const password = formularioInicio.elements["clave-inicio"].value; // Obtener el valor del campo de contraseña
        const remember = formularioInicio.elements["recordar-inicio"].checked; // Obtener el valor del campo de recordar

        // Validar campos
        if (!email || !password) {
            // Si alguno de los campos está vacío
            messageResponse.innerHTML = "Por favor, complete todos los campos."; // Mostrar mensaje de error
            return;
        }

        // Obtener lista de usuarios registrados tanto del Local como del Json
        const users = dataFusion(usersJson, usersLocal);
        console.log(users)

        // Buscar el usuario por correo electrónico
        const user = users.find((user) => user.user_mail === email);
        console.log(user)
        // Verificar si el usuario existe
        if (!user) {
            // Si el usuario no existe
            mostrarMensaje(
                "El usuario no existe.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error

            return;
        }

        // Verificar la contraseña
        if (user.user_password !== password) {
            // Si la contraseña es incorrecta
            mostrarMensaje(
                "La contraseña es incorrecta.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error
            return;
        }

        // Si la verifcación es exitosa
        mostrarMensaje("Inicio de sesión exitoso.", "success", "ti ti-check"); // Mostrar mensaje de exito

        // Guardar los datos del usuario en el almacenamiento local
        // Crear objeto con datos del usuario
        const userDataObj = {
            user_id: btoa(user.user_id), // Encripta el ID usando base64
        };

        // Si el usuario ha marcado la opción "Recordarme", guardar los datos en localStorage
        if (remember) {
            // Almacena los datos encriptados en localStorage
            localStorage.setItem("userData", JSON.stringify(userDataObj));
        } else {
            // Si no ha marcado la opción "Recordarme", guardar los datos en sessionStorage
            sessionStorage.setItem("userData", JSON.stringify(userDataObj));
        }

        // Redirigir a la página principal
        window.location.href = "./activities.html";
    });

    // ======================================================
    // -- FUNCIÓN: Registrarse --
    // ======================================================

    // Función para registrarse con los datos ingresados por el usuario
    formularioRegistro.addEventListener("submit", (event) => {
        event.preventDefault(); // Evitar que el formulario se envíe por defecto

        // Obtener valores de los campos del formulario
        const nombre = formularioRegistro.elements["nombre-registro"].value;
        const apellido = formularioRegistro.elements["apellido-registro"].value;
        const nacimiento =
            formularioRegistro.elements["nacimiento-registro"].value;
        const email = formularioRegistro.elements["email-registro"].value;
        const password = formularioRegistro.elements["clave-registro"].value;
        const confirmPassword =
            formularioRegistro.elements["confirmar-clave"].value;
        const tyc = formularioRegistro.elements["tyc-registro"].checked;

        // Validar términos y condiciones
        if (!tyc) {
            // Si no se ha aceptado el TYC
            mostrarMensaje(
                "Debes aceptar los términos y condiciones.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error
            return;
        }

        // Validar campos
        if (
            !nombre ||
            !apellido ||
            !nacimiento ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            // Si alguno de los campos está vacío
            mostrarMensaje(
                "Por favor, complete todos los campos.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error

            return;
        }

        // Validar contraseña
        if (password !== confirmPassword) {
            // Si las contraseñas no coinciden
            mostrarMensaje(
                "Las contraseñas no coinciden.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error
            return;
        }

        // Obtener lista de usuarios registrados tanto del Local como del Json
        const users = dataFusion(usersJson, userLocal);

        // Verificar si el usuario ya existe
        const userExists = users.some((user) => user.user_mail === email);
        if (userExists) {
            // Si el usuario ya existe
            mostrarMensaje(
                "El usuario ya existe.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error
            return;
        }

        // Saber la edad del usuario
        const edad = calcularEdad(nacimiento);

        if (edad < 18) {
            // Si el usuario es menor de edad
            mostrarMensaje(
                "Debes ser mayor de edad para registrarte.",
                "error",
                "ti ti-exclamation-circle"
            ); // Mostrar mensaje de error
            return;
        }

        // Crear objeto con datos encriptados del nuevo usuario
        const newUser = {
            user_id: btoa(usersJson.length + 1),
            user_name: btoa(nombre),
            user_lastname: btoa(apellido),
            user_birth: btoa(nacimiento),
            user_mail: btoa(email),
            user_password: btoa(password),
        };

        // Agregar el nuevo usuario a la lista
        userLocal.push(newUser);

        // Guardar la lista actualizada en localStorage
        localStorage.setItem("usersRegistered", JSON.stringify(userLocal));

        // Mostrar mensaje de éxito
        mostrarMensaje(
            "Registro exitoso. Ahora puedes iniciar sesión.",
            "success",
            "ti ti-check"
        );

        // Limpiar el formulario
        formularioRegistro.reset();

        // Cambiar a la vista de inicio de sesión
        cambiarFormularios.click();
    });

    // ======================================================
    // -- FUNCIÓN: Cambiar visibilidad de formularios --
    // ======================================================

    // Función para alternar formularios
    const cambiarFormularios = document.getElementById(
        "enlace-cambiar-formulario"
    );

    // Crear un punto de referencia, iniciando con el formulario de inicio de sesión
    let estadoActual = "inicio";

    cambiarFormularios.addEventListener("click", (event) => {
        event.preventDefault(); // Evitar que el enlace se abra en una nueva página
        // Referencias a los elementos del DOM
        const tituloElemento = document.getElementById("titulo-formulario");
        const subtituloElemento = document.getElementById(
            "subtitulo-formulario"
        );
        const enlaceCambiarElemento = document.getElementById(
            "enlace-cambiar-formulario"
        );

        // Objeto con los textos para cada estado
        const textos = {
            inicio: {
                titulo: "Iniciar sesión",
                subtitulo: "Bienvenido de vuelta a tu comunidad",
                linkText: "Regístrate aquí",
                promptText: "¿No tienes una cuenta? ",
            },
            registro: {
                titulo: "Crea tu cuenta",
                subtitulo: "Únete a la comunidad y empieza a participar",
                linkText: "Inicia sesión",
                promptText: "¿Ya tienes una cuenta? ",
            },
        };

        // Cambiar estado
        estadoActual = estadoActual === "inicio" ? "registro" : "inicio";

        // Alterna la visibilidad de los formularios
        formularioInicio.classList.toggle("hidden");
        formularioRegistro.classList.toggle("hidden");

        // Actualiza el texto de los elementos
        const texto = textos[estadoActual];
        tituloElemento.textContent = texto.titulo;
        subtituloElemento.textContent = texto.subtitulo;
        enlaceCambiarElemento.textContent = texto.linkText;
        document.querySelector(".cambiar-formulario").childNodes[0].nodeValue =
            texto.promptText;
    });

    // ======================================================
    // -- FUNCIÓN: Redirigir a la página principal --
    // ======================================================

    const backButton = document.querySelector(".backButton");
    backButton.addEventListener("click", (event) => {
        event.preventDefault(); // Evitar que el enlace se abra en una nueva página
        window.location.href = "../index.html";
    });
});

// ======================================================
// -- FUNCIÓN: Mostrar mensaje de respuesta al intento de inicio de sesión y registro --
// ======================================================

// Funcion para mostrar mensajes de respuesta
let mostrarMensajeTemp; // Variable para almacenar el ID del temporizador

function mostrarMensaje(mensaje, type, icon) {
    const messageResponse = document.querySelector(".messageResponse"); // Obtener el contenedor de mensajes

    // Oculta el mensaje y reinicia las clases para la animación
    messageResponse.classList.add("hidden");
    messageResponse.classList.remove("success", "error"); // Reinicia las clases de tipo

    // Agrega un pequeño retraso para forzar el reflow
    // Esto asegura que el navegador 'vea' el cambio a `hidden`
    setTimeout(() => {
        // Borra cualquier temporizador anterior
        clearTimeout(mostrarMensajeTemp);

        // Inserta el nuevo contenido
        messageResponse.innerHTML = `
            <div class="messageResponse__icon">
                <i class="${icon}"></i>
            </div>
            <div class="messageResponse__title">${mensaje}</div>
            <div class="messageResponse__close">
                <i class="ti ti-x"></i>
            </div>
        `;

        // Muestra el mensaje con la clase de tipo
        messageResponse.classList.remove("hidden");
        messageResponse.classList.add(type);

        // Agrega el evento al botón de cierre
        const closeButton = document.querySelector(".messageResponse__close");
        closeButton.addEventListener("click", () => {
            // Al cerrar manualmente, también borra el temporizador.
            clearTimeout(mostrarMensajeTemp);
            messageResponse.classList.add("hidden");
        });

        // Asigna el ID del nuevo temporizador a la variable
        mostrarMensajeTemp = setTimeout(() => {
            messageResponse.classList.add("hidden");
        }, 3000);
    }, 10);
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}
