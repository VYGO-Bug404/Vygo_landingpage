# VYGO · Landing page

Landing estática de **VYGO**, el copiloto del reparto multiapp: *tres apps, un solo turno.*
Construida 100 % fiel al **Manual de identidad visual v3.0 · 2026** y al pitch deck de HackMTY 2026.

Sin frameworks ni build: HTML, CSS y JavaScript puros. Se sube tal cual a cualquier hosting estático.

## Secciones

| # | Sección | Ancla |
|---|---------|-------|
| 1 | Hero y propuesta de valor | `#inicio` |
| 2 | El problema: el turno multiapp | `#problema` |
| 3 | La solución: características + comparativa | `#solucion` |
| 4 | Tracción: validación en calle | `#resultados` |
| — | Hoja de ruta | `#hoja-de-ruta` |
| 5 | Lanzamiento: fecha, encuesta, newsletter y contacto | `#lanzamiento` |

Además hay una página aparte, **`encuesta.html`**: el estudio de mercado de VYGO (18 preguntas en
5 secciones), una pregunta por pantalla, con la ruta de la marca como barra de progreso.
Se contesta tocando o con el teclado (letras A–E y Enter), guarda el avance en el navegador
si la persona sale y regresa, y acepta `?utm_source=whatsapp` (o cualquier canal) para saber
de dónde llegó cada respuesta.

## Antes de publicar: edita `js/config.js`

Todo lo que cambia seguido vive en un solo archivo:

```js
window.VYGO_CONFIG = {
  launchDate: '2026-11-30',                 // fecha de salida (o null = "Sale muy pronto.")
  surveyUrl: 'encuesta.html',               // liga de la encuesta (la propia del sitio)
  surveyEndpoint: '',                       // a dónde se mandan las respuestas (ver abajo)
  contactEmail: 'marca@vygo.app',           // correo de contacto
  newsletterEndpoint: ''                    // endpoint del formulario (ver abajo)
};
```

### Respuestas de la encuesta → Google Sheets

1. Crea una hoja de cálculo nueva y abre *Extensiones → Apps Script*.
2. Pega el contenido de `tools/encuesta-google-sheets.gs` y guarda.
3. *Implementar → Nueva implementación → Aplicación web*, ejecutar como **Yo**, acceso **Cualquier usuario**.
4. Copia la URL que termina en `/exec` y pégala en `surveyEndpoint`.

Cada respuesta llega como una fila en la pestaña *Respuestas*, con una columna por pregunta
(los precios de Van Westendorp como números, en MXN / mes), más `origen`, `duracion_segundos`
y `enviado_en`. También sirve cualquier servicio que reciba JSON por `POST` (por ejemplo Formspree).

> Sin `surveyEndpoint` la encuesta se puede contestar pero **las respuestas no se guardan**.

### Newsletter

El formulario manda `email`, `apps` y `origen` por `POST` al endpoint que pongas.
Opción rápida y gratis: [Formspree](https://formspree.io) → crea un formulario y pega su URL
(`https://formspree.io/f/xxxxxxx`) en `newsletterEndpoint`.

Si el endpoint está vacío, el formulario abre un correo prellenado dirigido a `contactEmail`,
así nadie se queda sin registrarse mientras lo configuran.

## Correr en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar

- **GitHub Pages**: ya incluye el workflow `.github/workflows/pages.yml`.
  En el repo ve a *Settings → Pages → Source: GitHub Actions*. Cada push a `main` publica.
- **Vercel / Netlify**: importa el repo, sin comando de build, directorio de salida `/`.

## Estructura

```
index.html                 Landing completa (incluye el logo, isotipo y pin como símbolos SVG)
encuesta.html              Estudio de mercado, una pregunta por pantalla
css/fonts.css              Outfit y Nunito servidas desde el sitio
css/styles.css             Sistema visual (tokens de color, tipografía, radios, secciones)
js/config.js               Valores editables
css/encuesta.css           Estilos propios de la encuesta
js/main.js                 Ruta animada, temporizador, cuenta regresiva y formulario
js/encuesta.js             Preguntas, navegación, guardado de avance y envío
assets/brand/              Logo, isotipo y pin vectorizados del manual
assets/trama/              Trama de flujo y teselación del marcador
assets/fonts/              Tipografías (SIL Open Font License)
tools/generar-trama.py     Regenera las tramas con otra semilla o color
tools/encuesta-google-sheets.gs  Receptor de respuestas para Google Sheets
CLAUDE.md                  Reglas de marca para seguir iterando con Claude Code
```

## Reglas de marca que respeta el código

- El neón `#B5FF5B` solo aparece en acción o ganancia, y siempre con tinta oscura encima.
- Un solo botón neón por pantalla.
- Texto verde sobre claro en `#4F7700`, nunca el neón.
- Negro absoluto solo en el logotipo y el pin.
- La trama y la ruta entran por una esquina; el texto va en bloques sólidos.
- Nada de flechas, cruces ni líneas punteadas.

---

Equipo **Bug404** · HackMTY 2026 · Reto The Courier de Infosys · Monterrey, México
