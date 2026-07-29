# BranchingTimeline

> Timeline con ramas: un tronco principal de nodos y, opcionalmente, sub-eventos paralelos colgando de cada nodo (ej. un pedido dividido en dos envíos que avanzan por separado).

**Import**
```tsx
import { BranchingTimeline, type BranchNode } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando un proceso no es puramente lineal: hay un nodo principal que en cierto punto se abre en dos o más sub-eventos que ocurren en paralelo (un pedido que se separa en dos paquetes, una solicitud que dispara varias verificaciones simultáneas). Cada nodo del tronco principal puede tener una lista de `children` que se dibujan colgando a la derecha, con su propio punto de estado.

## Cuándo NO usarlo / alternativas

- Si el proceso es estrictamente secuencial, sin ramas paralelas, usá [ActivityTimeline](ActivityTimeline.md) — es más simple y no asume una jerarquía de nodos.
- Si necesitás agrupar eventos por día (no por rama), usá [GroupedActivityFeed](GroupedActivityFeed.md).
- Si necesitás comentarios por evento, usá [TimelineComments](TimelineComments.md) — `BranchingTimeline` es de solo lectura.
- Si el timeline es horizontal y compacto (tracking de paquete), usá [TrackingStepper](TrackingStepper.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `nodes` | `BranchNode[]` | — (requerido) | Nodos del tronco principal, en orden. Cada uno puede traer `children` (sub-eventos de esa rama). |
| `className` | `string` | `""` | Clases adicionales para el `<ol>` raíz. |

## Tipos exportados

```ts
export interface BranchNode {
  id: string;
  title: string;
  time: string;
  status: "done" | "current" | "pending";
  children?: BranchNode[];
}
```

## Ejemplos

### Uso básico
```tsx
const nodes: BranchNode[] = [
  { id: "1", title: "Pedido confirmado", time: "10:00", status: "done" },
  {
    id: "2",
    title: "Pedido dividido en 2 envíos",
    time: "10:20",
    status: "done",
    children: [
      { id: "2a", title: "Envío A — en camino", time: "11:00", status: "current" },
      { id: "2b", title: "Envío B — en camino", time: "11:05", status: "current" },
    ],
  },
  { id: "3", title: "Entrega final", time: "—", status: "pending" },
];

<BranchingTimeline nodes={nodes} />
```

### Rama con un sub-evento pendiente
```tsx
<BranchingTimeline
  nodes={[
    { id: "1", title: "Solicitud recibida", time: "09:00", status: "done" },
    {
      id: "2",
      title: "Verificaciones en paralelo",
      time: "09:05",
      status: "current",
      children: [
        { id: "2a", title: "Verificación de identidad", time: "09:06", status: "done" },
        { id: "2b", title: "Verificación de domicilio", time: "—", status: "pending" },
      ],
    },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`: es HTML/SVG con Tailwind.
- Marcado como `"use client"`.

## Notas y comportamiento

- Aunque el tipo `BranchNode` es recursivo (`children` es `BranchNode[]`, que a su vez podría tener `children`), el componente **solo renderiza dos niveles**: el tronco principal y los `children` directos de cada nodo. Si un `child` trae a su vez `children`, esos nietos no se dibujan — no hay recursión real más allá del primer nivel de ramificación.
- Los `children` se dibujan más chicos (texto `text-[13px]`/`text-[11px]` vs. `text-sm`/`text-[11px]` del tronco) y con una línea vertical punteada (`border-dashed`) a la izquierda que los agrupa visualmente como "colgando" del nodo padre, en vez de la línea sólida continua del tronco.
- El estado `"current"` se marca igual que en `ActivityTimeline`: un punto blanco `animate-pulse` dentro del círculo, tanto en nodos del tronco como en `children`.
- Un nodo sin `children` (o con `children: []`) no dibuja la sección de ramas — el `.length > 0` es la única condición.
