# QuizCard

> Pregunta de opción múltiple con feedback inmediato: marca la correcta, la elegida si erró, y muestra una explicación opcional.

**Import**
```tsx
import { QuizCard } from "lib-kit-components";
import type { QuizOption } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para evaluar con una respuesta objetivamente correcta: un cuestionario de un curso, un test de conocimiento, la validación de un módulo de onboarding. El componente corrige solo y bloquea las opciones después de responder, así que no se puede cambiar la respuesta.

## Cuándo NO usarlo / alternativas

- Si la respuesta la evalúa el propio usuario (no hay una opción correcta que el sistema conozca), usá [Flashcard](Flashcard.md) o [FlashcardDeck](FlashcardDeck.md).
- Si querés **medir opinión** en vez de corregir, usá [Poll](Poll.md) — muestra porcentajes de votos y soporta múltiple, estrellas y NPS.
- Si es un formulario donde la respuesta se guarda y se puede cambiar antes de enviar, usá [Checkbox](Checkbox.md) o [Select](Select.md).
- Si el ejercicio es completar huecos o emparejar, usá [MatchingPairs](MatchingPairs.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `question` | `string` | — (requerido) | Enunciado. Sólo texto (no `ReactNode`). |
| `options` | `QuizOption[]` | — (requerido) | Opciones a elegir. |
| `correctId` | `string` | — (requerido) | `id` de la opción correcta. |
| `explanation` | `string` | `undefined` | Texto que aparece **después** de responder, en un bloque gris. |
| `index` | `number` | `undefined` | Índice de la pregunta, **base 0** (se muestra como `index + 1`). Requiere `total` para verse. |
| `total` | `number` | `undefined` | Cantidad total de preguntas. Requiere `index` para verse. |
| `onAnswer` | `(id: string, correct: boolean) => void` | `undefined` | Se llama al elegir una opción, con el id elegido y si fue correcta. |
| `onNext` | `() => void` | `undefined` | Si se pasa, aparece el botón "Siguiente" una vez respondida. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface QuizOption {
  id: string;
  label: string;
}
```

## Ejemplos

### Uso básico
```tsx
<QuizCard
  question="¿Cuál es la capital de Australia?"
  options={[
    { id: "a", label: "Sídney" },
    { id: "b", label: "Canberra" },
    { id: "c", label: "Melbourne" },
  ]}
  correctId="b"
  explanation="Canberra es la capital; Sídney es la ciudad más poblada."
  onAnswer={(id, ok) => console.log(id, ok)}
/>
```

### Cuestionario de varias preguntas
```tsx
const [i, setI] = useState(0);
const [aciertos, setAciertos] = useState(0);
const q = PREGUNTAS[i];

<QuizCard
  key={q.id}                      // ← imprescindible: resetea el estado interno
  question={q.question}
  options={q.options}
  correctId={q.correctId}
  explanation={q.explanation}
  index={i}
  total={PREGUNTAS.length}
  onAnswer={(_, ok) => ok && setAciertos((a) => a + 1)}
  onNext={() => setI((n) => n + 1)}
/>
```

### Sin botón "Siguiente" (una sola pregunta)
```tsx
<QuizCard question={q} options={opts} correctId="a" />
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (`motion.button` para el tap de cada opción, `motion.p` para la entrada de la explicación).
- No depende de Next.js.
- Usa los tokens `--color-success`, `--color-danger`, `--color-primary`, `--color-border`, `--color-surface` y `--color-surface-alt`.

## Notas y comportamiento

- **El estado de "respondida" es interno y no se reinicia solo.** `onNext` no lo limpia: si reutilizás la misma instancia para la siguiente pregunta, va a seguir mostrándose contestada. **Pasá una `key` distinta por pregunta** para que React la remonte (ver ejemplo).
- Una vez elegida una opción no se puede cambiar: todas quedan deshabilitadas. No hay prop para permitir reintentos.
- Al responder: la correcta se pinta en verde (siempre, incluso si el usuario erró) y la elegida equivocada en rojo; el resto baja a opacidad 60%.
- `index` es **base 0**. Con `index={0} total={5}` se lee "Pregunta 1 de 5". El contador aparece sólo si **ambas** props son números.
- Si `correctId` no coincide con ningún `id` de `options`, cualquier respuesta se marca como incorrecta y ninguna opción se pinta en verde.
- `question` y `explanation` son `string`, no `ReactNode`: no admiten fórmulas ni markup. Para eso hay que envolver el componente.
- El botón "Siguiente" sólo aparece si pasaste `onNext` **y** ya se respondió.
- El resultado ("Correcto"/"Incorrecto") se muestra como texto en el header, sin `aria-live`: no se anuncia automáticamente a un lector de pantalla.
- No hay estado de "sin responder aún" expuesto hacia afuera: si necesitás saberlo, seguí `onAnswer` desde el componente padre.
