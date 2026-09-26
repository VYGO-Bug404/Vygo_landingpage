/* ==========================================================================
   VYGO · Encuesta de estudio de mercado
   Instrumento: "Estudio de Mercado Definitivo: Validación, Pricing y Perfil
   de Usuario VYGO". 18 preguntas en 5 secciones, una pregunta por pantalla.
   Los textos de preguntas y opciones son los del instrumento original, para
   que los datos se puedan analizar tal cual.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.VYGO_CONFIG || {};
  var STORAGE_KEY = 'vygo-encuesta-v1';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Secciones ---------- */
  var SECTIONS = [
    { id: 1, name: 'Operación diaria', tone: 'cobalt' },
    { id: 2, name: 'Tu experiencia en la calle', tone: 'green' },
    { id: 3, name: 'Lo que opinas de VYGO', tone: 'cobalt' },
    { id: 4, name: 'Precio', tone: 'green' },
    { id: 5, name: 'Sobre ti', tone: 'cobalt' }
  ];

  /* ---------- Preguntas ---------- */
  var QUESTIONS = [
    // Sección 1
    { id: 'transporte', section: 1, type: 'single',
      text: '¿Qué medio de transporte utilizas principalmente para realizar tus entregas?',
      options: ['Motocicleta', 'Automóvil', 'Bicicleta / Bicicleta eléctrica', { label: 'Otro', other: true }] },
    { id: 'plataformas', section: 1, type: 'multi',
      text: '¿En qué plataformas de reparto trabajas habitualmente?',
      hint: 'Selecciona todas las que apliquen.',
      options: ['Uber Eats', 'Rappi', 'DiDi Food', { label: 'Otras', other: true }] },
    { id: 'vehiculo', section: 1, type: 'single',
      text: '¿El vehículo que utilizas es propio, alquilado o prestado?',
      options: ['Propio', 'Alquilado (esquema de arrendamiento/renta semanal)', 'Prestado'] },
    { id: 'gasto_combustible', section: 1, type: 'single',
      text: 'Aproximadamente, ¿cuánto gastas a la semana en combustible o recarga de batería para trabajar?',
      options: ['Menos de $300 MXN', 'Entre $300 y $700 MXN', 'Entre $700 y $1,200 MXN', 'Más de $1,200 MXN'] },

    // Sección 2
    { id: 'apps_simultaneas', section: 2, type: 'single',
      text: 'Durante tus turnos, ¿qué tan seguido mantienes dos o más aplicaciones activas simultáneamente para buscar pedidos?',
      options: ['Siempre', 'Solo en horarios de baja demanda', 'Nunca, prefiero enfocarme en una sola app'] },
    { id: 'mayor_perdida', section: 2, type: 'single',
      text: '¿Cuál consideras que es tu mayor pérdida de tiempo o dinero al repartir?',
      options: [
        'Regresar con la mochila vacía a la zona de restaurantes después de una entrega lejana.',
        'La distracción y el peligro de tener que cambiar de app manualmente mientras conduzco.',
        'Aceptar pedidos por impulso porque las apps solo me dan 30 segundos para decidir.'
      ] },
    { id: 'dificultad_calculo', section: 2, type: 'single',
      text: 'Cuando recibes una oferta de viaje, ¿qué tan difícil es para ti calcular mentalmente si la ganancia compensa el tiempo y la gasolina extra?',
      options: [
        'Muy difícil, generalmente tomo la decisión por instinto.',
        'Regular, trato de calcular mentalmente la distancia vs. el pago.',
        'Fácil, conozco perfectamente cuánto cobro por kilómetro recorrido.'
      ] },

    // Sección 3
    { id: 'utilidad', section: 3, type: 'single',
      text: 'Si existiera una aplicación que reúne todas tus ofertas en una sola pantalla y combina hasta 4 pedidos que van a la misma zona sin atrasarte, ¿qué tan útil te resultaría?',
      options: ['Indispensable para mi trabajo diario', 'Muy útil', 'Poco útil', 'Nada útil'] },
    { id: 'caracteristica', section: 3, type: 'single',
      text: '¿Qué característica te convencería más de utilizar esta herramienta?',
      options: [
        'Que el sistema agrupe viajes asegurando que la comida no se enfríe y cumpliendo los tiempos de entrega (SLA) de cada plataforma.',
        'Recibir tarjetas visuales con números grandes y retroalimentación de vibración (háptica) para no distraerme del camino.',
        'Que la app me explique matemáticamente cuánto dinero extra ganaré por hora si acepto el desvío.'
      ] },
    { id: 'preocupacion', section: 3, type: 'single',
      text: '¿Cuál sería tu principal preocupación al usar un orquestador de apps externo?',
      options: [
        'Que drene la batería y mis datos móviles rápidamente.',
        'Que las aplicaciones (Uber, Rappi) bloqueen o suspendan mi cuenta.',
        'Que la interfaz sea difícil de leer mientras manejo.'
      ] },

    // Sección 4 (Van Westendorp)
    { id: 'precios', section: 4, type: 'prices',
      text: 'Si esta tecnología te demuestra con datos reales que puede aumentar tus ingresos y reducir a la mitad la distancia que recorres por pedido, pensando en una suscripción mensual:',
      hint: 'Escribe un precio o mueve la barra. Pesos mexicanos al mes.',
      items: [
        { id: 'precio_muy_barato', letter: 'A', label: '¿A qué precio considerarías que es TAN BARATA que dudarías de que realmente funcione?', short: 'Tan barata que dudarías' },
        { id: 'precio_buena_oferta', letter: 'B', label: '¿A qué precio considerarías que es una EXCELENTE OFERTA (vale totalmente lo que cuesta)?', short: 'Excelente oferta' },
        { id: 'precio_caro', letter: 'C', label: '¿A qué precio empezarías a sentirla CARA, pero aun así la pagarías por los beneficios?', short: 'Cara, pero la pagarías' },
        { id: 'precio_demasiado_caro', letter: 'D', label: '¿A qué precio la considerarías DEMASIADO CARA y definitivamente no la contratarías?', short: 'Demasiado cara' }
      ] },
    { id: 'formato_pago', section: 4, type: 'single',
      text: '¿Qué formato de pago se adapta mejor a tu flujo de dinero semanal?',
      options: [
        'Suscripción mensual fija.',
        'Suscripción semanal (pagos más pequeños cada semana).',
        'Pago por día de uso (solo se cobra si te conectas a trabajar).',
        'Una pequeña comisión únicamente sobre el dinero extra que la app te ayude a generar.'
      ] },

    // Sección 5
    { id: 'edad', section: 5, type: 'single',
      text: '¿En qué rango de edad te encuentras?',
      options: ['18 a 24 años', '25 a 34 años', '35 a 44 años', '45 a 54 años', '55 años o más'] },
    { id: 'genero', section: 5, type: 'single',
      text: '¿Con qué género te identificas?',
      options: ['Masculino', 'Femenino', 'Prefiero no decirlo'] },
    { id: 'rol_ingreso', section: 5, type: 'single',
      text: '¿Qué papel juega el trabajo de reparto mediante aplicaciones en tu economía personal?',
      options: [
        'Es mi única fuente de ingresos.',
        'Es mi fuente de ingresos principal, pero hago otros trabajos (chambitas, oficios).',
        'Es un ingreso extra; tengo un empleo fijo a tiempo parcial o completo.',
        'Soy estudiante y lo utilizo para mis gastos personales.'
      ] },
    { id: 'dependientes', section: 5, type: 'single',
      text: '¿Cuántas personas dependen económicamente de lo que ganas repartiendo?',
      options: ['Solo yo (no tengo dependientes).', '1 a 2 personas (ej. pareja o hijo).', '3 o más personas.'] },
    { id: 'estudios', section: 5, type: 'single',
      text: '¿Cuál es tu nivel máximo de estudios completado?',
      options: ['Secundaria', 'Preparatoria / Bachillerato', 'Carrera técnica', 'Licenciatura / Ingeniería', 'Otro'] },
    { id: 'ciudad', section: 5, type: 'city',
      text: '¿En qué ciudad o área metropolitana realizas la mayor parte de tus entregas?',
      hint: 'Toca una opción o escribe la tuya.',
      chips: ['Monterrey', 'CDMX', 'Guadalajara'] }
  ];

  var LETTERS = 'ABCDEFGH';
  var PRICE_MAX = 1000;

  /* ---------- Estado ---------- */
  var state = { step: -1, answers: {}, startedAt: null };

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* sin almacenamiento */ }
  }
  function clearSaved() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* nada */ }
  }

  /* ---------- Utilidades ---------- */
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] === true) n.setAttribute(k, '');
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function optLabel(o) { return typeof o === 'string' ? o : o.label; }
  function isOther(o) { return typeof o === 'object' && o.other; }
  function sectionOf(q) { return SECTIONS[q.section - 1]; }

  function isAnswered(q) {
    var a = state.answers[q.id];
    if (q.type === 'single') {
      if (!a || !a.value) return false;
      var opt = q.options.filter(function (o) { return optLabel(o) === a.value; })[0];
      return !(opt && isOther(opt)) || !!(a.other && a.other.trim());
    }
    if (q.type === 'multi') {
      if (!a || !a.values || !a.values.length) return false;
      var otherOpt = q.options.filter(isOther)[0];
      if (otherOpt && a.values.indexOf(otherOpt.label) > -1) return !!(a.other && a.other.trim());
      return true;
    }
    if (q.type === 'prices') {
      return q.items.every(function (it) { return a && typeof a[it.id] === 'number' && a[it.id] >= 0; });
    }
    if (q.type === 'city') return !!(a && a.value && a.value.trim());
    return false;
  }

  /* ---------- Referencias del DOM ---------- */
  var stage = document.getElementById('stage');
  var bar = document.getElementById('actions');
  var btnBack = document.getElementById('btn-back');
  var btnNext = document.getElementById('btn-next');
  var counter = document.getElementById('counter');
  var progressFill = document.getElementById('progress-fill');
  var progressStops = document.querySelectorAll('.progress__stop');
  var progressLabel = document.getElementById('progress-label');

  /* ---------- Progreso (la ruta) ---------- */
  function updateProgress() {
    var total = QUESTIONS.length;
    var done = state.step < 0 ? 0 : Math.min(state.step, total);
    var pct = state.step >= total ? 100 : (done / total) * 100;
    progressFill.style.width = pct + '%';
    var currentSection = state.step >= 0 && state.step < total ? QUESTIONS[state.step].section : (state.step >= total ? 6 : 0);
    progressStops.forEach(function (s, i) {
      var firstIdx = QUESTIONS.findIndex(function (q) { return q.section === i + 1; });
      s.classList.toggle('is-done', state.step > firstIdx || state.step >= total);
      s.classList.toggle('is-current', currentSection === i + 1);
    });
    if (state.step >= 0 && state.step < total) {
      counter.textContent = (state.step + 1) + ' / ' + total;
      progressLabel.textContent = 'Pregunta ' + (state.step + 1) + ' de ' + total + ', sección ' + QUESTIONS[state.step].section + ' de 5';
    } else {
      counter.textContent = state.step >= total ? 'Listo' : total + ' preguntas';
      progressLabel.textContent = '';
    }
  }

  /* ---------- Render ---------- */
  var autoTimer = null;

  function go(step, dir) {
    clearTimeout(autoTimer);
    state.step = step;
    save();
    render(dir || 1);
  }

  function render(dir) {
    var total = QUESTIONS.length;
    var screen;
    if (state.step < 0) screen = renderWelcome();
    else if (state.step >= total) screen = renderDone();
    else screen = renderQuestion(QUESTIONS[state.step]);

    screen.classList.add('screen');
    if (!reduceMotion) screen.classList.add(dir < 0 ? 'enter-back' : 'enter');
    stage.replaceChildren(screen);

    var inQuestion = state.step >= 0 && state.step < total;
    bar.hidden = !inQuestion;
    document.body.classList.toggle('has-actions', inQuestion);
    if (inQuestion) updateActions();
    updateProgress();

    var focusTarget = screen.querySelector('[data-focus]');
    if (focusTarget) focusTarget.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  function updateActions() {
    var q = QUESTIONS[state.step];
    var last = state.step === QUESTIONS.length - 1;
    btnNext.textContent = last ? 'Enviar respuestas' : 'Siguiente';
    btnNext.disabled = !isAnswered(q);
    btnBack.hidden = false;
  }

  /* ---------- Pantalla de bienvenida ---------- */
  function renderWelcome() {
    var saved = load();
    var canResume = saved && saved.step >= 0 && saved.step < QUESTIONS.length && Object.keys(saved.answers || {}).length;

    var actions = el('div', { class: 'welcome__actions' });
    if (canResume) {
      actions.appendChild(el('button', { class: 'btn btn--neon', type: 'button', onclick: function () {
        state = saved; render(1);
      } }, ['Seguir en la pregunta ' + (saved.step + 1)]));
      actions.appendChild(el('button', { class: 'btn btn--soft', type: 'button', onclick: function () {
        clearSaved(); state = { step: 0, answers: {}, startedAt: Date.now() }; render(1);
      } }, ['Empezar de nuevo']));
    } else {
      actions.appendChild(el('button', { class: 'btn btn--neon', type: 'button', onclick: function () {
        state = { step: 0, answers: {}, startedAt: Date.now() }; render(1);
      } }, ['Empezar']));
    }

    var route = document.getElementById('tpl-route').content.cloneNode(true);

    return el('section', { class: 'welcome', 'aria-labelledby': 'welcome-title' }, [
      el('div', { class: 'welcome__visual', 'aria-hidden': 'true' }, [route]),
      el('div', { class: 'welcome__copy' }, [
        el('span', { class: 'chip chip--green' }, ['Estudio de mercado VYGO']),
        el('h1', { class: 'welcome__title', id: 'welcome-title', tabindex: '-1', 'data-focus': true }, ['Cuéntanos cómo repartes.']),
        el('p', { class: 'welcome__text' }, ['Estamos desarrollando VYGO, un copiloto inteligente para repartidores que usan Uber Eats, Rappi y DiDi Food. Agrupa pedidos compatibles en una sola ruta para que ganes más y recorras menos kilómetros.']),
        el('p', { class: 'welcome__text' }, ['Esta encuesta es confidencial y nos ayuda a adaptar VYGO a tu realidad en la calle.']),
        el('ul', { class: 'welcome__facts', role: 'list' }, [
          el('li', { class: 'fact' }, [el('strong', {}, ['18']), el('span', {}, ['preguntas'])]),
          el('li', { class: 'fact' }, [el('strong', {}, ['4 min']), el('span', {}, ['aprox.'])]),
          el('li', { class: 'fact' }, [el('strong', {}, ['5']), el('span', {}, ['secciones'])])
        ]),
        actions,
        el('p', { class: 'welcome__keys' }, ['En computadora puedes contestar con las letras del teclado y avanzar con Enter.'])
      ])
    ]);
  }

  /* ---------- Pantalla de pregunta ---------- */
  function renderQuestion(q) {
    var sec = sectionOf(q);
    var prev = QUESTIONS[state.step - 1];
    var newSection = !prev || prev.section !== q.section;

    var head = el('header', { class: 'q__head' }, [
      el('div', { class: 'q__meta' }, [
        el('span', { class: 'q__section q__section--' + sec.tone }, ['Sección ' + sec.id + ' de 5 · ' + sec.name]),
        newSection && state.step > 0 ? el('span', { class: 'q__new' }, ['Nueva sección']) : null
      ]),
      el('h1', { class: 'q__title' + (q.text.length > 110 ? ' q__title--long' : ''), id: 'q-title', tabindex: '-1', 'data-focus': true }, [q.text]),
      q.hint ? el('p', { class: 'q__hint' }, [q.hint]) : null
    ]);

    var body;
    if (q.type === 'single' || q.type === 'multi') body = renderChoices(q);
    else if (q.type === 'prices') body = renderPrices(q);
    else if (q.type === 'city') body = renderCity(q);

    return el('section', { class: 'q', 'aria-labelledby': 'q-title' }, [head, body]);
  }

  function renderChoices(q) {
    var multi = q.type === 'multi';
    var a = state.answers[q.id] || (multi ? { values: [] } : {});
    var long = q.options.some(function (o) { return optLabel(o).length > 40; });
    var fs = el('fieldset', { class: 'choices' + (long ? ' choices--long' : ''), role: multi ? 'group' : 'radiogroup', 'aria-labelledby': 'q-title' });
    var otherWrap = null;

    q.options.forEach(function (o, i) {
      var label = optLabel(o);
      var checked = multi ? (a.values || []).indexOf(label) > -1 : a.value === label;
      var input = el('input', {
        type: multi ? 'checkbox' : 'radio',
        name: q.id,
        value: label,
        id: q.id + '-' + i,
        checked: checked
      });
      input.addEventListener('change', function () { onChoice(q, o, input); });
      fs.appendChild(el('label', { class: 'opt', for: q.id + '-' + i }, [
        input,
        el('span', { class: 'opt__key', 'aria-hidden': 'true' }, [LETTERS[i]]),
        el('span', { class: 'opt__text' }, [label]),
        el('span', { class: 'opt__check', 'aria-hidden': 'true' })
      ]));
    });

    var otherOpt = q.options.filter(isOther)[0];
    if (otherOpt) {
      var showOther = multi ? (a.values || []).indexOf(otherOpt.label) > -1 : a.value === otherOpt.label;
      var otherInput = el('input', {
        class: 'field', type: 'text', id: q.id + '-otro', maxlength: '80',
        placeholder: multi ? '¿Cuáles?' : '¿Cuál?', value: a.other || '', autocomplete: 'off'
      });
      otherInput.addEventListener('input', function () {
        var cur = state.answers[q.id] || {};
        cur.other = otherInput.value;
        state.answers[q.id] = cur;
        save(); updateActions();
      });
      otherWrap = el('div', { class: 'other', hidden: !showOther }, [
        el('label', { class: 'other__label', for: q.id + '-otro' }, [multi ? 'Escribe cuáles' : 'Escribe cuál']),
        otherInput
      ]);
      fs.appendChild(otherWrap);
    }
    return fs;
  }

  function onChoice(q, o, input) {
    var multi = q.type === 'multi';
    var label = optLabel(o);
    var a = state.answers[q.id] || (multi ? { values: [] } : {});
    if (multi) {
      a.values = a.values || [];
      var idx = a.values.indexOf(label);
      if (input.checked && idx < 0) a.values.push(label);
      if (!input.checked && idx > -1) a.values.splice(idx, 1);
    } else {
      a.value = label;
    }
    state.answers[q.id] = a;
    save();

    var otherWrap = stage.querySelector('.other');
    var otherOpt = q.options.filter(isOther)[0];
    if (otherWrap && otherOpt) {
      var show = multi ? a.values.indexOf(otherOpt.label) > -1 : a.value === otherOpt.label;
      otherWrap.hidden = !show;
      if (show && isOther(o) && input.checked) otherWrap.querySelector('input').focus();
    }
    updateActions();

    // Opción única: avanza sola para que sea rápido
    if (!multi && !isOther(o)) {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(next, reduceMotion ? 120 : 380);
    }
  }

  /* ---------- Escalera de precios (Van Westendorp) ---------- */
  function renderPrices(q) {
    var a = state.answers[q.id] || {};
    var wrap = el('div', { class: 'prices' });
    var warn = el('p', { class: 'prices__warn', role: 'status', 'aria-live': 'polite' });

    q.items.forEach(function (it, i) {
      var val = typeof a[it.id] === 'number' ? a[it.id] : null;
      var num = el('input', {
        class: 'price__input', type: 'number', inputmode: 'numeric', min: '0', max: '99999', step: '1',
        id: it.id, placeholder: '—', value: val == null ? '' : String(val), 'aria-describedby': it.id + '-unit'
      });
      var range = el('input', {
        class: 'price__range' + (val == null ? ' is-untouched' : ''), type: 'range', min: '0', max: String(PRICE_MAX), step: '10',
        value: String(val == null ? 0 : Math.min(val, PRICE_MAX)), 'aria-label': it.short + ', en pesos al mes'
      });
      var paint = function (v) {
        var pct = Math.min(v, PRICE_MAX) / PRICE_MAX * 100;
        range.style.setProperty('--fill', pct + '%');
      };
      paint(val || 0);

      var set = function (v, from) {
        var cur = state.answers[q.id] || {};
        if (v === null || isNaN(v)) { delete cur[it.id]; }
        else { cur[it.id] = Math.max(0, Math.round(v)); }
        state.answers[q.id] = cur;
        if (from !== 'num') num.value = v == null || isNaN(v) ? '' : String(cur[it.id]);
        if (from !== 'range' && v != null && !isNaN(v)) range.value = String(Math.min(cur[it.id], PRICE_MAX));
        range.classList.toggle('is-untouched', v == null || isNaN(v));
        paint(v || 0);
        save(); updateActions(); check();
      };
      range.addEventListener('input', function () { set(parseInt(range.value, 10), 'range'); });
      num.addEventListener('input', function () { set(num.value === '' ? null : parseFloat(num.value), 'num'); });

      wrap.appendChild(el('div', { class: 'price price--' + (i + 1) }, [
        el('div', { class: 'price__top' }, [
          el('span', { class: 'price__letter', 'aria-hidden': 'true' }, [it.letter]),
          el('label', { class: 'price__label', for: it.id }, [it.label])
        ]),
        el('div', { class: 'price__controls' }, [
          range,
          el('div', { class: 'price__field' }, [
            el('span', { class: 'price__cur', 'aria-hidden': 'true' }, ['$']),
            num,
            el('span', { class: 'price__unit', id: it.id + '-unit' }, ['MXN / mes'])
          ])
        ])
      ]));
    });

    function check() {
      var cur = state.answers[q.id] || {};
      var vals = q.items.map(function (it) { return cur[it.id]; });
      var bad = false;
      for (var i = 1; i < vals.length; i++) {
        if (typeof vals[i] === 'number' && typeof vals[i - 1] === 'number' && vals[i] < vals[i - 1]) bad = true;
      }
      warn.textContent = bad ? 'Ojo: normalmente cada precio es mayor que el anterior (A < B < C < D). Revísalo si fue un error.' : '';
    }
    wrap.appendChild(warn);
    setTimeout(check, 0);
    return wrap;
  }

  /* ---------- Ciudad ---------- */
  function renderCity(q) {
    var a = state.answers[q.id] || {};
    var input = el('input', {
      class: 'field field--big', type: 'text', id: q.id, maxlength: '80', autocomplete: 'address-level2',
      placeholder: 'Ej. Monterrey', value: a.value || ''
    });
    var chips = el('div', { class: 'city__chips' });
    var syncChips = function () {
      chips.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.textContent === input.value.trim()));
      });
    };
    q.chips.forEach(function (c) {
      chips.appendChild(el('button', { type: 'button', class: 'city__chip', 'aria-pressed': 'false', onclick: function () {
        input.value = c; input.dispatchEvent(new Event('input'));
      } }, [c]));
    });
    input.addEventListener('input', function () {
      state.answers[q.id] = { value: input.value };
      save(); updateActions(); syncChips();
    });
    syncChips();
    return el('div', { class: 'city' }, [
      chips,
      el('label', { class: 'visually-hidden', for: q.id }, ['Ciudad o área metropolitana']),
      input
    ]);
  }

  /* ---------- Final ---------- */
  function renderDone() {
    var a = state.answers;
    var recap = [];
    if (a.transporte) recap.push(a.transporte.value === 'Otro' ? (a.transporte.other || 'Otro') : a.transporte.value);
    if (a.plataformas && a.plataformas.values) recap.push(a.plataformas.values.length + (a.plataformas.values.length === 1 ? ' app' : ' apps'));
    if (a.ciudad && a.ciudad.value) recap.push(a.ciudad.value.trim());

    var route = document.getElementById('tpl-route').content.cloneNode(true);

    return el('section', { class: 'done', 'aria-labelledby': 'done-title' }, [
      el('div', { class: 'done__block' }, [
        el('div', { class: 'done__visual', 'aria-hidden': 'true' }, [route]),
        el('h1', { class: 'done__title', id: 'done-title', tabindex: '-1', 'data-focus': true }, ['Listo. Ruta completa.']),
        el('p', { class: 'done__text' }, ['Gracias por contarnos cómo repartes. Con tus respuestas ajustamos VYGO a lo que de verdad pasa en la calle.']),
        recap.length ? el('ul', { class: 'done__recap', role: 'list', 'aria-label': 'Resumen de tus respuestas' },
          recap.map(function (r) { return el('li', { class: 'chip chip--soft' }, [r]); })) : null,
        el('div', { class: 'done__actions' }, [
          el('a', { class: 'btn btn--neon', href: 'index.html#lanzamiento' }, ['Avísame cuando salga']),
          el('a', { class: 'btn btn--soft', href: 'index.html' }, ['Volver a VYGO'])
        ])
      ])
    ]);
  }

  /* ---------- Navegación ---------- */
  function next() {
    var q = QUESTIONS[state.step];
    if (!q || !isAnswered(q)) return;
    if (state.step === QUESTIONS.length - 1) { submit(); return; }
    go(state.step + 1, 1);
  }
  function back() {
    if (state.step <= 0) { go(-1, -1); return; }
    go(state.step - 1, -1);
  }

  btnNext.addEventListener('click', next);
  btnBack.addEventListener('click', back);

  document.addEventListener('keydown', function (ev) {
    var q = QUESTIONS[state.step];
    if (!q || ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var t = ev.target;
    var typing = t && (t.tagName === 'INPUT' && /text|number|email/.test(t.type) || t.tagName === 'TEXTAREA');

    if (ev.key === 'Enter' && !(t && t.tagName === 'BUTTON')) {
      ev.preventDefault();
      next();
      return;
    }
    if (typing) return;
    if ((q.type === 'single' || q.type === 'multi') && ev.key.length === 1) {
      var i = LETTERS.indexOf(ev.key.toUpperCase());
      if (i > -1 && i < q.options.length) {
        var input = document.getElementById(q.id + '-' + i);
        if (input) { input.click(); input.focus(); }
      }
    }
  });

  /* ---------- Envío ---------- */
  function flatten() {
    var a = state.answers, out = {};
    QUESTIONS.forEach(function (q) {
      var v = a[q.id];
      if (q.type === 'single') {
        out[q.id] = v ? (v.value === 'Otro' && v.other ? 'Otro: ' + v.other.trim() : v.value) : '';
      } else if (q.type === 'multi') {
        var vals = (v && v.values || []).map(function (x) {
          var o = q.options.filter(function (op) { return optLabel(op) === x; })[0];
          return o && isOther(o) && v.other ? x + ': ' + v.other.trim() : x;
        });
        out[q.id] = vals.join('; ');
      } else if (q.type === 'prices') {
        q.items.forEach(function (it) { out[it.id] = v && typeof v[it.id] === 'number' ? v[it.id] : ''; });
      } else if (q.type === 'city') {
        out[q.id] = v && v.value ? v.value.trim() : '';
      }
    });
    var params = new URLSearchParams(window.location.search);
    out.origen = params.get('utm_source') || params.get('origen') || 'web';
    out.duracion_segundos = state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : '';
    out.enviado_en = new Date().toISOString();
    return out;
  }

  function submit() {
    var payload = flatten();
    var endpoint = cfg.surveyEndpoint;
    var finish = function () {
      clearSaved();
      state.step = QUESTIONS.length;
      render(1);
    };

    if (cfg.demoMode || !endpoint) {
      if (!endpoint && !cfg.demoMode) console.warn('[VYGO] Falta surveyEndpoint en js/config.js: la respuesta no se envió.', payload);
      finish();
      return;
    }

    btnNext.disabled = true;
    btnNext.textContent = 'Enviando…';
    var status = document.getElementById('send-status');
    status.textContent = '';

    var isAppsScript = /script\.google\.com/.test(endpoint);
    var req = isAppsScript
      // Apps Script: texto plano sin preflight; la respuesta es opaca
      ? fetch(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
      : fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
          .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res; });

    req.then(finish).catch(function () {
      status.textContent = 'No se pudieron enviar tus respuestas. Revisa tu conexión y vuelve a tocar Enviar; no se borró nada.';
      updateActions();
    });
  }

  /* ---------- Arranque ---------- */
  var params = new URLSearchParams(window.location.search);
  if (params.has('empezar')) {
    var saved = load();
    state = saved && saved.step >= 0 && saved.step < QUESTIONS.length ? saved : { step: 0, answers: {}, startedAt: Date.now() };
  }
  render(1);
})();
