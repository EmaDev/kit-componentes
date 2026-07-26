# AppHeader

> Header de aplicación con flecha de regreso, título chico o grande colapsable, acciones con badge, buscador expandible, barra de progreso y una fila extra para tabs/chips. Gana borde y fondo al scrollear, como una app nativa.

**Import**
```tsx
import { AppHeader, type HeaderAction } from "lib-kit-components";
```

## Cuándo usarlo

Como cabecera fija de cualquier pantalla de app: listados, detalle con botón atrás, home con título grande estilo iOS que colapsa al bajar, o una barra con buscador expandible y acciones (notificaciones, filtros, más). Es el reemplazo natural de un `<header>` armado a mano cuando necesitás que reaccione al scroll y respete el safe area superior.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás una barra de navegación de sitio/dashboard con links (no una cabecera de pantalla de app), usá `Navbar`.
- Si el buscador es el centro de la pantalla (no un accesorio de la cabecera), considerá `HeroSearch`.
- Para el estado de sincronización offline junto al header, combinalo con `SyncStatus` (no lo reemplaza).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título de la pantalla. |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título chico. |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra la flecha de volver en vez de `leading`. |
| `backLabel` | `string` | `undefined` | Texto junto a la flecha de volver (estilo iOS). |
| `leading` | `ReactNode` | `undefined` | Contenido a la izquierda cuando no hay `onBack` (avatar, logo, menú). |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `largeTitle` | `boolean` | `false` | Título grande estilo iOS que colapsa al título chico al scrollear. |
| `centerTitle` | `boolean` | `false` | Centra el título chico (iOS) en vez de alinearlo a la izquierda (Android). |
| `variant` | `"solid" \| "blur" \| "transparent"` | `"blur"` | Fondo: sólido siempre, translúcido con blur al scrollear, o transparente hasta scrollear. |
| `searchable` | `boolean` | `false` | Agrega un botón de lupa que expande un input de búsqueda in-place. |
| `searchPlaceholder` | `string` | `"Buscar…"` | Placeholder del input de búsqueda. |
| `onSearch` | `(q: string) => void` | `undefined` | Se llama en cada tecleo y con `""` al cancelar la búsqueda. |
| `loading` | `boolean` | `false` | Barra de progreso indeterminada al pie del header. |
| `progress` | `number` | `undefined` | Progreso real 0–1; si está definido, pisa a `loading`. |
| `children` | `ReactNode` | `undefined` | Fila extra debajo del título (tabs, chips, filtros). |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top: var(--sa-top, env(safe-area-inset-top))`. |
| `sticky` | `boolean` | `true` | `position: sticky` vs `relative`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

```ts
interface HeaderAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  badge?: number | boolean; // número = pill con valor, true = punto
  tone?: "default" | "primary" | "danger";
  disabled?: boolean;
}
```

## Ejemplos

### Header simple con botón de volver
```tsx
<AppHeader title="Detalle del pedido" onBack={() => router.back()} />
```

### Título grande colapsable + acciones con badge
```tsx
<AppHeader
  title="Inicio"
  largeTitle
  actions={[
    { id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: 3, onClick: openNotifs },
    { id: "settings", label: "Ajustes", icon: <GearIcon />, onClick: openSettings },
  ]}
/>
```

### Buscador expandible + fila de tabs
```tsx
<AppHeader title="Productos" searchable onSearch={setQuery}>
  <ChipCarousel chips={categorias} value={cat} onChange={setCat} size="sm" />
</AppHeader>
```

### Progreso real de carga, sobre un contenedor propio con scroll
```tsx
const scrollRef = useRef<HTMLDivElement>(null);

<div ref={scrollRef} className="h-app overflow-y-auto">
  <AppHeader title="Subiendo archivo" progress={uploadPct} scrollRef={scrollRef} />
  {/* contenido */}
</div>
```

## Requisitos / dependencias

- Usa `framer-motion` para las transiciones de título/buscador y la barra de progreso.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- El colapso de `largeTitle` es puramente visual (basado en scroll leído con un listener `passive`), no anima el layout del resto de la página — el título grande ocupa espacio propio debajo de la barra de 56px y se retrae con `height: auto → 0`.
- Con `scrollRef`, el header observa `scrollRef.current.scrollTop` en vez de `window.scrollY`; si el ref todavía es `null` en el primer render (antes de montar el contenedor), usa la ventana hasta que el efecto se vuelva a ejecutar.
- Al activar el buscador (`searching`), la barra reemplaza título/leading/actions por el input a pantalla completa del header — no conviven ambos.
- `centerTitle` combinado con `onBack` compensa el ancho del botón de volver con `-ml-10 pl-10` para que el título quede realmente centrado en la barra, no centrado en el espacio restante.
- Si pasás `progress`, la barra indeterminada (`loading`) se ignora aunque también sea `true`.
