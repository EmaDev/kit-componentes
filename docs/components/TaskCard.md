# TaskCard

> Tarjeta de una tarea individual con prioridad, fecha límite y subtareas; se expande al hacer click para mostrar el detalle de las subtareas.

**Import**
```tsx
import { TaskCard } from "lib-kit-components";
import type { TaskPriority, Subtask, TaskCardData } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para representar una tarea con metadatos propios: prioridad (baja/media/alta), fecha límite (con aviso visual si está vencida) y, opcionalmente, una lista de subtareas que se pueden marcar por separado. Es la unidad "detallada" del set de tareas — pensada para renderizarse en una lista (una `TaskCard` por tarea) cuando cada tarea necesita más información que un simple check.

## Cuándo NO usarlo / alternativas

- Si tenés una lista simple de ítems sin prioridad, fecha límite ni subtareas, usá [TripChecklist](TripChecklist.md) — es más liviana.
- Si necesitás agrupar varias tareas simples por día o categoría con progreso por grupo, usá [GroupedTaskList](GroupedTaskList.md) — sus ítems no tienen subtareas propias ni prioridad; si eso hace falta, hay que combinar: agrupar visualmente por afuera y renderizar una `TaskCard` por tarea dentro de cada grupo.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `task` | `TaskCardData` | — (requerido) | Datos de la tarea. |
| `onToggleDone` | `(id: string) => void` | `undefined` | Se llama al hacer click en el círculo de estado (izquierda), con el `id` de la tarea. |
| `onToggleSubtask` | `(taskId: string, subtaskId: string) => void` | `undefined` | Se llama al hacer click en una subtarea, con el `id` de la tarea y de la subtarea. |
| `locale` | `string` | `"es-AR"` | Locale usado para formatear `dueDate` vía `Intl.DateTimeFormat`. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
type TaskPriority = "low" | "medium" | "high";

interface Subtask {
  id: string;
  label: string;
  done: boolean;
}

interface TaskCardData {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  done?: boolean;
  subtasks?: Subtask[];
}
```

## Ejemplos

### Uso básico
```tsx
<TaskCard
  task={{
    id: "1",
    title: "Armar valija",
    priority: "high",
    dueDate: new Date("2026-08-09"),
    subtasks: [
      { id: "s1", label: "Ropa de abrigo", done: true },
      { id: "s2", label: "Adaptador de enchufe", done: false },
    ],
  }}
  onToggleDone={toggleTask}
  onToggleSubtask={toggleSubtask}
/>
```

### Tarea simple, sin subtareas ni prioridad
```tsx
<TaskCard
  task={{ id: "2", title: "Cambiar divisas", description: "Ir al banco antes del viernes" }}
  onToggleDone={toggleTask}
/>
```

### Lista de tareas
```tsx
{tasks.map((task) => (
  <TaskCard key={task.id} task={task} onToggleDone={toggleTask} onToggleSubtask={toggleSubtask} className="mb-3" />
))}
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `Intl.DateTimeFormat` del navegador para `dueDate` — el `locale` debe ser un locale BCP 47 válido soportado por el runtime.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- El estado de expansión (`open`, para mostrar/ocultar subtareas) es interno y no controlable desde afuera; arranca siempre cerrado, independientemente de `task.done` o de cuántas subtareas tenga.
- La flecha de expandir sólo aparece si `task.subtasks` tiene al menos un ítem; sin subtareas, el click en el cuerpo de la tarjeta no hace nada (no hay contenido para expandir).
- "Vencida" (`overdue`, badge en rojo) se calcula como `dueDate` anterior al día de hoy (comparando a medianoche, sin hora) **y** `task.done` es falso — una tarea marcada como hecha nunca se muestra vencida aunque su `dueDate` haya pasado.
- El click en el círculo de estado (izquierda) llama a `onToggleDone` y es independiente del click en el resto de la tarjeta (que expande/colapsa); no hay `stopPropagation` explícito porque son botones hermanos, no anidados.
- `onToggleDone` y `onToggleSubtask` son ambos opcionales: sin ellos, los botones correspondientes quedan visualmente interactivos pero no producen ningún cambio de estado (el componente no mantiene `done`/`checked` internamente, todo viene de `task`).
- El contador de subtareas (`hecho/total`) se muestra siempre que haya subtareas, incluso con la sección colapsada.
