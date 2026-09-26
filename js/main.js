/* ==========================================================================
   VYGO · Landing — comportamiento
   Sin dependencias. Todo lo editable vive en js/config.js
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.VYGO_CONFIG || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: borde al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hero: la ruta se dibuja una sola vez ---------- */
  var hero = document.querySelector('.hero');
  var heroPath = document.querySelector('.hero__route .route-path');
  if (hero && heroPath) {
    try {
      var len = Math.ceil(heroPath.getTotalLength());
      heroPath.style.setProperty('--len', len);
    } catch (e) { /* sin soporte: se muestra completa */ }
    var draw = function () { hero.classList.add('is-drawn'); };
    if (reduceMotion) { draw(); }
    else { requestAnimationFrame(function () { requestAnimationFrame(draw); }); }
  }

  /* ---------- Temporizador de la tarjeta de decisión (solo en pantalla) ---------- */
  var timer = document.querySelector('.decision__timer span');
  if (timer && !reduceMotion && 'IntersectionObserver' in window && timer.animate) {
    var anim = timer.animate(
      [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0.08)' }],
      { duration: 30000, iterations: Infinity, easing: 'linear' }
    );
    anim.pause();
    timer.style.width = '100%';
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? anim.play() : anim.pause(); });
    }).observe(timer);
  }

  /* ---------- Fecha de salida y cuenta regresiva ---------- */
  var titleEl = document.querySelector('[data-launch-title]');
  var countdown = document.querySelector('[data-countdown]');
  if (cfg.launchDate && titleEl) {
    // Medianoche en Monterrey (UTC-6, sin horario de verano desde 2022)
    var launch = new Date(cfg.launchDate + 'T00:00:00-06:00');
    if (!isNaN(launch)) {
      var fmt = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', timeZone: 'America/Monterrey' });
      titleEl.textContent = 'Sale el ' + fmt.format(launch) + '.';

      var daysEl = countdown && countdown.querySelector('[data-days]');
      var hoursEl = countdown && countdown.querySelector('[data-hours]');
      var tick = function () {
        var diff = launch - new Date();
        if (diff <= 0) {
          titleEl.textContent = 'Ya salió. Súbete hoy.';
          if (countdown) countdown.hidden = true;
          return false;
        }
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        if (daysEl) daysEl.textContent = d;
        if (hoursEl) hoursEl.textContent = h;
        if (countdown) countdown.hidden = false;
        return true;
      };
      if (tick()) setInterval(tick, 60000);
    }
  }

  /* ---------- Encuesta y contacto ---------- */
  var survey = document.querySelector('[data-survey-link]');
  if (survey && cfg.surveyUrl) {
    survey.href = cfg.surveyUrl;
    survey.hidden = false;
  }

  if (cfg.contactEmail) {
    document.querySelectorAll('[data-contact-link]').forEach(function (a) {
      a.href = 'mailto:' + cfg.contactEmail;
    });
    document.querySelectorAll('[data-contact-text]').forEach(function (a) {
      a.href = 'mailto:' + cfg.contactEmail;
      a.textContent = cfg.contactEmail;
    });
  } else {
    document.querySelectorAll('[data-contact-link],[data-contact-text]').forEach(function (a) { a.hidden = true; });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Newsletter ---------- */
  var form = document.getElementById('newsletter');
  if (form) {
    var input = form.querySelector('#email');
    var msg = form.querySelector('.form__msg');
    var button = form.querySelector('button[type="submit"]');
    var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };

    var say = function (text, kind) {
      msg.textContent = text;
      msg.classList.toggle('is-ok', kind === 'ok');
      msg.classList.toggle('is-error', kind === 'error');
    };

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true' && emailOk(input.value.trim())) {
        input.removeAttribute('aria-invalid');
        say('', '');
      }
    });

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = input.value.trim();
      if (!emailOk(email)) {
        input.setAttribute('aria-invalid', 'true');
        say('Revisa tu correo: falta algo, como la @ o el dominio.', 'error');
        input.focus();
        return;
      }
      var apps = Array.prototype.map.call(form.querySelectorAll('input[name="apps"]:checked'), function (c) { return c.value; });

      // Vista previa (demo): no envía nada
      if (cfg.demoMode) {
        form.reset();
        say('Vista previa: en el sitio publicado aquí se guarda tu correo.', 'ok');
        return;
      }

      // Sin endpoint: abre un correo prellenado
      if (!cfg.newsletterEndpoint) {
        var body = 'Quiero que me avisen cuando salga VYGO.%0A%0ACorreo: ' + encodeURIComponent(email) +
          (apps.length ? '%0AApps: ' + encodeURIComponent(apps.join(', ')) : '');
        window.location.href = 'mailto:' + (cfg.contactEmail || '') + '?subject=' +
          encodeURIComponent('Avísame del lanzamiento de VYGO') + '&body=' + body;
        say('Abrimos tu correo para enviar el registro.', 'ok');
        return;
      }

      var data = new FormData();
      data.append('email', email);
      data.append('apps', apps.join(', '));
      data.append('origen', 'landing');

      button.disabled = true;
      say('Guardando…', '');
      fetch(cfg.newsletterEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.reset();
          say('Listo. Te avisamos el día que salga.', 'ok');
        })
        .catch(function () {
          say('No se pudo guardar tu correo. Intenta de nuevo en un momento.', 'error');
        })
        .finally(function () { button.disabled = false; });
    });
  }
})();
