# ItineraryTimeline

> Itinerario día por día de un viaje: tira de días seleccionable arriba y línea de tiempo vertical con horarios, tipo de actividad y ubicación abajo.

**Import**
```tsx
import { ItineraryTimeline } from "lib-kit-components";
import type { ActivityKind, ItineraryActivity, ItineraryDay } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar el plan hora a hora de un viaje: vuelos, check-in/check-out de hotel, comidas, actividades y traslados, organizados por día. El usuario navega entre días con la tira de chips superior (scroll horizontal) y ve, para el día elegido, una línea de tiempo vertical con un ícono por tipo de actividad, el horario (y horario de fin si aplica), la ubicación y notas opcionales. Es el componente indicado cuando la granularidad importa: qué pasa y a qué hora, dentro de un día concreto.

## Cuándo NO usarlo / alternativas

- Si lo que necesitás mostrar es la ruta general del viaje (a qué ciudades se va, en qué fechas y cuántas noches en cada una) sin bajar al detalle de actividades por hora, usá [TripRouteMap](TripRouteMap.md) — son complementarios: `TripRouteMap` para el panorama multi-destino, `ItineraryTimeline` para el detalle día a día dentro de un destino.
- Si lo que necesitás es una lista de pendientes o tareas (sin horario ni tipo de actividad), usá [TripChecklist](TripChecklist.md), [GroupedTaskList](GroupedTaskList.md) o [TaskCard](TaskCard.md) según si es una lista simple, agrupada, o una tarea individual con subtareas.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `days` | `ItineraryDay[]` | — (requerido) | Días del itinerario, cada uno con su `date` y su lista de `activities`. |
| `value` | `number` | `undefined` | Índice del día activo (controlado). Sin esta prop, el componente maneja su propio estado interno (arranca en `0`). |
| `onDayChange` | `(index: number) => void` | `undefined` | Se llama al hacer click en un chip de día, con el nuevo índice. |
| `onActivityClick` | `(activity: ItineraryActivity, dayIndex: number) => void` | `undefined` | Click en una actividad de la línea de tiempo. |
| `locale` | `string` | `"es-AR"` | Locale usado para formatear el día de la semana abreviado (chip), el número de día (chip) y la fecha completa (encabezado), vía `Intl.DateTimeFormat`. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type ActivityKind = "flight" | "hotel" | "food" | "activity" | "transport";

interface ItineraryActivity {
  id: string;
  kind: ActivityKind;
  title: string;
  time?: string;
  endTime?: string;
  location?: string;
  notes?: string;
}

interface ItineraryDay {
  date: Date;
  activities: ItineraryActivity[];
}
```

## Ejemplos

### Uso básico (no controlado)
```tsx
<ItineraryTimeline
  days={[
    {
      date: new Date("2026-08-10"),
      activities: [
        { id: "1", kind: "flight", title: "Vuelo a Lisboa", time: "08:40", endTime: "14:10", location: "EZE → LIS" },
        { id: "2", kind: "hotel", title: "Check-in Hotel Alfama", time: "16:00" },
        { id: "3", kind: "food", title: "Cena en Time Out Market", time: "20:30", notes: "Reserva a nombre de Lucía" },
      ],
    },
    {
      date: new Date("2026-08-11"),
      activities: [
        { id: "4", kind: "activity", title: "Tour a pie por Alfama", time: "10:00", endTime: "13:00" },
        { id: "5", kind: "transport", title: "Traslado a la estación", time: "15:30", location: "Rossio" },
      ],
    },
  ]}
  onActivityClick={(activity) => openActivityDetail(activity)}
/>
```

### Controlado desde afuera (sincronizado con `TripRouteMap`)
```tsx
const [day, setDay] = useState(0);

<ItineraryTimeline days={days} value={day} onDayChange={setDay} />
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `Intl.DateTimeFormat` del navegador — el `locale` debe ser un locale BCP 47 válido soportado por el runtime.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- Es de tipo controlado/no controlado híbrido: si pasás `value`, el índice de día activo lo maneja quien lo use (junto con `onDayChange`); si lo omitís, el componente lleva su propio estado interno arrancando en el día `0`.
- Los íconos por `kind` (`flight`, `hotel`, `food`, `activity`, `transport`) son SVG inline no exportados, cada uno con su propio color de token (`primary`, `accent`, `success`, `muted`).
- `endTime` sólo se muestra si `time` también está presente (se concatena como `time`–`endTime`); pasar sólo `endTime` sin `time` no muestra nada.
- Si `days[value]` no existe (por ejemplo `value` fuera de rango), no se renderiza la sección de la línea de tiempo — sólo queda visible la tira de días.
- Un día sin actividades muestra el mensaje "Sin actividades planificadas." en vez de una lista vacía.
- El click en una actividad activa `onActivityClick`, pero no hay estado de selección visual persistente sobre la actividad clickeada — el resaltado es sólo del chip de día activo.
