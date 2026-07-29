# AnimatedCounter

> Contador tipo odómetro: el número rueda suavemente hacia el nuevo valor con un spring, en vez de saltar directo.

**Import**
```tsx
import { AnimatedCounter } from "lib-kit-components";
```

## Cuándo usarlo

Cuando un número visible en la UI cambia dinámicamente (saldo, contador de likes, KPI de dashboard, resultado de un cálculo en vivo) y querés que el cambio se perciba como una transición fluida en vez de un salto instantáneo — reduce el "parpadeo" cognitivo y hace notar que el valor efectivamente cambió.

## Cuándo NO usarlo / alternativas

- Si el número es estático (no cambia después del render inicial), no uses `AnimatedCounter` — renderizá el valor formateado directo, es innecesario animar algo que no cambia.
- Si necesitás mostrar progreso hacia una meta (no sólo un número), usá [ProgressRing](Progress.md)/[AnimatedProgressRing](AnimatedProgressRing.md) o [ProgressBar](Progress.md) en vez de (o junto a) `AnimatedCounter`.
- Para un KPI completo con label, unidad, delta y sparkline, usá `StatCard` de [Card](Card.md) — podés combinarlo con `AnimatedCounter` en su `value` si necesitás que el número específicamente ruede.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | — (requerido) | Valor objetivo actual. Cada cambio dispara la animación desde el valor mostrado previamente. |
| `format` | `(n: number) => string` | `n => Math.round(n).toLocaleString()` | Formatea el valor intermedio/final en cada frame (ej. agregar símbolo de moneda, decimales fijos). |
| `duration` | `number` | `0.8` | Duración aproximada de la animación en segundos (se pasa como `duration * 1000` ms al spring de Framer Motion). |
| `className` | `string` | `""` | Clases adicionales del `<span>` (ya incluye `tabular-nums`). |

## Ejemplos

### Básico
```tsx
<AnimatedCounter value={saldo} />
```

### Formateado como moneda
```tsx
<AnimatedCounter
  value={total}
  format={(n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 })}
/>
```

### Dentro de un StatCard, con animación más lenta
```tsx
<StatCard
  label="Usuarios activos"
  value={<AnimatedCounter value={activeUsers} duration={1.2} />}
  tone="success"
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` (`useSpring` + `useTransform`) para interpolar el valor numérico y renderizarlo como texto en cada frame.
- No respeta `prefers-reduced-motion` automáticamente: el spring corre siempre que `value` cambia. Si necesitás desactivarlo, pasá `duration={0}` condicionalmente según `usePrefersReducedMotion`.

## Notas y comportamiento

- Internamente usa `useSpring(value, ...)` como valor base y `spring.set(value)` dentro de un `useEffect` que depende de `value` — esto es lo que dispara la animación en cada cambio de la prop (el spring inicial arranca ya en `value`, así que el primer render no anima "desde 0").
- El spring usa `bounce: 0.15`, así que hay un ligero overshoot/rebote sutil al llegar al valor final, no es puramente lineal.
- `format` se ejecuta en cada frame de la animación (no sólo al final), así que debe ser una función barata — evitá cálculos costosos ahí.
- El texto usa `tabular-nums` por defecto para que los dígitos no salten de ancho mientras cambian (números de igual cantidad de dígitos ocupan el mismo espacio).
- No hace ningún clamp ni validación sobre `value`: acepta negativos y decimales; el default de `format` los redondea con `Math.round`, así que si necesitás decimales visibles tenés que pasar tu propio `format`.
