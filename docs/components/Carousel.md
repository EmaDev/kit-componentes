# Carousel

> Carrusel de imágenes con arrastre (drag), flechas, dots, miniaturas, autoplay y apertura opcional en un visor con pan/zoom.

**Import**
```tsx
import { Carousel } from "lib-kit-components";
```

## Cuándo usarlo

Para galerías de imágenes navegables: producto con varias fotos, portfolio, banners promocionales rotando, o cualquier caso donde el usuario recorre una secuencia de imágenes con drag/flechas/dots. Soporta mostrar más de una imagen por vista (`perView`), efecto "peek" del siguiente slide, autoplay que se pausa al interactuar, miniaturas de navegación directa, y abrir cada slide en un visor de pantalla completa con pan y zoom (`zoomable`).

## Cuándo NO usarlo / alternativas

- Si sólo tenés **una** imagen que necesita zoom (no una secuencia navegable), usá [ZoomableImage](ImageZoom.md) directamente — es más liviano que un `Carousel` de un solo elemento.
- Si necesitás navegar contenido que no son imágenes (tabs de texto, paneles), usá [Tabs](Tabs.md).
- Si el contenido es una grilla de tarjetas sin necesidad de "una a la vez" con dots/flechas, usá varias `MediaCard`/`Card` en un grid en vez de un `Carousel`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `images` | `CarouselImage[]` | — (requerido) | Slides a mostrar. |
| `perView` | `number` | `1` | Cantidad de imágenes visibles simultáneamente. |
| `gap` | `number` | `16` | Separación entre slides en px. |
| `aspect` | `number` | `16/9` | Relación de aspecto de cada slide. |
| `loop` | `boolean` | `true` | Al pasar el último slide vuelve al primero (y viceversa). Si es `false`, las flechas de los extremos se deshabilitan (opacidad 0). |
| `autoplay` | `number` | `undefined` | Milisegundos entre avances automáticos. Sin valor, no hay autoplay. Se pausa mientras el mouse está sobre el carrusel o se está arrastrando. |
| `arrows` | `boolean` | `true` | Muestra flechas prev/next (sólo si `images.length > perView`). |
| `dots` | `boolean` | `true` | Muestra indicadores de posición (sólo si `images.length > perView`). |
| `thumbs` | `boolean` | `false` | Muestra tira de miniaturas navegables debajo. |
| `zoomable` | `boolean` | `false` | Al hacer click en un slide, abre `ImageZoom` sobre esa imagen con navegación prev/next dentro del visor. |
| `peek` | `number` | `0` | Px que deja asomar del siguiente slide (efecto "peek"), restados del ancho calculado de cada slide. |
| `onIndexChange` | `(index: number) => void` | `undefined` | Se llama cuando cambia el slide activo. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface CarouselImage {
  src: string;
  alt?: string;
  caption?: string;
}
```

## Ejemplos

### Uso básico
```tsx
<Carousel images={[{ src: "/a.jpg", alt: "Living" }, { src: "/b.jpg", alt: "Cocina" }]} />
```

### Varias por vista, con peek y autoplay
```tsx
<Carousel
  images={fotos}
  perView={2}
  peek={56}
  aspect={16 / 9}
  loop
  autoplay={2600}
/>
```

### Con miniaturas y zoom
```tsx
<Carousel images={fotosPropiedad} thumbs zoomable aspect={4 / 3} />
```

### Escuchar el índice activo
```tsx
<Carousel images={fotos} onIndexChange={(i) => setActiveIndex(i)} dots={false} />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion`; la animación del track y del zoom del visor se hace con transiciones CSS (`transform`, `transition`).
- Cuando `zoomable` es `true`, renderiza internamente [`ImageZoom`](ImageZoom.md) — hereda sus mismos bloqueos globales (scroll, gestos del navegador) mientras el visor está abierto.
- Usa `ResizeObserver` para medir el ancho del viewport y calcular `slideW`; no depende de que el contenedor tenga un ancho fijo en CSS.

## Notas y comportamiento

- El arrastre (`onPointerDown/Move/Up`) sólo actúa en el eje horizontal (`touchAction: "pan-y"` en el viewport), así que el scroll vertical de la página no se bloquea al arrastrar en mobile.
- Un swipe dispara el cambio de slide si el desplazamiento supera `max(40, slideW * 0.18)` px — swipes cortos no avanzan.
- Con `autoplay`, el intervalo se reinicia cada vez que cambia `index` (el `useEffect` depende de `index`), así que el timing es siempre "N ms desde el último cambio", no un reloj fijo.
- Las flechas de teclado (`←`/`→`) funcionan cuando el carrusel tiene foco (`tabIndex={0}` en el contenedor raíz, `role="region"`).
- Si `zoomable` es `true` pero `images` está vacío, no pasa nada especial: simplemente no hay slides para hacer click.
- `last` (último índice válido de arranque) se calcula como `images.length - perView`, así que con `perView > 1` los dots representan posiciones de scroll, no una por imagen individual.
