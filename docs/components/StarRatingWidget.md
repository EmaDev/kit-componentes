# StarRatingWidget

> Widget de calificación con 5 estrellas: modo interactivo para dejar una reseña, o modo de sólo lectura mostrando el promedio y la distribución por estrella.

**Import**
```tsx
import { StarRatingWidget } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en dos escenarios distintos que resuelve el mismo componente:
- **Dejar una reseña**: el usuario elige de 1 a 5 estrellas (`readOnly` falso u omitido).
- **Mostrar el resumen de calificaciones de un producto/servicio**: pasando `readOnly` y `average`, muestra el promedio grande, las 5 estrellas fijas redondeadas al promedio, la cantidad de reseñas y, si se pasa `distribution`, una barra por cada puntaje (5 a 1 estrellas) con su proporción.

## Cuándo NO usarlo / alternativas

- Si necesitás un input de "me gusta"/reacción simple (no una escala de 1 a 5), no uses `StarRatingWidget` — no tiene modo binario.
- Si el resumen de calificaciones necesita más detalle que una barra de distribución (ej. filtros por puntaje, reseñas individuales con texto), combinalo con otros componentes (`Card`, listado de reseñas) — `StarRatingWidget` en modo lectura sólo resuelve el resumen numérico, no el listado de comentarios.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `value` | `number` | `0` | Calificación actual (1–5), modo interactivo. |
| `onChange` | `(n: number) => void` | `undefined` | Se llama al clickear una estrella, modo interactivo. |
| `readOnly` | `boolean` | `false` | Desactiva la interacción. Combinado con `average != null`, activa el modo resumen (ver abajo). |
| `average` | `number` | `undefined` | Promedio a mostrar en el modo resumen (sólo tiene efecto si `readOnly` es `true`). |
| `count` | `number` | `undefined` | Cantidad de reseñas, mostrada debajo del promedio en el modo resumen. |
| `distribution` | `number[]` | `undefined` | Array de 5 posiciones `[cant. de 1★, cant. de 2★, ..., cant. de 5★]` para las barras del modo resumen. |
| `size` | `number` | `22` | Tamaño en píxeles de cada estrella, modo interactivo (el modo resumen usa tamaños fijos: 16px para las estrellas chicas). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Modo interactivo (dejar reseña)
```tsx
const [rating, setRating] = useState(0);

<StarRatingWidget value={rating} onChange={setRating} />
```

### Modo resumen con distribución
```tsx
<StarRatingWidget
  readOnly
  average={4.3}
  count={128}
  distribution={[2, 4, 10, 45, 67]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas.

## Notas y comportamiento

- El modo se decide con `readOnly && average != null`: si pasás `readOnly` sin `average`, el componente sigue renderizando el selector interactivo pero con los botones deshabilitados (`disabled`, sin `onClick` efectivo) — no muestra el resumen. Para el resumen, `average` es obligatorio además de `readOnly`.
- En modo interactivo, el hover previsualiza la calificación (`shown = hover ?? value`) sin confirmar hasta el click; `onMouseLeave` en el contenedor limpia el hover.
- El array `distribution` se indexa como `distribution[star - 1]`, es decir posición 0 = cantidad de calificaciones de 1 estrella, posición 4 = cantidad de 5 estrellas. Las barras se muestran de 5 a 1 (de arriba hacia abajo) pero el array debe respetar ese orden ascendente por índice.
- El ícono de media estrella (`half`) existe en el sub-componente `Star` interno pero **no se usa** en el flujo actual del componente (`filled` en el modo resumen redondea el promedio con `Math.round`, nunca pasa `half`) — no hay forma pública de forzar medias estrellas.
- No expone ningún tipo exportado adicional — sólo el componente.
