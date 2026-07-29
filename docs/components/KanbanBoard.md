# KanbanBoard

> Tablero Kanban de escritorio con drag & drop nativo (HTML5 Drag and Drop API): columnas lado a lado, arrastre de tarjetas entre columnas y reordenamiento dentro de una misma columna, sin dependencias externas.

**Import**
```tsx
import { KanbanBoard } from "lib-kit-components";
```

## Cuándo usarlo

`KanbanBoard` sirve para flujos de trabajo tipo tablero (backlog / en progreso / hecho, pipeline de ventas, etc.) donde el usuario necesita mover tarjetas entre columnas arrastrándolas con el mouse, con columnas visibles lado a lado y scroll horizontal si no entran todas. Es el componente a usar en vistas de escritorio (admin, dashboards internos) donde hay espacio horizontal y el input principal es mouse/trackpad.

## Cuándo NO usarlo / alternativas

- Si la pantalla es táctil o angosta (mobile/tablet en portrait), usá [KanbanBoardMobile](KanbanBoardMobile.md) en vez de `KanbanBoard` — el Drag and Drop API nativo de HTML5 que usa `KanbanBoard` no es confiable en touch (no dispara `dragstart` de forma consistente en la mayoría de navegadores móviles). `KanbanBoardMobile` resuelve el mismo modelo de datos (`columns`/`onChange`) con una columna visible a la vez (tabs) y dos gestos táctiles: long-press + arrastre vertical para reordenar dentro de la columna, y una hoja de acciones para mover la tarjeta a otra columna.
- Si sólo necesitás una lista de tareas agrupada por categoría o día, con checkboxes y progreso por grupo, pero sin mover ítems entre grupos arrastrando, usá [GroupedTaskList](GroupedTaskList.md) — es más simple y no requiere drag & drop.
- Si el caso de uso es una grilla de datos tabular con orden, búsqueda y paginado (no tarjetas en columnas), usá [DataTable](DataTable.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `KanbanColumn[]` | — (requerido) | Columnas del tablero, cada una con su `id`, `title`, arreglo de `cards` y `limit` opcional. |
| `onChange` | `(columns: KanbanColumn[]) => void` | `undefined` | Se llama con el arreglo de columnas ya recalculado cada vez que se suelta una tarjeta (misma columna o entre columnas). El componente no muta `columns` internamente: es 100% controlado, así que sin `onChange` el drag no persiste visualmente. |
| `onCardClick` | `(card: KanbanCard, columnId: string) => void` | `undefined` | Se dispara al hacer click sobre una tarjeta (no al arrastrarla). |
| `renderCard` | `(card: KanbanCard) => React.ReactNode` | `undefined` | Render custom del contenido de cada tarjeta. Sin esta prop, usa el layout por defecto (tag, título, descripción, avatar). |
| `className` | `string` | `""` | Clases adicionales para el contenedor scrolleable de columnas. |

## Tipos exportados

```ts
interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  avatar?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
}
```

## Ejemplos

### Uso básico (controlado)
```tsx
const [columns, setColumns] = useState<KanbanColumn[]>([
  {
    id: "todo",
    title: "Por hacer",
    limit: 5,
    cards: [
      { id: "1", title: "Diseñar onboarding", tag: "UX", description: "Flujo de alta de usuario" },
      { id: "2", title: "Definir métricas", tag: "Producto" },
    ],
  },
  { id: "doing", title: "En progreso", cards: [] },
  { id: "done", title: "Hecho", cards: [] },
]);

<KanbanBoard
  columns={columns}
  onChange={setColumns}
  onCardClick={(card, columnId) => console.log(card, columnId)}
/>
```

### Con `renderCard` custom (avatar + prioridad)
```tsx
<KanbanBoard
  columns={columns}
  onChange={setColumns}
  renderCard={(card) => (
    <div className="flex items-center justify-between">
      <p className="text-[13px] font-semibold">{card.title}</p>
      {card.avatar && (
        <img src={card.avatar} alt="" className="w-6 h-6 rounded-full" />
      )}
    </div>
  )}
/>
```

### Columna con límite (WIP limit)
```tsx
// col.limit = 3 hace que el contador cambie a rojo cuando col.cards.length >= 3.
// Es sólo un indicador visual: no bloquea soltar tarjetas adicionales en esa columna.
{ id: "doing", title: "En progreso", limit: 3, cards: [...] }
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa el [Drag and Drop API nativo de HTML5](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) (`draggable`, `onDragStart`, `onDragOver`, `onDrop`) — no depende de ninguna librería de drag & drop externa ni de `framer-motion`.
- No depende de Next.js.

## Notas y comportamiento

- Es un componente 100% controlado: `KanbanBoard` calcula el nuevo arreglo de `columns` en cada `drop` y lo pasa a `onChange`, pero no guarda ese estado internamente — si no actualizás `columns` en el padre con el valor recibido, el drag se revierte visualmente en el próximo render.
- El `limit` de una columna es únicamente visual (el contador de tarjetas pasa a rojo cuando se alcanza o supera): no impide soltar más tarjetas ahí, la validación de límite estricto queda a cargo del consumidor (por ejemplo, revirtiendo el `onChange` si se supera el límite).
- Mientras se arrastra, la tarjeta origen queda con `opacity-40` y aparece una línea indicadora (`over`) en la posición donde se soltaría, tanto entre tarjetas como al final de la columna.
- El reordenamiento dentro de la misma columna y el movimiento entre columnas usan la misma función interna (`moveCard`), que soporta insertar en un índice específico (no sólo al final).
- Cada columna tiene `max-h-[560px]` y scroll vertical propio (`overflow-y-auto`) para la lista de tarjetas; el contenedor de columnas scrollea horizontalmente (`overflow-x-auto`) si no entran todas en el ancho disponible.
- Sin tarjetas, la columna muestra el texto "Sin tarjetas" en vez de quedar vacía.
