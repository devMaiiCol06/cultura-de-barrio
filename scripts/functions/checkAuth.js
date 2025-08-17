// ======================================================
// -- FUNCIÓN: Verificar autenticación/sesión del usuario --
// ======================================================

// Función para verificar si el usuario está autenticado
export default function checkAuth() { // Exportar función
    const userData = JSON.parse( // Parsear datos de usuario
        // Obtener datos de usuario de almacenamiento local o sesión
        localStorage.getItem("userData") ?? sessionStorage.getItem("userData") 
    );

    if (!userData) { // Si no hay datos de usuario
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = "../../templates/auth.html";
        return;
    } else { // Si hay datos de usuario
        // Devolver los datos de usuario
        return true;
    }
}

// ======================================================
// -- FUNCIÓN: Verificar autenticación/sesión del usuario --
// ======================================================

// Función para verificar si el usuario está autenticado
export default function checkAuth() {
    // Exportar función
    const userData = JSON.parse(
        // Parsear datos de usuario
        // Obtener datos de usuario de almacenamiento local o sesión
        localStorage.getItem("userData") ?? sessionStorage.getItem("userData")
    );

    if (!userData) {
        // Si no hay datos de usuario
        // Redirigir al usuario a la página de inicio de sesión
        window.location.href = "../../templates/auth.html";
        return;
    } else {
        // Si hay datos de usuario
        // Devolver los datos de usuario
        return true;
    }
}
