# TripChecklist

> Checklist simple con barra de progreso — pensada para listas de equipaje o pendientes previos a un viaje.

**Import**
```tsx
import { TripChecklist } from "lib-kit-components";
import type { ChecklistItem } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para una lista plana de ítems que se marcan como hechos/pendientes (equipaje a llevar, trámites antes de viajar, checklist de salida), con un contador y una barra de progreso que se completan visualmente cuando todo está tildado. Es el componente más simple de los tres relacionados con tareas: un solo nivel, sin agrupar ni subtareas.

## Cuándo NO usarlo / alternativas

- Si necesitás agrupar los ítems por día o categoría (con progreso por grupo y grupos colapsables), usá [GroupedTaskList](GroupedTaskList.md) en su lugar — `TripChecklist` no agrupa.
- Si cada ítem necesita su propio detalle (subtareas, prioridad, fecha límite, descripción expandible), usá [TaskCard](TaskCard.md) por cada tarea — `TripChecklist` sólo maneja `label` + `checked` + una nota opcional de una línea.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `undefined` | Título opcional mostrado junto al contador (ej. "Equipaje de mano"). |
| `items` | `ChecklistItem[]` | — (requerido) | Ítems de la checklist. |
| `onToggle` | `(id: string) => void` | — (requerido) | Se llama al hacer click en un ítem, con su `id`. El componente es controlado: no cambia `checked` por sí mismo, quien lo usa debe actualizar `items` en respuesta. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  note?: string;
}
```

## Ejemplos

### Uso básico
```tsx
const [items, setItems] = useState<ChecklistItem[]>([
  { id: "1", label: "Pasaporte", checked: true },
  { id: "2", label: "Cargador", checked: false, note: "Adaptador tipo C para Europa" },
  { id: "3", label: "Protector solar", checked: false },
]);

<TripChecklist
  title="Equipaje de mano"
  items={items}
  onToggle={(id) => setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)))}
/>
```

### Sin título
```tsx
<TripChecklist items={items} onToggle={toggleItem} />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No tiene estado interno propio: el estado de `checked` vive por completo afuera del componente.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- `onToggle` es obligatorio (no tiene default) y el componente no mantiene ningún estado de `checked` propio — si no actualizás `items` en respuesta al callback, los clicks no van a reflejarse visualmente.
- El progreso (barra + contador `hecho/total`) se calcula a partir de `items`, no de un estado interno; cuando `done === items.length` (y hay al menos un ítem) tanto la barra como el contador cambian a color `success`.
- Una lista vacía (`items: []`) muestra "Sin ítems todavía." en vez de la barra de progreso vacía.
- `note` se muestra como una segunda línea de texto pequeño debajo del `label`; no soporta contenido enriquecido (`ReactNode`), sólo `string`.
