# TimePicker

> Selector de horario (horas/minutos, opcionalmente segundos), con popover o modo embebido (`inline`), formato 12h o 24h, atajos (`presets`), límites `min`/`max` y horarios bloqueados.

**Import**
```tsx
import { TimePicker } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para capturar un horario dentro de un formulario: hora de una reserva, horario de apertura/cierre, hora de entrega. El valor es un string `"HH:mm"` (24h, con cero a la izquierda) — o `"HH:mm:ss"` si activás `seconds` — en vez de un `Date`, para no atarlo a un día concreto.

## Cuándo NO usarlo / alternativas

- Si necesitás elegir una fecha (con o sin horario asociado a un día concreto), usá [DatePicker](DatePicker.md).
- Si el horario es uno de una lista fija de turnos/slots disponibles (no un horario libre), un [Select](Select.md) o un grupo de botones es más simple que montar `TimePicker`.
- Para elegir un rango horario con dos `TimePicker` (desde/hasta), combinalos vos mismo — no hay un modo `range` incorporado.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `string \| null` | `undefined` | Valor controlado, `"HH:mm"` (24h) o `"HH:mm:ss"` si `seconds` está activo. |
| `onChange` | `(value: string \| null) => void` | `undefined` | Se llama al elegir hora/minuto/segundo, un preset, o limpiar. |
| `label` | `string` | `undefined` | Label sobre el input (no aplica en `inline`). |
| `placeholder` | `string` | `"Elegí un horario"` | Texto del input vacío. |
| `locale` | `string` | `"es-AR"` | Locale para formatear el horario mostrado en el input (`Intl.DateTimeFormat`). |
| `hour12` | `boolean` | `false` | Muestra columna de horas 1-12 + columna AM/PM en vez de 0-23. |
| `step` | `number` | `5` | Paso de la columna de minutos (ej. `15` → sólo :00, :15, :30, :45). |
| `seconds` | `boolean` | `false` | Agrega una columna de segundos. Cambia el formato de `value` a `"HH:mm:ss"`. |
| `min` | `string` | `undefined` | Horario mínimo seleccionable, `"HH:mm"`. |
| `max` | `string` | `undefined` | Horario máximo seleccionable, `"HH:mm"`. |
| `disabledTime` | `(h: number, m: number) => boolean` | `undefined` | Bloquea horarios adicionales por lógica propia (ej. horario de almuerzo). |
| `presets` | `{ label: string; value: () => string }[]` | `undefined` | Atajos rápidos (ej. "Ahora", "09:00") mostrados arriba de las columnas. |
| `inline` | `boolean` | `false` | Columnas siempre visibles, sin input ni popover. |
| `clearable` | `boolean` | `true` | Muestra "Limpiar" al pie de las columnas. |
| `error` | `string` | `undefined` | Mensaje de error (borde rojo + texto debajo del input). |
| `hint` | `string` | `undefined` | Texto de ayuda debajo del input (ignorado si hay `error`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Horario simple, paso de 15 minutos
```tsx
<TimePicker
  value={time} onChange={setTime}
  label="Hora de la reserva" step={15}
  presets={[{ label: "Ahora", value: () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  } }]}
/>
```

### Formato 12h (AM/PM) con límites
```tsx
<TimePicker
  value={time} onChange={setTime}
  hour12 min="09:00" max="18:00"
  disabledTime={(h) => h === 13} // bloquea el horario de almuerzo
/>
```

### Embebido (sin input, siempre visible)
```tsx
<TimePicker inline value={time} onChange={setTime} />
```

## Requisitos / dependencias

- Usa `framer-motion` para la entrada/salida del popover y el resaltado de la selección en cada columna.
- Marcado como `"use client"`.
- Es controlado: no hay estado interno de valor — siempre pasá `value` + `onChange` (podés inicializar `value={null}`).

## Notas y comportamiento

- Cada columna (horas, minutos, segundos) es una lista scrolleable independiente; al abrir el popover, la opción seleccionada de cada columna se centra automáticamente.
- Elegir una unidad (hora, minuto o segundo) **no cierra el popover** — a diferencia de `DatePicker` en modo simple, acá hace falta poder tocar varias columnas en secuencia. El popover se cierra con el botón "Listo", clickeando afuera, o `Escape`.
- `min`/`max` sólo comparan horas y minutos (no segundos) — un horario se bloquea si su combinación hora:minuto cae fuera del rango.
- Un botón de hora se deshabilita sólo si **ningún** minuto de esa hora es seleccionable dentro de `min`/`max`; `disabledTime` sólo se evalúa a nivel minuto, no deshabilita la hora completa.
- Con `hour12`, los botones AM/PM no se deshabilitan aunque todos los horarios de esa franja estén bloqueados por `min`/`max`.
- Con `inline`, el componente ignora `label`/`placeholder`/`error`/`hint` y no muestra el botón "Listo" (no hay popover que cerrar), pero conserva `presets` y `clearable`.
