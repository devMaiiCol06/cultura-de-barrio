// ======================================================
// -- FUNCIÓN: Cerrar sesión --
// ======================================================

// Función para cerrar sesión
export default function cerrarSesion() {
    // Eliminar los datos de autenticación del almacenamiento local
    localStorage.removeItem("userData");
    // Eliminar los datos de autenticación del almacenamiento sesión
    sessionStorage.removeItem("userData");

    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = "../../templates/auth.html";
}

