# BillSplitter

> Divide un gasto entre varias personas: en partes iguales o con montos custom por persona, con validación de que la suma cuadre con el total.

**Import**
```tsx
import { BillSplitter } from "lib-kit-components";
```

## Cuándo usarlo

Cuando un grupo de personas comparte un gasto (una cena, un viaje, un alquiler) y necesitás resolver cuánto le corresponde pagar a cada una — ya sea repartiendo el total en partes iguales entre los participantes incluidos, o dejando que cada quien ingrese su propio monto (con feedback de cuánto falta o sobra para cuadrar el total).

## Cuándo NO usarlo / alternativas

- Si el objetivo es transferir dinero a una persona puntual (no repartir un gasto grupal), usá [SendMoneyFlow](SendMoneyFlow.md).
- Si necesitás mostrar el avance de un presupuesto por categoría (no dividir un gasto puntual entre personas), usá [BudgetCategoryProgress](BudgetCategoryProgress.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `total` | `number` | — (requerido) | Monto total a dividir. |
| `participants` | `SplitParticipant[]` | — (requerido) | Personas entre las que se puede dividir. |
| `currency` | `string` | `"ARS"` | Código ISO 4217 para `Intl.NumberFormat`. |
| `locale` | `string` | `"es-AR"` | Locale para formateo de moneda. |
| `onConfirm` | `(shares: Record<string, number>) => void` | `undefined` | Se llama al confirmar, con un mapa `participantId → monto asignado`. |
| `className` | `string` | `""` | Clases adicionales. |

## Tipos exportados

```ts
interface SplitParticipant { id: string; name: string; avatar?: string }
```

## Ejemplos

### Partes iguales
```tsx
<BillSplitter
  total={12000}
  participants={[
    { id: "1", name: "Lucía Marín" },
    { id: "2", name: "Martín Paz" },
    { id: "3", name: "Sofía Ruiz" },
  ]}
  onConfirm={(shares) => console.log(shares)} // { "1": 4000, "2": 4000, "3": 4000 }
/>
```

### Con montos custom (usuario cambia a "Montos custom" dentro del componente)
```tsx
<BillSplitter total={12000} participants={grupo} currency="USD" locale="en-US" onConfirm={guardarDivision} />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No usa `framer-motion` ni depende de Next.js.
- No requiere ningún Provider.

## Notas y comportamiento

- El modo (`"equal"` / `"custom"`) y qué participantes están incluidos son estado 100% interno; no hay props controladas para forzar un modo inicial o una selección inicial (arranca con **todos** los participantes incluidos, en modo `"equal"`).
- Destildar (excluir) a un participante en modo `"custom"` no borra el monto que había tipeado — sólo lo excluye del cálculo (`customSum`) y del objeto `shares` final; si lo vuelve a incluir, reaparece el valor que había ingresado antes.
- El botón "Confirmar división" sólo se habilita cuando: en modo `"equal"`, hay al menos un participante incluido; en modo `"custom"`, la suma de los montos ingresados coincide con `total` con una tolerancia de `0.01` (por precisión de punto flotante).
- El objeto `shares` que recibe `onConfirm` sólo contiene entradas para los participantes **incluidos** — un participante destildado no aparece ni siquiera con `0`.
- `avatar` está tipado en `SplitParticipant` pero el render actual siempre usa iniciales sobre un gradiente, no una imagen real.
