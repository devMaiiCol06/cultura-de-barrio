function cambiarFormularios() {
    const formularioInicio = document.getElementById("formulario-inicio");
    const formularioRegistro = document.getElementById("formulario-registro");
    const titulo = document.getElementById("titulo-formulario");
    const enlace = document.getElementById("cambiar-formulario");
    const mensaje = document.getElementById("mensaje");

    const mostrandoInicio = !formularioInicio.classList.contains("oculto");

    if (mostrandoInicio) {
        formularioInicio.classList.add("oculto");
        formularioRegistro.classList.remove("oculto");
        titulo.textContent = "Registro";
        enlace.textContent = "¿Ya tienes cuenta? Inicia sesión";
    } else {
        formularioInicio.classList.remove("oculto");
        formularioRegistro.classList.add("oculto");
        titulo.textContent = "Iniciar sesión";
        enlace.textContent = "¿No tienes cuenta? Regístrate aquí";
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

    localStorage.setItem(usuario, clave);

    mensaje.textContent = "Te has registrado exitosamente. Redirigiendo...";
    mensaje.style.color = "green";

    setTimeout(() => {
        window.location.href = "inicio.html";
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

    const verificaUsu = localStorage.getItem(usuario);
    const claveGuardada = localStorage.getItem(clave);
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
        window.location.href = "inicio.html";
    }, 1500);
}