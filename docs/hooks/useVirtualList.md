# useVirtualList

> Virtualización de listas largas: calcula qué filas están dentro (o cerca) del viewport visible y devuelve sólo esas — a partir de unas ~500 filas es la diferencia entre scroll fluido y una app trabada.

**Import**
```ts
import { useVirtualList } from "lib-kit-components";
```

## Cuándo usarlo

Para listas largas renderizadas a mano (no `DataTable`, que ya pagina) donde montar todas las filas en el DOM de una sola vez es costoso: un feed infinito, un chat con miles de mensajes, un selector con miles de opciones. El hook no renderiza nada por sí mismo — te da las coordenadas (`virtualItems`) para que vos poses cada fila con `position: absolute`.

## Cuándo NO usarlo / alternativas

- Para menos de ~200-300 filas, el costo de virtualizar (posicionamiento absoluto, cálculo de offsets) rara vez compensa — un `.map()` común alcanza.
- `DataTable` ya maneja paginado para grillas de datos tabulares — usá `useVirtualList` sólo para listas custom donde no encaja `DataTable` (chat, feed, selector).

## Firma

```ts
function useVirtualList(options: {
  count: number;
  itemHeight: number | ((index: number) => number);
  overscan?: number;
}): {
  scrollRef: RefObject<HTMLDivElement | null>;
  virtualItems: { index: number; start: number; size: number }[];
  totalHeight: number;
  scrollToIndex: (index: number, align?: "start" | "center") => void;
  range: { first: number; last: number };
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `count` | `number` | — (requerido) | Cantidad total de filas (no sólo las visibles). |
| `itemHeight` | `number \| (index: number) => number` | — (requerido) | Alto fijo, o una función para alturas variables por fila. |
| `overscan` | `number` | `6` | Filas extra a renderizar arriba y abajo del viewport (evita "flashes" en blanco durante el scroll rápido). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `scrollRef` | `RefObject<HTMLDivElement \| null>` | Asignalo al contenedor con `overflow-y: auto`. |
| `virtualItems` | `{ index, start, size }[]` | Filas a renderizar ahora mismo, con su posición (`start`, en px desde arriba) y alto (`size`). |
| `totalHeight` | `number` | Alto total del contenido virtual — usalo en el contenedor interno para que la scrollbar tenga el tamaño correcto. |
| `scrollToIndex` | `(index, align?) => void` | Scrollea programáticamente hasta una fila. |
| `range` | `{ first, last }` | Índices de la primera y última fila renderizada (incluye `overscan`). |

## Ejemplos

### Lista de alto fijo
```tsx
function BigList({ rows }: { rows: Row[] }) {
  const { scrollRef, virtualItems, totalHeight } = useVirtualList({ count: rows.length, itemHeight: 72 });

  return (
    <div ref={scrollRef} className="overflow-y-auto h-full">
      <div style={{ height: totalHeight, position: "relative" }}>
        {virtualItems.map((v) => (
          <div key={v.index} style={{ position: "absolute", top: v.start, height: v.size, left: 0, right: 0 }}>
            <RowView row={rows[v.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Alturas variables + scroll a un índice
```tsx
const { scrollRef, virtualItems, totalHeight, scrollToIndex } = useVirtualList({
  count: messages.length,
  itemHeight: (i) => (messages[i].hasImage ? 240 : 64),
});

useEffect(() => { scrollToIndex(messages.length - 1); }, [messages.length]);
```

## Notas y comportamiento

- Con `itemHeight` como **número fijo**, el cálculo de offsets es trivial (`índice × alto`). Con `itemHeight` como **función**, el hook recorre todos los índices (`0..count`) para acumular offsets en cada render donde cambian `count`/`itemHeight`/`overscan` — para decenas de miles de filas con alturas variables, considerá memoizar tu función `itemHeight` y evitar recrearla en cada render del padre.
- La medición del viewport usa un `ResizeObserver` sobre `scrollRef.current`, así que el cálculo se actualiza solo si el contenedor cambia de tamaño (por ejemplo, al rotar el dispositivo o cambiar el layout) — no hace falta ningún listener de `resize` manual.
- `scrollToIndex` escribe `el.scrollTop` directamente (sin `scrollIntoView` ni animación) — es instantáneo; si necesitás scroll suave, animalo vos por fuera o usá `el.scrollTo({ top, behavior: "smooth" })` con el valor calculado.
- El posicionamiento de cada fila es `position: absolute` con `top` explícito — el contenedor que envuelve `virtualItems.map(...)` necesita `position: relative` y una altura igual a `totalHeight` para que la scrollbar refleje el tamaño real de la lista completa (ver el ejemplo).
