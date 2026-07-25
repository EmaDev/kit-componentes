# Skeleton / SkeletonText / SkeletonAvatar / SkeletonCard / SkeletonList / SkeletonTable

> Placeholders animados para estados de carga: un primitivo (`Skeleton`) con 4 formas, y cinco combinaciones listas para los casos más comunes (párrafo, avatar, tarjeta, lista/feed, tabla).

**Import**
```tsx
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList, SkeletonTable } from "lib-kit-components";
```

## Cuándo usarlo

Mientras se espera contenido asíncrono (fetch inicial, paginación, navegación entre rutas) y ya sabés aproximadamente la forma final del contenido: mostrar un placeholder que imita esa forma reduce el "salto" visual cuando los datos llegan y se percibe más rápido que un spinner centrado. `Skeleton` es el bloque de más bajo nivel (una forma: texto, círculo, rectángulo o redondeado) para armar layouts custom. Los demás son combinaciones ya armadas para los patrones más frecuentes: `SkeletonText` (párrafo de N líneas), `SkeletonAvatar` (círculo de avatar), `SkeletonCard` (tarjeta con media + título + texto, con avatar opcional), `SkeletonList` (filas de un feed/lista), `SkeletonTable` (grilla de una tabla).

## Cuándo NO usarlo / alternativas

- Si no sabés la forma del contenido que va a cargar (o el layout es muy variable), usá [Spinner](Spinner.md) — un skeleton que no se parece en nada al resultado final genera más "salto" percibido que un spinner simple.
- Si la carga es una acción puntual del usuario (submit de un formulario, click en un botón), usá el `loading` de [Button](Button.md) en vez de un skeleton de página completa.
- Si necesitás comunicar progreso real medible (subida de archivo, importación), usá [Progress](Progress.md) — el skeleton no representa porcentaje, sólo "esto está cargando".
- Para armar un layout de carga que no encaja en `SkeletonCard`/`SkeletonList`/`SkeletonTable`, componé el primitivo `Skeleton` directamente (ver ejemplos).

## Props

### Skeleton (primitivo)

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `"text" \| "circle" \| "rect" \| "rounded"` | `"text"` | Forma del placeholder. `text`≈línea de texto (`rounded-md`, alto 14px), `circle`=avatar (`rounded-full`, 40×40px), `rect`=bloque sin bordes redondeados (120px alto), `rounded`=bloque con `rounded-xl` (120px alto, ideal para imágenes/media). |
| `width` | `number \| string` | `"100%"` (o `40` si `variant="circle"`) | Ancho del bloque (px si es número, o cualquier valor CSS si es string, ej. `"60%"`). |
| `height` | `number \| string` | según `variant` (ver arriba) | Alto del bloque. |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | `pulse`=parpadeo de opacidad infinito. `wave`=brillo diagonal que recorre el bloque de izquierda a derecha. `none`=estático, sin animación. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### SkeletonText

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `lines` | `number` | `3` | Cantidad de líneas del párrafo. |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Igual que en `Skeleton`. |
| `lastLineWidth` | `number \| string` | `"70%"` | Ancho de la última línea (simula el corte natural de un párrafo). Sólo aplica si `lines > 1`. |
| `spacing` | `number` | `8` | Separación vertical entre líneas, en px. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### SkeletonAvatar

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `size` | `number` | `40` | Diámetro en px. |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Igual que en `Skeleton`. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### SkeletonCard

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Igual que en `Skeleton`. |
| `media` | `boolean` | `true` | Muestra un bloque de imagen/media arriba de la tarjeta. |
| `mediaHeight` | `number` | `140` | Alto en px del bloque de media (si `media`). |
| `avatar` | `boolean` | `false` | Muestra un `SkeletonAvatar` junto al título (tarjeta tipo post/comentario). |
| `lines` | `number` | `2` | Líneas del párrafo debajo del título. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### SkeletonList

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `rows` | `number` | `4` | Cantidad de filas. |
| `avatar` | `boolean` | `true` | Muestra un `SkeletonAvatar` de 36px a la izquierda de cada fila. |
| `lines` | `number` | `2` | Líneas de texto por fila. |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Igual que en `Skeleton`. |
| `className` | `string` | `""` | Clases CSS adicionales. |

### SkeletonTable

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `rows` | `number` | `5` | Filas de datos. |
| `columns` | `number` | `4` | Columnas (aplica tanto al header como a las filas). |
| `header` | `boolean` | `true` | Muestra una fila de header separada por un borde inferior. |
| `animation` | `"pulse" \| "wave" \| "none"` | `"pulse"` | Igual que en `Skeleton`. |
| `className` | `string` | `""` | Clases CSS adicionales. |

## Ejemplos

### Primitivo, layout custom
```tsx
<div className="flex items-center gap-3">
  <Skeleton variant="circle" width={48} height={48} />
  <div className="flex-1">
    <Skeleton variant="text" width="40%" height={16} className="mb-2" />
    <Skeleton variant="text" width="80%" />
  </div>
</div>
```

### Párrafo de carga
```tsx
<SkeletonText lines={4} />
```

### Animación "wave" en vez de "pulse"
```tsx
<Skeleton variant="rounded" height={160} animation="wave" />
```

### Tarjeta de producto/post mientras carga
```tsx
<SkeletonCard media mediaHeight={160} avatar lines={2} />
```

### Feed de comentarios
```tsx
<SkeletonList rows={5} avatar lines={2} />
```

### Tabla mientras llegan los datos
```tsx
{loading ? <SkeletonTable rows={6} columns={5} /> : <DataTable columns={columns} rows={rows} rowKey={r => r.id} />}
```

### Placeholder de hidratación con usePlatform
```tsx
const { hydrating, os } = usePlatform();
if (hydrating) return <Skeleton variant="text" width={80} />;
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` para la animación de opacidad (`pulse`) y el brillo deslizante (`wave`).
- Todos son de sólo lectura/presentacionales, sin estado propio.

## Notas y comportamiento

- El primitivo `Skeleton` y `SkeletonText`/`SkeletonAvatar` son puramente decorativos (`aria-hidden="true"`) porque suelen usarse varios juntos; los compuestos (`SkeletonCard`, `SkeletonList`, `SkeletonTable`) llevan `role="status" aria-label="Cargando"` en su contenedor para que un lector de pantalla anuncie el estado de carga una sola vez en vez de por cada bloque individual.
- `animation="wave"` usa un degradado blanco semitransparente (`rgba(255,255,255,0.35)`) que se desliza sobre el bloque; funciona en claro y oscuro, pero el contraste del brillo es más sutil en tema oscuro por diseño (no hay una variante de color separada por tema).
- En `SkeletonText`, si `lines === 1` la única línea usa `100%` de ancho (no se aplica `lastLineWidth`), porque no hay "última línea distinta de la primera" que simular.
- `SkeletonTable` reparte columnas con CSS Grid (`repeat(columns, minmax(0, 1fr))`), así que todas las columnas quedan del mismo ancho — no soporta anchos custom por columna como `DataTable`.
- Todos los tamaños/anchos que no se pasan explícitamente son fijos (no se miden contra contenido real), así que si el contenido final tiene un tamaño muy distinto al placeholder puede notarse un salto de layout al reemplazarlo — ajustá `width`/`height`/`mediaHeight` para que se acerquen al resultado esperado.
