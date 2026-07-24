# CalendarGrid

> Grilla mensual de calendario con eventos, navegación entre meses y expansión de días con muchos eventos.

**Import**
```tsx
import { CalendarGrid } from "lib-kit-components";
import type { CalendarEvent } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar un mes completo (6 semanas × 7 días) con eventos posicionados en su día correspondiente, con navegación entre meses (anterior/siguiente/hoy). Sirve para calendarios de reservas, turnos, publicaciones programadas o cualquier vista tipo "agenda mensual" donde el usuario necesita ver de un vistazo qué días tienen actividad y hacer click para abrir el detalle de un día o de un evento puntual.

## Cuándo NO usarlo / alternativas

- No es un selector de fecha (`date picker`) para formularios — no tiene modo de selección de rango ni input de fecha asociado.
- No ofrece vistas semana/día ni una línea de tiempo con horas; sólo vista mensual en grilla. Si necesitás otra granularidad, hay que construirla aparte.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `month` | `Date` | `new Date()` (interno) | Mes visible (cualquier fecha dentro de él). Si se pasa, el componente queda controlado: la navegación interna deja de mover el estado propio y depende de `onMonthChange`. |
| `events` | `CalendarEvent[]` | `[]` | Eventos a distribuir en la grilla. |
| `weekStartsOn` | `0 \| 1` | `1` | Primer día de la semana: `1` = lunes, `0` = domingo. |
| `maxPerDay` | `number` | `3` | Eventos visibles por celda antes de mostrar el botón "+N más". |
| `cellMinHeight` | `number` | `96` | Alto mínimo de cada celda del calendario, en px. |
| `onDayClick` | `(date: Date) => void` | — | Click en una celda de día (fuera de un evento o del botón "+N más"). |
| `onEventClick` | `(event: CalendarEvent) => void` | — | Click en un chip/evento puntual. |
| `onMonthChange` | `(month: Date) => void` | — | Se llama al navegar de mes. Si se define, el componente pasa a modo controlado para el mes mostrado (junto con `month`); si se omite, navega con estado interno. |
| `showAdjacent` | `boolean` | `true` | Muestra (en gris) los días de los meses anterior/siguiente que completan la grilla de 6 semanas. Si es `false`, esas celdas quedan vacías. |
| `locale` | `string` | `"es-AR"` | Locale usado para formatear el nombre del mes, los nombres de días de la semana y la hora de los eventos (`Intl.DateTimeFormat`). |

## Tipos exportados

```ts
export interface CalendarEvent {
  id: string;
  title: string;
  /** inicio del evento */
  start: Date;
  /** fin; si se omite, dura lo mismo que el inicio */
  end?: Date;
  /** todo el día (se muestra como chip sólido, sin hora) */
  allDay?: boolean;
  /** color del token: usa los del tema */
  color?: "primary" | "accent" | "success" | "danger" | "muted";
  meta?: ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
<CalendarGrid
  events={events}
  weekStartsOn={1}
  onDayClick={(date) => openDayView(date)}
  onEventClick={(event) => openEventDetail(event)}
/>
```

### Modo controlado (mes manejado desde afuera)
```tsx
const [month, setMonth] = useState(new Date());

<CalendarGrid
  month={month}
  onMonthChange={setMonth}
  events={events}
/>
```

### Eventos de varios tipos, incluyendo multi-día y todo el día
```tsx
const events: CalendarEvent[] = [
  { id: "1", title: "Reunión de equipo", start: new Date(2026, 6, 24, 10, 0), color: "primary" },
  { id: "2", title: "Vacaciones", start: new Date(2026, 6, 20), end: new Date(2026, 6, 25), allDay: true, color: "success" },
  { id: "3", title: "Entrega urgente", start: new Date(2026, 6, 24, 18, 30), color: "danger" },
];

<CalendarGrid events={events} maxPerDay={2} cellMinHeight={110} />
```

### Sin días adyacentes, otro locale
```tsx
<CalendarGrid
  events={events}
  showAdjacent={false}
  locale="en-US"
  weekStartsOn={0}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente (`motion`, `AnimatePresence`) para animar la entrada/salida de los chips de evento dentro de cada celda.
- Usa `Intl.DateTimeFormat` del navegador para nombres de mes, días de la semana y formato de hora — el `locale` debe ser un locale BCP 47 válido soportado por el runtime.

## Notas y comportamiento

- Un evento multi-día (con `end` posterior a `start`) se expande y aparece repetido en **cada** día del rango, de `start` a `end` inclusive.
- Dentro de cada día, los eventos se ordenan primero los `allDay` y luego por hora de inicio.
- El botón "Hoy" en la barra de navegación siempre lleva al mes actual real (`new Date()`), independientemente de cuál sea `month`.
- Cuando una celda tiene más eventos que `maxPerDay`, aparece "+N más"; al hacer click se expande esa celda (estado `expanded`, una sola celda expandida a la vez) y aparece "Ver menos" para volver a colapsarla.
- El día de hoy se resalta con un círculo de color primario alrededor del número.
- Los fines de semana (`sáb`/`dom` según `weekStartsOn`) tienen un fondo levemente distinto cuando están dentro del mes actual.
- Los días fuera del mes actual (`inMonth === false`) se muestran con opacidad reducida en sus eventos y número atenuado; si `showAdjacent` es `false`, esas celdas quedan completamente vacías (sin número ni eventos) pero mantienen el `cellMinHeight` para no romper la grilla.
- El click en un evento (`onEventClick`) detiene la propagación para no disparar también `onDayClick`; lo mismo con el botón "+N más" / "Ver menos".
- La grilla siempre tiene exactamente 42 celdas (6 semanas × 7 días) para cubrir cualquier combinación de mes + día de inicio de semana.
