// ==========================================
// ARCHIVO: script.js (PARTE 1 DE 3)
// ==========================================

// Configuración global del sistema
const WHATSAPP_PHONE = "59175426858";
const FECHA_HOY = new Date("2026-09-15T00:00:00"); // Fecha actual del sistema fijada

// Base de datos cruda de cursos con sus configuraciones base (Hora Bolivia)
const cursosBaseData = [
    {
        id: "fundamentos_programacion",
        name: "Fundamentos de Programación",
        langKey: "pseint",
        tipo: "fundamentos",
        subtitulo: "Lógica Pura",
        badgeText: "Análisis y Pseudocódigo",
        badgeClass: "text-emerald-400 bg-emerald-500/10",
        img: "img/pseint.png",
        descripcion: "Aprende Análisis del Problema, Diagramas de Flujo, Pseudocódigo y Pruebas de escritorio con PSeInt. Forja bases mentales sólidas sin depender de un lenguaje.",
        fechaInicioStr: "2026-09-01",
        clasesTotal: 32,
        cargaHoraria: "64 Horas Prácticas en Vivo",
        precioBOB: 450,
        precioUSD: 65,
        colorPrincipal: "emerald",
        icon: "bi-logic",
        urlSyllabus: "cursos/fundamentos/fundamentos_programacion.html"
    },
    {
        id: "python_script",
        name: "Python",
        langKey: "python",
        tipo: "fundamentos",
        subtitulo: "Grupo Solicitado",
        badgeText: "Automatización y Data",
        badgeClass: "text-amber-400 bg-amber-500/10",
        img: "img/python.png",
        descripcion: "Aprende el lenguaje de mayor crecimiento mundial. Ideal para automatización de tareas, análisis de datos y desarrollo ágil desde cero.",
        fechaInicioStr: "2026-09-14",
        clasesTotal: 20,
        cargaHoraria: "30 Horas Prácticas en Vivo",
        precioBOB: 250,
        precioUSD: 35,
        colorPrincipal: "blue",
        icon: "bi-fire",
        urlSyllabus: "cursos/fundamentos/python_fundamentos.html"
    },
    {
        id: "main_java",
        name: "Java",
        langKey: "java",
        tipo: "fundamentos",
        subtitulo: "Estándar Empresarial",
        badgeText: "Tipado Estricto",
        badgeClass: "text-orange-400 bg-orange-500/10",
        img: "img/java.png",
        descripcion: "El pilar del desarrollo corporativo y bancario. Aprende un tipado rígido y estructurado ideal para proyectos complejos.",
        fechaInicioStr: "2026-09-14",
        clasesTotal: 15,
         cargaHoraria: "30 Horas Prácticas en Vivo",
        precioBOB: 250,
        precioUSD: 35,
        colorPrincipal: "orange",
        icon: "bi-building-gear",
        urlSyllabus: "cursos/fundamentos/java_fundamentos.html"
    },
    {
        id: "main_cpp",
        name: "C++",
        langKey: "cpp",
        tipo: "fundamentos",
        subtitulo: "Alto Rendimiento",
        badgeText: "Control y Velocidad",
        badgeClass: "text-blue-400 bg-blue-500/10",
        img: "img/cpp.png",
        descripcion: "Domina el control de la memoria y la velocidad. Forja bases ultra sólidas para algoritmos y programación competitiva desde cero.",
        fechaInicioStr: "2026-09-22",
        clasesTotal: 15,
        cargaHoraria: "30 Horas Prácticas en Vivo",
        precioBOB: 250,
        precioUSD: 35,
        colorPrincipal: "cyan",
        icon: "bi-lightning-charge",
        urlSyllabus: "cursos/fundamentos/cpp_fundamentos.html"
    }
];

// Base de Datos de Países y Desfases Horarios respecto a Bolivia (GMT-4)
const countryConfig = {
    BO: { name: "Bolivia", currency: "BOB", tzLabel: "Hora BO", offset: 0 },
    AR: { name: "Argentina", currency: "USD", tzLabel: "Hora AR", offset: 1 },
    CL: { name: "Chile", currency: "USD", tzLabel: "Hora CL", offset: 1 },
    CO: { name: "Colombia", currency: "USD", tzLabel: "Hora CO", offset: -1 },
    CR: { name: "Costa Rica", currency: "USD", tzLabel: "Hora CR", offset: -2 },
    CU: { name: "Cuba", currency: "USD", tzLabel: "Hora CU", offset: 0 },
    DO: { name: "Rep. Dominicana", currency: "USD", tzLabel: "Hora DO", offset: 0 },
    EC: { name: "Ecuador", currency: "USD", tzLabel: "Hora EC", offset: -1 },
    SV: { name: "El Salvador", currency: "USD", tzLabel: "Hora SV", offset: -2 },
    GT: { name: "Guatemala", currency: "USD", tzLabel: "Hora GT", offset: -2 },
    HN: { name: "Honduras", currency: "USD", tzLabel: "Hora HN", offset: -2 },
    MX: { name: "México", currency: "USD", tzLabel: "Hora MX", offset: -2 },
    NI: { name: "Nicaragua", currency: "USD", tzLabel: "Hora NI", offset: -2 },
    PA: { name: "Panamá", currency: "USD", tzLabel: "Hora PA", offset: -1 },
    PY: { name: "Paraguay", currency: "USD", tzLabel: "Hora PY", offset: 0 },
    PE: { name: "Perú", currency: "USD", tzLabel: "Hora PE", offset: -1 },
    PR: { name: "Puerto Rico", currency: "USD", tzLabel: "Hora PR", offset: 0 },
    UY: { name: "Uruguay", currency: "USD", tzLabel: "Hora UY", offset: 1 },
    VE: { name: "Venezuela", currency: "USD", tzLabel: "Hora VE", offset: 0 },
    EXT: { name: "Otro país hispano", currency: "USD", tzLabel: "Hora Ext", offset: 0 }
};

// Horarios Base de los cursos expresados en sistema de 24 Horas (Rango en minutos desde las 00:00)
const baseSchedules = {
    pseint: { startHour: 15, startMin: 0, endHour: 17, endMin: 0, daysLabel: "Lun, Mar, Mié y Jue" },
    python: { startHour: 22, startMin: 0, endHour: 23, endMin: 30, daysLabel: "Lun, Mié y Vie" },
    java: { startHour: 19, startMin: 30, endHour: 21, endMin: 30, daysLabel: "Lunes y Miércoles" },
    cpp: { startHour: 19, startMin: 30, endHour: 21, endMin: 30, daysLabel: "Martes y Jueves" }
};


// Generador de métodos de pago para Bolivia
function getNationalMethods() {
    return `
        <div class="space-y-4">
            <div class="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Moneda Local</span>
                    <h4 class="font-bold text-slate-200 text-sm mt-1 flex items-center gap-1.5">
                        <i class="bi bi-bank text-emerald-400"></i> Transferencia Nacional
                    </h4>
                </div>
                <div class="flex items-center justify-center bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-xs tracking-tighter shadow-sm">BNB</div>
            </div>
            <div class="bg-slate-950 border border-slate-800/60 rounded-xl p-4 text-xs space-y-3 leading-relaxed text-slate-400">
                <p class="text-slate-300 font-medium flex items-center gap-1.5"><span class="text-amber-500">▪</span> Depósito o Transferencia QR Simple</p>
                <p>Solicita el código QR oficial de recaudación directo al presionar el botón de inscripción de tu curso. Acreditación inmediata mediante la banca móvil de <strong>Banco Nacional de Bolivia (BNB)</strong> u otros bancos autorizados.</p>
            </div>
        </div>`;
}

// Generador de métodos de pago internacionales
function getIntlMethods() {
    return `
        <div class="space-y-4">
            <div class="bg-slate-950/40 border border-slate-800/40 p-2 text-center rounded-lg">
                <span class="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">🌐 Pasarelas Internacionales</span>
            </div>
            <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div class="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span class="text-xs font-bold text-blue-400 font-mono">01 / PAYPAL</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">USD</span>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">Pago seguro con tarjeta de crédito o débito internacional. Solicita nuestro enlace oficial de cobro directo por chat.</p>
            </div>
            <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div class="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span class="text-xs font-bold text-emerald-400 font-mono">02 / TAKENOS</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">QR Internacional</span>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">Pago rápido en tu moneda local o dólares mediante QR. Solicita tu código personalizado de inscripción directa por WhatsApp.</p>
            </div>
        </div>`;
}

// ==========================================
// ARCHIVO: script.js (PARTE 2.1 DE 3)
// ==========================================

// Inicializar el selector de países ordenado de forma alfabética con Bolivia al inicio
function initializeCountrySelect() {
    const selectEl = document.getElementById("country-select");
    if (!selectEl) return;

    selectEl.innerHTML = "";

    // Separar Bolivia del resto de los países para fijarla arriba
    const boliviaData = countryConfig["BO"];
    const otherCountries = Object.entries(countryConfig).filter(([key]) => key !== "BO" && key !== "EXT");

    // Ordenar alfabéticamente el resto de países por su nombre nativo
    otherCountries.sort((a, b) => a[1].name.localeCompare(b[1].name, "es", { sensitivity: "base" }));

    // Reconstruir el listado inyectando a Bolivia al principio
    let optionsHtml = `<option value="BO" selected>${boliviaData.name} (BOB - Bs)</option>`;
    
    otherCountries.forEach(([key, value]) => {
        optionsHtml += `<option value="${key}">${value.name} (USD - $)</option>`;
    });

    // Añadir la opción de desborde del resto del mundo al final
    optionsHtml += `<option value="EXT">${countryConfig["EXT"].name} (USD - $)</option>`;
    
    selectEl.innerHTML = optionsHtml;
    
    // Vincular el evento de cambio para redibujar la UI local
    selectEl.addEventListener("change", (e) => {
        updateInterface(e.target.value);
    });
}

// Función auxiliar matemática para formatear la hora desplazando el huso horario real
function formatShiftedTime(startHour, startMin, endHour, endMin, offset, tzLabel) {
    let sH = (startHour + offset + 24) % 24;
    let eH = (endHour + offset + 24) % 24;
    
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(sH)}:${pad(startMin)} - ${pad(eH)}:${pad(endMin)} (${tzLabel})`;
}

// Función que define las plantillas de mensaje profesional en caso de estar vacío un bloque
function getEmptySectionTemplate(titulo) {
    return `
        <div class="w-full text-center py-10 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
            <i class="bi bi-folder-x text-slate-600 text-3xl block mb-2"></i>
            <p class="text-sm font-medium text-slate-400">No hay cursos ${titulo} por el momento.</p>
            <p class="text-xs text-slate-500 mt-1">Mantente al tanto de nuestras redes oficiales para las próximas aperturas trimestrales.</p>
        </div>`;
}

// ==========================================
// ARCHIVO: script.js (PARTE 2.2 DE 3)
// ==========================================

// Renderizar dinámicamente las tarjetas de los cursos según su estado temporal
function renderCursosCategorizados(countryKey) {
    const config = countryConfig[countryKey] || countryConfig["EXT"];
    const containerDisponibles = document.getElementById("cursos-disponibles");
    const containerProximos = document.getElementById("cursos-proximos");
    const containerIniciados = document.getElementById("cursos-iniciados");

    if (!containerDisponibles || !containerProximos || !containerIniciados) return;

    // Inicializar variables de acumulación de código HTML
    let htmlDisponibles = "";
    let htmlProximos = "";
    let htmlIniciados = "";

    cursosBaseData.forEach(curso => {
        const fechaInicio = new Date(curso.fechaInicioStr + "T00:00:00");
        let estadoCurso = "disponible";

        // Lógica de asignación de categorías basada en la fecha fija de hoy (15-Sep-2026)
        if (FECHA_HOY >= fechaInicio) {
            estadoCurso = "iniciado";
        } else if (curso.id === "curso_proximamente_placeholder") {
            estadoCurso = "proximo";
        } else {
            estadoCurso = "disponible";
        }

        // Definición localizada de precios según divisa del país seleccionado
        const precioMostrado = config.currency === "BOB" ? `${curso.precioBOB} BOB` : `${curso.precioUSD} USD`;

        // Procesamiento localizado de horarios con desfases de zona horaria (UNIFICADO)
        const sched = baseSchedules[curso.langKey];
        const hStr = formatShiftedTime(sched.startHour, sched.startMin, sched.endHour, sched.endMin, config.offset, config.tzLabel);

        horariosHtml = `
            <div class="space-y-1">
                <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Días y Horarios locales</p>
                <p class="text-sm text-slate-300 flex items-center gap-1.5">
                    <i class="bi bi-calendar3 text-slate-400"></i> ${sched.daysLabel}
                </p>
                <p class="text-sm text-slate-400 flex items-center gap-1.5">
                    <i class="bi bi-clock text-slate-500"></i>
                    <span class="font-medium text-slate-200">${hStr}</span>
                </p>
            </div>`;


        // Estructuración de las etiquetas superiores de estado
        let badgeEstadoHtml = "";
        if (estadoCurso === "iniciado") {
            badgeEstadoHtml = `
                <span class="text-xs font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md flex items-center gap-1 w-max">
                    <span class="inline-flex h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span> Ya empezó / En desarrollo
                </span>`;
        } else {
            badgeEstadoHtml = `
                <span class="text-xs font-bold uppercase tracking-widest ${curso.badgeClass} px-2.5 py-1 rounded-md flex items-center gap-1 w-max">
                    <i class="bi ${curso.icon}"></i> ${curso.subtitulo}
                </span>`;
        }

        const textoInscripcion = "Hola, deseo inscribirme al curso de " + curso.name + ". Solicito los datos de facturación.";
        const textoCodificado = encodeURIComponent(textoInscripcion);
        const whatsappUrl = "https://api.whatsapp.com/send?phone=" + WHATSAPP_PHONE + "&text=" + textoCodificado;


        // Construcción de la macro-tarjeta interactiva
        const cardHtml = `
        <div class="backdrop-blur-md bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-[1px] group hover:bg-gradient-to-r hover:from-${curso.colorPrincipal}-500 hover:to-amber-400 hover:border-transparent transition-all duration-300">
          <div class="bg-slate-950/95 w-full h-full rounded-[15px] overflow-hidden">
            <div class="bg-slate-950 px-4 py-3 border-b border-slate-800/60 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              </div>
              <span class="text-xs font-mono text-slate-500 tracking-wider flex items-center gap-1.5">
                <i class="bi bi-file-earmark-code text-slate-600"></i> ${curso.langKey}_script
              </span>
            </div>
            <div class="p-6 md:p-8">
              <div class="flex justify-between items-start mb-4">
                <div>
                  ${badgeEstadoHtml}
                  <h2 class="text-3xl font-extrabold mt-2 text-slate-100">${curso.name}</h2>
                  <p class="text-[11px] text-${curso.colorPrincipal}-400 font-mono mt-1">Inicio oficial: ${curso.fechaInicioStr.split('-').reverse().join('/')}</p>
                </div>
                <img src="${curso.img}" alt="Logo de ${curso.name}" class="w-14 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
              </div>
              <p class="text-sm text-slate-400 mb-6">${curso.descripcion}</p>
              <div class="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs flex items-center justify-between text-slate-300 mb-6">
                <span class="flex items-center gap-1.5">
                  <i class="bi bi-bar-chart-line text-${curso.colorPrincipal}-400"></i>
                  <strong>Carga Académica:</strong> ${curso.cargaHoraria}
                </span>
                <span class="text-${curso.colorPrincipal}-400 font-bold uppercase tracking-wider bg-${curso.colorPrincipal}-400/10 px-2 py-0.5 rounded">${curso.clasesTotal} Clases</span>
              </div>

              
              <!-- Contenedor dinámico donde se inyectará el contenido académico modular -->
              <div class="mb-6 data-syllabus-load" data-url="${curso.urlSyllabus}">
                 <p class="text-xs text-slate-700 animate-pulse flex items-center gap-1"><i class="bi bi-arrow-repeat animate-spin"></i> Cargando temario del módulo...</p>
              </div>

              <div class="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div class="w-full sm:w-auto">${horariosHtml}</div>
                <div class="text-left sm:text-right">
                  <p class="text-xs text-slate-500 uppercase font-bold tracking-wider">Inversión Oficial</p>
                  <p class="text-3xl font-black text-${curso.colorPrincipal}-400 font-mono">${precioMostrado}</p>
                </div>
              </div>
              <a href="${whatsappUrl}" target="_blank" class="mt-6 w-full bg-slate-100 hover:bg-${curso.colorPrincipal}-500 hover:text-slate-950 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 transform active:scale-98 text-sm md:text-base shadow-lg shadow-black/40">
                <i class="bi bi-whatsapp"></i> Inscribirme
              </a>
            </div>
          </div>
        </div>`;

        if (estadoCurso === "disponible") htmlDisponibles += cardHtml;
        if (estadoCurso === "proximo") htmlProximos += cardHtml;
        if (estadoCurso === "iniciado") htmlIniciados += cardHtml;
    });

    // Inyectar el HTML o la plantilla de sección vacía profesional
    containerDisponibles.innerHTML = htmlDisponibles || getEmptySectionTemplate("disponibles");
    containerProximos.innerHTML = htmlProximos || getEmptySectionTemplate("en fase de planificación");
    containerIniciados.innerHTML = htmlIniciados || getEmptySectionTemplate("en desarrollo actualmente");

    // Invocar de inmediato el lector asíncrono modular
    cargarSyllabusModulares();
}

// ==========================================
// ARCHIVO: script.js (PARTE 3.1 DE 3)
// ==========================================

// Motor asíncrono para leer e inyectar los contenidos académicos desde archivos externos
function cargarSyllabusModulares() {
    const targets = document.querySelectorAll(".data-syllabus-load");
    
    targets.forEach(target => {
        const url = target.getAttribute("data-url");
        if (!url) return;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el archivo modular");
                return response.text();
            })
            .then(htmlContent => {
                target.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error("Error cargando malla académica:", error);
                target.innerHTML = `
                    <p class="text-xs text-rose-500 bg-rose-500/10 p-2 rounded border border-rose-500/20">
                        <i class="bi bi-exclamation-triangle"></i> No se pudo cargar el temario en este momento.
                    </p>`;
            });
    });
}

// ==========================================
// MÓDULO: CONFIGURACIÓN DINÁMICA DEL CALENDARIO (PARTE 1)
// ==========================================

// Estado inicial del lenguaje del calendario
let activeTimelineLanguage = "pseint";

// PSeInt: Lunes a Jueves (32 Clases desde el 1 de Septiembre)
const pseint_sep = "1 2 3 7 8 9 10 14 15 16 17 21 22 23 24 28 29 30".split(" ").map(Number);
const pseint_oct = "1 5 6 7 8 12 13 14 15 19 20 21 22 26".split(" ").map(Number);
const pseint_nov = []; 

// Python: Lunes, Miércoles y Viernes (Desde el 14 de Septiembre)
const python_sep = "14 16 18 21 23 25 28 30".split(" ").map(Number);
const python_oct = "2 5 7 9 12 14 16 19 21 23 26 28 30".split(" ").map(Number);
const python_nov = []; 

// Java: Lunes y Miércoles (Desde el 14 de Septiembre)
const java_sep = "14 16 21 23 28 30".split(" ").map(Number);
const java_oct = "5 7 12 14 19 21 26 28".split(" ").map(Number);
const java_nov = "2".split(" ").map(Number);

// C++: Martes y Jueves (15 Clases desde el 22 de Septiembre)
const cpp_sep = "22 24 29".split(" ").map(Number);
const cpp_oct = "1 6 8 13 15 20 22 27 29".split(" ").map(Number);
const cpp_nov = "3 5 10".split(" ").map(Number);

// Diccionario maestro unificado con soporte para SUSPENSIONES manuales
const timelineSchedule = {
    pseint: {
        color: "emerald",
        legend: `<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Frecuencia PSeInt: Lun, Mar, Mié y Jue (32 Clases)</div>`,
        months: {
            SEP: { name: "Septiembre", num: 9, totalDays: 30, startOffset: 1, classes: pseint_sep, suspensions: [14] }, // <- El 14 de PSeInt dará X roja
            OCT: { name: "Octubre", num: 10, totalDays: 31, startOffset: 3, classes: pseint_oct, suspensions: [] },
            NOV: { name: "Noviembre", num: 11, totalDays: 30, startOffset: 6, classes: pseint_nov, suspensions: [] }
        }
    },
    java: {
        color: "orange",
        legend: `<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> Frecuencia Java: Lunes y Miércoles (15 Clases)</div>`,
        months: {
            SEP: { name: "Septiembre", num: 9, totalDays: 30, startOffset: 1, classes: java_sep, suspensions: [] },
            OCT: { name: "Octubre", num: 10, totalDays: 31, startOffset: 3, classes: java_oct, suspensions: [] },
            NOV: { name: "Noviembre", num: 11, totalDays: 30, startOffset: 6, classes: java_nov, suspensions: [] }
        }
    },
    python: {
        color: "blue",
        legend: `<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Frecuencia Python: Lun, Mié y Vie (20 Clases)</div>`,
        months: {
            SEP: { name: "Septiembre", num: 9, totalDays: 30, startOffset: 1, classes: python_sep, suspensions: [] },
            OCT: { name: "Octubre", num: 10, totalDays: 31, startOffset: 3, classes: python_oct, suspensions: [] },
            NOV: { name: "Noviembre", num: 11, totalDays: 30, startOffset: 6, classes: python_nov, suspensions: [] }
        }
    },
    cpp: {
        color: "cyan",
        legend: `<div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span> Frecuencia C++: Martes y Jueves (15 Clases)</div>`,
        months: {
            SEP: { name: "Septiembre", num: 9, totalDays: 30, startOffset: 1, classes: cpp_sep, suspensions: [] },
            OCT: { name: "Octubre", num: 10, totalDays: 31, startOffset: 3, classes: cpp_oct, suspensions: [] },
            NOV: { name: "Noviembre", num: 11, totalDays: 30, startOffset: 6, classes: cpp_nov, suspensions: [] }
        }
    }
};
// ==========================================
// MÓDULO: LÓGICA DE CONTROL Y RENDERIZADO (PARTE 2)
// ==========================================

// Función encargada de estructurar las celdas del calendario y validar días pasados
function renderTrimestralTimeline() {
    const container = document.getElementById("timeline-months-container");
    const legendEl = document.getElementById("timeline-legend");
    if (!container || !legendEl) return;

    const currentSchedule = timelineSchedule[activeTimelineLanguage];
    legendEl.innerHTML = currentSchedule.legend;
    container.innerHTML = "";

    // Obtener la fecha del sistema en tiempo real (HOY absoluto al cargar la página)
    const HOY = new Date();
    // Limpiamos las horas para comparar puramente números de calendario día a día
    const fechaHoyPlana = new Date(HOY.getFullYear(), HOY.getMonth(), HOY.getDate());

    // Nombres oficiales ordenados estrictamente de Lunes a Domingo
    const weekDaysLabels = ["L", "M", "M", "J", "V", "S", "D"];

    for (const [key, month] of Object.entries(currentSchedule.months)) {
        const monthCard = document.createElement("div");
        monthCard.className = "bg-slate-950/60 border border-slate-800/40 p-4 rounded-xl space-y-3 flex-1 w-full shadow-inner";
        
        monthCard.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-900 pb-2 mb-1">
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">${month.name}</span>
                <span class="text-[10px] text-slate-500 font-medium">2026</span>
            </div>
        `;

        const daysGrid = document.createElement("div");
        daysGrid.className = "grid grid-cols-7 gap-2 pt-1 justify-items-center";

        // Inyectar etiquetas de los días de la semana
        weekDaysLabels.forEach(label => {
            const labelSpan = document.createElement("span");
            labelSpan.className = "text-[10px] font-bold text-slate-500 font-sans w-7 h-4 flex items-center justify-center select-none";
            labelSpan.textContent = label;
            daysGrid.appendChild(labelSpan);
        });

        // Celdas vacías para desfasar el inicio de cada mes
        for (let i = 0; i < month.startOffset; i++) {
            const blankSpan = document.createElement("span");
            blankSpan.className = "w-7 h-7 bg-transparent border border-transparent";
            daysGrid.appendChild(blankSpan);
        }

        // Renderizar los días numéricos del mes
        for (let day = 1; day <= month.totalDays; day++) {
            const dayBadge = document.createElement("span");
            let badgeClass = "w-7 h-7 text-[11px] font-mono font-bold rounded-lg flex items-center justify-center border transition-all ";
            
            // Forzar la creación de la fecha de la celda actual en la hora local del navegador
            const cellDate = new Date(2026, month.num - 1, day);

            // Buscar si el día actual es parte de las clases del curso activo
            let isClassDay = false;
            if (month.classes && month.classes.includes(day)) { 
                isClassDay = true; 
            }

            if (isClassDay) {
                // CONDICIÓN AUTOMÁTICA: Si el día ya pasó con respecto a la fecha actual del sistema
                if (fechaHoyPlana > cellDate) {
                    
                    // REVISIÓN MANUAL: ¿Este día específico está dentro del array de clases suspendidas?
                    if (month.suspensions && month.suspensions.includes(day)) {
                        // Pintar la X Roja de clase suspendida
                        badgeClass += "bg-red-500/10 border-red-500/40 text-red-500 font-black shadow-md shadow-red-950/20";
                        dayBadge.innerHTML = `<i class="bi bi-x-lg text-[12px]"></i>`;
                    } else {
                        // Pintar el Check Verde de clase realizada con normalidad
                        badgeClass += "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-black shadow-md shadow-emerald-950/20";
                        dayBadge.innerHTML = `<i class="bi bi-check-lg text-[13px]"></i>`;
                    }

                } else {
                    // Si es un día futuro o el día de hoy en curso, aplica el color de marca único del lenguaje
                    if (activeTimelineLanguage === "python") {
                        badgeClass += "bg-blue-600/20 border-blue-500/50 text-blue-400 font-black shadow-md";
                    } else if (activeTimelineLanguage === "pseint") {
                        badgeClass += "bg-emerald-600/20 border-emerald-500/50 text-emerald-400 font-black shadow-md";
                    } else if (activeTimelineLanguage === "java") {
                        badgeClass += "bg-orange-600/20 border-orange-500/50 text-orange-400 font-black shadow-md";
                    } else if (activeTimelineLanguage === "cpp") {
                        badgeClass += "bg-cyan-600/20 border-cyan-500/50 text-cyan-400 font-black shadow-md";
                    }
                    dayBadge.textContent = day;
                }
            } else {
                // Días comunes sin clases ordinarias
                badgeClass += "bg-transparent border-transparent text-slate-600 font-normal";
                dayBadge.textContent = day;
            }

            dayBadge.className = badgeClass;
            daysGrid.appendChild(dayBadge);
        }

        monthCard.appendChild(daysGrid);
        container.appendChild(monthCard);
    }
}

// Intercambiador interactivo de pestañas del cronograma
function updateTimelineTabsUI(langKey) {
    const listButtons = ["pseint", "java", "python", "cpp"];
    
    listButtons.forEach(key => {
        const btn = document.getElementById(`timeline-btn-${key}`);
        if (!btn) return;

        if (key === langKey) {
            // Estilos activos personalizados según el color de marca de cada curso
            let activeStyles = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 text-white shadow-lg ";
            if(key === 'pseint') activeStyles += "bg-emerald-600 shadow-emerald-600/10";
            if(key === 'java') activeStyles += "bg-orange-600 shadow-orange-600/10";
            if(key === 'python') activeStyles += "bg-blue-600 shadow-blue-600/10";
            if(key === 'cpp') activeStyles += "bg-cyan-600 shadow-cyan-600/10";
            
            btn.className = activeStyles;
        } else {
            // Estilos inactivos genéricos uniformes
            btn.className = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200";
        }
    });
}

// Enrutador de lenguajes del calendario global
function switchTimelineLanguage(langKey) {
    activeTimelineLanguage = langKey;
    updateTimelineTabsUI(langKey);
    renderTrimestralTimeline();
}

// Inicializador maestro unificado de la interfaz
function updateInterface(countryKey) {
    if (typeof renderCursosCategorizados === "function") {
        renderCursosCategorizados(countryKey);
    }
    renderTrimestralTimeline();
    updateTimelineTabsUI(activeTimelineLanguage);
}

// Orquestador inicial de arranque nativo del DOM
document.addEventListener("DOMContentLoaded", () => {
    if (typeof initializeCountrySelect === "function") {
        initializeCountrySelect();
    }
    // Arrancar la interfaz evaluando inicialmente con el valor por defecto
    updateInterface("BO");
});
