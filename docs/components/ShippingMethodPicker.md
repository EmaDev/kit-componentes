# ShippingMethodPicker

> Selector de método de envío (retiro en local, delivery, correo) con precio formateado y tiempo estimado por opción.

**Import**
```tsx
import { ShippingMethodPicker } from "lib-kit-components";
import type { ShippingOption } from "lib-kit-components";
```

## Cuándo usarlo

En el paso de checkout donde el usuario elige cómo va a recibir su pedido. Cada opción muestra un radio, un ícono opcional, label, descripción, tiempo estimado (`eta`) y precio (formateado con `Intl.NumberFormat`, mostrando "Gratis" cuando el precio es `0`).

## Cuándo NO usarlo / alternativas

- Para elegir el **método de pago** (tarjeta guardada, agregar tarjeta nueva, etc.), usá `PaymentMethodPicker` — mismo patrón visual de lista con selección, pero para medios de pago, no de envío. Ambos suelen aparecer juntos en el mismo checkout, uno debajo del otro.
- Si el envío es "retiro en una de nuestras sucursales" y necesitás elegir **cuál** sucursal física (no el método de envío en sí), usá [`BranchSelector`](BranchSelector.md) — podés incluso combinarlos: `ShippingMethodPicker` para elegir "retiro en local" como método, y `BranchSelector` para elegir cuál local.
- Si necesitás mostrar el **progreso** de un envío ya despachado (en tránsito, entregado), no elegir el método, usá `TrackingStepper`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `options` | `ShippingOption[]` | — (requerido) | Métodos de envío disponibles. |
| `value` | `string` | `undefined` | `id` de la opción seleccionada (controlado). |
| `onChange` | `(id: string) => void` | — (requerido) | Se dispara al elegir una opción. |
| `currency` | `string` | `"ARS"` | Código de moneda para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para el formateo de precio. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface ShippingOption {
  id: string;
  label: string;
  description?: string;
  price: number;
  eta: string;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
const [method, setMethod] = useState<string>();

const options: ShippingOption[] = [
  { id: "pickup", label: "Retiro en sucursal", price: 0, eta: "Disponible hoy" },
  { id: "standard", label: "Envío estándar", description: "A domicilio", price: 1500, eta: "3 a 5 días hábiles" },
  { id: "express", label: "Envío express", description: "A domicilio", price: 3900, eta: "24 a 48 horas" },
];

<ShippingMethodPicker options={options} value={method} onChange={setMethod} />
```

### Con moneda distinta
```tsx
<ShippingMethodPicker options={options} value={method} onChange={setMethod} currency="MXN" locale="es-MX" />
```

## Requisitos / dependencias

- Sin dependencias externas más allá de React; no usa Next.js ni ningún Provider.
- Marcado como `"use client"`.
- Es **siempre controlado**: no tiene estado interno de selección — si no pasás `value`, ninguna opción aparece marcada visualmente (aunque `onChange` sigue funcionando).

## Notas y comportamiento

- `price === 0` se renderiza como el texto `"Gratis"` en vez de `"$0"` — es la única condición especial en el formateo.
- El `icon` de cada `ShippingOption` es opcional; sin él, la fila simplemente no muestra el chip cuadrado de ícono (el layout no deja un hueco vacío).
- No valida ni ordena las opciones — se renderizan en el orden exacto del array `options`.
