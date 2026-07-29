# AppHeaderIsland

> Variante de `AppHeader` como cápsula flotante desprendida de los bordes (estilo "dynamic island"): forma fija completamente redondeada, separada del contenido por un margen constante, que se encoge y suma blur al scrollear.

**Import**
```tsx
import { AppHeaderIsland } from "lib-kit-components";
```

## Cuándo usarlo

Cuando querés una cabecera con look flotante y moderno en vez de la barra tradicional de borde a borde: apps con estética iOS 17+/Android Material You, pantallas donde el header no debe "pegarse" a los bordes de la pantalla. Trae buscador expandible in-place, botón de volver, acciones con badge y un slot para una fila extra (tabs, chips) debajo de la cápsula.

## Cuándo NO usarlo / alternativas

- Si necesitás el header estándar de borde a borde con título grande colapsable estilo iOS, usá [AppHeader](AppHeader.md).
- Si el look que buscás es una tarjeta con esquinas rectas separada del borde (no una píldora totalmente redondeada), usá [AppHeaderCard](AppHeaderCard.md).
- Si querés un header hero con degradado y curva en la esquina inferior, usá [AppHeaderWave](AppHeaderWave.md).
- Si necesitás una muesca circular con un botón flotante centrado (perfil, cámara), usá [AppHeaderNotch](AppHeaderNotch.md).
- Si el foco es una barra de búsqueda siempre visible en una segunda fila, usá [AppHeaderPill](AppHeaderPill.md).
- Si necesitás un hero con una card flotante vacía para contenido custom (balance, resumen), usá [AppHeaderCardSlot](AppHeaderCardSlot.md).
- A diferencia de `AppHeader`, esta variante no tiene `largeTitle` ni barra de progreso — es un header siempre compacto.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título de la pantalla. |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título. |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra la flecha de volver en vez de `leading`. |
| `leading` | `ReactNode` | `undefined` | Contenido a la izquierda cuando no hay `onBack` (avatar, logo, menú). |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `searchable` | `boolean` | `false` | Agrega un botón de lupa que expande un input de búsqueda dentro de la cápsula. |
| `searchPlaceholder` | `string` | `"Buscar…"` | Placeholder del input de búsqueda. |
| `onSearch` | `(q: string) => void` | `undefined` | Se llama en cada tecleo y con `""` al cancelar la búsqueda. |
| `children` | `ReactNode` | `undefined` | Fila extra debajo de la cápsula (tabs, chips, filtros). |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `className` | `string` | `""` | Clases adicionales para el contenedor sticky. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Cápsula simple con volver
```tsx
<AppHeaderIsland title="Detalle" onBack={() => router.back()} />
```

### Con buscador y acciones
```tsx
<AppHeaderIsland
  title="Inicio"
  searchable
  onSearch={setQuery}
  actions={[{ id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: 3, onClick: openNotifs }]}
/>
```

### Con fila de tabs debajo
```tsx
<AppHeaderIsland title="Productos" leading={<Avatar src={user.avatar} size="sm" />}>
  <ChipCarousel chips={categorias} value={cat} onChange={setCat} size="sm" />
</AppHeaderIsland>
```

## Requisitos / dependencias

- Usa `framer-motion` (`layout` animation en la cápsula, transiciones de búsqueda).
- Usa internamente `HeaderIcons` (`ChevronLeftIcon`, `SearchIcon`) — helper interno, no exportado por el paquete.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- La cápsula anima su `height` (56px → 48px) y `boxShadow` con `framer-motion` al detectar scroll (`scrollY > 4` o `scrollRef.current.scrollTop > 4`); usa `layout` para que el cambio de contenido (barra ↔ buscador) también anime el ancho/alto de forma fluida.
- Al activar `searching`, el input reemplaza título/leading/actions dentro de la misma cápsula — no conviven ambos, igual que en `AppHeader`.
- No tiene `largeTitle`, `variant` ni barra de `loading`/`progress` — es una variante deliberadamente más simple y siempre compacta que `AppHeader`.
- `centerTitle` no existe en esta variante; el título siempre queda alineado a la izquierda dentro de la cápsula.
