"use strict";


/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Motor y renderizado de cursos
   ========================================================= */

const ESTADOS_CURSO = Object.freeze({
    PROXIMO: "proximo",
    DISPONIBLE: "disponible",
    INICIADO: "iniciado",
    OCULTO: "oculto"
});


const WHATSAPP_CURSO = "59175426858";



/* =========================================================
   FECHAS
   ========================================================= */

function separarFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO
        .split("-")
        .map(Number);

    return {
        anio,
        mes,
        dia
    };
}


function fechaANumero(fechaISO) {
    const {
        anio,
        mes,
        dia
    } = separarFecha(fechaISO);

    return Date.UTC(
        anio,
        mes - 1,
        dia
    );
}


function diferenciaDias(inicio, fin) {
    return Math.round(
        (
            fechaANumero(fin) -
            fechaANumero(inicio)
        ) / 86400000
    );
}


function obtenerFechaActualCurso() {
    const zona =
        CONFIG_CURSOS.zonaHorariaBase ||
        "America/La_Paz";

    const partes =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: zona,
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).formatToParts(new Date());

    const datos = {};

    partes.forEach(parte => {
        if (parte.type !== "literal") {
            datos[parte.type] =
                parte.value;
        }
    });

    return (
        `${datos.year}-` +
        `${datos.month}-` +
        `${datos.day}`
    );
}


function formatearFecha(fechaISO) {
    const {
        anio,
        mes,
        dia
    } = separarFecha(fechaISO);

    return new Intl.DateTimeFormat(
        "es-BO",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(
        new Date(
            anio,
            mes - 1,
            dia
        )
    );
}



/* =========================================================
   ESTADOS
   ========================================================= */

function obtenerEstadoCurso(
    curso,
    fechaActual = null
) {
    const hoy =
        fechaActual ||
        obtenerFechaActualCurso();

    const diasHastaInicio =
        diferenciaDias(
            hoy,
            curso.fechaInicio
        );


    /*
     * Faltan más de 10 días.
     */
    if (
        diasHastaInicio >
        CONFIG_CURSOS.diasInscripcion
    ) {
        return ESTADOS_CURSO.PROXIMO;
    }


    /*
     * Dentro del período de inscripción
     * incluyendo el mismo día de inicio.
     */
    if (diasHastaInicio >= 0) {
        return ESTADOS_CURSO.DISPONIBLE;
    }


    /*
     * Curso iniciado.
     *
     * NOTA:
     * Esta lógica se modificará posteriormente
     * para mantener visible el curso mientras
     * continúen sus clases.
     */
    const diasDesdeInicio =
        diferenciaDias(
            curso.fechaInicio,
            hoy
        );

    if (
        diasDesdeInicio >= 1 &&
        diasDesdeInicio <=
            CONFIG_CURSOS.diasVisibleComoIniciado
    ) {
        return ESTADOS_CURSO.INICIADO;
    }


    return ESTADOS_CURSO.OCULTO;
}


function obtenerCursosConEstado(
    fechaActual = null
) {
    return CURSOS.map(curso => ({
        ...curso,

        estado:
            obtenerEstadoCurso(
                curso,
                fechaActual
            )
    }));
}



/* =========================================================
   PRESENTACIÓN
   ========================================================= */

const ESTILOS_LENGUAJE = {

    pseint: {
        texto:
            "text-emerald-400",

        fondo:
            "bg-emerald-500/10",

        gradiente:
            "from-emerald-400 via-emerald-500 to-cyan-400",

        glow:
            "rgba(16,185,129,.48)",

        glowSuave:
            "rgba(16,185,129,.16)"
    },


    python: {
        texto:
            "text-blue-400",

        fondo:
            "bg-blue-500/10",

        gradiente:
            "from-blue-500 via-cyan-400 to-amber-400",

        glow:
            "rgba(59,130,246,.50)",

        glowSuave:
            "rgba(59,130,246,.17)"
    },


    java: {
        texto:
            "text-orange-400",

        fondo:
            "bg-orange-500/10",

        gradiente:
            "from-orange-500 via-red-500 to-amber-400",

        glow:
            "rgba(249,115,22,.50)",

        glowSuave:
            "rgba(249,115,22,.17)"
    },


    cpp: {
        texto:
            "text-cyan-400",

        fondo:
            "bg-cyan-500/10",

        gradiente:
            "from-cyan-400 via-blue-500 to-indigo-500",

        glow:
            "rgba(34,211,238,.50)",

        glowSuave:
            "rgba(34,211,238,.17)"
    }

};


function obtenerEstilo(curso) {
    return (
        ESTILOS_LENGUAJE[
            curso.lenguaje
        ] ||
        ESTILOS_LENGUAJE.cpp
    );
}


function formatearDias(dias) {
    const nombres = {
        lunes: "Lun",
        martes: "Mar",
        miercoles: "Mié",
        jueves: "Jue",
        viernes: "Vie",
        sabado: "Sáb",
        domingo: "Dom"
    };

    return dias
        .map(
            dia =>
                nombres[dia] ||
                dia
        )
        .join(" · ");
}



/* =========================================================
   ETIQUETAS DE ESTADO
   ========================================================= */

function obtenerEtiquetaEstado(estado) {

    switch (estado) {

        case ESTADOS_CURSO.DISPONIBLE:

            return `
                <span
                    class="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-emerald-500/20
                        bg-emerald-500/10
                        px-2.5
                        py-1
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-wider
                        text-emerald-400
                    "
                >
                    <span
                        class="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-emerald-400
                        "
                    ></span>

                    INSCRIPCIONES ABIERTAS
                </span>
            `;


        case ESTADOS_CURSO.PROXIMO:

            return `
                <span
                    class="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-cyan-500/20
                        bg-cyan-500/10
                        px-2.5
                        py-1
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-wider
                        text-cyan-400
                    "
                >
                    <i
                        class="
                            bi
                            bi-clock
                        "
                    ></i>

                    PRÓXIMAMENTE
                </span>
            `;


        case ESTADOS_CURSO.INICIADO:

            return `
                <span
                    class="
                        inline-flex
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-rose-500/20
                        bg-rose-500/10
                        px-2.5
                        py-1
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-wider
                        text-rose-400
                    "
                >

                    <span
                        class="
                            relative
                            flex
                            h-2
                            w-2
                        "
                    >

                        <span
                            class="
                                absolute
                                inline-flex
                                h-full
                                w-full
                                animate-ping
                                rounded-full
                                bg-rose-400
                                opacity-60
                            "
                        ></span>

                        <span
                            class="
                                relative
                                h-2
                                w-2
                                rounded-full
                                bg-rose-500
                            "
                        ></span>

                    </span>

                    EN CURSO
                </span>
            `;
    }


    return "";
}



/* =========================================================
   HORARIO LOCAL
   ========================================================= */

function obtenerHorarioCursoParaTarjeta(curso) {

    /*
     * Si ubicacion.js está disponible,
     * usamos el horario convertido.
     */
    if (
        typeof obtenerHorarioLocalCurso ===
        "function"
    ) {
        return obtenerHorarioLocalCurso(
            curso
        );
    }


    /*
     * Respaldo:
     * horario oficial Bolivia.
     */
    return {
        inicio: curso.horaInicio,
        fin: curso.horaFin
    };
}



/* =========================================================
   TARJETA
   ========================================================= */

function crearTarjetaCurso(curso) {

    const estilo =
        obtenerEstilo(curso);


    const horario =
        obtenerHorarioCursoParaTarjeta(
            curso
        );


    const mensaje =
        encodeURIComponent(
            `Hola, deseo información sobre el curso de ${curso.nombre} - ${curso.subtitulo}.`
        );


    const whatsapp =
        `https://api.whatsapp.com/send?phone=${WHATSAPP_CURSO}&text=${mensaje}`;


    const puedeInscribirse =
        curso.estado ===
        ESTADOS_CURSO.DISPONIBLE;


    return `

        <article
            class="
                course-card
                group
                relative
                h-full
                rounded-2xl
                transition-all
                duration-500
                ease-out
                hover:-translate-y-2
            "

            style="
                --course-glow:
                    ${estilo.glow};

                --course-soft:
                    ${estilo.glowSuave};
            "
        >


            <!-- ==========================================
                 HALO EXTERIOR
                 ========================================== -->

            <div
                class="
                    pointer-events-none
                    absolute
                    -inset-3
                    rounded-[24px]
                    opacity-0
                    blur-2xl
                    transition-all
                    duration-500
                    group-hover:opacity-70
                "

                style="
                    background:
                        var(--course-glow);
                "
            ></div>



            <!-- ==========================================
                 CONTENEDOR DEL BORDE
                 ========================================== -->

            <div
                class="
                    relative
                    h-full
                    overflow-hidden
                    rounded-2xl
                    bg-gradient-to-br
                    ${estilo.gradiente}
                    p-[1px]
                    transition-all
                    duration-500
                    group-hover:p-[2px]
                "
            >


                <!-- ======================================
                     TARJETA INTERIOR
                     ====================================== -->

                <div
                    class="
                        relative
                        flex
                        h-full
                        flex-col
                        overflow-hidden
                        rounded-[15px]
                        bg-slate-950
                    "
                >


                    <!-- ==================================
                         ILUMINACIÓN INTERIOR COMPLETA
                         ================================== -->

                    <div
                        class="
                            pointer-events-none
                            absolute
                            inset-0
                            opacity-0
                            transition-opacity
                            duration-500
                            group-hover:opacity-100
                        "

                        style="
                            background:
                                radial-gradient(
                                    circle at 82% 18%,
                                    var(--course-soft),
                                    transparent 36%
                                ),
                                radial-gradient(
                                    circle at 10% 90%,
                                    var(--course-soft),
                                    transparent 45%
                                );
                        "
                    ></div>



                    <!-- Luz superior -->

                    <div
                        class="
                            pointer-events-none
                            absolute
                            left-[8%]
                            right-[8%]
                            top-0
                            z-20
                            h-px
                            opacity-0
                            blur-[1px]
                            transition-opacity
                            duration-500
                            group-hover:opacity-100
                        "

                        style="
                            background:
                                var(--course-glow);
                        "
                    ></div>



                    <!-- ==================================
                         BARRA TERMINAL
                         ================================== -->

                    <div
                        class="
                            relative
                            z-10
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-800/70
                            bg-slate-950/80
                            px-4
                            py-3
                            backdrop-blur
                        "
                    >

                        <div
                            class="
                                flex
                                gap-1.5
                            "
                        >

                            <span
                                class="
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    bg-rose-500
                                "
                            ></span>

                            <span
                                class="
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    bg-amber-500
                                "
                            ></span>

                            <span
                                class="
                                    h-2.5
                                    w-2.5
                                    rounded-full
                                    bg-emerald-500
                                "
                            ></span>

                        </div>


                        <span
                            class="
                                font-mono
                                text-[10px]
                                text-slate-600
                            "
                        >
                            ${curso.lenguaje}.course
                        </span>

                    </div>



                    <!-- ==================================
                         CONTENIDO
                         ================================== -->

                    <div
                        class="
                            relative
                            z-10
                            flex
                            flex-1
                            flex-col
                            p-5
                            sm:p-6
                        "
                    >


                        <!-- ==============================
                             HERO
                             ============================== -->

                        <div
                            class="
                                grid
                                items-center
                                gap-3
                                sm:grid-cols-[minmax(0,1fr)_190px]
                                sm:gap-5
                            "
                        >


                            <!-- Texto -->

                            <div
                                class="
                                    min-w-0
                                "
                            >

                                ${
                                    obtenerEtiquetaEstado(
                                        curso.estado
                                    )
                                }


                                <h3
                                    class="
                                        mt-4
                                        text-2xl
                                        font-black
                                        tracking-tight
                                        text-slate-100
                                        transition-colors
                                        duration-300
                                        group-hover:text-white
                                    "
                                >
                                    ${curso.nombre}
                                </h3>


                                <p
                                    class="
                                        mt-1
                                        text-sm
                                        font-bold
                                        ${estilo.texto}
                                    "
                                >
                                    ${curso.subtitulo}
                                </p>


                                <p
                                    class="
                                        mt-4
                                        text-sm
                                        leading-6
                                        text-slate-500
                                        transition-colors
                                        duration-300
                                        group-hover:text-slate-400
                                    "
                                >
                                    ${curso.descripcion}
                                </p>

                            </div>



                            <!-- ==========================
                                 IMAGEN QUIRCODE
                                 ========================== -->

                            <div
                                class="
                                    relative
                                    mx-auto
                                    flex
                                    h-40
                                    w-40
                                    shrink-0
                                    items-center
                                    justify-center
                                    sm:h-48
                                    sm:w-48
                                "
                            >


                                <!-- Halo de la imagen -->

                                <div
                                    class="
                                        absolute
                                        inset-6
                                        rounded-full
                                        opacity-25
                                        blur-3xl
                                        transition-all
                                        duration-500
                                        group-hover:scale-125
                                        group-hover:opacity-80
                                    "

                                    style="
                                        background:
                                            var(--course-glow);
                                    "
                                ></div>


                                <!-- Imagen -->

                                <img
                                    src="${curso.imagen}"

                                    alt="QuirCode - ${curso.nombre}"

                                    loading="lazy"

                                    class="
                                        relative
                                        z-10
                                        h-full
                                        w-full
                                        object-contain
                                        drop-shadow-2xl
                                        transition-all
                                        duration-500
                                        ease-out
                                        group-hover:-translate-y-2
                                        group-hover:scale-110
                                    "

                                    onerror="
                                        console.warn(
                                            'No se pudo cargar:',
                                            this.src
                                        );

                                        this.style.display='none';
                                    "
                                >

                            </div>

                        </div>



                        <!-- ==============================
                             DATOS DEL CURSO
                             ============================== -->

                        <div
                            class="
                                mt-6
                                grid
                                grid-cols-2
                                gap-x-4
                                gap-y-5
                                border-y
                                border-slate-800/70
                                py-5
                                transition-colors
                                duration-500
                                group-hover:border-slate-700/80
                            "
                        >


                            <!-- Inicio -->

                            <div>

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    INICIO
                                </p>


                                <p
                                    class="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    "
                                >
                                    ${
                                        formatearFecha(
                                            curso.fechaInicio
                                        )
                                    }
                                </p>

                            </div>



                            <!-- Horario -->

                            <div>

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    HORARIO
                                </p>


                                <p
                                    data-horario-curso="${curso.id}"

                                    class="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    "
                                >
                                    ${horario.inicio}
                                    —
                                    ${horario.fin}
                                </p>

                            </div>



                            <!-- Días -->

                            <div>

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    DÍAS
                                </p>


                                <p
                                    class="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    "
                                >
                                    ${
                                        formatearDias(
                                            curso.dias
                                        )
                                    }
                                </p>

                            </div>



                            <!-- Duración -->

                            <div>

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    DURACIÓN
                                </p>


                                <p
                                    class="
                                        mt-1
                                        text-xs
                                        font-semibold
                                        text-slate-300
                                    "
                                >
                                    ${curso.clases}
                                    clases ·
                                    ${curso.horasAcademicas}
                                    h
                                </p>

                            </div>

                        </div>



                        <!-- ==============================
                             PRECIO
                             ============================== -->

                        <div
                            class="
                                mt-5
                                flex
                                items-end
                                justify-between
                                gap-4
                            "
                        >


                            <div>

                                <p
                                    class="
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        tracking-widest
                                        text-slate-600
                                    "
                                >
                                    INVERSIÓN
                                </p>


                                <div
                                    class="
                                        mt-1
                                        flex
                                        flex-wrap
                                        items-baseline
                                        gap-2
                                    "
                                >

                                    <span
                                        class="
                                            text-2xl
                                            font-black
                                            ${estilo.texto}
                                        "
                                    >
                                        Bs
                                        ${curso.precio.BOB}
                                    </span>


                                    <span
                                        class="
                                            text-xs
                                            text-slate-600
                                        "
                                    >
                                        /
                                        $${curso.precio.USD}
                                        USD
                                    </span>

                                </div>

                            </div>



                            <div
                                class="
                                    hidden
                                    font-mono
                                    text-[10px]
                                    text-slate-700
                                    sm:block
                                "
                            >
                                ${
                                    curso.clases
                                        .toString()
                                        .padStart(
                                            2,
                                            "0"
                                        )
                                }
                                CLASES
                            </div>

                        </div>



                        <!-- ==============================
                             BOTONES
                             ============================== -->

                        <div
                            class="
                                mt-auto
                                grid
                                grid-cols-1
                                gap-3
                                pt-6
                                sm:grid-cols-2
                            "
                        >


                            <!-- Temario -->

                            <a
                                href="${curso.syllabus}"

                                class="
                                    ppt-button-secondary
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    text-sm
                                "
                            >

                                <i
                                    class="
                                        bi
                                        bi-journal-code
                                    "
                                ></i>

                                Ver temario

                            </a>



                            <!-- Inscripción -->

                            ${
                                puedeInscribirse

                                    ? `

                                        <a
                                            href="${whatsapp}"

                                            target="_blank"

                                            rel="noopener noreferrer"

                                            class="
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-amber-500
                                                px-4
                                                py-3
                                                text-sm
                                                font-black
                                                text-slate-950
                                                transition-all
                                                duration-300
                                                hover:-translate-y-0.5
                                                hover:bg-amber-400
                                                hover:shadow-[0_0_25px_rgba(245,158,11,.25)]
                                                active:scale-[.98]
                                            "
                                        >

                                            <i
                                                class="
                                                    bi
                                                    bi-whatsapp
                                                "
                                            ></i>

                                            Inscribirme

                                        </a>

                                    `

                                    : `

                                        <div
                                            class="
                                                flex
                                                cursor-default
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-slate-800
                                                bg-slate-900/50
                                                px-4
                                                py-3
                                                text-sm
                                                font-semibold
                                                text-slate-600
                                            "
                                        >

                                            <i
                                                class="
                                                    bi
                                                    bi-lock
                                                "
                                            ></i>


                                            ${
                                                curso.estado ===
                                                ESTADOS_CURSO.INICIADO

                                                    ? "Grupo iniciado"

                                                    : "Inscripción próximamente"
                                            }

                                        </div>

                                    `
                            }

                        </div>

                    </div>

                </div>

            </div>

        </article>
    `;
}



/* =========================================================
   ESTADO VACÍO
   ========================================================= */

function crearEstadoVacio(tipo) {

    const mensajes = {

        disponible: {
            icono:
                "bi-calendar2-check",

            titulo:
                "No hay inscripciones abiertas",

            texto:
                "Los próximos grupos aparecerán aquí automáticamente."
        },


        proximo: {
            icono:
                "bi-hourglass-split",

            titulo:
                "No hay cursos anunciados",

            texto:
                "Estamos preparando las próximas aperturas."
        },


        iniciado: {
            icono:
                "bi-code-square",

            titulo:
                "No hay grupos recientes",

            texto:
                "Los cursos iniciados recientemente aparecerán aquí."
        }

    };


    const info =
        mensajes[tipo];


    return `

        <div
            class="
                col-span-full
                rounded-2xl
                border
                border-dashed
                border-slate-800
                bg-slate-950/30
                px-6
                py-10
                text-center
            "
        >

            <i
                class="
                    bi
                    ${info.icono}
                    text-2xl
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
                ${info.titulo}
            </p>


            <p
                class="
                    mt-1
                    text-xs
                    text-slate-600
                "
            >
                ${info.texto}
            </p>

        </div>
    `;
}



/* =========================================================
   RENDERIZADO
   ========================================================= */

function renderizarGrupoCursos(
    estado,
    contenedorId,
    contadorId
) {

    const contenedor =
        document.getElementById(
            contenedorId
        );


    const contador =
        document.getElementById(
            contadorId
        );


    if (!contenedor) {
        return;
    }


    const cursos =
        obtenerCursosConEstado()
            .filter(
                curso =>
                    curso.estado ===
                    estado
            );


    if (contador) {

        contador.textContent =
            `${cursos.length} ${
                cursos.length === 1
                    ? "CURSO"
                    : "CURSOS"
            }`;
    }


    if (cursos.length === 0) {

        contenedor.innerHTML =
            crearEstadoVacio(
                estado
            );

        return;
    }


    contenedor.innerHTML =
        cursos
            .map(
                crearTarjetaCurso
            )
            .join("");
}



function renderizarCursos() {

    renderizarGrupoCursos(
        ESTADOS_CURSO.DISPONIBLE,
        "cursos-disponibles",
        "contador-disponibles"
    );


    renderizarGrupoCursos(
        ESTADOS_CURSO.PROXIMO,
        "cursos-proximos",
        "contador-proximos"
    );


    renderizarGrupoCursos(
        ESTADOS_CURSO.INICIADO,
        "cursos-iniciados",
        "contador-iniciados"
    );


    /*
     * Después de reconstruir las tarjetas,
     * volvemos a sincronizar los horarios
     * con el país seleccionado.
     */
    if (
        typeof actualizarHorariosTarjetas ===
        "function"
    ) {
        actualizarHorariosTarjetas();
    }
}



/* =========================================================
   CAMBIO DE PAÍS
   ========================================================= */

window.addEventListener(
    "ppt:cambio-pais",
    () => {

        /*
         * No necesitamos reconstruir
         * toda la página.
         *
         * ubicacion.js puede actualizar
         * los elementos data-horario-curso.
         */
        if (
            typeof actualizarHorariosTarjetas ===
            "function"
        ) {
            actualizarHorariosTarjetas();
        }

    }
);



/* =========================================================
   VALIDACIÓN
   ========================================================= */

function validarCursos() {

    const ids =
        new Set();


    CURSOS.forEach(
        curso => {

            if (
                ids.has(
                    curso.id
                )
            ) {

                console.error(
                    `[Cursos] ID duplicado: ${curso.id}`
                );

            }


            ids.add(
                curso.id
            );

        }
    );

}



/* =========================================================
   INICIO
   ========================================================= */

function inicializarCursos() {

    validarCursos();

    renderizarCursos();


    console.info(
        `[Programación Para Todos] ${CURSOS.length} cursos cargados.`
    );

}



if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarCursos
    );

} else {

    inicializarCursos();

}