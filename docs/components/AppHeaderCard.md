# AppHeaderCard

> Variante de `AppHeader` como tarjeta flotante: forma fija (`rounded-3xl`) separada de los bordes de la pantalla por un margen constante, cuya sombra gana elevación al scrollear, como si la tarjeta "se levantara" sobre el contenido.

**Import**
```tsx
import { AppHeaderCard } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el diseño pide una cabecera con look de tarjeta (bordes rectos redondeados, no una píldora) claramente separada del contenido de la pantalla, con feedback de profundidad al scrollear. Encaja bien en apps con estética "card-based" donde el resto de la UI también usa `Card` como superficie base.

## Cuándo NO usarlo / alternativas

- Si preferís una cápsula totalmente redondeada tipo "dynamic island", usá [AppHeaderIsland](AppHeaderIsland.md).
- Si necesitás el header estándar de borde a borde con título grande colapsable, usá [AppHeader](AppHeader.md).
- Si buscás un hero con degradado y curva inferior, usá [AppHeaderWave](AppHeaderWave.md).
- Si necesitás una muesca circular con botón flotante centrado, usá [AppHeaderNotch](AppHeaderNotch.md).
- Si el foco es una barra de búsqueda siempre visible, usá [AppHeaderPill](AppHeaderPill.md).
- No tiene `leading` ni buscador expandible — si los necesitás, usá `AppHeader` o `AppHeaderIsland`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | — (requerido) | Título de la pantalla. |
| `subtitle` | `string` | `undefined` | Texto secundario debajo del título. |
| `onBack` | `() => void` | `undefined` | Si se pasa, muestra la flecha de volver. |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `children` | `ReactNode` | `undefined` | Fila extra dentro de la tarjeta, debajo del título (tabs, chips, filtros). |
| `scrollRef` | `RefObject<HTMLElement \| null>` | `undefined` | Elemento scrolleable a observar en vez de la ventana. |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`, sumado al margen fijo del contenedor. |
| `className` | `string` | `""` | Clases adicionales para el contenedor sticky exterior. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Tarjeta simple con volver
```tsx
<AppHeaderCard title="Detalle del pedido" onBack={() => router.back()} />
```

### Con acciones y badge
```tsx
<AppHeaderCard
  title="Mensajes"
  actions={[{ id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: 5, onClick: openNotifs }]}
/>
```

### Con fila de filtros dentro de la tarjeta
```tsx
<AppHeaderCard title="Productos">
  <ChipCarousel chips={categorias} value={cat} onChange={setCat} size="sm" />
</AppHeaderCard>
```

## Requisitos / dependencias

- Usa `framer-motion` para animar `boxShadow` y una traslación mínima en Y al scrollear.
- Usa internamente `HeaderIcons` (`ChevronLeftIcon`) — helper interno, no exportado por el paquete.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- El "levante" de la tarjeta es puramente visual: `boxShadow` pasa de `0 2px 8px` a `0 18px 40px` y `y` de `0` a `-1` cuando el scroll supera `4px`; no cambia el layout de la página.
- `safeArea` suma `12px` fijos de margen superior al valor de `env(safe-area-inset-top)`, porque el contenedor exterior ya reserva `pt-3` para separar la tarjeta del borde de la pantalla.
- El contenedor exterior (`div.sticky`) tiene `px-3 pt-3 pb-1` fijos — para cambiar el margen lateral/vertical de la tarjeta hay que pasar `className` al componente, que se aplica a ese contenedor, no a la tarjeta interna.
- A diferencia de `AppHeader`, no tiene modo `largeTitle`: el título siempre se muestra en tamaño chico (`15px`) dentro de la tarjeta.
