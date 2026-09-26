/* ==========================================================================
   VYGO · Configuración editable de la landing
   Cambia estos valores sin tocar el resto del código.
   ========================================================================== */
window.VYGO_CONFIG = {
  // Fecha de salida (formato AAAA-MM-DD, hora de Monterrey).
  // Déjala en null para mostrar "Sale muy pronto." y ocultar la cuenta regresiva.
  launchDate: '2026-11-30', // TODO: confirmar fecha real

  // Liga a la encuesta de interés. Por defecto, la encuesta propia del sitio.
  // Si queda vacía, el botón de la encuesta se oculta.
  surveyUrl: 'encuesta.html',

  // A dónde se mandan las respuestas de la encuesta (encuesta.html).
  // Recomendado: Google Sheets con tools/encuesta-google-sheets.gs (ver README).
  // También sirve Formspree u otro servicio que reciba JSON por POST.
  surveyEndpoint: '', // TODO: pegar URL del Apps Script publicado

  // Correo de contacto que aparece en la página.
  contactEmail: 'marca@vygo.app', // TODO: confirmar correo de contacto

  // Newsletter: endpoint que recibe el formulario por POST (por ejemplo Formspree:
  // https://formspree.io/f/xxxxxxx). Si queda vacío, el formulario abre un correo
  // prellenado dirigido a contactEmail para que nadie se quede sin registrarse.
  newsletterEndpoint: '' // TODO: pegar endpoint (Formspree, Getform, Basin…)
};
