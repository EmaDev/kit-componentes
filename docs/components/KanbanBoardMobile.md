# KanbanBoardMobile

> Adaptación táctil de [KanbanBoard](KanbanBoard.md): una sola columna visible a la vez (tabs con scroll horizontal), reordenamiento por long-press + arrastre vertical con Pointer Events, y traslado de tarjetas a otra columna mediante una hoja de acciones inferior.

**Import**
```tsx
import { KanbanBoardMobile } from "lib-kit-components";
```

## Cuándo usarlo

`KanbanBoardMobile` sirve para el mismo modelo de datos que `KanbanBoard` (columnas con tarjetas) pero en pantallas táctiles angostas, donde no hay espacio para columnas lado a lado y el Drag and Drop API nativo de HTML5 no funciona de forma confiable. Muestra una columna a la vez mediante tabs horizontales con contador (y aviso de límite alcanzado), reordena tarjetas dentro de la columna activa con un gesto de long-press + arrastre vertical, y mueve una tarjeta a otra columna abriendo una hoja de acciones (bottom sheet) con la lista de columnas destino.

## Cuándo NO usarlo / alternativas

- Si el contexto es de escritorio con mouse y hay espacio horizontal para ver varias columnas a la vez, usá [KanbanBoard](KanbanBoard.md) en vez de `KanbanBoardMobile` — el drag lateral entre columnas visibles es más rápido con mouse que la hoja de acciones de traslado.
- Si sólo necesitás una lista de tareas agrupada por categoría o día con checkboxes (sin mover tarjetas entre grupos ni drag), usá [GroupedTaskList](GroupedTaskList.md) — es más liviano y no depende de Pointer Events.
- Si el caso de uso es tabular (filas/columnas de datos, orden, búsqueda), usá [DataTable](DataTable.md), no un tablero de tarjetas.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `KanbanColumn[]` | — (requerido) | Mismo tipo que en `KanbanBoard` (ver [Tipos exportados](KanbanBoard.md#tipos-exportados)). |
| `onChange` | `(columns: KanbanColumn[]) => void` | `undefined` | Se llama con el arreglo de columnas recalculado tanto al soltar un reordenamiento vertical como al mover una tarjeta a otra columna desde la hoja de acciones. Componente 100% controlado: sin `onChange` no persiste ningún cambio. |
| `onCardClick` | `(card: KanbanCard, columnId: string) => void` | `undefined` | Se dispara al tocar el cuerpo de la tarjeta (no el handle de arrastre ni el botón de mover). |
| `className` | `string` | `""` | Clases adicionales para el contenedor raíz (`flex flex-col h-full`). |

No tiene prop `renderCard`: el layout de cada tarjeta (tag, título, descripción, handle de arrastre, botón de mover) es fijo.

## Tipos exportados

`KanbanBoardMobile` no exporta tipos propios — reutiliza `KanbanCard` y `KanbanColumn`, exportados junto a [`KanbanBoard`](KanbanBoard.md#tipos-exportados).

## Ejemplos

### Uso básico (mismo estado que KanbanBoard)
```tsx
const [columns, setColumns] = useState<KanbanColumn[]>([
  { id: "todo", title: "Por hacer", limit: 5, cards: [
    { id: "1", title: "Diseñar onboarding", tag: "UX", description: "Flujo de alta de usuario" },
  ]},
  { id: "doing", title: "En progreso", cards: [] },
  { id: "done", title: "Hecho", cards: [] },
]);

<div className="relative h-[600px]">
  <KanbanBoardMobile columns={columns} onChange={setColumns} onCardClick={(card) => console.log(card)} />
</div>
```

### Layout responsivo: KanbanBoard en desktop, KanbanBoardMobile en mobile
```tsx
<div className="hidden md:block">
  <KanbanBoard columns={columns} onChange={setColumns} />
</div>
<div className="relative h-[calc(100vh-56px)] md:hidden">
  <KanbanBoardMobile columns={columns} onChange={setColumns} />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) (`onPointerDown`/`onPointerMove`/`onPointerUp`/`setPointerCapture`) para el gesto de long-press y arrastre vertical — no depende de `framer-motion` ni de ninguna librería de drag & drop.
- No depende de Next.js.
- El contenedor raíz necesita una altura definida (`h-full` sobre un padre con altura, o una altura explícita como en los ejemplos) para que la lista de tarjetas scrollee correctamente con `overflow-y-auto`.

## Notas y comportamiento

- **La hoja de "mover a otra columna" se posiciona `absolute inset-0`, pero el contenedor raíz del componente no tiene `relative`.** Si el elemento posicionado ancestro más cercano no es el propio wrapper de `KanbanBoardMobile`, la hoja va a cubrir esa otra área (por ejemplo toda la pantalla) en vez de limitarse al tablero. Envolvé el componente en un contenedor con `className="relative"` (como en los ejemplos de arriba) para que el overlay quede acotado al tablero.
- El reordenamiento vertical calcula el índice destino con `Math.round(dragY / cardH)`, donde `cardH` es una constante interna fija de `88` px que asume una tarjeta de una sola línea de descripción — tarjetas más altas (descripciones largas) pueden hacer que el umbral de "una posición más abajo" no coincida exactamente con el alto real renderizado.
- El botón de reordenar (ícono de 6 puntos) usa `touch-none` y `setPointerCapture` para evitar que el scroll de la lista interfiera con el gesto de arrastre vertical.
- Mover una tarjeta a otra columna (`moveAcross`) siempre la agrega al final de la columna destino; no permite elegir una posición específica dentro de la columna destino (a diferencia de `KanbanBoard`, que sí permite soltar en cualquier índice).
- Es 100% controlado igual que `KanbanBoard`: no guarda `columns` en estado interno, sólo notifica vía `onChange`.
- El `limit` por columna es, igual que en `KanbanBoard`, sólo visual (el badge del tab pasa a rojo) y no bloquea el traslado de más tarjetas a esa columna.
- Las tabs de columnas (`tabsRef`) y la lista de tarjetas (`listRef`) scrollean de forma independiente; el `active` inicial es la primera columna del arreglo (`columns[0]?.id`) y no se sincroniza automáticamente si `columns` cambia de orden luego.
