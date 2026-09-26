/* ==========================================================================
   VYGO · Envío de datos (encuesta y newsletter)
   - Un solo endpoint puede recibir ambos (Google Apps Script en tools/).
   - Si no hay señal, guarda el envío en el navegador y lo reintenta solo:
     al volver la conexión o la próxima vez que se abra cualquier página del sitio.
   ========================================================================== */
(function () {
  'use strict';

  var QUEUE_KEY = 'vygo-envios-pendientes';

  function readQueue() {
    try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch (e) { return []; }
  }
  function writeQueue(q) {
    try {
      if (q.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(q.slice(-20)));
      else localStorage.removeItem(QUEUE_KEY);
    } catch (e) { /* sin almacenamiento */ }
  }

  function post(endpoint, payload) {
    if (/script\.google\.com/.test(endpoint)) {
      // Apps Script: texto plano para evitar preflight; la respuesta es opaca
      return fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    }
    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res;
    });
  }

  /**
   * Envía un registro. Resuelve con 'sent' o 'queued'.
   * 'queued' = no hubo conexión; se guardó y se mandará después.
   */
  function send(endpoint, payload) {
    if (!endpoint) return Promise.reject(new Error('sin-endpoint'));
    return post(endpoint, payload)
      .then(function () { return 'sent'; })
      .catch(function () {
        var q = readQueue();
        q.push({ endpoint: endpoint, payload: payload });
        writeQueue(q);
        return 'queued';
      });
  }

  var flushing = false;
  function flush() {
    if (flushing || (navigator.onLine === false)) return;
    var q = readQueue();
    if (!q.length) return;
    flushing = true;
    var remaining = [];
    var chain = Promise.resolve();
    q.forEach(function (item) {
      chain = chain.then(function () {
        return post(item.endpoint, item.payload).catch(function () { remaining.push(item); });
      });
    });
    chain.then(function () {
      // Conserva lo que se haya encolado mientras tanto
      var now = readQueue().slice(q.length);
      writeQueue(remaining.concat(now));
      flushing = false;
    });
  }

  window.addEventListener('online', flush);
  if (document.readyState === 'complete') setTimeout(flush, 1500);
  else window.addEventListener('load', function () { setTimeout(flush, 1500); });

  window.VYGO_SEND = { send: send, flush: flush, pending: function () { return readQueue().length; } };
})();
