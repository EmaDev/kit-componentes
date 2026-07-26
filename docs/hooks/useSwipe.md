# useSwipe

> Gestos de swipe (izquierda/derecha/arriba/abajo) sobre cualquier elemento, listos para pegar como props de puntero. Distingue el eje dominante del gesto, así no se pelea con el scroll vertical nativo.

**Import**
```ts
import { useSwipe, type SwipeDirection } from "lib-kit-components";
```

## Cuándo usarlo

Para acciones de swipe sobre tarjetas, filas de lista o carruseles propios: descartar una notificación deslizando, avanzar/retroceder en una galería, o revelar acciones (archivar/eliminar) al arrastrar una fila. Devuelve un objeto de handlers listo para spread directo — no agrega ningún wrapper ni markup.

## Cuándo NO usarlo / alternativas

- `Carousel`, `ImageZoom`, `PullToRefresh` y `Snackbar` ya implementan su propia lógica de gestos internamente — no hace falta (ni conviene) envolverlos con `useSwipe`.

## Firma

```ts
function useSwipe(options?: {
  threshold?: number;
  velocity?: number;
  onSwipe?: (dir: SwipeDirection, distance: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}): {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  onPointerCancel: () => void;
}

type SwipeDirection = "left" | "right" | "up" | "down";
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `threshold` | `number` | `50` | px mínimos de desplazamiento para contar como swipe. |
| `velocity` | `number` | `0.3` | px/ms mínimos — un flick corto y rápido también cuenta, aunque no llegue al `threshold` de distancia. |
| `onSwipe` | `(dir, distance) => void` | `undefined` | Se llama con cualquier swipe detectado, más la distancia recorrida en px. |
| `onSwipeLeft` / `onSwipeRight` / `onSwipeUp` / `onSwipeDown` | `() => void` | `undefined` | Atajos por dirección — se llaman **además** de `onSwipe`. |

## Ejemplos

### Descartar una tarjeta con swipe
```tsx
function DismissableCard({ onDismiss, children }: Props) {
  const swipe = useSwipe({ onSwipeLeft: onDismiss, onSwipeRight: onDismiss });
  return <div {...swipe} className="rounded-xl bg-surface p-4">{children}</div>;
}
```

### Navegar una galería propia
```tsx
const swipe = useSwipe({
  onSwipe: (dir) => {
    if (dir === "left") next();
    if (dir === "right") prev();
  },
});

<div {...swipe} className="aspect-video">{/* slide actual */}</div>
```

## Notas y comportamiento

- El eje se decide comparando `|dx|` vs `|dy|` al soltar: **sólo se evalúa el eje con mayor desplazamiento absoluto** — un gesto predominantemente vertical nunca dispara `onSwipeLeft`/`onSwipeRight`, aunque haya tenido algo de movimiento horizontal, y viceversa.
- Un swipe cuenta si supera `threshold` en distancia **o** `velocity` en velocidad — esto permite que un flick corto pero rápido (típico de "pasar la página" con el pulgar) se detecte igual que un arrastre largo y lento.
- El hook no previene el scroll nativo por sí mismo (no llama a `preventDefault`) — si lo usás sobre un contenedor scrolleable, el swipe y el scroll del navegador conviven; para bloquear el scroll mientras se arrastra necesitás manejarlo vos (por ejemplo, con `touch-action: pan-y` en CSS si sólo querés swipes horizontales).
- No hay feedback visual de arrastre en vivo (el elemento no "sigue" al dedo mientras se mueve) — el hook sólo evalúa la distancia total al soltar (`onPointerUp`), no la posición intermedia. Si necesitás una tarjeta que se mueve junto con el dedo, combinalo con tu propio estado de `x`/`y` en `onPointerMove`, o usá `drag` de `framer-motion` directamente.
