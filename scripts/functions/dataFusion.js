/* ======================================================
    -- FUNCIÓN: Juntar datos de JSON y LocalStorage --
    ====================================================== */

// Función para unir/fusionar/combinar la información obtenida de la API de JSON y LocalStorage
export default function dataFusion(dataJSON, dataLOCAL) {
    // Verificar si estan los parametros
    if (!dataJSON || !dataLOCAL) {
        // Si alguno de los dos parametros faltan mostrar mensaje de advertencia
        console.warn(
            "Falta los datos del parametro " +
                (!dataJSON ? "JSON" : "") +
                (!dataLOCAL ? "LocalStorage" : "") +
                " para poder proceder con la función de unir los datos"
        );
    }

    const dataUnitedStringified = new Set(); // Creamos un Set para cadenas de texto y poder evitar duplicados

    if (dataJSON) {
        // Agregar datos desde el JSON
        dataJSON.forEach((data) => {
            dataUnitedStringified.add(JSON.stringify(data)); // Agregamos la versión en cadena
        });
    }
    if (dataLOCAL) {
        // Agregar datos desde el LOCAL STORAGE
        dataLOCAL.forEach((data) => {
            dataUnitedStringified.add(JSON.stringify(data)); // Agregamos la versión en cadena
        });
    }

    // Convertir las cadenas de vuelta a objetos
    const DataUnited = Array.from(dataUnitedStringified).map((str) =>
        JSON.parse(str)
    );

    return DataUnited; // Retornamos un Array de objetos únicos
}
