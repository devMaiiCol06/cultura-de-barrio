// ======================================================
// -- FUNCIÓN: Obtener usuarios registrados en el localStorage --
// ======================================================

// Función para obtener usuarios registrados en el localStorage
export default function getLocalUsers() {
    // Obtener usuarios registrados en el localStorage
    const users = JSON.parse(localStorage.getItem("usersRegistered"));
    // Verificar si hay usuarios registrados
    if (!users) {
        // Si no hay usuarios registrados, mostrar mensaje de advertencia y crear la lista vaccia
        console.warn("No hay usuarios registrados en el localStorage");
        // Salir de la función
        return [];
    }

    // Decodificar los usuarios
    const decodedUsers = users.map((user) => {
        return {
            user_id: parseInt(atob(user.user_id)),
            user_name: atob(user.user_name),
            user_lastname: atob(user.user_lastname),
            user_mail: atob(user.user_mail),
            user_password: atob(user.user_password),
            user_birth: parseInt(atob(user.user_birth)),
        };
    });

    // Devolver los usuarios decodificados
    return decodedUsers;
}
