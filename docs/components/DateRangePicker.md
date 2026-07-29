# DateRangePicker

> Selector de rango de fechas con dos calendarios lado a lado, atajos configurables y resumen en el botón disparador — pensado para filtros y reportes.

**Import**
```tsx
import { DateRangePicker } from "lib-kit-components";
import type { DateRange } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás que el usuario elija un rango de fechas (desde/hasta) para filtrar datos o generar un reporte: ventas del último trimestre, rango de un dashboard, exportación de datos. Muestra siempre dos meses en paralelo (el actual y el siguiente) para facilitar elegir un rango que cruza de mes, y un botón de atajos (`presets`) a la izquierda del calendario para rangos comunes ("Últimos 7 días", "Este mes", etc.).

## Cuándo NO usarlo / alternativas

- Si necesitás elegir una sola fecha, o querés un único componente que soporte *tanto* fecha simple como rango bajo la misma API (con `min`/`max`, `disabledDate`, input con label/error/hint, modo `inline`, o navegar de a un solo mes), usá [DatePicker](DatePicker.md) con `mode="range"` en su lugar — `DateRangePicker` es una variante más simple y especializada: sin validación de límites, sin estado de error/hint, y siempre con dos meses visibles.
- Si el rango es sobre horarios de un día puntual (turnos, citas) y no sobre fechas de calendario, usá [BookingCalendar](BookingCalendar.md).
- Si sólo necesitás un rango numérico (precio, distancia), no de fechas, usá [DualRangeSlider](DualRangeSlider.md).

**Colisión de nombres:** este archivo exporta un tipo `DateRange` con la misma forma (`{ from: Date | null; to: Date | null }`) que el `DateRange` ya exportado por `components/DatePicker.tsx`. Ver nota al final del reporte del agente — no se resolvió el conflicto, sólo se documenta.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `DateRange` | — (requerido) | Rango controlado (`{ from, to }`, ambos nullable). |
| `onChange` | `(v: DateRange) => void` | — (requerido) | Se llama al elegir el primer día (`{ from: d, to: null }`) y al completar el segundo. |
| `presets` | `{ label: string; range: () => DateRange }[]` | `[]` | Atajos que se muestran en una columna a la izquierda del calendario (o fila en mobile); al elegir uno, llama `onChange` y cierra el popover. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de mes/año y días de la semana (`Intl.DateTimeFormat`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz (`inline-block`). |

## Tipos exportados

```ts
interface DateRange {
  from: Date | null;
  to: Date | null;
}
```

## Ejemplos

### Uso básico controlado
```tsx
const [range, setRange] = useState<DateRange>({ from: null, to: null });

<DateRangePicker value={range} onChange={setRange} />
```

### Con atajos
```tsx
<DateRangePicker
  value={range}
  onChange={setRange}
  presets={[
    { label: "Últimos 7 días", range: () => ({ from: addDays(new Date(), -7), to: new Date() }) },
    { label: "Este mes", range: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  ]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No depende de `framer-motion` ni de Next.js — el popover se muestra/oculta condicionalmente sin animación.

## Notas y comportamiento

- Es un componente **controlado**: no tiene estado interno propio para `value`, sólo para el mes visible (`cursor`), el hover de preview y si el popover está abierto.
- La selección funciona en dos clicks: el primer click siempre reinicia el rango (`{ from: d, to: null }`) salvo que ya hubiera un `from` sin `to`, en cuyo caso el segundo click cierra el rango (ordenando `from`/`to` automáticamente aunque el usuario clickee "para atrás").
- Mientras se elige el segundo extremo, el rango se previsualiza en el calendario con hover (`onMouseEnter` por celda), sin necesidad de mover el mouse fuera del popover para confirmar.
- El popover no se cierra al hacer click afuera (no hay listener de `mousedown` global como en `DatePicker`) — sólo se cierra al elegir un preset. Tenerlo en cuenta si se envuelve en un layout con scroll.
- No tiene `min`/`max`/`disabledDate`: cualquier fecha del mes visible es seleccionable.
