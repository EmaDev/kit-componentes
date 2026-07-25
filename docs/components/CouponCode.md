# CouponCode

> Cupón copiable con timer de vencimiento y/o cupos limitados. Pulsa en rojo en el último minuto y se tacha automáticamente al vencer o agotarse.

**Import**
```tsx
import { CouponCode } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar un código de descuento ya conocido dentro de la página (no como overlay): páginas de campaña, banners de sección, tarjetas de fidelización. Soporta vencimiento por tiempo (`expiresAt`/`durationMs`), por cupos consumidos (`uses`), o ambos a la vez.

## Cuándo NO usarlo / alternativas

- Si necesitás interrumpir con un overlay para capturar el email antes de mostrar el cupón, usá [PromoPopup](PromoPopup.md).
- Si el mensaje es sobre el fin de una campaña en general (no un código puntual), usá [CountdownBanner](CountdownBanner.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `code` | `string` | — (requerido) | El código a copiar (ej. `"HOTSALE30"`). |
| `label` | `string` | `undefined` | Texto del beneficio arriba del código (ej. `"30% OFF en toda la tienda"`). |
| `expiresAt` | `Date \| number` | `undefined` | Vence en esta fecha/timestamp — el timer cuenta hacia atrás desde ahora. |
| `durationMs` | `number` | `undefined` | Alternativa a `expiresAt`: dura N ms desde que el componente se monta. |
| `uses` | `{ used: number; total: number }` | `undefined` | Cupos: muestra barra de progreso y "Quedan N de total". |
| `onCopy` | `(code: string) => void` | `undefined` | Se llama al copiar exitosamente. |
| `onExpire` | `() => void` | `undefined` | Se llama **una vez** cuando el timer llega a cero. |
| `tone` | `"primary" \| "danger" \| "success" \| "accent"` | `"primary"` | Color del acento (texto, borde, botón, barra). |
| `size` | `"sm" \| "md"` | `"md"` | Tamaño del bloque. |
| `className` | `string` | `""` | Clases adicionales. |

## Ejemplos

### Con timer
```tsx
<CouponCode
  code="HOTSALE30" label="30% OFF en toda la tienda"
  expiresAt={endOfSale} onExpire={refreshOffers} onCopy={track}
/>
```

### Con cupos, sin timer
```tsx
<CouponCode code="ENVIOGRATIS" uses={{ used: 37, total: 50 }} tone="success" />
```

### Con ambos límites
```tsx
<CouponCode
  code="FLASH10" label="10% extra · primeras 20 compras"
  durationMs={30 * 60 * 1000}
  uses={{ used: 12, total: 20 }}
  tone="danger"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para el pulso de urgencia y la barra de cupos.
- Marcado como `"use client"`.
- `navigator.clipboard.writeText` se envuelve en `try/catch`: si el navegador no tiene permiso o no soporta la API, el botón simplemente no marca "Copiado" (no lanza error).

## Notas y comportamiento

- El cupón queda deshabilitado (`dead`, tachado, botón "No disponible") cuando **cualquiera** de las dos condiciones se cumple: se agotaron los cupos (`used >= total`) o venció el timer.
- El timer se vuelve rojo y pulsa (`scale` en loop) en el **último minuto** (`< 60_000ms`), no antes.
- `onExpire` se dispara una única vez gracias a un `ref` interno — no se reinvoca aunque el componente siga montado con `left === 0`.
- Si pasás sólo `durationMs` (sin `expiresAt`), el deadline se calcula una vez al montar (`useMemo`) — cambiar `durationMs` en un re-render posterior no reinicia el timer; para reiniciarlo, remontá el componente (ej. cambiando su `key`).
