# Roadmap

> Hoja de ruta pública: items agrupados por trimestre con un badge de estado (Lanzado / En curso / Planeado) — para comunicar planes futuros, no pasos de un proceso en curso.

**Import**
```tsx
import { Roadmap, type RoadmapItem } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para una página de "roadmap" o "novedades próximas" donde los items se agrupan por período (trimestre, sprint, versión) y cada uno tiene un estado de avance de tres valores fijos: ya lanzado, en curso, o planeado. Es de solo lectura y no representa un flujo secuencial con "paso actual", sino un conjunto de iniciativas independientes.

## Cuándo NO usarlo / alternativas

- Si necesitás explicar un proceso paso a paso ("cómo funciona 1-2-3"), usá [HowItWorksTimeline](HowItWorksTimeline.md) — `Roadmap` agrupa por período, no numera pasos secuenciales.
- Si el contenido es un historial de eventos ya ocurridos con hora exacta (no un plan a futuro agrupado por trimestre), usá [ActivityTimeline](ActivityTimeline.md) o [GroupedActivityFeed](GroupedActivityFeed.md).
- Si necesitás ramas paralelas o sub-eventos, usá [BranchingTimeline](BranchingTimeline.md) — `Roadmap` no tiene jerarquía, solo agrupado plano por `quarter`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `RoadmapItem[]` | — (requerido) | Items del roadmap. Se agrupan por `quarter` en el orden de aparición. |
| `className` | `string` | `""` | Clases adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  quarter: string;
  status: "shipped" | "in-progress" | "planned";
}
```

## Ejemplos

### Uso básico
```tsx
const items: RoadmapItem[] = [
  { id: "1", title: "Exportación a Excel", quarter: "Q3 2026", status: "shipped" },
  { id: "2", title: "Modo offline", quarter: "Q3 2026", status: "in-progress" },
  { id: "3", title: "Integración con contabilidad", quarter: "Q4 2026", status: "planned" },
];

<Roadmap items={items} />
```

### Con descripciones
```tsx
<Roadmap
  items={[
    {
      id: "1", title: "App móvil", quarter: "Q4 2026", status: "planned",
      description: "Versión nativa para iOS y Android con notificaciones push.",
    },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`, aunque no tiene estado propio.

## Notas y comportamiento

- Los grupos se arman preservando el **orden de aparición** de `quarter` en el array `items`, no un orden cronológico automático: si necesitás que "Q3 2026" aparezca antes que "Q4 2026", ordená vos el array de `items` antes de pasarlo (el primer item con un `quarter` nuevo determina la posición del grupo).
- El texto y color del badge de estado están fijos por `status` (`shipped` → "Lanzado" verde, `in-progress` → "En curso" primary, `planned` → "Planeado" gris neutro) — no son personalizables vía props; para otros estados hay que componer el layout manualmente.
- `description` es opcional; sin ella, el item solo muestra título y badge.
- Un mismo `quarter` (string) usado en items no consecutivos del array igual se agrupa correctamente en una sola sección, gracias a la búsqueda `groups.find(([q]) => q === it.quarter)`.
