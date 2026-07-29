# DualRangeSlider

> Slider de rango numérico con dos manijas (mínimo y máximo), típico de un filtro de precio.

**Import**
```tsx
import { DualRangeSlider } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para filtros de rango numérico con dos extremos: precio mínimo/máximo, distancia, superficie, edad. Muestra los dos valores actuales arriba del track y dos manijas arrastrables que no pueden cruzarse entre sí.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás un único valor numérico (no un rango de mínimo y máximo), esto no es el componente — no hay una versión de una sola manija en la librería; usá un `Input type="range"` nativo o un [Input](Input.md) numérico.
- Si el rango es de **fechas** en vez de números, usá [DateRangePicker](DateRangePicker.md) o [DatePicker](DatePicker.md) con `mode="range"`, no `DualRangeSlider`.
- Si necesitás convertir un valor entre unidades (no filtrar un rango), usá [UnitConverter](UnitConverter.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `min` | `number` | — (requerido) | Valor mínimo permitido. |
| `max` | `number` | — (requerido) | Valor máximo permitido. |
| `step` | `number` | `1` | Paso de incremento; cada valor arrastrado se redondea al múltiplo de `step` más cercano. |
| `value` | `[number, number]` | — (requerido) | Tupla `[lo, hi]` controlada. |
| `onChange` | `(v: [number, number]) => void` | — (requerido) | Se llama en cada movimiento de cualquiera de las dos manijas. |
| `format` | `(n: number) => string` | `String` | Formatea los valores mostrados arriba del track (ej. `$${n}`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Filtro de precio
```tsx
const [range, setRange] = useState<[number, number]>([20, 80]);

<DualRangeSlider
  min={0} max={100} step={5}
  value={range} onChange={setRange}
  format={(n) => `$${n}`}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas; el arrastre se implementa con Pointer Events nativos (`onPointerDown` + listeners globales de `pointermove`/`pointerup`), sin `framer-motion`.

## Notas y comportamiento

- Es un componente **controlado**: no tiene estado interno para `value`, sólo lee `[min, max]` recibidos vía `value`.
- La manija `lo` nunca puede superar `hi - step`, y la manija `hi` nunca puede bajar de `lo + step` — el propio `onChange` aplica ese clamp antes de notificar, así que el consumidor no necesita validar el orden.
- El arrastre usa `setPointerCapture` sobre la manija y agrega/quita listeners de `pointermove`/`pointerup` en `window` dentro del propio handler de `onPointerDown`, por lo que funciona con mouse y touch sin lógica adicional.
- No tiene navegación por teclado (no son `<input type="range">` nativos ni tienen `role="slider"`/`aria-valuenow`) — a tener en cuenta para accesibilidad si el caso de uso lo requiere.
- No expone ningún tipo exportado adicional — sólo el componente.
