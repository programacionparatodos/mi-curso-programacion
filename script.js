// ==========================================
// ARCHIVO: script.js (PARTE 1 DE 3 CORREGIDA)
// ==========================================

// Configuración global del sistema
const WHATSAPP_PHONE = "59175426858";

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
                <div class="flex items-center justify-center bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-xs tracking-tighter shadow-sm">
                    BNB
                </div>
            </div>
            <div class="bg-slate-950 border border-slate-800/60 rounded-xl p-4 text-xs space-y-3 leading-relaxed text-slate-400">
                <p class="text-slate-300 font-medium flex items-center gap-1.5">
                    <span class="text-amber-500">▪</span> Depósito o Transferencia QR Simple
                </p>
                <p>Solicita el código QR oficial de recaudación directo al presionar el botón de inscripción de tu curso. Acreditación inmediata mediante la banca móvil de <strong>Banco Nacional de Bolivia (BNB)</strong> u otros bancos autorizados.</p>
            </div>
        </div>
    `;
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
        </div>
    `;
}
// ==========================================
// ARCHIVO: script.js (PARTE 2 DE 3 CORREGIDA)
// ==========================================

// Base de Datos Única de Países, Precios y Horarios Localizados
const countryData = {
    BO: { name: "Bolivia", currency: "BOB", price: 250, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getNationalMethods },
    MX: { name: "México", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    GT: { name: "Guatemala", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    HN: { name: "Honduras", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    SV: { name: "El Salvador", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    NI: { name: "Nicaragua", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    CR: { name: "Costa Rica", currency: "USD", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: { lunMieVie: "20:00 - 21:30", marJue: "19:30 - 21:30" }, methods: getIntlMethods },
    PA: { name: "Panamá", currency: "USD", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: { lunMieVie: "21:00 - 22:30", marJue: "20:30 - 22:30" }, methods: getIntlMethods },
    DO: { name: "Rep. Dominicana", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods },
    PR: { name: "Puerto Rico", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods },
    CU: { name: "Cuba", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods },
    PE: { name: "Perú", currency: "USD", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: { lunMieVie: "21:00 - 22:30", marJue: "20:30 - 22:30" }, methods: getIntlMethods },
    CO: { name: "Colombia", currency: "USD", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: { lunMieVie: "21:00 - 22:30", marJue: "20:30 - 22:30" }, methods: getIntlMethods },
    CL: { name: "Chile", currency: "USD", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: { lunMieVie: "23:00 - 00:30", marJue: "22:30 - 00:30" }, methods: getIntlMethods },
    EC: { name: "Ecuador", currency: "USD", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: { lunMieVie: "21:00 - 22:30", marJue: "20:30 - 22:30" }, methods: getIntlMethods },
    VE: { name: "Venezuela", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods },
    PY: { name: "Paraguay", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods },
    UY: { name: "Uruguay", currency: "USD", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: { lunMieVie: "23:00 - 00:30", marJue: "22:30 - 00:30" }, methods: getIntlMethods },
    AR: { name: "Argentina", currency: "USD", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: { lunMieVie: "23:00 - 00:30", marJue: "22:30 - 00:30" }, methods: getIntlMethods },
    EXT: { name: "Exterior", currency: "USD", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: { lunMieVie: "22:00 - 23:30", marJue: "21:30 - 23:30" }, methods: getIntlMethods }
};
// ==========================================
// ARCHIVO: script.js (PARTE 3 DE 3 CORREGIDA)
// ==========================================

// Actualización Completa de la Interfaz Dinámica
function updateInterface(countryKey) {
    const data = countryData[countryKey] || countryData['EXT'];

    // 1. Renderizar Horarios de Java y C++
    if(document.getElementById('java-time')) document.getElementById('java-time').textContent = data.javaTime + " (Hora " + countryKey + ")";
    if(document.getElementById('cpp-time')) document.getElementById('cpp-time').textContent = data.cppTime + " (Hora " + countryKey + ")";
    
    // 2. Renderizar AMBOS Horarios de Python de manera independiente sin colisiones de ID
    if(document.getElementById('python-time-1')) document.getElementById('python-time-1').textContent = data.pythonTime.lunMieVie + " (Hora " + countryKey + ")";
    if(document.getElementById('python-time-2')) document.getElementById('python-time-2').textContent = data.pythonTime.marJue + " (Hora " + countryKey + ")";

    // 3. Renderizar los Precios Oficiales coordinados por moneda
    if(document.getElementById('java-price')) document.getElementById('java-price').textContent = data.price + " " + data.currency;
    if(document.getElementById('cpp-price')) document.getElementById('cpp-price').textContent = data.price + " " + data.currency;
    if(document.getElementById('python-price')) document.getElementById('python-price').textContent = data.price + " " + data.currency;

    // 4. Inyectar pasarelas de pago y refrescar enlaces de chat
    const paymentContainer = document.getElementById('payment-container');
    if (paymentContainer) paymentContainer.innerHTML = data.methods();
    
    updateWhatsAppLinks(data);
}

// Generación Segura de Enlaces de Redirección a WhatsApp
function updateWhatsAppLinks(data) {
    const javaText = "Hola, soy de " + data.name + ", me interesa el curso de Java y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";
    const cppText = "Hola, soy de " + data.name + ", me interesa el curso de C++ y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";
    const pythonText = "Hola, soy de " + data.name + ", me interesa el curso de Python y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";

    if(document.getElementById('java-btn')) document.getElementById('java-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(javaText);
    if(document.getElementById('cpp-btn')) document.getElementById('cpp-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(cppText);
    if(document.getElementById('python-btn')) document.getElementById('python-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(pythonText);
}

// Reloj de Control Regresivo en Vivo
function startCountdown() {
    const targetDate = new Date("September 14, 2026 19:30:00").getTime();
    const countdownEl = document.getElementById("countdown");
    if (!countdownEl) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            countdownEl.textContent = "¡Las clases han comenzado! Cupos de rezagados activos.";
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        countdownEl.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    }, 1000);
}

// Inicializador Único del Entorno DOM
document.addEventListener("DOMContentLoaded", () => {
    const countrySelect = document.getElementById('country-select');
    if (countrySelect) {
        countrySelect.addEventListener('change', (e) => {
            updateInterface(e.target.value);
        });
    }

    // Inicializar por defecto la región de Bolivia
    updateInterface('BO');
    startCountdown();
});







// ==========================================
// MÓDULO AUTÓNOMO: CALENDARIO TRIMESTRAL COMPLETADO
// ==========================================

// 1. Estado inicial del lenguaje del calendario
let activeTimelineLanguage = "python";

// 2. Cadenas de texto seguras con las fechas oficiales de clases
const python_sep_g1 = "14, 16, 18, 21, 23, 25, 28, 30";
const python_sep_g2 = "15, 17, 22, 24, 29";
const python_oct_g1 = "2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26, 28, 30";
const python_oct_g2 = "1, 6, 8, 13, 15, 20, 22, 27, 29";
const python_nov_g1 = "";
const python_nov_g2 = "3";

const java_sep_g1 = "14, 16, 21, 23, 28, 30";
const java_oct_g1 = "5, 7, 12, 14, 19, 21, 26, 28";
const java_nov_g1 = "2";

// 3. Diccionario trimestral con días máximos y desplazamientos de Lunes a Domingo
const timelineSchedule = {
    python: {
        legend: `
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Frecuencia 1: Lun, Mié y Vie (20 Clases)</div>
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Frecuencia 2: Mar y Jue (15 Clases)</div>
        `,
        months: {
            SEP: { name: "Septiembre", totalDays: 30, startOffset: 1, group1: python_sep_g1.split(",").map(Number).filter(Boolean), group2: python_sep_g2.split(",").map(Number).filter(Boolean) },
            OCT: { name: "Octubre", totalDays: 31, startOffset: 3, group1: python_oct_g1.split(",").map(Number).filter(Boolean), group2: python_oct_g2.split(",").map(Number).filter(Boolean) },
            NOV: { name: "Noviembre", totalDays: 30, startOffset: 6, group1: python_nov_g1.split(",").map(Number).filter(Boolean), group2: python_nov_g2.split(",").map(Number).filter(Boolean) }
        }
    },
    java: {
        legend: `
            <div class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> Frecuencia Única: Lunes y Miércoles (15 Clases)</div>
        `,
        months: {
            SEP: { name: "Septiembre", totalDays: 30, startOffset: 1, group1: java_sep_g1.split(",").map(Number).filter(Boolean), group2: [] },
            OCT: { name: "Octubre", totalDays: 31, startOffset: 3, group1: java_oct_g1.split(",").map(Number).filter(Boolean), group2: [] },
            NOV: { name: "Noviembre", totalDays: 30, startOffset: 6, group1: java_nov_g1.split(",").map(Number).filter(Boolean), group2: [] }
        }
    }
};

// 4. Función encargada de estructurar las celdas y mapear los números del 1 al 31
function renderTrimestralTimeline() {
    const container = document.getElementById("timeline-months-container");
    const legendEl = document.getElementById("timeline-legend");
    if (!container || !legendEl) return;

    const data = timelineSchedule[activeTimelineLanguage];
    legendEl.innerHTML = data.legend;
    container.innerHTML = "";

    // Nombres oficiales ordenados obligatoriamente de Lunes a Domingo
    const weekDaysLabels = ["L", "M", "M", "J", "V", "S", "D"];

    for (const [key, month] of Object.entries(data.months)) {
        const monthCard = document.createElement("div");
        monthCard.className = "bg-slate-950/60 border border-slate-900 p-4 rounded-xl space-y-3 flex-1 w-full shadow-inner";
        
        monthCard.innerHTML = `
            <div class="flex items-center justify-between border-b border-slate-900 pb-2 mb-1">
                <span class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">${month.name}</span>
                <span class="text-[10px] text-slate-500 font-medium">2026</span>
            </div>
        `;

        const daysGrid = document.createElement("div");
        daysGrid.className = "grid grid-cols-7 gap-2 pt-1 justify-items-center";

        // Inyectar los nombres de los días en la fila superior
        weekDaysLabels.forEach(label => {
            const labelSpan = document.createElement("span");
            labelSpan.className = "text-[10px] font-bold text-slate-500 font-sans w-7 h-4 flex items-center justify-center select-none";
            labelSpan.textContent = label;
            daysGrid.appendChild(labelSpan);
        });

        // Generar los espacios vacíos correspondientes para desfasar el inicio de mes
        for (let i = 0; i < month.startOffset; i++) {
            const blankSpan = document.createElement("span");
            blankSpan.className = "w-7 h-7 bg-transparent border border-transparent";
            daysGrid.appendChild(blankSpan);
        }

        // Pintar la lista numérica completa de días reales del mes
        for (let day = 1; day <= month.totalDays; day++) {
            const dayBadge = document.createElement("span");
            let badgeClass = "w-7 h-7 text-[11px] font-mono font-bold rounded-lg flex items-center justify-center border transition-all ";

            if (activeTimelineLanguage === "python") {
                if (month.group1.includes(day)) {
                    badgeClass += "bg-blue-600/20 border-blue-500/50 text-blue-400 font-black shadow-md";
                } else if (month.group2.includes(day)) {
                    badgeClass += "bg-amber-500/20 border-amber-500/50 text-amber-400 font-black shadow-md";
                } else {
                    badgeClass += "bg-transparent border-transparent text-slate-600 font-normal";
                }
            } else if (activeTimelineLanguage === "java") {
                if (month.group1.includes(day)) {
                    badgeClass += "bg-orange-600/20 border-orange-500/50 text-orange-400 font-black shadow-md";
                } else {
                    badgeClass += "bg-transparent border-transparent text-slate-600 font-normal";
                }
            }

            dayBadge.className = badgeClass;
            dayBadge.textContent = day;
            daysGrid.appendChild(dayBadge);
        }

        monthCard.appendChild(daysGrid);
        container.appendChild(monthCard);
    }
}

// 5. Función de control interactivo para las pestañas de los lenguajes
function switchTimelineLanguage(langKey) {
    activeTimelineLanguage = langKey;
    const btnPython = document.getElementById("timeline-btn-python");
    const btnJava = document.getElementById("timeline-btn-java");

    if (!btnPython || !btnJava) return;

    if (langKey === "python") {
        btnPython.className = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-blue-600 text-white shadow-lg shadow-blue-600/10";
        btnJava.className = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 text-slate-400 hover:text-slate-200";
    } else {
        btnJava.className = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 bg-orange-600 text-white shadow-lg shadow-orange-600/10";
        btnPython.className = "flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200";
    }

    renderTrimestralTimeline();
}

// 6. Disparador inmediato automático al cargar la página
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderTrimestralTimeline);
} else {
    renderTrimestralTimeline();
}




