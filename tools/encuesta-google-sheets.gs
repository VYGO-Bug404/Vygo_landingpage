/**
 * VYGO · Receptor de la encuesta y del newsletter en Google Sheets
 *
 * Cómo usarlo (5 minutos):
 * 1. Crea una hoja de cálculo nueva en Google Sheets (ej. "VYGO · Respuestas").
 * 2. Menú Extensiones → Apps Script. Borra lo que haya y pega este archivo.
 * 3. Guarda. Luego Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos y copia la URL que termina en /exec.
 * 5. Pégala en js/config.js → surveyEndpoint (la misma sirve para el newsletter).
 *
 * Crea dos pestañas solas:
 *   "Respuestas"  → una fila por encuesta contestada, una columna por pregunta.
 *   "Newsletter"  → una fila por correo registrado en la landing.
 *
 * Si cambias este archivo, vuelve a Implementar → Gestionar implementaciones →
 * editar → Versión: nueva. La URL /exec se mantiene.
 */

var SURVEY_SHEET = 'Respuestas';
var NEWSLETTER_SHEET = 'Newsletter';

var SURVEY_COLUMNS = [
  'enviado_en', 'origen', 'duracion_segundos',
  // Sección 1 · Operación diaria
  'transporte', 'plataformas', 'vehiculo', 'gasto_combustible',
  // Sección 2 · Experiencia en la calle
  'apps_simultaneas', 'mayor_perdida', 'dificultad_calculo',
  // Sección 3 · Interés en VYGO
  'utilidad', 'caracteristica', 'preocupacion',
  // Sección 4 · Precio (Van Westendorp, MXN / mes)
  'precio_muy_barato', 'precio_buena_oferta', 'precio_caro', 'precio_demasiado_caro', 'formato_pago',
  // Sección 5 · Perfil
  'edad', 'genero', 'rol_ingreso', 'dependientes', 'estudios', 'ciudad'
];

var NEWSLETTER_COLUMNS = ['enviado_en', 'email', 'apps', 'origen'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);

    // Campo trampa: solo lo llenan los bots
    if (data.website) return json({ ok: true });

    var isNewsletter = data.tipo === 'newsletter';
    if (isNewsletter && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(data.email || ''))) {
      return json({ ok: false, error: 'correo inválido' });
    }
    if (!isNewsletter && !data.transporte) {
      return json({ ok: false, error: 'encuesta vacía' });
    }

    var sheet = getSheet(isNewsletter ? NEWSLETTER_SHEET : SURVEY_SHEET,
                         isNewsletter ? NEWSLETTER_COLUMNS : SURVEY_COLUMNS);
    var columns = isNewsletter ? NEWSLETTER_COLUMNS : SURVEY_COLUMNS;

    var row = columns.map(function (key) {
      var v = data[key];
      if (v === undefined || v === null) return '';
      v = typeof v === 'string' ? v.slice(0, 500) : v;
      // Evita que un texto se interprete como fórmula en Sheets
      return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
    });
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function getSheet(name, columns) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(columns);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
