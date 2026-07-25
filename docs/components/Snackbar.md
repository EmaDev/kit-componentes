# Snackbar (SnackbarProvider / useSnackbar)

> Snackbar tipo Material: uno a la vez, cola FIFO, acción inline ("Deshacer"), barra de tiempo, swipe horizontal para descartar y respeto de safe-area + teclado virtual.

**Import**
```tsx
import { SnackbarProvider, useSnackbar } from "lib-kit-components";
import type { Snack, SnackbarVariant, SnackbarPosition } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para confirmaciones puntuales de una acción del usuario que admiten deshacer o requieren una sola acción secundaria: "Factura eliminada · Deshacer", "Cambios publicados". A diferencia de `Toast`, `Snackbar` muestra **una a la vez** (cola FIFO) — la siguiente espera a que la actual se cierre — lo que la hace apropiada para el patrón "acción → confirmación → posible deshacer" sin apilar mensajes.

## Cuándo NO usarlo / alternativas

- Si necesitás notificaciones que se acumulan (varias visibles a la vez, sin esperar cola), usá [Toast](Toast.md).
- Si el mensaje requiere que el usuario decida algo antes de continuar (bloqueante), usá [Modal](Modal.md), no un snackbar.
- Para errores/ayuda de un campo específico de formulario, usá la prop `error`/`hint` de `Input`/`Textarea`/`Select`.

## Props

`SnackbarProvider`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `children` | `ReactNode` | — (requerido) | Árbol de la app con acceso a `useSnackbar()`. |
| `position` | `SnackbarPosition` | `"bottom-center"` | Dónde aparece: `bottom-center` \| `bottom-left` \| `bottom-right` \| `top-center`. |
| `gap` | `number` | `16` | Separación en px respecto del borde (además de `--sa-*`/`--kb-inset`). |

`useSnackbar()` devuelve:

| Miembro | Tipo | Descripción |
|---|---|---|
| `snack` | `(s: Omit<Snack, "id">) => string` | Encola un snack (si hay uno visible, espera su turno). Devuelve el `id` generado. |
| `undo` | `(message: string, onUndo: () => void, duration?: number) => string` | Atajo: encola un snack con acción "Deshacer" (`duration` default `6000`). |
| `dismiss` | `(id?: string) => void` | Cierra el snack con ese `id`, o el actual si se omite. |

## Tipos exportados

```ts
export interface Snack {
  id: string;
  message: string;
  variant?: "neutral" | "success" | "error" | "info";
  duration?: number;      // ms visible; 0 = hasta que el usuario lo cierre. Default 4000
  action?: { label: string; onClick: () => void };
  closeable?: boolean;    // muestra la X de cierre. Default false si hay acción
}
type SnackbarVariant = "neutral" | "success" | "error" | "info";
type SnackbarPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center";
```

## Ejemplos

### Uso básico
```tsx
// en el layout raíz
<SnackbarProvider position="bottom-center">{children}</SnackbarProvider>

// en cualquier componente hijo
const { snack } = useSnackbar();
snack({ message: "Cambios publicados", variant: "success" });
```

### Patrón deshacer
```tsx
const { undo } = useSnackbar();

function onDeleteRow(row) {
  removeLocally(row.id);
  undo(`«${row.title}» eliminada`, () => restore(row));
}
```

### Persistente hasta cerrar manualmente
```tsx
const { snack, dismiss } = useSnackbar();

const id = snack({ message: "Sincronizando…", duration: 0, closeable: true });
// luego:
dismiss(id);
```

## Requisitos / dependencias

- **Debe montarse `<SnackbarProvider>` una sola vez**, envolviendo el árbol de la app. Llamar `useSnackbar()` afuera lanza `Error("useSnackbar must be used inside <SnackbarProvider>")`.
- Usa `framer-motion` (`AnimatePresence`, drag horizontal para el swipe).
- Marcado como `"use client"`.
- Respeta `var(--sa-bottom)`/`var(--sa-top)` y `var(--kb-inset)` (ver [usePlatform](../hooks/usePlatform.md) y [useKeyboardInset](../hooks/useKeyboardInset.md)) — funciona bien sin ellos (caen a `0px`).

## Notas y comportamiento

- **Uno a la vez**: aunque encoles varios `snack()` seguidos, sólo el primero de la cola es visible; los siguientes aparecen cuando el actual se descarta (por tiempo, cierre manual, swipe o acción).
- El arrastre horizontal (`drag="x"`) descarta el snack si el desplazamiento supera 90px al soltar.
- La barra de progreso inferior sólo se muestra si `duration` es truthy; se pausa visualmente mientras el mouse está encima (`onMouseEnter`/`onMouseLeave`), y el `setTimeout` se reprograma en cada cambio de `hover` — a diferencia de `Toast`, acá el hover sí frena el auto-dismiss real.
- El botón de cerrar (×) sólo se muestra si `closeable` es `true` o si el snack **no** tiene `action` — con acción y `closeable: false` (default), la única forma de cerrarlo antes de tiempo es el swipe.
- Al hacer click en `action.onClick`, el snack se descarta automáticamente después.
