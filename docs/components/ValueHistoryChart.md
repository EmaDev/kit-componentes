# ValueHistoryChart

> Gráfico de área/línea del historial de un valor (cotización, saldo, precio de un activo), con toggle de período, variación porcentual y crosshair interactivo al pasar el mouse.

**Import**
```tsx
import { ValueHistoryChart } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario necesita explorar cómo evolucionó **un** valor a lo largo del tiempo (el saldo de su cuenta, el precio de una cripto/acción, la cotización de una moneda), con la posibilidad de cambiar de período (ej. "1S" / "1M" / "1A") y ver el valor exacto de cualquier punto pasando el mouse.

## Cuándo NO usarlo / alternativas

- Para un resumen compacto de un KPI dentro de una grilla (sin interacción, sólo un vistazo rápido), usá [KpiCard](KpiCard.md).
- Si necesitás graficar datos arbitrarios (varias series, JSON pegado por el usuario, tabla/árbol como vistas alternativas), usá [JsonChartViewer](JsonChartViewer.md) — `ValueHistoryChart` está especializado en una sola serie de valor monetario a través del tiempo, con formato de moneda incorporado.
- Si lo que hace falta es comparar cotizaciones de distintos proveedores en un instante puntual (no una serie histórica), usá [RateComparator](RateComparator.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `periods` | `ValueHistoryPeriod[]` | — (requerido) | Períodos disponibles, cada uno con su propia serie de puntos. |
| `defaultPeriod` | `string` | `periods[0]?.id` | `id` del período seleccionado inicialmente. |
| `currency` | `string` | `"USD"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de moneda y fecha. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface ValuePoint { date: Date; value: number }
interface ValueHistoryPeriod { id: string; label: string; points: ValuePoint[] }
```

## Ejemplos

### Básico con dos períodos
```tsx
<ValueHistoryChart
  currency="ARS"
  periods={[
    {
      id: "7d", label: "7D",
      points: [
        { date: new Date("2026-07-20"), value: 180000 },
        { date: new Date("2026-07-21"), value: 182500 },
        { date: new Date("2026-07-22"), value: 179800 },
        { date: new Date("2026-07-23"), value: 185300 },
        { date: new Date("2026-07-24"), value: 190100 },
        { date: new Date("2026-07-25"), value: 188700 },
        { date: new Date("2026-07-26"), value: 184300 },
      ],
    },
    {
      id: "1m", label: "1M",
      points: monthlyPoints, // ValuePoint[] con ~30 puntos
    },
  ]}
  defaultPeriod="7d"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- `date` en `ValuePoint` debe ser una instancia real de `Date` — el componente llama `Intl.DateTimeFormat.format(hovered.date)` directamente, así que pasar un string o timestamp numérico rompe el formateo (a diferencia de otros componentes de la librería que aceptan `Date | string | number`).
- El componente **no ordena** los puntos: se asume que `points` ya viene en orden cronológico ascendente dentro de cada período.
- El gráfico (línea + área con gradiente) es un `<svg>` con `viewBox="0 0 100 40"` y `preserveAspectRatio="none"`, sin dependencias externas de charting.
- El color del gráfico (verde/rojo) y la flecha de variación dependen del signo del cambio entre el **primer y último punto del período actualmente seleccionado**, no de un valor de referencia externo.
- Al pasar el mouse sobre el gráfico, el valor grande de arriba y la fecha chica cambian para reflejar el punto bajo el cursor (`hoverIdx`); al salir del `<svg>`, vuelve a mostrar el último punto de la serie.
- Cambiar de período resetea implícitamente el hover (al desmontar/remontar el `<svg>` con nuevos puntos, `onMouseLeave` limpia el estado en la siguiente interacción, pero el índice de hover no se limpia automáticamente al hacer click en un período — si el mouse queda quieto sobre el gráfico, puede mostrar momentáneamente un índice fuera de contexto hasta el próximo `mousemove`).
