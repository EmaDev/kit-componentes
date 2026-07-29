# DragReorderList

> Lista vertical con reordenamiento por arrastre (drag), usando la física de `Reorder` de Framer Motion — pensada para playlists, favoritos o listas de prioridad simples.

**Import**
```tsx
import { DragReorderList, type ReorderItem } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario necesita reordenar una lista simple de ítems (una playlist, una lista de favoritos, un orden de prioridad) arrastrando con el mouse o el dedo, con feedback físico mientras arrastra (escala, sombra) y asentamiento con spring al soltar. Cada fila es uniforme: un ícono de "grip", un label y un sublabel opcional. No maneja columnas ni arrastre entre contenedores distintos, sólo reordenar dentro de una misma lista vertical.

## Cuándo NO usarlo / alternativas

- Si necesitás arrastrar tarjetas **entre columnas** (no sólo reordenar dentro de una lista), como un tablero de tareas, usá [KanbanBoard](KanbanBoard.md) — `DragReorderList` sólo reordena verticalmente dentro de un mismo grupo.
- Si el contenido de cada fila necesita un layout más rico que label/sublabel (imagen, acciones, badges, controles), armá tu propia lista con `Reorder.Group`/`Reorder.Item` de `framer-motion` directamente, o envolvé cada fila en `Card` — `DragReorderList` está pensado para filas de texto simples, no es customizable por render prop.
- Si sólo necesitás mostrar una lista sin capacidad de reordenar, no uses este componente: agrega overhead de gestos de arrastre innecesario.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `ReorderItem[]` | — (requerido) | Ítems iniciales de la lista. Se usan para **inicializar** el estado interno (ver Notas) — no es un componente controlado en el sentido estricto. |
| `onChange` | `(items: ReorderItem[]) => void` | `undefined` | Se llama con el nuevo arreglo completo cada vez que el usuario suelta un ítem en una posición distinta. |
| `className` | `string` | `""` | Clases adicionales del contenedor (`Reorder.Group`). |

## Tipos exportados

```ts
interface ReorderItem {
  id: string;
  label: string;
  sublabel?: string;
}
```

## Ejemplos

### Playlist básica
```tsx
const [playlist, setPlaylist] = useState<ReorderItem[]>([
  { id: "1", label: "Blinding Lights", sublabel: "The Weeknd" },
  { id: "2", label: "Levitating", sublabel: "Dua Lipa" },
  { id: "3", label: "Save Your Tears", sublabel: "The Weeknd" },
]);

<DragReorderList items={playlist} onChange={setPlaylist} />
```

### Lista de prioridades sin sublabel
```tsx
<DragReorderList
  items={[{ id: "a", label: "Diseño" }, { id: "b", label: "Desarrollo" }, { id: "c", label: "QA" }]}
  onChange={(next) => guardarPrioridad(next)}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `framer-motion` (`Reorder.Group`/`Reorder.Item`) para el gesto de arrastre y el asentamiento con spring; también anima `scale`, `boxShadow` y `zIndex` mientras se arrastra un ítem (`whileDrag`).
- No depende de Next.js.
- No respeta `prefers-reduced-motion` explícitamente — el gesto de arrastre y el asentamiento físico son parte del comportamiento central del componente, no una animación decorativa desactivable.

## Notas y comportamiento

- **El estado es interno**, sembrado una sola vez desde la prop `items` (`useState(initial)`, sin `useEffect` que lo resincronice): si el arreglo que le pasás como `items` cambia por fuera después del montaje inicial (ej. llega una lista distinta desde el server), el componente **no** refleja ese cambio automáticamente — sólo se actualiza a través de los propios drags del usuario, notificados vía `onChange`. Para forzar una resincronización, remontá el componente cambiando su `key`.
- El `id` de cada `ReorderItem` debe ser estable y único: `framer-motion` usa `value={item}` para identificar cada `Reorder.Item` durante el arrastre.
- El ícono de "grip" (seis puntos) es puramente decorativo — toda la fila (`Reorder.Item`) es arrastrable, no sólo el ícono.
- No expone soporte de teclado para reordenar (sin gesto de arrastre no hay forma de mover un ítem): si la accesibilidad por teclado es un requisito duro, este componente tal cual no lo cubre.
