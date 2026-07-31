# ExpandableTable

> Tabla cuyas filas se despliegan: click en una fila revela un panel de detalle animado debajo, con contenido libre.

**Import**
```tsx
import { ExpandableTable } from "lib-kit-components";
import type { Column } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando cada fila tiene un detalle que no cabe en columnas: los ítems de un pedido, el desglose de una factura, los logs de una ejecución, el diff de un cambio. Evita navegar a otra pantalla para ver algo que es secundario pero frecuente.

## Cuándo NO usarlo / alternativas

- Si necesitás orden, búsqueda, selección con checkbox o paginado, usá [DataTable](DataTable.md) — esta tabla **no ordena** y su único gesto es expandir.
- Si el detalle es la acción principal (editarlo, aprobarlo), abrí un [Modal](Modal.md) o un [BottomSheet](BottomSheet.md) desde `onRowClick` de `DataTable`: un panel embebido invita a leer, no a operar.
- Si las secciones colapsables no son filas de una tabla sino bloques de un formulario, usá [CollapsibleFormSections](CollapsibleFormSections.md).
- Si lo que querés es animar el reordenamiento o resaltar valores que cambian, usá [AnimatedTable](AnimatedTable.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `columns` | `Column<T>[]` | — (requerido) | Definición de columnas. Mismo tipo que `DataTable`. |
| `rows` | `T[]` | — (requerido) | Filas a mostrar. |
| `rowKey` | `(row: T) => string` | — (requerido) | Clave estable por fila. Es también la identidad usada para saber qué filas están abiertas. |
| `renderDetail` | `(row: T, index: number) => ReactNode` | — (requerido) | Contenido del panel desplegable. |
| `multiple` | `boolean` | `false` | En `false` funciona como acordeón (abrir una cierra la anterior). En `true` se pueden tener varias abiertas. |
| `defaultExpanded` | `string[]` | `[]` | Claves (las que devuelve `rowKey`) abiertas al montar. |
| `density` | `"compact" \| "normal"` | `"normal"` | Alto de fila: `compact` = 36 px, `normal` = 44 px. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

Reutiliza `Column<T>` de [DataTable](DataTable.md). De ese tipo usa `key`, `header`, `width`, `align` y `render`; **ignora `sortable`, `sortValue` y `hideOnMobile`** (no ordena ni oculta columnas).

## Ejemplos

### Uso básico
```tsx
interface Pedido { id: string; numero: string; cliente: string; total: number }

const columns: Column<Pedido>[] = [
  { key: "numero", header: "Pedido", width: "120px" },
  { key: "cliente", header: "Cliente" },
  { key: "total", header: "Total", align: "right", render: (p) => `$${p.total.toLocaleString("es-AR")}` },
];

<ExpandableTable
  columns={columns}
  rows={pedidos}
  rowKey={(p) => p.id}
  renderDetail={(p) => <DetallePedido pedido={p} />}
/>
```

### Varias filas abiertas a la vez, con una ya expandida
```tsx
<ExpandableTable
  columns={columns}
  rows={pedidos}
  rowKey={(p) => p.id}
  renderDetail={(p) => <ItemsDelPedido items={p.items} />}
  multiple
  defaultExpanded={[pedidos[0].id]}
  density="compact"
/>
```

### Detalle que se carga al abrir
```tsx
<ExpandableTable
  columns={columns}
  rows={ejecuciones}
  rowKey={(e) => e.id}
  renderDetail={(e) => <LogsDeEjecucion id={e.id} />}   // se monta al expandir
/>
```

`renderDetail` sólo se llama con la fila abierta, así que un componente que hace fetch al montarse carga recién al desplegar.

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (`AnimatePresence` + `motion.div` con animación de `height: 0 → auto` para el panel, y `motion.span` para rotar el chevron).
- No depende de Next.js.
- Usa los tokens `--color-border`, `--color-surface`, `--color-surface-alt` y `--color-primary`.

## Notas y comportamiento

- **El estado de expandido es interno.** `defaultExpanded` sólo se lee al montar; no hay props `expanded`/`onExpandedChange` para controlarlo desde afuera, ni callback al abrir o cerrar una fila.
- **Toda la fila es el disparador**: no hay un botón dedicado, así que no podés combinar "expandir" con un `onRowClick` que haga otra cosa. Cuidado con poner controles interactivos en una celda con `render` — el click va a burbujear y desplegar la fila (paralo con `e.stopPropagation()` en tu propio handler).
- El chevron es decorativo: la fila no expone `aria-expanded` ni `role="button"`, y **no es navegable con teclado**. Si necesitás accesibilidad completa, envolvé el componente o usá un acordeón real.
- No ordena ni filtra: las filas salen en el orden de `rows`.
- El panel anima la altura hasta `auto`, así que funciona con contenido de alto variable; el `overflow` está oculto durante la transición.
- `rowKey` tiene que ser estable: si cambia entre renders, la fila abierta se "cierra" sola porque la clave guardada deja de coincidir.
- Con `multiple={false}`, abrir una fila reemplaza la lista de abiertas por esa sola; volver a clickear la misma la cierra.
- El ancho de las columnas sale de `column.width`; sin ese valor, el navegador reparte solo. Hay una columna extra fija de 36 px al inicio para el chevron.
