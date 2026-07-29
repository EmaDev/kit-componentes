# HowItWorksTimeline

> Explicativo "cómo funciona" numerado (1-2-3), horizontal o vertical, estático y sin interacción — para landing pages y onboarding informativo, no para procesos con estado real.

**Import**
```tsx
import { HowItWorksTimeline, type HowItWorksStep } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en secciones de landing o pantallas de onboarding que necesitan explicar un proceso en 3-5 pasos numerados de forma puramente informativa (ej. "1. Creá tu cuenta, 2. Elegí un plan, 3. Empezá a vender"). No tiene estado (`done`/`current`/`pending`) ni progreso real: todos los pasos se muestran igual salvo por su número/ícono.

## Cuándo NO usarlo / alternativas

- Si necesitás mostrar el progreso **real** de un usuario avanzando por pasos (con estado actual, completados, pendientes), usá [TrackingStepper](TrackingStepper.md) o [ActivityTimeline](ActivityTimeline.md) en vez de `HowItWorksTimeline`, que es estático por diseño.
- Si el paso a paso es interactivo y el usuario completa cada etapa dentro de la misma pantalla (formulario multi-paso), usá `OnboardingWizard` en vez de `HowItWorksTimeline`, que es solo explicativo.
- Si necesitás agrupar por trimestre/período con estado de avance (roadmap de producto), usá [Roadmap](Roadmap.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `HowItWorksStep[]` | — (requerido) | Pasos a mostrar, en orden. |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | `horizontal`: columnas en grid (`repeat(steps.length, 1fr)`), pensado para pocos pasos en pantallas anchas. `vertical`: lista con línea conectora, mejor para mobile o descripciones largas. |
| `className` | `string` | `""` | Clases adicionales para el contenedor raíz. |

## Tipos exportados

```ts
export interface HowItWorksStep {
  id: string;
  number?: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}
```

## Ejemplos

### Horizontal (default), landing
```tsx
const steps: HowItWorksStep[] = [
  { id: "1", title: "Creá tu cuenta", description: "Registrate en menos de un minuto." },
  { id: "2", title: "Elegí un plan", description: "Empezá gratis, escalá cuando lo necesites." },
  { id: "3", title: "Empezá a vender", description: "Publicá tu primer producto." },
];

<HowItWorksTimeline steps={steps} />
```

### Vertical, con íconos custom
```tsx
<HowItWorksTimeline
  orientation="vertical"
  steps={[
    { id: "1", title: "Subí tus documentos", description: "DNI y comprobante de domicilio.", icon: <UploadIcon /> },
    { id: "2", title: "Verificación automática", description: "Tarda entre 1 y 24 horas.", icon: <ShieldIcon /> },
    { id: "3", title: "Listo", description: "Ya podés operar sin límites.", icon: <CheckIcon /> },
  ]}
/>
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Marcado como `"use client"`, aunque no tiene estado propio.

## Notas y comportamiento

- Si no se pasa `icon` ni `number` en un paso, el círculo muestra el índice del array + 1 (`i + 1`) como número automático — no hace falta numerar manualmente si el orden del array ya es el correcto.
- `icon` tiene prioridad sobre `number`, que a su vez tiene prioridad sobre el índice automático (`s.icon ?? s.number ?? i + 1`).
- En orientación `horizontal`, el ancho de cada columna se define con `gridTemplateColumns: repeat(steps.length, minmax(0,1fr))` vía `style` inline — con muchos pasos (6+) las columnas se angostan mucho; para esos casos conviene usar `orientation="vertical"`.
- La línea conectora horizontal entre pasos está oculta por debajo del breakpoint `md` de Tailwind (`hidden md:block`), así que en mobile la orientación `horizontal` pierde la línea pero mantiene la grilla — si el layout mobile importa, `orientation="vertical"` da un resultado más prolijo en pantallas chicas.
- `description` es requerida (no opcional) en `HowItWorksStep`, a diferencia de otros componentes del lote donde suele ser opcional.
