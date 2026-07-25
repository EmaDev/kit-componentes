# BookReader

> Lector de texto paginado tipo Google Books: columnas CSS (`column-count`), avance por página (no scroll continuo), tema claro/sepia/oscuro, tamaño de fuente ajustable e índice de capítulos. Recuerda posición y progreso.

**Import**
```tsx
import { BookReader } from "lib-kit-components";
import type { BookChapter, ReaderTheme } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para contenido de lectura extensa dividido en capítulos (libros, manuales, artículos largos) donde el usuario espera una experiencia de "página" en vez de scroll infinito: control de tipografía, tema de lectura (sepia para lectura prolongada), índice, y progreso guardado entre sesiones (`storageKey`).

## Cuándo NO usarlo / alternativas

- Si el contenido es corto o no necesita paginación (un artículo de blog normal), un `<article>` con scroll estándar es más simple.
- Para posts sociales con reacciones/comentarios, usá [SocialPost](SocialPost.md), no `BookReader`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título del libro/documento (barra superior). |
| `author` | `string` | `undefined` | Autor, debajo del título en la barra superior. |
| `chapters` | `BookChapter[]` | — (requerido) | Capítulos con sus párrafos. |
| `defaultChapter` | `number` | `0` | Índice del capítulo inicial (ignorado si hay posición guardada en `storageKey`). |
| `spread` | `"single" \| "double" \| "auto"` | `"auto"` | Una o dos columnas por pantalla; `auto` usa dos si el viewport mide ≥720px. |
| `theme` | `ReaderTheme` | `undefined` (interno: `"light"`) | Tema controlado. Sin esta prop, el usuario lo cambia con los botones de la barra y el componente maneja su propio estado. |
| `onThemeChange` | `(t: ReaderTheme) => void` | `undefined` | Notifica cambios de tema (útil para persistirlo vos mismo). |
| `fontSize` | `number` | `undefined` (interno: `17`) | Tamaño de fuente en px, controlado. |
| `onFontSizeChange` | `(px: number) => void` | `undefined` | Notifica cambios de tamaño (5 pasos: 15/17/19/21/24). |
| `storageKey` | `string` | `undefined` | Si se define, guarda y restaura capítulo + página en `localStorage`. |
| `height` | `number \| string` | `560` | Alto del lector. |
| `onProgress` | `(pct: number) => void` | `undefined` | Se llama con el progreso global (0–100) en cada cambio de página/capítulo. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface BookChapter {
  id: string;
  title: string;
  paragraphs: string[];   // también acepta HTML simple como texto plano
}
type ReaderTheme = "light" | "sepia" | "dark";
```

## Ejemplos

### Uso básico con progreso guardado
```tsx
<BookReader
  title="Las sillas de la calle Aldama" author="Irene Costa"
  chapters={[{ id: "c1", title: "I · El taller", paragraphs: [...] }]}
  spread="auto" theme="sepia" fontSize={19} height={560}
  storageKey="reader.aldama"
  onProgress={(pct) => save(pct)}
/>
```

### Forzando una sola columna
```tsx
<BookReader title="Manual rápido" chapters={chapters} spread="single" height={480} />
```

## Requisitos / dependencias

- No usa `framer-motion`; el avance de página es CSS (`transform: translateX` + `transition`).
- Marcado como `"use client"`.
- Usa `ResizeObserver` y `document.fonts.ready` para recalcular la paginación cuando cambia el tamaño de fuente, el tema, o el viewport rota — no necesitás forzar un recálculo manual.

## Notas y comportamiento

- La paginación se basa en `column-count` + `column-fill: auto`: al cambiar el tamaño de fuente o rotar el dispositivo, el componente **repagina automáticamente sin perder el capítulo actual** (ajusta `page` al nuevo total de páginas).
- La navegación acepta: click en las zonas de toque laterales (18% del ancho a cada lado), flechas de la barra inferior, y teclado (`←`/`→`/`PageUp`/`PageDown`/`Espacio`).
- Al llegar al final de un capítulo y avanzar, pasa automáticamente al siguiente capítulo (página 0); al retroceder desde la página 0 del capítulo actual, retrocede al capítulo anterior.
- `onProgress` reporta el progreso **global** del libro (capítulos completados + fracción de página del capítulo actual), no sólo del capítulo visible.
- Si `theme`/`fontSize` se pasan como props controladas, los botones de la barra superior igual disparan `onThemeChange`/`onFontSizeChange`, pero es responsabilidad de quien consume el componente reflejar el cambio de vuelta en la prop.
