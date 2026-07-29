# AppHeaderCardSlot

> Variante de `AppHeader` como header hero con degradado violeta y esquinas inferiores muy redondeadas, con una card flotante (vacía por defecto) centrada, mitad dentro y mitad fuera del header, lista para que el consumidor la llene con contenido propio.

**Import**
```tsx
import { AppHeaderCardSlot } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesitás un hero llamativo que además exhiba una pieza de contenido destacada justo debajo (balance de wallet, resumen de cuenta, tarjeta de bienvenida) que visualmente "flote" a caballo entre el header y el contenido de la página. El slot `card` recibe cualquier `ReactNode` — normalmente otro componente de la librería como `Card`, `WalletBalanceCard` o contenido custom.

## Cuándo NO usarlo / alternativas

- Si no necesitás una card flotante superpuesta, usá [AppHeaderWave](AppHeaderWave.md) (mismo estilo hero, sin el slot).
- Si el hero debe mostrar un `children` simple debajo del título en vez de una card semi-superpuesta, usá [AppHeaderWave](AppHeaderWave.md) o [AppHeader](AppHeader.md).
- Si necesitás título/subtítulo grande dentro del header, no está disponible acá — `AppHeaderCardSlot` no tiene props `title`/`subtitle`, sólo `leading` y `actions`. Usá [AppHeader](AppHeader.md) o [AppHeaderWave](AppHeaderWave.md) si el título es imprescindible en el header mismo.
- Para las demás variantes visuales, ver [AppHeaderIsland](AppHeaderIsland.md), [AppHeaderCard](AppHeaderCard.md), [AppHeaderNotch](AppHeaderNotch.md), [AppHeaderPill](AppHeaderPill.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `leading` | `ReactNode` | `undefined` | Contenido del botón superior izquierdo. Sin él, muestra un ícono de grilla/menú por defecto. |
| `onLeadingClick` | `() => void` | `undefined` | Handler de click del botón `leading`. |
| `actions` | `HeaderAction[]` | `[]` | Botones de icono a la derecha, con badge opcional. |
| `card` | `ReactNode` | `undefined` | Contenido de la card flotante central. Sin él, la card queda vacía (con su `minHeight`). |
| `cardMinHeight` | `number` | `96` | Alto mínimo en px de la card flotante; también determina cuánto sobresale del header (mitad de este valor). |
| `safeArea` | `boolean` | `true` | Agrega `padding-top` respetando `env(safe-area-inset-top)`. |
| `className` | `string` | `""` | Clases adicionales para el `<header>`. |

## Tipos exportados

No exporta tipos propios. Usa `HeaderAction`, exportado desde [AppHeader](AppHeader.md).

## Ejemplos

### Card vacía por defecto (placeholder)
```tsx
<AppHeaderCardSlot onLeadingClick={openMenu} />
```

### Con balance de wallet como contenido de la card
```tsx
<AppHeaderCardSlot
  onLeadingClick={openMenu}
  actions={[{ id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: true, onClick: openNotifs }]}
  card={<WalletBalanceCard balance={1250.5} currency="USD" />}
  cardMinHeight={120}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para las animaciones de entrada del bloque de acciones y de la card flotante.
- No usa `HeaderIcons`; dibuja su propio `GridIcon` interno (no exportado) como ícono por defecto de `leading`.
- Marcado como `"use client"`.
- No requiere ningún Provider.

## Notas y comportamiento

- El posicionamiento "mitad dentro, mitad fuera" se logra con `transform: translateY(cardMinHeight / 2)` sobre el contenedor de la card y un `<div>` espaciador final de `cardMinHeight / 2` — si cambiás `cardMinHeight`, ambos valores se recalculan automáticamente, no hace falta ajustar nada más.
- El header usa `overflow-visible` y `relative z-10` para que la card pueda sobresalir visualmente por debajo sin ser recortada.
- El color del degradado (`from-[#6d5bf0] to-[#4b3fce]`) es un valor fijo hexadecimal, no usa los tokens `primary`/`accent` de la librería — para adaptarlo a otra paleta hay que sobreescribir con `className` o clases utilitarias.
- La card interna usa `bg-surface border-border`, por lo que si el contenido pasado en `card` no define su propio fondo, hereda el estilo de superficie estándar de la librería (se adapta a light/dark).
- No tiene `title` ni `onBack`: es la única variante de `AppHeader` pensada exclusivamente como cabecera de pantalla raíz con protagonismo total del slot `card`.
