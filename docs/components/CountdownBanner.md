# CountdownBanner

> Banner de cuenta regresiva de campaña, fijable arriba/abajo de la pantalla, descartable con snooze, con tres estilos: barra fina, cajas con separadores, o dígitos con flip.

**Import**
```tsx
import { CountdownBanner } from "lib-kit-components";
import type { CountdownVariant } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para comunicar el fin de una promoción/campaña a nivel de página completa (Hot Sale, Cyber Monday, oferta por lanzamiento), típicamente fijo arriba o abajo del viewport (`sticky`). Es distinto de `CouponCode`: acá el foco es el tiempo restante de la campaña en general, no un código puntual.

## Cuándo NO usarlo / alternativas

- Si el mensaje es sobre un código de descuento específico que el usuario debe copiar, usá [CouponCode](CouponCode.md).
- Si necesitás interrumpir con un overlay (no un banner persistente), usá [PromoPopup](PromoPopup.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `until` | `Date \| number` | — (requerido) | Fin de la promoción. |
| `title` | `string` | `"La oferta termina en"` | Texto principal junto al contador. |
| `eyebrow` | `string` | `undefined` | Texto chico arriba del título (ej. `"Hot Sale"`). |
| `cta` | `{ label: string; onClick: () => void }` | `undefined` | Botón de acción junto al contador. |
| `variant` | `CountdownVariant` | `"boxes"` | `bar` (número compacto + barra de progreso fina), `boxes` (cajas por unidad), `flip` (cajas con animación de dígito entrante/saliente). |
| `tone` | `"primary" \| "danger" \| "accent" \| "dark"` | `"danger"` | Color de fondo del banner. |
| `sticky` | `"top" \| "bottom" \| false` | `false` | Fija el banner arriba/abajo del viewport (`position: fixed`). |
| `dismissible` | `boolean` | `true` | Muestra el botón de cerrar (X). |
| `snoozeDays` | `number` | `0` | Si > 0, al cerrar no vuelve a mostrarse por N días (`localStorage`). |
| `storageKey` | `string` | `"countdown.snooze"` | Clave de `localStorage` para el snooze. |
| `expiredMessage` | `ReactNode` | `undefined` | Mensaje a mostrar cuando termina el tiempo. Sin esto, el banner se **oculta** al llegar a cero. |
| `onExpire` | `() => void` | `undefined` | Se llama una vez cuando el contador llega a cero. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
type CountdownVariant = "bar" | "boxes" | "flip";
```

## Ejemplos

### Fijo arriba, con CTA y snooze
```tsx
<CountdownBanner
  until={endOfSale} eyebrow="Hot Sale" title="La oferta termina en"
  variant="boxes" tone="danger" sticky="top"
  cta={{ label: "Ver ofertas", onClick: go }}
  dismissible snoozeDays={1}
  expiredMessage="La promoción terminó." onExpire={refreshPrices}
/>
```

### Variante bar, sin fijar
```tsx
<CountdownBanner until={endOfSale} variant="bar" tone="dark" dismissible={false} />
```

### Variante flip
```tsx
<CountdownBanner until={endOfSale} variant="flip" tone="accent" sticky="bottom" />
```

## Requisitos / dependencias

- Usa `framer-motion` (entrada/salida, pulso del ícono en urgencia, animación de dígitos en `variant="flip"`).
- Marcado como `"use client"`.
- Con `sticky`, respeta `var(--sa-top)`/`var(--sa-bottom)` vía `padding` inline — funciona sin ellos (caen a `0px`).

## Notas y comportamiento

- Sin `expiredMessage`, el banner **desaparece completamente** al llegar a cero (no queda un banner vacío); con `expiredMessage`, se mantiene mostrando ese mensaje en el lugar del `title`/contador.
- `onExpire` se dispara una única vez (`ref` interno), independientemente de si hay `expiredMessage` o no.
- El "urgente" (pulso del ícono + variante `bar` acelerando visualmente) arranca en la última hora (`< 3600_000ms`), no antes.
- El snooze se resuelve en un `useEffect` al montar — en el primer render (antes del efecto) el banner puede parpadear brevemente visible antes de ocultarse si hay un snooze activo; es un trade-off del storage en cliente, no un bug a "arreglar" con SSR.
- `variant="bar"` usa `left / 864e5` (86400000, un día) para la barra de progreso — pensado para campañas de duración corta a media; en campañas de varias semanas la barra se verá casi siempre llena hasta el final.
