# TiltHoverCard

> Tarjeta que se inclina en 3D siguiendo la posición del cursor, con un glare (brillo) opcional que sigue el mismo punto.

**Import**
```tsx
import { TiltHoverCard } from "lib-kit-components";
```

## Cuándo usarlo

Para destacar un único bloque de contenido (producto, feature, tarjeta de precio) con una interacción "premium" al pasar el mouse: la tarjeta rota en `X`/`Y` siguiendo la posición relativa del cursor dentro de sus límites, con inercia de spring, y opcionalmente un brillo radial que se mueve junto con el puntero. Es un wrapper genérico — el contenido interno (`children`) es libre.

## Cuándo NO usarlo / alternativas

- Si el efecto de profundidad debe reaccionar al **scroll** en vez de al mouse (para secciones enteras, no una sola tarjeta destacada), usá [ParallaxScrollCards](ParallaxScrollCards.md).
- En touch/mobile el tilt no tiene efecto real (no hay `pointermove` continuo sin dedo apoyado), así que si tu superficie principal es táctil, evaluá si vale la pena el wrapper o preferí una `Card` simple.
- Si sólo necesitás la superficie base sin efecto de inclinación, usá `Card` de [Card](Card.md) — `TiltHoverCard` no reemplaza sus variantes (`elevated`, `glass`, etc.), sólo agrega el tilt encima de tu propio contenido.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `React.ReactNode` | — (requerido) | Contenido de la tarjeta. |
| `max` | `number` | `12` | Ángulo máximo de rotación en grados (aplica tanto a `rotateX` como `rotateY`, con signos invertidos entre ejes). |
| `glare` | `boolean` | `true` | Si es `true`, agrega una capa de brillo radial que sigue la posición del cursor. |
| `className` | `string` | `""` | Clases adicionales del contenedor (ya incluye `relative rounded-2xl border border-border bg-surface overflow-hidden [perspective:800px]`). |

## Ejemplos

### Básico
```tsx
<TiltHoverCard className="p-6 max-w-sm">
  <h3 className="text-lg font-bold">Plan Pro</h3>
  <p className="text-sm text-muted mt-1">Todo lo que necesitás para crecer.</p>
</TiltHoverCard>
```

### Sin glare, tilt más pronunciado
```tsx
<TiltHoverCard max={20} glare={false} className="p-0">
  <img src="/producto.jpg" alt="Producto" className="w-full h-56 object-cover" />
</TiltHoverCard>
```

## Requisitos / dependencias

- No depende de `next`.
- Usa `framer-motion` (`useMotionValue`, `useSpring`, `useTransform`) para mapear la posición del puntero dentro del elemento a `rotateX`/`rotateY` con inercia de spring (`stiffness: 220, damping: 20`), y para posicionar el `glare` (`radial-gradient` en las coordenadas del cursor).
- No respeta `prefers-reduced-motion` automáticamente: el tilt sigue al cursor siempre que haya `onPointerMove`. Si necesitás desactivarlo, condicioná `max={0}` (o no renderices el wrapper) según `usePrefersReducedMotion`.

## Notas y comportamiento

- La posición se normaliza a `[0, 1]` en `x`/`y` según el `getBoundingClientRect()` del elemento en cada `onPointerMove`, y vuelve al centro (`0.5, 0.5`) en `onPointerLeave` — al soltar el mouse la tarjeta se endereza suavemente por el spring, no de golpe.
- `rotateX` se deriva de `y` (`[0,1] → [max, -max]`) y `rotateY` de `x` (`[0,1] → [-max, max]`): mover el cursor hacia arriba inclina el borde superior hacia el usuario, y hacia la derecha inclina ese borde hacia adentro — es el mapeo estándar de un efecto "tilt card".
- `transformStyle: "preserve-3d"` está en el propio `motion.div` raíz, así que hijos con su propia transformación 3D (ej. un `FlipCard` anidado) podrían interactuar con la perspectiva — no es un caso de uso probado, evitalo salvo necesidad concreta.
- El `glare` es una capa `pointer-events-none` superpuesta con `radial-gradient(circle at {x} {y}, rgba(255,255,255,0.25), transparent 60%)`; en fondos oscuros/temas custom puede no ser igual de sutil que sobre `bg-surface` claro, ya que el color del brillo es blanco fijo (no usa tokens de tema).
- Usa `onPointerMove`/`onPointerLeave` (no `onMouseMove`), así que también reacciona a pen/stylus, pero en touch los eventos de pointer no disparan `move` continuo sin contacto sostenido — el efecto es esencialmente inerte en dedo.
