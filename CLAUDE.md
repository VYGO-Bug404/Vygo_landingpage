# CLAUDE.md · Reglas para trabajar en la landing de VYGO

Landing estática (HTML + CSS + JS, sin build). Antes de cambiar diseño, respeta el
**Manual de identidad visual v3.0 · 2026**. Resumen operativo:

## Stack
- Sin frameworks ni dependencias. No agregues build steps sin que se pida.
- Valores editables (fecha, encuesta, correo, newsletter) solo en `js/config.js`.
- Tokens de diseño en `:root` de `css/styles.css`. Usa las variables, no hex sueltos.

## Color
| Token | Hex | Uso |
|---|---|---|
| `--neon` | `#B5FF5B` | Acción, ganancia, "GO". Poco y siempre con tinta oscura encima |
| `--indigo` | `#0E1145` | Tinta y modo noche |
| `--cobalt` | `#4143B5` | Rutas y sistema |
| `--black` | `#000000` | Solo logotipo y pin |
| `--green-soft` | `#F1FCDF` | Superficie amable |
| `--indigo-soft` | `#EDEFFF` | Superficie de sistema |
| `--green-ink` | `#4F7700` | Texto verde sobre claro (nunca el neón) |

- Un solo botón neón por pantalla.
- La marca saluda en claro (blanco + superficies suaves) y trabaja en oscuro (producto en modo noche).

## Tipografía
- Títulos: **Outfit** 500/600/700, tracking −3 %.
- Texto y datos: **Nunito** 400 texto, 700 etiquetas, 800 cifras. Mínimo 13 px.
- Nada de serifas ni monoespaciadas.

## Forma
- Bloques redondeados (`--r-xl` 32 px, `--r-lg` 24 px), botones de cápsula.
- Ruta continua: grosor 1x, giros de radio ≥ 3x, inicio en punto redondo, final en el pin.
- Nunca: flechas, cruces, líneas punteadas, sombras o 3D en el logo, degradados en el trazo.
- Trama y ruta entran por una esquina, nunca detrás del texto. El texto va en bloque sólido.
- Un recurso gráfico por pieza (ruta, trama o teselación; no se mezclan).
- Teselación: módulo 4×4, marcador 2.5 centrado, gira 180° en damero, nunca cortado a la mitad en un borde visible.

## Voz
- Cortito: frases de una línea, verbos directos.
- Copiloto, no jefe: sugiere y explica por qué; nunca órdenes ni regaños.
- En pesos y minutos: "+$96", "8 min", "−1.4 km". Cero lenguaje corporativo, cero promesas sin número.
- Tutea al repartidor. Español de México.

## Datos reales (no inventar otros)
- 3.5x más ingreso por turno ($889 vs $254 en dos horas).
- 16 entregas en dos horas (5 con el modelo tradicional).
- −54 % km por pedido (4.17 km vs 9.10 km).
- 30 de 30 escenarios de turno real en Monterrey. Decisión en < 150 ms. Hasta 4 pedidos apilados.

## Calidad mínima
- Responsive hasta 360 px sin scroll horizontal.
- Foco visible, `prefers-reduced-motion` respetado, contraste AA.
- Revisa en navegador (escritorio y móvil) después de cada cambio visual.
