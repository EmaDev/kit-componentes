# RaffleDraw

> Herramienta de sorteos: lista de participantes editable, N ganadores por tanda, animación tipo tómbola y opción de no repetir.

**Import**
```tsx
import { RaffleDraw } from "lib-kit-components";
import type { RaffleDrawProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para sortear **varios** ganadores de una lista que puede ser larga: un giveaway de redes, premios en un evento, el orden de exposición de un curso. Los participantes se cargan pegando texto (un nombre por línea), se pueden editar antes de sortear, y el reel muestra un desenlace por ganador para que se sienta transparente.

## Cuándo NO usarlo / alternativas

- Si hay que elegir **una sola** opción de una lista corta que el usuario define en el momento, [RouletteWheel](RouletteWheel.md) es más vistoso y más claro.
- Si son sólo dos opciones, usá [CoinFlip](CoinFlip.md).
- Si el objetivo es repartir a **todos** los participantes (no elegir algunos), usá [TeamShuffler](TeamShuffler.md).
- Si el resultado tiene consecuencias legales o hay que auditarlo, el sorteo tiene que hacerse en el backend: acá `Math.random()` corre en el cliente y el usuario puede repetir la tanda hasta que le guste.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultEntries` | `string[]` | `[]` | Participantes iniciales. Valor **inicial**: los cambios posteriores a la prop no se reflejan. |
| `maxWinners` | `number` | `20` | Techo del selector "Ganadores a elegir". El máximo real es `Math.min(maxWinners, cantidad de participantes)`. |
| `onDraw` | `(winners: string[]) => void` | `undefined` | Se llama al terminar cada tanda con el listado **acumulado** de ganadores (los de esta tanda y los de las anteriores), no sólo los nuevos. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<RaffleDraw
  defaultEntries={["Ana", "Bruno", "Carla", "Diego"]}
  onDraw={(winners) => console.log(winners)}
/>
```

### Con la lista cargada desde el backend
```tsx
const { data: inscriptos } = useCachedFetch<string[]>("/api/inscriptos");

{inscriptos && (
  <RaffleDraw
    defaultEntries={inscriptos}
    maxWinners={3}
    onDraw={(winners) => api.registrarGanadores(winners)}
  />
)}
```

Renderizalo recién cuando llegan los datos: como `defaultEntries` sólo se lee al montar, si lo montás con `[]` la lista queda vacía para siempre.

### Sólo los ganadores nuevos de la última tanda
```tsx
const previos = useRef<string[]>([]);

<RaffleDraw
  defaultEntries={entries}
  onDraw={(todos) => {
    const nuevos = todos.slice(previos.current.length);
    previos.current = todos;
    notificar(nuevos);
  }}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion` ni Next.js: el reel usa `setTimeout` y dos `@keyframes` inyectados en un `<style>` dentro del propio componente.
- Usa los tokens del tema (`--color-primary`, `--color-surface`, `--color-border`, `--color-danger`).

## Notas y comportamiento

- **No controlado**: `defaultEntries` alimenta el estado interno una sola vez, al montar. Para recargar la lista, remontá el componente con una `key` distinta.
- **"No repetir ganadores" (activo por default) modifica la lista de participantes**: cada elegido sale del bolillero y desaparece de los chips de arriba. Al desactivarlo, la misma persona puede salir varias veces en una tanda.
- El sorteo es `Math.random()` sobre el índice del pool restante, sin sesgo. Los ~16 nombres que parpadean en el reel son decorativos: el ganador ya está elegido cuando arranca la animación.
- Cada ganador tarda ~1,9 s (16 ticks que van desacelerando + 350 ms de asentado + 200 ms de pausa). Sortear 10 ganadores lleva casi 20 segundos, con el botón deshabilitado todo ese tiempo.
- `onDraw` se llama **una vez por tanda**, al final, no por ganador. Recibe el acumulado — si querés los nuevos, compará contra lo que ya tenías (ver ejemplo).
- Los `setTimeout` del reel no se cancelan al desmontar: si el componente puede desaparecer durante un sorteo (dentro de un `Modal`, por ejemplo), esperá a que termine antes de cerrarlo.
- "Reiniciar" (en el panel de ganadores) limpia la lista de ganadores pero **no devuelve a nadie al bolillero** si se sortearon con "No repetir". "Vaciar todo" borra participantes y ganadores.
- Cargar participantes: `⌘/Ctrl + Enter` en el textarea agrega todas las líneas; `Enter` solo hace un salto de línea. Las líneas vacías se descartan; los nombres duplicados no.
- El selector de ganadores a elegir no se corrige solo al achicarse la lista: si eligiste 5 y quedan 3 participantes, la tanda sortea 3 (`Math.min`).
