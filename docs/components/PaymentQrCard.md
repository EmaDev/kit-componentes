# PaymentQrCard

> Tarjeta para mostrar "mi" QR de cobro: identidad del usuario, monto opcional editable y botón de compartir — el complemento natural de un escáner de QR.

**Import**
```tsx
import { PaymentQrCard } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario necesita **cobrar** mostrando un código QR (en persona o compartiéndolo), con la posibilidad de fijar un monto específico antes de mostrarlo. Pensado como la mitad "recibo pagos" del flujo QR, complementando a un escáner (`QrScanner`, si existe en la librería) que sería la mitad "pago escaneando".

## Cuándo NO usarlo / alternativas

- Si el usuario tiene que **elegir con qué pagar** (tarjeta guardada, efectivo, etc.), usá [PaymentMethodPicker](PaymentMethodPicker.md) — es el rol opuesto: `PaymentQrCard` es para cobrar, `PaymentMethodPicker` es para pagar.
- Si el flujo es enviar dinero a un contacto ya identificado dentro de la app (no cobrar mostrando un QR a cualquiera), usá [SendMoneyFlow](SendMoneyFlow.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `string` | — (requerido) | Nombre mostrado arriba del QR. |
| `handle` | `string` | `undefined` | Alias/handle mostrado debajo del nombre. |
| `amount` | `number` | `undefined` | Monto inicial a precargar en el input. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de moneda. |
| `qrValue` | `string` | — (requerido) | Valor base a "codificar" en el QR (ej. tu alias/CBU/link de cobro); se combina con el monto ingresado para regenerar el patrón visual. |
| `onAmountChange` | `(n: number \| null) => void` | `undefined` | Se llama al tipear en el input de monto; recibe `null` si el campo queda vacío. |
| `onShare` | `() => void` | `undefined` | Click en el botón "Compartir". |
| `className` | `string` | `""` | Clases adicionales. |

## Ejemplos

### Básico, sin monto fijo
```tsx
<PaymentQrCard name="Lucía Marín" handle="@lucia" qrValue="lucia.marin@wallet" onShare={() => shareLink()} />
```

### Con monto precargado y callback
```tsx
<PaymentQrCard
  name="Kiosco San Martín"
  qrValue="kiosco-sanmartin-cbu"
  amount={2500}
  currency="ARS"
  onAmountChange={(n) => setMontoACobrar(n)}
  onShare={() => navigator.share?.({ title: "Cobrar", text: "Escaneá para pagarme" })}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- **El QR no es un código QR real ni escaneable**: es un patrón `<svg>` puramente decorativo, generado con un hash determinístico (PRNG simple) de `` `${qrValue}:${input}` ``, con tres cuadrados "finder" dibujados encima para que *parezca* un QR — no codifica datos recuperables por un lector real. Si necesitás un QR funcional, generalo del lado del servidor o con una librería de QR real y pasá la imagen resultante en su lugar (este componente no lo soporta hoy).
- El patrón se regenera cada vez que cambia el monto ingresado (porque `input` forma parte del string hasheado), dando la sensación visual de que el QR "cambia" con el monto, aunque sigue sin ser un QR real.
- El input de monto es estado local (`useState(() => amount ? String(amount) : "")`): sólo toma `amount` como valor **inicial**; si el prop `amount` cambia después desde el padre, el input no se resincroniza automáticamente.
- `onAmountChange` se llama con `parseFloat(e.target.value)` o `null` si el campo quedó vacío — no valida que sea un número positivo ni redondea decimales.
