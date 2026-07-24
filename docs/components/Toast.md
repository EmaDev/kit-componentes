# Toast (ToastProvider / useToast)

> Sistema de notificaciones tipo "snackbar" no bloqueantes, apiladas en la esquina superior derecha, con auto-dismiss configurable.

**Import**
```tsx
import { ToastProvider, useToast } from "lib-kit-components";
import type { Toast } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para feedback transitorio que no requiere que el usuario tome una decisión inmediata: "Guardado con éxito", "Error al subir el archivo", "Conexión perdida", con o sin una acción secundaria opcional (ej. "Deshacer"). El usuario puede seguir interactuando con el resto de la app mientras el toast está visible.

## Cuándo NO usarlo / alternativas

- Si necesitás que el usuario confirme algo antes de continuar (una decisión bloqueante), usá `Modal` o `BottomSheet`, no un toast — los toasts se autodescartan y no bloquean interacción.
- Para mensajes de error/ayuda asociados a un campo específico de un formulario, usá la prop `error`/`hint` de `Input`, `Textarea` o `Select` en vez de un toast.

## Props

`ToastProvider` no recibe props de configuración, sólo `children`.

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — (requerido) | Árbol de la app que tendrá acceso a `useToast()`. |

`useToast()` devuelve:

| Miembro | Tipo | Descripción |
|---|---|---|
| `toast` | `(t: Omit<Toast, "id">) => string` | Crea y muestra un toast. Devuelve el `id` generado (string aleatorio). |
| `dismiss` | `(id: string) => void` | Descarta manualmente un toast por su `id`. |

## Tipos exportados

```ts
export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "error" | "info" | "warning";
  duration?: number;
  action?: { label: string; onClick: () => void };
}
```

Al llamar `toast(t)`, si no especificás `variant` o `duration`, se aplican los defaults `variant: "info"` y `duration: 4000` (milisegundos).

## Ejemplos

### Uso básico
```tsx
// en el layout raíz
<ToastProvider>
  <App />
</ToastProvider>

// en cualquier componente hijo
function SaveButton() {
  const { toast } = useToast();
  return (
    <Button onClick={() => toast({ title: "Guardado con éxito", variant: "success" })}>
      Guardar
    </Button>
  );
}
```

### Con descripción y acción
```tsx
const { toast } = useToast();

toast({
  title: "Producto eliminado",
  description: "El producto se quitó del catálogo.",
  variant: "info",
  action: { label: "Deshacer", onClick: () => restoreProduct(id) },
});
```

### Toast persistente (sin auto-dismiss)
```tsx
const { toast, dismiss } = useToast();

const id = toast({
  title: "Subiendo archivo…",
  variant: "warning",
  duration: 0, // no se autodescarta
});

// luego, al terminar la subida:
dismiss(id);
```

### Error
```tsx
toast({
  title: "Error al procesar el pago",
  description: "Verificá los datos de tu tarjeta e intentá de nuevo.",
  variant: "error",
});
```

## Requisitos / dependencias

- **Debe montarse `<ToastProvider>` una sola vez, envolviendo el árbol de la app** (por ejemplo en el `layout.tsx` raíz). Llamar a `useToast()` fuera de un `ToastProvider` lanza `Error("useToast must be used inside <ToastProvider>")`.
- Usa `framer-motion` internamente (`AnimatePresence`, animaciones de entrada/salida y `layout` para el reflow al apilar/quitar toasts).
- Marcado como `"use client"`.

## Notas y comportamiento

- Los toasts se apilan verticalmente en un contenedor fijo `top-4 right-4`, ancho de 360px (`max-w-[calc(100vw-2rem)]` en mobile); los nuevos se agregan al final del array (aparecen abajo de los existentes) y entran deslizándose desde la derecha.
- No hay límite máximo de toasts simultáneos — se acumulan todos los que se disparen.
- **Gotcha**: pasar el mouse sobre un toast (`hover`) sólo resetea visualmente la barra de progreso inferior (la anima de vuelta a llena), pero **no pausa realmente el temporizador** de auto-dismiss — el `setTimeout` que descarta el toast se programó una sola vez al crearlo y sigue corriendo en segundo plano. Es decir, el toast puede desaparecer mientras el usuario todavía lo tiene el mouse encima, aunque la barra visual sugiera que "se pausó".
- La barra de progreso inferior sólo se renderiza si `duration > 0`; con `duration: 0` (o negativo) el toast no se autodescarta y tampoco muestra barra.
- El botón de acción (`action.onClick`) **no** descarta el toast automáticamente al hacer click — si querés que se cierre, llamá `dismiss(id)` vos mismo dentro del handler.
- El botón de cerrar (×) siempre está presente, independientemente de `duration`.
