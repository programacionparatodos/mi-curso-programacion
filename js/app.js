"use strict";


/* =========================================================
   MENÚ RESPONSIVE
   ========================================================= */

function inicializarMenuMovil() {
    const menuButton = document.getElementById("menu-button") ||
                       document.getElementById("mobile-menu-button");
    const mobileMenu = document.getElementById("mobile-menu");
    if (!menuButton || !mobileMenu) return;

    const icono = menuButton.querySelector("i");
    const mediaDesktop = window.matchMedia("(min-width: 1024px)");

    function cambiarEstado(abierto) {
        mobileMenu.classList.toggle("hidden", !abierto);
        menuButton.setAttribute("aria-expanded", String(abierto));
        menuButton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
        if (icono) {
            icono.classList.toggle("bi-list", !abierto);
            icono.classList.toggle("bi-x-lg", abierto);
        }
    }

    cambiarEstado(false);
    menuButton.addEventListener("click", () => {
        cambiarEstado(mobileMenu.classList.contains("hidden"));
    });
    mobileMenu.querySelectorAll("a").forEach(enlace => {
        enlace.addEventListener("click", () => cambiarEstado(false));
    });
    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape" && !mobileMenu.classList.contains("hidden")) {
            cambiarEstado(false);
            menuButton.focus();
        }
    });
    // Compatible con navegadores móviles y cambios de orientación.
    const alCambiar = () => { if (mediaDesktop.matches) cambiarEstado(false); };
    if (mediaDesktop.addEventListener) mediaDesktop.addEventListener("change", alCambiar);
    else mediaDesktop.addListener(alCambiar);
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