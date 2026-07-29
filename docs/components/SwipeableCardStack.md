# SwipeableCardStack

> Pila de tarjetas deslizables tipo Tinder: arrastre con física, indicadores "SÍ"/"NO" y callbacks de swipe/vacío.

**Import**
```tsx
import { SwipeableCardStack, type SwipeCard } from "lib-kit-components";
```

## Cuándo usarlo

Para flujos de decisión binaria sobre una cola de ítems, uno a la vez — aprobar/descartar candidatos, curar contenido, revisar sugerencias — donde el usuario arrastra la tarjeta superior a izquierda o derecha (o usa los botones de abajo) para avanzar a la siguiente. Muestra hasta 3 tarjetas apiladas a la vez (la de arriba interactiva, las de atrás asoman como preview) y expone `onSwipe` por cada decisión y `onEmpty` cuando se acaba la cola.

## Cuándo NO usarlo / alternativas

- Si el usuario tiene que elegir **una sola** opción de un conjunto visible (no recorrer/descartar una cola completa), usá [CardFan](CardFan.md) en vez de `SwipeableCardStack`.
- Si necesitás reordenar una lista (no descartarla), usá [DragReorderList](DragReorderList.md) — ahí el arrastre reordena en el lugar, no saca elementos de la pila.
- Si las tarjetas no necesitan gesto de arrastre y sólo se navegan con flechas/paginado, usá [Carousel](Carousel.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `cards` | `SwipeCard[]` | — (requerido) | Cola inicial de tarjetas, en orden (la primera es la que aparece arriba). |
| `onSwipe` | `(card: SwipeCard, dir: "left" \| "right") => void` | `undefined` | Se llama al descartar (`"left"`) o aprobar (`"right"`) una tarjeta, ya sea por arrastre o por los botones. |
| `onEmpty` | `() => void` | `undefined` | Se llama una vez, cuando se decide la última tarjeta de la cola. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
interface SwipeCard {
  id: string;
  title: string;
  subtitle?: string;
  image?: string; // URL; sin ella dibuja un degradé accent→primary de fondo
}
```

## Ejemplos

### Básico con botones de acción
```tsx
<SwipeableCardStack
  cards={[
    { id: "1", title: "Laura, 28", subtitle: "Diseñadora UX" },
    { id: "2", title: "Martín, 31", subtitle: "Dev backend" },
    { id: "3", title: "Sofía, 26", subtitle: "PM" },
  ]}
  onSwipe={(card, dir) => console.log(card.title, dir === "right" ? "aprobado" : "descartado")}
  onEmpty={() => console.log("No hay más candidatos")}
/>
```

### Con imágenes
```tsx
<SwipeableCardStack
  cards={items.map((p) => ({ id: p.id, title: p.name, subtitle: p.role, image: p.photoUrl }))}
  onSwipe={handleDecision}
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` (`motion.div` con `drag="x"`, `useMotionValue`/`useTransform` para la rotación y la opacidad de los sellos "SÍ"/"NO", y `AnimatePresence` para la salida de cada tarjeta).
- No respeta `prefers-reduced-motion` automáticamente: el arrastre y la rotación siempre están activos. Combinalo con `usePrefersReducedMotion` si necesitás desactivarlo.

## Notas y comportamiento

- Sólo la tarjeta superior es arrastrable (`drag={top ? "x" : false}`); las de atrás son puramente decorativas (`scale: 0.95`, `y: 10`).
- El swipe se resuelve por umbral de desplazamiento horizontal: `info.offset.x > 100` aprueba, `< -100` descarta; si el arrastre queda entre medio, la tarjeta vuelve al centro por el `dragElastic={1}` (no hay snap-back explícito, es el comportamiento elástico de Framer Motion).
- Los sellos "SÍ"/"NO" son puramente visuales, atados al `x` de la tarjeta vía `useTransform` (`likeOpacity` sube entre `x: 20→120`, `nopeOpacity` baja entre `x: -120→-20`) — no son botones ni reciben foco.
- El estado de la cola es interno (`useState(initial)`); igual que `CardFan`, no se resincroniza si la prop `cards` cambia después del montaje.
- Se renderizan como máximo 3 tarjetas a la vez (`cards.slice(0, 3)`) por performance, aunque la cola tenga más — esto es invisible para el usuario porque las de más atrás no se ven de todos modos.
- Cuando la cola se vacía, se reemplaza el área de tarjetas por un placeholder con borde punteado ("No hay más tarjetas") y desaparecen los botones de acción.
- Los botones de descartar/aprobar llaman a la misma lógica de swipe que el arrastre (`swipe("left" | "right")`), así que el componente es totalmente operable sin gestos táctiles.
