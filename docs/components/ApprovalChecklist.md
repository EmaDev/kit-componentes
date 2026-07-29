# ApprovalChecklist

> Flujo de revisión y aprobación: checklist de verificación obligatoria, botón de aprobar (con estado "enviando") y rechazo con motivo escrito.

**Import**
```tsx
import { ApprovalChecklist } from "lib-kit-components";
import type { ApprovalItem } from "lib-kit-components";
```

## Cuándo usarlo

Para pantallas internas de moderación/aprobación (aprobar un documento, una solicitud, un pago pendiente, una publicación) donde antes de aprobar el revisor tiene que confirmar explícitamente una lista de puntos de control (`items`), y donde rechazar requiere justificar el motivo. El botón "Aprobar" queda deshabilitado hasta cumplir la condición de `requireAll`.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás una lista de checkboxes genérica (sin el flujo de aprobar/rechazar con motivo), usá [`Checkbox`/`CheckboxGroup`](Checkbox.md) directamente.
- Si el "aprobar" no depende de tildar ítems previos (por ejemplo, un simple modal de confirmación sí/no), usá [`Modal`](Modal.md) con dos botones en vez de `ApprovalChecklist`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `ApprovalItem[]` | — (requerido) | Puntos de control a verificar. |
| `onApprove` | `(checked: string[]) => void \| Promise<void>` | `undefined` | Se llama con los IDs tildados al confirmar la aprobación. Mientras la promesa está pendiente, el botón muestra un spinner y queda deshabilitado. |
| `onReject` | `(reason: string) => void \| Promise<void>` | `undefined` | Se llama con el motivo escrito al confirmar el rechazo. Sin esta prop, el botón "Rechazar" no se muestra. |
| `requireAll` | `boolean` | `true` | Si es `true`, hay que tildar **todos** los `items` para habilitar "Aprobar"; si es `false`, alcanza con tildar al menos uno. |
| `approveLabel` | `string` | `"Aprobar"` | Texto del botón de aprobación. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
interface ApprovalItem {
  id: string;
  label: string;
  description?: string;
}
```

## Ejemplos

### Uso básico (requiere tildar todo)
```tsx
const items: ApprovalItem[] = [
  { id: "identity", label: "La identidad del solicitante coincide con el documento" },
  { id: "docs", label: "Los documentos adjuntos están completos y son legibles" },
  { id: "policy", label: "La solicitud cumple con la política interna", description: "Ver políticas vigentes en el manual." },
];

<ApprovalChecklist
  items={items}
  onApprove={async (checked) => { await api.approve(requestId, checked); }}
  onReject={async (reason) => { await api.reject(requestId, reason); }}
/>
```

### Con al menos un ítem tildado (no todos)
```tsx
<ApprovalChecklist items={items} requireAll={false} approveLabel="Aprobar parcial" onApprove={handleApprove} />
```

## Requisitos / dependencias

- Sin dependencias externas más allá de React (`useState` para el checklist, el modo rechazo y el estado `busy`).
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- El botón "Rechazar" **sólo aparece si se pasa `onReject`**; si no se pasa, la única acción disponible es aprobar.
- Al tocar "Rechazar" se reemplaza la fila de botones por un `textarea` con foco automático (`autoFocus`) y un botón "Confirmar rechazo" que queda deshabilitado hasta que el motivo tenga contenido no vacío (`reason.trim()`).
- `busy` es un estado único (`"approve" | "reject" | null`) compartido entre ambas acciones: mientras una está en curso, ambos botones quedan deshabilitados (no se pueden disparar aprobar y rechazar al mismo tiempo).
- El checklist no se resetea automáticamente después de aprobar/rechazar — si el consumidor desmonta o vuelve a montar el componente tras la operación, el estado se pierde junto con el componente (comportamiento esperado, ya que normalmente se navega fuera de la pantalla al terminar).
