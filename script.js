// ==========================================
// ARCHIVO: script.js (PARTE 1 DE 3)
// ==========================================

// Configuración global y variables de estado del sistema
const WHATSAPP_PHONE = "59175426858";
let currentMonthView = "SEP";
let currentLanguageFilter = "python";

// Matriz oficial con los días numéricos de tus clases en vivo
const classDays = {
    SEP: {
        blankDays: 2, 
        totalDays: 30,
        java: "14,16,21,23,28,30".split(",").map(Number),
        python: "14,16,18,21,23,25,28,30".split(",").map(Number),
        cpp: "15,17,22,24,29".split(",").map(Number)
    },
    OCT: {
        blankDays: 4, 
        totalDays: 31,
        java: "5,7,12,14,19,21,26,28".split(",").map(Number),
        python: "2,5,7,9,12,14,16,19,21,23,26,28,30".split(",").map(Number),
        cpp: "1,6,8,13,15,20,22,27,29".split(",").map(Number)
    },
    NOV: {
        blankDays: 0, 
        totalDays: 30,
        java: "2".split(",").map(Number),
        python: [],
        cpp: "3".split(",").map(Number)
    }
};

// Generador corregido con ícono vectorial premium para Bolivia
function getNationalMethods() {
    return `
        <div class="space-y-4">
            <div class="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 p-3 rounded-xl">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Moneda Local</span>
                    <!-- ÍCONO CORREGIDO: Usamos bi-bank en lugar de los cuadritos rotos -->
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


function getIntlMethods() {
    return `
        <div class="space-y-4">
            <div class="bg-slate-950/40 border border-slate-800/40 p-2 text-center rounded-lg">
                <span class="text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">🌐 Pasarelas Internacionales</span>
            </div>

            <!-- Método 1: PayPal -->
            <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div class="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span class="text-xs font-bold text-blue-400 font-mono">01 / PAYPAL</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">USD</span>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">
                    Pago seguro con tarjeta de crédito o débito internacional. Solicita nuestro enlace oficial de cobro directo por chat.
                </p>
            </div>

            <!-- Método 2: Takenos -->
            <div class="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl space-y-2">
                <div class="flex justify-between items-center pb-2 border-b border-slate-900">
                    <span class="text-xs font-bold text-emerald-400 font-mono">02 / TAKENOS</span>
                    <span class="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">QR Internacional</span>
                </div>
                <p class="text-xs text-slate-400 leading-relaxed">
                    Pago rápido en tu moneda local o dólares mediante QR. Solicita tu código personalizado de inscripción directa por WhatsApp.
                </p>
            </div>
        </div>
    `;
}

// ==========================================
// ARCHIVO: script.js (CORRECCIÓN VENEZUELA - PARTE 1)
// ==========================================

const countryData = {
    // País Local
    BO: { name: "Bolivia", currency: "BOB", symbol: "Bs", price: 250, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getNationalMethods },
    
    // Todos los demás países unificados a 35 USD
    MX: { name: "México", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    GT: { name: "Guatemala", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    HN: { name: "Honduras", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    SV: { name: "El Salvador", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    NI: { name: "Nicaragua", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    CR: { name: "Costa Rica", currency: "USD", symbol: "$", price: 35, javaTime: "17:30 - 19:30", cppTime: "17:30 - 19:30", pythonTime: "20:00 - 21:30", methods: getIntlMethods },
    PA: { name: "Panamá", currency: "USD", symbol: "$", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: "21:00 - 22:30", methods: getIntlMethods },
    DO: { name: "Rep. Dominicana", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getIntlMethods },
    PR: { name: "Puerto Rico", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getIntlMethods },
    CU: { name: "Cuba", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getIntlMethods }
};

const southernCountries = {
    PE: { name: "Perú", currency: "USD", symbol: "$", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: "21:00 - 22:30", methods: getIntlMethods },
    CO: { name: "Colombia", currency: "USD", symbol: "$", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: "21:00 - 22:30", methods: getIntlMethods },
    CL: { name: "Chile", currency: "USD", symbol: "$", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: "23:00 - 00:30", methods: getIntlMethods },
    EC: { name: "Ecuador", currency: "USD", symbol: "$", price: 35, javaTime: "18:30 - 20:30", cppTime: "18:30 - 20:30", pythonTime: "21:00 - 22:30", methods: getIntlMethods },
    VE: { name: "Venezuela", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getIntlMethods },
    PY: { name: "Paraguay", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30", cppTime: "19:30 - 21:30", pythonTime: "22:00 - 23:30", methods: getIntlMethods },
    UY: { name: "Uruguay", currency: "USD", symbol: "$", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: "23:00 - 00:30", methods: getIntlMethods },
    AR: { name: "Argentina", currency: "USD", symbol: "$", price: 35, javaTime: "20:30 - 22:30", cppTime: "20:30 - 22:30", pythonTime: "23:00 - 00:30", methods: getIntlMethods },
    EXT: { name: "Exterior", currency: "USD", symbol: "$", price: 35, javaTime: "19:30 - 21:30 (Hora BO)", cppTime: "19:30 - 21:30 (Hora BO)", pythonTime: "22:00 - 23:30 (Hora BO)", methods: getIntlMethods }
};

Object.assign(countryData, southernCountries);



// ==========================================
// ARCHIVO: script.js (OPTIMIZACIÓN CALENDARIO - PARTE 1)
// ==========================================

// MOTOR DEL CALENDARIO VISUAL INTERACTIVO CON COLORES DE MARCA Y HORARIOS DINÁMICOS
function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    const monthData = classDays[currentMonthView];
    
    // Obtener los datos del país seleccionado actualmente para los horarios del tooltip
    const selectedCountry = document.getElementById('country-select').value;
    const currentData = countryData[selectedCountry] || countryData['EXT'];
    
    // Rellenar días vacíos al inicio de la semana
    for (let i = 0; i < monthData.blankDays; i++) {
        const blank = document.createElement("div");
        blank.className = "py-2 text-transparent select-none";
        grid.appendChild(blank);
    }
    
    // Obtener los días de clases del lenguaje seleccionado en las pestañas
    const activeDays = monthData[currentLanguageFilter] || [];
    
    // Pintar los casilleros numéricos del mes en pantalla
    for (let day = 1; day <= monthData.totalDays; day++) {
        const cell = document.createElement("div");
        cell.textContent = day;
        
        let cellClass = "py-2 rounded-xl transition-all duration-300 relative flex flex-col items-center justify-center font-medium ";
        
        if (activeDays.includes(day)) {
            cellClass += "font-bold shadow-xl group cursor-help border border-transparent ";
            
            // 1. Asignar colores de fondo, texto y efectos hover personalizados por lenguaje
            if (currentLanguageFilter === "python") {
                cellClass += "bg-blue-600 text-white shadow-blue-600/20 hover:bg-slate-950/90 hover:text-blue-400 hover:border-blue-500/50";
            } else if (currentLanguageFilter === "cpp") {
                cellClass += "bg-cyan-500 text-slate-950 shadow-cyan-500/20 hover:bg-slate-950/90 hover:text-cyan-400 hover:border-cyan-500/50";
            } else if (currentLanguageFilter === "java") {
                cellClass += "bg-orange-600 text-white shadow-orange-600/20 hover:bg-slate-950/90 hover:text-orange-400 hover:border-orange-500/50";
            }
            
            // 2. Crear el Tooltip Flotante con Horarios Localizados
            const tooltip = document.createElement("span");
            tooltip.className = "absolute bottom-full mb-2 hidden group-hover:block bg-slate-950 border border-slate-800 text-[11px] px-2.5 py-1 rounded-lg shadow-2xl whitespace-nowrap z-50 pointer-events-none tracking-wide text-slate-200 animate-fadeIn";
            
            // 3. Establecer texto y extraer el horario específico por lenguaje y país
            if (currentLanguageFilter === "python") {
                tooltip.innerHTML = `🐍 <span class="text-blue-400 font-bold">Python:</span> ${currentData.pythonTime} (Hora ${selectedCountry})`;
            } else if (currentLanguageFilter === "cpp") {
                tooltip.innerHTML = `⚙️ <span class="text-cyan-400 font-bold">C++:</span> ${currentData.cppTime} (Hora ${selectedCountry})`;
            } else if (currentLanguageFilter === "java") {
                tooltip.innerHTML = `☕ <span class="text-orange-400 font-bold">Java:</span> ${currentData.javaTime} (Hora ${selectedCountry})`;
            }
            
            cell.appendChild(tooltip);
        } else {
            // Días normales sin clases
            cellClass += "text-slate-500 hover:text-slate-300 hover:bg-slate-900/40 border border-transparent";
        }
        
        cell.className = cellClass;
        grid.appendChild(cell);
    }
}
// ==========================================
// ARCHIVO: script.js (OPTIMIZACIÓN CALENDARIO - PARTE 2)
// ==========================================

// ACTUALIZACIÓN DE PRECIOS OFICIALES Y HORARIOS EN TARJETAS
// ==========================================
// ARCHIVO: script.js (CORRECCIÓN VENEZUELA - PARTE 2)
// ==========================================

// ACTUALIZACIÓN DE PRECIOS OFICIALES Y HORARIOS EN TARJETAS
function updateInterface(countryKey) {
    const data = countryData[countryKey] || countryData['EXT'];

    // Inyecta el horario con la moneda respectiva de forma elegante
    document.getElementById('java-time').textContent = data.javaTime + " (Hora " + countryKey + ")";
    document.getElementById('cpp-time').textContent = data.cppTime + " (Hora " + countryKey + ")";
    document.getElementById('python-time').textContent = data.pythonTime + " (Hora " + countryKey + ")";

    // Actualiza los precios oficiales formateados
    document.getElementById('java-price').textContent = data.price + " " + data.currency;
    document.getElementById('cpp-price').textContent = data.price + " " + data.currency;
    document.getElementById('python-price').textContent = data.price + " " + data.currency;

    // EJECUCIÓN EN VIVO CON PARÉNTESIS (): Corrige el bug de Venezuela y el extranjero
    document.getElementById('payment-container').innerHTML = data.methods();
    updateWhatsAppLinks(data);
    
    // Redibuja el calendario para sincronizar los tooltips al instante
    renderCalendar();
}


// FUNCIÓN PARA GENERAR LOS ENLACES DINÁMICOS DE CONTACTO
function updateWhatsAppLinks(data) {
    const javaText = "Hola, soy de " + data.name + ", me interesa el curso de Java y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";
    const cppText = "Hola, soy de " + data.name + ", me interesa el curso de C++ y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";
    const pythonText = "Hola, soy de " + data.name + ", me interesa el curso de Python y quiero inscribirme. ¿Me podría facilitar los métodos de pago?";

    document.getElementById('java-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(javaText);
    document.getElementById('cpp-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(cppText);
    document.getElementById('python-btn').href = "https://wa.me/" + WHATSAPP_PHONE + "?text=" + encodeURIComponent(pythonText);
}
// ==========================================
// ARCHIVO: script.js (PARTE 3 DE 3)
// ==========================================

// CONTROLES DE LAS PESTAÑAS DEL CALENDARIO ESTILO MAC
function setLanguage(langKey) {
    currentLanguageFilter = langKey;
    const langs = ["python", "cpp", "java"];
    
    langs.forEach(lang => {
        const btn = document.getElementById("btn-lang-" + lang);
        if (btn) {
            if (lang === langKey) {
                btn.className = "px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold transition-all";
            } else {
                btn.className = "px-3 py-1.5 rounded-lg text-slate-400 font-medium hover:text-slate-200 transition-all";
            }
        }
    });
    renderCalendar();
}

function setMonth(monthKey) {
    currentMonthView = monthKey;
    const btnSept = document.getElementById("btn-sept");
    const btnOct = document.getElementById("btn-oct");
    
    if (monthKey === "SEP") {
        btnSept.className = "px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold transition-all";
        btnOct.className = "px-3 py-1.5 rounded-lg text-slate-400 font-medium hover:text-slate-200 transition-all";
    } else {
        btnSept.className = "px-3 py-1.5 rounded-lg text-slate-400 font-medium hover:text-slate-200 transition-all";
        btnOct.className = "px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold transition-all";
    }
    renderCalendar();
}



// MOTOR DEL RELOJ REGRESIVO EN VIVO (Para el 14 de Septiembre)
function startCountdown() {
    const targetDate = new Date("September 14, 2026 19:30:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            document.getElementById("countdown").textContent = "¡Las clases han comenzado! Cupos de rezagados activos.";
            return;
        }
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        document.getElementById("countdown").textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
    }, 1000);
}

// ENTRADA EN VALOR DEL ENTORNO AUTOMÁTICO AL CARGAR EL DOM
document.addEventListener("DOMContentLoaded", () => {
    // Escuchador de cambio de país en el menú selector
    document.getElementById('country-select').addEventListener('change', (e) => {
        updateInterface(e.target.value);
    });

    // Carga inicial obligatoria del sistema
    updateInterface('BO');
    renderCalendar();
    startCountdown();
});
