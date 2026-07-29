# BudgetCategoryProgress

> Lista de presupuestos por categoría con barra de progreso, cambiando de color al acercarse (80%+) o pasarse del límite, y aviso de exceso.

**Import**
```tsx
import { BudgetCategoryProgress } from "lib-kit-components";
```

## Cuándo usarlo

Para mostrar cuánto lleva gastado el usuario en cada categoría de su presupuesto (Comida, Transporte, Entretenimiento, etc.) frente a un límite fijado, de forma puramente visual/informativa — es un componente de sólo lectura, sin interacción.

## Cuándo NO usarlo / alternativas

- Si necesitás dividir un gasto puntual entre personas (no comparar gasto acumulado vs. límite por categoría), usá [BillSplitter](BillSplitter.md).
- Para un solo número destacado (sin barra de progreso ni límite), usá [KpiCard](KpiCard.md).
- Si necesitás una barra de progreso genérica fuera de este contexto de presupuesto, usá [ProgressBar](Progress.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `categories` | `BudgetCategory[]` | — (requerido) | Categorías a mostrar. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de moneda. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface BudgetCategory {
  id: string;
  label: string;
  spent: number;
  limit: number;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Básico
```tsx
<BudgetCategoryProgress
  categories={[
    { id: "1", label: "Comida", spent: 42000, limit: 50000 },
    { id: "2", label: "Transporte", spent: 18500, limit: 15000 },
    { id: "3", label: "Entretenimiento", spent: 3000, limit: 20000 },
  ]}
/>
```

### Con íconos por categoría
```tsx
<BudgetCategoryProgress
  categories={[
    { id: "1", label: "Comida", spent: 42000, limit: 50000, icon: <ForkKnifeIcon /> },
    { id: "2", label: "Servicios", spent: 12000, limit: 12000, icon: <ZapIcon /> },
  ]}
  currency="USD" locale="en-US"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- Es puramente presentacional: no tiene props de callback ni estado interno, sólo renderiza `categories` tal cual se le pasan.
- El ancho de la barra se clampea a `100%` (`Math.min(100, (spent / limit) * 100)`), pero el texto de "Te pasaste por {monto}" debajo usa el exceso real (`spent - limit`) sin clampear, así que puede mostrar montos grandes con la barra llena al tope igual.
- Colores de la barra: `primary` (normal, `< 80%`), `accent` (`near`, `>= 80%` y `<= 100%`), `danger` (`over`, `spent > limit`).
- El formato de moneda usa `maximumFractionDigits: 0` (sin decimales) — a diferencia de la mayoría de los otros componentes de esta categoría, que usan 2 decimales.
- No valida `limit <= 0`; con `limit` en `0` o negativo, el porcentaje calculado puede dar `Infinity`/`NaN` y la barra se comporta de forma indefinida — asegurate de pasar límites positivos.
