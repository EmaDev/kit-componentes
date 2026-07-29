# BeforeAfterSlider

> Comparador de dos imágenes con un divisor vertical arrastrable (patrón "antes/después").

**Import**
```tsx
import { BeforeAfterSlider } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para comparar visualmente dos versiones de una misma imagen: reformas/remodelaciones, retoque fotográfico, resultados de un tratamiento, comparación de calidad de renderizado. El usuario arrastra (mouse o touch) un divisor horizontal que revela la imagen "después" a la izquierda y "antes" a la derecha (o viceversa según qué tanto arrastre).

## Cuándo NO usarlo / alternativas

- Si necesitás comparar más de dos imágenes o navegar una galería, usá [Carousel](Carousel.md) o [ImageZoom](ImageZoom.md) en vez de `BeforeAfterSlider` — está pensado exclusivamente para el patrón de dos imágenes superpuestas con divisor.
- Si sólo necesitás hacer zoom/pan sobre una imagen (no comparar dos), usá [ImageZoom](ImageZoom.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `before` | `string` | — (requerido) | URL de la imagen "antes" (se revela al arrastrar el divisor hacia la derecha). |
| `after` | `string` | — (requerido) | URL de la imagen "después" (imagen base, siempre de fondo). |
| `beforeLabel` | `string` | `"Antes"` | Etiqueta mostrada en la esquina superior izquierda. |
| `afterLabel` | `string` | `"Después"` | Etiqueta mostrada en la esquina superior derecha. |
| `aspect` | `number` | `16/10` | Relación de aspecto (`width / height`) del contenedor. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<BeforeAfterSlider
  before="/reforma-antes.jpg"
  after="/reforma-despues.jpg"
/>
```

### Con etiquetas y aspecto custom
```tsx
<BeforeAfterSlider
  before="/original.jpg"
  after="/editada.jpg"
  beforeLabel="Original"
  afterLabel="Editada"
  aspect={1}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas; el arrastre se implementa con Pointer Events nativos (`onPointerDown`/`onPointerMove`/`onPointerUp` + `setPointerCapture`), funciona con mouse y touch.

## Notas y comportamiento

- Es **no controlado**: la posición del divisor (`pct`, 0–100) vive en estado interno; no hay prop `value`/`onChange` para leer o fijar la posición desde afuera.
- Arranca siempre en 50%.
- Las imágenes se renderizan con `<img>` planas (no `next/image`), así que no depende de Next.js y funciona con cualquier URL, pero no obtiene sus optimizaciones (lazy loading, `srcset`, etc.) — si se necesitan, hay que envolver o adaptar el componente.
- No expone ningún tipo exportado adicional — sólo el componente.
