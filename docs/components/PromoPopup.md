# PromoPopup

> Interstitial de promociones: overlay con imagen, número grande destacado ("30% OFF"), captura de email opcional antes de revelar el cupón, y snooze por N días en `localStorage`.

**Import**
```tsx
import { PromoPopup } from "lib-kit-components";
import type { PromoLayout } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para promociones de entrada (welcome offer, descuento por newsletter, campaña estacional) que interrumpen brevemente la navegación con un delay configurable (`delay`) para no tapar el primer scroll. Con `emailCapture`, funciona como lead magnet: pide el email antes de mostrar el cupón/CTA.

## Cuándo NO usarlo / alternativas

- Si la promoción no necesita interrumpir con un overlay (puede convivir con la página), usá [CountdownBanner](CountdownBanner.md) en su lugar.
- Si sólo necesitás mostrar un cupón ya conocido, sin overlay ni captura de email, usá [CouponCode](CouponCode.md) embebido en la página.
- Para un diálogo de confirmación estándar (no promocional), usá [Modal](Modal.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si el popup debe mostrarse (sujeto a `delay` y `snoozeDays`). |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar (X, click afuera, Escape, o snooze). |
| `eyebrow` | `string` | `undefined` | Texto chico arriba del título (ej. "Sólo por hoy"). |
| `title` | `string` | — (requerido) | Título principal. |
| `description` | `string` | `undefined` | Texto debajo del título. |
| `highlight` | `string` | `undefined` | El número/oferta grande destacado (ej. `"30% OFF"`, `"2x1"`). |
| `image` | `string` | `undefined` | Imagen de cabecera (o lateral en `layout="side-image"`). |
| `cta` | `{ label: string; onClick: () => void }` | `undefined` | Acción principal (se oculta si `emailCapture` está activo y sin completar). |
| `secondary` | `{ label: string; onClick: () => void }` | `undefined` | Acción secundaria (texto, sin fondo). |
| `emailCapture` | `{ placeholder?: string; onSubmit: (email) => void \| Promise<void>; note?: string }` | `undefined` | Si se define, reemplaza `cta`/`secondary` por un formulario de email. |
| `layout` | `PromoLayout` | `"center"` | `center` (modal centrado), `side-image` (imagen a la izquierda en `sm`+), `bottom-sheet` (sube desde abajo). |
| `delay` | `number` | `0` | Milisegundos antes de mostrarse una vez `open` es `true`. |
| `snoozeDays` | `number` | `0` | Si > 0, al cerrarse no vuelve a mostrarse por N días (`localStorage`). `0` = siempre se puede reabrir. |
| `storageKey` | `string` | `"promo.snooze"` | Clave de `localStorage` para el snooze. |
| `legal` | `ReactNode` | `undefined` | Texto legal/letra chica al pie. |
| `className` | `string` | `""` | Clases adicionales del panel. |

## Tipos exportados

```ts
type PromoLayout = "center" | "side-image" | "bottom-sheet";
```

## Ejemplos

### Con captura de email
```tsx
<PromoPopup
  open={open} onClose={close}
  eyebrow="Sólo por hoy" highlight="30% OFF"
  title="Llevate el 30% en toda la colección"
  image="/promo.jpg"
  layout="center"
  delay={4000} snoozeDays={7}
  emailCapture={{ onSubmit: sendCoupon, note: "Sin spam." }}
/>
```

### CTA directo, layout lateral
```tsx
<PromoPopup
  open={open} onClose={close}
  title="Envío gratis en tu primera compra"
  image="/hero-promo.jpg" layout="side-image"
  cta={{ label: "Ver ofertas", onClick: goToOffers }}
  secondary={{ label: "No, gracias", onClick: close }}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para la entrada/salida (fade + scale, o slide-up en `bottom-sheet`).
- Marcado como `"use client"`.
- El snooze usa `localStorage`; en SSR o con storage bloqueado, simplemente no persiste (no rompe).
- Bloquea el scroll del `body` (`overflow: hidden`) mientras está visible.

## Notas y comportamiento

- `open={true}` no garantiza visibilidad inmediata: si `snoozeDays > 0` y todavía no venció el snooze guardado, el popup **no se muestra** aunque `open` sea `true` — es responsabilidad del popup, no de quien lo llama, respetar el snooze.
- `delay` se reinicia cada vez que `open` pasa de `false` a `true` — si alternás `open` rápido, el timer se cancela y vuelve a empezar.
- Con `emailCapture`, tras un `onSubmit` exitoso el popup muestra una confirmación inline y dejan de mostrarse `cta`/`secondary` — no hace falta que vos cierres el popup manualmente, pero tampoco se cierra solo (dejalo que el usuario lo cierre, o cerralo vos con un timeout si preferís).
- `layout="side-image"` sólo aplica el grid de dos columnas en `sm:` y superior; en mobile cae a layout vertical como `center`.
- Cerrar con Escape o click en el backdrop dispara el mismo flujo que la X (incluye el snooze si corresponde).
