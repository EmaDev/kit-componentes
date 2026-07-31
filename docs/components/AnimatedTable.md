# AnimatedTable

> Tabla liviana con dos animaciones listas para usar: reacomodo suave de las filas al ordenar (FLIP) y resalte breve de las celdas que cambiaron de valor.

**Import**
```tsx
import { AnimatedTable } from "lib-kit-components";
import type { Column } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para tablas chicas o medianas donde el movimiento comunica algo: un ranking que se reordena al cambiar de columna, o un tablero con datos que se actualizan en vivo (cotizaciones, stock, métricas de un stream) donde querés que se note *qué* cambió sin que el usuario tenga que comparar. Reutiliza el mismo tipo `Column<T>` que `DataTable`, así que podés pasarle las mismas definiciones de columna.

## Cuándo NO usarlo / alternativas

- Si necesitás búsqueda, selección con checkbox, paginado, header sticky o acciones por fila, usá [DataTable](DataTable.md) — `AnimatedTable` sólo ordena, y a propósito: la animación `layout` de Framer Motion sobre cada fila se vuelve costosa con muchas filas.
- Si el usuario tiene que **editar** los valores, usá [Spreadsheet](Spreadsheet.md).
- Si la tabla es puramente informativa y no querés animaciones ni orden, usá `DataTable` sin `searchable`/`selectable`/`pageSize`: es más liviano que animar filas que nunca se mueven.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `Column<T>[]` | — (requerido) | Definición de columnas. Mismo tipo que `DataTable`. |
| `rows` | `T[]` | — (requerido) | Filas a mostrar. |
| `rowKey` | `(row: T) => string` | — (requerido) | Clave estable por fila. **Es lo que hace posible la animación**: si cambia entre renders, la fila se desmonta y vuelve a entrar en vez de desplazarse. |
| `sortable` | `boolean` | `true` | Habilita el orden al clickear el header. En `false`, ninguna columna ordena y no se muestra la flecha. |
| `highlightChanges` | `boolean` | `false` | Al cambiar el valor de una celda entre renders, la resalta con un fondo primario que se desvanece en ~1,1 s. |
| `density` | `"compact" \| "normal"` | `"normal"` | Alto de fila: `compact` = 36 px, `normal` = 44 px. |
| `onRowClick` | `(row: T) => void` | `undefined` | Click en la fila. Si se pasa, la fila toma `cursor-pointer` y hover. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

Reutiliza `Column<T>` de [DataTable](DataTable.md):

```ts
interface Column<T> {
  key: keyof T & string;
  header: ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
  sortValue?: (row: T) => string | number;
  hideOnMobile?: boolean;
}
```

De ese tipo, `AnimatedTable` usa `key`, `header`, `width`, `align`, `sortable`, `render` y `sortValue`. **`hideOnMobile` se ignora** (sólo lo aplica `DataTable`).

## Ejemplos

### Uso básico
```tsx
interface Stat { id: string; ticker: string; price: number; change: number }

const columns: Column<Stat>[] = [
  { key: "ticker", header: "Activo", width: "140px" },
  { key: "price", header: "Precio", align: "right" },
  { key: "change", header: "Var.", align: "right" },
];

<AnimatedTable columns={columns} rows={stats} rowKey={(s) => s.id} />
```

### Tablero en vivo con resalte de cambios
```tsx
const [stats, setStats] = useState(INITIAL);

useEffect(() => {
  const id = setInterval(() => setStats(fetchLatest), 2000);
  return () => clearInterval(id);
}, []);

<AnimatedTable
  columns={columns}
  rows={stats}
  rowKey={(s) => s.id}
  highlightChanges
  density="compact"
/>
```

### Con celda custom y orden por un valor distinto al crudo
```tsx
const columns: Column<Stat>[] = [
  { key: "ticker", header: "Activo" },
  {
    key: "change",
    header: "Var.",
    align: "right",
    sortValue: (s) => s.change,                        // ordena por el número
    render: (s) => <Delta value={s.change} />,          // pero muestra un componente
  },
  { key: "updatedAt", header: "Actualizado", sortable: false },
];
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (usa `motion.tr` con `layout` para el reacomodo y `motion.span` para el resalte).
- No depende de Next.js.
- El resalte de cambios usa `color-mix(in oklab, …)` sobre `--color-primary`, así que necesita el `globals.css` del kit (o esos tokens definidos).

## Notas y comportamiento

- **El orden es interno y no controlable**: no hay props `sort`/`onSortChange`. El ciclo al clickear el header es `asc → desc → sin orden` (vuelve al orden original de `rows`).
- Con `sortable={false}` a nivel tabla, `column.sortable` no habilita nada: la prop de la tabla manda.
- El orden compara números como números y cualquier otra cosa con `localeCompare` sobre `String(valor ?? "")`. Para fechas u objetos pasá `sortValue`.
- `highlightChanges` **sólo aplica a columnas sin `render`**: el resalte se dispara porque la celda se re-monta cuando cambia el string del valor crudo, y una celda con `render` no tiene ese string. Si necesitás resaltar una celda custom, manejá la animación dentro de tu propio componente.
- `rowKey` es crítico. Con un índice de array como clave (`(_, i) => String(i)`) las filas nunca "viajan" al reordenar, porque la clave sigue apuntando a la misma posición.
- Todas las filas entran con un fade (`opacity: 0 → 1`), incluida la primera pintada.
- No respeta `prefers-reduced-motion`: si necesitás desactivar el movimiento, pasá `sortable={false}` y `highlightChanges={false}` cuando la media query esté activa (podés leerla con [`usePrefersReducedMotion`](../hooks/useMediaQuery.md)).
