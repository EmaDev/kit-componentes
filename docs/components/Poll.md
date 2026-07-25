# Poll

> Encuestas en un solo componente: opción única, múltiple, valoración con estrellas o NPS (0–10). Resultados animados con barra de progreso, estado "ya votado" y cierre de encuesta.

**Import**
```tsx
import { Poll } from "lib-kit-components";
import type { PollOption, PollKind } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para encuestas embebidas en un post, sidebar o pantalla de feedback: elegir una opción (`single`), varias hasta un máximo (`multi`), calificar con estrellas (`rating`), o medir Net Promoter Score (`nps`). El componente maneja la transición votación → resultados y el estado de "ya votaste" (`voted`).

## Cuándo NO usarlo / alternativas

- Si sólo necesitás un formulario de opción única dentro de un form tradicional (no una encuesta social con resultados en vivo), usá [Select](Select.md) o `Checkbox`/`CheckboxGroup`.
- Para reacciones simples (me gusta/no me gusta) sin resultados agregados, la fila de acciones de [SocialPost](SocialPost.md) ya lo resuelve.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `question` | `string` | — (requerido) | Pregunta principal. |
| `description` | `string` | `undefined` | Texto adicional debajo de la pregunta. |
| `options` | `PollOption[]` | `[]` | Opciones (sólo para `kind="single"`/`"multi"`). |
| `kind` | `PollKind` | `"single"` | `single`, `multi`, `rating` (1–5 estrellas) o `nps` (0–10). |
| `voted` | `string[] \| null` | `null` | Id(s) ya votados — si viene definido, la encuesta arranca directo en resultados (controlado). |
| `onVote` | `(ids: string[]) => void \| Promise<void>` | `undefined` | Se llama al votar. |
| `revealBeforeVote` | `boolean` | `false` | Muestra porcentajes de resultados **antes** de votar (sólo `single`/`multi`). |
| `closesLabel` | `string` | `undefined` | Texto de cierre (ej. `"Cierra en 2 días"`). |
| `closed` | `boolean` | `false` | Encuesta cerrada: fuerza resultados y deshabilita el voto. |
| `totalLabel` | `string` | `"votos"` | Etiqueta junto al total (ej. cambiar a "respuestas"). |
| `maxChoices` | `number` | `undefined` | Máximo de opciones elegibles en `kind="multi"`. |
| `footer` | `ReactNode` | `undefined` | Contenido adicional al pie. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
export interface PollOption {
  id: string;
  label: string;
  votes: number;
  image?: string;
  hint?: string;
}
type PollKind = "single" | "multi" | "rating" | "nps";
```

## Ejemplos

### Opción única
```tsx
<Poll
  question="¿Con qué madera armamos la próxima serie?"
  options={[{ id: "a", label: "Roble", votes: 412 }, { id: "b", label: "Pino", votes: 180 }]}
  kind="single" revealBeforeVote
  closesLabel="Cierra en 2 días" voted={myVote}
  onVote={async (ids) => await api.vote(pollId, ids)}
/>
```

### Múltiple con máximo de opciones
```tsx
<Poll question="¿Qué funciones te interesan?" kind="multi" maxChoices={2}
  options={options} onVote={handleVote} />
```

### Rating y NPS
```tsx
<Poll question="¿Cómo calificás el servicio?" kind="rating" onVote={handleVote} />
<Poll question="¿Recomendarías la app?" kind="nps" onVote={handleVote} />
```

## Requisitos / dependencias

- Usa `framer-motion` (animación de barras de resultado, estrellas, transición de opciones).
- Marcado como `"use client"`.
- Es semi-controlado: `voted` es opcional — si no lo pasás, el componente recuerda el voto localmente (`localVoted`) pero **no** lo persiste entre remounts; para persistencia real, guardá el voto vos y pasalo de vuelta en `voted`.

## Notas y comportamiento

- En `kind="rating"`/`"nps"`, las `options` que pasás se ignoran — la escala se genera internamente (1–5 estrellas o 0–10).
- `revealBeforeVote` sólo aplica a `single`/`multi`; en `rating`/`nps` no hay "resultados agregados" que revelar antes de votar (son individuales).
- Tras votar (localmente, sin esperar `voted` desde afuera), el total de votos mostrado ya incluye +1 el voto propio — si tu backend también lo cuenta, evitá pasar de nuevo el mismo total en `options` sin restar el voto local, o vas a ver un conteo duplicado transitorio hasta el próximo fetch.
- `closed={true}` fuerza resultados aunque no haya `voted`, y deshabilita cualquier interacción de voto (botones, estrellas, celdas NPS quedan `disabled`).
- El "ganador" resaltado en los resultados (`winner`) es la opción con más votos; con empate, todas las que tengan el máximo se resaltan.
