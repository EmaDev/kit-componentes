# DatePicker

> Selector de fecha simple o rango, con popover o modo embebido (`inline`), atajos (`presets`), límites `min`/`max`, fechas bloqueadas, meses en paralelo y navegación por teclado.

**Import**
```tsx
import { DatePicker } from "lib-kit-components";
import type { DateRange } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para capturar una fecha o un rango de fechas dentro de un formulario: fecha de una visita, rango de reserva, filtro de período en un dashboard. Soporta ambos modos con la misma API (`mode="single"` o `mode="range"`) y se adapta a input+popover o a calendario siempre visible (`inline`, útil embebido en un panel lateral).

## Cuándo NO usarlo / alternativas

- Si necesitás elegir sólo una hora (no una fecha), no hay un `TimePicker` en esta librería todavía — construilo con `Select`/inputs numéricos propios.
- Si el rango de fechas es fijo y pequeño (ej. "hoy" / "esta semana" / "este mes"), un grupo de botones simple es más liviano que montar `DatePicker`.
- Para elegir un valor de una lista no temporal, usá [Select](Select.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `mode` | `"single" \| "range"` | `"single"` | Modo simple (`value` es `Date`) o rango (`value` es `DateRange`). |
| `value` | `Date \| DateRange \| null` | `undefined` | Valor controlado. |
| `onChange` | `(value: Date \| DateRange \| null) => void` | `undefined` | Se llama al elegir un día, un preset, o limpiar. |
| `label` | `string` | `undefined` | Label sobre el input (no aplica en `inline`). |
| `placeholder` | `string` | `"Elegí una fecha"` | Texto del input vacío. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de fechas y nombres de días/meses (`Intl.DateTimeFormat`). |
| `weekStartsOn` | `0 \| 1` | `1` | Primer día de la semana: `1` = lunes, `0` = domingo. |
| `min` | `Date` | `undefined` | Fecha mínima seleccionable. |
| `max` | `Date` | `undefined` | Fecha máxima seleccionable. |
| `disabledDate` | `(d: Date) => boolean` | `undefined` | Bloquea días adicionales por lógica propia (ej. fines de semana). |
| `presets` | `{ label: string; value: () => Date \| DateRange }[]` | `undefined` | Atajos rápidos (ej. "Hoy", "Próximos 7 días") mostrados arriba del calendario. |
| `months` | `1 \| 2` | `1` | Cantidad de meses mostrados en paralelo (útil en `mode="range"`). |
| `inline` | `boolean` | `false` | Calendario siempre visible, sin input ni popover. |
| `clearable` | `boolean` | `true` | Muestra "Limpiar" y "Hoy" al pie del calendario. |
| `error` | `string` | `undefined` | Mensaje de error (borde rojo + texto debajo del input). |
| `hint` | `string` | `undefined` | Texto de ayuda debajo del input (ignorado si hay `error`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface DateRange {
  from: Date | null;
  to: Date | null;
}
```

## Ejemplos

### Fecha simple con presets y días bloqueados
```tsx
<DatePicker
  value={date} onChange={setDate}
  label="Fecha de la visita" min={hoy} max={enDosMeses}
  disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
  presets={[{ label: "Hoy", value: () => new Date() }]}
  weekStartsOn={1} locale="es-AR"
/>
```

### Rango con dos meses en paralelo
```tsx
<DatePicker mode="range" months={2} value={range} onChange={setRange} />
```

### Embebido (sin input, siempre visible)
```tsx
<DatePicker inline value={date} onChange={setDate} />
```

## Requisitos / dependencias

- Usa `framer-motion` para la entrada/salida del popover y el resaltado del día seleccionado (`layoutId`).
- Marcado como `"use client"`.
- Es controlado: no hay estado interno de valor — siempre pasá `value` + `onChange` (podés inicializar `value={null}`).

## Notas y comportamiento

- En `mode="range"`, tocar un día cuando ya hay un rango completo (`from` y `to` definidos) **reinicia** la selección (`{ from: nuevoDía, to: null }`) en vez de extenderla — es el comportamiento estándar de rango de dos clicks.
- El resaltado del rango intermedio usa `hoverDate` cuando sólo hay `from`: al pasar el mouse sobre los días se previsualiza el rango antes de confirmar el segundo click.
- `blocked` combina `min`, `max` y `disabledDate` — un día bloqueado se muestra tachado y no dispara `onChange` al clickearlo.
- El botón "Hoy" al pie sólo mueve el cursor del calendario al mes actual; no selecciona el día (para eso usá un preset `{ label: "Hoy", value: () => new Date() }`).
- Con `inline`, el componente ignora `label`/`placeholder`/`error`/`hint` (no hay input) pero conserva `presets` y `clearable`.
