# CardFan

> Naipes en abanico que se despliegan al pasar el mouse/tocar, con shuffle opcional y selección de una carta.

**Import**
```tsx
import { CardFan, type FanCard } from "lib-kit-components";
```

## Cuándo usarlo

Para presentar un conjunto chico de opciones (3-8) como si fueran cartas de un mazo — sorteos, "elegí una carta", selección lúdica de un premio/beneficio/categoría — donde el gesto de desplegar el abanico y elegir una carta es parte de la experiencia. El abanico se abre en hover (desktop) o con un toque que alterna abierto/cerrado (touch), y cada carta anima su rotación/posición con spring al abrirse.

## Cuándo NO usarlo / alternativas

- Si necesitás que el usuario descarte/apruebe opciones una por una con gesto de arrastre (swipe), usá [SwipeableCardStack](SwipeableCardStack.md) en vez de `CardFan` — el abanico es para elegir una sola carta de un conjunto visible, no para recorrer una cola.
- Si el contenido de cada carta necesita revelarse volteándose (front/back), usá [FlipCard](FlipCard.md) o [FlipRevealGrid](FlipRevealGrid.md) — `CardFan` sólo despliega y selecciona, no voltea.
- Para un selector de opciones convencional (sin el efecto lúdico de mazo), usá `Dropdown`, `ChipCarousel` o una grilla de `Card` — son más predecibles y accesibles por teclado.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `cards` | `FanCard[]` | — (requerido) | Cartas del abanico, en el orden que se muestran cerradas (el hueco central es el punto de simetría). |
| `onPick` | `(card: FanCard) => void` | `undefined` | Se llama al tocar/clickear una carta con la carta elegida. |
| `allowShuffle` | `boolean` | `true` | Muestra el botón "Mezclar" debajo del abanico, que reordena `cards` al azar y limpia la selección. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
interface FanCard {
  id: string;
  label: string;
  sublabel?: string;
  color?: string; // fondo CSS (gradiente o color sólido) de la carta; default degradé azul→violeta
}
```

## Ejemplos

### Básico
```tsx
<CardFan
  cards={[
    { id: "1", label: "10% OFF" },
    { id: "2", label: "Envío gratis" },
    { id: "3", label: "2x1" },
    { id: "4", label: "Sin premio", sublabel: "Seguí participando" },
  ]}
  onPick={(card) => console.log("Elegiste:", card.label)}
/>
```

### Sin shuffle, con colores custom por carta
```tsx
<CardFan
  allowShuffle={false}
  cards={[
    { id: "a", label: "A", color: "#0ea5e9" },
    { id: "b", label: "B", color: "#f59e0b" },
    { id: "c", label: "C", color: "#ef4444" },
  ]}
  onPick={handlePick}
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` (`motion.button` con `animate`/`transition` spring) para la apertura del abanico y el resaltado de la carta elegida.
- No respeta `prefers-reduced-motion` automáticamente: las animaciones de despliegue y spring corren siempre. Si tu producto necesita respetarlo, envolvé el componente condicionalmente usando el hook `usePrefersReducedMotion` de la librería.

## Notas y comportamiento

- Es de estado interno: `cards` inicializa el estado local (`useState(initial)`) y el shuffle lo modifica ahí — si el prop `cards` cambia desde afuera después del montaje inicial, el componente no lo vuelve a sincronizar (no hay `useEffect` que reaccione a cambios de la prop).
- El abanico se abre con `onMouseEnter`/`onMouseLeave` (desktop) y alterna con `onTouchStart` (touch) — en touch no hay forma de "cerrar sin elegir" salvo tocar de nuevo fuera de las cartas, ya que el área táctil es el mismo contenedor.
- El ángulo de despliegue (`spread`) se calcula como `Math.min(64, 360 / n)`, así que con muchas cartas el abanico se auto-limita a 64° totales para no verse demasiado plano ni solaparse en exceso.
- Al elegir una carta (`picked`), las demás bajan su opacidad a `0.4` y la elegida escala a `1.15` y sube su `z-index` a `50` — es un estado puramente visual, no bloquea que se elija otra carta después.
- El botón "Mezclar" reordena el array con Fisher–Yates (`shuffle`) y limpia `picked`, pero no vuelve a cerrar el abanico si ya estaba abierto.
