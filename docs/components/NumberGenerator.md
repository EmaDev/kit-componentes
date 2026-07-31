# NumberGenerator

> Número al azar dentro de un rango que el usuario edita, con efecto de conteo y las últimas 10 tiradas.

**Import**
```tsx
import { NumberGenerator } from "lib-kit-components";
import type { NumberGeneratorProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando el resultado que hace falta es **un número**, no una opción de una lista: un valor entre 1 y 100, un dado de 20 caras, la posición de una rifa numerada. El rango es editable en vivo, así que sirve como herramienta genérica sin tener que recompilar nada.

## Cuándo NO usarlo / alternativas

- Si las opciones son textos (nombres, comidas, tareas), usá [RouletteWheel](RouletteWheel.md) o [RaffleDraw](RaffleDraw.md) — un número que después mapeás a mano a una lista es peor experiencia.
- Si son sólo dos resultados, usá [CoinFlip](CoinFlip.md).
- Si el usuario tiene que **elegir** un número (no sortearlo), usá [Input](Input.md) con `type="number"` o [DualRangeSlider](DualRangeSlider.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultMin` | `number` | `1` | Mínimo inicial del rango (inclusive). Valor **inicial**: el usuario lo puede cambiar y los cambios posteriores de la prop no se reflejan. |
| `defaultMax` | `number` | `100` | Máximo inicial del rango (inclusive). Mismo comportamiento que `defaultMin`. |
| `onGenerate` | `(n: number) => void` | `undefined` | Se llama al terminar el efecto de conteo, con el número definitivo. No se llama con los valores intermedios de la animación. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<NumberGenerator onGenerate={(n) => console.log(n)} />
```

### Dado de 20 caras
```tsx
<NumberGenerator defaultMin={1} defaultMax={20} onGenerate={aplicarTirada} />
```

### Sorteo de una rifa numerada
```tsx
<NumberGenerator
  defaultMin={1}
  defaultMax={totalDeRifas}
  onGenerate={(n) => setGanador(rifas.find((r) => r.numero === n))}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion` ni Next.js: el efecto de conteo son 10 `setTimeout` encadenados que van desacelerando.
- Usa los tokens del tema (`--color-primary`, `--color-foreground`, `--color-muted`, `--color-border`).

## Notas y comportamiento

- **El rango es interno y editable por el usuario.** No hay props `min`/`max` controladas ni callback al cambiarlo: si necesitás fijar el rango, envolvé el componente o usá `key` para remontarlo con otros valores por defecto.
- **`min` tiene que ser estrictamente menor que `max`**: con `min >= max` el botón queda deshabilitado y no genera nada. Un rango de un solo valor (`5` a `5`) no funciona.
- El resultado es `Math.floor(Math.random() * (max - min + 1)) + min` — ambos extremos incluidos, sin sesgo.
- El número final se sortea **antes** de la animación; los ~10 valores que parpadean son decorativos y no pasan por `onGenerate`.
- Los inputs de mínimo y máximo son `type="number"` sin validación: escribir texto o vaciarlos produce `Number("") === 0`, y valores negativos o invertidos simplemente deshabilitan el botón.
- El historial guarda las **últimas 10** tiradas (la más reciente primero) y se muestra como texto plano. No hay forma de limpiarlo ni de leerlo desde afuera.
- El total de la animación es de ~0,9 s (10 pasos que van de 40 ms a ~130 ms). No se cancela al desmontar.
