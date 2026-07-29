# ActivityTimeline

> Historial vertical de eventos de un solo objeto (pedido, ticket, solicitud) con un punto de estado por evento y línea conectora — el timeline "de toda la vida", sin agrupado ni interacción.

**Import**
```tsx
import { ActivityTimeline, type TimelineEvent } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar la secuencia de eventos de una única entidad en orden cronológico, tipo "pedido creado → preparado → en camino → entregado" o el historial de estados de un ticket de soporte. Cada evento tiene un ícono de estado (check, punto pulsante, error) y una línea vertical que conecta uno con el siguiente. Es de solo lectura: no agrupa por fecha, no permite comentarios ni ramas paralelas.

## Cuándo NO usarlo / alternativas

- Si necesitás agrupar los eventos por día con separadores "Hoy"/"Ayer" (tipo feed de actividad de una cuenta con muchos eventos de distintos días), usá [GroupedActivityFeed](GroupedActivityFeed.md) en vez de `ActivityTimeline`.
- Si cada evento necesita un hilo de notas/comentarios editable (bitácora de proyecto, historial de soporte con anotaciones internas), usá [TimelineComments](TimelineComments.md).
- Si lo que necesitás es un registro de auditoría (quién hizo qué cambio, con diff de campos antes/después), usá [AuditLog](AuditLog.md) — `ActivityTimeline` no tiene noción de "actor" ni de campos modificados.
- Si el proceso se puede dividir en ramas paralelas (ej. un pedido dividido en dos envíos que avanzan por separado), usá [BranchingTimeline](BranchingTimeline.md).
- Si necesitás un timeline horizontal y compacto tipo tracking de paquete (pocos pasos, tarjeta angosta), usá [TrackingStepper](TrackingStepper.md) en vez del layout vertical de `ActivityTimeline`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `events` | `TimelineEvent[]` | — (requerido) | Eventos a mostrar, en el orden en que se renderizan (no se reordenan). |
| `className` | `string` | `""` | Clases adicionales para el `<ol>` raíz. |

## Tipos exportados

```ts
export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  time: string;
  status: "done" | "current" | "pending" | "error";
}
```

## Ejemplos

### Uso básico
```tsx
const events: TimelineEvent[] = [
  { id: "1", title: "Pedido creado", time: "10:02", status: "done" },
  { id: "2", title: "Preparando envío", time: "10:40", status: "done" },
  { id: "3", title: "En camino", description: "Repartidor: Marcos G.", time: "12:15", status: "current" },
  { id: "4", title: "Entregado", time: "—", status: "pending" },
];

<ActivityTimeline events={events} />
```

### Con un evento en error
```tsx
<ActivityTimeline
  events={[
    { id: "1", title: "Pago recibido", time: "09:00", status: "done" },
    { id: "2", title: "Intento de envío", description: "Dirección incompleta", time: "09:45", status: "error" },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`: es puro HTML/SVG con Tailwind.
- Marcado como `"use client"` aunque no tiene estado propio (consistente con el resto de la librería).

## Notas y comportamiento

- El estado `"current"` se distingue visualmente con un punto blanco animado (`animate-pulse`) dentro del círculo primary; no hay ningún otro indicador de "en curso" además de ese parpadeo.
- La línea conectora entre un evento y el siguiente toma el color `success/40` cuando el evento **actual** (el de arriba, no el de abajo) tiene `status: "done"`, y `border` en cualquier otro caso — es decir, el color de cada segmento depende del evento que la origina, no del que la recibe.
- El último evento (`i === events.length - 1`) no dibuja línea hacia abajo (`pb-0` en vez de `pb-6`), así que no hace falta ningún evento "final" ficticio para cerrar el timeline.
- `description` es opcional por evento; si no se pasa, el evento sólo muestra título y hora.
- Los eventos `"pending"` atenúan el título a `text-muted` para diferenciarlos visualmente de los ya ocurridos, sin necesidad de ninguna prop adicional.
