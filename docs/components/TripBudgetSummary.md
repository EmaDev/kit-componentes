# TripBudgetSummary

> Presupuesto de un viaje: anillo de progreso con el total gastado vs. planificado, y desglose por categoría con barra de progreso individual.

**Import**
```tsx
import { TripBudgetSummary } from "lib-kit-components";
import type { TripBudgetCategory } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar cuánto se lleva gastado de un viaje frente a lo planificado, con el total destacado en un anillo de progreso y el detalle abierto por categoría (alojamiento, comida, transporte, etc.), cada una con su propia barra y estado (dentro de lo planificado, cerca del límite, o excedido). Pensado para una pantalla de resumen financiero del viaje, no para registrar movimientos individuales.

## Cuándo NO usarlo / alternativas

- No es un listado de transacciones ni permite cargar/editar gastos — sólo muestra totales agregados por categoría que ya calculó quien lo usa. Si necesitás el detalle movimiento por movimiento, hay que construir esa lista aparte y pasarle a `TripBudgetSummary` sólo los totales.
- Si lo que necesitás es un KPI genérico (no específico de presupuesto de viaje, sin desglose por categoría), usá `StatCard` (ver [Card](Card.md)) en su lugar.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `categories` | `TripBudgetCategory[]` | — (requerido) | Categorías de gasto del viaje. |
| `currency` | `string` | `"ARS"` | Código de moneda ISO 4217 usado por `Intl.NumberFormat` para formatear todos los montos. |
| `locale` | `string` | `"es-AR"` | Locale usado por `Intl.NumberFormat`. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface TripBudgetCategory {
  id: string;
  label: string;
  spent: number;
  planned: number;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Uso básico
```tsx
<TripBudgetSummary
  categories={[
    { id: "alojamiento", label: "Alojamiento", spent: 420000, planned: 500000, icon: <HotelIcon /> },
    { id: "comida", label: "Comida", spent: 180000, planned: 150000, icon: <FoodIcon /> },
    { id: "transporte", label: "Transporte", spent: 95000, planned: 120000 },
  ]}
  currency="ARS"
/>
```

### Otra moneda y locale
```tsx
<TripBudgetSummary
  categories={categories}
  currency="EUR"
  locale="es-ES"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Usa `Intl.NumberFormat` del navegador con `style: "currency"` — `currency` debe ser un código ISO 4217 válido para el `locale` elegido.
- Usa las variables CSS del tema (`--color-border`, `--color-primary`, `--color-danger`) directamente en atributos SVG (`stroke`), no clases de Tailwind, para el anillo de progreso.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- El anillo superior refleja el total del viaje: suma de `spent` y de `planned` de todas las categorías, no un promedio de porcentajes individuales.
- Si el total gastado supera el total planificado, el anillo y el texto cambian a color `danger` y se muestra "$X por encima de $Y planificados" en vez de "de $Y planificados".
- Por categoría, la barra usa tres estados de color: `danger` si `spent > planned` (excedida), `accent` si está en o por encima del 80% sin exceder (cerca del límite), `primary` en cualquier otro caso.
- **Gotcha**: el porcentaje por categoría se calcula como `spent / planned * 100` sin proteger la división por cero a nivel de categoría (el total sí lo protege). Una categoría con `planned: 0` y `spent: 0` produce `NaN` y rompe el ancho de la barra (`width: NaN%`); evitá pasar categorías con `planned` en `0` salvo que también asegures `spent` en `0` no ocurra, o filtralas antes de pasarlas.
- El anillo usa `strokeDasharray`/`strokeDashoffset` sobre un `<svg>` rotado -90° para que el progreso arranque arriba; no está animado con `framer-motion`, sólo con `transition-all` de Tailwind en las barras de categoría.
