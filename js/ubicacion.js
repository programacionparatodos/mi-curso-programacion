"use strict";


/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Motor internacional de zonas horarias

   REGLA PRINCIPAL:

   - Bolivia es SIEMPRE la referencia oficial.
   - Los horarios se almacenan en America/La_Paz.
   - El navegador detecta automáticamente la zona horaria
     IANA del visitante.
   - Las conversiones se realizan sobre fecha + hora.
   - No utilizamos diferencias manuales como +1, -2, etc.
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */


const ZONA_HORARIA_BASE = "America/La_Paz";


const CLAVE_ZONA_HORARIA =
    "ppt-zona-horaria";


const UBICACION = {

    zonaHorariaBase:
        ZONA_HORARIA_BASE,

    zonaHoraria:
        ZONA_HORARIA_BASE,

    zonaDetectada:
        ZONA_HORARIA_BASE,

    modoAutomatico:
        true

};



/* =========================================================
   NOMBRES DE DÍAS
   ========================================================= */


const DIAS_SEMANA_ZONA = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"
];


const NOMBRES_DIAS_ZONA = {

    domingo: "Domingo",
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado"

};



/* =========================================================
   DETECCIÓN AUTOMÁTICA
   ========================================================= */


function detectarZonaHoraria() {

    try {

        const zona =
            Intl
                .DateTimeFormat()
                .resolvedOptions()
                .timeZone;


        if (
            zona &&
            zonaHorariaValida(zona)
        ) {

            return zona;

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No fue posible detectar la zona horaria.",
            error
        );

    }


    return ZONA_HORARIA_BASE;
}



/* =========================================================
   VALIDACIÓN
   ========================================================= */


function zonaHorariaValida(zonaHoraria) {

    if (
        !zonaHoraria ||
        typeof zonaHoraria !== "string"
    ) {

        return false;

    }


    try {

        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: zonaHoraria
            }
        ).format();


        return true;

    } catch (error) {

        return false;

    }

}



/* =========================================================
   LISTA DE ZONAS HORARIAS
   ========================================================= */


function obtenerZonasHorariasDisponibles() {

    /*
     * Navegadores modernos permiten obtener directamente
     * las zonas horarias soportadas por el motor.
     */

    try {

        if (
            typeof Intl.supportedValuesOf ===
            "function"
        ) {

            const zonas =
                Intl.supportedValuesOf(
                    "timeZone"
                );


            if (
                Array.isArray(zonas) &&
                zonas.length
            ) {

                return zonas;

            }

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No fue posible obtener todas las zonas IANA.",
            error
        );

    }


    /*
     * Respaldo para navegadores que no soporten
     * Intl.supportedValuesOf().
     *
     * Incluimos únicamente algunas zonas comunes.
     * La detección automática seguirá funcionando
     * aunque la zona no aparezca en esta lista.
     */

    return [

        "America/La_Paz",

        "America/Lima",
        "America/Bogota",
        "America/Caracas",
        "America/Santiago",
        "America/Argentina/Buenos_Aires",
        "America/Asuncion",
        "America/Montevideo",

        "America/Mexico_City",
        "America/Cancun",
        "America/Hermosillo",
        "America/Tijuana",

        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Phoenix",
        "America/Anchorage",
        "Pacific/Honolulu",

        "Europe/Madrid",
        "Atlantic/Canary",
        "Europe/London",

        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Rome",

        "Asia/Tokyo",
        "Asia/Shanghai",

        "Australia/Sydney"

    ];

}



/* =========================================================
   NOMBRE AMIGABLE DE UNA ZONA
   ========================================================= */


function limpiarNombreZona(texto) {

    return String(texto || "")
        .replaceAll("_", " ")
        .trim();

}



function obtenerNombreCiudadZona(
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    if (!zonaHoraria) {
        return "Tu ubicación";
    }


    const partes =
        zonaHoraria.split("/");


    const ultimaParte =
        partes[
            partes.length - 1
        ];


    return limpiarNombreZona(
        ultimaParte
    );

}



function obtenerRegionZona(
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    if (!zonaHoraria) {
        return "Zona horaria";
    }


    const partes =
        zonaHoraria.split("/");


    if (partes.length < 2) {

        return limpiarNombreZona(
            zonaHoraria
        );

    }


    return limpiarNombreZona(
        partes[0]
    );

}



/* =========================================================
   NOMBRE PARA MOSTRAR
   ========================================================= */


function obtenerNombreUbicacion() {

    if (
        UBICACION.zonaHoraria ===
        "America/La_Paz"
    ) {

        return "Bolivia · La Paz";

    }


    const ciudad =
        obtenerNombreCiudadZona(
            UBICACION.zonaHoraria
        );


    return ciudad;

}



/* =========================================================
   COMPATIBILIDAD CON EL CÓDIGO EXISTENTE
   ========================================================= */


function obtenerPaisActual() {

    /*
     * Conservamos esta función porque cursos.js y
     * calendario.js ya la utilizan.
     *
     * Ahora representa la zona horaria del visitante,
     * no un país seleccionado manualmente.
     */

    return {

        codigo:
            "AUTO",

        nombre:
            obtenerNombreUbicacion(),

        bandera:
            "🌎",

        zonaHoraria:
            UBICACION.zonaHoraria,

        automatica:
            UBICACION.modoAutomatico

    };

}



/* =========================================================
   ALMACENAMIENTO
   ========================================================= */


function guardarZonaHoraria() {

    try {

        if (
            UBICACION.modoAutomatico
        ) {

            localStorage.removeItem(
                CLAVE_ZONA_HORARIA
            );


            return;

        }


        localStorage.setItem(
            CLAVE_ZONA_HORARIA,
            UBICACION.zonaHoraria
        );

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo guardar la zona horaria.",
            error
        );

    }

}



function cargarZonaHoraria() {

    UBICACION.zonaDetectada =
        detectarZonaHoraria();


    UBICACION.zonaHoraria =
        UBICACION.zonaDetectada;


    UBICACION.modoAutomatico =
        true;


    try {

        const guardada =
            localStorage.getItem(
                CLAVE_ZONA_HORARIA
            );


        if (
            guardada &&
            zonaHorariaValida(
                guardada
            )
        ) {

            UBICACION.zonaHoraria =
                guardada;


            UBICACION.modoAutomatico =
                false;

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo recuperar la zona horaria.",
            error
        );

    }

}



/* =========================================================
   PARTES DE FECHA EN UNA ZONA
   ========================================================= */


function obtenerPartesZonaHoraria(
    fecha,
    zonaHoraria
) {

    const formato =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    zonaHoraria,

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                weekday:
                    "short",

                hourCycle:
                    "h23"
            }
        );


    const partes =
        formato.formatToParts(
            fecha
        );


    const resultado = {};


    partes.forEach(parte => {

        if (
            parte.type ===
            "literal"
        ) {

            return;

        }


        if (
            [
                "year",
                "month",
                "day",
                "hour",
                "minute",
                "second"
            ].includes(
                parte.type
            )
        ) {

            resultado[
                parte.type
            ] =
                Number(
                    parte.value
                );


            return;

        }


        resultado[
            parte.type
        ] =
            parte.value;

    });


    return resultado;

}



/* =========================================================
   OFFSET REAL DE UNA ZONA
   ========================================================= */


function obtenerOffsetZona(
    fecha,
    zonaHoraria
) {

    const partes =
        obtenerPartesZonaHoraria(
            fecha,
            zonaHoraria
        );


    const comoUTC =
        Date.UTC(
            partes.year,
            partes.month - 1,
            partes.day,
            partes.hour,
            partes.minute,
            partes.second
        );


    return (
        comoUTC -
        fecha.getTime()
    );

}



/* =========================================================
   BOLIVIA -> UTC
   ========================================================= */


function fechaHoraBoliviaAUTC(
    fechaISO,
    hora
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const [
        horas,
        minutos
    ] =
        hora
            .split(":")
            .map(Number);


    /*
     * Primera aproximación.
     */

    let instante =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia,
                horas,
                minutos,
                0
            )
        );


    /*
     * Calculamos el offset de Bolivia
     * para ese instante concreto.
     */

    let offset =
        obtenerOffsetZona(
            instante,
            ZONA_HORARIA_BASE
        );


    instante =
        new Date(
            instante.getTime() -
            offset
        );


    /*
     * Segunda comprobación.
     *
     * Esta corrección hace el algoritmo más
     * robusto para zonas que sí poseen cambios
     * de offset.
     *
     * Bolivia actualmente no utiliza DST,
     * pero dejamos el motor genérico.
     */

    const offsetCorregido =
        obtenerOffsetZona(
            instante,
            ZONA_HORARIA_BASE
        );


    if (
        offsetCorregido !==
        offset
    ) {

        instante =
            new Date(
                instante.getTime() +
                offset -
                offsetCorregido
            );

    }


    return instante;

}



/* =========================================================
   FORMATO DE FECHA ISO
   ========================================================= */


function partesAFechaISO(partes) {

    return (
        `${partes.year}-` +
        `${String(partes.month).padStart(2, "0")}-` +
        `${String(partes.day).padStart(2, "0")}`
    );

}



function partesAHora(partes) {

    return (
        `${String(partes.hour).padStart(2, "0")}:` +
        `${String(partes.minute).padStart(2, "0")}`
    );

}



/* =========================================================
   DÍA DE LA SEMANA
   ========================================================= */


function obtenerDiaSemanaISO(
    fechaISO
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const indice =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia
            )
        ).getUTCDay();


    return DIAS_SEMANA_ZONA[
        indice
    ];

}



/* =========================================================
   CONVERSIÓN INTERNACIONAL COMPLETA
   ========================================================= */


function convertirFechaHoraBolivia(
    fechaISO,
    hora,
    zonaDestino =
        UBICACION.zonaHoraria
) {

    if (
        !zonaHorariaValida(
            zonaDestino
        )
    ) {

        zonaDestino =
            ZONA_HORARIA_BASE;

    }


    const instante =
        fechaHoraBoliviaAUTC(
            fechaISO,
            hora
        );


    const partes =
        obtenerPartesZonaHoraria(
            instante,
            zonaDestino
        );


    const fechaLocal =
        partesAFechaISO(
            partes
        );


    return {

        instante,

        fecha:
            fechaLocal,

        hora:
            partesAHora(
                partes
            ),

        dia:
            obtenerDiaSemanaISO(
                fechaLocal
            ),

        zonaHoraria:
            zonaDestino

    };

}



/* =========================================================
   COMPATIBILIDAD:
   convertirHoraBolivia()
   ========================================================= */


function convertirHoraBolivia(
    fechaISO,
    hora,
    zonaDestino =
        UBICACION.zonaHoraria
) {

    const conversion =
        convertirFechaHoraBolivia(
            fechaISO,
            hora,
            zonaDestino
        );


    return {

        hora:
            conversion.hora,

        fecha:
            conversion.fecha,

        dia:
            conversion.dia,

        zonaHoraria:
            conversion.zonaHoraria,

        pais:
            obtenerPaisActual()

    };

}



/* =========================================================
   DIFERENCIA DE DÍAS
   ========================================================= */


function sumarDiasFechaISO(
    fechaISO,
    cantidad
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const fecha =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia + cantidad
            )
        );


    return (
        `${fecha.getUTCFullYear()}-` +
        `${String(
            fecha.getUTCMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
            fecha.getUTCDate()
        ).padStart(2, "0")}`
    );

}



/* =========================================================
   BUSCAR UNA FECHA REPRESENTATIVA PARA UN DÍA
   ========================================================= */


function obtenerFechaParaDiaCurso(
    curso,
    diaBuscado
) {

    /*
     * Partimos de la fecha de inicio del curso y
     * buscamos la primera ocurrencia real del día.
     *
     * Esto es mejor que convertir todos los días
     * utilizando siempre curso.fechaInicio.
     */

    for (
        let desplazamiento = 0;
        desplazamiento < 14;
        desplazamiento++
    ) {

        const fecha =
            sumarDiasFechaISO(
                curso.fechaInicio,
                desplazamiento
            );


        if (
            obtenerDiaSemanaISO(
                fecha
            ) ===
            diaBuscado
        ) {

            return fecha;

        }

    }


    return curso.fechaInicio;

}



/* =========================================================
   CONVERSIÓN DE UNA CLASE CONCRETA
   ========================================================= */


function convertirClaseCurso(
    curso,
    fechaClase
) {

    const inicio =
        convertirFechaHoraBolivia(
            fechaClase,
            curso.horaInicio
        );


    const fin =
        convertirFechaHoraBolivia(
            fechaClase,
            curso.horaFin
        );


    return {

        fechaBolivia:
            fechaClase,

        diaBolivia:
            obtenerDiaSemanaISO(
                fechaClase
            ),

        inicio:
            inicio.hora,

        fin:
            fin.hora,

        fechaLocal:
            inicio.fecha,

        fechaFinLocal:
            fin.fecha,

        diaLocal:
            inicio.dia,

        diaFinLocal:
            fin.dia,

        zonaHoraria:
            UBICACION.zonaHoraria

    };

}



/* =========================================================
   HORARIO REPRESENTATIVO DE UN CURSO
   ========================================================= */


function obtenerHorarioLocalCurso(
    curso
) {

    /*
     * Esta función continúa existiendo para mantener
     * compatibilidad con cursos.js.
     *
     * Para mostrar únicamente "hora inicio - hora fin"
     * utilizamos la fecha inicial como referencia.
     *
     * Para matrices semanales internacionales debemos
     * utilizar convertirClaseCurso() por cada día.
     */

    const inicio =
        convertirFechaHoraBolivia(
            curso.fechaInicio,
            curso.horaInicio
        );


    const fin =
        convertirFechaHoraBolivia(
            curso.fechaInicio,
            curso.horaFin
        );


    return {

        inicio:
            inicio.hora,

        fin:
            fin.hora,

        fechaLocal:
            inicio.fecha,

        fechaFinLocal:
            fin.fecha,

        diaLocal:
            inicio.dia,

        diaFinLocal:
            fin.dia,

        zonaHoraria:
            UBICACION.zonaHoraria,

        pais:
            obtenerPaisActual()

    };

}



/* =========================================================
   HORARIO DE UN DÍA CONCRETO DEL CURSO
   ========================================================= */


function obtenerHorarioLocalCursoPorDia(
    curso,
    diaCurso
) {

    const fecha =
        obtenerFechaParaDiaCurso(
            curso,
            diaCurso
        );


    return convertirClaseCurso(
        curso,
        fecha
    );

}



/* =========================================================
   TEXTO DEL HORARIO
   ========================================================= */


function obtenerTextoHorarioCurso(
    curso
) {

    const horario =
        obtenerHorarioLocalCurso(
            curso
        );


    return (
        `${horario.inicio} — ` +
        `${horario.fin}`
    );

}



/* =========================================================
   OFFSET PARA MOSTRAR
   ========================================================= */


function obtenerOffsetMinutosZona(
    fecha = new Date(),
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    return Math.round(
        obtenerOffsetZona(
            fecha,
            zonaHoraria
        ) /
        60000
    );

}



function formatearOffsetUTC(
    minutos
) {

    if (minutos === 0) {
        return "UTC";
    }


    const signo =
        minutos >= 0
            ? "+"
            : "-";


    const absoluto =
        Math.abs(
            minutos
        );


    const horas =
        Math.floor(
            absoluto / 60
        );


    const mins =
        absoluto % 60;


    return (
        `UTC${signo}` +
        `${String(horas).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}`
    );

}



/* =========================================================
   INFORMACIÓN ACTUAL
   ========================================================= */


function obtenerInformacionZonaActual() {

    const zona =
        UBICACION.zonaHoraria;


    const ciudad =
        obtenerNombreCiudadZona(
            zona
        );


    const offset =
        obtenerOffsetMinutosZona(
            new Date(),
            zona
        );


    return {

        zonaHoraria:
            zona,

        ciudad,

        nombre:
            obtenerNombreUbicacion(),

        offset,

        offsetTexto:
            formatearOffsetUTC(
                offset
            ),

        automatica:
            UBICACION.modoAutomatico

    };

}



/* =========================================================
   CAMBIAR ZONA HORARIA
   ========================================================= */


function cambiarZonaHoraria(
    zonaHoraria,
    guardar = true
) {

    if (
        !zonaHorariaValida(
            zonaHoraria
        )
    ) {

        console.warn(
            `[Ubicación] Zona horaria no válida: ${zonaHoraria}`
        );


        return false;

    }


    UBICACION.zonaHoraria =
        zonaHoraria;


    UBICACION.modoAutomatico =
        (
            zonaHoraria ===
            UBICACION.zonaDetectada
        );


    if (guardar) {

        guardarZonaHoraria();

    }


    sincronizarSelectorZona();


    actualizarHorariosTarjetas();


    actualizarIndicadoresZona();


    emitirCambioZonaHoraria();


    return true;

}



/* =========================================================
   VOLVER A DETECCIÓN AUTOMÁTICA
   ========================================================= */


function usarZonaHorariaAutomatica() {

    UBICACION.zonaDetectada =
        detectarZonaHoraria();


    UBICACION.zonaHoraria =
        UBICACION.zonaDetectada;


    UBICACION.modoAutomatico =
        true;


    try {

        localStorage.removeItem(
            CLAVE_ZONA_HORARIA
        );

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo limpiar la zona guardada.",
            error
        );

    }


    sincronizarSelectorZona();


    actualizarHorariosTarjetas();


    actualizarIndicadoresZona();


    emitirCambioZonaHoraria();

}



/* =========================================================
   EVENTO GLOBAL
   ========================================================= */


function emitirCambioZonaHoraria() {

    const informacion =
        obtenerInformacionZonaActual();


    window.dispatchEvent(

        new CustomEvent(
            "ppt:cambio-zona-horaria",
            {
                detail:
                    informacion
            }
        )

    );


    /*
     * Compatibilidad temporal con código anterior.
     */

    window.dispatchEvent(

        new CustomEvent(
            "ppt:cambio-pais",
            {
                detail: {
                    pais:
                        obtenerPaisActual()
                }
            }
        )

    );

}



/* =========================================================
   SELECTOR
   ========================================================= */


function crearEtiquetaZona(
    zona
) {

    const ciudad =
        obtenerNombreCiudadZona(
            zona
        );


    return (
        `${ciudad} · ${zona}`
    );

}



function cargarSelectorPaises() {

    /*
     * Conservamos el ID #country-select para no tener que
     * modificar todavía cursos.html.
     *
     * Sin embargo, desde ahora este selector representa
     * ZONAS HORARIAS y no países.
     */

    const selector =
        document.getElementById(
            "country-select"
        );


    if (!selector) {
        return;
    }


    const zonas =
        obtenerZonasHorariasDisponibles();


    /*
     * Aseguramos que la zona detectada aparezca aunque
     * el navegador no implemente supportedValuesOf().
     */

    const conjunto =
        new Set([
            UBICACION.zonaDetectada,
            UBICACION.zonaHoraria,
            ...zonas
        ]);


    const zonasOrdenadas =
        [...conjunto]
            .filter(
                zona =>
                    zonaHorariaValida(
                        zona
                    )
            )
            .sort(
                (a, b) =>
                    crearEtiquetaZona(a)
                        .localeCompare(
                            crearEtiquetaZona(b),
                            "es"
                        )
            );


    selector.innerHTML = `

        <option
            value="__AUTO__"
        >
            🌎 Automático · ${UBICACION.zonaDetectada}
        </option>

        ${
            zonasOrdenadas

                .map(
                    zona => `

                        <option
                            value="${zona}"
                        >
                            ${crearEtiquetaZona(zona)}
                        </option>

                    `
                )

                .join("")
        }

    `;


    sincronizarSelectorZona();


    /*
     * Evitamos registrar el listener más de una vez.
     */

    if (
        selector.dataset
            .zonaListener ===
        "true"
    ) {

        return;

    }


    selector.dataset
        .zonaListener =
        "true";


    selector.addEventListener(
        "change",
        () => {

            if (
                selector.value ===
                "__AUTO__"
            ) {

                usarZonaHorariaAutomatica();

                return;

            }


            cambiarZonaHoraria(
                selector.value
            );

        }
    );

}



/* =========================================================
   SINCRONIZAR SELECTOR
   ========================================================= */


function sincronizarSelectorZona() {

    const selector =
        document.getElementById(
            "country-select"
        );


    if (!selector) {
        return;
    }


    if (
        UBICACION.modoAutomatico
    ) {

        selector.value =
            "__AUTO__";

    } else {

        selector.value =
            UBICACION.zonaHoraria;

    }

}



/* =========================================================
   ACTUALIZAR TARJETAS
   ========================================================= */


function actualizarHorariosTarjetas() {

    if (
        typeof CURSOS ===
        "undefined"
    ) {

        actualizarIndicadoresZona();

        return;

    }


    CURSOS.forEach(curso => {

        const elementos =
            document.querySelectorAll(
                `[data-horario-curso="${curso.id}"]`
            );


        if (!elementos.length) {
            return;
        }


        const horario =
            obtenerHorarioLocalCurso(
                curso
            );


        elementos.forEach(
            elemento => {

                elemento.textContent =
                    `${horario.inicio} — ${horario.fin}`;

            }
        );

    });


    actualizarIndicadoresZona();

}



/* =========================================================
   INDICADORES
   ========================================================= */


function actualizarIndicadoresZona() {

    const info =
        obtenerInformacionZonaActual();


    document
        .querySelectorAll(
            "[data-pais-actual]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `🌎 ${info.nombre}`;

            }
        );


    document
        .querySelectorAll(
            "[data-zona-horaria]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.zonaHoraria;

            }
        );


    document
        .querySelectorAll(
            "[data-offset-zona]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.offsetTexto;

            }
        );


    document
        .querySelectorAll(
            "[data-zona-modo]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.automatica
                        ? "Detectada automáticamente"
                        : "Seleccionada manualmente";

            }
        );

}



/* =========================================================
   COMPATIBILIDAD CON FUNCIONES ANTERIORES
   ========================================================= */


function actualizarIndicadoresPais() {

    actualizarIndicadoresZona();

}



/*
 * cambiarPais() queda temporalmente disponible
 * para evitar errores si algún código antiguo todavía
 * intenta llamarla.
 *
 * Si recibe una zona IANA válida, la utilizamos.
 */

function cambiarPais(valor) {

    if (
        valor === "__AUTO__"
    ) {

        usarZonaHorariaAutomatica();

        return;

    }


    if (
        zonaHorariaValida(
            valor
        )
    ) {

        cambiarZonaHoraria(
            valor
        );

        return;

    }


    console.warn(
        `[Ubicación] "${valor}" ya no representa una zona horaria válida.`
    );

}



/* =========================================================
   DIAGNÓSTICO
   ========================================================= */


function mostrarDiagnosticoZona() {

    const info =
        obtenerInformacionZonaActual();


    console.group(
        "[Programación Para Todos] Zona horaria"
    );


    console.log(
        "Base oficial:",
        ZONA_HORARIA_BASE
    );


    console.log(
        "Detectada:",
        UBICACION.zonaDetectada
    );


    console.log(
        "Utilizada:",
        UBICACION.zonaHoraria
    );


    console.log(
        "Modo automático:",
        UBICACION.modoAutomatico
    );


    console.log(
        "Offset actual:",
        info.offsetTexto
    );


    console.groupEnd();

}



/* =========================================================
   INICIALIZACIÓN
   ========================================================= */


function inicializarUbicacion() {

    /*
     * 1. Detectamos la zona del dispositivo.
     * 2. Recuperamos una selección manual anterior,
     *    si existiera.
     */

    cargarZonaHoraria();


    /*
     * 3. Convertimos el antiguo selector de países
     *    en selector de zonas horarias.
     */

    cargarSelectorPaises();


    /*
     * 4. Actualizamos toda la interfaz.
     */

    actualizarIndicadoresZona();


    /*
     * 5. Las tarjetas pueden haber sido creadas
     *    antes que ubicacion.js.
     */

    actualizarHorariosTarjetas();


    /*
     * Información útil durante desarrollo.
     */

    console.info(
        `[Ubicación] Bolivia → ${UBICACION.zonaHoraria}` +
        (
            UBICACION.modoAutomatico
                ? " · automática"
                : " · manual"
        )
    );

}



/* =========================================================
   INICIO
   ========================================================= */


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarUbicacion
    );

} else {

    inicializarUbicacion();

}