// 1. Cargar usuarios del JSON
fetch("/resources/data/data.json")
    .then((res) => res.json())
    .then((data) => {
        const usuariosDelJson = data.USERS;
        console.log("Usuarios del JSON:", usuariosDelJson);

        // 2. Cargar usuarios del localStorage
        const usuariosLocales =
            JSON.parse(localStorage.getItem("usuarios")) || [];
        console.log("Usuarios del localStorage:", usuariosLocales);

        // 3. Combinar ambos arrays evitando duplicados por correo
        const todosLosUsuarios = [];
        if (usuariosLocales.length != 0) {
            usuariosLocales.forEach((nuevo) => {
                const yaExiste = todosLosUsuarios.some(
                    (u) => u.correo === nuevo.correo
                );
                if (!yaExiste) {
                    todosLosUsuarios.push(nuevo);
                }
            });
        }
        console.log("Todos los Usuarios 1:", todosLosUsuarios);

        if (usuariosDelJson.length != 0) {
            usuariosDelJson.forEach((nuevo) => {
                const yaExiste = todosLosUsuarios.some(
                    (u) => u.correo === nuevo.correo
                );
                if (!yaExiste) {
                    todosLosUsuarios.push(nuevo);
                }
            });
        }

        console.log("Todos los Usuarios 2:", todosLosUsuarios);
    });

//     // 4. Guardar la fusión en localStorage
//     localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios));

//     // 5. Mostrar resultado
//     console.log("Usuarios combinados:", todosLosUsuarios);

//     // 6. Agregar un nuevo usuario
//     const nuevoUsuario = {
//         id: Date.now(),
//         nombre: "Ana",
//         correo: "ana@correo.com",
//         contrasena: "clave123",
//     };

//     const existeNuevo = todosLosUsuarios.some(
//         (u) => u.correo === nuevoUsuario.correo
//     );

//     if (!existeNuevo) {
//         todosLosUsuarios.push(nuevoUsuario);
//         localStorage.setItem("usuarios", JSON.stringify(todosLosUsuarios));
//         console.log("Nuevo usuario agregado");
//     } else {
//         console.log("El usuario ya existe, no se agregó.");
//     }
// })
// .catch((err) => console.error("Error al cargar usuarios.json:", err));
