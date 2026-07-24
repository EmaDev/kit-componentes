# Spinner

> Indicador de carga puramente visual, con 4 variantes de animación y 3 tamaños.

**Import**
```tsx
import { Spinner } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para indicar carga en cualquier contexto que no sea un botón: una sección de página cargando datos, un panel vacío mientras llega la respuesta de una API, un estado de "procesando" dentro de una card. Es un elemento aislado (`role="status"`), no un overlay ni un wrapper — vos decidís dónde y cómo posicionarlo.

## Cuándo NO usarlo / alternativas

- Si el estado de carga es de un botón (por ejemplo, mientras se envía un formulario), usá la prop `loading` de `Button` en vez de insertar un `Spinner` manualmente adentro — `Button` ya maneja el layout y el disabled por vos.
- No incluye backdrop ni overlay de pantalla completa; si necesitás bloquear la interacción de toda la pantalla mientras carga, combinalo vos mismo con un contenedor `fixed inset-0`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `"ring" \| "dots" \| "pulse" \| "bars"` | `"ring"` | Estilo de animación. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño en píxeles: 18 / 28 / 44. |
| `color` | `string` | `undefined` | Color CSS explícito (cualquier valor válido de `color`). Si no se pasa, usa `var(--color-primary)`. |
| `label` | `string` | `undefined` | Texto visible junto al spinner. También se usa como `aria-label` del contenedor si se define (ver nota). |
| `className` | `string` | `""` | Clases adicionales para el contenedor (`inline-flex`). |

## Ejemplos

### Uso básico
```tsx
<Spinner />
```

### Con texto y tamaño grande
```tsx
<Spinner size="lg" label="Cargando resultados…" />
```

### Otras variantes
```tsx
<Spinner variant="dots" />
<Spinner variant="pulse" color="#22c55e" />
<Spinner variant="bars" size="sm" />
```

### Centrado en un panel vacío
```tsx
<div className="flex items-center justify-center h-40">
  <Spinner variant="ring" label="Cargando…" />
</div>
```

## Requisitos / dependencias

- Usa `framer-motion` para las variantes `dots`, `pulse` y `bars`; la variante `ring` usa la clase de utilidad `animate-spin` de Tailwind (CSS puro, no Framer Motion).
- Marcado como `"use client"` (aunque `ring` no depende de JS de animación, el archivo entero está marcado como client component).

## Notas y comportamiento

- El contenedor raíz tiene `role="status"` y `aria-label={label ?? "loading"}`: si no pasás `label`, el `aria-label` queda fijo en inglés (`"loading"`), no en español — tenelo en cuenta si tu app está 100% localizada y necesitás el `aria-label` en español (pasá `label="Cargando"` explícitamente).
- Todas las variantes son infinitas (`repeat: Infinity` en las que usan Framer Motion); no hay forma de detener la animación salvo desmontando el componente.
- El color se aplica vía `currentColor`/`style={{ color }}`, así que cualquier `className` que sobrescriba `color` en `className` tiene prioridad menor que la prop `color` (que se aplica inline).
