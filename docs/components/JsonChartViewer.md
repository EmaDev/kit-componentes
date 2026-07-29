# JsonChartViewer

> Explorador de JSON arbitrario: pegá o cargá cualquier estructura y visualizala como gráfico (barras/líneas/área, si hay columnas numéricas), tabla legible, o árbol colapsable — con edición en vivo del JSON de entrada.

**Import**
```tsx
import { JsonChartViewer } from "lib-kit-components";
```

## Cuándo usarlo

Para depurar o explorar datos de forma genérica: respuestas de API, datasets pegados por el usuario, configuración — cualquier JSON cuya forma no conocés de antemano. Sirve tanto para arrays de objetos (filas), objetos planos de números (clave/valor), como para JSON anidado de cualquier profundidad (vista árbol).

## Cuándo NO usarlo / alternativas

- Si ya tenés un valor financiero puntual con su propia serie de tiempo bien tipada (`Date`/`number`) y necesitás formateo de moneda incorporado, usá [ValueHistoryChart](ValueHistoryChart.md) en vez de armar el JSON a mano.
- Para un solo indicador sin necesidad de explorar datos crudos, usá [KpiCard](KpiCard.md) — mucho más liviano.
- Para una tabla de datos "seria" con orden por columna, búsqueda y paginado sobre datos ya tipados, usá [DataTable](DataTable.md) — la vista tabla de `JsonChartViewer` es genérica y de sólo lectura, pensada para JSON de forma desconocida, no para grillas de producción.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `data` | `unknown` | `SAMPLE` interno | Dato inicial a mostrar/editar (se serializa a JSON con `JSON.stringify(data, null, 2)` como valor inicial del textarea). |
| `defaultView` | `"chart" \| "table" \| "tree"` | `"table"` | Vista inicial. |
| `defaultChartType` | `"bar" \| "line" \| "area"` | `"bar"` | Tipo de gráfico inicial (sólo aplica si se entra a la vista `"chart"`). |
| `className` | `string` | `""` | Clases adicionales del contenedor. |

## Tipos exportados

```ts
interface JsonChartViewerProps {
  data?: unknown;
  defaultView?: "chart" | "table" | "tree";
  defaultChartType?: "bar" | "line" | "area";
  className?: string;
}
```

## Ejemplos

### Básico, sin datos (usa el ejemplo interno)
```tsx
<JsonChartViewer />
```

### Con datos propios, arrancando en la vista gráfico
```tsx
<JsonChartViewer
  defaultView="chart"
  defaultChartType="line"
  data={[
    { mes: "Ene", ingresos: 18400, gastos: 11200 },
    { mes: "Feb", ingresos: 21750, gastos: 12900 },
    { mes: "Mar", ingresos: 19980, gastos: 13400 },
  ]}
/>
```

### Objeto plano de números (se convierte a filas clave/valor)
```tsx
<JsonChartViewer data={{ AMBA: 42, Litoral: 18, Cuyo: 9 }} />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.
- Los colores de las series (`SERIES_COLORS`) usan variables CSS del theme de la librería (`var(--color-primary)`, `--color-accent`, `--color-success)`, `--color-danger`, `--color-muted`) — necesita que esas custom properties estén definidas (ya lo están si usás el theme por default de `lib-kit-components`).

## Notas y comportamiento

- `data` sólo se usa como **valor inicial** del textarea (`useState(() => JSON.stringify(data ?? SAMPLE, null, 2))`); si el prop `data` cambia después del primer render, el contenido editado por el usuario no se resincroniza.
- El botón "Cargar ejemplo" siempre carga el dataset `SAMPLE` interno de la librería (ventas mensuales de ejemplo), **no** vuelve a poner el `data` original que le pasaste por props.
- El gráfico sólo está disponible si los datos son un array de objetos "planos" (mismas claves, sin arrays/objetos anidados) o un objeto cuyos valores son todos `number` — cualquier otra forma (anidada, mixta, array de primitivos) deja el botón "Gráfico" deshabilitado (`chartUnavailable`), pero las vistas Tabla y Árbol siguen funcionando con cualquier JSON válido.
- La columna X del gráfico (`xKey`) se infiere automáticamente como la primera clave que **no** sea numérica en todas las filas; si todas las claves son numéricas, usa la primera igual.
- Las series se pueden ocultar/mostrar individualmente haciendo click en su leyenda (`toggleSeries`); el estado de series activas es independiente del que trae el JSON (persiste mientras no cambies de dataset).
- El gráfico es 100% SVG inline (sin `<canvas>`), con `viewBox` fijo y `preserveAspectRatio="none"`; funciona para barras (con offset por serie), líneas (con puntos hoverables) y área (con relleno semitransparente).
- Un JSON inválido en el textarea muestra un mensaje de error en rojo y bloquea las tres vistas hasta corregirlo — no rompe el componente.
