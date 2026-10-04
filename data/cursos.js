/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Base de datos de cursos

   Este archivo contiene únicamente información.
   La lógica de estados, calendarios y renderizado
   se encuentra en otros módulos.
   ========================================================= */

"use strict";


const CURSOS = [

    /* =====================================================
       FUNDAMENTOS DE PROGRAMACIÓN — PSeInt
       ===================================================== */

    {
        id: "fundamentos-pseint-2026-09",

        lenguaje: "pseint",
        categoria: "fundamentos",

        nombre: "Fundamentos de Programación",
        subtitulo: "Lógica y Algoritmos",

        descripcion:
            "Aprende análisis del problema, diagramas de flujo, " +
            "pseudocódigo y pruebas de escritorio utilizando PSeInt. " +
            "Construye bases sólidas antes de trabajar con un lenguaje de programación.",

        imagen: 
            "img/cursos/fundamentos/pseint/pseint.png",

        syllabus:
            "cursos/fundamentos/fundamentos_programacion.html",

        fechaInicio: "2026-09-01",

        dias: [
            "lunes",
            "martes",
            "miercoles",
            "jueves"
        ],

        horaInicio: "15:00",
        horaFin: "17:00",

        clases: 32,
        horasAcademicas: 64,

        precio: {
            BOB: 450,
            USD: 65
        },

        apariencia: {
            color: "emerald",
            icono: "bi-diagram-3"
        }
    },


    /* =====================================================
       PYTHON — FUNDAMENTOS
       ===================================================== */

    {
        id: "python-fundamentos-2026-09",

        lenguaje: "python",
        categoria: "fundamentos",

        nombre: "Python",
        subtitulo: "Fundamentos de Programación",

        descripcion:
            "Aprende programación desde cero con Python, " +
            "desarrollando lógica, estructuras de control, " +
            "manejo de datos y resolución de problemas.",

        imagen:
            "img/cursos/fundamentos/python/python.png",

        syllabus:
            "cursos/fundamentos/python_fundamentos.html",

        fechaInicio: "2026-09-14",

        dias: [
            "lunes",
            "miercoles",
            "viernes"
        ],

        horaInicio: "22:00",
        horaFin: "23:30",

        clases: 20,
        horasAcademicas: 30,

        precio: {
            BOB: 250,
            USD: 35
        },

        apariencia: {
            color: "blue",
            icono: "bi-filetype-py"
        }
    },


    /* =====================================================
       JAVA — FUNDAMENTOS
       ===================================================== */

    {
        id: "java-fundamentos-2026-09",

        lenguaje: "java",
        categoria: "fundamentos",

        nombre: "Java",
        subtitulo: "Fundamentos de Programación",

        descripcion:
            "Aprende los fundamentos de Java desde cero, " +
            "trabajando con tipado estático, estructuras de control " +
            "y resolución estructurada de problemas.",

        imagen:
            "img/cursos/fundamentos/java/java.png",

        syllabus:
            "cursos/fundamentos/java_fundamentos.html",

        fechaInicio: "2026-09-14",

        dias: [
            "lunes",
            "miercoles"
        ],

        horaInicio: "19:30",
        horaFin: "21:30",

        clases: 15,
        horasAcademicas: 30,

        precio: {
            BOB: 250,
            USD: 35
        },

        apariencia: {
            color: "orange",
            icono: "bi-cup-hot"
        }
    },


    /* =====================================================
       C++ — FUNDAMENTOS
       ===================================================== */

    {
        id: "cpp-fundamentos-2026-09",

        lenguaje: "cpp",
        categoria: "fundamentos",

        nombre: "C++",
        subtitulo: "Fundamentos de Programación",

        descripcion:
            "Construye bases sólidas de programación con C++, " +
            "comprendiendo tipos de datos, estructuras de control " +
            "y resolución de problemas paso a paso.",

        imagen:
            "img/cursos/fundamentos/cpp/cpp.png",

        syllabus:
            "cursos/fundamentos/cpp_fundamentos.html",

        fechaInicio: "2026-09-22",

        dias: [
            "martes",
            "jueves"
        ],

        horaInicio: "19:30",
        horaFin: "21:30",

        clases: 15,
        horasAcademicas: 30,

        precio: {
            BOB: 250,
            USD: 35
        },

        apariencia: {
            color: "cyan",
            icono: "bi-code-square"
        }
    }

];


/* =========================================================
   CONFIGURACIÓN GENERAL DE CURSOS
   ========================================================= */

const CONFIG_CURSOS = {

    /*
     * Cantidad de días antes del inicio en los que
     * un curso pasa de PRÓXIMO a DISPONIBLE.
     */

    diasInscripcion: 10,


    /*
     * El día de inicio todavía aparece como DISPONIBLE.
     * Desde el día siguiente pasa a INICIADO.
     */

    iniciarEstadoAlDiaSiguiente: true,


    /*
     * Cantidad de días que un curso permanece visible
     * en la sección INICIADOS.
     */

    diasVisibleComoIniciado: 7,


    /*
     * Zona horaria utilizada como referencia para
     * fechas y horarios oficiales de los cursos.
     */

    zonaHorariaBase: "America/La_Paz",


    /*
     * País y moneda base.
     */

    paisBase: "Bolivia",
    monedaBase: "BOB"
};