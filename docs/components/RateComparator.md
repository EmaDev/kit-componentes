# RateComparator

> Comparador de cotizaciones: convierte el mismo monto fijo con varios proveedores y los ordena por lo que más te dan en mano (neto, descontada la comisión).

**Import**
```tsx
import { RateComparator } from "lib-kit-components";
```

## Cuándo usarlo

Cuando el usuario ya definió cuánto quiere convertir (`amount`, `from` → `to`) y necesita elegir **con qué proveedor** hacerlo, viendo de un vistazo la cotización, la comisión, el tiempo estimado y — lo más importante — cuánto recibe neto con cada uno, resaltando la mejor opción.

## Cuándo NO usarlo / alternativas

- Si lo que el usuario tiene que elegir es la **moneda** (no el proveedor), usá [CurrencySelector](CurrencySelector.md).
- Si sólo necesitás mostrar la evolución histórica de una cotización (no comparar proveedores en un instante), usá [ValueHistoryChart](ValueHistoryChart.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `from` | `string` | — (requerido) | Código de la moneda de origen (sólo texto, se muestra tal cual). |
| `to` | `string` | — (requerido) | Código de la moneda de destino. |
| `amount` | `number` | — (requerido) | Monto a convertir, igual para todos los proveedores. |
| `quotes` | `RateQuote[]` | — (requerido) | Cotizaciones a comparar. |
| `onSelect` | `(quote: RateQuote) => void` | `undefined` | Click en una fila/proveedor. |
| `locale` | `string` | `"es-AR"` | Locale para formatear números. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface RateQuote {
  provider: string;
  logo?: string;        // texto corto (ej. inicial); si falta, usa provider[0]
  rate: number;          // 1 `from` = rate `to`
  fee?: number;           // comisión, en la moneda `to`
  etaMinutes?: number;
  best?: boolean;         // no usado por el componente (ver Notas)
}
```

## Ejemplos

### Básico
```tsx
<RateComparator
  from="USD" to="ARS" amount={100}
  quotes={[
    { provider: "Banco Nación", rate: 1150, fee: 800, etaMinutes: 5 },
    { provider: "Wallet FX", rate: 1180.5, fee: 0, etaMinutes: 2 },
    { provider: "Casa de cambio", rate: 1190, fee: 3500, etaMinutes: 1440 },
  ]}
  onSelect={(q) => setProvider(q.provider)}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- El orden se recalcula siempre en el propio componente (`[...quotes].sort(...)`, sin mutar el array recibido), por `rate - (fee ?? 0) / amount` descendente — equivalente a ordenar por monto neto a recibir (`amount * rate - fee`) de mayor a menor, ya que `amount` es el mismo para todas las cotizaciones.
- El badge "Mejor cotización" lo determina el propio componente (`índice 0 tras ordenar`), **no** el campo `quote.best` — ese campo del tipo `RateQuote` queda sin usar en el render actual; no asumas que marcarlo en `true` fuerza el destacado.
- `fee` es opcional: sin él, se asume `0` y la fila muestra "sin comisión" en vez del monto de comisión.
- `etaMinutes` se formatea como minutos si es `< 60`, o como horas redondeadas si es mayor o igual (ej. `1440` → `"24 h"`).
- Los números se formatean con `Intl.NumberFormat` (o `.toLocaleString`) según `locale`, pero **sin** `style: "currency"` — `from`/`to` se muestran como texto plano al lado del número, no como símbolo de moneda.
