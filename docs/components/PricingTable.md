# PricingTable

> Comparador de planes de precios: grilla de N planes lado a lado, con switch mensual/anual, plan destacado y CTA por plan.

**Import**
```tsx
import { PricingTable } from "lib-kit-components";
import type { PricingPlan } from "lib-kit-components";
```

## Cuándo usarlo

Para la sección de pricing de una landing o pantalla de upgrade, cuando el usuario tiene que **comparar varios planes entre sí** antes de elegir: nombre, precio mensual/anual, features y un CTA por plan. Incluye de fábrica el switch "Mensual / Anual" (con el precio recalculado por mes) y el badge de plan destacado ("Más elegido").

## Cuándo NO usarlo / alternativas

- Si sólo necesitás mostrar **un** plan (por ejemplo, dentro de una card de upsell suelta en el dashboard, sin comparar contra otros), usá [`PricingCard`](Card.md) — es una composición de `Card` para un plan individual, sin el switch mensual/anual ni el layout de grilla. `PricingTable` arma la grilla completa a partir de un array de `PricingPlan` y agrega el toggle de ciclo de facturación, que `PricingCard` no tiene.
- Si necesitás comparar **especificaciones técnicas** de productos (no planes de suscripción) en una tabla con filas de atributos, usá [`ProductComparisonTable`](ProductComparisonTable.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `plans` | `PricingPlan[]` | — (requerido) | Planes a mostrar. |
| `currency` | `string` | `"USD"` | Código de moneda ISO para `Intl.NumberFormat` (ej. `"ARS"`, `"EUR"`). |
| `locale` | `string` | `"en-US"` | Locale para el formateo de precio. |
| `onSelect` | `(planId: string, cycle: "monthly" \| "yearly") => void` | `undefined` | Se dispara al tocar el botón de un plan, con el ciclo activo en ese momento. |
| `yearlyDiscountLabel` | `string` | `"2 meses gratis"` | Texto junto a "Anual" en el switch, para comunicar el ahorro. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface PricingPlan {
  id: string;
  name: string;
  price: { monthly: number; yearly: number };
  tagline?: string;
  features: string[];
  highlight?: boolean;
  cta?: string;
}
```

## Ejemplos

### Uso básico
```tsx
const plans: PricingPlan[] = [
  { id: "free", name: "Free", price: { monthly: 0, yearly: 0 }, features: ["1 proyecto", "Soporte por email"] },
  {
    id: "pro", name: "Pro", price: { monthly: 29, yearly: 290 }, highlight: true,
    tagline: "Para equipos en crecimiento",
    features: ["Proyectos ilimitados", "Soporte prioritario", "Exportación avanzada"],
    cta: "Empezar Pro",
  },
  { id: "enterprise", name: "Enterprise", price: { monthly: 99, yearly: 990 }, features: ["SSO", "SLA dedicado"] },
];

<PricingTable plans={plans} currency="USD" onSelect={(id, cycle) => startCheckout(id, cycle)} />
```

### Moneda y locale local
```tsx
<PricingTable plans={plans} currency="ARS" locale="es-AR" yearlyDiscountLabel="20% off" />
```

## Requisitos / dependencias

- No depende de Next.js ni de ningún Provider.
- Marcado como `"use client"` (usa `useState` para el ciclo mensual/anual).
- El componente incluye su propio helper `cn()` local (no importa nada de la librería).

## Notas y comportamiento

- El switch mensual/anual es estado interno del componente (no controlado): siempre arranca en `"monthly"`. Si necesitás persistirlo o leerlo desde afuera, tomalo del segundo argumento de `onSelect` en cada interacción.
- En modo `"yearly"` el precio grande mostrado es `price.yearly / 12` (redondeado), y debajo se aclara el total facturado por año (`price.yearly` formateado completo) — `price.yearly` **no** se calcula automáticamente a partir de `price.monthly`, hay que pasarlo explícito por plan.
- El formateo de precio usa `Intl.NumberFormat` con `maximumFractionDigits: 0`, así que siempre se ven precios enteros (sin centavos) sin importar el valor pasado.
- `highlight: true` en un plan agrega el badge "Más elegido", borde `border-primary` y sombra; no hay límite de planes que pueden tener `highlight` a la vez (si marcás varios, se destacan todos).
