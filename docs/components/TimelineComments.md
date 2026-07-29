# TimelineComments

> Timeline editable: cada evento puede tener notas asociadas y, si se habilita, un input inline para agregar una nueva — pensado como bitácora de proyecto o historial de soporte con anotaciones.

**Import**
```tsx
import { TimelineComments, type TimelineNote, type CommentableEvent } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el timeline necesita ser una bitácora colaborativa: además de mostrar el estado de cada evento, cada uno puede acumular notas de distintos autores (comentarios de equipo sobre un proyecto, anotaciones internas de un ticket de soporte). Si pasás `onAddNote`, cada evento muestra un botón "+ Agregar nota" que abre un input inline.

## Cuándo NO usarlo / alternativas

- Si el timeline es de solo lectura y no necesita notas, usá [ActivityTimeline](ActivityTimeline.md) en vez de `TimelineComments` — evitás cargar `notes: []` en cada evento innecesariamente.
- Si lo que necesitás es un registro de auditoría de cambios de campos (no notas de texto libre), usá [AuditLog](AuditLog.md).
- Si el proceso tiene ramas paralelas, usá [BranchingTimeline](BranchingTimeline.md) — no tiene soporte de notas.
- Para un feed de actividad de cuenta agrupado por día (sin notas por evento), usá [GroupedActivityFeed](GroupedActivityFeed.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `events` | `CommentableEvent[]` | — (requerido) | Eventos con sus notas ya cargadas (`notes: []` si no tiene ninguna todavía). |
| `currentUser` | `string` | `"Vos"` | Nombre mostrado en el placeholder del input ("Nota de {currentUser}…"). No se usa como autor automático de la nota — el autor final depende de lo que hagas en `onAddNote`. |
| `onAddNote` | `(eventId: string, text: string) => void` | `undefined` | Callback al confirmar una nota nueva (Enter o botón "Agregar"). **Opcional pero determinante**: sin esta prop no aparece ningún botón/input de "agregar nota" en ningún evento. |
| `className` | `string` | `""` | Clases adicionales para el `<ol>` raíz. |

## Tipos exportados

```ts
export interface TimelineNote {
  id: string;
  author: string;
  text: string;
  time: string;
}

export interface CommentableEvent {
  id: string;
  title: string;
  time: string;
  status: "done" | "current" | "pending";
  notes: TimelineNote[];
}
```

## Ejemplos

### Uso básico, de solo lectura (sin `onAddNote`)
```tsx
const events: CommentableEvent[] = [
  {
    id: "1", title: "Diseño aprobado", time: "Lun 10:00", status: "done",
    notes: [{ id: "n1", author: "Lucía", text: "Quedó perfecto, arrancamos con dev.", time: "10:15" }],
  },
  { id: "2", title: "En desarrollo", time: "Mar 09:00", status: "current", notes: [] },
];

<TimelineComments events={events} />
```

### Editable, agregando notas al estado
```tsx
const [events, setEvents] = useState<CommentableEvent[]>(initialEvents);

<TimelineComments
  events={events}
  currentUser="Emanuel"
  onAddNote={(eventId, text) => {
    setEvents((evs) =>
      evs.map((e) =>
        e.id === eventId
          ? { ...e, notes: [...e.notes, { id: crypto.randomUUID(), author: "Emanuel", text, time: "ahora" }] }
          : e
      )
    );
  }}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`: usa `useState` de React y HTML/SVG con Tailwind.
- Marcado como `"use client"` (tiene estado interno de draft/input abierto).

## Notas y comportamiento

- El componente **no genera el `id` ni el `author` de la nota nueva** — solo entrega `(eventId, text)` a `onAddNote`; arma el objeto `TimelineNote` completo (incluyendo `author`, que normalmente sería `currentUser`) del lado del consumidor.
- El input de nota nueva se confirma con `Enter` (`onKeyDown`) o con el botón "Agregar"; no hay atajo para cancelar salvo perder el foco (el input queda abierto hasta que se envía una nota, no se cierra solo).
- El estado de "input abierto" (`open`) y el texto en curso (`draft`) son internos y están indexados por `eventId`, así que podés tener el input abierto en varios eventos a la vez sin que se pisen entre sí.
- Enviar una nota con el texto vacío o solo espacios no hace nada (`.trim()` seguido de `if (!text) return`), y no cierra el input ni limpia nada.
- Después de enviar, el campo de texto de ese evento se limpia (`draft` vuelve a `""`) pero el input permanece abierto para seguir agregando notas sin volver a hacer click en "+ Agregar nota".
- Si un evento tiene `notes: []`, simplemente no se renderiza la lista de notas (sin mensaje de "sin notas").
