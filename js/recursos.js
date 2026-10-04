"use strict";

/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Renderizado dinámico de recursos
   ========================================================= */


/* =========================================================
   ESCAPAR HTML
   Evita que texto ingresado en los datos pueda alterar
   accidentalmente la estructura de la página.
   ========================================================= */

function escaparHTML(texto) {

    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   VALIDAR URL
   Solo permitimos enlaces HTTP o HTTPS.
   ========================================================= */

function urlValida(url) {

    try {

        const enlace = new URL(url);

        return (
            enlace.protocol === "http:"
            ||
            enlace.protocol === "https:"
        );

    } catch {

        return false;
    }
}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function crearTarjetaRecurso(recurso) {

    const titulo =
        escaparHTML(recurso.titulo);

    const descripcion =
        escaparHTML(recurso.descripcion);

    const autor =
        escaparHTML(recurso.autor);

    const url =
        urlValida(recurso.url)
            ? recurso.url
            : "#";


    return `
        <article
            class="
                ppt-card
                ppt-card-hover
                p-5 sm:p-6
                flex flex-col
                min-h-[250px]
            "
        >

            <!-- Icono -->

            <div
                class="
                    w-11 h-11
                    rounded-xl
                    border border-amber-500/15
                    bg-amber-500/[0.06]
                    flex items-center
                    justify-center
                    text-amber-400
                    text-lg
                    mb-5
                "
            >
                <i class="bi bi-link-45deg"></i>
            </div>


            <!-- Título -->

            <h3
                class="
                    text-base sm:text-lg
                    font-black
                    leading-snug
                    text-slate-100
                "
            >
                ${titulo}
            </h3>


            <!-- Descripción -->

            <p
                class="
                    mt-3
                    text-sm
                    leading-relaxed
                    text-slate-400
                    flex-1
                "
            >
                ${descripcion}
            </p>


            <!-- Separador -->

            <div
                class="
                    mt-6 pt-4
                    border-t
                    border-slate-800/80
                "
            >

                <!-- Autor -->

                <div
                    class="
                        flex items-center
                        gap-2
                    "
                >

                    <i
                        class="
                            bi bi-person-circle
                            text-emerald-400
                        "
                    ></i>


                    <p
                        class="
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Aporte de:

                        <span
                            class="
                                font-semibold
                                text-slate-300
                            "
                        >
                            ${autor}
                        </span>
                    </p>

                </div>


                <!-- Botón -->

                <a
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        font-mono
                        text-[10px]
                        font-bold
                        tracking-wider
                        text-amber-400
                        hover:text-amber-300
                        transition
                    "
                >
                    VER RECURSO

                    <i class="bi bi-box-arrow-up-right"></i>
                </a>

            </div>

        </article>
    `;
}


/* =========================================================
   ESTADO VACÍO
   ========================================================= */

function crearEstadoVacio() {

    return `
        <div
            class="
                col-span-full
                ppt-card
                px-6 py-12
                text-center
            "
        >

            <div
                class="
                    mx-auto
                    w-12 h-12
                    rounded-xl
                    border border-slate-800
                    bg-slate-900/60
                    flex items-center
                    justify-center
                    text-slate-500
                    text-xl
                "
            >
                <i class="bi bi-folder2-open"></i>
            </div>


            <h3
                class="
                    mt-4
                    text-base
                    font-bold
                    text-slate-300
                "
            >
                Todavía no hay recursos
            </h3>


            <p
                class="
                    mt-2
                    text-xs
                    text-slate-600
                "
            >
                Los nuevos aportes de la comunidad
                aparecerán aquí.
            </p>

        </div>
    `;
}


/* =========================================================
   ACTUALIZAR CONTADOR
   ========================================================= */

function actualizarContadorRecursos(total) {

    const contador =
        document.getElementById(
            "recursos-contador"
        );


    if (!contador) {
        return;
    }


    if (total === 0) {

        contador.textContent =
            "Sin recursos disponibles";

        return;
    }


    if (total === 1) {

        contador.textContent =
            "1 recurso disponible";

        return;
    }


    contador.textContent =
        `${total} recursos disponibles`;
}


/* =========================================================
   RENDERIZAR RECURSOS
   ========================================================= */

function renderizarRecursos() {

    const contenedor =
        document.getElementById(
            "recursos-grid"
        );


    if (!contenedor) {
        return;
    }


    /*
     * Comprobamos que data/recursos.js
     * se haya cargado correctamente.
     */

    if (
        typeof RECURSOS === "undefined"
        ||
        !Array.isArray(RECURSOS)
    ) {

        console.error(
            "No se pudo cargar data/recursos.js"
        );


        contenedor.innerHTML = `
            <div
                class="
                    col-span-full
                    ppt-card
                    p-8
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
                        text-slate-400
                    "
                >
                    No se pudieron cargar los recursos.
                </p>
            </div>
        `;

        actualizarContadorRecursos(0);

        return;
    }


    /*
     * Eliminamos registros incompletos.
     */

    const recursosValidos =
        RECURSOS.filter((recurso) => {

            return (
                recurso
                &&
                recurso.titulo
                &&
                recurso.descripcion
                &&
                recurso.autor
                &&
                urlValida(recurso.url)
            );

        });


    actualizarContadorRecursos(
        recursosValidos.length
    );


    /*
     * Sin recursos.
     */

    if (recursosValidos.length === 0) {

        contenedor.innerHTML =
            crearEstadoVacio();

        return;
    }


    /*
     * Generamos las tarjetas.
     */

    contenedor.innerHTML =
        recursosValidos
            .map(crearTarjetaRecurso)
            .join("");
}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

function inicializarRecursos() {

    renderizarRecursos();
}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarRecursos
    );

} else {

    inicializarRecursos();
}