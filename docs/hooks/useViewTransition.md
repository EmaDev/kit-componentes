# useViewTransition / useScreenStack

> `useViewTransition` envuelve la View Transitions API nativa con degradación limpia donde no existe. `useScreenStack` es una pila de pantallas en memoria (push/pop) construida sobre ella, con soporte del botón atrás — útil para prototipos y flujos modales sin depender de un router.

**Import**
```ts
import { useViewTransition, useScreenStack } from "lib-kit-components";
```

## Cuándo usarlo

`useViewTransition` cuando querés que un cambio de estado (cambiar de pantalla, filtrar una lista, expandir una card) anime con una transición nativa fluida en los navegadores que la soportan, sin tener que armar la animación vos mismo con `framer-motion` — y que en el resto simplemente aplique el cambio sin transición, sin romper nada.

`useScreenStack` cuando necesitás un flujo de varias "pantallas" dentro de una misma ruta (un wizard, un flujo de onboarding, una app que no usa router de verdad) con navegación tipo push/pop y que el botón atrás del navegador haga `pop` en vez de salir de la página.

## Cuándo NO usarlo / alternativas

- Si tu proyecto ya usa el App Router de Next.js con rutas reales por pantalla, usá navegación normal (`next/navigation`) en vez de `useScreenStack` — las transiciones entre rutas de Next.js son un caso de uso distinto (y más completo) que esta pila en memoria.
- Para animaciones de entrada/salida de componentes puntuales (no pantallas completas), `framer-motion` (que ya usa el resto de la librería) da mucho más control que la View Transitions API.

## Firma

```ts
function useViewTransition(): {
  transition: (update: () => void | Promise<void>, direction?: "push" | "pop" | "none") => Promise<void>;
  pending: boolean;
  supported: boolean;
}

function useScreenStack<T extends string>(initial: T): {
  current: T;
  stack: T[];
  push: (screen: T) => void;
  pop: () => void;
  depth: number;
}
```

## Parámetros

| Hook | Parámetro | Descripción |
|---|---|---|
| `useViewTransition().transition` | `update` | Función (sync o async) que aplica el cambio de estado a animar. |
| | `direction` | `"push"` \| `"pop"` \| `"none"` — se publica como `data-transition` en `<html>` mientras dura, para que tu CSS decida la dirección de la animación. |
| `useScreenStack` | `initial` | Pantalla inicial de la pila. |

## Valor de retorno

**`useViewTransition`**

| Campo | Tipo | Descripción |
|---|---|---|
| `transition` | `(update, direction?) => Promise<void>` | Ejecuta `update` envuelto en una View Transition (si hay soporte) o directo (si no). |
| `pending` | `boolean` | Hay una transición en curso. |
| `supported` | `boolean` | El navegador expone `document.startViewTransition`. |

**`useScreenStack`**

| Campo | Tipo | Descripción |
|---|---|---|
| `current` | `T` | Pantalla actualmente visible (tope de la pila). |
| `stack` | `T[]` | Pila completa. |
| `push` | `(screen: T) => void` | Agrega una pantalla, con transición `"push"` y una entrada en el historial. |
| `pop` | `() => void` | Quita la pantalla actual (no hace nada si sólo queda la inicial), con transición `"pop"`. |
| `depth` | `number` | Tamaño de la pila. |

## Ejemplos

### Animar un cambio de filtro
```tsx
const { transition } = useViewTransition();

<button onClick={() => transition(() => setFilter("activos"))}>Ver activos</button>
```

```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: 0.25s; }
```

### Flujo de onboarding con pila propia
```tsx
type Screen = "bienvenida" | "datos" | "confirmacion";

function Onboarding() {
  const { current, push, pop, depth } = useScreenStack<Screen>("bienvenida");

  return (
    <>
      {depth > 1 && <button onClick={pop}>Atrás</button>}
      {current === "bienvenida" && <Bienvenida onNext={() => push("datos")} />}
      {current === "datos" && <Datos onNext={() => push("confirmacion")} />}
      {current === "confirmacion" && <Confirmacion />}
    </>
  );
}
```

## Notas y comportamiento

- **Sin soporte de la View Transitions API** (Safari y Firefox al momento de escribir esto), `transition()` simplemente ejecuta `update()` directo, sin animación ni error — tu código de cambio de estado corre igual en todos los navegadores, sólo cambia si hay o no transición visual.
- `direction` no anima nada por sí solo: el hook sólo publica `document.documentElement.dataset.transition = "push" | "pop"` mientras dura la transición, para que **vos** definas `::view-transition-old`/`::view-transition-new` distintos según `[data-transition="push"]`/`[data-transition="pop"]` en tu CSS.
- Marcá los elementos que querés que "vuelen" entre estados con `style={{ viewTransitionName: "algo-" + id }}` — sin eso, la transición es un simple cross-fade de toda la página.
- `useScreenStack` pushea una entrada real al `history` en cada `push()`, y escucha `popstate` para hacer `pop()` cuando el usuario usa el botón atrás — a diferencia de `useBackButton` (que sólo intercepta el back para cerrar un overlay), acá el historial refleja la profundidad real de la pila.
- `pop()` no hace nada si la pila sólo tiene la pantalla inicial (`depth === 1`) — no hay forma de "pop-ear" por debajo de `initial`.
