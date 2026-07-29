# SendMoneyFlow

> Wizard de 4 pasos para enviar dinero a un contacto: elegir destinatario, ingresar monto y nota, confirmar, y pantalla de éxito.

**Import**
```tsx
import { SendMoneyFlow } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario va a **iniciar** una transferencia a otra persona dentro de la app (billetera P2P), y necesitás un flujo guiado paso a paso con validación de saldo antes de confirmar.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar movimientos ya realizados (no iniciar uno nuevo), usá [TransactionList](TransactionList.md).
- Si el usuario va a **cobrar** (recibir un pago mostrando su propio QR) en vez de enviar, usá [PaymentQrCard](PaymentQrCard.md).
- Si lo que hace falta es elegir con qué medio de pago pagar (no a quién transferirle), usá [PaymentMethodPicker](PaymentMethodPicker.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `contacts` | `Contact[]` | — (requerido) | Contactos disponibles como destinatarios. |
| `balance` | `number` | — (requerido) | Saldo disponible, usado para validar el monto máximo. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de moneda. |
| `onSend` | `(v: { contact: Contact; amount: number; note: string }) => Promise<void> \| void` | `undefined` | Se llama al confirmar el envío; si devuelve una promesa, el botón muestra spinner ("Enviando…") hasta que resuelva. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface Contact { id: string; name: string; handle?: string; avatar?: string }
```

## Ejemplos

### Básico
```tsx
<SendMoneyFlow
  balance={184300}
  contacts={[
    { id: "1", name: "Lucía Marín", handle: "@lucia" },
    { id: "2", name: "Martín Paz", handle: "@martinp" },
  ]}
  onSend={async ({ contact, amount, note }) => {
    await api.transfer({ to: contact.id, amount, note });
  }}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- Es un wizard con estado 100% interno (`"contact" | "amount" | "confirm" | "done"`); no es controlable desde afuera ni resumible (no hay props para forzar un paso inicial).
- La validación del monto es simplemente `num > 0 && num <= balance` — no hay límites adicionales configurables (mínimo de envío, tope diario, etc.) más allá del saldo disponible.
- Si `onSend` lanza una excepción, `busy` vuelve a `false` (por el `finally`) pero el wizard **se queda en el paso "confirm"** sin mostrar ningún mensaje de error — no hay estado de error incorporado; si necesitás avisar del fallo, hacelo vos desde afuera (ej. con `Toast`/`Snackbar`) dentro del propio `onSend`.
- Al llegar a `"done"`, el botón "Hacer otro envío" resetea todo el estado interno (`contact`, `amount`, `note`) y vuelve al paso `"contact"` — no actualiza `balance` automáticamente, eso es responsabilidad del padre (recalcularlo tras el `onSend`).
- El avatar de cada contacto en el paso 1 se genera con iniciales (primera letra de las dos primeras palabras del `name`) sobre un gradiente; `contact.avatar` está tipado pero no se usa actualmente para renderizar una imagen real.
