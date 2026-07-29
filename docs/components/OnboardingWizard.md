# OnboardingWizard

> Wizard de pasos lineal: barra de progreso, validación por paso, pasos opcionales y navegación atrás/siguiente.

**Import**
```tsx
import { OnboardingWizard } from "lib-kit-components";
import type { WizardStep } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para flujos secuenciales donde el usuario avanza de a un paso a la vez y no debería (o no puede) ver los pasos siguientes hasta completar el actual: onboarding de cuenta nueva, alta de un producto en varios pasos, checkout guiado. Muestra una barra de progreso segmentada arriba, el título/descripción del paso actual, su contenido, y botones Atrás/Siguiente (el último paso cambia "Siguiente" por `finishLabel`).

## Cuándo NO usarlo / alternativas

- Si todas las secciones del formulario deben quedar visibles y navegables libremente (no un flujo forzado paso a paso), usá [CollapsibleFormSections](CollapsibleFormSections.md) en vez de `OnboardingWizard`.
- Si sólo necesitás **mostrar** en qué etapa está un proceso (sin que el usuario navegue entre pasos, ej. seguimiento de un pedido), usá [TrackingStepper](TrackingStepper.md) — es puramente informativo, no interactivo.
- Si el flujo de pasos vive dentro de un diálogo modal en vez de en la página, envolvé el contenido de cada paso igual, pero montá `OnboardingWizard` dentro de [Modal](Modal.md) o [BottomSheet](BottomSheet.md) según el caso.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `WizardStep[]` | — (requerido) | Pasos del wizard, en orden. |
| `onFinish` | `() => void \| Promise<void>` | `undefined` | Se llama al confirmar el último paso; si es async, el botón queda deshabilitado y muestra un spinner hasta que resuelva. |
| `onStepChange` | `(idx: number) => void` | `undefined` | Se llama con el nuevo índice al navegar (Atrás, Siguiente u Omitir). |
| `finishLabel` | `string` | `"Empezar"` | Texto del botón en el último paso. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

### WizardStep

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único del paso. |
| `title` | `string` | Título mostrado sobre el contenido. |
| `description` | `string` (opcional) | Texto secundario debajo del título. |
| `content` | `React.ReactNode` | Contenido del paso. |
| `optional` | `boolean` (opcional) | Si es `true`, agrega un badge "· opcional" al indicador de paso y muestra un botón "Omitir" (salvo en el último paso). |
| `validate` | `() => boolean` (opcional) | Si se pasa, el botón Siguiente/Finalizar se deshabilita mientras devuelva `false`. Se reevalúa en cada render, así que debe depender del estado externo del formulario. |

## Tipos exportados

```ts
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  optional?: boolean;
  validate?: () => boolean;
}
```

## Ejemplos

### Uso básico
```tsx
const [nombre, setNombre] = useState("");

<OnboardingWizard
  steps={[
    {
      id: "bienvenida",
      title: "Bienvenido",
      description: "Configuremos tu cuenta en 3 pasos.",
      content: <p className="text-sm text-muted">Vamos a pedirte algunos datos.</p>,
    },
    {
      id: "datos",
      title: "Tus datos",
      content: <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />,
      validate: () => nombre.trim().length > 0,
    },
    {
      id: "notificaciones",
      title: "Notificaciones",
      optional: true,
      content: <Switch label="Recibir novedades por email" />,
    },
  ]}
  onFinish={async () => { await crearCuenta(); }}
  finishLabel="Crear cuenta"
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas (no usa `framer-motion`; la barra de progreso cambia de color con `transition-colors` en CSS).

## Notas y comportamiento

- El índice del paso actual (`idx`) es estado **interno**; no hay prop `value`/`step` controlado desde afuera — para saltar a un paso arbitrario desde el padre, hay que usar `onStepChange` sólo como notificación de lectura (no fuerza el índice de vuelta).
- `validate` se ejecuta en cada render del componente (no memoizado), así que debe ser una función barata y derivada del estado externo (ej. `() => nombre.length > 0`), no un chequeo costoso.
- Omitir un paso opcional simplemente avanza el índice (`go(idx + 1)`) sin llamar `onFinish` aunque sea el único paso restante antes del final — el botón "Omitir" no aparece en el último paso.
- Si `onFinish` no está definido, confirmar el último paso no hace nada visible (no navega, no resetea) — es responsabilidad del consumidor manejar la redirección u otro efecto dentro de `onFinish`.
- No expone ningún token de estilo para cambiar el color de la barra de progreso: siempre usa `bg-primary`/`bg-border`.
