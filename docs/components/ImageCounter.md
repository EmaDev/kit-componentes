# ImageCounter

> Galería de una sola imagen a la vez con el clásico contador «3 / 12» superpuesto. Arrastre horizontal, flechas en desktop, navegación por teclado, miniaturas opcionales y zoom vía `ImageZoom`.

**Import**
```tsx
import { ImageCounter } from "lib-kit-components";
import type { CounterImage, CounterStyle, CounterPosition } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar una serie de fotos de a una (ficha de producto, propiedad, perfil) donde el foco es la imagen completa y el contador ("3 / 12") es la referencia de posición — a diferencia de `Carousel`, que puede mostrar varias imágenes por vista (`perView`) con dots. `ImageCounter` es la elección natural cuando además necesitás abrir la imagen a pantalla completa con pan/zoom (`zoomable`).

## Cuándo NO usarlo / alternativas

- Si necesitás mostrar más de una imagen por vista, autoplay, o miniaturas como carrusel independiente (no debajo), usá [Carousel](Carousel.md).
- Si sólo necesitás ampliar **una** imagen suelta sin galería, usá [ImageZoom](ImageZoom.md) (`ZoomableImage`) directamente.
- Si el contenido no es fotográfico (ej. una fila de chips/categorías), usá [ChipCarousel](ChipCarousel.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `images` | `CounterImage[]` | — (requerido) | Imágenes a mostrar (`{ src, alt?, caption? }`). |
| `counter` | `"pill" \| "bar" \| "dots"` | `"pill"` | Estilo del contador: `pill` (chip "3/12" arriba), `bar` (banda inferior con caption + contador), `dots` (puntos inferiores, sin número). |
| `position` | `"top-right" \| "top-left" \| "bottom-right" \| "bottom-left" \| "bottom-center"` | `"top-right"` | Dónde se ancla el contador `pill`. No aplica a `bar`/`dots`. |
| `aspect` | `number` | `4/3` | Relación de aspecto (`width / height`) del visor. |
| `pad` | `boolean` | `true` | Rellena con ceros (`03 / 12`) cuando hay más de 9 imágenes. |
| `arrows` | `boolean` | `true` | Muestra flechas prev/next superpuestas (además del arrastre, siempre disponible). |
| `zoomable` | `boolean` | `false` | Click en la imagen abre `ImageZoom` con pan/zoom a pantalla completa. |
| `badge` | `string` | `undefined` | Etiqueta fija arriba a la izquierda (ej. `"Destacada"`), independiente del contador. |
| `thumbs` | `boolean` | `false` | Fila de miniaturas clickeables debajo del visor. |
| `index` | `number` | `undefined` | Índice controlado. Sin esta prop, el componente maneja su propio estado. |
| `onIndexChange` | `(index: number) => void` | `undefined` | Se llama al cambiar de imagen (arrastre, flechas, teclado, miniatura o dots). |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Tipos exportados

```ts
export interface CounterImage {
  src: string;
  alt?: string;
  caption?: string;
}
type CounterStyle = "pill" | "bar" | "dots";
type CounterPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "bottom-center";
```

## Ejemplos

### Uso básico
```tsx
<ImageCounter
  images={[{ src: "/casa-1.jpg", alt: "Living" }, { src: "/casa-2.jpg", alt: "Cocina" }]}
  counter="pill"
  position="top-right"
/>
```

### Con miniaturas, zoom y badge
```tsx
<ImageCounter
  images={fotos}
  counter="bar"
  aspect={4 / 3}
  badge="Destacada"
  thumbs
  zoomable
  onIndexChange={setIndex}
/>
```

### Estilo dots (sin número)
```tsx
<ImageCounter images={fotos} counter="dots" arrows={false} />
```

## Requisitos / dependencias

- Con `zoomable`, renderiza internamente `<ImageZoom>` — no hace falta montarlo aparte.
- No usa `framer-motion`; la transición de arrastre/avance es CSS (`transform` + `transition`).
- Marcado como `"use client"`.

## Notas y comportamiento

- El arrastre calcula el desplazamiento en vivo (`translate3d`) y, al soltar, avanza una imagen si el arrastre superó 48px; de lo contrario vuelve a la posición actual con transición.
- La navegación por teclado (`←`/`→`) está siempre activa mientras el componente está montado — si tenés varios `ImageCounter` en la misma pantalla, todos escuchan el evento global; usá uno visible a la vez o `zoomable` para acotar el foco.
- `thumbs` atenúa (`opacity: 0.55`) las miniaturas no activas en vez de ocultarlas.
- `badge` y el contador `pill` pueden convivir (badge arriba-izquierda, contador en `position`); con `bar`/`dots` sólo `badge` queda arriba a la izquierda.
