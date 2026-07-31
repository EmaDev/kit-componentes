# CoinFlip

> Moneda 3D que gira y cae en cara o cruz al azar, con etiquetas configurables.

**Import**
```tsx
import { CoinFlip } from "lib-kit-components";
import type { CoinFlipProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para una decisión binaria al azar con un desenlace visible: quién arranca, cara o cruz, sí o no. Es el más simple de los componentes de azar del kit — dos resultados, sin configuración de participantes ni de rangos.

## Cuándo NO usarlo / alternativas

- Si son **más de dos** opciones, usá [RouletteWheel](RouletteWheel.md) (elige una, opciones editables por el usuario) o [RaffleDraw](RaffleDraw.md) (elige N de una lista larga).
- Si querés un número al azar en un rango, usá [NumberGenerator](NumberGenerator.md) — no lo emules con dos monedas.
- Si el resultado tiene que quedar registrado o auditado, no alcanza con este componente: no persiste nada, sólo notifica por `onFlip`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `labels` | `[string, string]` | `["Cara", "Cruz"]` | Texto de cada cara. Es una **tupla de exactamente 2**: el primer elemento es la cara que se ve al inicio. |
| `size` | `number` | `140` | Diámetro de la moneda en px. La perspectiva 3D se calcula como `size * 5`. |
| `onFlip` | `(result: string) => void` | `undefined` | Se llama al **terminar** la animación (1,4 s) con el `label` que salió (no un índice ni un booleano). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<CoinFlip onFlip={(r) => console.log(r)} />
```

### Etiquetas propias
```tsx
<CoinFlip
  labels={["Local", "Visitante"]}
  size={180}
  onFlip={(equipo) => setQuienArranca(equipo)}
/>
```

### Comparando contra el resultado
```tsx
const [eleccion, setEleccion] = useState<"Cara" | "Cruz">("Cara");

<CoinFlip
  onFlip={(r) => toast({
    title: r === eleccion ? "¡Ganaste!" : "Perdiste",
    variant: r === eleccion ? "success" : "danger",
  })}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion`: el giro es una `transition` de CSS sobre `transform: rotateY()` con `transform-style: preserve-3d`.
- No depende de Next.js.
- Usa los tokens `--color-primary`, `--color-primary-hover` y `--color-accent` para las dos caras.

## Notas y comportamiento

- **Sin estado externo.** El resultado vive dentro del componente; la única forma de leerlo es `onFlip`.
- `Math.random() < 0.5` decide el resultado *antes* de animar, y el ángulo se calcula para caer exactamente en esa cara sumando 4 a 6 vueltas completas — la moneda siempre gira hacia adelante, nunca retrocede entre tiradas.
- `onFlip` se dispara con un `setTimeout` de 1400 ms que **no se cancela al desmontar**: si el componente puede desaparecer durante el giro (por ejemplo dentro de un `Modal` que se cierra), evitá hacer `setState` de un componente desmontado en el callback.
- Como `labels` es una tupla tipada, TypeScript rechaza `["a", "b", "c"]` y también un `string[]` genérico: castealo con `as [string, string]` si viene de una variable.
- Durante el giro el botón queda deshabilitado y muestra "Girando…"; el resultado anterior se limpia al empezar.
- El texto del resultado no tiene `aria-live`, así que no se anuncia solo a un lector de pantalla.
- La moneda es texto sobre un círculo de color, no una imagen: cambiar el arte implica envolver o reescribir el componente.
