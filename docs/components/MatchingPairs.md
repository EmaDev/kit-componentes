# MatchingPairs

> Juego de emparejar: se eligen dos tarjetas y, si son el término y la definición de la misma pareja, quedan fijas en verde.

**Import**
```tsx
import { MatchingPairs } from "lib-kit-components";
import type { MatchPair } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para practicar asociaciones: término ↔ definición, palabra ↔ traducción, concepto ↔ ejemplo. Todas las tarjetas están visibles desde el arranque (no es un juego de memoria), así que ejercita la relación entre conceptos y no la memoria visual.

## Cuándo NO usarlo / alternativas

- Si las tarjetas tienen que estar **tapadas** y el juego es recordar dónde estaba cada una, usá [FlipRevealGrid](FlipRevealGrid.md) — ese es el memotest.
- Si es una pregunta con opciones y una respuesta correcta, usá [QuizCard](QuizCard.md).
- Si es repaso de pregunta/respuesta de a una, usá [Flashcard](Flashcard.md) o [FlashcardDeck](FlashcardDeck.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `pairs` | `MatchPair[]` | — (requerido) | Parejas a emparejar. Genera `pairs.length * 2` tarjetas. **Pasá una referencia estable** (ver notas). |
| `onComplete` | `() => void` | `undefined` | Se llama al emparejar la última pareja. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface MatchPair {
  id: string;
  term: string;
  definition: string;
}
```

## Ejemplos

### Uso básico
```tsx
const PAIRS: MatchPair[] = [
  { id: "1", term: "Fotosíntesis", definition: "Conversión de luz en energía química en las plantas" },
  { id: "2", term: "Mitosis", definition: "División celular que produce dos células idénticas" },
  { id: "3", term: "Osmosis", definition: "Paso de un solvente a través de una membrana semipermeable" },
];

<MatchingPairs pairs={PAIRS} onComplete={() => track("match_done")} />
```

Definí `PAIRS` **fuera del componente** (o con `useMemo`): un array literal inline se remezcla en cada render.

### Con parejas que vienen del backend
```tsx
const pairs = useMemo(
  () => tema.conceptos.map((c) => ({ id: c.id, term: c.nombre, definition: c.descripcion })),
  [tema],
);

<MatchingPairs pairs={pairs} onComplete={completarEjercicio} />
```

### Reiniciando el ejercicio desde afuera
```tsx
const [intento, setIntento] = useState(0);

<MatchingPairs key={intento} pairs={pairs} />
<Button onClick={() => setIntento((n) => n + 1)}>Nuevo intento</Button>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (`motion.button` para el shake de la pareja incorrecta).
- No depende de Next.js.
- Usa los tokens `--color-success`, `--color-danger`, `--color-primary`, `--color-border`, `--color-surface` y `--color-surface-alt`.

## Notas y comportamiento

- **La referencia de `pairs` importa.** El mezclado está en un `useMemo` con `[pairs]` como dependencia: si le pasás un array literal inline, cambia de identidad en cada render del padre y **las tarjetas se remezclan en el medio del juego**. Definilo fuera del componente o memoizalo.
- Todas las tarjetas (términos y definiciones) están mezcladas en una sola grilla de 2 columnas y **el texto está visible desde el arranque**. No es un juego de memoria: es de asociación.
- Se eligen dos tarjetas por intento. Si son la misma pareja **y de tipo distinto** (un término y una definición), quedan verdes a los 300 ms; si no, ambas se ponen rojas con un shake y se limpian a los 550 ms. Elegir los dos términos de la misma pareja cuenta como error.
- El contador de "intentos" sube al elegir la segunda tarjeta, tanto en aciertos como en errores.
- **"Reintentar" no remezcla las tarjetas**: limpia lo emparejado, los intentos y la selección, pero la distribución de la grilla queda igual. Para una distribución nueva, remontá con una `key` distinta (ver ejemplo).
- Los ids tienen que ser únicos: se derivan a `"<id>-t"` y `"<id>-d"` para cada tarjeta. Ids repetidos rompen la lógica de emparejado.
- No hay límite de parejas, pero la grilla es siempre de 2 columnas: con muchas parejas la lista se vuelve muy larga. Un ejercicio de 4 a 8 parejas es lo usable.
- `term` y `definition` son `string`, no `ReactNode`: no admiten markup.
- Los `setTimeout` de acierto y error no se cancelan al desmontar.
- No hay temporizador ni puntaje más allá del conteo de intentos, y nada se persiste.
