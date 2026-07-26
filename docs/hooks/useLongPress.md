# useLongPress

> Gesto de mantener presionado, listo para pegar como props de un elemento (`onPointerDown`/`onPointerMove`/etc). Cancela automáticamente si el dedo se mueve, para no pelearse con el scroll de la lista.

**Import**
```ts
import { useLongPress } from "lib-kit-components";
```

## Cuándo usarlo

Para menús contextuales táctiles (mantener presionado un ítem de una lista para ver opciones), reordenar drag-and-drop que arranca con long-press, o cualquier acción secundaria que no quepa en un tap simple. Devuelve un objeto de handlers de puntero listo para spread directo sobre el elemento — no envuelve nada, no agrega markup.

## Firma

```ts
function useLongPress(
  onLongPress: () => void,
  options?: {
    delay?: number;
    tolerance?: number;
    haptic?: boolean;
    onClick?: () => void;
  }
): {
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  onPointerLeave: () => void;
  onPointerCancel: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `onLongPress` | `() => void` | — (requerido) | Se dispara al cumplirse `delay` sin soltar ni mover más de `tolerance`. |
| `delay` | `number` | `450` | ms para considerar long-press. |
| `tolerance` | `number` | `10` | px de movimiento que cancelan el gesto (para distinguir de un scroll/drag). |
| `haptic` | `boolean` | `true` | Vibrar (patrón `"tap"` de `useHaptics`) al disparar. |
| `onClick` | `() => void` | `undefined` | Se llama si el usuario soltó **antes** del `delay` (equivalente a un tap normal). |

## Ejemplos

### Menú contextual en una fila de lista
```tsx
function ListRow({ item, onOpenMenu, onTap }: Props) {
  const longPress = useLongPress(() => onOpenMenu(item), { onClick: () => onTap(item) });
  return <div {...longPress} className="p-3 rounded-xl bg-surface-alt">{item.name}</div>;
}
```

### Sin feedback táctil, tolerancia más amplia
```tsx
const props = useLongPress(startDrag, { haptic: false, tolerance: 24, delay: 300 });
```

## Notas y comportamiento

- El hook incluye `onContextMenu` con `preventDefault()` — evita que el menú contextual nativo del navegador (o el callout de "copiar/compartir" de iOS) aparezca al mismo tiempo que tu propio long-press.
- Si el puntero se mueve más de `tolerance` px antes de que venza `delay`, el timer se cancela silenciosamente y **no** se llama a `onClick` ni a `onLongPress` — pensado para que un scroll o un swipe que empieza sobre el elemento no dispare el gesto por error.
- `onLongPress` se lee desde un `ref` que se actualiza en cada render, así que no hace falta memoizarlo para que el hook siempre use la versión más reciente.
- Combina naturalmente con `useSwipe` en el mismo elemento sólo si coordinás vos los handlers de puntero (ambos hooks devuelven su propio set de `onPointerDown`/`onPointerUp`) — spreadear ambos objetos en el mismo elemento hace que el segundo pise los handlers del primero; combinalos manualmente si necesitás los dos gestos a la vez.
