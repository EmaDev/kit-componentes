# ChipCarousel

> Fila horizontal de chips (categorías, filtros, personas, lugares) con scroll por drag, snap, flechas en desktop y degradados en los bordes. Selección simple o múltiple, cuatro variantes visuales.

**Import**
```tsx
import { ChipCarousel, type Chip, type ChipVariant, type ChipSize } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para filas de opciones que no entran (o no conviene que entren) en una sola línea de ancho fijo: categorías con ícono y contador, filtros con selección múltiple, un selector de personas con avatar circular, o una fila de "lugares/colecciones" con imagen de fondo (`variant="cover"`). Soporta arrastre con mouse o dedo, snap por chip, y flechas de navegación que sólo aparecen en desktop cuando hay contenido oculto a cada lado.

## Cuándo NO usarlo / alternativas

- Para pestañas que cambian el contenido visible de la pantalla (no un filtro/selección), usá [Tabs](Tabs.md) — `ChipCarousel` no maneja paneles asociados.
- Si las opciones son pocas y siempre caben en una línea sin necesidad de scroll, un grupo de botones simple es más liviano que montar el carrusel (drag, `ResizeObserver`, flechas).
- Para un checkbox/radio group tradicional dentro de un formulario, usá [Checkbox](Checkbox.md) — `ChipCarousel` está pensado para filtros/selección visual, no para inputs de formulario semánticos.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `chips` | `Chip[]` | — (requerido) | Lista de chips a mostrar. |
| `value` | `string \| string[]` | `undefined` | Id(s) seleccionados (controlado). `string` en modo simple, `string[]` en modo `multi`. |
| `onChange` | `(value: string \| string[]) => void` | `undefined` | Se llama al seleccionar/deseleccionar un chip. |
| `multi` | `boolean` | `false` | Habilita selección múltiple (`value`/`onChange` trabajan con `string[]`). |
| `variant` | `ChipVariant` | `"soft"` | Estilo visual: `soft` (fondo tenue), `outline` (borde), `solid` (fondo sólido), `cover` (imagen de fondo con degradado y texto encima). |
| `size` | `ChipSize` | `"md"` | Tamaño: `sm` (34px) · `md` (42px) · `lg` (56px, o card en `cover`). |
| `clearable` | `boolean` | `true` | En modo simple, permite deseleccionar tocando el chip ya activo (vuelve a `""`). No aplica en modo `multi`. |
| `arrows` | `boolean` | `true` | Muestra flechas de navegación en desktop cuando hay overflow a ese lado. |
| `gap` | `number` | `8` | Separación en px entre chips. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface Chip {
  id: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;      // circular/cuadrada (soft/outline/solid) o de fondo (cover)
  sub?: string;         // segunda línea — sólo visible en size="lg" o variant="cover"
  count?: number;
  disabled?: boolean;
}
export type ChipVariant = "soft" | "outline" | "solid" | "cover";
export type ChipSize = "sm" | "md" | "lg";
```

## Ejemplos

### Categorías con ícono y contador (selección simple)
```tsx
const [cat, setCat] = useState("todos");

<ChipCarousel
  chips={[
    { id: "todos", label: "Todos", icon: <LayersIcon />, count: 128 },
    { id: "hoy", label: "Hoy", icon: <ZapIcon />, count: 12 },
    { id: "agotados", label: "Agotados", icon: <CloseIcon />, disabled: true },
  ]}
  value={cat}
  onChange={(v) => setCat(v as string)}
/>
```

### Filtros con selección múltiple
```tsx
const [tags, setTags] = useState<string[]>(["envio"]);

<ChipCarousel
  chips={filtros}
  value={tags}
  onChange={(v) => setTags(v as string[])}
  multi
  variant="outline"
/>
```

### Personas con avatar circular
```tsx
<ChipCarousel chips={personas} value={person} onChange={setPerson} variant="soft" />
// chips: [{ id: "p0", label: "Lucía", image: "/lucia.jpg" }, …]
```

### Variante "cover" — imagen de fondo con título
```tsx
<ChipCarousel
  chips={[{ id: "palermo", label: "Palermo", sub: "8 lugares", icon: <HomeIcon />, image: "/palermo.jpg" }]}
  value={place}
  onChange={(v) => setPlace(v as string)}
  variant="cover"
  size="lg"
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`; el drag y el snap se implementan con eventos de puntero nativos (`onPointerDown/Move/Up`) y `scroll-snap-type` de CSS.
- Marcado como `"use client"`.
- Es controlado: el consumidor maneja `value`/`onChange`; no hay estado interno de selección.

## Notas y comportamiento

- El drag se detecta comparando el desplazamiento del puntero contra un umbral de 4px (`moved`); si el puntero se movió, el `click` posterior se ignora para no disparar una selección accidental al soltar tras arrastrar.
- Las flechas y los degradados de borde (`edges.left`/`edges.right`) se recalculan con un `ResizeObserver` sobre el contenedor y en cada evento `onScroll`, así que aparecen/desaparecen dinámicamente según cuánto contenido quede oculto a cada lado.
- En modo simple, tocar el chip ya seleccionado lo deselecciona (`value` pasa a `""`) sólo si `clearable` es `true`; si es `false`, el chip activo queda "pegado" hasta que se seleccione otro.
- `role="listbox"` en el track y `role="option"` + `aria-selected` en cada chip, con `aria-multiselectable` reflejando la prop `multi`.
- Los chips deshabilitados (`chip.disabled`) no disparan `onChange` ni el drag-check, pero siguen siendo visibles (con `opacity-40`) dentro del scroll.
- El botón de flecha desplaza el track un 70% del ancho visible (mínimo 160px) con scroll suave (`scrollBy({ behavior: "smooth" })`), no un chip a la vez.
