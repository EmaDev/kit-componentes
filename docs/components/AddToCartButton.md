# AddToCartButton

> Botón "agregar" con estados idle → loading → hecho.

**Import**
```tsx
import { AddToCartButton } from "lib-kit-components";
```

## Cuándo usarlo

Como CTA de "agregar al carrito" (o acción equivalente de una sola confirmación) cuando todavía no hay cantidad seleccionada — confirma visualmente la acción (ícono de check + label "Agregado") antes de volver a su estado inicial.

## Cuándo NO usarlo / alternativas

- No lo uses para ajustar una cantidad puntual dentro de una fila o card (ej. "+1 / -1" en un ítem de carrito) — para eso está [AddButton](AddButton.md).
- Patrón típico de e-commerce: mostrar `AddToCartButton` cuando la cantidad es 0, y transicionar a `AddButton` (con `collapsible`) una vez que el usuario agregó al menos una unidad.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `onAdd` | `() => void \| Promise<unknown>` | — (requerido) | Handler de la acción de agregar. Si devuelve una promesa, el botón pasa a estado `busy` (spinner) hasta que resuelva. |
| `label` | `string` | `"Agregar"` | Texto en estado inicial. |
| `addedLabel` | `string` | `"Agregado"` | Texto mostrado en estado `done`. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón. |
| `className` | `string` | `""` | Clases CSS adicionales. |

## Ejemplos

### Básico
```tsx
<AddToCartButton
  onAdd={async () => { await addToCart(product.id, 1); }}
  label="Agregar al carrito"
  addedLabel="¡Agregado!"
  size="lg"
/>
```

## Requisitos / dependencias

- No depende de `next`. Funciona en cualquier app React/Next.js.
- Usa `framer-motion` para el spinner rotatorio infinito y la transición entre estados idle/busy/done (`AnimatePresence mode="wait"`).
- El estado `busy`/`done` es interno; no es controlado por el padre.

## Notas y comportamiento

- Si `onAdd()` rechaza (throw / promise rejected), el estado vuelve directamente a `idle` (no pasa por `done`) sin mostrar ningún error — el manejo de errores queda a cargo del código que llama a `onAdd`.
- El estado `done` se revierte automáticamente a `idle` después de 1600ms (`setTimeout`), sin intervención del usuario.
- Mientras el estado no es `"idle"`, el botón queda deshabilitado (no se puede re-disparar mientras está en `busy` o `done`).
