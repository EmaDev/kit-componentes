# BookingCalendar

> Reserva de turnos: tira de días horizontal + grilla de horarios disponibles/ocupados, con confirmación y estado de carga.

**Import**
```tsx
import { BookingCalendar } from "lib-kit-components";
import type { BookingSlot, BookingDay } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para reservar un turno u horario dentro de un conjunto acotado de días con disponibilidad predefinida por el backend: citas médicas, canchas, salones, servicios con agenda. A diferencia de un calendario genérico, no navega mes a mes ni calcula disponibilidad — recibe los `days` (con sus `slots` ya resueltos) y sólo se ocupa de la interacción: elegir día, elegir horario, confirmar.

## Cuándo NO usarlo / alternativas

- Si necesitás capturar una fecha (o rango de fechas) sin horarios de disponibilidad predefinidos, usá [DatePicker](DatePicker.md) (`mode="single"` o `mode="range"`) o [DateRangePicker](DateRangePicker.md) — `BookingCalendar` no navega meses ni calcula qué días están habilitados, sólo itera el array `days` que le pasás.
- Si necesitás elegir un rango de fechas (ej. check-in/check-out de una reserva de varias noches), usá [DateRangePicker](DateRangePicker.md) — `BookingCalendar` sólo selecciona un día + un horario puntual, no un rango.
- Si el calendario es de uso general (eventos, disponibilidad de un mes completo con navegación), usá [CalendarGrid](CalendarGrid.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `days` | `BookingDay[]` | — (requerido) | Días a mostrar en la tira horizontal, cada uno con sus horarios (`slots`) ya resueltos. |
| `value` | `{ date: Date; time: string } \| null` | `undefined` | Turno seleccionado (controlado). |
| `onChange` | `(v: { date: Date; time: string }) => void` | `undefined` | Se llama al elegir un horario disponible. |
| `onConfirm` | `(v: { date: Date; time: string }) => void \| Promise<void>` | `undefined` | Si se pasa, muestra el botón "Confirmar turno" al pie; puede ser async (el botón queda en estado de carga hasta que resuelva). |
| `locale` | `string` | `"es-AR"` | Locale para formateo de día de semana, número de día y mes (`Intl.DateTimeFormat`). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface BookingSlot {
  time: string;        // ej. "09:30"
  available: boolean;
}

export interface BookingDay {
  date: Date;
  slots: BookingSlot[];
}
```

## Ejemplos

### Uso básico con confirmación
```tsx
const [value, setValue] = useState<{ date: Date; time: string } | null>(null);

<BookingCalendar
  days={proximosDias} // BookingDay[] con slots ya resueltos por el backend
  value={value}
  onChange={setValue}
  onConfirm={async (v) => { await reservarTurno(v); toast.success("Turno reservado"); }}
/>
```

### Sólo selección, sin botón de confirmar
```tsx
<BookingCalendar days={dias} value={value} onChange={setValue} />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- Es (semi-)controlado: `value` decide qué horario aparece resaltado, pero la posición dentro de la tira de días (`dayIdx`) es estado interno propio, inicializado buscando el día de `value` en `days` (o el primero si no hay `value`/no matchea).

## Notas y comportamiento

- Un día se deshabilita en la tira horizontal si **ningún** slot tiene `available: true` (`d.slots.some(s => s.available)`); no hace falta pasar un flag de día aparte.
- `selectedTime` sólo se resalta si el `value.date` coincide (`toDateString()`) con el día actualmente mostrado (`day`); cambiar de día no borra `value`, sólo deja de resaltarlo hasta volver a ese día.
- El botón "Confirmar turno" sólo se renderiza si se pasa `onConfirm`; sin esa prop, `onChange` es la única forma de reaccionar a la selección (útil si el consumidor maneja la confirmación en otro lugar de la UI).
- El botón de confirmar queda deshabilitado sin horario seleccionado o mientras `onConfirm` está en curso (`busy`), y muestra un spinner inline durante la espera.
- Los slots con `available: false` se muestran tachados (`line-through`) y no disparan `onChange` al clickearlos.
