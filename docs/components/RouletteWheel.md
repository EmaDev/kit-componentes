# RouletteWheel

> Ruleta con opciones editables por el usuario: gajos generados con `conic-gradient`, puntero fijo arriba y giro aleatorio sin sesgo.

**Import**
```tsx
import { RouletteWheel } from "lib-kit-components";
import type { RouletteWheelProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando hay que **elegir una** opción al azar entre varias que el propio usuario define en el momento: qué comemos hoy, a quién le toca, qué actividad hacemos. La rueda editable es la clave: no requiere que las opciones vengan del código, y el usuario ve el resultado con un desenlace animado que se siente justo.

## Cuándo NO usarlo / alternativas

- Si hay que elegir **varios** ganadores de una lista larga (y opcionalmente sin repetir), usá [RaffleDraw](RaffleDraw.md) — la ruleta elige uno por giro y se vuelve ilegible con muchos gajos.
- Si son sólo dos opciones binarias (sí/no, quién arranca), [CoinFlip](CoinFlip.md) es más directo.
- Si querés un número en un rango en vez de una opción de una lista, usá [NumberGenerator](NumberGenerator.md).
- Si hay que repartir a *todos* los participantes en grupos, usá [TeamShuffler](TeamShuffler.md).
- Si la selección **no** es al azar (el usuario elige), esto no es un selector: usá [Select](Select.md) o [Dropdown](Dropdown.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultOptions` | `string[]` | `["Opción 1", "Opción 2", "Opción 3", "Opción 4"]` | Opciones iniciales. Es un valor **inicial**: los cambios posteriores a esta prop no se reflejan (ver notas). |
| `allowEdit` | `boolean` | `true` | Muestra el panel de edición debajo de la rueda para agregar, renombrar y quitar opciones. |
| `size` | `number` | `280` | Diámetro de la rueda en px. |
| `onResult` | `(option: string, index: number) => void` | `undefined` | Se llama al **terminar** la animación (~3,2 s), con la opción sorteada y su índice. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<RouletteWheel
  defaultOptions={["Pizza", "Sushi", "Empanadas", "Hamburguesas"]}
  onResult={(option, index) => console.log(option, index)}
/>
```

### Rueda fija, sin que el usuario cambie las opciones
```tsx
<RouletteWheel
  defaultOptions={PREMIOS}
  allowEdit={false}
  size={320}
  onResult={(premio) => registrarPremio(premio)}
/>
```

### Encadenada con confeti
```tsx
const [ganador, setGanador] = useState<string | null>(null);

<div className="relative">
  <RouletteWheel defaultOptions={opciones} onResult={setGanador} />
  <Confetti fire={ganador !== null} mode="center" />
</div>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion`: el giro es una `transition` de CSS sobre `transform`.
- No depende de Next.js.
- Los colores de los gajos se derivan en `oklch()` (soportado por todos los navegadores modernos); el resto usa los tokens del tema (`--color-foreground`, `--color-surface-alt`).

## Notas y comportamiento

- **Componente no controlado.** `defaultOptions` sólo alimenta el estado inicial (`useState(defaultOptions)`); si cambiás la prop después, la rueda no se actualiza. Para forzar un reinicio, remontalo con una `key` distinta.
- El sorteo es `Math.random()` sobre el índice, sin sesgo, y **el ángulo se calcula a partir del ganador ya elegido** — no se mide dónde cayó la rueda. La animación siempre gira hacia adelante (4 a 6 vueltas completas más el resto exacto para dejar el gajo bajo el puntero fijo), así que nunca retrocede ni salta.
- `onResult` se dispara con un `setTimeout` de 3200 ms, alineado con la transición CSS de 3,1 s. Si el componente se desmonta antes, el timeout no se cancela: evitá hacer `setState` sobre un componente ya desmontado en el callback.
- Se necesitan **al menos 2 opciones** para girar; con menos, el botón queda deshabilitado y se muestra "Agregá al menos 2 opciones". El botón de quitar se deshabilita al llegar a 2.
- No hay límite superior de opciones, pero las etiquetas sobre los gajos se truncan (`max-w-[38%]`) y con muchas opciones dejan de ser legibles: el panel de edición sigue siendo la referencia real.
- El color de cada gajo es determinístico según su posición (`hue` derivado del primary de marca, alternando dos luminosidades). Al quitar una opción del medio, los colores de las que siguen se corren.
- Editar o quitar una opción borra el ganador mostrado; renombrar, no.
- Sin `aria-live`: el resultado aparece como texto pero no se anuncia a un lector de pantalla.
