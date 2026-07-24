# DataTable

> Tabla de datos genérica con orden, búsqueda, selección y paginado, para explorar o gestionar colecciones de solo lectura (o con acciones por fila).

**Import**
```tsx
import { DataTable } from "lib-kit-components";
import type { Column, SortDir } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar listados de datos tabulares que el usuario necesita explorar: buscar, ordenar por columna, seleccionar filas en lote, paginar y disparar acciones (ver detalle, editar, eliminar) por fila. Es el componente indicado para pantallas de administración típicas — listado de clientes, pedidos, productos, usuarios — donde el dato ya existe y la interacción principal es *leer, filtrar y actuar sobre él*, no escribirlo celda por celda.

## Cuándo NO usarlo / alternativas

- Si el usuario necesita **editar valores directamente en la grilla** (tipo Excel/Sheets), con fórmulas, rangos y atajos de teclado, usá `Spreadsheet` en su lugar — `DataTable` no tiene celdas editables.
- Si sólo necesitás un calendario mensual con eventos, usá `CalendarGrid`.

## Props

`DataTable` es un componente genérico `<T>`, donde `T` es el tipo de cada fila del dataset (por ejemplo `Person`, `Order`, etc.). No hay restricciones sobre `T` más allá de que sus propiedades puedan indexarse por `keyof T`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `Column<T>[]` | — | Definición de columnas (ver tipo `Column<T>` abajo). |
| `rows` | `T[]` | — | Filas a mostrar. |
| `rowKey` | `(row: T) => string` | — | Devuelve la clave única de una fila; se usa para selección, `key` de React y animaciones. |
| `selectable` | `boolean` | `false` | Muestra checkboxes por fila y uno de "seleccionar todo" en el header. |
| `selected` | `string[]` | — | Claves seleccionadas, en modo controlado. Si se omite, el componente maneja su propio estado interno. |
| `onSelectedChange` | `(keys: string[]) => void` | — | Callback al cambiar la selección; requerido para modo controlado (junto con `selected`). |
| `searchable` | `boolean` | `false` | Muestra un input de búsqueda que filtra sobre todas las columnas (usa `sortValue` si existe, si no el valor crudo de `row[c.key]`). |
| `searchPlaceholder` | `string` | `"Buscar…"` | Placeholder del input de búsqueda. |
| `pageSize` | `number` | `0` | Filas por página. `0` desactiva el paginado (se muestran todas las filas filtradas/ordenadas). |
| `density` | `"compact" \| "normal" \| "comfortable"` | `"normal"` | Alto de fila: `compact` = 36px (`h-9`), `normal` = 48px (`h-12`), `comfortable` = 56px (`h-14`). |
| `stickyHeader` | `boolean` | `true` | Header fijo (con blur) al hacer scroll dentro de la tabla. |
| `maxHeight` | `string` | — | Alto máximo del área scrolleable (ej. `"420px"`). Si se define, el contenedor usa `overflow-auto` vertical y horizontal; si no, sólo `overflow-x-auto`. |
| `onRowClick` | `(row: T) => void` | — | Click en una fila (fuera del checkbox y de `rowActions`, que detienen la propagación). |
| `rowActions` | `(row: T) => ReactNode` | — | Renderiza acciones (menú, botones) al final de cada fila, en una columna de 56px. |
| `emptyState` | `ReactNode` | — | Contenido a mostrar cuando no hay filas visibles. Si se omite, se muestra un estado por defecto ("Sin resultados"). |
| `toolbar` | `ReactNode` | — | Contenido adicional alineado a la derecha, junto al buscador (ej. botón "Exportar", filtros). |
| `caption` | `string` | — | Texto accesible (`sr-only`) para describir la tabla a lectores de pantalla. |

## Tipos exportados

```ts
export type SortDir = "asc" | "desc";

export interface Column<T> {
  /** clave del dato en la fila */
  key: keyof T & string;
  header: ReactNode;
  /** ancho CSS, ej. "180px" o "1fr" */
  width?: string;
  align?: "left" | "center" | "right";
  /** permitir ordenar por esta columna. Default: true */
  sortable?: boolean;
  /** render custom de la celda */
  render?: (row: T, index: number) => ReactNode;
  /** valor usado para ordenar/filtrar si difiere del crudo */
  sortValue?: (row: T) => string | number;
  /** ocultar en pantallas chicas */
  hideOnMobile?: boolean;
}
```

## Ejemplos

### Uso básico
```tsx
interface Person {
  id: string;
  name: string;
  email: string;
  mrr: number;
}

const columns: Column<Person>[] = [
  { key: "name", header: "Nombre" },
  { key: "email", header: "Email" },
  { key: "mrr", header: "MRR", align: "right" },
];

<DataTable columns={columns} rows={people} rowKey={(r) => r.id} />
```

### Render custom, selección y paginado
```tsx
const [selected, setSelected] = useState<string[]>([]);

const columns: Column<Person>[] = [
  {
    key: "name",
    header: "Persona",
    width: "minmax(200px,1.4fr)",
    render: (r) => <PersonCell row={r} />,
  },
  { key: "email", header: "Email", hideOnMobile: true },
  {
    key: "mrr",
    header: "MRR",
    align: "right",
    sortValue: (r) => r.mrr, // fuerza orden numérico aunque el valor mostrado esté formateado
    render: (r) => `$${r.mrr.toLocaleString()}`,
  },
];

<DataTable
  columns={columns}
  rows={people}
  rowKey={(r) => r.id}
  selectable
  selected={selected}
  onSelectedChange={setSelected}
  searchable
  searchPlaceholder="Buscar persona…"
  pageSize={10}
  density="normal"
  stickyHeader
  maxHeight="420px"
  onRowClick={(r) => openDetail(r)}
  rowActions={(r) => <RowMenu row={r} />}
  toolbar={<Button size="sm" onClick={exportCsv}>Exportar</Button>}
  emptyState={<p className="text-sm text-muted">No hay resultados para tu búsqueda.</p>}
  caption="Listado de personas con MRR"
/>
```

### Columna no ordenable y ancho fijo
```tsx
const columns: Column<Order>[] = [
  { key: "id", header: "#", width: "72px", sortable: false },
  { key: "customer", header: "Cliente" },
  { key: "total", header: "Total", align: "right" },
];
```

## Requisitos / dependencias

- Usa `framer-motion` internamente (`motion`, `AnimatePresence`) para la animación de entrada de filas, el chip de "N seleccionadas" y el ícono de orden.
- No depende de estado externo: si no pasás `selected`/`onSelectedChange`, la selección se maneja con estado interno (`innerSel`).
- Requiere que el proyecto consumidor tenga cargados los tokens de tema de la librería (`lib-kit-components/styles.css` o tokens propios equivalentes: `--color-surface`, `--color-border`, `--color-primary`, etc.), ya que las clases usan variables CSS (`bg-surface`, `border-border`, `text-primary`, …).

## Notas y comportamiento

- La búsqueda (`searchable`) filtra sobre **todas** las columnas usando `sortValue` si existe, o el valor crudo (`String(row[c.key])`) en minúsculas; no hay forma de limitar la búsqueda a columnas específicas.
- Al cambiar el texto de búsqueda se resetea automáticamente a la página 0.
- El orden por columna es un ciclo de 3 estados al hacer click sucesivo: ascendente → descendente → sin orden (vuelve al orden original de `rows`).
- El orden numérico se detecta automáticamente cuando ambos valores comparados son `number`; si no, compara como string con `localeCompare`.
- `page` se recalcula con `safePage = Math.min(page, pageCount - 1)`, así que si `rows` cambia y la página actual queda fuera de rango, se ajusta sola sin quedar en blanco.
- El grid de columnas se arma dinámicamente con CSS Grid (`gridTemplateColumns`), agregando `44px` para el checkbox de selección y `56px` para `rowActions` cuando corresponde.
- Las columnas con `hideOnMobile: true` se ocultan por debajo del breakpoint `sm` de Tailwind.
- El checkbox "seleccionar todo" sólo considera las filas **visibles en la página actual** (`visible`), no todo el dataset filtrado — si seleccionás todo, cambiás de página y volvés, el estado de "todos seleccionados" se recalcula sólo con la página vigente.
- Accesibilidad: usa `role="table"`, `role="row"`, `role="columnheader"` con `aria-sort`, `role="cell"` y checkboxes con `role="checkbox"` + `aria-checked` (incluye estado `"mixed"` para selección parcial).
- El click en fila (`onRowClick`) no se dispara si el click fue sobre el checkbox o sobre `rowActions`, porque ambos detienen la propagación del evento.
