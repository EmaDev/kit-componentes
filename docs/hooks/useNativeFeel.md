# useNativeFeel

> Convierte la web app en algo que se siente nativo: bloquea el pinch-zoom, el pull-to-refresh, el menú contextual y la selección de texto. Todo reversible al desmontar.

**Import**
```ts
import { useNativeFeel, type NativeFeelOptions } from "lib-kit-components";
```

## Cuándo usarlo

Montalo una única vez, lo más arriba posible del árbol (layout raíz o dentro del componente `ViewportLock`, que usa este hook internamente), en apps que quieren comportarse como una app instalada/nativa en vez de una página web normal: sin zoom accidental al hacer doble tap, sin que el pull-to-refresh del navegador dispare al arrastrar hacia abajo, sin menú de "copiar/compartir" al mantener presionado sobre imágenes o texto. Usalo directo (en vez de sólo `ViewportLock`) si necesitás activar/desactivar selectivamente algunos de estos comportamientos, o condicionarlos dinámicamente (por ejemplo sólo cuando la app corre instalada).

## Firma

```ts
function useNativeFeel(options?: NativeFeelOptions): void
```

Este hook no devuelve nada: es un hook de efecto puro (side-effect only).

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `blockZoom` | `boolean` | `true` | Bloquea pinch-zoom, doble-tap zoom y zoom con ctrl+scroll/ctrl+teclas en desktop. |
| `blockOverscroll` | `boolean` | `true` | Bloquea el pull-to-refresh y el rebote elástico de scroll del body (`overscroll-behavior: none`). |
| `blockContextMenu` | `boolean` | `true` | Bloquea el menú contextual (long-press en mobile / click derecho en desktop), excepto dentro de `input`, `textarea` o `[contenteditable]` (para no romper pegar/autocompletar ahí). |
| `blockTextSelection` | `boolean` | `true` | Bloquea la selección de texto fuera de inputs (`user-select: none` + `-webkit-touch-callout: none` para el menú de "Copiar" de iOS). |
| `patchViewportMeta` | `boolean` | `true` | Reescribe (o crea) el `<meta name="viewport">` con `user-scalable=no`. Es la **única vía** para frenar el pinch-zoom nativo del navegador en iOS, donde no se puede cancelar por JS con `preventDefault()` en los gestos. Sólo tiene efecto si `blockZoom` también es `true`. |
| `disabled` | `boolean` | `false` | Desactiva todo el hook (por ejemplo, si el usuario activó una preferencia de accesibilidad, o mientras la app corre en el navegador normal en vez de instalada). |

## Valor de retorno

Ninguno — `useNativeFeel` sólo aplica y limpia efectos secundarios sobre `document`. No hay tabla de retorno.

## Ejemplos

### Uso básico en el layout raíz
```tsx
"use client";
import { useNativeFeel } from "lib-kit-components";

export function RootShell({ children }: { children: React.ReactNode }) {
  useNativeFeel();
  return <>{children}</>;
}
```

### Sólo activarlo una vez instalada (recomendado por accesibilidad)
```tsx
import { useNativeFeel, usePlatform } from "lib-kit-components";

function AppShell({ children }: { children: React.ReactNode }) {
  const { isStandalone, hydrating } = usePlatform();
  useNativeFeel({ disabled: hydrating || !isStandalone });
  return <>{children}</>;
}
```

### Configuración selectiva (deja el zoom nativo, sólo bloquea overscroll y long-press)
```tsx
useNativeFeel({
  blockZoom: false,
  patchViewportMeta: false,
  blockOverscroll: true,
  blockContextMenu: true,
  blockTextSelection: false,
});
```

## Notas y comportamiento

- **El bloqueo de zoom en iOS se implementa reescribiendo `<meta name="viewport">`** (con `user-scalable=no, minimum-scale=1, maximum-scale=1`) porque no existe otra forma de cancelar el pinch-zoom nativo de Safari desde JavaScript en iOS. Si no existe ya un tag `<meta name="viewport">` en el documento, el hook crea uno y lo **elimina por completo** al desmontar; si ya existía, guarda su `content` original y lo **restaura** al desmontar (no lo elimina).
- Además del meta tag, para otros navegadores/gestos bloquea: `gesturestart/gesturechange/gestureend` (Safari), `touchmove` multi-touch (Chromium/Android, pinch), doble-tap rápido (heurística de <320ms entre `touchend`), y `ctrl/cmd + scroll`/`ctrl + +/-/=/0` en desktop. También fija `touchAction: "pan-x pan-y"` en `<html>`.
- Todo es **completamente reversible**: cada efecto guarda el valor previo (estilos inline, contenido del meta tag) y lo restaura en la función de limpieza al desmontar o al cambiar cualquier opción (todas las opciones están en el array de dependencias del `useEffect`).
- **Advertencia de accesibilidad** (documentada en el propio código fuente): bloquear el zoom rompe el criterio WCAG 1.4.4 (Resize Text). Usalo sólo en apps instaladas / tipo juego donde el zoom del navegador no tiene sentido, y ofrecé tu propio control de tamaño de texto dentro de la app. El patrón recomendado por el propio hook es atarlo a la instalación: `useNativeFeel({ disabled: !isStandalone })`.
- No hace nada en SSR (`typeof document === "undefined"` corta el efecto antes de tocar nada); no hay estado, así que tampoco hay riesgo de mismatch de hidratación.
- Montá **un solo** `useNativeFeel` activo a la vez en el árbol: si dos instancias con distinta configuración de `patchViewportMeta` conviven, sus efectos de limpieza pueden pisarse entre sí sobre el mismo `<meta name="viewport">`.
