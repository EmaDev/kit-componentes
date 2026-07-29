# ParallaxScrollCards

> Grilla de tarjetas con profundidad de scroll: cada tarjeta se mueve a distinta velocidad vertical mientras la sección entra/sale del viewport, dando sensación 3D.

**Import**
```tsx
import { ParallaxScrollCards, type ParallaxCardItem } from "lib-kit-components";
```

## Cuándo usarlo

Para secciones de marketing/landing (features, portfolio, galería de casos) donde querés un efecto de profundidad sutil al hacer scroll — las tarjetas de distintas "capas" (`depth`) se desplazan a velocidades distintas, creando la ilusión de que están a diferente distancia de la cámara. Pensado para grillas de 3-9 ítems que ocupan una sección completa de la página.

## Cuándo NO usarlo / alternativas

- Si necesitás la misma idea de tarjeta pero reactiva al **mouse** en vez de al scroll (efecto de inclinación 3D siguiendo el cursor), usá [TiltHoverCard](TiltHoverCard.md).
- Para una grilla de tarjetas sin efecto de scroll (contenido de producto, listados), usá `Card`/`MediaCard`/`CardGrid` de [Card](Card.md) — `ParallaxScrollCards` agrega movimiento que no siempre es deseable fuera de una landing/sección hero.
- Si el efecto de profundidad tiene que sentirse en un carrusel horizontal en vez de una grilla vertical, usá [Carousel](Carousel.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `ParallaxCardItem[]` | — (requerido) | Tarjetas a renderizar en la grilla. |
| `className` | `string` | `""` | Clases adicionales del contenedor grid (por default `grid sm:grid-cols-2 lg:grid-cols-3 gap-6`). |

## Tipos exportados

```ts
interface ParallaxCardItem {
  id: string;
  title: string;
  description?: string;
  image?: string; // URL; sin ella dibuja un degradé azul→violeta
  depth?: number;  // desplazamiento vertical máximo en px durante el scroll de la sección
}
```

## Ejemplos

### Básico (depth automático por posición)
```tsx
<ParallaxScrollCards
  items={[
    { id: "1", title: "Diseño", description: "Interfaces claras y accesibles." },
    { id: "2", title: "Desarrollo", description: "Código mantenible y testeado." },
    { id: "3", title: "Lanzamiento", description: "Deploy continuo sin fricción." },
  ]}
/>
```

### Con imágenes y depth custom
```tsx
<ParallaxScrollCards
  items={casos.map((c, i) => ({
    id: c.id, title: c.nombre, description: c.resumen, image: c.foto,
    depth: 40 + (i % 4) * 20,
  }))}
/>
```

## Requisitos / dependencias

- No depende de `next`.
- Usa `framer-motion` (`useScroll` con `target` en un `ref` del contenedor, `offset: ["start end", "end start"]`, y `useTransform` por tarjeta para mapear el progreso de scroll a un `y` de `[depth, -depth]`).
- No respeta `prefers-reduced-motion` automáticamente: el movimiento ligado al scroll siempre está activo. Si tu producto debe respetarlo estrictamente, condicioná el render de `ParallaxScrollCards` (o forzá `depth: 0` en todos los items) según `usePrefersReducedMotion`.

## Notas y comportamiento

- Sin `depth` explícito, el valor se infiere por posición en el array con un patrón cíclico de 3: `index % 3 === 0` → `60`, `=== 1` → `30`, `=== 2` → `90` — no depende de la columna real del grid responsive, sólo del índice en `items`.
- El `useScroll` se calcula una sola vez para **toda** la grilla (un único `ref`/`scrollYProgress` compartido), y cada tarjeta deriva su propio `y` de ese progreso compartido vía `useTransform` — no hay un `scroll` independiente por tarjeta.
- El rango de scroll observado es `["start end", "end start"]`: el efecto arranca cuando el borde superior de la grilla entra por abajo del viewport y termina cuando el borde inferior sale por arriba — es decir, cubre todo el tiempo que la sección está total o parcialmente visible.
- Sin `image`, cada tarjeta dibuja un degradé fijo (`linear-gradient(135deg,#2563eb,#7c3aed)`) de 160px de alto como placeholder — no es configurable por prop, sólo aparece/desaparece según haya o no `image`.
- El componente no memoiza nada: con listas grandes, cada tarjeta agrega su propio `useTransform` suscripto al mismo `scrollYProgress`, lo cual es liviano pero conviene tenerlo en cuenta si `items` crece a varias docenas.
