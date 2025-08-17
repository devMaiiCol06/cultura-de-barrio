// ======================================================
// -- FUNCIÓN: Obtener usuarios registrados en el localStorage --
// ======================================================

// Función para obtener usuarios registrados en el localStorage
export default function getLocalUsers() {
    // Obtener usuarios registrados en el localStorage
    const users = JSON.parse(localStorage.getItem("usersRegistered"));
    return users;
}
