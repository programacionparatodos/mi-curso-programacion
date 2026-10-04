"use strict";


/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Calendario académico internacional

   - Horarios oficiales definidos en Bolivia.
   - Conversión automática a la zona IANA del visitante.
   - Convierte día + fecha + hora.
   - Sin scroll horizontal.
   - Vista matriz en desktop.
   - Vista por días en móvil.
   ========================================================= */


/* =========================================================
   DÍAS
   ========================================================= */


const DIAS_CALENDARIO = [

    {
        id: "lunes",
        nombre: "LUN",
        completo: "Lunes"
    },

    {
        id: "martes",
        nombre: "MAR",
        completo: "Martes"
    },

    {
        id: "miercoles",
        nombre: "MIÉ",
        completo: "Miércoles"
    },

    {
        id: "jueves",
        nombre: "JUE",
        completo: "Jueves"
    },

    {
        id: "viernes",
        nombre: "VIE",
        completo: "Viernes"
    },

    {
        id: "sabado",
        nombre: "SÁB",
        completo: "Sábado"
    },

    {
        id: "domingo",
        nombre: "DOM",
        completo: "Domingo"
    }

];


let filtroCalendario = "todos";



/* =========================================================
   ESTILOS
   ========================================================= */


const ESTILOS_CALENDARIO = {

    pseint: {

        nombre: "PSeInt",
        icono: "bi-diagram-3",

        borde:
            "border-emerald-500/30",

        fondo:
            "bg-emerald-500/10",

        texto:
            "text-emerald-400",

        punto:
            "bg-emerald-400",

        hover:
            "hover:border-emerald-400/60 " +
            "hover:shadow-[0_0_28px_rgba(16,185,129,.12)]"

    },


    python: {

        nombre: "Python",
        icono: "bi-filetype-py",

        borde:
            "border-blue-500/30",

        fondo:
            "bg-blue-500/10",

        texto:
            "text-blue-400",

        punto:
            "bg-blue-400",

        hover:
            "hover:border-blue-400/60 " +
            "hover:shadow-[0_0_28px_rgba(59,130,246,.13)]"

    },


    java: {

        nombre: "Java",
        icono: "bi-cup-hot",

        borde:
            "border-orange-500/30",

        fondo:
            "bg-orange-500/10",

        texto:
            "text-orange-400",

        punto:
            "bg-orange-400",

        hover:
            "hover:border-orange-400/60 " +
            "hover:shadow-[0_0_28px_rgba(249,115,22,.13)]"

    },


    cpp: {

        nombre: "C++",
        icono: "bi-code-square",

        borde:
            "border-cyan-500/30",

        fondo:
            "bg-cyan-500/10",

        texto:
            "text-cyan-400",

        punto:
            "bg-cyan-400",

        hover:
            "hover:border-cyan-400/60 " +
            "hover:shadow-[0_0_28px_rgba(34,211,238,.13)]"

    }

};



/* =========================================================
   CURSOS
   ========================================================= */


function obtenerCursosCalendario() {

    if (
        typeof CURSOS ===
        "undefined"
    ) {

        return [];

    }


    if (
        filtroCalendario ===
        "todos"
    ) {

        return CURSOS;

    }


    return CURSOS.filter(
        curso =>
            curso.lenguaje ===
            filtroCalendario
    );

}



/* =========================================================
   ESTILO DE UN CURSO
   ========================================================= */


function obtenerEstiloCalendario(
    curso
) {

    return (
        ESTILOS_CALENDARIO[
            curso.lenguaje
        ] ||
        ESTILOS_CALENDARIO.cpp
    );

}



/* =========================================================
   FECHA REPRESENTATIVA DE CADA DÍA DEL CURSO
   ========================================================= */


function obtenerFechaRepresentativaCurso(
    curso,
    diaCurso
) {

    /*
     * ubicacion.js ya posee esta función.
     */

    if (
        typeof obtenerFechaParaDiaCurso ===
        "function"
    ) {

        return obtenerFechaParaDiaCurso(
            curso,
            diaCurso
        );

    }


    /*
     * Respaldo por si ubicacion.js todavía
     * no estuviera disponible.
     */

    return curso.fechaInicio;

}



/* =========================================================
   CONVERTIR UNA CLASE
   ========================================================= */


function obtenerClaseLocal(
    curso,
    diaBolivia
) {

    const fechaBolivia =
        obtenerFechaRepresentativaCurso(
            curso,
            diaBolivia
        );


    /*
     * NUEVO MOTOR INTERNACIONAL.
     */

    if (
        typeof convertirClaseCurso ===
        "function"
    ) {

        const conversion =
            convertirClaseCurso(
                curso,
                fechaBolivia
            );


        return {

            curso,

            fechaBolivia,

            diaBolivia,

            fechaLocal:
                conversion.fechaLocal,

            fechaFinLocal:
                conversion.fechaFinLocal,

            diaLocal:
                conversion.diaLocal,

            diaFinLocal:
                conversion.diaFinLocal,

            inicio:
                conversion.inicio,

            fin:
                conversion.fin,

            zonaHoraria:
                conversion.zonaHoraria

        };

    }


    /*
     * Respaldo Bolivia.
     */

    return {

        curso,

        fechaBolivia,

        diaBolivia,

        fechaLocal:
            fechaBolivia,

        fechaFinLocal:
            fechaBolivia,

        diaLocal:
            diaBolivia,

        diaFinLocal:
            diaBolivia,

        inicio:
            curso.horaInicio,

        fin:
            curso.horaFin,

        zonaHoraria:
            "America/La_Paz"

    };

}



/* =========================================================
   GENERAR CLASES SEMANALES LOCALES
   ========================================================= */


function obtenerClasesLocales(
    cursos
) {

    const clases = [];


    cursos.forEach(curso => {

        curso.dias.forEach(
            diaBolivia => {

                clases.push(
                    obtenerClaseLocal(
                        curso,
                        diaBolivia
                    )
                );

            }
        );

    });


    return clases;

}



/* =========================================================
   ORDENAR HORAS
   ========================================================= */


function horaAMinutos(hora) {

    if (!hora) {
        return 0;
    }


    const [
        horas,
        minutos
    ] =
        hora
            .split(":")
            .map(Number);


    return (
        horas * 60 +
        minutos
    );

}



/* =========================================================
   FRANJAS HORARIAS
   ========================================================= */


function obtenerFranjasHorarias(
    clases
) {

    const franjas =
        new Map();


    clases.forEach(clase => {

        const clave =
            `${clase.inicio}-${clase.fin}`;


        if (
            !franjas.has(
                clave
            )
        ) {

            franjas.set(
                clave,
                {
                    clave,

                    inicio:
                        clase.inicio,

                    fin:
                        clase.fin
                }
            );

        }

    });


    return [
        ...franjas.values()
    ].sort(
        (a, b) =>
            horaAMinutos(a.inicio) -
            horaAMinutos(b.inicio)
    );

}



/* =========================================================
   DÍAS VISIBLES
   ========================================================= */


function obtenerDiasVisibles(
    clases
) {

    return DIAS_CALENDARIO.filter(
        dia =>
            clases.some(
                clase =>
                    clase.diaLocal ===
                    dia.id
            )
    );

}



/* =========================================================
   CLASES DE UNA CELDA
   ========================================================= */


function obtenerClasesCelda(
    clases,
    dia,
    franja
) {

    return clases.filter(
        clase =>

            clase.diaLocal === dia &&

            clase.inicio ===
                franja.inicio &&

            clase.fin ===
                franja.fin
    );

}



/* =========================================================
   DETECTAR CAMBIO DE DÍA
   ========================================================= */


function claseCambioDeDia(
    clase
) {

    return (
        clase.diaBolivia !==
        clase.diaLocal
    );

}



/* =========================================================
   BLOQUE DE CURSO
   ========================================================= */


function crearBloqueCursoCalendario(
    clase
) {

    const curso =
        clase.curso;


    const estilo =
        obtenerEstiloCalendario(
            curso
        );


    const cambioDia =
        claseCambioDeDia(
            clase
        );


    return `

        <button
            type="button"

            data-filtro-curso="${curso.lenguaje}"

            title="${curso.nombre} · ${clase.inicio}–${clase.fin}"

            class="
                group/curso
                w-full
                min-w-0
                rounded-lg
                border
                ${estilo.borde}
                ${estilo.fondo}
                ${estilo.hover}
                px-2.5
                py-2.5
                text-left
                transition-all
                duration-300
                hover:-translate-y-0.5
            "
        >

            <div
                class="
                    flex
                    min-w-0
                    items-center
                    gap-2
                "
            >

                <span
                    class="
                        h-1.5
                        w-1.5
                        shrink-0
                        rounded-full
                        ${estilo.punto}
                    "
                ></span>


                <span
                    class="
                        min-w-0
                        truncate
                        text-[11px]
                        font-black
                        ${estilo.texto}
                    "
                >
                    ${curso.nombre}
                </span>

            </div>


            <div
                class="
                    mt-1.5
                    flex
                    items-center
                    gap-1
                    font-mono
                    text-[9px]
                    text-slate-500
                "
            >

                <i
                    class="
                        bi
                        bi-clock
                    "
                ></i>

                <span>
                    ${clase.inicio}–${clase.fin}
                </span>

            </div>


            ${
                cambioDia

                    ? `

                        <div
                            class="
                                mt-1.5
                                flex
                                items-center
                                gap-1
                                font-mono
                                text-[8px]
                                text-amber-500/70
                            "
                        >

                            <i
                                class="
                                    bi
                                    bi-globe-americas
                                "
                            ></i>

                            hora local

                        </div>

                    `

                    : ""
            }

        </button>

    `;

}



/* =========================================================
   CELDA
   ========================================================= */


function crearCeldaCalendario(
    clases
) {

    if (!clases.length) {

        return `

            <div
                class="
                    flex
                    min-h-[66px]
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-dashed
                    border-slate-800/50
                    bg-slate-950/20
                "
            >

                <span
                    class="
                        text-[10px]
                        text-slate-800
                    "
                >
                    —
                </span>

            </div>

        `;

    }


    return `

        <div
            class="
                flex
                min-h-[66px]
                min-w-0
                flex-col
                gap-1.5
            "
        >

            ${
                clases
                    .map(
                        crearBloqueCursoCalendario
                    )
                    .join("")
            }

        </div>

    `;

}



/* =========================================================
   FILTROS
   ========================================================= */


function crearFiltrosCalendario() {

    const lenguajes = [

        {
            id: "todos",
            nombre: "Todos",
            icono: "bi-grid-3x3-gap"
        },

        {
            id: "pseint",
            nombre: "PSeInt",
            icono: "bi-diagram-3"
        },

        {
            id: "python",
            nombre: "Python",
            icono: "bi-filetype-py"
        },

        {
            id: "java",
            nombre: "Java",
            icono: "bi-cup-hot"
        },

        {
            id: "cpp",
            nombre: "C++",
            icono: "bi-code-square"
        }

    ];


    return lenguajes

        .filter(
            item =>

                item.id ===
                    "todos" ||

                CURSOS.some(
                    curso =>
                        curso.lenguaje ===
                        item.id
                )
        )

        .map(item => {

            const activo =
                filtroCalendario ===
                item.id;


            return `

                <button
                    type="button"

                    data-calendario-filtro="${item.id}"

                    class="
                        inline-flex
                        shrink-0
                        items-center
                        justify-center
                        gap-1.5
                        whitespace-nowrap
                        rounded-lg
                        border
                        px-2.5
                        py-2
                        font-mono
                        text-[9px]
                        font-bold
                        transition-all
                        duration-300

                        ${
                            activo

                                ? `
                                    border-amber-500/30
                                    bg-amber-500/10
                                    text-amber-400
                                    shadow-[0_0_18px_rgba(245,158,11,.08)]
                                `

                                : `
                                    border-slate-800
                                    bg-slate-950/50
                                    text-slate-500
                                    hover:border-slate-700
                                    hover:text-slate-300
                                `
                        }
                    "
                >

                    <i
                        class="
                            bi
                            ${item.icono}
                        "
                    ></i>

                    ${item.nombre}

                </button>

            `;

        })

        .join("");

}



/* =========================================================
   CALENDARIO VACÍO
   ========================================================= */


function crearCalendarioVacio() {

    return `

        <div
            class="
                rounded-2xl
                border
                border-dashed
                border-slate-800
                px-6
                py-12
                text-center
            "
        >

            <i
                class="
                    bi
                    bi-calendar2-week
                    text-3xl
                    text-slate-700
                "
            ></i>


            <p
                class="
                    mt-3
                    text-sm
                    font-bold
                    text-slate-400
                "
            >
                No hay horarios para mostrar.
            </p>

        </div>

    `;

}



/* =========================================================
   MATRIZ DESKTOP
   ========================================================= */


function crearMatrizEscritorio(
    clases
) {

    if (!clases.length) {
        return crearCalendarioVacio();
    }


    const dias =
        obtenerDiasVisibles(
            clases
        );


    const franjas =
        obtenerFranjasHorarias(
            clases
        );


    /*
     * Todas las columnas comparten el ancho
     * disponible. No existe min-width que
     * provoque scroll horizontal.
     */

    const columnas =
        `88px repeat(${dias.length}, minmax(0, 1fr))`;


    const encabezado = `

        <div
            class="
                flex
                min-w-0
                items-center
                border-r
                border-slate-800
                bg-slate-950/90
                px-2
                py-3
                font-mono
                text-[8px]
                font-bold
                tracking-widest
                text-slate-600
            "
        >
            HORARIO
        </div>


        ${
            dias

                .map(
                    dia => `

                        <div
                            class="
                                flex
                                min-w-0
                                items-center
                                justify-center
                                border-r
                                border-slate-800/60
                                bg-slate-950/70
                                px-1
                                py-3
                                text-center
                            "
                        >

                            <div
                                class="
                                    min-w-0
                                "
                            >

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-black
                                        tracking-wider
                                        text-slate-300
                                    "
                                >
                                    ${dia.nombre}
                                </p>


                                <p
                                    class="
                                        mt-0.5
                                        hidden
                                        truncate
                                        text-[8px]
                                        text-slate-700
                                        xl:block
                                    "
                                >
                                    ${dia.completo}
                                </p>

                            </div>

                        </div>

                    `
                )

                .join("")
        }

    `;


    const filas =
        franjas

            .map(
                franja => `

                    <!-- Hora -->

                    <div
                        class="
                            flex
                            min-h-[84px]
                            min-w-0
                            items-center
                            border-r
                            border-t
                            border-slate-800
                            bg-slate-950/90
                            px-2
                            py-3
                        "
                    >

                        <div
                            class="
                                min-w-0
                            "
                        >

                            <p
                                class="
                                    font-mono
                                    text-[10px]
                                    font-black
                                    text-slate-300
                                "
                            >
                                ${franja.inicio}
                            </p>


                            <p
                                class="
                                    mt-1
                                    font-mono
                                    text-[8px]
                                    text-slate-700
                                "
                            >
                                ${franja.fin}
                            </p>

                        </div>

                    </div>


                    ${
                        dias

                            .map(dia => {

                                const clasesCelda =
                                    obtenerClasesCelda(
                                        clases,
                                        dia.id,
                                        franja
                                    );


                                return `

                                    <div
                                        class="
                                            min-w-0
                                            border-r
                                            border-t
                                            border-slate-800/60
                                            bg-slate-950/20
                                            p-1.5
                                        "
                                    >

                                        ${
                                            crearCeldaCalendario(
                                                clasesCelda
                                            )
                                        }

                                    </div>

                                `;

                            })

                            .join("")
                    }

                `
            )

            .join("");


    return `

        <div
            class="
                hidden
                w-full
                overflow-hidden
                rounded-xl
                border
                border-slate-800
                bg-slate-950/30
                md:block
            "
        >

            <div
                class="
                    grid
                    w-full
                    min-w-0
                "

                style="
                    grid-template-columns:
                        ${columnas};
                "
            >

                ${encabezado}

                ${filas}

            </div>

        </div>

    `;

}



/* =========================================================
   VISTA MÓVIL
   ========================================================= */


function crearVistaMovil(
    clases
) {

    if (!clases.length) {
        return crearCalendarioVacio();
    }


    const dias =
        obtenerDiasVisibles(
            clases
        );


    return `

        <div
            class="
                space-y-3
                md:hidden
            "
        >

            ${
                dias

                    .map(dia => {

                        const clasesDia =
                            clases

                                .filter(
                                    clase =>
                                        clase.diaLocal ===
                                        dia.id
                                )

                                .sort(
                                    (a, b) =>
                                        horaAMinutos(
                                            a.inicio
                                        ) -
                                        horaAMinutos(
                                            b.inicio
                                        )
                                );


                        if (
                            !clasesDia.length
                        ) {

                            return "";

                        }


                        return `

                            <div
                                class="
                                    overflow-hidden
                                    rounded-xl
                                    border
                                    border-slate-800
                                    bg-slate-950/30
                                "
                            >

                                <!-- Día -->

                                <div
                                    class="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-slate-800/70
                                        bg-slate-950/70
                                        px-4
                                        py-3
                                    "
                                >

                                    <div>

                                        <p
                                            class="
                                                font-mono
                                                text-[10px]
                                                font-black
                                                tracking-widest
                                                text-amber-400
                                            "
                                        >
                                            ${dia.nombre}
                                        </p>


                                        <p
                                            class="
                                                mt-0.5
                                                text-xs
                                                font-bold
                                                text-slate-300
                                            "
                                        >
                                            ${dia.completo}
                                        </p>

                                    </div>


                                    <span
                                        class="
                                            font-mono
                                            text-[9px]
                                            text-slate-600
                                        "
                                    >

                                        ${clasesDia.length}

                                        ${
                                            clasesDia.length === 1
                                                ? "CLASE"
                                                : "CLASES"
                                        }

                                    </span>

                                </div>


                                <!-- Clases -->

                                <div
                                    class="
                                        space-y-2
                                        p-3
                                    "
                                >

                                    ${
                                        clasesDia

                                            .map(
                                                clase => {

                                                    const curso =
                                                        clase.curso;


                                                    const estilo =
                                                        obtenerEstiloCalendario(
                                                            curso
                                                        );


                                                    return `

                                                        <button
                                                            type="button"

                                                            data-filtro-curso="${curso.lenguaje}"

                                                            class="
                                                                flex
                                                                w-full
                                                                min-w-0
                                                                items-center
                                                                justify-between
                                                                gap-3
                                                                rounded-lg
                                                                border
                                                                ${estilo.borde}
                                                                ${estilo.fondo}
                                                                ${estilo.hover}
                                                                px-3
                                                                py-3
                                                                text-left
                                                                transition-all
                                                                duration-300
                                                            "
                                                        >

                                                            <div
                                                                class="
                                                                    flex
                                                                    min-w-0
                                                                    items-center
                                                                    gap-2.5
                                                                "
                                                            >

                                                                <span
                                                                    class="
                                                                        h-2
                                                                        w-2
                                                                        shrink-0
                                                                        rounded-full
                                                                        ${estilo.punto}
                                                                    "
                                                                ></span>


                                                                <div
                                                                    class="
                                                                        min-w-0
                                                                    "
                                                                >

                                                                    <p
                                                                        class="
                                                                            truncate
                                                                            text-xs
                                                                            font-black
                                                                            ${estilo.texto}
                                                                        "
                                                                    >
                                                                        ${curso.nombre}
                                                                    </p>


                                                                    <p
                                                                        class="
                                                                            mt-0.5
                                                                            truncate
                                                                            text-[9px]
                                                                            text-slate-600
                                                                        "
                                                                    >
                                                                        ${curso.subtitulo}
                                                                    </p>

                                                                </div>

                                                            </div>


                                                            <div
                                                                class="
                                                                    shrink-0
                                                                    text-right
                                                                "
                                                            >

                                                                <p
                                                                    class="
                                                                        font-mono
                                                                        text-[10px]
                                                                        font-bold
                                                                        text-slate-300
                                                                    "
                                                                >
                                                                    ${clase.inicio}
                                                                </p>


                                                                <p
                                                                    class="
                                                                        font-mono
                                                                        text-[8px]
                                                                        text-slate-600
                                                                    "
                                                                >
                                                                    ${clase.fin}
                                                                </p>

                                                            </div>

                                                        </button>

                                                    `;

                                                }
                                            )

                                            .join("")
                                    }

                                </div>

                            </div>

                        `;

                    })

                    .join("")
            }

        </div>

    `;

}



/* =========================================================
   MATRIZ RESPONSIVE
   ========================================================= */


function crearMatrizCalendario(
    clases
) {

    if (!clases.length) {
        return crearCalendarioVacio();
    }


    return `

        ${crearMatrizEscritorio(clases)}

        ${crearVistaMovil(clases)}

    `;

}



/* =========================================================
   INFORMACIÓN DE ZONA HORARIA
   ========================================================= */


function obtenerInformacionCalendario() {

    if (
        typeof obtenerInformacionZonaActual ===
        "function"
    ) {

        return obtenerInformacionZonaActual();

    }


    let zonaHoraria =
        "America/La_Paz";


    try {

        zonaHoraria =
            Intl
                .DateTimeFormat()
                .resolvedOptions()
                .timeZone ||
            zonaHoraria;

    } catch (error) {

        console.warn(
            "[Calendario] No fue posible detectar la zona.",
            error
        );

    }


    return {

        zonaHoraria,

        ciudad:
            "Tu ubicación",

        nombre:
            "Tu ubicación",

        offsetTexto:
            "",

        automatica:
            true

    };

}



/* =========================================================
   CONTENEDOR COMPLETO
   ========================================================= */


function crearCalendarioAcademico() {

    const cursos =
        obtenerCursosCalendario();


    const clases =
        obtenerClasesLocales(
            cursos
        );


    const ubicacion =
        obtenerInformacionCalendario();


    return `

        <section
            id="horario-academico"

            class="
                mx-auto
                max-w-7xl
                px-4
                pb-16
                sm:px-6
                lg:px-8
            "
        >


            <!-- TÍTULO -->

            <div
                class="
                    mb-8
                "
            >

                <div
                    class="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <span
                        class="
                            ppt-section-label
                        "
                    >
                        02 // HORARIO ACADÉMICO
                    </span>


                    <div
                        class="
                            ppt-section-line
                        "
                    ></div>

                </div>



                <div
                    class="
                        mt-4
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >


                    <div>

                        <h2
                            class="
                                text-2xl
                                font-black
                                tracking-tight
                                text-slate-100
                                sm:text-3xl
                            "
                        >
                            Matriz semanal de clases
                        </h2>


                        <p
                            class="
                                mt-2
                                max-w-2xl
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Los días y horarios se muestran
                            automáticamente en tu zona horaria.
                        </p>

                    </div>



                    <!-- Zona actual -->

                    <div
                        class="
                            w-fit
                            max-w-full
                            rounded-xl
                            border
                            border-slate-800
                            bg-slate-950/60
                            px-4
                            py-3
                        "
                    >

                        <p
                            class="
                                font-mono
                                text-[9px]
                                font-bold
                                tracking-widest
                                text-slate-600
                            "
                        >
                            HORARIOS MOSTRADOS PARA
                        </p>


                        <div
                            class="
                                mt-1
                                flex
                                items-center
                                gap-2
                                text-sm
                                font-bold
                                text-slate-200
                            "
                        >

                            <i
                                class="
                                    bi
                                    bi-globe-americas
                                    text-amber-400
                                "
                            ></i>


                            <span
                                data-pais-actual
                            >
                                🌎 ${ubicacion.nombre}
                            </span>

                        </div>


                        <div
                            class="
                                mt-1
                                flex
                                flex-wrap
                                items-center
                                gap-x-2
                                gap-y-1
                                font-mono
                                text-[9px]
                                text-slate-600
                            "
                        >

                            <span
                                data-zona-horaria
                            >
                                ${ubicacion.zonaHoraria}
                            </span>


                            ${
                                ubicacion.offsetTexto

                                    ? `

                                        <span>
                                            ·
                                        </span>

                                        <span
                                            data-offset-zona
                                        >
                                            ${ubicacion.offsetTexto}
                                        </span>

                                    `

                                    : ""
                            }

                        </div>

                    </div>

                </div>

            </div>



            <!-- PANEL -->

            <div
                class="
                    ppt-card
                    overflow-hidden
                "
            >


                <!-- CABECERA -->

                <div
                    class="
                        border-b
                        border-slate-800/80
                        bg-slate-950/60
                        px-4
                        py-4
                        sm:px-5
                    "
                >

                    <div
                        class="
                            flex
                            flex-col
                            gap-4
                            xl:flex-row
                            xl:items-center
                            xl:justify-between
                        "
                    >


                        <div>

                            <div
                                class="
                                    flex
                                    items-center
                                    gap-2
                                    font-mono
                                    text-xs
                                    text-slate-400
                                "
                            >

                                <span
                                    class="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-emerald-400
                                        shadow-[0_0_10px_rgba(52,211,153,.7)]
                                    "
                                ></span>

                                schedule.matrix

                            </div>


                            <p
                                class="
                                    mt-1
                                    text-[10px]
                                    text-slate-600
                                "
                            >
                                Base oficial:
                                🇧🇴 Bolivia ·
                                America/La_Paz
                            </p>

                        </div>



                        <!-- FILTROS -->

                        <div
                            id="calendario-filtros"

                            class="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            ${crearFiltrosCalendario()}

                        </div>

                    </div>

                </div>



                <!-- MATRIZ -->

                <div
                    id="calendario-matriz"

                    class="
                        p-3
                        sm:p-5
                    "
                >

                    ${
                        crearMatrizCalendario(
                            clases
                        )
                    }

                </div>



                <!-- PIE -->

                <div
                    class="
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-slate-800/70
                        bg-slate-950/30
                        px-5
                        py-4
                        text-[10px]
                        text-slate-600
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <span>

                        <i
                            class="
                                bi
                                bi-info-circle
                                mr-1
                            "
                        ></i>

                        Conversión automática desde
                        la hora oficial de Bolivia.

                    </span>


                    <span
                        class="
                            font-mono
                        "
                    >

                        <span
                            data-zona-modo
                        >
                            ${
                                ubicacion.automatica
                                    ? "Detectada automáticamente"
                                    : "Seleccionada manualmente"
                            }
                        </span>

                        ·

                        <span
                            data-zona-horaria
                        >
                            ${ubicacion.zonaHoraria}
                        </span>

                    </span>

                </div>

            </div>

        </section>

    `;

}



/* =========================================================
   RENDERIZAR
   ========================================================= */


function renderizarCalendario() {

    const catalogo =
        document.querySelector(
            'section[aria-labelledby="catalogo-title"]'
        );


    if (!catalogo) {
        return;
    }


    const anterior =
        document.getElementById(
            "horario-academico"
        );


    if (anterior) {

        anterior.remove();

    }


    catalogo.insertAdjacentHTML(
        "afterend",
        crearCalendarioAcademico()
    );


    prepararEventosCalendario();

}



/* =========================================================
   EVENTOS
   ========================================================= */


function prepararEventosCalendario() {

    document
        .querySelectorAll(
            "[data-calendario-filtro]"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    filtroCalendario =
                        boton.dataset
                            .calendarioFiltro;


                    renderizarCalendario();

                }
            );

        });



    document
        .querySelectorAll(
            "[data-filtro-curso]"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                () => {

                    filtroCalendario =
                        boton.dataset
                            .filtroCurso;


                    renderizarCalendario();

                }
            );

        });

}



/* =========================================================
   CAMBIO DE ZONA HORARIA
   ========================================================= */


window.addEventListener(
    "ppt:cambio-zona-horaria",
    () => {

        renderizarCalendario();

    }
);



/*
 * Compatibilidad temporal con el antiguo
 * sistema basado en países.
 *
 * ubicacion.js emite ambos eventos actualmente,
 * por lo que evitamos renderizar dos veces seguidas.
 */

let temporizadorCambioPais =
    null;


window.addEventListener(
    "ppt:cambio-pais",
    () => {

        clearTimeout(
            temporizadorCambioPais
        );


        temporizadorCambioPais =
            setTimeout(
                () => {

                    renderizarCalendario();

                },
                20
            );

    }
);



/* =========================================================
   INICIO
   ========================================================= */


function inicializarCalendario() {

    renderizarCalendario();

}



if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarCalendario
    );

} else {

    inicializarCalendario();

}