// ==============================
//  FUNCIONES DE INTERFAZ
// ==============================

// Objeto que define toda la configuración para cada vista (login y registro)
const vistas = {
    inicio: {
        titulo: "Iniciar sesión",
        subtitulo: "Bienvenido de vuelta a tu comunidad",
        enlace: "Regístrate aquí",
        formularioHTML: `
            <div class="campo">
                <label for="usuario-inicio">Correo Electrónico</label>
                <div class="input-icono">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="usuario-inicio" placeholder="Tu email" />
                </div>
            </div>
            <div class="campo">
                <label for="clave-inicio">Contraseña</label>
                <div class="input-icono">
                    <i class="fa fa-lock"></i>
                    <input type="password" id="clave-inicio" placeholder="Contraseña" />
                </div>
            </div>
            <div class="extra-opciones">
                <label><input type="checkbox" /> Recordarme</label>
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <button id="btn-auth-inicio" class="btn-auth" onclick="iniciarSesion()">Iniciar sesión</button>
        `,
    },
    registro: {
        titulo: "Crea tu cuenta",
        subtitulo: "Únete a la comunidad y empieza a participar",
        enlace: "Inicia sesión",
        formularioHTML: `
            <div class="campoContainer">
                <div class="campo">
                    <label for="nombre-registro">Nombre</label>
                    <div class="input-icono">
                        <i class="fa fa-user"></i>
                        <input type="text" id="nombre-registro" required placeholder="Tu nombre" />
                    </div>
                </div>
                <div class="campo">
                    <label for="apellido-registro">Apellido</label>
                    <div class="input-icono">
                        <i class="fa fa-user"></i>
                        <input type="text" id="apellido-registro" required placeholder="Tu apellido" />
                    </div>
                </div>
            </div>
            <div class="campo">
                <label for="nacimiento-registro">Fecha de naciemiento</label>
                <div class="input-icono">
                    <i class="fa fa-calendar-alt"></i>
                    <input type="date" id="nacimiento-registro" placeholder="Tu fecha de nacimiento" required />
                </div>
            </div>
            <div class="campo">
                <label for="email-registro">Correo Electrónico</label>
                <div class="input-icono">
                    <i class="fa fa-envelope"></i>
                    <input type="email" id="email-registro" required placeholder="Tu email" />
                </div>
            </div>
            <div class="campoContainer">
                <div class="campo">
                    <label for="clave-registro">Contraseña</label>
                    <div class="input-icono">
                        <i class="fa fa-lock"></i>
                        <input type="password" id="clave-registro" required placeholder="Contraseña" />
                    </div>
                </div>

                <div class="campo">
                    <label for="confirmar-clave">Confirmar Contraseña</label>
                    <div class="input-icono">
                        <i class="fa fa-lock"></i>
                        <input type="password" id="confirmar-clave" required     placeholder="Confirmar Contraseña" />
                    </div>
            </div>
            </div>
            <label class="checkbox">
                <input type="checkbox" /> Acepto los <a href="#">términos y condiciones</a> y la <a href="#">política de privacidad</a>
            </label>
            <button id="btn-auth-registro" class="btn-auth" onclick="registrar()">Crear cuenta</button>
        `,
    },
};

let estadoActual = "inicio";

// Función para renderizar la vista completa
function renderizarVista() {
    const vista = vistas[estadoActual];
    document.getElementById("titulo-formulario").innerHTML = vista.titulo;
    document.getElementById("subtitulo-formulario").innerHTML = vista.subtitulo;
    document.getElementById("enlace-cambiar-formulario").innerHTML =
        vista.enlace;
    document.getElementById("contenedor-formulario-dinamico").innerHTML =
        vista.formularioHTML;
}

// Función que se llama con el clic
function cambiarFormularios() {
    estadoActual = estadoActual === "inicio" ? "registro" : "inicio";
    renderizarVista();
}

// Llamar a la función al cargar la página para mostrar el formulario inicial
document.addEventListener("DOMContentLoaded", renderizarVista);

// ==============================
//  FUNCIONES DE AUTHENTICACION
// ==============================
