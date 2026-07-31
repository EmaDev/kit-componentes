# ProgressByTopic

> Dominio por tema o materia: una barra por tema, ordenadas de mayor a menor avance, con promedio general arriba.

**Import**
```tsx
import { ProgressByTopic } from "lib-kit-components";
import type { TopicProgress } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para responder "¿en qué estoy flojo?": una lista de materias, temas o habilidades con su nivel de dominio, ordenada para que lo más avanzado quede arriba y lo pendiente abajo. El color de cada barra cambia según el nivel, así que se lee de un vistazo sin comparar números.

## Cuándo NO usarlo / alternativas

- Si el dato es **cuándo** estudió (constancia día a día) y no cuánto sabe, usá [StreakTracker](StreakTracker.md).
- Si es el avance de una sola cosa, usá [Progress](Progress.md) (`ProgressBar` / `ProgressRing`) o [AnimatedProgressRing](AnimatedProgressRing.md).
- Si las categorías son montos de dinero con presupuesto planificado, usá [BudgetCategoryProgress](BudgetCategoryProgress.md).
- Si son tareas que se marcan como hechas (no un porcentaje), usá [TripChecklist](TripChecklist.md) o [GroupedTaskList](GroupedTaskList.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `topics` | `TopicProgress[]` | — (requerido) | Temas a mostrar. El componente los ordena solo (ver notas). |
| `onTopicClick` | `(id: string) => void` | `undefined` | Si se pasa, cada fila se vuelve un `<button>` clickeable con hover. Si no, son `<div>` no interactivos. |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Tipos exportados

```ts
interface TopicProgress {
  id: string;
  label: string;
  /** 0 a 100 */
  mastery: number;
}
```

## Ejemplos

### Uso básico
```tsx
<ProgressByTopic
  topics={[
    { id: "1", label: "Álgebra lineal", mastery: 92 },
    { id: "2", label: "Cálculo diferencial", mastery: 61 },
    { id: "3", label: "Probabilidad", mastery: 24 },
  ]}
/>
```

### Navegando al tema al hacer click
```tsx
<ProgressByTopic
  topics={temas}
  onTopicClick={(id) => router.push(`/temas/${id}`)}
/>
```

### Derivando el dominio de aciertos sobre total
```tsx
<ProgressByTopic
  topics={materias.map((m) => ({
    id: m.id,
    label: m.nombre,
    mastery: Math.round((m.aciertos / m.total) * 100),
  }))}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Requiere `framer-motion` (cada barra crece desde 0 con una transición spring).
- No depende de Next.js.
- Usa los tokens `--color-success`, `--color-primary`, `--color-danger`, `--color-border`, `--color-surface`, `--color-surface-alt` y `--color-foreground`.

## Notas y comportamiento

- **Ordena solo, de mayor a menor `mastery`.** No respeta el orden en que le pasás los temas y no hay prop para desactivarlo ni para invertirlo. Si necesitás el orden original, envolvé el componente.
- El "Dominio general" es el **promedio simple** de `mastery`, redondeado: no pondera por cantidad de contenido ni por dificultad. Con `topics: []` muestra `0%`.
- El color de la barra y del porcentaje sale de umbrales fijos, no configurables: **≥ 80 → `success`**, **≥ 40 → `primary`**, **< 40 → `danger`**.
- `mastery` se espera entre 0 y 100 pero **no se valida ni se recorta**: un valor mayor a 100 desborda la barra y un negativo la deja vacía. Redondeá y acotá antes de pasarlo.
- La barra se anima desde 0 en cada montaje. Al cambiar `mastery` de un tema ya montado, anima del valor viejo al nuevo.
- Los `label` largos se truncan con `...` en una sola línea.
- Sin `onTopicClick` las filas se renderizan como `div` (sin `role` ni foco): correcto para una lista informativa. Con `onTopicClick` son `button` reales, navegables con teclado.
- No muestra ningún estado vacío propio: con `topics: []` sólo queda el encabezado "Dominio general 0%".
