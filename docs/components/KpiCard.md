# KpiCard

> Tarjeta compacta de un solo indicador (KPI), con sparkline de tendencia y badge de variación — pensada para grillas de dashboard con varios indicadores en fila.

**Import**
```tsx
import { KpiCard } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesitás mostrar un número clave (ventas del día, usuarios activos, saldo total) dentro de una grilla de varias tarjetas iguales, con opcionalmente una mini tendencia (sparkline) y una variación porcentual respecto de un período anterior (`delta`). Es la unidad mínima y más liviana de "métrica con contexto" de la librería.

## Cuándo NO usarlo / alternativas

- Si el usuario necesita explorar el historial completo de un valor (elegir período, ver el monto exacto en cada punto al pasar el mouse), usá [ValueHistoryChart](ValueHistoryChart.md) — `KpiCard` sólo insinúa la tendencia con una sparkline sin ejes ni interacción.
- Si el dato de entrada es JSON arbitrario (no necesariamente un único número financiero) y el usuario debe poder pegar/editar los datos o cambiar entre tabla, árbol y gráfico, usá [JsonChartViewer](JsonChartViewer.md) — `KpiCard` está pensado para un valor puntual ya calculado por vos, no para explorar datos crudos.
- Para un KPI más elaborado con ícono en chip de color y variante de `Card` (`elevated`/`glass`/etc.), considerá `StatCard` (ver [Card](Card.md)) — `KpiCard` es una versión más simple y específica de moneda/finanzas, con su propio marcado (no reusa `Card` por dentro).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `label` | `string` | — (requerido) | Etiqueta del indicador (uppercase, tracking ancho). |
| `value` | `string` | — (requerido) | Valor principal, ya formateado por vos (ej. `"$48.200"`). |
| `delta` | `{ value: string; direction: "up" \| "down" \| "flat" }` | `undefined` | Variación a mostrar en un badge: `value` es el texto ya formateado (ej. `"+12%"`), `direction` define color y flecha (`up` verde, `down` rojo, `flat` gris sin flecha). |
| `trend` | `number[]` | `undefined` | Serie de puntos para la sparkline SVG. |
| `tone` | `"neutral" \| "success" \| "danger"` | `"neutral"` | Color del texto del `value` únicamente. |
| `className` | `string` | `""` | Clases adicionales. |

## Ejemplos

### Básico
```tsx
<KpiCard label="Ventas de hoy" value="$184.300" />
```

### Con tendencia y variación
```tsx
<KpiCard
  label="Usuarios activos"
  value="2.480"
  delta={{ value: "+8,2%", direction: "up" }}
  trend={[1800, 1950, 2010, 2200, 2150, 2340, 2480]}
/>
```

### Tono de alerta, sin tendencia
```tsx
<KpiCard label="Reclamos abiertos" value="12" tone="danger" delta={{ value: "+4", direction: "up" }} />
```

### Grilla de KPIs
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <KpiCard label="MRR" value="$48.2k" delta={{ value: "+12,4%", direction: "up" }} trend={[8, 10, 9, 13, 15, 14, 18]} />
  <KpiCard label="Churn" value="2,1%" tone="danger" delta={{ value: "+0,3pp", direction: "up" }} />
  <KpiCard label="Tickets" value="86" tone="neutral" delta={{ value: "0", direction: "flat" }} />
  <KpiCard label="NPS" value="61" tone="success" delta={{ value: "+4", direction: "up" }} />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- La sparkline es un `<svg><polyline>` interno no exportado, siempre en el color fijo `text-primary/60` — **no** cambia con `tone`; `tone` sólo afecta el color del texto de `value`.
- Con `trend` de un solo punto, el cálculo `i / (trend.length - 1)` divide por cero (`NaN`) y la sparkline no se dibuja correctamente — pasá al menos 2 puntos si usás `trend`.
- El eje Y de la sparkline normaliza con `max - min || 1`, así que una serie con todos los valores iguales se dibuja como una línea plana centrada, sin romperse.
- `delta.direction === "flat"` no dibuja la flecha (sólo el texto), a diferencia de `up`/`down` que sí la muestran (rotada 180° para `down`).
- El componente no formatea moneda ni números por vos: `value` y `delta.value` se renderizan tal cual se los pases, a diferencia de otros componentes de esta categoría que usan `Intl.NumberFormat` internamente.
