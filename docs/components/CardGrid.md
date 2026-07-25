# CardGrid

> Grilla de cards genérica con control de columnas en tiempo real: botones −/+, pills numéricas, o ambos. Respeta un ancho mínimo por card — si las columnas elegidas no caben en el contenedor, baja sola y lo avisa. Puede recordar la preferencia del usuario en `localStorage`.

**Import**
```tsx
import { CardGrid } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para listados en grilla donde el usuario elige la densidad visual: catálogos de productos, propiedades, resultados de búsqueda con imágenes. `CardGrid` maneja el layout (`grid-template-columns`) y el control de columnas; el contenido de cada card lo definís vos, ya sea vía `renderItem` (con `items`) o pasando `children` directamente. El ancho mínimo por card (`minCardWidth`) evita que, en un contenedor angosto o una elección de muchas columnas, las cards queden ilegibles — la grilla se auto-ajusta y lo comunica (`"mostrando 2 · no caben 4"`).

## Cuándo NO usarlo / alternativas

- Si necesitás una grilla de datos tabulares (orden, búsqueda, selección, paginado) en vez de una grilla visual de cards, usá [DataTable](DataTable.md).
- Si el número de columnas es fijo y no necesitás que el usuario lo cambie, un `grid` de Tailwind directo es más simple que montar `CardGrid`.
- Para una única superficie de card (no una grilla), usá [Card](Card.md) y sus variantes (`MediaCard`, `ProfileCard`, etc.) directamente.

## Props

`CardGrid` es un componente genérico `<T>`, usado únicamente si pasás `items` + `renderItem`. Si en cambio pasás `children`, `T` es irrelevante.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `T[]` | `undefined` | Datos a renderizar. Se usa junto con `renderItem`; si se omite, se usa `children`. |
| `renderItem` | `(item: T, index: number) => ReactNode` | `undefined` | Renderiza cada item de `items`. |
| `children` | `ReactNode` | `undefined` | Contenido de la grilla si no usás `items`/`renderItem` (ej. cards ya armadas a mano). |
| `defaultColumns` | `number` | `3` | Columnas iniciales. |
| `min` | `number` | `1` | Mínimo de columnas seleccionable. |
| `max` | `number` | `6` | Máximo de columnas seleccionable. |
| `minCardWidth` | `number` | `200` | Ancho mínimo en px por card; por debajo de eso para las columnas elegidas, la grilla baja columnas sola. |
| `gap` | `number` | `16` | Separación en px entre cards (fila y columna). |
| `controls` | `boolean` | `true` | Muestra el control de columnas sobre la grilla. |
| `controlStyle` | `"buttons" \| "pills" \| "both"` | `"both"` | `buttons` = sólo −/+ · `pills` = un botón numerado por cada valor posible · `both` = ambos. |
| `storageKey` | `string` | `undefined` | Si se define, persiste la elección de columnas en `localStorage` bajo esta clave y la restaura al montar. |
| `label` | `string` | `"Columnas"` | Etiqueta junto al control de botones. |
| `toolbar` | `ReactNode` | `undefined` | Contenido adicional alineado a la derecha de los controles (ej. contador de resultados, ordenar por). |
| `onColumnsChange` | `(columns: number) => void` | `undefined` | Se llama cuando cambian las columnas *elegidas* por el usuario (no cuando bajan solas por falta de espacio — para eso, comparar contra el valor efectivo mostrado). |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Ejemplos

### Grilla de propiedades con columnas ajustables
```tsx
<CardGrid
  items={propiedades}
  renderItem={(p) => <PropertyCard key={p.id} {...p} />}
  defaultColumns={3}
  min={1}
  max={5}
  minCardWidth={190}
  storageKey="grid.cols"
  toolbar={<SortSelect />}
/>
```

### Con children en vez de items/renderItem
```tsx
<CardGrid defaultColumns={4} controlStyle="pills">
  {productos.map((p) => <ProductCard key={p.id} {...p} />)}
</CardGrid>
```

### Sin controles visibles (columnas fijas por código)
```tsx
<CardGrid items={posts} renderItem={(p) => <PostCard {...p} />} controls={false} defaultColumns={2} />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`.
- Es no controlado: `cols` es estado interno (opcionalmente sembrado desde `localStorage` vía `storageKey`); no hay prop `columns`/`onChange` controlado — usá `onColumnsChange` sólo para observar el valor, no para forzarlo desde afuera.

## Notas y comportamiento

- Las columnas "elegidas" (`cols`, controlado por el usuario) y las "efectivas" (`effective`, lo que realmente se renderiza) son distintas: `effective` es el mínimo entre `cols` y las columnas que caben según `minCardWidth` y el ancho medido del contenedor (`ResizeObserver`). Cuando difieren, se muestra el aviso `"mostrando N · no caben M"`.
- El ancho del contenedor se mide con `ResizeObserver` sobre un `<div ref={shell}>` interno — la grilla reacciona a cambios de layout (ej. abrir/cerrar un sidebar) sin necesidad de recargar la página.
- `storageKey` sólo lee/escribe `localStorage` en el cliente; el valor guardado se valida contra `min`/`max` antes de aplicarse (un valor corrupto o de una versión anterior con otro rango no rompe el componente).
- Si pasás tanto `items`+`renderItem` como `children`, gana `items`/`renderItem` (requiere ambos definidos; si falta alguno, cae a `children`).
- El estilo `pills` genera un botón por cada valor entre `min` y `max` inclusive — con rangos muy amplios (ej. `min={1} max={20}`) conviene usar `controlStyle="buttons"` en su lugar para no saturar la UI.
- La transición de `gap` al cambiar de columnas está animada por CSS (`transition: "gap 0.25s ease"`), pero el cambio de `gridTemplateColumns` en sí no tiene transición (cambia de golpe).
