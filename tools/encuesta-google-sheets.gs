/**
 * VYGO · Receptor de la encuesta en Google Sheets
 *
 * Cómo usarlo (5 minutos):
 * 1. Crea una hoja de cálculo nueva en Google Sheets.
 * 2. Menú Extensiones → Apps Script. Borra lo que haya y pega este archivo.
 * 3. Guarda. Luego Implementar → Nueva implementación → tipo "Aplicación web".
 *      Ejecutar como: Yo
 *      Quién tiene acceso: Cualquier usuario
 * 4. Autoriza los permisos y copia la URL que termina en /exec.
 * 5. Pégala en js/config.js → surveyEndpoint.
 *
 * Cada respuesta llega como una fila nueva en la pestaña "Respuestas".
 * La primera fila se crea sola con los nombres de las columnas.
 */

var SHEET_NAME = 'Respuestas';

var COLUMNS = [
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

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.setFrozenRows(1);
    }

    var row = COLUMNS.map(function (key) {
      var v = data[key];
      return v === undefined || v === null ? '' : v;
    });
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
