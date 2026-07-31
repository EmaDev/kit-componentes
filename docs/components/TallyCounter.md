# TallyCounter

> Anotador de palitos: una fila por jugador, marcas dibujadas en grupos de 5 (cuatro verticales + uno cruzado en diagonal), igual que a mano.

**Import**
```tsx
import { TallyCounter } from "lib-kit-components";
import type { TallyCounterProps, TallyPlayer } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para llevar la cuenta de algo durante una partida o una actividad presencial: puntos por equipo, rondas ganadas, cantidad de veces que pasó algo. Los palitos agrupados de a 5 son la razón de ser del componente: se leen de un vistazo desde lejos, sin tener que interpretar un número.

## Cuándo NO usarlo / alternativas

- Si el número es un dato de negocio que hay que guardar, este componente no sirve solo: no expone el estado (ver notas). Usá [AddButton](AddButton.md) con tu propio estado.
- Si sólo hay un contador (no varios jugadores), un [AddButton](AddButton.md) o un [AnimatedCounter](AnimatedCounter.md) son más apropiados.
- Si querés mostrar avance hacia una meta en vez de una cuenta abierta, usá [Progress](Progress.md) o [BudgetCategoryProgress](BudgetCategoryProgress.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `defaultPlayers` | `Omit<TallyPlayer, "id">[]` | `[{ name: "Jugador 1", count: 0 }, { name: "Jugador 2", count: 0 }]` | Jugadores/categorías iniciales, sin `id` (se genera solo). Valor **inicial**: los cambios posteriores a la prop no se reflejan. |
| `allowEdit` | `boolean` | `true` | Habilita renombrar (input en vez de texto), agregar y quitar jugadores. En `false` los nombres son fijos y sólo quedan los botones +/− y "Reiniciar". |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface TallyPlayer {
  id: string;
  name: string;
  count: number;
}
```

`TallyPlayer` describe la forma interna de cada fila; la prop pide `Omit<TallyPlayer, "id">`, es decir `{ name, count }`.

## Ejemplos

### Uso básico
```tsx
<TallyCounter />
```

### Equipos con nombre, sin dejar editar la estructura
```tsx
<TallyCounter
  defaultPlayers={[
    { name: "Equipo A", count: 0 },
    { name: "Equipo B", count: 0 },
  ]}
  allowEdit={false}
/>
```

### Arrancando con puntaje previo
```tsx
<TallyCounter
  defaultPlayers={partida.equipos.map((e) => ({ name: e.nombre, count: e.puntos }))}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion` ni Next.js. Las marcas son `div`s posicionados (no SVG ni imágenes), así que heredan el color del texto (`--color-foreground` al 80%).

## Notas y comportamiento

- **No expone el estado.** No hay `onChange` ni `value`: los conteos viven sólo dentro del componente. Si necesitás persistir el resultado, hoy hay que envolver o modificar el componente — no se puede leer desde afuera.
- **No controlado**: `defaultPlayers` alimenta el estado inicial una sola vez. Para reiniciarlo desde afuera, remontalo con una `key` distinta.
- El contador no baja de 0: el botón `−` se deshabilita en cero.
- Siempre queda **al menos un jugador**: el botón de quitar desaparece cuando hay uno solo (y `removePlayer` ignora el pedido).
- "Agregar jugador" nombra la fila nueva como `Jugador N` según la cantidad actual, así que después de quitar filas los nombres se pueden repetir. Son editables.
- "Reiniciar" pone todos los conteos en 0 pero **no** borra ni renombra jugadores.
- Los ids internos vienen de un contador global al módulo (`tp1`, `tp2`, …), no de `useId`. Son únicos dentro de la sesión del navegador pero **no estables entre servidor y cliente**: por eso las `key` de React combinan `useId()` con ese id. No los uses como clave de persistencia.
- Sin límite de conteo, pero las marcas hacen wrap y la fila scrollea horizontalmente: arriba de ~100 (20 grupos) la lectura visual se pierde y el número grande a la izquierda pasa a ser la referencia.
- Los botones tienen `aria-label` ("Sumar", "Restar", "Quitar jugador"), pero el conteo no se anuncia con `aria-live`.
