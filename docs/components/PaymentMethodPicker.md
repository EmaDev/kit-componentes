# PaymentMethodPicker

> Selector de método de pago: tarjetas guardadas (radio buttons) + opciones extra (efectivo, wallet, etc.) + formulario inline para agregar una tarjeta nueva.

**Import**
```tsx
import { PaymentMethodPicker } from "lib-kit-components";
```

## Cuándo usarlo

En un checkout o formulario de pago, cuando el usuario tiene que elegir **con qué** pagar entre sus tarjetas guardadas y, opcionalmente, otros métodos (efectivo, wallet, transferencia), con la posibilidad de agregar una tarjeta nueva sin salir del flujo.

## Cuándo NO usarlo / alternativas

- Si el usuario va a **cobrar** (mostrar su propio QR para recibir un pago) en vez de elegir cómo pagar, usá [PaymentQrCard](PaymentQrCard.md) — son roles opuestos dentro de un flujo de pago.
- Si necesitás una tarjeta de crédito visual (con flip 3D, número, vencimiento) en vez de una lista seleccionable de tarjetas guardadas, usá [FlipCard](FlipCard.md) (`CreditCard`/`CreditCardStack`).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `cards` | `SavedCard[]` | — (requerido) | Tarjetas guardadas del usuario. |
| `value` | `string \| null` | `undefined` | `id` del método seleccionado (controlado); puede ser el `id` de una tarjeta o de un ítem de `extra`. |
| `onChange` | `(id: string) => void` | `undefined` | Se llama al seleccionar una tarjeta o un ítem de `extra`. |
| `onAddCard` | `(c: NewCardInput) => Promise<void> \| void` | `undefined` | Se llama al enviar el formulario de tarjeta nueva; si devuelve una promesa, el botón "Guardar tarjeta" muestra "Guardando…" hasta que resuelva. |
| `extra` | `{ id: string; label: string; icon?: React.ReactNode }[]` | `[]` | Métodos de pago adicionales, no relacionados con tarjetas (ej. efectivo, wallet). |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "other";
  last4: string;
  expiry: string; // ej. "12/27"
}
interface NewCardInput { number: string; name: string; expiry: string; cvc: string }
```

## Ejemplos

### Básico
```tsx
const [method, setMethod] = useState<string | null>("card-1");

<PaymentMethodPicker
  value={method}
  onChange={setMethod}
  cards={[
    { id: "card-1", brand: "visa", last4: "4242", expiry: "12/27" },
    { id: "card-2", brand: "mastercard", last4: "8890", expiry: "03/26" },
  ]}
  onAddCard={async (c) => { await api.saveCard(c); }}
/>
```

### Con métodos extra
```tsx
<PaymentMethodPicker
  value={method}
  onChange={setMethod}
  cards={tarjetas}
  extra={[
    { id: "cash", label: "Efectivo", icon: <BanknoteIcon /> },
    { id: "wallet", label: "Saldo en billetera", icon: <WalletIcon /> },
  ]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- `cards` y `extra` comparten el mismo espacio de `id` para la selección (`value`/`onChange`) — asegurate de que los `id` de `extra` no colisionen con los `id` de `cards`.
- El formulario de "agregar tarjeta" hace validación mínima, sin Luhn ni detección real de marca: `number` (sin espacios) `>= 12` caracteres, `name` con más de 1 carácter, `expiry` de exactamente 5 caracteres (formato `MM/AA` esperado pero no verificado numéricamente), `cvc` `>= 3` caracteres.
- **El componente no agrega la tarjeta nueva a su propia lista `cards`**: al confirmar, sólo llama a `onAddCard(form)` con los datos crudos ingresados (sin `id` ni `brand` asignados) y limpia el formulario — es responsabilidad del padre transformar ese `NewCardInput` en un `SavedCard` (con `id` y `brand` propios) y agregarlo al array `cards` que le pasa por props para que aparezca en la lista.
- El bloque de "agregar tarjeta" es un toggle interno (`adding`): mientras está abierto, reemplaza al botón "Agregar una tarjeta" por el formulario; "Cancelar" lo cierra sin llamar a `onAddCard`.
