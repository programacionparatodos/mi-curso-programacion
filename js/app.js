"use strict";


/* =========================================================
   MENÚ RESPONSIVE
   ========================================================= */

function inicializarMenuMovil() {

    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    // Algunas páginas podrían no tener menú.
    if (!menuButton || !mobileMenu) return;


    function abrirMenu() {

        mobileMenu.classList.remove("hidden");

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        menuButton.innerHTML =
            '<i class="bi bi-x-lg text-lg"></i>';
    }


    function cerrarMenu() {

        mobileMenu.classList.add("hidden");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        menuButton.innerHTML =
            '<i class="bi bi-list text-xl"></i>';
    }


    menuButton.addEventListener("click", () => {

        const menuAbierto =
            !mobileMenu.classList.contains("hidden");

        if (menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }

    });


    /*
     * Cierra el menú cuando el usuario selecciona
     * alguna opción de navegación.
     */

    mobileMenu
        .querySelectorAll("a")
        .forEach((enlace) => {

            enlace.addEventListener(
                "click",
                cerrarMenu
            );

        });


    /*
     * Si pasamos de móvil a escritorio con el menú
     * abierto, lo restablecemos.
     */

    window.addEventListener("resize", () => {

        if (window.innerWidth >= 1024) {
            cerrarMenu();
        }

    });


    /*
     * Permite cerrar el menú utilizando ESC.
     */

    document.addEventListener("keydown", (evento) => {

        if (
            evento.key === "Escape" &&
            !mobileMenu.classList.contains("hidden")
        ) {
            cerrarMenu();
            menuButton.focus();
        }

    });

}


/* =========================================================
   AÑO DEL FOOTER
   ========================================================= */

function actualizarAnioFooter() {

    const yearElement =
        document.getElementById("current-year");

    if (!yearElement) return;

    yearElement.textContent =
        new Date().getFullYear();

}


/* =========================================================
   ENLACES EXTERNOS
   ========================================================= */

/*
 * Añadimos automáticamente medidas de seguridad
 * a enlaces que se abren en una pestaña nueva.
 */

function prepararEnlacesExternos() {

    const enlaces =
        document.querySelectorAll(
            'a[target="_blank"]'
        );

    enlaces.forEach((enlace) => {

        const relActual =
            enlace.getAttribute("rel") || "";

        const valores =
            new Set(
                relActual
                    .split(" ")
                    .filter(Boolean)
            );

        valores.add("noopener");
        valores.add("noreferrer");

        enlace.setAttribute(
            "rel",
            [...valores].join(" ")
        );

    });

}


/* =========================================================
   INICIALIZACIÓN GENERAL
   ========================================================= */

function inicializarAplicacion() {

    inicializarMenuMovil();

    actualizarAnioFooter();

    prepararEnlacesExternos();

}


/* =========================================================
   ARRANQUE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    inicializarAplicacion
);