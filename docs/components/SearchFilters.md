# SearchFilters

> Barra de búsqueda con chips de filtro (multi-selección por grupo) y resultados agrupados por categoría — para pantallas de búsqueda con facetas.

**Import**
```tsx
import { SearchFilters } from "lib-kit-components";
import type { FilterGroup, SearchResult } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás una búsqueda con texto libre **combinada** con filtros de faceta (categoría, estado, tipo) y los resultados se muestran agrupados debajo, en la misma superficie (sin navegar a otra pantalla): buscadores de comandos, catálogos con filtros rápidos, selectores de "elegí un ítem" con muchas opciones agrupadas. Resuelve en un solo componente: input de búsqueda con clear, chips de filtro (simple o multi-selección por grupo) con contador y "Limpiar", y la lista de resultados agrupada por categoría con estado vacío.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás elegir **un** valor de una lista cerrada dentro de un formulario (sin búsqueda de texto libre ni resultados agrupados), usá [Select](Select.md) — `SearchFilters` no tiene noción de "valor seleccionado" persistente, `onSelect` es un callback de click sobre un resultado, no un estado controlado.
- Si necesitás un menú de acciones anclado a un trigger, usá [Dropdown](Dropdown.md), no `SearchFilters`.
- Si lo que necesitás es la cabecera típica de un listado de productos (orden asc/desc + filtros de faceta + rango de precio, sin texto libre ni resultados agrupados debajo), usá [ProductFilterBar](ProductFilterBar.md).
- Si las opciones de filtro son pocas y no necesitás texto libre ni resultados agrupados debajo, un [ChipCarousel](ChipCarousel.md) con selección múltiple es más liviano.
- Si lo que necesitás es capturar etiquetas libres escritas por el usuario (no elegir de una lista predefinida), usá [TagInput](TagInput.md).
- **Importante:** el filtrado real por `active` no está implementado — ver Notas y comportamiento.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `placeholder` | `string` | `"Buscar…"` | Placeholder del input de búsqueda. |
| `filters` | `FilterGroup[]` | `[]` | Grupos de chips de filtro mostrados debajo del input. |
| `results` | `SearchResult[]` | — (requerido) | Resultados a mostrar, agrupados por `result.group`. |
| `groupLabels` | `Record<string, string>` | `{}` | Etiqueta legible por `group` id; si falta, se muestra el id crudo como título de sección. |
| `onQueryChange` | `(q: string) => void` | `undefined` | Se llama en cada cambio del texto de búsqueda. |
| `onFiltersChange` | `(active: Record<string, string[]>) => void` | `undefined` | Se llama al togglear un chip o al limpiar filtros, con el mapa `{ groupId: optionId[] }` actualizado. |
| `onSelect` | `(r: SearchResult) => void` | `undefined` | Se llama al hacer click sobre un resultado. |
| `emptyLabel` | `string` | `"No encontramos nada con esos filtros."` | Texto mostrado cuando no hay resultados tras filtrar por texto. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface FilterGroup {
  id: string;
  label: string;
  options: { id: string; label: string }[];
  multi?: boolean; // habilita selección múltiple dentro del grupo
}

export interface SearchResult {
  id: string;
  group: string;       // debe matchear el id de un FilterGroup / key de groupLabels
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Búsqueda simple con resultados agrupados
```tsx
<SearchFilters
  results={[
    { id: "1", group: "clientes", title: "Lucía Marín", subtitle: "lucia@mail.com" },
    { id: "2", group: "pedidos", title: "Pedido #1042", subtitle: "$12.400" },
  ]}
  groupLabels={{ clientes: "Clientes", pedidos: "Pedidos" }}
  onSelect={(r) => router.push(`/${r.group}/${r.id}`)}
/>
```

### Con chips de filtro multi-selección
```tsx
<SearchFilters
  placeholder="Buscar producto…"
  filters={[
    { id: "categoria", label: "Categoría", multi: true, options: [{ id: "ropa", label: "Ropa" }, { id: "hogar", label: "Hogar" }] },
    { id: "estado", label: "Estado", options: [{ id: "activo", label: "Activo" }, { id: "pausado", label: "Pausado" }] },
  ]}
  results={productos}
  groupLabels={{ productos: "Productos" }}
  onFiltersChange={(active) => refetch(active)}
  onSelect={(r) => setSelected(r)}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- El input y los chips manejan estado interno propio (`q`, `active`); no es un componente controlado — para reaccionar a cambios usá `onQueryChange`/`onFiltersChange`/`onSelect`, y para el filtrado real de datos server-side, respondé a esos callbacks vos mismo (ver Notas).

## Notas y comportamiento

- **El filtrado por chips activos es sólo visual/callback, no filtra `results`:** la condición interna que debería excluir resultados fuera de los filtros activos es un no-op (`ids.includes(r.group) || true` siempre evalúa `true`). En la práctica esto significa que `results` sólo se filtra por el texto de búsqueda (`q`) dentro del propio componente; la responsabilidad de filtrar `results` según los filtros activos queda en el consumidor, típicamente re-fetcheando o recalculando `results` en la callback `onFiltersChange` y pasando el array ya filtrado de vuelta por props. No asumas que pasar `filters` filtra automáticamente la lista mostrada.
- El filtro de texto compara `query` contra `${title} ${subtitle}` en minúsculas — no busca dentro de otros campos.
- Los chips de un `FilterGroup` con `multi: false` (default) se comportan como selección única dentro del grupo: togglear una opción reemplaza cualquier otra activa del mismo grupo.
- El botón "Limpiar (N)" sólo aparece cuando hay al menos un filtro activo, y limpia todos los grupos a la vez (no grupo por grupo).
- El icono de resultado (`SearchResult.icon`) se muestra en un chip cuadrado de 32px con fondo `primary/10`; sin `icon`, la fila no reserva ese espacio.
