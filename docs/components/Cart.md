# Cart (CartButton / CartPanel / useCart)

> Carrito de compras: `CartButton` (icono con badge animado que salta al sumar), `CartPanel` (lista de líneas con alta/baja animada y vaciado en cascada) y `useCart()` (estado mínimo con las acciones que las animan).

**Import**
```tsx
import { CartButton, CartPanel, useCart } from "lib-kit-components";
import type { CartLine } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para el flujo estándar de carrito de un e-commerce: un botón/icono en el header que refleja la cantidad de items (`CartButton`), y un panel (dentro de un `BottomSheet`/`Modal`/sidebar propio) que lista las líneas con control de cantidad, subtotal, envío, descuento y total (`CartPanel`). `useCart()` te da el estado y las acciones (`add`, `setQty`, `remove`, `clear`) sin que tengas que reimplementar la lógica de merge por `id`.

## Cuándo NO usarlo / alternativas

- Si ya tenés tu propio estado de carrito (Redux, Zustand, contexto propio), podés usar sólo `CartButton`/`CartPanel` como piezas de UI y pasarles tus propios `lines`/`onQtyChange`/`onRemove` — no hace falta `useCart()`.
- `CartPanel` no es un overlay en sí mismo — para mostrarlo como panel deslizable, envolvelo en [BottomSheet](BottomSheet.md); para un panel centrado, en [Modal](Modal.md).

## Props

### CartButton

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `count` | `number` | — (requerido) | Cantidad total de items (badge). |
| `onClick` | `() => void` | `undefined` | Click en el botón (típicamente abre el panel). |
| `animateDecrease` | `boolean` | `false` | Si `true`, también anima el "bump" cuando `count` baja (por defecto sólo anima al subir). |
| `bump` | `"icon" \| "count" \| "none"` | `"icon"` | Qué se anima al cambiar `count`: el icono entero, sólo el número del badge, o nada. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del botón. |
| `variant` | `"solid" \| "ghost" \| "outline"` | `"ghost"` | Estilo visual. |
| `label` | `string` | `undefined` | `aria-label` custom (default: `"Carrito, N artículos"`). |
| `className` | `string` | `""` | Clases adicionales. |

### CartPanel

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `lines` | `CartLine[]` | — (requerido) | Líneas del carrito. |
| `onQtyChange` | `(id: string, qty: number) => void` | `undefined` | Cambio de cantidad con los botones +/−. |
| `onRemove` | `(id: string) => void` | `undefined` | Quitar una línea (también se llama al restar por debajo de 1). |
| `onClear` | `() => void` | `undefined` | Vaciar todo — el componente anima la cascada de salida **antes** de llamarlo. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de montos. |
| `shipping` | `number` | `0` | Costo de envío ya calculado (`0` se muestra como "Gratis"). |
| `discount` | `number` | `0` | Descuento a restar del subtotal. |
| `footer` | `ReactNode` | `undefined` | Contenido al pie (típicamente el botón de checkout). |
| `emptyState` | `ReactNode` | `undefined` | Reemplaza el estado vacío por defecto. |
| `className` | `string` | `""` | Clases adicionales. |

### useCart(initial?)

| Miembro | Tipo | Descripción |
|---|---|---|
| `lines` | `CartLine[]` | Estado actual del carrito. |
| `add` | `(line: Omit<CartLine, "qty"> & { qty?: number }) => void` | Agrega una línea; si el `id` ya existe, suma la cantidad. |
| `setQty` | `(id: string, qty: number) => void` | Cambia la cantidad; `qty <= 0` quita la línea. |
| `remove` | `(id: string) => void` | Quita una línea. |
| `clear` | `() => void` | Vacía el carrito. |
| `count` | `number` | Suma de `qty` de todas las líneas. |
| `subtotal` | `number` | Suma de `price * qty` de todas las líneas. |

## Tipos exportados

```ts
export interface CartLine {
  id: string;
  title: string;
  sub?: string;      // talle, color, variante…
  price: number;
  qty: number;
  image?: string;
}
```

## Ejemplos

### Flujo completo con useCart
```tsx
const cart = useCart();

<CartButton count={cart.count} onClick={openSheet} variant="ghost" />

<BottomSheet open={open} onClose={close} title="Tu carrito">
  <CartPanel
    lines={cart.lines}
    onQtyChange={cart.setQty}
    onRemove={cart.remove}
    onClear={cart.clear}
    shipping={0}
    discount={cupon}
    footer={<Button fullWidth>Finalizar compra</Button>}
  />
</BottomSheet>
```

### CartButton con el número animado (no el icono)
```tsx
<CartButton count={cart.count} bump="count" />
```

## Requisitos / dependencias

- Usa `framer-motion` internamente en ambos componentes (spring del badge, cascada de salida de `CartPanel`).
- Marcado como `"use client"`.
- `CartPanel` y `CartButton` son piezas de presentación puras — no dependen de `useCart()`, que es opcional.

## Notas y comportamiento

- El badge de `CartButton` entra con spring y "salta" (`scale`/`rotate` con `bump="icon"`, o `scale` del número con `bump="count"`) en cada incremento; con `animateDecrease={false}` (default) las bajas no disparan la animación.
- `CartPanel.onClear` no vacía inmediatamente: anima cada línea saliendo en cascada (delay escalonado hasta las primeras 6) y recién después llama a `onClear` — no asumas que `lines` está vacío apenas se hace click en "Vaciar".
- Restar la cantidad de una línea con `qty === 1` llama a `onRemove`, no a `onQtyChange(id, 0)`.
- `useCart().add` no reemplaza la línea existente: si el `id` ya está, **suma** la cantidad pasada (o `1` si se omite `qty`).
