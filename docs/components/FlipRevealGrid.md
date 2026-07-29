# FlipRevealGrid

> Grilla de cartas que se dan vuelta en 3D — reveal simple (una vez) o modo memoria (encontrar pares).

**Import**
```tsx
import { FlipRevealGrid, type FlipItem } from "lib-kit-components";
```

## Cuándo usarlo

Para juegos/mecánicas de descubrimiento sobre una grilla de N cartas: revelar contenido oculto tocando cada carta (premios, respuestas, imágenes sorpresa) o, con `memoryMode`, un juego de memoria clásico donde hay que encontrar los dos elementos con el mismo `matchKey`. Cada carta se da vuelta con una rotación 3D (`rotateY`) mostrando un reverso genérico y, al voltearse, el contenido (`front` + `label` opcional).

## Cuándo NO usarlo / alternativas

- Si sólo necesitás **una** tarjeta que se voltea (no una grilla), usá [FlipCard](FlipCard.md) directamente — `FlipRevealGrid` está pensado para múltiples cartas con lógica de grilla/memoria, no para un flip puntual.
- Si el contenido todavía no cargó y querés un placeholder de carga (no un juego de descubrimiento), usá [Skeleton](Skeleton.md)/[SkeletonCard](Skeleton.md) — `FlipRevealGrid` no es un estado de loading, sino una interacción deliberada del usuario.
- Si necesitás mostrar un skeleton morfeando al contenido real ya cargado, usá [SkeletonMorph](SkeletonMorph.md) — no tiene relación con el flip de `FlipRevealGrid`, que siempre parte de un reverso decorativo fijo, no de un placeholder de carga.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `FlipItem[]` | — (requerido) | Cartas de la grilla. |
| `columns` | `number` | `4` | Cantidad de columnas del grid CSS. |
| `memoryMode` | `boolean` | `false` | Si es `true`, activa la lógica de juego de memoria: sólo se pueden tener 2 cartas volteadas a la vez, y hacen match si comparten `matchKey`. Si es `false`, cada carta se voltea de forma independiente y permanente al tocarla (modo reveal simple). |
| `onMatch` | `(a: FlipItem, b: FlipItem) => void` | `undefined` | Sólo en `memoryMode`: se llama cuando dos cartas volteadas hacen match. |
| `onComplete` | `() => void` | `undefined` | Sólo en `memoryMode`: se llama cuando ya se encontraron todos los pares. |
| `className` | `string` | `""` | Clases adicionales del contenedor grid. |

## Tipos exportados

```ts
interface FlipItem {
  id: string;
  matchKey: string;   // usado sólo en memoryMode para determinar pares
  front: React.ReactNode; // contenido mostrado al voltear la carta
  label?: string;
}
```

## Ejemplos

### Reveal simple (sin modo memoria)
```tsx
<FlipRevealGrid
  columns={3}
  items={premios.map((p) => ({ id: p.id, matchKey: p.id, front: <span>{p.emoji}</span>, label: p.nombre }))}
/>
```

### Modo memoria (encontrar pares)
```tsx
<FlipRevealGrid
  memoryMode
  columns={4}
  items={cartas} // 8 items, 4 matchKey distintos repetidos en pares
  onMatch={(a, b) => console.log("Match:", a.label, b.label)}
  onComplete={() => console.log("¡Completado!")}
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- No usa `framer-motion`: la rotación 3D es CSS puro (`transition-transform duration-500`, `[perspective:800px]`, `[backface-visibility:hidden]`).
- No respeta `prefers-reduced-motion` automáticamente: la transición CSS de 500ms siempre corre. Si necesitás desactivarla, controlalo por fuera con `usePrefersReducedMotion` (ej. reduciendo `duration` vía una clase condicional).

## Notas y comportamiento

- En `memoryMode`, mientras se evalúa un par (`busy === true`, ventana de 700ms via `setTimeout`), no se pueden voltear más cartas — evita romper el estado tocando una tercera carta antes de que se resuelva el par actual.
- Si el par no matchea, ambas cartas vuelven a su reverso automáticamente después de los 700ms; si matchea, quedan fijas boca arriba (`matched`) y se deshabilitan (`disabled={matched.includes(item.id)}`).
- En modo reveal simple (`memoryMode={false}`), una vez volteada una carta no se puede volver a tapar — no hay toggle, `flipped` sólo crece.
- `onComplete` se dispara comparando `newMatched.length === items.length`, así que `items` debe tener una cantidad par de elementos con `matchKey` correctamente emparejados para que el juego termine; si hay un número impar o un `matchKey` sin pareja, nunca se completa.
- Las cartas son `<button>` reales (con `disabled` cuando ya matchearon), así que son operables por teclado/foco por defecto sin trabajo adicional.
