# FlashcardDeck

> Mazo de flashcards con progreso y calificación por tarjeta: "De nuevo" la manda al final de la cola de la sesión.

**Import**
```tsx
import { FlashcardDeck } from "lib-kit-components";
import type { FlashcardItem, FlashcardGrade } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para una sesión de repaso completa: el usuario va pasando tarjetas, se autoevalúa con cuatro niveles (De nuevo / Difícil / Bien / Fácil) y ve cuántas le quedan. Las que califica como "De nuevo" vuelven a aparecer antes de terminar la sesión.

## Cuándo NO usarlo / alternativas

- Si es **una sola** tarjeta, o querés armar tu propio flujo de repaso, usá [Flashcard](Flashcard.md).
- Si la pregunta tiene opciones para elegir y una respuesta objetivamente correcta, usá [QuizCard](QuizCard.md) — acá la corrección la hace el propio usuario.
- Si querés mostrar el dominio acumulado por materia (no una sesión), usá [ProgressByTopic](ProgressByTopic.md); para la constancia día a día, [StreakTracker](StreakTracker.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `cards` | `FlashcardItem[]` | — (requerido) | Tarjetas del mazo. Define la cola inicial **al montar** (ver notas). |
| `onGrade` | `(id: string, grade: FlashcardGrade) => void` | `undefined` | Se llama en cada calificación, con el id de la tarjeta y la nota. Es el gancho para guardar el repaso en tu backend. |
| `onComplete` | `() => void` | `undefined` | Se llama al vaciarse la cola (última tarjeta calificada con algo distinto de `"again"`). |
| `height` | `number` | `260` | Alto de la tarjeta en px. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface FlashcardItem {
  id: string;
  front: React.ReactNode;
  back: React.ReactNode;
  tag?: string;
}

type FlashcardGrade = "again" | "hard" | "good" | "easy";
```

## Ejemplos

### Uso básico
```tsx
const CARDS: FlashcardItem[] = [
  { id: "1", tag: "Historia", front: "¿Año de la independencia argentina?", back: "1816" },
  { id: "2", tag: "Historia", front: "¿Quién fue el primer presidente?", back: "Bernardino Rivadavia" },
];

<FlashcardDeck cards={CARDS} />
```

### Guardando cada repaso para repetición espaciada real
```tsx
<FlashcardDeck
  cards={cards}
  onGrade={(id, grade) => api.registrarRepaso({ cardId: id, grade, at: Date.now() })}
  onComplete={() => track("deck_completado")}
/>
```

### Mazo que se recarga al cambiar de materia
```tsx
<FlashcardDeck key={materiaId} cards={cardsDeLaMateria} />
```

La `key` es necesaria: sin ella, cambiar `cards` no reinicia la cola (ver notas).

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (`AnimatePresence` para la entrada/salida de cada tarjeta, `motion.div` para el flip y la barra de progreso).
- No depende de Next.js.
- Usa los tokens `--color-primary`, `--color-danger`, `--color-accent`, `--color-success`, `--color-border`, `--color-surface` y `--color-surface-alt` (los cuatro botones de calificación toman su color de `--color-<tone>`).

## Notas y comportamiento

- **No implementa repetición espaciada.** SM-2 y variantes necesitan persistencia entre sesiones: `onGrade` te da la calificación para que la guardes y calcules el próximo repaso en tu backend. Lo único que hace localmente es reordenar la cola de **esta** sesión.
- **La cola se arma una sola vez, al montar** (`useState(() => cards.map(c => c.id))`). Si `cards` cambia después, el contenido de las tarjetas ya en cola se actualiza, pero las tarjetas nuevas **no se agregan** y las eliminadas dejan huecos que se renderizan vacíos. Para recargar el mazo, remontalo con una `key` distinta.
- `"again"` manda la tarjeta al final de la cola y **no** la cuenta como aprendida; las otras tres notas la sacan de la cola y suman al contador `aprendidas`. Los cuatro botones son idénticos en efecto salvo `"again"`: `hard`, `good` y `easy` sólo se diferencian en lo que reportás por `onGrade`.
- `onComplete` se dispara cuando se califica la última de la cola con algo distinto de `"again"`. Si el mazo llega vacío (`cards: []`), muestra la pantalla de "¡Mazo terminado!" desde el arranque y **no** llama a `onComplete`.
- "Repasar de nuevo" (en la pantalla final) reinicia la cola desde `cards` y pone el contador en cero.
- Los botones de calificación **sólo aparecen con la tarjeta dada vuelta**: hasta entonces se ve el texto "Dala vuelta para calificar qué tan bien la sabías".
- La tarjeta es un `<button>` (para que responda a teclado), así que no metas elementos interactivos dentro de `front`/`back`.
- Las dos caras están siempre en el DOM: la respuesta es visible con las herramientas de desarrollo aunque no esté a la vista.
- Los ids tienen que ser únicos dentro de `cards`: se usan como clave de la cola y de `AnimatePresence`. Ids duplicados hacen que la misma tarjeta se resuelva dos veces.
- `height` es fijo; contenido más largo se desborda.
