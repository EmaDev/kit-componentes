# DiceRoller

> Lanzador de dados 3D: cubos CSS reales de seis caras que giran y caen en un valor al azar, con la cantidad elegible por el usuario.

**Import**
```tsx
import { DiceRoller } from "lib-kit-components";
import type { DiceRollerProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para tirar dados en pantalla: un juego de mesa acompañado por la app, una dinámica de grupo, un minijuego. Cada dado es un cubo 3D con puntos (no una imagen), así que el desenlace se ve y se entiende sin explicación.

## Cuándo NO usarlo / alternativas

- Si lo que necesitás es un número en un rango arbitrario (1 a 100, 1 a 20), usá [NumberGenerator](NumberGenerator.md) — este componente siempre tira dados de **6 caras**.
- Si hay que elegir una opción de una lista de textos, usá [RouletteWheel](RouletteWheel.md) o [RaffleDraw](RaffleDraw.md).
- Si es una decisión binaria, usá [CoinFlip](CoinFlip.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `min` | `number` | `1` | Cantidad **mínima de dados** que el usuario puede elegir (no el valor mínimo de la cara). |
| `max` | `number` | `6` | Cantidad **máxima de dados**. |
| `defaultCount` | `number` | `2` | Cantidad inicial de dados. Se acota a `[min, max]` al montar. |
| `size` | `number` | `64` | Tamaño de cada dado en px. Los puntos y la perspectiva se derivan de este valor. |
| `onRoll` | `(values: number[]) => void` | `undefined` | Se llama al terminar la animación con el valor de cada dado, en orden. El total es `values.reduce((a, b) => a + b, 0)`. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<DiceRoller onRoll={(values) => console.log(values)} />
```

### Un solo dado, más grande
```tsx
<DiceRoller min={1} max={1} defaultCount={1} size={96} />
```

### Sumando el total en tu propio estado
```tsx
const [total, setTotal] = useState(0);

<DiceRoller
  min={2}
  max={4}
  defaultCount={2}
  onRoll={(values) => setTotal(values.reduce((a, b) => a + b, 0))}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion`: los cubos giran con `transform: rotateX/rotateY` y `transform-style: preserve-3d`, y el rebote es un `@keyframes` inyectado en un `<style>` dentro del propio componente.
- No depende de Next.js.
- Usa los tokens `--color-border`, `--color-surface`, `--color-surface-alt`, `--color-foreground` (los puntos) y `--color-primary`.

## Notas y comportamiento

- **`min` y `max` acotan la cantidad de dados, no el valor de las caras.** Los dados son siempre de 6 caras; no hay forma de configurar un d20.
- El resultado de cada dado se sortea **antes** de animar y el ángulo se calcula para caer exactamente en esa cara, sumando 2-3 vueltas en X y 2-4 en Y. Como el giro siempre avanza en sentido positivo, la animación nunca retrocede entre tiradas.
- Cada dado arranca con 60 ms de retraso respecto al anterior y una transición un poco más larga, así que la tanda no cae toda junta. Con 6 dados la animación total ronda 1,4 s.
- `onRoll` se dispara con un `setTimeout` que **no se cancela al desmontar**: si el componente puede desaparecer durante la tirada, evitá hacer `setState` en el callback.
- Al bajar la cantidad de dados se recortan los últimos y se conservan los valores de los que quedan; al subirla, los nuevos entran mostrando `1` hasta la próxima tirada.
- El estado inicial es `1` en todos los dados (no un valor al azar), así que el total arranca en la cantidad de dados.
- El estado vive dentro del componente: la única forma de leer el resultado es `onRoll`. No hay props controladas.
- No respeta `prefers-reduced-motion`.
