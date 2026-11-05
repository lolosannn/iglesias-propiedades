// Iglesias Negocios Inmobiliarios: lógica del sitio
// Para cargar una propiedad nueva, agregá un objeto a PROPIEDADES.

const WA_CANNING = '5491159545500';
const MAIL_TAPIALES = 'info@iglesiasprop.com';

const PROPIEDADES = [
  {
    id: 'CAN-0001', op: 'venta', zona: 'canning', tipo: 'casa',
    titulo: 'Casa a estrenar en La Magdalena', direccion: 'Barrio La Magdalena · Canning',
    precio: 'Consultar precio',
    specs: [['3', 'dorm.'], ['3', 'baños'], ['750', 'm² lote'], ['', 'Pileta']],
    fotos: ['img/magdalena-frente.jpg', 'img/magdalena-living.jpg', 'img/magdalena-bano.jpg'],
    tags: 'a estrenar pileta solarium losa radiante parrilla galeria barrio cerrado',
  },
  {
    id: 'TAP-0001', op: 'venta', zona: 'tapiales', tipo: 'casa',
    titulo: 'Casa en 2 plantas con galería vidriada', direccion: 'Ciudad Madero · La Matanza',
    precio: 'Consultar precio',
    specs: [['2', 'plantas'], ['', 'Hogar'], ['', 'Quincho'], ['', 'Patio']],
    fotos: ['img/tapiales-galeria.jpg', 'img/tapiales-frente.jpg'],
    tags: 'ciudad madero villa madero mariquita thompson hogar quincho patio',
  },
  // --- Propiedades de ejemplo (reemplazar por reales) ---
  {
    id: 'EJ-01', ejemplo: true, op: 'alquiler', zona: 'tapiales', tipo: 'departamento',
    titulo: 'Departamento 2 amb. con balcón', direccion: 'Tapiales, La Matanza',
    precio: '$ 480.000', sufijo: '/ mes', ph: 'd',
    specs: [['2', 'amb.'], ['1', 'baño'], ['48', 'm² cub.'], ['', 'Apto mascotas']],
  },
  {
    id: 'EJ-02', ejemplo: true, op: 'alquiler', zona: 'canning', tipo: 'casa',
    titulo: 'Casa en country con pileta', direccion: 'Country · Canning, San Vicente',
    precio: 'USD 1.400', sufijo: '/ mes', ph: 'e',
    specs: [['5', 'amb.'], ['3', 'baños'], ['240', 'm² cub.'], ['', 'Pileta']],
  },
  {
    id: 'EJ-03', ejemplo: true, op: 'inversion', zona: 'canning', tipo: 'emprendimiento',
    titulo: 'Emprendimiento en pozo: monoambientes y 2 amb.', direccion: 'Canning · Entrega 2028',
    precio: 'Desde USD 85.000', ph: 'a',
    specs: [['36', 'cuotas'], ['', 'Amenities']],
  },
  {
    id: 'EJ-04', ejemplo: true, op: 'venta', zona: 'tapiales', tipo: 'ph',
    titulo: 'PH al frente, sin expensas', direccion: 'Tapiales, La Matanza',
    precio: 'USD 98.000', ph: 'f',
    specs: [['3', 'amb.'], ['1', 'baño'], ['75', 'm² cub.'], ['', 'Patio']],
  },
];

const OP_LABEL = { venta: 'Venta', alquiler: 'Alquiler', inversion: 'Inversión' };
const OP_COLOR = { venta: '', alquiler: 'background:#0d3a6b', inversion: 'background:#1d8a5b' };

const state = { op: 'todas', zona: 'todas', tipo: '', texto: '' };
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const norm = (t) => (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const favs = new Set(JSON.parse(localStorage.getItem('iglesias-favs') || '[]'));

function cardHTML(p) {
  const bg = p.fotos ? `style="background:url(${p.fotos[0]}) center/cover"` : '';
  const cls = p.fotos ? 'ph' : `ph ${p.ph}`;
  const specs = p.specs.map(([n, t]) => `<span>${n ? `<b>${n}</b> ` : ''}${t}</span>`).join('');
  return `
  <article class="card${p.ejemplo ? ' ex' : ''}" data-id="${p.id}" tabindex="0">
    <div class="${cls}" ${bg}>
      <div class="badges"><span class="badge op" style="${OP_COLOR[p.op]}">${OP_LABEL[p.op]}</span><span class="badge loc">${p.zona === 'canning' ? 'Canning' : 'Tapiales'}</span></div>
      <button class="fav${favs.has(p.id) ? ' on' : ''}" data-fav="${p.id}" aria-label="Guardar">${favs.has(p.id) ? '♥' : '♡'}</button>
      ${p.fotos ? `<span class="pcount">📷 ${p.fotos.length}</span>` : ''}
    </div>
    <div class="body">
      <div class="price">${p.precio}${p.sufijo ? ` <small>${p.sufijo}</small>` : ''}</div>
      <h4>${p.titulo}</h4><div class="addr">${p.direccion}</div>
      <div class="specs">${specs}</div>
    </div>
  </article>`;
}

function render() {
  const t = norm(state.texto);
  const list = PROPIEDADES.filter((p) =>
    (state.op === 'todas' || p.op === state.op) &&
    (state.zona === 'todas' || p.zona === state.zona) &&
    (!state.tipo || p.tipo === state.tipo) &&
    (!t || norm([p.titulo, p.direccion, p.tags, p.zona].join(' ')).includes(t))
  );
  $('#grid').innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  const partes = [];
  if (state.op !== 'todas') partes.push(OP_LABEL[state.op]);
  if (state.zona !== 'todas') partes.push(state.zona === 'canning' ? 'Canning' : 'Tapiales');
  if (state.tipo) partes.push(state.tipo);
  if (state.texto) partes.push(`“${state.texto}”`);
  $('#resultInfo').textContent = `${list.length} ${list.length === 1 ? 'propiedad' : 'propiedades'}${partes.length ? ' · ' + partes.join(' · ') : ''}`;
  // sincronizar controles
  $$('#opTabs .tab').forEach((b) => b.classList.toggle('active', b.dataset.op === state.op));
  $$('#zonePills button, #zoneChips .chip').forEach((b) => b.classList.toggle('on', b.dataset.zona === state.zona));
  $('#fTipo').value = state.tipo;
  $('#fTexto').value = state.texto;
}

function goToList() {
  $('#propiedades').scrollIntoView({ behavior: 'smooth' });
}

// --- filtros
$('#opTabs').addEventListener('click', (e) => {
  const b = e.target.closest('.tab'); if (!b) return;
  state.op = b.dataset.op; render();

});
$$('#zonePills, #zoneChips').forEach((g) => g.addEventListener('click', (e) => {
  const b = e.target.closest('[data-zona]'); if (!b) return;
  state.zona = b.dataset.zona; render();
}));
$('#fTipo').addEventListener('change', (e) => { state.tipo = e.target.value; render(); });
$('#searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  state.texto = $('#fTexto').value.trim();
  state.tipo = $('#fTipo').value;
  render(); goToList();
});
const resetAll = () => { Object.assign(state, { op: 'todas', zona: 'todas', tipo: '', texto: '' }); render(); };
$('#resetBtn').addEventListener('click', resetAll);
$('#allBtn').addEventListener('click', resetAll);

// links que fijan operación o zona (menú, servicios, sucursales, pie)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-op], a[data-zona]'); if (!a) return;
  e.preventDefault();
  if (a.dataset.op) { state.op = a.dataset.op; state.zona = 'todas'; }
  if (a.dataset.zona) { state.zona = a.dataset.zona; state.op = 'todas'; }
  state.tipo = ''; state.texto = '';
  render(); goToList(); closeNav();
});

// --- favoritos y abrir ficha
$('#grid').addEventListener('click', (e) => {
  const f = e.target.closest('[data-fav]');
  if (f) {
    e.stopPropagation();
    const id = f.dataset.fav;
    favs.has(id) ? favs.delete(id) : favs.add(id);
    localStorage.setItem('iglesias-favs', JSON.stringify([...favs]));
    render(); return;
  }
  const c = e.target.closest('.card'); if (!c) return;
  const p = PROPIEDADES.find((x) => x.id === c.dataset.id);
  if (p.id === 'CAN-0001') return document.getElementById('ficha-canning').scrollIntoView({ behavior: 'smooth' });
  if (p.id === 'TAP-0001') return document.getElementById('ficha-tapiales').scrollIntoView({ behavior: 'smooth' });
  if (p.fotos) return openLB(p.fotos, 0);
  // propiedades de ejemplo: consulta directa
  consultar(p);
});

function consultar(p) {
  const txt = `Hola, quiero consultar por: ${p.titulo} (${p.direccion}) Ref. ${p.id}`;
  if (p.zona === 'canning') window.open(`https://wa.me/${WA_CANNING}?text=${encodeURIComponent(txt)}`, '_blank');
  else location.href = `mailto:${MAIL_TAPIALES}?subject=${encodeURIComponent('Consulta Ref. ' + p.id)}&body=${encodeURIComponent(txt)}`;
}

// --- galería (lightbox)
const GALERIAS = {
  magdalena: PROPIEDADES[0].fotos,
  madero: PROPIEDADES[1].fotos,
};
let lbFotos = [], lbI = 0;
function openLB(fotos, i) {
  lbFotos = fotos; lbI = i; showLB(); $('#lb').hidden = false; document.body.style.overflow = 'hidden';
}
function showLB() {
  $('#lbImg').src = lbFotos[lbI];
  $('#lbC').textContent = `${lbI + 1} / ${lbFotos.length}`;
}
function closeLB() { $('#lb').hidden = true; document.body.style.overflow = ''; }
$('#lbX').addEventListener('click', closeLB);
$('#lbPrev').addEventListener('click', () => { lbI = (lbI - 1 + lbFotos.length) % lbFotos.length; showLB(); });
$('#lbNext').addEventListener('click', () => { lbI = (lbI + 1) % lbFotos.length; showLB(); });
$('#lb').addEventListener('click', (e) => { if (e.target.id === 'lb') closeLB(); });
document.addEventListener('keydown', (e) => {
  if ($('#lb').hidden) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowRight') $('#lbNext').click();
  if (e.key === 'ArrowLeft') $('#lbPrev').click();
});
$$('[data-gal-host]').forEach((g) => {
  const key = $('[data-gal]', g).dataset.gal;
  const fotos = GALERIAS[key];
  [...g.children].forEach((tile) => tile.addEventListener('click', () => {
    const m = (tile.style.backgroundImage || '').match(/url\(["']?(.*?)["']?\)/);
    const i = m ? Math.max(0, fotos.findIndex((f) => m[1].endsWith(f))) : 0;
    openLB(fotos, i);
  }));
});

// --- formulario de tasación
$('#tasForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const txt = [
    'Hola, quiero solicitar una tasación.',
    `Nombre: ${d.nombre}`, `Teléfono: ${d.tel}`, d.email && `Email: ${d.email}`,
    `Inmueble: ${d.tipo} en ${d.dir} (${d.zona})`, d.sup && `Superficie aprox.: ${d.sup} m²`,
    `Motivo: ${d.motivo}`, d.msg && `Comentarios: ${d.msg}`,
  ].filter(Boolean).join('\n');
  if (d.zona === 'Canning') window.open(`https://wa.me/${WA_CANNING}?text=${encodeURIComponent(txt)}`, '_blank');
  else location.href = `mailto:${MAIL_TAPIALES}?subject=${encodeURIComponent('Solicitud de tasación')}&body=${encodeURIComponent(txt)}`;
});

// --- menú mobile
const closeNav = () => $('#nav').classList.remove('open');
$('#burger').addEventListener('click', () => $('#nav').classList.toggle('open'));
$$('#nav a').forEach((a) => a.addEventListener('click', closeNav));

render();

// --- hero animado: arranca cuando las dos imágenes están cargadas
(function heroAnim() {
  const stage = document.getElementById('heroStage');
  if (!stage) return;
  const imgs = [...stage.querySelectorAll('img')];
  const ready = imgs.map((im) => im.complete ? Promise.resolve() : new Promise((r) => { im.onload = im.onerror = r; }));
  const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([...ready, fonts]).then(() => {
    stage.classList.add('play');
    stage.querySelector('.h2-frame img').addEventListener('animationend', () => stage.classList.add('done'), { once: true });
  });
  // parallax suave: las letras se quedan un poco atrás al scrollear
  const type = stage.querySelector('.h2-type');
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(scrollY, 600);
      type.style.translate = `0 ${y * 0.25}px`;
      ticking = false;
    });
  }, { passive: true });
})();

// --- animaciones al scrollear: revelado escalonado y contadores
(function scrollFx() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups = [
    ['.sec-head', 'rv'], ['.about > div:first-child', 'rv rv-l'], ['.about > div:last-child', 'rv rv-r'],
    ['.sub-head', 'rv'], ['.gallery', 'rv rv-z'], ['.listing > *', 'rv'], ['.cta > div', 'rv rv-l'],
    ['.cta > form', 'rv rv-r'], ['.closing .wrap > *', 'rv'],
  ];
  const stagger = ['.services > .svc', '.zones > .zone', '.srv-grid > .srv', '.duo > .duo-card',
    '.quotes > .q', '.factors > div', '.steps > .step', '.feat > div', '.fgrid > div', '.stats .wrap > div'];
  const els = [];
  groups.forEach(([sel, cls]) => $$(sel).forEach((el) => { el.classList.add(...cls.split(' ')); els.push(el); }));
  stagger.forEach((sel) => $$(sel).forEach((el, i) => {
    el.classList.add('rv'); el.style.setProperty('--d', (i % 6) * 0.09 + 's'); els.push(el);
  }));
  $$('.kicker').forEach((k) => els.push(k));
  const counters = $$('[data-count]');
  if (reduce || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    io.unobserve(en.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach((e) => io.observe(e));

  const cio = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    countUp(en.target); cio.unobserve(en.target);
  }), { threshold: 0.6 });
  counters.forEach((c) => { c.textContent = '0'; cio.observe(c); });

  function countUp(el) {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    (function tick(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e).toLocaleString('es-AR');
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
})();

// --- las tarjetas se vuelven a dibujar con cada filtro: animarlas al aparecer
(function cardsFx() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const grid = document.getElementById('grid');
  const animate = () => [...grid.children].forEach((c, i) => c.animate(
    [{ opacity: 0, transform: 'translateY(30px) scale(.97)' }, { opacity: 1, transform: 'none' }],
    { duration: 600, delay: i * 70, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' }));
  new MutationObserver(animate).observe(grid, { childList: true });
  animate();
})();

// --- "¿Cómo trabajamos?": la sección queda fija y los pasos avanzan con el scroll
(function howScroll() {
  const wrap = document.getElementById('howScroll');
  if (!wrap) return;
  const panels = $$('.hs-panel', wrap), items = $$('.hs-nav li', wrap), bar = document.getElementById('hsBar');
  const n = panels.length;
  let cur = -1;
  function setStep(i) {
    if (i === cur) return;
    cur = i;
    panels.forEach((p, k) => { p.classList.toggle('on', k === i); p.classList.toggle('prev', k < i); });
    items.forEach((li, k) => { li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
  }
  function update() {
    const r = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (96 - r.top) / total));
    bar.style.width = (p * 100).toFixed(1) + '%';
    setStep(Math.min(n - 1, Math.floor(p * n)));
    wrap.classList.toggle('end', p >= 0.98);
  }
  // tocar un paso lleva a esa parte del recorrido
  items.forEach((li, k) => li.addEventListener('click', () => {
    const top = wrap.getBoundingClientRect().top + scrollY - 96;
    const total = wrap.offsetHeight - innerHeight * 0.6;
    scrollTo({ top: top + total * (k + 0.5) / n, behavior: 'smooth' });
  }));
  addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  addEventListener('resize', update);
  update();
})();
