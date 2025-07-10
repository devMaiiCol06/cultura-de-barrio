function cambiarFormularios() {
    const formularioInicio = document.getElementById("formulario-inicio");
    const formularioRegistro = document.getElementById("formulario-registro");
    const titulo = document.getElementById("titulo-formulario");
    const subtitulo = document.getElementById("subtitulo-formulario"); 
    const enlace = document.getElementById("cambiar-formulario");
    const mensaje = document.getElementById("mensaje");

    // Nuevos elementos para beneficios
    const beneficiosInicio = document.getElementById("beneficios-inicio");
    const beneficiosRegistro = document.getElementById("beneficios-registro");

    const mostrandoInicio = !formularioInicio.classList.contains("oculto");

    if (mostrandoInicio) {
        formularioInicio.classList.add("oculto");
        formularioRegistro.classList.remove("oculto");
        titulo.textContent = "Crea tu cuenta";
        enlace.textContent = "¿Ya tienes cuenta? Inicia sesión";

        // Cambios nuevos
        if (subtitulo) subtitulo.textContent = "Únete a la comunidad y empieza a participar";
        if (beneficiosInicio) beneficiosInicio.classList.add("oculto");
        if (beneficiosRegistro) beneficiosRegistro.classList.remove("oculto");
    } else {
        formularioInicio.classList.remove("oculto");
        formularioRegistro.classList.add("oculto");
        titulo.textContent = "Iniciar sesión";
        enlace.textContent = "¿No tienes cuenta? Regístrate aquí";

        // Cambios nuevos
        if (subtitulo) subtitulo.textContent = "Bienvenido de vuelta a tu comunidad";
        if (beneficiosInicio) beneficiosInicio.classList.remove("oculto");
        if (beneficiosRegistro) beneficiosRegistro.classList.add("oculto");
    }

    mensaje.textContent = "";
}

function registrar() {
    const usuario = document.getElementById("usuario-registro").value.trim();
    const clave = document.getElementById("clave-registro").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (usuario === "" || clave === "") {
        mensaje.textContent = "Debes llenar todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    if (localStorage.getItem(usuario)) {
        mensaje.textContent = "Este usuario ya está en uso.";
        mensaje.style.color = "red";
        return;
    }

    localStorage.setItem("usuario", usuario);
    localStorage.setItem("contraseña", clave);

    mensaje.textContent = "Te has registrado exitosamente. Redirigiendo...";
    mensaje.style.color = "green";

    setTimeout(() => {
        window.location.href = "activities.html";
    }, 1500);
}

function iniciarSesion() {
    const usuario = document.getElementById("usuario-inicio").value.trim();
    const clave = document.getElementById("clave-inicio").value.trim();
    const mensaje = document.getElementById("mensaje");

    if (usuario === "" || clave === "") {
        mensaje.textContent = "Por favor completa todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    const verificaUsu = localStorage.getItem("usuario");
    const claveGuardada = localStorage.getItem("contraseña");
    console.log(verificaUsu, claveGuardada);
    if (!verificaUsu) {
        mensaje.textContent = "Usuario no encontrado.";
        mensaje.style.color = "red";
        return;
    }

    if (claveGuardada !== clave) {
        mensaje.textContent = "Contraseña incorrecta.";
        mensaje.style.color = "red";
        return;
    }

    mensaje.textContent = "Inicio de sesión exitoso. Redirigiendo...";
    mensaje.style.color = "green";

    setTimeout(() => {
        window.location.href = "activities.html";
    }, 1500);
}
