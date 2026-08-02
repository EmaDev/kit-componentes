# ProductFilterBar

> Barra de orden + filtros para un listado de productos: ordenamiento por campo con toggle asc/desc, grupos de filtros (checkbox multi-selección o único), rango de precio y chips de filtros activos con remoción individual.

**Import**
```tsx
import { ProductFilterBar } from "lib-kit-components";
import type { SortField, ProductFilterGroup, ProductFilterValue } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en la cabecera de un listado de productos de una tienda online (o cualquier grilla filtrable): "Ordenar por precio/relevancia/novedad" con dirección asc/desc, filtros de faceta (categoría, marca, talle, color) en un panel desplegable, y un rango de precio con slider dual. Es controlado — vos manejás el estado (`value`) y sos responsable de filtrar/ordenar la lista de productos real en base a los cambios que llegan por `onChange` (típicamente re-fetch o `useMemo` sobre tus datos).

## Cuándo NO usarlo / alternativas

- Si necesitás combinar **texto libre de búsqueda** con chips de filtro y una lista de resultados agrupada en el mismo componente, usá [SearchFilters](SearchFilters.md) — `ProductFilterBar` no tiene input de búsqueda ni renderiza resultados, sólo el estado de orden/filtros.
- Si sólo necesitás 2-3 chips de filtro simples sin ordenamiento ni rango de precio, un [ChipCarousel](ChipCarousel.md) con selección múltiple es más liviano.
- Si el "ordenamiento" es en realidad elegir una única vista/pestaña (no un campo + dirección), usá [Tabs](Tabs.md) o [Select](Select.md).
- Si necesitás sólo el slider de rango de precio suelto (sin el resto de la barra), usá [DualRangeSlider](DualRangeSlider.md) directamente.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `ProductFilterValue` | — (requerido) | Estado controlado: campo/dirección de orden, rango de precio y filtros activos por grupo. |
| `onChange` | `(value: ProductFilterValue) => void` | — (requerido) | Se llama al cambiar el orden, tocar un filtro, mover el precio o limpiar. |
| `sortFields` | `SortField[]` | `[]` | Campos de ordenamiento disponibles (ej. Precio, Más vendidos, Novedades). Si está vacío, no se muestra el control de orden. |
| `groups` | `ProductFilterGroup[]` | `[]` | Grupos de filtros mostrados en el panel "Filtros". Si está vacío, el botón "Filtros" no se muestra. |
| `price` | `{ min: number; max: number; step?: number; label?: string; format?: (n: number) => string }` | `undefined` | Habilita el rango de precio (`DualRangeSlider`) dentro del panel de filtros. Sin esta prop no hay filtro de precio. |
| `resultCount` | `number` | `undefined` | Cantidad de resultados, mostrada a la izquierda de la barra. |
| `resultLabel` | `(n: number) => string` | `(n) => \`${n} resultados\`` | Formatea el texto de `resultCount`. |
| `clearable` | `boolean` | `true` | Muestra "Limpiar"/"Listo" al pie del panel de filtros y "Limpiar todo" en la fila de chips. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export type SortDirection = "asc" | "desc";

export interface SortField {
  id: string;
  label: string;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number; // ej. cantidad de productos con esa opción
}

export interface ProductFilterGroup {
  id: string;
  label: string;
  multi?: boolean; // selección múltiple (default true) o única dentro del grupo
  options: FilterOption[];
}

export interface ProductFilterValue {
  sortField?: string | null;
  sortDirection?: SortDirection; // default "desc" si no se especifica
  price?: [number, number];
  groups?: Record<string, string[]>; // groupId -> optionId[] seleccionados
}
```

## Ejemplos

### Orden + filtros + precio, estado controlado
```tsx
const [filters, setFilters] = useState<ProductFilterValue>({ sortField: "relevancia" });

<ProductFilterBar
  value={filters}
  onChange={setFilters}
  resultCount={128}
  sortFields={[
    { id: "relevancia", label: "Más relevantes" },
    { id: "precio", label: "Precio" },
    { id: "ventas", label: "Más vendidos" },
  ]}
  price={{ min: 0, max: 200000, step: 1000, format: (n) => `$${n.toLocaleString("es-AR")}` }}
  groups={[
    { id: "categoria", label: "Categoría", options: [{ id: "ropa", label: "Ropa", count: 84 }, { id: "calzado", label: "Calzado", count: 44 }] },
    { id: "marca", label: "Marca", options: [{ id: "nike", label: "Nike" }, { id: "adidas", label: "Adidas" }] },
    { id: "estado", label: "Estado", multi: false, options: [{ id: "nuevo", label: "Nuevo" }, { id: "usado", label: "Usado" }] },
  ]}
/>
```

### Filtrar la lista real a partir de `value`
```tsx
const productosFiltrados = useMemo(() => {
  let list = productos.filter((p) => {
    if (filters.price && (p.precio < filters.price[0] || p.precio > filters.price[1])) return false;
    if (filters.groups?.categoria?.length && !filters.groups.categoria.includes(p.categoria)) return false;
    if (filters.groups?.marca?.length && !filters.groups.marca.includes(p.marca)) return false;
    return true;
  });
  if (filters.sortField === "precio") {
    list = [...list].sort((a, b) => (filters.sortDirection === "asc" ? a.precio - b.precio : b.precio - a.precio));
  }
  return list;
}, [productos, filters]);
```

## Requisitos / dependencias

- Usa `framer-motion` para los popovers de orden y filtros, y reutiliza [Checkbox](Checkbox.md) (`CheckboxGroup`) y [DualRangeSlider](DualRangeSlider.md) internamente.
- Marcado como `"use client"`.
- Es controlado: no hay estado de filtros/orden interno persistente — siempre pasá `value` + `onChange`. El componente **no filtra ni ordena datos por vos**: sólo administra el estado de la UI: la responsabilidad de aplicar `value` a tu lista de productos es tuya (ver el segundo ejemplo).

## Notas y comportamiento

- Sin `sortFields`, el control de orden (campo + toggle asc/desc) no se renderiza. Sin `groups` **y** sin `price`, el botón "Filtros" tampoco se renderiza.
- `sortDirection` por defecto es `"desc"` cuando `value.sortDirection` es `undefined` — el ícono del botón de dirección refleja ese default aunque nunca se haya tocado.
- Un grupo con `multi: false` se comporta como selección única (radio): elegir una opción reemplaza cualquier otra activa del mismo grupo; volver a tocarla la deselecciona.
- La fila de chips activos sólo aparece cuando hay al menos un filtro u rango de precio distinto del default (`price.min`/`price.max`); cada chip se puede quitar individualmente, y "Limpiar todo" resetea precio y grupos (no toca el orden elegido).
- El panel de "Filtros" y el de "Ordenar" son popovers independientes: cada uno se cierra con click afuera, `Escape`, o su propio botón interno — abrir uno no cierra el otro automáticamente si ambos están abiertos.
