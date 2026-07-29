# AuditLog

> Historial de auditoría: quién hizo qué acción y cuándo, con un diff plegable por campo (`de → a`) cuando la acción incluyó cambios.

**Import**
```tsx
import { AuditLog, type AuditEntry, type AuditChange } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para pantallas de administración/compliance donde necesitás mostrar quién modificó qué y cuándo, con el detalle exacto de los cambios (valor anterior → valor nuevo) por campo, plegado por defecto para no saturar la vista. Cada entrada muestra el avatar con iniciales del actor, la acción en texto ("Lucía editó el perfil"), la hora, y un botón "Ver cambios (N)" si hay `changes`.

## Cuándo NO usarlo / alternativas

- Si el historial no necesita mostrar "quién" hizo el cambio ni un diff de campos, sino solo una secuencia de estados de un objeto, usá [ActivityTimeline](ActivityTimeline.md) — más liviano.
- Si necesitás notas/comentarios de texto libre por evento (no cambios estructurados de campos), usá [TimelineComments](TimelineComments.md).
- Para un feed de actividad de cuenta agrupado por día sin diff de campos, usá [GroupedActivityFeed](GroupedActivityFeed.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `entries` | `AuditEntry[]` | — (requerido) | Entradas del log, en el orden en que se renderizan. |
| `className` | `string` | `""` | Clases adicionales para el `<ol>` raíz. |

## Tipos exportados

```ts
export interface AuditChange {
  field: string;
  from: string;
  to: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  time: string;
  changes?: AuditChange[];
}
```

## Ejemplos

### Uso básico
```tsx
const entries: AuditEntry[] = [
  { id: "1", actor: "Lucía Marín", action: "editó el perfil de la tienda", time: "Hoy, 10:20" },
  { id: "2", actor: "Emanuel Cisterna", action: "cambió el plan de facturación", time: "Ayer, 18:05" },
];

<AuditLog entries={entries} />
```

### Con diff de campos
```tsx
<AuditLog
  entries={[
    {
      id: "1",
      actor: "Lucía Marín",
      action: "actualizó la configuración de envíos",
      time: "Hoy, 09:40",
      changes: [
        { field: "Costo de envío", from: "$1500", to: "$1800" },
        { field: "Zona de cobertura", from: "CABA", to: "CABA + GBA" },
      ],
    },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`: usa `useState` de React para el estado de "expandido" por entrada.
- Marcado como `"use client"`.

## Notas y comportamiento

- El botón "Ver cambios (N)" solo aparece si `changes` existe y tiene al menos un elemento; entradas sin `changes` (o `changes: []`) se muestran como una línea simple sin acción de expandir.
- El estado de qué entradas están expandidas es interno (`useState<Record<string, boolean>>`) e independiente por `id` — podés tener varias entradas expandidas a la vez.
- Las iniciales del avatar (`initials()`) toman la primera letra de hasta las dos primeras palabras de `actor` en mayúsculas — un actor de una sola palabra (ej. `"Sistema"`) muestra una sola inicial (`"S"`).
- El diff de cada campo se muestra siempre en el mismo formato: `field: from → to`, con `from` tachado en rojo (`text-danger line-through`) y `to` en verde (`text-success`) — no hay soporte para valores no textuales (objetos, booleanos): todo se pasa como `string`.
- `action` es texto libre que se concatena directamente después del `actor` en negrita (`"{actor} {action}"`), así que conviene redactarlo en minúscula y sin sujeto repetido (ej. `"editó el perfil"`, no `"Lucía editó el perfil"`).
