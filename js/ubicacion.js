"use strict";


/* =========================================================
   PROGRAMACIÓN PARA TODOS
   Motor internacional de zonas horarias

   REGLA PRINCIPAL:

   - Bolivia es SIEMPRE la referencia oficial.
   - Los horarios se almacenan en America/La_Paz.
   - El navegador detecta automáticamente la zona horaria
     IANA del visitante.
   - Las conversiones se realizan sobre fecha + hora.
   - No utilizamos diferencias manuales como +1, -2, etc.
   ========================================================= */


const PAISES_HORARIOS = [["AF","Afganistán","Asia",["Asia/Kabul"]],["AL","Albania","Europa",["Europe/Tirane"]],["DE","Alemania","Europa",["Europe/Berlin","Europe/Busingen"]],["AD","Andorra","Europa",["Europe/Andorra"]],["AO","Angola","África",["Africa/Luanda"]],["AI","Anguila","América",["America/Anguilla"]],["AG","Antigua y Barbuda","América",["America/Antigua"]],["AQ","Antártida","Antártida",["Antarctica/McMurdo","Antarctica/Casey","Antarctica/Davis","Antarctica/DumontDUrville","Antarctica/Mawson","Antarctica/Palmer","Antarctica/Rothera","Antarctica/Syowa","Antarctica/Troll","Antarctica/Vostok"]],["SA","Arabia Saudí","Asia",["Asia/Riyadh"]],["DZ","Argelia","África",["Africa/Algiers"]],["AR","Argentina","América",["America/Argentina/Buenos_Aires","America/Argentina/Cordoba","America/Argentina/Salta","America/Argentina/Jujuy","America/Argentina/Tucuman","America/Argentina/Catamarca","America/Argentina/La_Rioja","America/Argentina/San_Juan","America/Argentina/Mendoza","America/Argentina/San_Luis","America/Argentina/Rio_Gallegos","America/Argentina/Ushuaia"]],["AM","Armenia","Asia",["Asia/Yerevan"]],["AW","Aruba","América",["America/Aruba"]],["AU","Australia","Oceanía",["Australia/Lord_Howe","Antarctica/Macquarie","Australia/Hobart","Australia/Melbourne","Australia/Sydney","Australia/Broken_Hill","Australia/Brisbane","Australia/Lindeman","Australia/Adelaide","Australia/Darwin","Australia/Perth","Australia/Eucla"]],["AT","Austria","Europa",["Europe/Vienna"]],["AZ","Azerbaiyán","Asia",["Asia/Baku"]],["BS","Bahamas","América",["America/Nassau"]],["BD","Bangladés","Asia",["Asia/Dhaka"]],["BB","Barbados","América",["America/Barbados"]],["BH","Baréin","Asia",["Asia/Bahrain"]],["BZ","Belice","América",["America/Belize"]],["BJ","Benín","África",["Africa/Porto-Novo"]],["BM","Bermudas","América",["Atlantic/Bermuda"]],["BY","Bielorrusia","Europa",["Europe/Minsk"]],["BO","Bolivia","América",["America/La_Paz"]],["BA","Bosnia y Herzegovina","Europa",["Europe/Sarajevo"]],["BW","Botsuana","África",["Africa/Gaborone"]],["BR","Brasil","América",["America/Noronha","America/Belem","America/Fortaleza","America/Recife","America/Araguaina","America/Maceio","America/Bahia","America/Sao_Paulo","America/Campo_Grande","America/Cuiaba","America/Santarem","America/Porto_Velho","America/Boa_Vista","America/Manaus","America/Eirunepe","America/Rio_Branco"]],["BN","Brunéi","Asia",["Asia/Brunei"]],["BG","Bulgaria","Europa",["Europe/Sofia"]],["BF","Burkina Faso","África",["Africa/Ouagadougou"]],["BI","Burundi","África",["Africa/Bujumbura"]],["BT","Bután","Asia",["Asia/Thimphu"]],["BE","Bélgica","Europa",["Europe/Brussels"]],["CV","Cabo Verde","África",["Atlantic/Cape_Verde"]],["KH","Camboya","Asia",["Asia/Phnom_Penh"]],["CM","Camerún","África",["Africa/Douala"]],["CA","Canadá","América",["America/St_Johns","America/Halifax","America/Glace_Bay","America/Moncton","America/Goose_Bay","America/Blanc-Sablon","America/Toronto","America/Iqaluit","America/Atikokan","America/Winnipeg","America/Resolute","America/Rankin_Inlet","America/Regina","America/Swift_Current","America/Edmonton","America/Cambridge_Bay","America/Inuvik","America/Vancouver","America/Creston","America/Dawson_Creek","America/Fort_Nelson","America/Whitehorse","America/Dawson"]],["BQ","Caribe neerlandés","América",["America/Kralendijk"]],["QA","Catar","Asia",["Asia/Qatar"]],["TD","Chad","África",["Africa/Ndjamena"]],["CZ","Chequia","Europa",["Europe/Prague"]],["CL","Chile","América",["America/Santiago","America/Coyhaique","America/Punta_Arenas","Pacific/Easter"]],["CN","China","Asia",["Asia/Shanghai","Asia/Urumqi"]],["CY","Chipre","Asia",["Asia/Nicosia","Asia/Famagusta"]],["VA","Ciudad del Vaticano","Europa",["Europe/Vatican"]],["CO","Colombia","América",["America/Bogota"]],["KM","Comoras","África",["Indian/Comoro"]],["CG","Congo","África",["Africa/Brazzaville"]],["KP","Corea del Norte","Asia",["Asia/Pyongyang"]],["KR","Corea del Sur","Asia",["Asia/Seoul"]],["CR","Costa Rica","América",["America/Costa_Rica"]],["HR","Croacia","Europa",["Europe/Zagreb"]],["CU","Cuba","América",["America/Havana"]],["CW","Curazao","América",["America/Curacao"]],["CI","Côte d’Ivoire","África",["Africa/Abidjan"]],["DK","Dinamarca","Europa",["Europe/Copenhagen"]],["DM","Dominica","América",["America/Dominica"]],["EC","Ecuador","América",["America/Guayaquil","Pacific/Galapagos"]],["EG","Egipto","África",["Africa/Cairo"]],["SV","El Salvador","América",["America/El_Salvador"]],["AE","Emiratos Árabes Unidos","Asia",["Asia/Dubai"]],["ER","Eritrea","África",["Africa/Asmara"]],["SK","Eslovaquia","Europa",["Europe/Bratislava"]],["SI","Eslovenia","Europa",["Europe/Ljubljana"]],["ES","España","Europa",["Europe/Madrid","Africa/Ceuta","Atlantic/Canary"]],["US","Estados Unidos","América",["America/New_York","America/Detroit","America/Kentucky/Louisville","America/Kentucky/Monticello","America/Indiana/Indianapolis","America/Indiana/Vincennes","America/Indiana/Winamac","America/Indiana/Marengo","America/Indiana/Petersburg","America/Indiana/Vevay","America/Chicago","America/Indiana/Tell_City","America/Indiana/Knox","America/Menominee","America/North_Dakota/Center","America/North_Dakota/New_Salem","America/North_Dakota/Beulah","America/Denver","America/Boise","America/Phoenix","America/Los_Angeles","America/Anchorage","America/Juneau","America/Sitka","America/Metlakatla","America/Yakutat","America/Nome","America/Adak","Pacific/Honolulu"]],["EE","Estonia","Europa",["Europe/Tallinn"]],["SZ","Esuatini","África",["Africa/Mbabane"]],["ET","Etiopía","África",["Africa/Addis_Ababa"]],["PH","Filipinas","Asia",["Asia/Manila"]],["FI","Finlandia","Europa",["Europe/Helsinki"]],["FJ","Fiyi","Oceanía",["Pacific/Fiji"]],["FR","Francia","Europa",["Europe/Paris"]],["GA","Gabón","África",["Africa/Libreville"]],["GM","Gambia","África",["Africa/Banjul"]],["GE","Georgia","Asia",["Asia/Tbilisi"]],["GH","Ghana","África",["Africa/Accra"]],["GI","Gibraltar","Europa",["Europe/Gibraltar"]],["GD","Granada","América",["America/Grenada"]],["GR","Grecia","Europa",["Europe/Athens"]],["GL","Groenlandia","América",["America/Nuuk","America/Danmarkshavn","America/Scoresbysund","America/Thule"]],["GP","Guadalupe","América",["America/Guadeloupe"]],["GU","Guam","Oceanía",["Pacific/Guam"]],["GT","Guatemala","América",["America/Guatemala"]],["GF","Guayana Francesa","América",["America/Cayenne"]],["GG","Guernesey","Europa",["Europe/Guernsey"]],["GN","Guinea","África",["Africa/Conakry"]],["GQ","Guinea Ecuatorial","África",["Africa/Malabo"]],["GW","Guinea-Bisáu","África",["Africa/Bissau"]],["GY","Guyana","América",["America/Guyana"]],["HT","Haití","América",["America/Port-au-Prince"]],["HN","Honduras","América",["America/Tegucigalpa"]],["HU","Hungría","Europa",["Europe/Budapest"]],["IN","India","Asia",["Asia/Kolkata"]],["ID","Indonesia","Asia",["Asia/Jakarta","Asia/Pontianak","Asia/Makassar","Asia/Jayapura"]],["IQ","Irak","Asia",["Asia/Baghdad"]],["IE","Irlanda","Europa",["Europe/Dublin"]],["IR","Irán","Asia",["Asia/Tehran"]],["IM","Isla de Man","Europa",["Europe/Isle_of_Man"]],["CX","Isla de Navidad","Asia",["Indian/Christmas"]],["NF","Isla Norfolk","Oceanía",["Pacific/Norfolk"]],["IS","Islandia","Europa",["Atlantic/Reykjavik"]],["AX","Islas Aland","Europa",["Europe/Mariehamn"]],["KY","Islas Caimán","América",["America/Cayman"]],["CC","Islas Cocos","Asia",["Indian/Cocos"]],["CK","Islas Cook","Oceanía",["Pacific/Rarotonga"]],["FO","Islas Feroe","Europa",["Atlantic/Faroe"]],["GS","Islas Georgia del Sur y Sandwich del Sur","América",["Atlantic/South_Georgia"]],["FK","Islas Malvinas","América",["Atlantic/Stanley"]],["MP","Islas Marianas del Norte","Oceanía",["Pacific/Saipan"]],["MH","Islas Marshall","Oceanía",["Pacific/Majuro","Pacific/Kwajalein"]],["UM","Islas menores alejadas de EE. UU.","Oceanía",["Pacific/Midway","Pacific/Wake"]],["PN","Islas Pitcairn","Oceanía",["Pacific/Pitcairn"]],["SB","Islas Salomón","Oceanía",["Pacific/Guadalcanal"]],["TC","Islas Turcas y Caicos","América",["America/Grand_Turk"]],["VG","Islas Vírgenes Británicas","América",["America/Tortola"]],["VI","Islas Vírgenes de EE. UU.","América",["America/St_Thomas"]],["IL","Israel","Asia",["Asia/Jerusalem"]],["IT","Italia","Europa",["Europe/Rome"]],["JM","Jamaica","América",["America/Jamaica"]],["JP","Japón","Asia",["Asia/Tokyo"]],["JE","Jersey","Europa",["Europe/Jersey"]],["JO","Jordania","Asia",["Asia/Amman"]],["KZ","Kazajistán","Asia",["Asia/Almaty","Asia/Qyzylorda","Asia/Qostanay","Asia/Aqtobe","Asia/Aqtau","Asia/Atyrau","Asia/Oral"]],["KE","Kenia","África",["Africa/Nairobi"]],["KG","Kirguistán","Asia",["Asia/Bishkek"]],["KI","Kiribati","Oceanía",["Pacific/Tarawa","Pacific/Kanton","Pacific/Kiritimati"]],["KW","Kuwait","Asia",["Asia/Kuwait"]],["LA","Laos","Asia",["Asia/Vientiane"]],["LS","Lesoto","África",["Africa/Maseru"]],["LV","Letonia","Europa",["Europe/Riga"]],["LR","Liberia","África",["Africa/Monrovia"]],["LY","Libia","África",["Africa/Tripoli"]],["LI","Liechtenstein","Europa",["Europe/Vaduz"]],["LT","Lituania","Europa",["Europe/Vilnius"]],["LU","Luxemburgo","Europa",["Europe/Luxembourg"]],["LB","Líbano","Asia",["Asia/Beirut"]],["MK","Macedonia del Norte","Europa",["Europe/Skopje"]],["MG","Madagascar","África",["Indian/Antananarivo"]],["MY","Malasia","Asia",["Asia/Kuala_Lumpur","Asia/Kuching"]],["MW","Malaui","África",["Africa/Blantyre"]],["MV","Maldivas","Asia",["Indian/Maldives"]],["ML","Mali","África",["Africa/Bamako"]],["MT","Malta","Europa",["Europe/Malta"]],["MA","Marruecos","África",["Africa/Casablanca"]],["MQ","Martinica","América",["America/Martinique"]],["MU","Mauricio","África",["Indian/Mauritius"]],["MR","Mauritania","África",["Africa/Nouakchott"]],["YT","Mayotte","África",["Indian/Mayotte"]],["FM","Micronesia","Oceanía",["Pacific/Chuuk","Pacific/Pohnpei","Pacific/Kosrae"]],["MD","Moldavia","Europa",["Europe/Chisinau"]],["MN","Mongolia","Asia",["Asia/Ulaanbaatar","Asia/Hovd"]],["ME","Montenegro","Europa",["Europe/Podgorica"]],["MS","Montserrat","América",["America/Montserrat"]],["MZ","Mozambique","África",["Africa/Maputo"]],["MM","Myanmar (Birmania)","Asia",["Asia/Yangon"]],["MX","México","América",["America/Mexico_City","America/Cancun","America/Merida","America/Monterrey","America/Matamoros","America/Chihuahua","America/Ciudad_Juarez","America/Ojinaga","America/Mazatlan","America/Bahia_Banderas","America/Hermosillo","America/Tijuana"]],["MC","Mónaco","Europa",["Europe/Monaco"]],["NA","Namibia","África",["Africa/Windhoek"]],["NR","Nauru","Oceanía",["Pacific/Nauru"]],["NP","Nepal","Asia",["Asia/Kathmandu"]],["NI","Nicaragua","América",["America/Managua"]],["NG","Nigeria","África",["Africa/Lagos"]],["NU","Niue","Oceanía",["Pacific/Niue"]],["NO","Noruega","Europa",["Europe/Oslo"]],["NC","Nueva Caledonia","Oceanía",["Pacific/Noumea"]],["NZ","Nueva Zelanda","Oceanía",["Pacific/Auckland","Pacific/Chatham"]],["NE","Níger","África",["Africa/Niamey"]],["OM","Omán","Asia",["Asia/Muscat"]],["PK","Pakistán","Asia",["Asia/Karachi"]],["PW","Palaos","Oceanía",["Pacific/Palau"]],["PA","Panamá","América",["America/Panama"]],["PG","Papúa Nueva Guinea","Oceanía",["Pacific/Port_Moresby","Pacific/Bougainville"]],["PY","Paraguay","América",["America/Asuncion"]],["NL","Países Bajos","Europa",["Europe/Amsterdam"]],["PE","Perú","América",["America/Lima"]],["PF","Polinesia Francesa","Oceanía",["Pacific/Tahiti","Pacific/Marquesas","Pacific/Gambier"]],["PL","Polonia","Europa",["Europe/Warsaw"]],["PT","Portugal","Europa",["Europe/Lisbon","Atlantic/Madeira","Atlantic/Azores"]],["PR","Puerto Rico","América",["America/Puerto_Rico"]],["HK","RAE de Hong Kong (China)","Asia",["Asia/Hong_Kong"]],["MO","RAE de Macao (China)","Asia",["Asia/Macau"]],["GB","Reino Unido","Europa",["Europe/London"]],["CF","República Centroafricana","África",["Africa/Bangui"]],["CD","República Democrática del Congo","África",["Africa/Kinshasa","Africa/Lubumbashi"]],["DO","República Dominicana","América",["America/Santo_Domingo"]],["RE","Reunión","África",["Indian/Reunion"]],["RW","Ruanda","África",["Africa/Kigali"]],["RO","Rumanía","Europa",["Europe/Bucharest"]],["RU","Rusia","Europa",["Europe/Kaliningrad","Europe/Moscow","Europe/Kirov","Europe/Volgograd","Europe/Astrakhan","Europe/Saratov","Europe/Ulyanovsk","Europe/Samara","Asia/Yekaterinburg","Asia/Omsk","Asia/Novosibirsk","Asia/Barnaul","Asia/Tomsk","Asia/Novokuznetsk","Asia/Krasnoyarsk","Asia/Irkutsk","Asia/Chita","Asia/Yakutsk","Asia/Khandyga","Asia/Vladivostok","Asia/Ust-Nera","Asia/Magadan","Asia/Sakhalin","Asia/Srednekolymsk","Asia/Kamchatka","Asia/Anadyr"]],["WS","Samoa","Oceanía",["Pacific/Apia"]],["AS","Samoa Americana","Oceanía",["Pacific/Pago_Pago"]],["BL","San Bartolomé","América",["America/St_Barthelemy"]],["KN","San Cristóbal y Nieves","América",["America/St_Kitts"]],["SM","San Marino","Europa",["Europe/San_Marino"]],["MF","San Martín","América",["America/Marigot"]],["PM","San Pedro y Miquelón","América",["America/Miquelon"]],["VC","San Vicente y las Granadinas","América",["America/St_Vincent"]],["SH","Santa Elena","África",["Atlantic/St_Helena"]],["LC","Santa Lucía","América",["America/St_Lucia"]],["ST","Santo Tomé y Príncipe","África",["Africa/Sao_Tome"]],["SN","Senegal","África",["Africa/Dakar"]],["RS","Serbia","Europa",["Europe/Belgrade"]],["SC","Seychelles","África",["Indian/Mahe"]],["SL","Sierra Leona","África",["Africa/Freetown"]],["SG","Singapur","Asia",["Asia/Singapore"]],["SX","Sint Maarten","América",["America/Lower_Princes"]],["SY","Siria","Asia",["Asia/Damascus"]],["SO","Somalia","África",["Africa/Mogadishu"]],["LK","Sri Lanka","Asia",["Asia/Colombo"]],["ZA","Sudáfrica","África",["Africa/Johannesburg"]],["SD","Sudán","África",["Africa/Khartoum"]],["SS","Sudán del Sur","África",["Africa/Juba"]],["SE","Suecia","Europa",["Europe/Stockholm"]],["CH","Suiza","Europa",["Europe/Zurich"]],["SR","Surinam","América",["America/Paramaribo"]],["SJ","Svalbard y Jan Mayen","Europa",["Arctic/Longyearbyen"]],["EH","Sáhara Occidental","África",["Africa/El_Aaiun"]],["TH","Tailandia","Asia",["Asia/Bangkok"]],["TW","Taiwán","Asia",["Asia/Taipei"]],["TZ","Tanzania","África",["Africa/Dar_es_Salaam"]],["TJ","Tayikistán","Asia",["Asia/Dushanbe"]],["IO","Territorio Británico del Océano Índico","Asia",["Indian/Chagos"]],["TF","Territorios Australes Franceses","Antártida",["Indian/Kerguelen"]],["PS","Territorios Palestinos","Asia",["Asia/Gaza","Asia/Hebron"]],["TL","Timor-Leste","Asia",["Asia/Dili"]],["TG","Togo","África",["Africa/Lome"]],["TK","Tokelau","Oceanía",["Pacific/Fakaofo"]],["TO","Tonga","Oceanía",["Pacific/Tongatapu"]],["TT","Trinidad y Tobago","América",["America/Port_of_Spain"]],["TM","Turkmenistán","Asia",["Asia/Ashgabat"]],["TR","Turquía","Asia",["Europe/Istanbul"]],["TV","Tuvalu","Oceanía",["Pacific/Funafuti"]],["TN","Túnez","África",["Africa/Tunis"]],["UA","Ucrania","Europa",["Europe/Simferopol","Europe/Kyiv"]],["UG","Uganda","África",["Africa/Kampala"]],["UY","Uruguay","América",["America/Montevideo"]],["UZ","Uzbekistán","Asia",["Asia/Samarkand","Asia/Tashkent"]],["VU","Vanuatu","Oceanía",["Pacific/Efate"]],["VE","Venezuela","América",["America/Caracas"]],["VN","Vietnam","Asia",["Asia/Ho_Chi_Minh"]],["WF","Wallis y Futuna","Oceanía",["Pacific/Wallis"]],["YE","Yemen","Asia",["Asia/Aden"]],["DJ","Yibuti","África",["Africa/Djibouti"]],["ZM","Zambia","África",["Africa/Lusaka"]],["ZW","Zimbabue","África",["Africa/Harare"]]];

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */


const ZONA_HORARIA_BASE = "America/La_Paz";


const CLAVE_ZONA_HORARIA =
    "ppt-zona-horaria";


const UBICACION = {

    zonaHorariaBase:
        ZONA_HORARIA_BASE,

    zonaHoraria:
        ZONA_HORARIA_BASE,

    zonaDetectada:
        ZONA_HORARIA_BASE,

    modoAutomatico:
        true

};



/* =========================================================
   NOMBRES DE DÍAS
   ========================================================= */


const DIAS_SEMANA_ZONA = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado"
];


const NOMBRES_DIAS_ZONA = {

    domingo: "Domingo",
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado"

};



/* =========================================================
   DETECCIÓN AUTOMÁTICA
   ========================================================= */


function detectarZonaHoraria() {

    try {

        const zona =
            Intl
                .DateTimeFormat()
                .resolvedOptions()
                .timeZone;


        if (
            zona &&
            zonaHorariaValida(zona)
        ) {

            return zona;

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No fue posible detectar la zona horaria.",
            error
        );

    }


    return ZONA_HORARIA_BASE;
}



/* =========================================================
   VALIDACIÓN
   ========================================================= */


function zonaHorariaValida(zonaHoraria) {

    if (
        !zonaHoraria ||
        typeof zonaHoraria !== "string"
    ) {

        return false;

    }


    try {

        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: zonaHoraria
            }
        ).format();


        return true;

    } catch (error) {

        return false;

    }

}



/* =========================================================
   LISTA DE ZONAS HORARIAS
   ========================================================= */


function obtenerZonasHorariasDisponibles() {

    /*
     * Navegadores modernos permiten obtener directamente
     * las zonas horarias soportadas por el motor.
     */

    try {

        if (
            typeof Intl.supportedValuesOf ===
            "function"
        ) {

            const zonas =
                Intl.supportedValuesOf(
                    "timeZone"
                );


            if (
                Array.isArray(zonas) &&
                zonas.length
            ) {

                return zonas;

            }

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No fue posible obtener todas las zonas IANA.",
            error
        );

    }


    /*
     * Respaldo para navegadores que no soporten
     * Intl.supportedValuesOf().
     *
     * Incluimos únicamente algunas zonas comunes.
     * La detección automática seguirá funcionando
     * aunque la zona no aparezca en esta lista.
     */

    return [

        "America/La_Paz",

        "America/Lima",
        "America/Bogota",
        "America/Caracas",
        "America/Santiago",
        "America/Argentina/Buenos_Aires",
        "America/Asuncion",
        "America/Montevideo",

        "America/Mexico_City",
        "America/Cancun",
        "America/Hermosillo",
        "America/Tijuana",

        "America/New_York",
        "America/Chicago",
        "America/Denver",
        "America/Los_Angeles",
        "America/Phoenix",
        "America/Anchorage",
        "Pacific/Honolulu",

        "Europe/Madrid",
        "Atlantic/Canary",
        "Europe/London",

        "Europe/Paris",
        "Europe/Berlin",
        "Europe/Rome",

        "Asia/Tokyo",
        "Asia/Shanghai",

        "Australia/Sydney"

    ];

}



/* =========================================================
   NOMBRE AMIGABLE DE UNA ZONA
   ========================================================= */


function limpiarNombreZona(texto) {

    return String(texto || "")
        .replaceAll("_", " ")
        .trim();

}



function obtenerNombreCiudadZona(
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    if (!zonaHoraria) {
        return "Tu ubicación";
    }


    const partes =
        zonaHoraria.split("/");


    const ultimaParte =
        partes[
            partes.length - 1
        ];


    return limpiarNombreZona(
        ultimaParte
    );

}



function obtenerRegionZona(
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    if (!zonaHoraria) {
        return "Zona horaria";
    }


    const partes =
        zonaHoraria.split("/");


    if (partes.length < 2) {

        return limpiarNombreZona(
            zonaHoraria
        );

    }


    return limpiarNombreZona(
        partes[0]
    );

}



/* =========================================================
   NOMBRE PARA MOSTRAR
   ========================================================= */


function obtenerNombreUbicacion() {

    if (
        UBICACION.zonaHoraria ===
        "America/La_Paz"
    ) {

        return "Bolivia · La Paz";

    }


    const ciudad =
        obtenerNombreCiudadZona(
            UBICACION.zonaHoraria
        );


    return ciudad;

}



/* =========================================================
   COMPATIBILIDAD CON EL CÓDIGO EXISTENTE
   ========================================================= */


function obtenerPaisActual() {

    /*
     * Conservamos esta función porque cursos.js y
     * calendario.js ya la utilizan.
     *
     * Ahora representa la zona horaria del visitante,
     * no un país seleccionado manualmente.
     */

    return {

        codigo:
            "AUTO",

        nombre:
            obtenerNombreUbicacion(),

        bandera:
            "🌎",

        zonaHoraria:
            UBICACION.zonaHoraria,

        automatica:
            UBICACION.modoAutomatico

    };

}



/* =========================================================
   ALMACENAMIENTO
   ========================================================= */


function guardarZonaHoraria() {

    try {

        if (
            UBICACION.modoAutomatico
        ) {

            localStorage.removeItem(
                CLAVE_ZONA_HORARIA
            );


            return;

        }


        localStorage.setItem(
            CLAVE_ZONA_HORARIA,
            UBICACION.zonaHoraria
        );

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo guardar la zona horaria.",
            error
        );

    }

}



function cargarZonaHoraria() {

    UBICACION.zonaDetectada =
        detectarZonaHoraria();


    UBICACION.zonaHoraria =
        UBICACION.zonaDetectada;


    UBICACION.modoAutomatico =
        true;


    try {

        const guardada =
            localStorage.getItem(
                CLAVE_ZONA_HORARIA
            );


        if (
            guardada &&
            zonaHorariaValida(
                guardada
            )
        ) {

            UBICACION.zonaHoraria =
                guardada;


            UBICACION.modoAutomatico =
                false;

        }

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo recuperar la zona horaria.",
            error
        );

    }

}



/* =========================================================
   PARTES DE FECHA EN UNA ZONA
   ========================================================= */


function obtenerPartesZonaHoraria(
    fecha,
    zonaHoraria
) {

    const formato =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone:
                    zonaHoraria,

                year:
                    "numeric",

                month:
                    "2-digit",

                day:
                    "2-digit",

                hour:
                    "2-digit",

                minute:
                    "2-digit",

                second:
                    "2-digit",

                weekday:
                    "short",

                hourCycle:
                    "h23"
            }
        );


    const partes =
        formato.formatToParts(
            fecha
        );


    const resultado = {};


    partes.forEach(parte => {

        if (
            parte.type ===
            "literal"
        ) {

            return;

        }


        if (
            [
                "year",
                "month",
                "day",
                "hour",
                "minute",
                "second"
            ].includes(
                parte.type
            )
        ) {

            resultado[
                parte.type
            ] =
                Number(
                    parte.value
                );


            return;

        }


        resultado[
            parte.type
        ] =
            parte.value;

    });


    return resultado;

}



/* =========================================================
   OFFSET REAL DE UNA ZONA
   ========================================================= */


function obtenerOffsetZona(
    fecha,
    zonaHoraria
) {

    const partes =
        obtenerPartesZonaHoraria(
            fecha,
            zonaHoraria
        );


    const comoUTC =
        Date.UTC(
            partes.year,
            partes.month - 1,
            partes.day,
            partes.hour,
            partes.minute,
            partes.second
        );


    return (
        comoUTC -
        fecha.getTime()
    );

}



/* =========================================================
   BOLIVIA -> UTC
   ========================================================= */


function fechaHoraBoliviaAUTC(
    fechaISO,
    hora
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const [
        horas,
        minutos
    ] =
        hora
            .split(":")
            .map(Number);


    /*
     * Primera aproximación.
     */

    let instante =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia,
                horas,
                minutos,
                0
            )
        );


    /*
     * Calculamos el offset de Bolivia
     * para ese instante concreto.
     */

    let offset =
        obtenerOffsetZona(
            instante,
            ZONA_HORARIA_BASE
        );


    instante =
        new Date(
            instante.getTime() -
            offset
        );


    /*
     * Segunda comprobación.
     *
     * Esta corrección hace el algoritmo más
     * robusto para zonas que sí poseen cambios
     * de offset.
     *
     * Bolivia actualmente no utiliza DST,
     * pero dejamos el motor genérico.
     */

    const offsetCorregido =
        obtenerOffsetZona(
            instante,
            ZONA_HORARIA_BASE
        );


    if (
        offsetCorregido !==
        offset
    ) {

        instante =
            new Date(
                instante.getTime() +
                offset -
                offsetCorregido
            );

    }


    return instante;

}



/* =========================================================
   FORMATO DE FECHA ISO
   ========================================================= */


function partesAFechaISO(partes) {

    return (
        `${partes.year}-` +
        `${String(partes.month).padStart(2, "0")}-` +
        `${String(partes.day).padStart(2, "0")}`
    );

}



function partesAHora(partes) {

    return (
        `${String(partes.hour).padStart(2, "0")}:` +
        `${String(partes.minute).padStart(2, "0")}`
    );

}



/* =========================================================
   DÍA DE LA SEMANA
   ========================================================= */


function obtenerDiaSemanaISO(
    fechaISO
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const indice =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia
            )
        ).getUTCDay();


    return DIAS_SEMANA_ZONA[
        indice
    ];

}



/* =========================================================
   CONVERSIÓN INTERNACIONAL COMPLETA
   ========================================================= */


function convertirFechaHoraBolivia(
    fechaISO,
    hora,
    zonaDestino =
        UBICACION.zonaHoraria
) {

    if (
        !zonaHorariaValida(
            zonaDestino
        )
    ) {

        zonaDestino =
            ZONA_HORARIA_BASE;

    }


    const instante =
        fechaHoraBoliviaAUTC(
            fechaISO,
            hora
        );


    const partes =
        obtenerPartesZonaHoraria(
            instante,
            zonaDestino
        );


    const fechaLocal =
        partesAFechaISO(
            partes
        );


    return {

        instante,

        fecha:
            fechaLocal,

        hora:
            partesAHora(
                partes
            ),

        dia:
            obtenerDiaSemanaISO(
                fechaLocal
            ),

        zonaHoraria:
            zonaDestino

    };

}



/* =========================================================
   COMPATIBILIDAD:
   convertirHoraBolivia()
   ========================================================= */


function convertirHoraBolivia(
    fechaISO,
    hora,
    zonaDestino =
        UBICACION.zonaHoraria
) {

    const conversion =
        convertirFechaHoraBolivia(
            fechaISO,
            hora,
            zonaDestino
        );


    return {

        hora:
            conversion.hora,

        fecha:
            conversion.fecha,

        dia:
            conversion.dia,

        zonaHoraria:
            conversion.zonaHoraria,

        pais:
            obtenerPaisActual()

    };

}



/* =========================================================
   DIFERENCIA DE DÍAS
   ========================================================= */


function sumarDiasFechaISO(
    fechaISO,
    cantidad
) {

    const [
        anio,
        mes,
        dia
    ] =
        fechaISO
            .split("-")
            .map(Number);


    const fecha =
        new Date(
            Date.UTC(
                anio,
                mes - 1,
                dia + cantidad
            )
        );


    return (
        `${fecha.getUTCFullYear()}-` +
        `${String(
            fecha.getUTCMonth() + 1
        ).padStart(2, "0")}-` +
        `${String(
            fecha.getUTCDate()
        ).padStart(2, "0")}`
    );

}



/* =========================================================
   BUSCAR UNA FECHA REPRESENTATIVA PARA UN DÍA
   ========================================================= */


function obtenerFechaParaDiaCurso(
    curso,
    diaBuscado
) {

    /*
     * Partimos de la fecha de inicio del curso y
     * buscamos la primera ocurrencia real del día.
     *
     * Esto es mejor que convertir todos los días
     * utilizando siempre curso.fechaInicio.
     */

    for (
        let desplazamiento = 0;
        desplazamiento < 14;
        desplazamiento++
    ) {

        const fecha =
            sumarDiasFechaISO(
                curso.fechaInicio,
                desplazamiento
            );


        if (
            obtenerDiaSemanaISO(
                fecha
            ) ===
            diaBuscado
        ) {

            return fecha;

        }

    }


    return curso.fechaInicio;

}



/* =========================================================
   CONVERSIÓN DE UNA CLASE CONCRETA
   ========================================================= */


function convertirClaseCurso(
    curso,
    fechaClase
) {

    const inicio =
        convertirFechaHoraBolivia(
            fechaClase,
            curso.horaInicio
        );


    const fin =
        convertirFechaHoraBolivia(
            fechaClase,
            curso.horaFin
        );


    return {

        fechaBolivia:
            fechaClase,

        diaBolivia:
            obtenerDiaSemanaISO(
                fechaClase
            ),

        inicio:
            inicio.hora,

        fin:
            fin.hora,

        fechaLocal:
            inicio.fecha,

        fechaFinLocal:
            fin.fecha,

        diaLocal:
            inicio.dia,

        diaFinLocal:
            fin.dia,

        zonaHoraria:
            UBICACION.zonaHoraria

    };

}



/* =========================================================
   HORARIO REPRESENTATIVO DE UN CURSO
   ========================================================= */


function obtenerHorarioLocalCurso(
    curso
) {

    /*
     * Esta función continúa existiendo para mantener
     * compatibilidad con cursos.js.
     *
     * Para mostrar únicamente "hora inicio - hora fin"
     * utilizamos la fecha inicial como referencia.
     *
     * Para matrices semanales internacionales debemos
     * utilizar convertirClaseCurso() por cada día.
     */

    const inicio =
        convertirFechaHoraBolivia(
            curso.fechaInicio,
            curso.horaInicio
        );


    const fin =
        convertirFechaHoraBolivia(
            curso.fechaInicio,
            curso.horaFin
        );


    return {

        inicio:
            inicio.hora,

        fin:
            fin.hora,

        fechaLocal:
            inicio.fecha,

        fechaFinLocal:
            fin.fecha,

        diaLocal:
            inicio.dia,

        diaFinLocal:
            fin.dia,

        zonaHoraria:
            UBICACION.zonaHoraria,

        pais:
            obtenerPaisActual()

    };

}



/* =========================================================
   HORARIO DE UN DÍA CONCRETO DEL CURSO
   ========================================================= */


function obtenerHorarioLocalCursoPorDia(
    curso,
    diaCurso
) {

    const fecha =
        obtenerFechaParaDiaCurso(
            curso,
            diaCurso
        );


    return convertirClaseCurso(
        curso,
        fecha
    );

}



/* =========================================================
   TEXTO DEL HORARIO
   ========================================================= */


function obtenerTextoHorarioCurso(
    curso
) {

    const horario =
        obtenerHorarioLocalCurso(
            curso
        );


    return (
        `${horario.inicio} — ` +
        `${horario.fin}`
    );

}



/* =========================================================
   OFFSET PARA MOSTRAR
   ========================================================= */


function obtenerOffsetMinutosZona(
    fecha = new Date(),
    zonaHoraria =
        UBICACION.zonaHoraria
) {

    return Math.round(
        obtenerOffsetZona(
            fecha,
            zonaHoraria
        ) /
        60000
    );

}



function formatearOffsetUTC(
    minutos
) {

    if (minutos === 0) {
        return "UTC";
    }


    const signo =
        minutos >= 0
            ? "+"
            : "-";


    const absoluto =
        Math.abs(
            minutos
        );


    const horas =
        Math.floor(
            absoluto / 60
        );


    const mins =
        absoluto % 60;


    return (
        `UTC${signo}` +
        `${String(horas).padStart(2, "0")}:` +
        `${String(mins).padStart(2, "0")}`
    );

}



/* =========================================================
   INFORMACIÓN ACTUAL
   ========================================================= */


function obtenerInformacionZonaActual() {

    const zona =
        UBICACION.zonaHoraria;


    const ciudad =
        obtenerNombreCiudadZona(
            zona
        );


    const offset =
        obtenerOffsetMinutosZona(
            new Date(),
            zona
        );


    return {

        zonaHoraria:
            zona,

        ciudad,

        nombre:
            obtenerNombreUbicacion(),

        offset,

        offsetTexto:
            formatearOffsetUTC(
                offset
            ),

        automatica:
            UBICACION.modoAutomatico

    };

}



/* =========================================================
   CAMBIAR ZONA HORARIA
   ========================================================= */


function cambiarZonaHoraria(
    zonaHoraria,
    guardar = true
) {

    if (
        !zonaHorariaValida(
            zonaHoraria
        )
    ) {

        console.warn(
            `[Ubicación] Zona horaria no válida: ${zonaHoraria}`
        );


        return false;

    }


    UBICACION.zonaHoraria =
        zonaHoraria;


    UBICACION.modoAutomatico =
        (
            zonaHoraria ===
            UBICACION.zonaDetectada
        );


    if (guardar) {

        guardarZonaHoraria();

    }


    sincronizarSelectorZona();


    actualizarHorariosTarjetas();


    actualizarIndicadoresZona();


    emitirCambioZonaHoraria();


    return true;

}



/* =========================================================
   VOLVER A DETECCIÓN AUTOMÁTICA
   ========================================================= */


function usarZonaHorariaAutomatica() {

    UBICACION.zonaDetectada =
        detectarZonaHoraria();


    UBICACION.zonaHoraria =
        UBICACION.zonaDetectada;


    UBICACION.modoAutomatico =
        true;


    try {

        localStorage.removeItem(
            CLAVE_ZONA_HORARIA
        );

    } catch (error) {

        console.warn(
            "[Ubicación] No se pudo limpiar la zona guardada.",
            error
        );

    }


    sincronizarSelectorZona();


    actualizarHorariosTarjetas();


    actualizarIndicadoresZona();


    emitirCambioZonaHoraria();

}



/* =========================================================
   EVENTO GLOBAL
   ========================================================= */


function emitirCambioZonaHoraria() {

    const informacion =
        obtenerInformacionZonaActual();


    window.dispatchEvent(

        new CustomEvent(
            "ppt:cambio-zona-horaria",
            {
                detail:
                    informacion
            }
        )

    );


    /*
     * Compatibilidad temporal con código anterior.
     */

    window.dispatchEvent(

        new CustomEvent(
            "ppt:cambio-pais",
            {
                detail: {
                    pais:
                        obtenerPaisActual()
                }
            }
        )

    );

}



/* =========================================================
   SELECTOR
   ========================================================= */


function crearEtiquetaZona(
    zona
) {

    const ciudad =
        obtenerNombreCiudadZona(
            zona
        );


    return (
        `${ciudad} · ${zona}`
    );

}



function opcionesSeguras(select, opciones, placeholder) {
    select.replaceChildren();
    if (placeholder) select.add(new Option(placeholder, ""));
    opciones.forEach(([etiqueta, valor]) => select.add(new Option(etiqueta, valor)));
}

function obtenerPaisPorZona(zona) {
    return PAISES_HORARIOS.find(p => p[3].includes(zona)) || null;
}

function montarSelectorGeografico(contenedor, prefijo = "horarios") {
    if (!contenedor) return;
    const id = prefijo.replace(/[^a-z0-9-]/gi, "-");
    contenedor.innerHTML = `
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="block text-xs font-bold text-slate-300">🌍 Continente
                <select id="${id}-continente" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100"></select>
            </label>
            <label class="block text-xs font-bold text-slate-300">🏳️ País
                <select id="${id}-pais" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100"></select>
            </label>
        </div>
        <label class="mt-3 block text-xs font-bold text-slate-300" id="${id}-zona-etiqueta">📍 Ciudad o zona horaria
            <select id="${id}-zona" class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-slate-100"></select>
        </label>
        <button type="button" id="${id}-automatico" class="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/20">↻ Usar mi zona automática</button>
        <p class="mt-2 text-xs text-slate-400" id="${id}-estado" aria-live="polite"></p>`;
    const continente = contenedor.querySelector(`#${id}-continente`);
    const pais = contenedor.querySelector(`#${id}-pais`);
    const zona = contenedor.querySelector(`#${id}-zona`);
    const etiqueta = contenedor.querySelector(`#${id}-zona-etiqueta`);
    const estado = contenedor.querySelector(`#${id}-estado`);
    opcionesSeguras(continente, ["América","Europa","Asia","África","Oceanía","Antártida"].map(x => [x,x]));
    function cargarPaises(codigo) {
        const lista = PAISES_HORARIOS.filter(p => p[2] === continente.value);
        opcionesSeguras(pais, lista.map(p => [p[1],p[0]]), "Selecciona tu país");
        if (codigo && lista.some(p => p[0] === codigo)) pais.value = codigo;
        cargarZonas();
    }
    function cargarZonas(zonaPreferida) {
        const elegido = PAISES_HORARIOS.find(p => p[0] === pais.value);
        const zonas = elegido ? elegido[3].filter(zonaHorariaValida) : [];
        opcionesSeguras(zona, zonas.map(z => [z.split('/').slice(1).join(' / ').replaceAll('_',' ') + ' · ' + z,z]), "Selecciona tu ciudad / zona");
        etiqueta.classList.toggle('hidden', zonas.length <= 1);
        if (zonas.length === 1) zona.value = zonas[0];
        if (zonaPreferida && zonas.includes(zonaPreferida)) zona.value = zonaPreferida;
    }
    function sincronizar() {
        const actual = UBICACION.zonaHoraria;
        const encontrado = obtenerPaisPorZona(actual);
        if (encontrado) {
            continente.value = encontrado[2];
            cargarPaises(encontrado[0]);
            cargarZonas(actual);
        } else {
            continente.value = "América";
            cargarPaises();
        }
        estado.textContent = (UBICACION.modoAutomatico ? 'Detectado automáticamente: ' : 'Horario seleccionado: ') + actual;
    }
    continente.addEventListener('change', () => cargarPaises());
    pais.addEventListener('change', () => {
        cargarZonas();
        const elegido = PAISES_HORARIOS.find(p => p[0] === pais.value);
        if (elegido && elegido[3].filter(zonaHorariaValida).length === 1) cambiarZonaHoraria(zona.value);
        else estado.textContent = 'Selecciona la ciudad o zona horaria para mostrar tus horarios.';
    });
    zona.addEventListener('change', () => { if (zona.value) cambiarZonaHoraria(zona.value); });
    contenedor.querySelector(`#${id}-automatico`).addEventListener('click', usarZonaHorariaAutomatica);
    window.addEventListener('ppt:cambio-zona-horaria', sincronizar);
    sincronizar();
}

function cargarSelectorPaises() {
    const selector = document.getElementById('country-select');
    if (!selector) return;
    // Compatibilidad con páginas existentes que todavía contienen #country-select.
    // Se conserva el ID, pero se muestra una interfaz accesible por continente y país.
    const contenedor = document.createElement('div');
    contenedor.id = 'selector-geografico-cursos';
    selector.insertAdjacentElement('afterend', contenedor);
    selector.classList.add('hidden');
    montarSelectorGeografico(contenedor, 'cursos');
}

function sincronizarSelectorZona() {
    const selector = document.getElementById('country-select');
    if (selector && selector.options.length) {
        const opcion = [...selector.options].find(o => o.value === UBICACION.zonaHoraria);
        if (opcion) selector.value = opcion.value;
    }
}

/* =========================================================
   ACTUALIZAR TARJETAS
   ========================================================= */


function actualizarHorariosTarjetas() {

    if (
        typeof CURSOS ===
        "undefined"
    ) {

        actualizarIndicadoresZona();

        return;

    }


    CURSOS.forEach(curso => {

        const elementos =
            document.querySelectorAll(
                `[data-horario-curso="${curso.id}"]`
            );


        if (!elementos.length) {
            return;
        }


        const horario =
            obtenerHorarioLocalCurso(
                curso
            );


        elementos.forEach(
            elemento => {

                elemento.textContent =
                    `${horario.inicio} — ${horario.fin}`;

            }
        );

    });


    actualizarIndicadoresZona();

}



/* =========================================================
   INDICADORES
   ========================================================= */


function actualizarIndicadoresZona() {

    const info =
        obtenerInformacionZonaActual();


    document
        .querySelectorAll(
            "[data-pais-actual]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    `🌎 ${info.nombre}`;

            }
        );


    document
        .querySelectorAll(
            "[data-zona-horaria]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.zonaHoraria;

            }
        );


    document
        .querySelectorAll(
            "[data-offset-zona]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.offsetTexto;

            }
        );


    document
        .querySelectorAll(
            "[data-zona-modo]"
        )
        .forEach(
            elemento => {

                elemento.textContent =
                    info.automatica
                        ? "Detectada automáticamente"
                        : "Seleccionada manualmente";

            }
        );

}



/* =========================================================
   COMPATIBILIDAD CON FUNCIONES ANTERIORES
   ========================================================= */


function actualizarIndicadoresPais() {

    actualizarIndicadoresZona();

}



/*
 * cambiarPais() queda temporalmente disponible
 * para evitar errores si algún código antiguo todavía
 * intenta llamarla.
 *
 * Si recibe una zona IANA válida, la utilizamos.
 */

function cambiarPais(valor) {

    if (
        valor === "__AUTO__"
    ) {

        usarZonaHorariaAutomatica();

        return;

    }


    if (
        zonaHorariaValida(
            valor
        )
    ) {

        cambiarZonaHoraria(
            valor
        );

        return;

    }


    console.warn(
        `[Ubicación] "${valor}" ya no representa una zona horaria válida.`
    );

}



/* =========================================================
   DIAGNÓSTICO
   ========================================================= */


function mostrarDiagnosticoZona() {

    const info =
        obtenerInformacionZonaActual();


    console.group(
        "[Programación Para Todos] Zona horaria"
    );


    console.log(
        "Base oficial:",
        ZONA_HORARIA_BASE
    );


    console.log(
        "Detectada:",
        UBICACION.zonaDetectada
    );


    console.log(
        "Utilizada:",
        UBICACION.zonaHoraria
    );


    console.log(
        "Modo automático:",
        UBICACION.modoAutomatico
    );


    console.log(
        "Offset actual:",
        info.offsetTexto
    );


    console.groupEnd();

}



/* =========================================================
   INICIALIZACIÓN
   ========================================================= */


function inicializarUbicacion() {

    /*
     * 1. Detectamos la zona del dispositivo.
     * 2. Recuperamos una selección manual anterior,
     *    si existiera.
     */

    cargarZonaHoraria();


    /*
     * 3. Convertimos el antiguo selector de países
     *    en selector de zonas horarias.
     */

    cargarSelectorPaises();


    /*
     * 4. Actualizamos toda la interfaz.
     */

    actualizarIndicadoresZona();


    /*
     * 5. Las tarjetas pueden haber sido creadas
     *    antes que ubicacion.js.
     */

    actualizarHorariosTarjetas();


    /*
     * Información útil durante desarrollo.
     */

    console.info(
        `[Ubicación] Bolivia → ${UBICACION.zonaHoraria}` +
        (
            UBICACION.modoAutomatico
                ? " · automática"
                : " · manual"
        )
    );

}



/* =========================================================
   INICIO
   ========================================================= */


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarUbicacion
    );

} else {

    inicializarUbicacion();

}