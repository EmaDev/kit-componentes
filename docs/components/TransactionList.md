# TransactionList

> Historial de movimientos de una billetera/cuenta, agrupado por día (Hoy / Ayer / fecha), con filtro por categoría y montos positivos/negativos coloreados.

**Import**
```tsx
import { TransactionList } from "lib-kit-components";
```

## Cuándo usarlo

Para mostrar el historial ya ocurrido de movimientos (ingresos y egresos) de una cuenta, con la posibilidad de filtrar por categoría y con el agrupado por fecha resuelto automáticamente. Es de sólo lectura/navegación.

## Cuándo NO usarlo / alternativas

- Si el objetivo es **iniciar** una transferencia (no revisar el historial), usá [SendMoneyFlow](SendMoneyFlow.md) — son complementarios: `TransactionList` muestra lo que ya pasó, `SendMoneyFlow` es el wizard para que pase algo nuevo.
- Para una tabla con orden por columna, búsqueda y paginado sobre datos tabulares genéricos, usá [DataTable](DataTable.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `transactions` | `Transaction[]` | — (requerido) | Movimientos a listar. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para moneda y fechas. |
| `categories` | `string[]` | `Array.from(new Set(transactions.map(t => t.category)))` | Categorías para los chips de filtro. Si se omite, se derivan automáticamente de `transactions` (orden de primera aparición). |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface Transaction {
  id: string;
  date: Date;
  title: string;
  category: string;
  amount: number;        // negativo = egreso, positivo = ingreso
  icon?: React.ReactNode;
}
```

## Ejemplos

### Básico
```tsx
<TransactionList
  transactions={[
    { id: "1", date: new Date(), title: "Transferencia recibida", category: "Ingresos", amount: 15000 },
    { id: "2", date: new Date(), title: "Supermercado", category: "Compras", amount: -8200 },
    { id: "3", date: new Date(Date.now() - 86400000), title: "Netflix", category: "Suscripciones", amount: -3500 },
  ]}
/>
```

### Con categorías fijas (no derivadas del dataset)
```tsx
<TransactionList
  transactions={movimientos}
  categories={["Ingresos", "Compras", "Suscripciones", "Servicios"]}
  currency="USD"
  locale="en-US"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- `date` debe ser una instancia real de `Date` (se compara con `toDateString()` y se formatea con `Intl.DateTimeFormat`).
- El agrupado usa las etiquetas `"Hoy"` y `"Ayer"` comparando contra `new Date()` en el momento del render; cualquier otra fecha se muestra como `"{día} de {mes}"` **sin año** (vía `Intl.DateTimeFormat(locale, { day: "numeric", month: "long" })`) — movimientos de años anteriores no se distinguen visualmente por año.
- El filtro por categoría es de selección única (no múltiple), es estado interno del componente y no se expone al padre (no hay `onFilterChange`).
- Los montos negativos no llevan un `"-"` agregado manualmente: el signo lo agrega `Intl.NumberFormat` de forma nativa al formatear un número negativo; sólo los montos `>= 0` reciben el prefijo `"+"` explícito y color verde (`text-success`) — los negativos quedan en el color de texto normal (`text-foreground`), no en rojo.
- Si el filtro activo no tiene movimientos, se muestra el estado vacío `"Sin movimientos en esta categoría."` en vez de una lista vacía.
