# CollapsibleFormSections

> Formulario largo dividido en secciones colapsables independientes, cada una con título, descripción opcional y contenido en grilla de 2 columnas.

**Import**
```tsx
import { CollapsibleFormSections } from "lib-kit-components";
import type { FormSection } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para formularios de configuración largos (ajustes de cuenta, configuración avanzada de un producto, checkout con varias secciones) donde agrupar los campos en bloques colapsables reduce el scroll inicial y deja claro qué está completado. Cada sección se abre/cierra independientemente de las demás — no es un acordeón exclusivo (pueden estar varias abiertas a la vez).

## Cuándo NO usarlo / alternativas

- Si el formulario debe completarse en un flujo **lineal y secuencial** (un paso a la vez, con validación antes de avanzar y sin ver los pasos siguientes), usá [OnboardingWizard](OnboardingWizard.md) en vez de `CollapsibleFormSections` — acá todas las secciones son visibles/navegables libremente y no hay noción de "paso actual" ni validación por sección.
- Si el contenido a agrupar no son campos de formulario sino contenido general navegable por pestañas (no colapsable, una sección visible a la vez ocupando todo el espacio), usá [Tabs](Tabs.md).
- Si sólo necesitás un bloque colapsable suelto (no una lista de secciones de formulario), armalo con [Card](Card.md) + estado local — `CollapsibleFormSections` está pensado específicamente para la lista completa con divisores entre secciones.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `sections` | `FormSection[]` | — (requerido) | Secciones a renderizar, en orden. |
| `className` | `string` | `""` | Clases adicionales del contenedor raíz. |

### FormSection

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador único (clave de React y del estado abierto/cerrado). |
| `title` | `string` | Título de la sección. |
| `description` | `string` (opcional) | Texto secundario debajo del título. |
| `content` | `React.ReactNode` | Contenido de la sección; se renderiza dentro de un `grid sm:grid-cols-2 gap-3` — pensado para pares de campos de formulario. |
| `defaultOpen` | `boolean` (opcional) | Si la sección arranca abierta. Default `false` (cerrada). |

## Tipos exportados

```ts
interface FormSection {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  defaultOpen?: boolean;
}
```

## Ejemplos

### Uso básico
```tsx
<CollapsibleFormSections
  sections={[
    {
      id: "perfil",
      title: "Perfil",
      description: "Información pública de tu cuenta",
      defaultOpen: true,
      content: (
        <>
          <Input label="Nombre" />
          <Input label="Usuario" />
        </>
      ),
    },
    {
      id: "notificaciones",
      title: "Notificaciones",
      content: (
        <>
          <Switch label="Email" />
          <Switch label="Push" />
        </>
      ),
    },
  ]}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- Sin dependencias externas (no usa `framer-motion`).

## Notas y comportamiento

- El estado abierto/cerrado es **interno** (`useState` inicializado desde `defaultOpen` de cada sección) — el componente no es controlable desde afuera; si `sections` cambia de identidad (nuevo array con los mismos `id`), el estado ya abierto se conserva porque está indexado por `id`, pero si cambian los `id` se reinicia a los `defaultOpen` de las nuevas secciones.
- No hay animación de apertura/cierre (no usa `framer-motion`): el contenido aparece/desaparece de forma instantánea, sólo la flecha rota con `transition-transform`.
- El grid de 2 columnas del `content` es fijo (`sm:grid-cols-2`) — para contenido que no encaja en ese layout (ej. un único campo ancho), hay que forzarlo con `className="sm:col-span-2"` en el elemento hijo correspondiente.
