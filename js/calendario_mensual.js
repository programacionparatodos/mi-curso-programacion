/* =========================================================
   PROGRAMACIÓN PARA TODOS · CALENDARIO MENSUAL PERMANENTE
   Se alimenta de data/cursos.js; no necesita editarse al
   agregar nuevos cursos. Fechas oficiales: Bolivia (UTC-4).
   ========================================================= */
"use strict";

/* Para registrar suspensiones en el futuro:
   { cursoId: "python-fundamentos-2026-09", fecha: "2026-10-16", motivo: "..." }
   La fecha siempre es la fecha OFICIAL en Bolivia. */
const CLASES_SUSPENDIDAS = [];

(() => {
    const MS_DIA = 86400000;
    const DIAS = { domingo:0, lunes:1, martes:2, miercoles:3, jueves:4, viernes:5, sabado:6 };
    const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const COLORES = {pseint:"#34d399",python:"#60a5fa",java:"#fb923c",cpp:"#22d3ee",csharp:"#c084fc"};
    const estado = { mes:0, filtro:"todos", seleccionado:null };
    let sesiones = [], meses = [], montado = false;

    function fechaUTC(iso) { return new Date(`${iso}T12:00:00Z`); }
    function isoUTC(fecha) { return fecha.toISOString().slice(0,10); }
    function sumar(iso, dias) { const d=fechaUTC(iso); d.setUTCDate(d.getUTCDate()+dias); return isoUTC(d); }
    function diaSemana(iso) { return fechaUTC(iso).getUTCDay(); }
    function fechaMes(iso) { return iso.slice(0,7); }
    function tituloMes(iso) { const [y,m]=iso.split('-').map(Number); return `${MESES[m-1][0].toUpperCase()}${MESES[m-1].slice(1)} ${y}`; }
    function escapeHTML(v) { return String(v ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
    function formatoHora(fecha,zona) { return new Intl.DateTimeFormat('es-BO',{timeZone:zona,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(fecha); }
    function formatoFecha(fecha,zona) { return new Intl.DateTimeFormat('es-BO',{timeZone:zona,day:'2-digit',month:'short',year:'numeric'}).format(fecha); }
    function zona() { try { return typeof UBICACION!=='undefined' && UBICACION.zonaHoraria ? UBICACION.zonaHoraria : 'America/La_Paz'; } catch { return 'America/La_Paz'; } }
    function horaMinutos(hora) { const [h,m]=hora.split(':').map(Number); return h*60+m; }
    // Bolivia mantiene UTC-4 todo el año.
    function instanteBolivia(iso,hora) { const [h,m]=hora.split(':').map(Number); const [y,mo,d]=iso.split('-').map(Number); return new Date(Date.UTC(y,mo-1,d,h+4,m)); }

    function generarSesiones() {
        const lista=[];
        if (typeof CURSOS === 'undefined') return lista;
        for (const curso of CURSOS) {
            if (!curso.fechaInicio || !Array.isArray(curso.dias) || !curso.dias.length || !curso.clases) continue;
            const dias = [...new Set(curso.dias.map(d=>DIAS[d]).filter(d=>d!==undefined))];
            if (!dias.length) continue;
            const horas = curso.horaInicio || '00:00';
            const duracion = curso.lenguaje === 'python' ? 90 : 120;
            const finConfigurado = curso.horaFin;
            let cursor = curso.fechaInicio, regulares=0, ultima=null, seguridad=0;
            while (regulares < curso.clases && seguridad++ < 1500) {
                if (dias.includes(diaSemana(cursor))) {
                    const inicio=instanteBolivia(cursor,horas);
                    // El horario de la base de datos prevalece; si falta, usamos la duración por curso.
                    let fin = finConfigurado ? instanteBolivia(cursor,finConfigurado) : new Date(inicio.getTime()+duracion*60000);
                    if (fin<=inicio) fin = new Date(fin.getTime()+MS_DIA);
                    lista.push({curso,fecha:cursor,inicio,fin,recuperacion:false,numero:++regulares});
                    ultima=cursor;
                }
                cursor=sumar(cursor,1);
            }
            if (!ultima) continue;
            // Una semana calendario EXTRA después de la última clase regular.
            for (let i=1;i<=7;i++) {
                const fecha=sumar(ultima,i);
                if (!dias.includes(diaSemana(fecha))) continue;
                const inicio=instanteBolivia(fecha,horas);
                let fin=finConfigurado ? instanteBolivia(fecha,finConfigurado) : new Date(inicio.getTime()+duracion*60000);
                if(fin<=inicio) fin=new Date(fin.getTime()+MS_DIA);
                lista.push({curso,fecha,inicio,fin,recuperacion:true,numero:null});
            }
        }
        return lista.sort((a,b)=>a.inicio-b.inicio);
    }

    function obtenerEstado(s,ahora=new Date()) {
        if (CLASES_SUSPENDIDAS.some(x=>x.cursoId===s.curso.id && x.fecha===s.fecha)) return 'suspendida';
        if (ahora>=s.fin) return 'finalizada';
        if (ahora>=s.inicio) return 'vivo';
        return 'proxima';
    }
    function etiqueta(s) {
        const e=obtenerEstado(s);
        return {finalizada:'<span class="text-emerald-400">✓ Finalizada</span>',vivo:'<span class="text-emerald-300 font-black animate-pulse">● EN VIVO</span>',suspendida:'<span class="text-rose-400">✕ Suspendida</span>',proxima:'<span class="text-slate-400">◷ Próxima</span>'}[e];
    }
    function construirMeses() {
        if (!sesiones.length) return [];
        const primero=fechaMes(sesiones[0].fecha), ultimo=fechaMes(sesiones[sesiones.length-1].fecha);
        const [y,m]=primero.split('-').map(Number), [yf,mf]=ultimo.split('-').map(Number);
        const result=[];
        for(let n=y*12+m-1;n<=yf*12+mf-1;n++) result.push(`${Math.floor(n/12)}-${String(n%12+1).padStart(2,'0')}`);
        return result;
    }
    function diaEnZona(s) {
        const z=zona();
        return `${formatoFecha(s.inicio,z)} · ${formatoHora(s.inicio,z)}–${formatoHora(s.fin,z)}`;
    }
    function dibujar() {
        const raiz=document.getElementById('calendario-mensual');
        if(!raiz || !meses.length) return;
        estado.mes=Math.max(0,Math.min(estado.mes,meses.length-1));
        const mes=meses[estado.mes], [y,m]=mes.split('-').map(Number);
        const primerDia=(new Date(Date.UTC(y,m-1,1)).getUTCDay()+6)%7;
        const cantidad=new Date(Date.UTC(y,m,0)).getUTCDate();
        const visibles=sesiones.filter(s=>estado.filtro==='todos'||s.curso.id===estado.filtro);
        const porFecha=new Map();
        for(const s of visibles) { const a=porFecha.get(s.fecha)||[]; a.push(s); porFecha.set(s.fecha,a); }
        const nombres=[...new Map(sesiones.map(s=>[s.curso.id,s.curso])).values()];
        const selectCurso=`<select id="cal-mensual-curso" aria-label="Filtrar curso" class="max-w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200"><option value="todos">Todos los cursos</option>${nombres.map(c=>`<option value="${escapeHTML(c.id)}" ${estado.filtro===c.id?'selected':''}>${escapeHTML(c.nombre)} · ${escapeHTML(c.subtitulo)}</option>`).join('')}</select>`;
        const celdas=[];
        for(let i=0;i<primerDia;i++) celdas.push('<div class="min-h-16 rounded-lg bg-slate-950/25" aria-hidden="true"></div>');
        for(let d=1;d<=cantidad;d++) {
            const fecha=`${mes}-${String(d).padStart(2,'0')}`;
            const clases=porFecha.get(fecha)||[];
            const selected=estado.seleccionado===fecha;
            const resumen=clases.slice(0,3).map(s=>{
                const e=obtenerEstado(s);
                const col=e==='suspendida'?'#fb7185':e==='vivo'?'#6ee7b7':e==='finalizada'?'#34d399':'#64748b';
                const simbolo=e==='suspendida'?'✕':e==='finalizada'?'✓':e==='vivo'?'●':'•';
                return `<span class="block truncate text-[9px] leading-4" style="color:${col}">${simbolo} ${escapeHTML(s.curso.nombre)}${s.recuperacion?' · R':''}</span>`;
            }).join('');
            celdas.push(`<button type="button" data-dia="${fecha}" aria-label="${d} de ${MESES[m-1]}: ${clases.length} sesiones" class="min-w-0 min-h-[72px] sm:min-h-[94px] rounded-lg border p-1.5 sm:p-2 text-left transition hover:border-amber-500/60 ${selected?'border-amber-400 bg-amber-500/10':'border-slate-800 bg-slate-950/65'}"><span class="text-xs font-bold text-slate-200">${d}</span>${resumen}<span class="block text-[9px] text-slate-500">${clases.length>3?`+${clases.length-3} más`:''}</span></button>`);
        }
        const detalle=estado.seleccionado ? (porFecha.get(estado.seleccionado)||[]) : [];
        const panel=estado.seleccionado ? `<div class="mt-5 rounded-xl border border-slate-800 bg-slate-950/70 p-4"><h4 class="mb-3 font-bold text-sm text-slate-100">${escapeHTML(estado.seleccionado)} · ${detalle.length} ${detalle.length===1?'sesión':'sesiones'}</h4>${detalle.length ? detalle.map(s=>`<div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 py-3 text-xs"><div><div class="font-bold" style="color:${COLORES[s.curso.lenguaje]||'#e2e8f0'}">${escapeHTML(s.curso.nombre)}${s.recuperacion?' · Recuperación':' · Clase '+s.numero}</div><div class="mt-1 text-slate-400">${escapeHTML(diaEnZona(s))}</div></div><div>${etiqueta(s)}</div></div>`).join(''):'<p class="text-xs text-slate-500">No hay clases programadas para este día.</p>'}</div>`:'';
        raiz.innerHTML=`<div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p class="font-mono text-[10px] tracking-widest text-amber-400">04 // HISTORIAL ACADÉMICO</p><h2 class="mt-2 text-2xl sm:text-3xl font-black text-slate-100">Calendario de clases</h2><p class="mt-2 text-xs text-slate-400">Todas las fechas, clases finalizadas y una semana adicional para recuperación.</p></div>${selectCurso}</div><div class="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 p-3 sm:p-5"><div class="mb-5 flex items-center justify-between gap-2"><button type="button" id="cal-mensual-anterior" ${estado.mes===0?'disabled':''} class="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 disabled:opacity-25" aria-label="Mes anterior">‹</button><h3 class="text-center font-bold text-base sm:text-lg text-slate-100">${tituloMes(mes)}</h3><button type="button" id="cal-mensual-siguiente" ${estado.mes===meses.length-1?'disabled':''} class="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200 disabled:opacity-25" aria-label="Mes siguiente">›</button></div><div class="grid grid-cols-7 gap-1 sm:gap-2">${['L','M','M','J','V','S','D'].map(x=>`<div class="py-2 text-center text-xs text-slate-500">${x}</div>`).join('')}${celdas.join('')}</div>${panel}<div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-slate-400"><span class="text-emerald-400">✓ Finalizada</span><span class="text-emerald-300">● EN VIVO</span><span class="text-rose-400">✕ Suspendida</span><span>◷ Próxima</span><span>R = Recuperación</span></div><p class="mt-3 text-[10px] text-slate-500">Las horas se muestran en tu zona horaria (${escapeHTML(zona())}). Los estados se calculan según el horario programado, no verifican la emisión en TikTok.</p></div>`;
        raiz.querySelector('#cal-mensual-anterior').addEventListener('click',()=>{estado.mes--;estado.seleccionado=null;dibujar();});
        raiz.querySelector('#cal-mensual-siguiente').addEventListener('click',()=>{estado.mes++;estado.seleccionado=null;dibujar();});
        raiz.querySelector('#cal-mensual-curso').addEventListener('change',e=>{estado.filtro=e.target.value;estado.seleccionado=null;dibujar();});
        raiz.querySelectorAll('[data-dia]').forEach(b=>b.addEventListener('click',()=>{estado.seleccionado=b.dataset.dia;dibujar();}));
    }
    function iniciar() {
        const matriz=document.getElementById('horario-academico');
        if(!matriz) return;
        if(!document.getElementById('calendario-mensual')) {
            const seccion=document.createElement('section');
            seccion.id='calendario-mensual';
            seccion.className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8';
            seccion.setAttribute('aria-label','Calendario mensual de clases');
            matriz.insertAdjacentElement('afterend',seccion);
        }
        sesiones=generarSesiones();meses=construirMeses();
        if(!meses.length) {document.getElementById('calendario-mensual').textContent='No hay clases registradas.';return;}
        if(!montado) {
            const hoy=new Intl.DateTimeFormat('en-CA',{timeZone:'America/La_Paz',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
            const p=Object.fromEntries(hoy.filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
            const mesActual=`${p.year}-${p.month}`;
            const n=meses.indexOf(mesActual);
            estado.mes=n>=0?n:meses.length-1;
            montado=true;
        }
        dibujar();
    }
    function esperarMatriz() {
        iniciar();
        if(!document.getElementById('calendario-mensual')) {
            const observer=new MutationObserver(()=>{if(document.getElementById('horario-academico')) {observer.disconnect();iniciar();}});
            observer.observe(document.body,{childList:true,subtree:true});
        }
    }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',esperarMatriz); else esperarMatriz();
    window.addEventListener('ppt:cambio-zona-horaria',dibujar);
    window.addEventListener('ppt:cambio-pais',dibujar);
    setInterval(()=>{if(document.getElementById('calendario-mensual')) dibujar();},60000);
})();
