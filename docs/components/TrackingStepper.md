# TrackingStepper

> Timeline horizontal de progreso tipo tracking de envío: íconos en fila conectados por una línea, con etiqueta y hora debajo de cada paso.

**Import**
```tsx
import { TrackingStepper, type TrackingStep } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando tenés pocos pasos (típicamente 3 a 5) que querés mostrar en una fila horizontal compacta, con el paso actual resaltado — el patrón clásico de "seguimiento de tu pedido" en la parte superior de una pantalla de detalle. Cada paso muestra un ícono de estado (check, punto pulsante, punto atenuado), una etiqueta corta y, opcionalmente, una hora.

## Cuándo NO usarlo / alternativas

- Si necesitás una lista vertical con más espacio para título/descripción por evento, usá [ActivityTimeline](ActivityTimeline.md) — `TrackingStepper` está pensado para etiquetas cortas (se trunca a un ancho fijo de 80px por paso) y no tiene campo de descripción.
- Si el proceso tiene ramas paralelas, usá [BranchingTimeline](BranchingTimeline.md).
- Si necesitás un stepper de formulario multi-paso con navegación entre pasos (no solo mostrar progreso), mirá `StepsProgress` (de `Progress`) en vez de `TrackingStepper`, que es puramente informativo.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `TrackingStep[]` | — (requerido) | Pasos a mostrar en fila, de izquierda a derecha. |
| `className` | `string` | `""` | Clases adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface TrackingStep {
  id: string;
  label: string;
  time?: string;
  status: "done" | "current" | "pending";
}
```

## Ejemplos

### Uso básico
```tsx
const steps: TrackingStep[] = [
  { id: "1", label: "Confirmado", time: "10:00", status: "done" },
  { id: "2", label: "Preparando", time: "10:30", status: "done" },
  { id: "3", label: "En camino", time: "12:00", status: "current" },
  { id: "4", label: "Entregado", status: "pending" },
];

<TrackingStepper steps={steps} />
```

### Sin horas (solo estado)
```tsx
<TrackingStepper
  steps={[
    { id: "1", label: "Solicitado", status: "done" },
    { id: "2", label: "Aprobado", status: "current" },
    { id: "3", label: "Finalizado", status: "pending" },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`: HTML/SVG con Tailwind.
- Marcado como `"use client"`.

## Notas y comportamiento

- El layout es `flex items-start`, y cada paso salvo el último ocupa `flex-1` para que la línea conectora se estire y reparta el espacio disponible automáticamente — no hace falta anchos fijos ni pasar la cantidad de pasos aparte.
- La etiqueta (`label`) tiene un ancho fijo de `w-20` (80px) con `leading-tight`, pensado para 1-2 palabras cortas; textos largos se van a envolver en varias líneas dentro de ese ancho fijo, no truncan con ellipsis.
- La línea conectora entre dos pasos toma color `success` únicamente si el paso de la **izquierda** tiene `status: "done"`; en cualquier otro caso (incluido `"current"`) usa el color `border` neutro.
- El punto dentro del ícono usa `animate-pulse` solo cuando `status === "current"`; los pasos `"pending"` muestran un punto atenuado (`bg-muted/50`) sin animación.
- `time` es opcional por paso — podés omitirlo en algunos pasos y ponerlo en otros sin que rompa el layout, ya que cada paso reserva su propio espacio verticalmente independiente del resto.
