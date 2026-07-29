# AnimatedProgressRing

> Anillo de progreso circular con animación spring de "reveal" desde 0 al montarse — pensado para logros, metas cumplidas o el avance de un objetivo puntual.

**Import**
```tsx
import { AnimatedProgressRing } from "lib-kit-components";
```

## Cuándo usarlo

Para destacar visualmente que un objetivo o hito se alcanzó (o cuánto falta para alcanzarlo), con una animación de "reveal" tipo spring que arranca en 0% y sube hasta `value` cada vez que el componente se monta — ideal para tarjetas de logros, resúmenes de metas, widgets de dashboard puntuales o cualquier lugar donde el efecto de "conteo hacia el valor final" aporte énfasis. Pensado para un valor fijo que se muestra una vez, no para progreso que se actualiza en vivo varias veces por segundo.

## Cuándo NO usarlo / alternativas

- Si necesitás **modo indeterminado** (progreso sin valor conocido, ej. una carga en curso) o actualizar el valor en vivo repetidamente (ej. progreso de una subida de archivo), usá `ProgressRing` de [Progress](Progress.md) — soporta `value` indefinido para el modo indeterminado y no tiene el efecto de "reveal desde cero" atado al montaje, por lo que se siente más natural cuando el valor cambia seguido.
- Si necesitás **contenido custom** en el centro del anillo (un ícono, un avatar) o colores por `tone` predefinido (`primary`/`accent`/`success`/`danger`/`warning`) consistentes con el resto de la librería, usá también `ProgressRing` — `AnimatedProgressRing` sólo acepta un `label` de texto simple y un `color` como string CSS libre.
- Si necesitás un `max` distinto de 100 (progreso relativo a un total custom), usá `ProgressRing`, que expone `max`; `AnimatedProgressRing` sólo trabaja en escala 0-100.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | — (requerido) | Progreso de 0 a 100 (se clampea internamente con `Math.min(100, Math.max(0, value))`). |
| `size` | `number` | `96` | Diámetro del anillo en px. |
| `strokeWidth` | `number` | `8` | Grosor del trazo en px. |
| `label` | `string` | `undefined` | Texto mostrado al centro. Sin él, muestra `${Math.round(pct)}%`. |
| `color` | `string` | `undefined` | Color CSS del trazo de progreso (hex, `rgb()`, variable CSS, etc). Sin él, usa `currentColor` con la clase `text-primary`. |
| `className` | `string` | `""` | Clases adicionales del contenedor. |

## Tipos exportados

No exporta tipos adicionales — las props no están expuestas como tipo público.

## Ejemplos

### Básico
```tsx
<AnimatedProgressRing value={72} />
```

### Con color y tamaño custom (tarjeta de logro)
```tsx
<AnimatedProgressRing value={100} size={64} strokeWidth={6} color="#22c55e" label="✓" />
```

### En una fila de objetivos
```tsx
<div className="flex items-center gap-3">
  <AnimatedProgressRing value={objetivo.avance} size={56} strokeWidth={5} />
  <span className="text-sm font-medium text-foreground">{objetivo.nombre}</span>
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `framer-motion` (`motion.circle`) para animar `strokeDashoffset` con un spring (`stiffness: 90, damping: 18`).
- No depende de Next.js.
- No respeta `prefers-reduced-motion` automáticamente: la animación de reveal corre siempre al montar. Si necesitás desactivarla condicionalmente, envolvé el uso con `usePrefersReducedMotion` desde afuera — el componente no expone una prop propia para eso.

## Notas y comportamiento

- El anillo arranca en `strokeDashoffset` completo (0%) y anima hacia `value` recién después de montarse (`useEffect` que setea `mounted = true` en el primer render) — esto genera el efecto "reveal desde cero" cada vez que el componente entra al DOM, a diferencia de `ProgressRing`, que no tiene ese comportamiento atado al montaje.
- Si `value` cambia en renders posteriores con el componente ya montado, el anillo anima suavemente hacia el nuevo valor con el mismo spring — no vuelve a resetear a 0.
- No tiene prop `max`: el valor siempre se interpreta en escala 0-100.
- No tiene modo indeterminado (a diferencia de `ProgressRing`, que entra en modo indeterminado cuando `value` es `undefined`) — acá `value` es requerido.
- `color` es un string CSS libre, no un `tone` predefinido, así que podés pasar cualquier color de marca o token del sistema (`var(--color-...)`) sin estar atado a la paleta fija de `Progress.tsx`.
