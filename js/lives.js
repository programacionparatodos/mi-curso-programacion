"use strict";

/* =========================================================
   PROGRAMACIÓN PARA TODOS
   TikTok Live · Horarios internacionales

   HORARIO OFICIAL BOLIVIA · America/La_Paz

   Lunes / Miércoles / Viernes
   11:00 · 23:30

   Martes / Jueves
   11:00 · 22:00

   Sábado
   21:00

   Domingo
   21:00
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CONFIG_LIVES = {
    zonaBase: "America/La_Paz",

    grupos: [
        {
            id: "lmv",
            titulo: "Lunes · Miércoles · Viernes",
            corto: "LUN · MIÉ · VIE",
            dias: [
                { id: "lunes", indice: 1 },
                { id: "miercoles", indice: 3 },
                { id: "viernes", indice: 5 }
            ],
            horarios: ["11:00", "23:30"],
            icono: "bi-calendar-week"
        },

        {
            id: "mj",
            titulo: "Martes · Jueves",
            corto: "MAR · JUE",
            dias: [
                { id: "martes", indice: 2 },
                { id: "jueves", indice: 4 }
            ],
            horarios: ["11:00", "22:00"],
            icono: "bi-calendar2-week"
        },

        {
            id: "sabado",
            titulo: "Sábado",
            corto: "SÁBADO",
            dias: [
                { id: "sabado", indice: 6 }
            ],
            horarios: ["21:00"],
            icono: "bi-calendar-event"
        },

        {
            id: "domingo",
            titulo: "Domingo",
            corto: "DOMINGO",
            dias: [
                { id: "domingo", indice: 0 }
            ],
            horarios: ["21:00"],
            icono: "bi-calendar-event"
        }
    ]
};


/* =========================================================
   ZONA HORARIA ACTUAL
   ========================================================= */

function obtenerZonaLive() {

    if (typeof obtenerZonaHorariaActual === "function") {
        try {
            const zona = obtenerZonaHorariaActual();

            if (zona) {
                return zona;
            }
        } catch (error) {
            console.warn(
                "No se pudo obtener la zona desde ubicacion.js:",
                error
            );
        }
    }


    if (typeof obtenerPaisActual === "function") {
        try {
            const ubicacion = obtenerPaisActual();

            if (ubicacion?.zonaHoraria) {
                return ubicacion.zonaHoraria;
            }
        } catch (error) {
            console.warn(
                "No se pudo obtener la zona mediante obtenerPaisActual():",
                error
            );
        }
    }


    try {
        return (
            Intl.DateTimeFormat()
                .resolvedOptions()
                .timeZone
            ||
            CONFIG_LIVES.zonaBase
        );
    } catch {
        return CONFIG_LIVES.zonaBase;
    }
}


/* =========================================================
   UTILIDADES DE FECHA
   ========================================================= */

function obtenerPartesFechaZonaLive(fecha, zonaHoraria) {

    const formato = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone: zonaHoraria,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hourCycle: "h23"
        }
    );


    const resultado = {};


    formato.formatToParts(fecha).forEach((parte) => {
        if (parte.type !== "literal") {
            resultado[parte.type] = parte.value;
        }
    });


    return {
        year: Number(resultado.year),
        month: Number(resultado.month),
        day: Number(resultado.day),
        hour: Number(resultado.hour),
        minute: Number(resultado.minute),
        second: Number(resultado.second)
    };
}


/* =========================================================
   OFFSET DE ZONA
   ========================================================= */

function obtenerOffsetZonaLive(fecha, zonaHoraria) {

    const partes = obtenerPartesFechaZonaLive(
        fecha,
        zonaHoraria
    );


    const comoUTC = Date.UTC(
        partes.year,
        partes.month - 1,
        partes.day,
        partes.hour,
        partes.minute,
        partes.second
    );


    return comoUTC - fecha.getTime();
}


/* =========================================================
   FECHA/HORA BOLIVIA → UTC
   ========================================================= */

function fechaHoraBoliviaLiveAUTC(fechaISO, hora) {

    const [year, month, day] =
        fechaISO.split("-").map(Number);

    const [hour, minute] =
        hora.split(":").map(Number);


    let estimacion = new Date(
        Date.UTC(
            year,
            month - 1,
            day,
            hour,
            minute,
            0
        )
    );


    let offset = obtenerOffsetZonaLive(
        estimacion,
        CONFIG_LIVES.zonaBase
    );


    estimacion = new Date(
        estimacion.getTime() - offset
    );


    const nuevoOffset = obtenerOffsetZonaLive(
        estimacion,
        CONFIG_LIVES.zonaBase
    );


    if (nuevoOffset !== offset) {
        estimacion = new Date(
            estimacion.getTime()
            + offset
            - nuevoOffset
        );
    }


    return estimacion;
}


/* =========================================================
   SEMANA ACTUAL EN BOLIVIA
   ========================================================= */

function obtenerFechaBoliviaHoyLive() {

    const partes = obtenerPartesFechaZonaLive(
        new Date(),
        CONFIG_LIVES.zonaBase
    );


    return new Date(
        Date.UTC(
            partes.year,
            partes.month - 1,
            partes.day
        )
    );
}


function obtenerLunesSemanaLive() {

    const hoy = obtenerFechaBoliviaHoyLive();

    const diaSemana = hoy.getUTCDay();

    const diferencia =
        diaSemana === 0
            ? -6
            : 1 - diaSemana;


    const lunes = new Date(hoy);

    lunes.setUTCDate(
        hoy.getUTCDate() + diferencia
    );


    return lunes;
}


function fechaISODesdeUTCLive(fecha) {

    const year =
        fecha.getUTCFullYear();

    const month =
        String(fecha.getUTCMonth() + 1)
            .padStart(2, "0");

    const day =
        String(fecha.getUTCDate())
            .padStart(2, "0");


    return `${year}-${month}-${day}`;
}


function obtenerFechaDiaLive(indiceDia) {

    const lunes = obtenerLunesSemanaLive();

    const desplazamiento =
        indiceDia === 0
            ? 6
            : indiceDia - 1;


    const fecha = new Date(lunes);

    fecha.setUTCDate(
        lunes.getUTCDate() + desplazamiento
    );


    return fechaISODesdeUTCLive(fecha);
}


/* =========================================================
   CONVERTIR TRANSMISIÓN
   ========================================================= */

function convertirLive(fechaBolivia, horaBolivia) {

    const zonaDestino = obtenerZonaLive();

    const fechaUTC = fechaHoraBoliviaLiveAUTC(
        fechaBolivia,
        horaBolivia
    );


    const formato = new Intl.DateTimeFormat(
        "es",
        {
            timeZone: zonaDestino,
            weekday: "long",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        }
    );


    const resultado = {};


    formato.formatToParts(fechaUTC).forEach((parte) => {
        if (parte.type !== "literal") {
            resultado[parte.type] = parte.value;
        }
    });


    return {
        fechaUTC,
        zona: zonaDestino,
        diaLocal: resultado.weekday,
        year: Number(resultado.year),
        month: Number(resultado.month),
        day: Number(resultado.day),
        horaLocal:
            `${resultado.hour}:${resultado.minute}`
    };
}


/* =========================================================
   GENERAR EJEMPLO LOCAL DE CADA GRUPO

   Usamos el primer día de cada grupo para representar
   su conversión. Si la hora provoca cambio de día,
   también mostramos el día local resultante.
   ========================================================= */

function obtenerHorarioLocalGrupo(grupo) {

    const diaReferencia = grupo.dias[0];

    const fechaBolivia =
        obtenerFechaDiaLive(diaReferencia.indice);


    return grupo.horarios.map((horaBolivia) => {

        const convertido = convertirLive(
            fechaBolivia,
            horaBolivia
        );


        const [year, month, day] =
            fechaBolivia
                .split("-")
                .map(Number);


        const cambioDia =
            convertido.year !== year
            ||
            convertido.month !== month
            ||
            convertido.day !== day;


        return {
            horaBolivia,
            ...convertido,
            cambioDia
        };
    });
}


/* =========================================================
   NOMBRES
   ========================================================= */

function capitalizarLive(texto) {

    if (!texto) {
        return "";
    }

    return (
        texto.charAt(0).toUpperCase()
        +
        texto.slice(1)
    );
}


function obtenerNombreZonaLive(zona) {

    if (!zona) {
        return "Tu zona horaria";
    }


    const partes = zona.split("/");

    return partes[
        partes.length - 1
    ].replaceAll("_", " ");
}


/* =========================================================
   CREAR HORARIO
   ========================================================= */

function crearHorarioLive(horario, indice) {

    const esManana =
        Number(horario.horaBolivia.split(":")[0]) < 18;


    const icono =
        esManana
            ? "bi-sun"
            : "bi-moon-stars";


    const color =
        esManana
            ? "text-amber-400"
            : "text-indigo-400";


    const etiqueta =
        esManana
            ? "Mañana"
            : "Noche";


    return `
        <div
            class="
                rounded-xl
                border border-slate-800
                bg-slate-950/65
                px-4 py-3
            "
        >
            <div
                class="
                    flex items-center
                    justify-between gap-3
                "
            >

                <div
                    class="
                        flex items-center
                        gap-2
                    "
                >
                    <i
                        class="
                            bi ${icono}
                            ${color}
                        "
                    ></i>

                    <span
                        class="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-wider
                            text-slate-500
                        "
                    >
                        ${etiqueta}
                    </span>
                </div>


                <div class="text-right">

                    <p
                        class="
                            font-mono
                            text-xl
                            font-black
                            text-slate-100
                        "
                    >
                        ${horario.horaLocal}
                    </p>

                    <p
                        class="
                            text-[8px]
                            uppercase
                            tracking-wider
                            text-slate-600
                        "
                    >
                        hora local
                    </p>

                </div>

            </div>


            ${
                horario.cambioDia
                    ? `
                        <div
                            class="
                                mt-2 pt-2
                                border-t
                                border-slate-800/70
                                flex items-center
                                gap-1.5
                                text-[9px]
                                text-amber-400
                            "
                        >
                            <i
                                class="
                                    bi bi-arrow-right
                                "
                            ></i>

                            En tu zona corresponde al
                            <strong>
                                ${capitalizarLive(
                                    horario.diaLocal
                                )}
                            </strong>
                        </div>
                    `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function crearTarjetaLive(grupo) {

    const horarios =
        obtenerHorarioLocalGrupo(grupo);


    return `
        <article
            class="
                group
                relative
                min-w-0
                overflow-hidden
                rounded-2xl
                border
                border-slate-800/80
                bg-slate-900/35
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-pink-500/30
                hover:bg-slate-900/55
            "
        >

            <!-- Resplandor -->

            <div
                class="
                    pointer-events-none
                    absolute
                    -right-12
                    -top-12
                    h-32
                    w-32
                    rounded-full
                    bg-pink-500/[0.04]
                    blur-3xl
                    transition
                    group-hover:bg-pink-500/[0.08]
                "
            ></div>


            <div class="relative">

                <!-- Cabecera -->

                <div
                    class="
                        flex items-start
                        justify-between
                        gap-3
                        mb-5
                    "
                >

                    <div>

                        <p
                            class="
                                font-mono
                                text-[15px]
                                font-bold
                                tracking-[0.18em]
                                text-pink-400
                            "
                            >
                            ${grupo.corto}
                        </p>

                    </div>


                    <div
                        class="
                            flex
                            h-9 w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-pink-500/15
                            bg-pink-500/[0.06]
                            text-pink-400
                        "
                    >
                        <i
                            class="
                                bi ${grupo.icono}
                            "
                        ></i>
                    </div>

                </div>


                <!-- Horarios -->

                <div class="space-y-2">

                    ${horarios
                        .map(crearHorarioLive)
                        .join("")}

                </div>


                <!-- Horario Bolivia -->

                <div
                    class="
                        mt-4
                        border-t
                        border-slate-800/70
                        pt-3
                    "
                >

                    <p
                        class="
                            flex
                            items-center
                            gap-1.5
                            text-[9px]
                            leading-relaxed
                            text-slate-600
                        "
                    >
                        <i
                            class="
                                bi bi-geo-alt
                                text-slate-500
                            "
                        ></i>

                        Bolivia:

                        <span
                            class="
                                font-mono
                                text-slate-500
                            "
                        >
                            ${grupo.horarios.join(" · ")}
                        </span>
                    </p>

                </div>

            </div>

        </article>
    `;
}


/* =========================================================
   SELECTOR DE ZONA HORARIA
   ========================================================= */

function crearSelectorZonaLive() {

    return `
        <div
            class="
                rounded-xl
                border border-slate-800
                bg-slate-950/70
                p-4
            "
        >

            <label
                for="live-timezone-select"
                class="
                    mb-2 block
                    font-mono
                    text-[9px]
                    font-bold
                    tracking-[0.16em]
                    text-slate-600
                "
            >
                TU ZONA HORARIA
            </label>


            <div class="relative">

                <i
                    class="
                        bi bi-globe-americas
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-sm
                        text-pink-400
                    "
                ></i>


                <select
                    id="live-timezone-select"
                    class="
                        w-full
                        appearance-none
                        rounded-lg
                        border border-slate-800
                        bg-slate-950
                        py-2.5
                        pl-9 pr-9
                        text-xs
                        text-slate-300
                        outline-none
                        transition
                        hover:border-slate-700
                        focus:border-pink-500/50
                    "
                >
                    <option>Cargando...</option>
                </select>


                <i
                    class="
                        bi bi-chevron-down
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        text-slate-600
                    "
                ></i>

            </div>


            <p
                class="
                    mt-2
                    text-[9px]
                    leading-4
                    text-slate-600
                "
            >
                Detectamos automáticamente la zona horaria
                de tu dispositivo.
            </p>

        </div>
    `;
}


/* =========================================================
   SINCRONIZAR SELECTOR
   ========================================================= */

function sincronizarSelectorLive() {

    const selector =
        document.getElementById(
            "live-timezone-select"
        );


    if (!selector) {
        return;
    }


    const zonaActual =
        obtenerZonaLive();


    let zonas = [];


    if (
        typeof Intl.supportedValuesOf === "function"
    ) {
        try {
            zonas =
                Intl.supportedValuesOf("timeZone");
        } catch {
            zonas = [];
        }
    }


    if (!zonas.length) {

        zonas = [
            "America/La_Paz",
            "America/Lima",
            "America/Caracas",
            "America/Bogota",
            "America/Santiago",
            "America/Argentina/Buenos_Aires",
            "America/Asuncion",
            "America/Montevideo",
            "America/Mexico_City",
            "America/New_York",
            "America/Chicago",
            "America/Denver",
            "America/Los_Angeles",
            "Europe/Madrid",
            "Europe/London"
        ];
    }


    if (!zonas.includes(zonaActual)) {
        zonas.push(zonaActual);
        zonas.sort();
    }


    selector.innerHTML = "";


    zonas.forEach((zona) => {

        const option =
            document.createElement("option");


        option.value = zona;

        option.textContent =
            zona.replaceAll("_", " ");


        option.selected =
            zona === zonaActual;


        selector.appendChild(option);
    });


    selector.addEventListener(
        "change",
        () => {

            const zona =
                selector.value;


            /*
             * Esta es la función pública que utiliza
             * nuestro ubicacion.js actual.
             */

            if (
                typeof cambiarZonaHoraria === "function"
            ) {
                cambiarZonaHoraria(zona);
                return;
            }


            /*
             * Compatibilidad.
             */

            try {
                localStorage.setItem(
                    "ppt-zona-horaria",
                    zona
                );
            } catch {
                // localStorage bloqueado.
            }


            window.dispatchEvent(
                new CustomEvent(
                    "ppt:cambio-zona-horaria",
                    {
                        detail: {
                            zonaHoraria: zona
                        }
                    }
                )
            );
        }
    );
}


/* =========================================================
   CALENDARIO COMPLETO
   ========================================================= */

function crearCalendarioLives() {

    const zona =
        obtenerZonaLive();

    const nombreZona =
        obtenerNombreZonaLive(zona);


    return `
        <div>

            <!-- ENCABEZADO -->

            <div
                class="
                    mb-8
                    flex flex-col
                    gap-5
                    lg:flex-row
                    lg:items-end
                    lg:justify-between
                "
            >

                <div class="max-w-2xl">

                    <div
                        class="
                            ppt-section-label
                            mb-3
                        "
                    >
                        <span>
                            02 // TIKTOK LIVE
                        </span>

                        <span
                            class="ppt-section-line"
                        ></span>
                    </div>


                    <h2
                        class="
                            text-2xl
                            font-black
                            tracking-tight
                            sm:text-3xl
                        "
                    >
                        Aprende conmigo

                        <span class="text-slate-500">
                            todos los días.
                        </span>
                    </h2>


                    <p
                        class="
                            mt-3
                            max-w-xl
                            text-sm
                            leading-relaxed
                            text-slate-400
                        "
                    >
                        Transmisiones gratuitas de programación
                        en TikTok Live. Mostramos automáticamente
                        los horarios correspondientes a tu zona
                        horaria.
                    </p>

                </div>


                <div
                    class="
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-pink-500/20
                        bg-pink-500/[0.06]
                        px-3 py-1.5
                        font-mono
                        text-[10px]
                        font-bold
                        text-pink-400
                    "
                >

                    <span
                        class="
                            h-2 w-2
                            rounded-full
                            bg-pink-500
                            shadow-[0_0_10px_rgba(236,72,153,.8)]
                        "
                    ></span>

                    TRANSMISIONES GRATUITAS

                </div>

            </div>


            <!-- PANEL -->

            <div
                class="
                    ppt-card
                    overflow-hidden
                "
            >

                <!-- TERMINAL -->

                <div class="ppt-terminal-bar">

                    <div
                        class="
                            flex items-center
                            gap-2
                        "
                    >
                        <span
                            class="
                                h-3 w-3
                                rounded-full
                                bg-red-500
                            "
                        ></span>

                        <span
                            class="
                                h-3 w-3
                                rounded-full
                                bg-amber-400
                            "
                        ></span>

                        <span
                            class="
                                h-3 w-3
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
                            sm:text-xs
                        "
                    >
                        tiktok_live.schedule
                    </span>

                </div>


                <div
                    class="
                        p-5
                        sm:p-6
                        lg:p-8
                    "
                >

                    <!-- ZONA HORARIA -->

                    <div
                        class="
                            mb-6
                            grid
                            gap-4
                            lg:grid-cols-[1fr_320px]
                            lg:items-center
                        "
                    >

                        <div
                            class="
                                rounded-xl
                                border
                                border-slate-800
                                bg-slate-950/60
                                p-4
                            "
                        >

                            <div
                                class="
                                    flex flex-wrap
                                    items-center
                                    gap-2
                                "
                            >

                                <i
                                    class="
                                        bi bi-clock
                                        text-emerald-400
                                    "
                                ></i>


                                <span
                                    class="
                                        text-xs
                                        font-bold
                                        text-slate-300
                                    "
                                >
                                    Horario para ti
                                </span>


                                <span
                                    class="
                                        rounded-full
                                        border
                                        border-emerald-500/20
                                        bg-emerald-500/5
                                        px-2 py-1
                                        font-mono
                                        text-[9px]
                                        text-emerald-400
                                    "
                                >
                                    ${nombreZona}
                                </span>

                            </div>


                            <p
                                class="
                                    mt-2
                                    break-all
                                    font-mono
                                    text-[10px]
                                    text-slate-600
                                "
                            >
                                ${zona}
                            </p>


                            <p
                                class="
                                    mt-2
                                    text-[10px]
                                    text-slate-500
                                "
                            >
                                Horario oficial:
                                Bolivia · America/La_Paz
                            </p>

                        </div>


                        ${crearSelectorZonaLive()}

                    </div>


                    <!-- 4 TARJETAS -->

                    <div
                        class="
                            grid
                            grid-cols-1
                            gap-3
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >

                        ${CONFIG_LIVES.grupos
                            .map(crearTarjetaLive)
                            .join("")}

                    </div>


                    <!-- PIE -->

                    <div
                        class="
                            mt-6
                            flex flex-col
                            gap-3
                            border-t
                            border-slate-800/80
                            pt-5
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >

                        <p
                            class="
                                flex items-start
                                gap-2
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            <i
                                class="
                                    bi bi-info-circle
                                    mt-0.5
                                    text-amber-400
                                "
                            ></i>

                            <span>
                                Los horarios se convierten
                                automáticamente desde la hora
                                oficial de Bolivia hacia tu
                                zona horaria.
                            </span>
                        </p>


                        <span
                            class="
                                shrink-0
                                font-mono
                                text-[9px]
                                text-slate-700
                            "
                        >
                            TZ ENGINE // IANA
                        </span>

                    </div>

                </div>

            </div>

        </div>
    `;
}


/* =========================================================
   RENDER
   ========================================================= */

function renderizarLives() {

    const contenedor =
        document.getElementById(
            "live-calendar"
        );


    if (!contenedor) {
        return;
    }


    try {

        contenedor.innerHTML =
            crearCalendarioLives();


        sincronizarSelectorLive();

    } catch (error) {

        console.error(
            "Error al renderizar TikTok Live:",
            error
        );


        contenedor.innerHTML = `
            <div
                class="
                    ppt-card
                    p-6
                    text-center
                "
            >
                <i
                    class="
                        bi bi-exclamation-triangle
                        text-2xl
                        text-amber-400
                    "
                ></i>

                <p
                    class="
                        mt-3
                        text-sm
                        font-bold
                        text-slate-300
                    "
                >
                    No se pudo cargar el horario.
                </p>

                <p
                    class="
                        mt-1
                        text-xs
                        text-slate-600
                    "
                >
                    Recarga la página para intentarlo
                    nuevamente.
                </p>
            </div>
        `;
    }
}


/* =========================================================
   EVENTOS
   ========================================================= */

window.addEventListener(
    "ppt:cambio-zona-horaria",
    () => {
        renderizarLives();
    }
);


window.addEventListener(
    "ppt:cambio-pais",
    () => {
        renderizarLives();
    }
);


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function inicializarLives() {
    renderizarLives();
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarLives
    );

} else {

    inicializarLives();

}