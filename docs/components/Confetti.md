# Confetti

> Confeti en `<canvas>` puro, sin dependencias externas: física simple (gravedad, roce, fade), tres modos de disparo, no captura clicks y respeta `prefers-reduced-motion`.

**Import**
```tsx
import { Confetti } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como capa decorativa sobre cualquier contenedor `relative` para celebrar una acción puntual (pago confirmado, meta alcanzada, logro desbloqueado). `SuccessPage` ya lo integra internamente — usá `Confetti` suelto cuando necesités el efecto sobre tu propio layout sin la pantalla de éxito completa.

## Cuándo NO usarlo / alternativas

- Si necesitás la pantalla completa de confirmación (check animado, detalles, CTA) con confeti incluido, usá [SuccessPage](SuccessPage.md) directamente en vez de armar `Confetti` a mano.
- Si el usuario tiene `prefers-reduced-motion` activado y tu producto debe respetarlo estrictamente, dejá `respectReducedMotion` en su default (`true`) — no lo desactives salvo que tengas una razón concreta.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `fire` | `number` | `1` | Cambiá este número (ej. incrementalo) para volver a disparar el efecto. |
| `count` | `number` | `140` | Cantidad de papelitos por disparo. |
| `colors` | `string[]` | 6 colores de marca | Paleta de colores de los papelitos. |
| `mode` | `"burst" \| "rain" \| "center"` | `"burst"` | `burst` = dos cañones laterales desde abajo; `rain` = cae desde arriba; `center` = explosión radial desde el centro. |
| `duration` | `number` | `3200` | Duración total en ms (incluye el fade final). |
| `respectReducedMotion` | `boolean` | `true` | Si el usuario tiene `prefers-reduced-motion: reduce`, no dispara nada. |
| `className` | `string` | `""` | Clases adicionales del `<canvas>`. |

## Ejemplos

### Disparo manual con botón
```tsx
const [shot, setShot] = useState(1);

<div className="relative">
  <Confetti fire={shot} mode="center" count={160} />
  <Button onClick={() => setShot((s) => s + 1)}>¡Festejar!</Button>
</div>
```

### Lluvia continua suave
```tsx
<Confetti mode="rain" count={80} duration={5000} />
```

## Requisitos / dependencias

- Sin dependencias externas — no usa `framer-motion`, sólo Canvas 2D API.
- Marcado como `"use client"`.
- El `<canvas>` se posiciona `absolute inset-0` con `pointer-events-none` — el contenedor padre debe tener `position: relative` (o equivalente) para que cubra el área esperada.

## Notas y comportamiento

- El efecto se dispara con cada **cambio** de `fire` (no en cada render) — si `fire` queda fijo en el mismo valor, el efecto no se repite; para volver a dispararlo, incrementá el número (`setShot((s) => s + 1)`), no lo reseteés a un valor fijo repetido.
- `fire <= 0` no dispara nada — es una forma válida de "armar" el componente sin que dispare al montar.
- El fade final ocupa el último 38% de `duration` — piezas que ya cayeron fuera del canvas antes de eso simplemente dejan de dibujarse (el loop se corta cuando no quedan piezas "vivas" y se cumplió `duration`).
- Escala por `devicePixelRatio` (limitado a 2×) y se re-ajusta en `resize` — no hace falta que gestiones el tamaño del canvas vos mismo, sólo el tamaño del contenedor.
