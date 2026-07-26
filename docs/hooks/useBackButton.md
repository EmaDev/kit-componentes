# useBackButton

> Captura el botón físico "atrás" de Android (y el gesto de swipe del sistema) para cerrar un overlay propio en vez de sacar al usuario de la PWA, empujando una entrada sintética al historial mientras la capa está abierta.

**Import**
```ts
import { useBackButton } from "lib-kit-components";
```

## Cuándo usarlo

En cualquier overlay a pantalla completa o modal que armes vos mismo (no `Modal`/`BottomSheet` de la librería, que podés envolver con este hook si necesitás este comportamiento) que deba cerrarse con el botón atrás de Android en vez de navegar fuera de la app. Sin este hook, presionar atrás con un modal abierto saca al usuario de la PWA en vez de sólo cerrar el modal — una fuente común de quejas en apps instaladas en Android.

## Cuándo NO usarlo / alternativas

- Si tu overlay ya usa `history.pushState` por su cuenta (por ejemplo, un router que trata cada modal como una ruta), no lo combines con `useBackButton` para evitar pushes duplicados.
- No hace nada en iOS/desktop más allá de agregar una entrada de historial inofensiva — el swipe-back de iOS Safari no pasa por `popstate` de la misma manera, así que el efecto principal es específico de Android.

## Firma

```ts
function useBackButton(options: {
  active: boolean;
  onBack: () => void;
  id?: string;
}): void
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `active` | `boolean` | — (requerido) | Mientras es `true`, el botón/gesto atrás ejecuta `onBack` en vez de navegar. Pasá el mismo `open` de tu overlay. |
| `onBack` | `() => void` | — (requerido) | Qué hacer con el back (normalmente, cerrar el overlay). |
| `id` | `string` | `"overlay"` | Identificador del estado en el historial — usá uno distinto por tipo de overlay si tenés varios anidados. |

## Ejemplos

### Cerrar un overlay propio con el botón atrás de Android
```tsx
function FullscreenGallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  useBackButton({ active: open, onBack: onClose, id: "gallery" });

  if (!open) return null;
  return <div className="fixed inset-0 z-50">{/* … */}</div>;
}
```

### Varios overlays anidados, con ids distintos
```tsx
useBackButton({ active: sheetOpen, onBack: closeSheet, id: "sheet" });
useBackButton({ active: confirmOpen, onBack: closeConfirm, id: "confirm" }); // se cierra primero si está sobre el sheet
```

## Notas y comportamiento

- Al activarse (`active: true` y no había ya una entrada pusheada), el hook hace `window.history.pushState({ __overlay: id }, "")` — por eso, si el usuario navega atrás, el navegador dispara `popstate` en vez de salir de la app, y el hook llama a `onBack` en lugar de dejar navegar.
- Si el overlay se cierra **por UI** (el usuario tocó la X, no el botón atrás), el hook detecta que la entrada sigue "pusheada" pero `active` pasó a `false`, y llama a `window.history.back()` él mismo para limpiar la entrada sintética que había agregado — así el historial no acumula entradas fantasma.
- El callback `onBack` se lee desde un `ref` que se actualiza en cada render, así que no hace falta memoizarlo con `useCallback` para que el hook use siempre la versión más reciente.
- No hace nada en el servidor (`typeof window === "undefined"` corta temprano) — seguro de usar en componentes que se renderizan en SSR.
