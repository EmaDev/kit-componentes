# AppHeaderPill

> Variante de `AppHeader` minimalista de dos filas: barra chica de título/acciones arriba y, siempre visible debajo, una píldora de búsqueda que se estira sutilmente con spring al enfocarse.

**Import**
```tsx
import { AppHeaderPill } from "lib-kit-components";
```

## Cuándo usarlo

Cuando la búsqueda es una acción de primer nivel que siempre debe estar visible (no expandible/oculta), como en apps de marketplace, delivery o exploración de contenido, donde el usuario busca apenas entra a la pantalla. El título queda relegado a una línea chica y discreta arriba.

## Cuándo NO usarlo / alternativas

- Si el buscador debe estar oculto por defecto y expandirse sólo al tocar la lupa, usá [AppHeader](AppHeader.md) con `searchable` o [AppHeaderIsland](AppHeaderIsland.md).
- Si el buscador es el centro absoluto de la pantalla (no un accesorio del header), considerá `HeroSearch`.
- Si necesitás título grande o botón de volver prominente, usá [AppHeader](AppHeader.md) — `AppHeaderPill` no tiene `onBack` ni `largeTitle`.
- Para las demás variantes visuales (cápsula, tarjeta, wave, notch, card slot), ver [AppHeaderIsland](AppHeaderIsland.md), [AppHeaderCard](AppHeaderCard.md), [AppHeaderWave](AppHeaderWave.md), [AppHeaderNotch](AppHeaderNotch.md), [AppHeaderCardSlot](AppHeaderCardSlot.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título chico mostrado en la primera fila. |
| `leading` | `ReactNode` | `undefined` | Contenido a la izquierda de la primera fila (avatar, logo, menú). |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha de la primera fila, con badge opcional. |
| `searchPlaceholder` | `string` | `"Buscar…"` | Placeholder de la píldora de búsqueda. |
| `onSearch` | `(q: string) => void` | `undefined` | Se llama en cada tecleo del input de búsqueda. |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Uso básico
```tsx
<AppHeaderPill title="Explorar" onSearch={setQuery} />
```

### Con leading y acciones
```tsx
<AppHeaderPill
  title="Marketplace"
  leading={<Avatar src={user.avatar} size="sm" />}
  actions={[{ id: "filters", label: "Filtros", icon: <FilterIcon />, onClick: openFilters }]}
  searchPlaceholder="Buscar productos…"
  onSearch={setQuery}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para la animación de escala sutil de la píldora al enfocarse.
- Usa internamente `HeaderIcons` (`SearchIcon`) — helper interno, no exportado por el paquete.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- No tiene `onBack`: es una variante pensada para pantallas raíz/tab (home, explorar), no para pantallas de detalle con navegación hacia atrás.
- La búsqueda no es expandible ni cancelable con un botón — el input siempre está montado y visible; `onSearch` se dispara en cada `onChange`, no hay evento explícito de "cancelar" como en `AppHeader`/`AppHeaderIsland`.
- El fondo sólo gana blur y borde (`bg-surface/90 backdrop-blur-xl border-b`) cuando el scroll supera `4px`; antes de eso es `bg-surface` opaco con borde transparente.
- El foco del input se puede disparar también haciendo click en cualquier parte de la píldora (el `motion.div` que envuelve el input tiene `onClick` que hace `focus()` al input).
