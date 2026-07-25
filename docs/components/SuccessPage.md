# SuccessPage

> Pantalla de éxito completa: check animado con halo pulsante, confeti opcional, headline/detalles de la operación, acciones primaria/secundaria y redirección automática con cuenta atrás.

**Import**
```tsx
import { SuccessPage } from "lib-kit-components";
import type { SuccessDetail } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como pantalla de confirmación tras completar una operación importante: pago exitoso, pedido confirmado, reserva realizada, formulario enviado. Combina el check animado, el resumen de la operación (`details`) y las acciones de continuar (`primary`/`secondary`), con confeti para reforzar la sensación de logro.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás el efecto de confeti sobre tu propio layout (sin la pantalla de éxito completa), usá [Confetti](Confetti.md) directamente.
- Para un mensaje de éxito no bloqueante y transitorio (no una pantalla completa), usá [Toast](Toast.md) o [Snackbar](Snackbar.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `"¡Listo!"` | Título principal. |
| `description` | `string` | `undefined` | Texto debajo del título/headline. |
| `headline` | `string` | `undefined` | Dato destacado grande (ej. `"$248.320"`, número de operación). |
| `details` | `SuccessDetail[]` | `[]` | Lista de pares label/valor (ej. número de operación, método de pago). |
| `primary` | `{ label: string; onClick?: () => void; href?: string }` | `undefined` | Acción principal (botón sólido). Con `href`, renderiza un `<a>`. |
| `secondary` | `{ label: string; onClick?: () => void; href?: string }` | `undefined` | Acción secundaria (botón con borde). |
| `confetti` | `"burst" \| "rain" \| "center" \| false` | `"burst"` | Modo del confeti (ver [Confetti](Confetti.md)). `false` lo desactiva. |
| `redirectIn` | `number` | `undefined` | Segundos hasta redirigir automáticamente (muestra cuenta atrás). |
| `onRedirect` | `() => void` | `undefined` | Se llama cuando `redirectIn` llega a cero. |
| `tone` | `"success" \| "primary" \| "accent"` | `"success"` | Color del check, halo y botón primario. |
| `variant` | `"full" \| "card"` | `"full"` | `full` = pantalla completa (`100dvh`); `card` = tarjeta embebida en otro layout. |
| `footnote` | `string` | `undefined` | Texto pequeño al pie. |
| `children` | `ReactNode` | `undefined` | Contenido extra debajo de los detalles (ej. un resumen custom). |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
export interface SuccessDetail {
  label: string;
  value: string;
}
```

## Ejemplos

### Pago confirmado con redirección automática
```tsx
<SuccessPage
  title="¡Pago confirmado!" headline="$248.320"
  description="Te mandamos el comprobante por mail."
  details={[{ label: "Operación", value: "#A-10428" }]}
  primary={{ label: "Ver mi pedido", href: "/pedidos/A-10428" }}
  secondary={{ label: "Volver a la tienda", onClick: goHome }}
  confetti="burst" tone="success" variant="full"
  redirectIn={10} onRedirect={() => router.push("/")}
/>
```

### Embebida como card, sin confeti
```tsx
<SuccessPage
  title="Reserva confirmada" variant="card" confetti={false}
  details={[{ label: "Fecha", value: "12 ago" }, { label: "Personas", value: "4" }]}
  primary={{ label: "Ver reserva", onClick: openReservation }}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para las animaciones de entrada escalonadas y `Confetti` internamente si `confetti !== false`.
- Marcado como `"use client"`.
- `variant="full"` asume que es la única pantalla visible (`min-h-[100dvh]`); si la usás dentro de un layout con header/footer propios, usá `variant="card"`.

## Notas y comportamiento

- `redirectIn` inicia una cuenta atrás real (`setInterval` de 1s); al llegar a `0` limpia el intervalo y llama `onRedirect` una sola vez — no hace falta que vos canceles nada al desmontar (el `useEffect` lo limpia).
- El botón "Repetir la animación" al pie sólo aparece si `confetti` no es `false`, e incrementa el contador interno que dispara `Confetti` de nuevo (mismo patrón que la prop `fire` de `Confetti`).
- `primary`/`secondary` con `href` renderizan un `<a>` (no un botón) — si necesitás navegación de Next.js (`next/link`), envolvé el resultado vos mismo o usá `onClick` con `router.push` en su lugar, ya que este componente no importa `next/link` directamente.
- El halo pulsante detrás del check es puramente decorativo (`opacity-25`, `blur-3xl`) y no afecta el layout ni el scroll.
