// ==============================
//  FUNCIONES DE INTERFAZ 
// ==============================

function cambiarFormularios() {
    const formularioInicio = document.getElementById("formulario-inicio");
    const formularioRegistro = document.getElementById("formulario-registro");
    const titulo = document.getElementById("titulo-formulario");
    const subtitulo = document.getElementById("subtitulo-formulario"); 
    const enlace = document.getElementById("cambiar-formulario");
    const mensaje = document.getElementById("mensaje");

    const beneficiosInicio = document.getElementById("beneficios-inicio");
    const beneficiosRegistro = document.getElementById("beneficios-registro");

    const mostrandoInicio = !formularioInicio.classList.contains("oculto");

    if (mostrandoInicio) {
        formularioInicio.classList.add("oculto");
        formularioRegistro.classList.remove("oculto");
        titulo.innerHTML = "Crea tu cuenta";
        enlace.innerHTML = "¿Ya tienes cuenta? Inicia sesión";
        if (subtitulo) subtitulo.innerHTML = "Únete a la comunidad y empieza a participar";
        if (beneficiosInicio) beneficiosInicio.classList.add("oculto");
        if (beneficiosRegistro) beneficiosRegistro.classList.remove("oculto");
    } else {
        formularioInicio.classList.remove("oculto");
        formularioRegistro.classList.add("oculto");
        titulo.innerHTML = "Iniciar sesión";
        enlace.innerHTML = "¿No tienes cuenta? Regístrate aquí";
        if (subtitulo) subtitulo.innerHTML = "Bienvenido de vuelta a tu comunidad";
        if (beneficiosInicio) beneficiosInicio.classList.remove("oculto");
        if (beneficiosRegistro) beneficiosRegistro.classList.add("oculto");
    }

    mensaje.innerHTML = "";
}

// ==============================
//  FUNCIONES DE AUTHENTICACION
// ==============================

