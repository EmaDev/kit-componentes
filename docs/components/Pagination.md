# Pagination

> Paginado numérico con elipsis, botones de extremos, resumen de rango ("41–60 de 248") y selector de tamaño de página. Colapsa a "‹ 3 / 12 ›" en mobile.

**Import**
```tsx
import { Pagination } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el usuario necesita saltar a una página específica de una colección grande y conocida (resultados de búsqueda, listados administrativos, tablas). Funciona con `total` + `pageSize` (calcula las páginas solo) o con `pageCount` directo si ya lo tenés calculado del backend.

## Cuándo NO usarlo / alternativas

- Si el listado crece indefinidamente y el usuario sólo necesita seguir bajando (feed, resultados de búsqueda infinitos), usá `InfiniteScroll` en vez de números de página explícitos.
- Si ya estás usando [DataTable](DataTable.md), no montes `Pagination` aparte — `DataTable` trae su propio paginado integrado vía `pageSize`.
- Para "cargar más" con un solo botón (sin números de página), un botón simple es más liviano que `Pagination`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `page` | `number` | — (requerido) | Página actual, 1-based. |
| `pageCount` | `number` | `undefined` | Total de páginas ya calculado. Si se omite, se deriva de `total`/`pageSize`. |
| `total` | `number` | `undefined` | Total de items (usado para calcular `pageCount` y el resumen). |
| `pageSize` | `number` | `20` | Items por página (usado junto con `total`). |
| `onPageChange` | `(page: number) => void` | — (requerido) | Se llama al cambiar de página (flechas, número, extremos). |
| `onPageSizeChange` | `(size: number) => void` | `undefined` | Si se pasa, muestra el selector "Por página". |
| `pageSizeOptions` | `number[]` | `[10, 20, 50, 100]` | Opciones del selector de tamaño de página. |
| `siblings` | `number` | `1` | Páginas visibles a cada lado de la actual antes de colapsar con "…". |
| `edges` | `boolean` | `true` | Muestra botones "primera página" / "última página" (doble flecha). |
| `summary` | `boolean` | `true` | Muestra "41–60 de 248" — sólo si hay `total`. |
| `compactOnMobile` | `boolean` | `true` | En pantallas `sm` y menores, colapsa los números a "3 / 12"; los botones de extremos y flechas siguen visibles. |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño de los botones. |
| `className` | `string` | `""` | Clases adicionales del `<nav>` raíz. |

## Ejemplos

### Uso básico con total + pageSize
```tsx
<Pagination
  page={page} total={248} pageSize={pageSize}
  onPageChange={setPage} onPageSizeChange={setPageSize}
  siblings={1} edges summary
/>
```

### Con pageCount ya calculado (sin resumen)
```tsx
<Pagination page={page} pageCount={12} onPageChange={setPage} summary={false} />
```

### Compacta, sin selector de tamaño
```tsx
<Pagination page={page} total={90} pageSize={10} onPageChange={setPage} size="sm" edges={false} />
```

## Requisitos / dependencias

- No usa `framer-motion` ni depende de `next`.
- Marcado como `"use client"`.
- Es controlado: no hay estado interno de página — siempre pasá `page` + `onPageChange`.

## Notas y comportamiento

- La elipsis (`"…"`) aparece cuando `pageCount` supera la ventana visible (`siblings * 2 + 5`); siempre se muestran la primera y la última página como anclas.
- `compactOnMobile` no oculta la paginación completa en mobile: reemplaza sólo la fila de números por un chip "3 / 12", conservando extremos, flechas y el resumen (que se reordena arriba con `order-*` de Tailwind).
- Si no pasás `total`, el `summary` no se renderiza aunque `summary={true}` (necesita `total` para calcular el rango mostrado).
- `onPageSizeChange` es lo único que activa el selector — sin esa prop, `pageSizeOptions` se ignora.
