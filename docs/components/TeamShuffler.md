# TeamShuffler

> Reparte una lista de nombres en N equipos al azar y parejos, con la lista de participantes editable.

**Import**
```tsx
import { TeamShuffler } from "lib-kit-components";
import type { TeamShufflerProps } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando hay que dividir a **todos** los participantes en grupos: equipos de un partido, mesas de trabajo, parejas de un taller. A diferencia de los otros componentes de azar, acá nadie queda afuera — la lista completa se reparte.

## Cuándo NO usarlo / alternativas

- Si hay que elegir **algunos** ganadores y el resto no participa, usá [RaffleDraw](RaffleDraw.md).
- Si hay que elegir **uno** entre pocas opciones, usá [RouletteWheel](RouletteWheel.md) o [CoinFlip](CoinFlip.md).
- Si los grupos los arma el usuario a mano (no al azar), usá [KanbanBoard](KanbanBoard.md) o [DragReorderList](DragReorderList.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultEntries` | `string[]` | `[]` | Participantes iniciales. Valor **inicial**: los cambios posteriores a la prop no se reflejan. |
| `defaultTeamCount` | `number` | `2` | Cantidad inicial de equipos. El usuario la puede cambiar (mínimo 2). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<TeamShuffler defaultEntries={["Ana", "Bruno", "Carla", "Diego"]} />
```

### Cuatro mesas de trabajo
```tsx
<TeamShuffler
  defaultEntries={asistentes.map((a) => a.nombre)}
  defaultTeamCount={4}
/>
```

### Dentro de un BottomSheet, como herramienta suelta
```tsx
<BottomSheet open={open} onClose={close} size="lg" title="Armar equipos">
  <TeamShuffler defaultEntries={jugadores} />
</BottomSheet>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion` ni Next.js. No tiene animación de desenlace: el reparto aparece de una.
- Usa los tokens del tema (`--color-primary`, `--color-surface`, `--color-border`, `--color-danger`).

## Notas y comportamiento

- **No expone el resultado.** No hay callback (`onShuffle`) ni forma de leer los equipos desde afuera: el reparto vive dentro del componente y se muestra en pantalla. Si necesitás guardarlo, hoy hay que envolver o modificar el componente.
- **No controlado**: `defaultEntries` y `defaultTeamCount` se leen al montar. Para recargar la lista, remontalo con una `key` distinta.
- El reparto es **round-robin sobre la lista mezclada** (Fisher-Yates con `Math.random()`, sin sesgo): el primero de la lista mezclada va al equipo 1, el segundo al 2, y así. Esto garantiza equipos lo más parejos posible — con 7 personas en 3 equipos quedan 3, 2 y 2.
- Los primeros equipos son los que reciben el sobrante, siempre en ese orden. La composición es aleatoria, el tamaño no.
- Mínimo 2 equipos. El botón `+` no pasa de la cantidad de participantes, y "Armar equipos" se deshabilita si hay menos participantes que equipos.
- Cargar participantes: pegá varios nombres, uno por línea, y tocá "Agregar". Las líneas vacías se descartan; los nombres duplicados no (dos "Ana" son dos personas).
- Volver a tocar "Armar equipos" **rehace el sorteo completo** con los mismos participantes: no hay forma de fijar un reparto.
- Cambiar la lista o la cantidad de equipos no borra el reparto que ya está en pantalla — queda visible hasta el siguiente sorteo, y puede quedar desactualizado respecto de la lista de arriba.
- Los equipos se muestran en una grilla de tantas columnas como equipos haya, sin scroll horizontal: con muchos equipos las columnas se vuelven muy angostas.
