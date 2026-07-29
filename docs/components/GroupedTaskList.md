# GroupedTaskList

> Tareas agrupadas por día o categoría, con progreso por grupo y grupos colapsables.

**Import**
```tsx
import { GroupedTaskList } from "lib-kit-components";
import type { TaskListItem, TaskGroup } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando tenés varias listas de tareas simples que necesitás organizar en secciones — por ejemplo, tareas de un viaje agrupadas por día ("Día 1", "Día 2") o por categoría ("Antes de salir", "En el aeropuerto") — con un contador de progreso por grupo y la posibilidad de colapsar cada sección para reducir el ruido visual cuando hay muchos grupos.

## Cuándo NO usarlo / alternativas

- Si tenés una única lista plana, sin necesidad de agrupar, usá [TripChecklist](TripChecklist.md) — es más simple y no trae la lógica de colapsado.
- Si cada tarea necesita su propio detalle (subtareas propias, prioridad, fecha límite), usá [TaskCard](TaskCard.md) por cada tarea en vez de `GroupedTaskList` — los ítems de `GroupedTaskList` sólo tienen `label`, `checked` y una `note` de una línea, sin subtareas ni metadatos.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `groups` | `TaskGroup[]` | — (requerido) | Grupos de tareas, cada uno con su `label`, `sublabel` opcional e `items`. |
| `onToggle` | `(groupId: string, itemId: string) => void` | — (requerido) | Se llama al hacer click en un ítem, con el `id` del grupo y del ítem. Componente controlado: no cambia `checked` por sí mismo. |
| `collapsible` | `boolean` | `true` | Si `false`, deshabilita el botón de colapsar (todos los grupos quedan siempre abiertos y no se muestra la flecha). |
| `defaultCollapsed` | `boolean` | `false` | Si `true`, todos los grupos arrancan colapsados. Sólo se evalúa al montar el componente (estado inicial de `useState`). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface TaskListItem {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}

interface TaskGroup {
  id: string;
  label: string;
  sublabel?: string;
  items: TaskListItem[];
}
```

## Ejemplos

### Uso básico, agrupado por día
```tsx
const [groups, setGroups] = useState<TaskGroup[]>([
  {
    id: "d1", label: "Día 1", sublabel: "10 de agosto",
    items: [
      { id: "t1", label: "Confirmar traslado al aeropuerto", checked: false },
      { id: "t2", label: "Hacer el check-in online", checked: true },
    ],
  },
  {
    id: "d2", label: "Día 2", sublabel: "11 de agosto",
    items: [{ id: "t3", label: "Reservar tour por la ciudad", checked: false }],
  },
]);

<GroupedTaskList
  groups={groups}
  onToggle={(groupId, itemId) =>
    setGroups((prev) =>
      prev.map((g) =>
        g.id !== groupId ? g : { ...g, items: g.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it)) }
      )
    )
  }
/>
```

### Grupos arrancando colapsados
```tsx
<GroupedTaskList groups={groups} onToggle={toggleGroupItem} defaultCollapsed />
```

### Sin colapsado (siempre expandido)
```tsx
<GroupedTaskList groups={groups} onToggle={toggleGroupItem} collapsible={false} />
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- El estado de colapsado/expandido de cada grupo (`closed`, un `Set` de ids) es interno y se inicializa una sola vez a partir de `defaultCollapsed` al montar el componente; cambiar `defaultCollapsed` en un re-render posterior no vuelve a colapsar/expandir los grupos ya montados.
- El estado de `checked` de los ítems es completamente externo: `onToggle` es obligatorio y el componente no lo maneja por sí mismo — hay que actualizar `groups` en respuesta al callback.
- El contador `hecho/total` de cada grupo se pone en color `success` sólo cuando el grupo tiene al menos un ítem y todos están `checked`; un grupo vacío (`items: []`) no se marca como completo.
- Un grupo sin ítems muestra "Sin tareas." dentro de su lista en vez de una lista vacía.
- El header de cada grupo (label + contador + flecha) es siempre clickeable en el DOM, pero el `onClick` de colapsado está deshabilitado (`disabled`) cuando `collapsible={false}`.
