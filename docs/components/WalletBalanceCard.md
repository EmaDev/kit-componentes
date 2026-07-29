# WalletBalanceCard

> Tarjeta de saldo de una billetera virtual: monto principal grande, saldos secundarios en otras monedas, botón para ocultar/mostrar montos y tres acciones rápidas (Enviar / Recibir / Cambiar).

**Import**
```tsx
import { WalletBalanceCard } from "lib-kit-components";
```

## Cuándo usarlo

Como cabecera de una pantalla de billetera/home financiero: mostrar cuánto dinero tiene el usuario disponible, con la posibilidad de ocultarlo por privacidad (pantalla compartida, capturas) y accesos directos a las tres acciones más comunes de una billetera.

## Cuándo NO usarlo / alternativas

- Si necesitás listar los movimientos históricos, no el saldo actual, usá [TransactionList](TransactionList.md).
- Si el flujo de "Enviar" ya se disparó y necesitás el wizard completo (elegir contacto, monto, confirmar), usá [SendMoneyFlow](SendMoneyFlow.md) — `WalletBalanceCard` sólo expone el botón que dispara ese flujo vía `onSend`.
- Para mostrar la tendencia histórica de un saldo (no sólo el valor actual), usá [ValueHistoryChart](ValueHistoryChart.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `balances` | `WalletBalance[]` | — (requerido) | Saldos por moneda. |
| `primaryCode` | `string` | `undefined` | Código de moneda a destacar como saldo principal. Si no coincide con ninguno, se usa `balances[0]`. |
| `locale` | `string` | `"es-AR"` | Locale para `Intl.NumberFormat`. |
| `onSend` | `() => void` | `undefined` | Click en el botón "Enviar". |
| `onReceive` | `() => void` | `undefined` | Click en el botón "Recibir". |
| `onConvert` | `() => void` | `undefined` | Click en el botón "Cambiar". |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface WalletBalance {
  code: string;      // código ISO 4217, ej. "ARS"
  symbol: string;
  amount: number;
  flag?: string;      // emoji de bandera, ej. "🇦🇷"
}
```

## Ejemplos

### Básico, una sola moneda
```tsx
<WalletBalanceCard balances={[{ code: "ARS", symbol: "$", amount: 184300, flag: "🇦🇷" }]} />
```

### Multi-moneda con acciones
```tsx
<WalletBalanceCard
  balances={[
    { code: "ARS", symbol: "$", amount: 184300, flag: "🇦🇷" },
    { code: "USD", symbol: "US$", amount: 420, flag: "🇺🇸" },
    { code: "EUR", symbol: "€", amount: 95, flag: "🇪🇺" },
  ]}
  primaryCode="ARS"
  onSend={() => router.push("/enviar")}
  onReceive={() => router.push("/recibir")}
  onConvert={() => router.push("/cambiar")}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- El campo `symbol` de `WalletBalance` **no se usa** en el render actual — el formato de moneda sale enteramente de `Intl.NumberFormat(locale, { style: "currency", currency: code })`, así que `code` debe ser un código ISO 4217 válido (o `Intl` lanza `RangeError`); `symbol` queda disponible para tu propio uso si lo necesitás en otro lado.
- El botón de ocultar (`hidden`) enmascara **todos** los montos (principal y secundarios) con `"••••••"`/`"••••"`, es estado local — no se persiste ni se expone al padre.
- Los tres botones de acción se renderizan siempre (Enviar/Recibir/Cambiar), aunque no pases el handler correspondiente; sin handler simplemente no hacen nada al hacer click (no se ocultan ni deshabilitan).
- Si `primaryCode` no matchea ningún `balance.code`, cae silenciosamente a `balances[0]` como principal; si `balances` está vacío, muestra `"—"`.
