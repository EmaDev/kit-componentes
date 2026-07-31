# Flashcard

> Tarjeta de memorización suelta: se da vuelta en 3D entre pregunta y respuesta.

**Import**
```tsx
import { Flashcard } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para **una** tarjeta de estudio: un concepto que se muestra en una pantalla de detalle, una tarjeta de ejemplo en un onboarding, o cuando querés construir tu propio flujo de repaso y sólo necesitás la pieza visual del flip.

## Cuándo NO usarlo / alternativas

- Si son varias tarjetas seguidas con progreso y calificación, usá [FlashcardDeck](FlashcardDeck.md) — ya trae la cola, la barra de progreso y los cuatro botones de calificación.
- Si la pregunta tiene opciones para elegir (no una respuesta a auto-evaluar), usá [QuizCard](QuizCard.md).
- Si el flip es decorativo y el contenido no es una pregunta/respuesta de estudio (una tarjeta de crédito, una ficha de producto), usá [FlipCard](FlipCard.md), que es el componente genérico de volteo.
- Si el juego es emparejar término con definición, usá [MatchingPairs](MatchingPairs.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `front` | `React.ReactNode` | — (requerido) | Cara visible al inicio (la pregunta). |
| `back` | `React.ReactNode` | — (requerido) | Cara de atrás (la respuesta). |
| `tag` | `string` | `undefined` | Etiqueta chica en la cara frontal (ej. "Vocabulario"). Sólo texto. |
| `flipped` | `boolean` | `undefined` | Estado controlado. Si se pasa, manda sobre el estado interno. |
| `onFlip` | `(flipped: boolean) => void` | `undefined` | Se llama en cada volteo con el nuevo estado. |
| `height` | `number` | `240` | Alto de la tarjeta en px. Fijo: el contenido no la agranda. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico (no controlado)
```tsx
<Flashcard
  tag="Vocabulario"
  front="¿Cómo se dice «casa» en portugués?"
  back="Casa"
/>
```

### Controlada desde afuera
```tsx
const [flipped, setFlipped] = useState(false);

<Flashcard
  front={pregunta}
  back={respuesta}
  flipped={flipped}
  onFlip={setFlipped}
/>

<Button onClick={() => setFlipped(false)}>Ocultar respuesta</Button>
```

### Con contenido enriquecido
```tsx
<Flashcard
  height={320}
  tag="Fórmulas"
  front={<span>¿Cuál es la derivada de <code>x²</code>?</span>}
  back={<div className="space-y-2"><p className="text-2xl">2x</p><p className="text-xs">Regla de la potencia.</p></div>}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (el volteo es un `motion.div` con `rotateY` y transición spring).
- No depende de Next.js.
- Usa los tokens `--color-border`, `--color-surface`, `--color-primary` y `--color-muted`.

## Notas y comportamiento

- **La tarjeta entera es un `<button>`.** Por eso funciona con click, `Enter` y `Espacio`, y expone `aria-pressed`. La contra: **no metas elementos interactivos** (botones, links, inputs) dentro de `front` o `back` — HTML anidado inválido y comportamiento impredecible.
- Controlada vs no controlada: el estado visible es `flipped ?? interno`. Al pasar `flipped`, el componente igual actualiza su estado interno en cada click, pero éste queda ignorado mientras la prop esté presente. Si pasás `flipped` y no actualizás nada en `onFlip`, la tarjeta no se da vuelta.
- El texto "Tocá para ver la respuesta" está fijo en la cara frontal y no es configurable.
- `height` es fijo y el contenido no lo estira: contenido largo se desborda de la tarjeta. Subí `height` si la respuesta es extensa.
- Sin límite de caracteres ni truncado: el texto se centra vertical y horizontalmente en ambas caras.
- No respeta `prefers-reduced-motion`; si te importa, condicioná el uso con [`usePrefersReducedMotion`](../hooks/useMediaQuery.md).
- Las dos caras están siempre montadas (`backface-visibility: hidden`), así que el contenido de la respuesta está en el DOM aunque no se vea — no lo uses para ocultar información sensible.
