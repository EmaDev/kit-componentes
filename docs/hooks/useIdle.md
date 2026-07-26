# useIdle

> Detecta inactividad del usuario (sin mover el mouse, tocar la pantalla ni escribir) para cerrar sesión, bloquear con PIN o pausar polling — con un aviso previo configurable para preguntar "¿seguís ahí?" antes de actuar.

**Import**
```ts
import { useIdle } from "lib-kit-components";
```

## Cuándo usarlo

Para políticas de seguridad de sesión (cerrar sesión tras N minutos sin actividad, mostrar `PinLock`/`BiometricGate` de nuevo) o para pausar trabajo costoso mientras el usuario no está mirando la pantalla (polling, animaciones, `useCachedFetch` con `revalidateOnFocus`). El flujo típico usa `onWarn` para mostrar un modal de cuenta regresiva y `onIdle` para ejecutar la acción final.

## Firma

```ts
function useIdle(options?: {
  timeout?: number;
  warnBefore?: number;
  onIdle?: () => void;
  onWarn?: () => void;
  activityOnFocus?: boolean;
}): {
  idle: boolean;
  warning: boolean;
  remaining: number;
  secondsLeft: number;
  reset: () => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `timeout` | `number` | `300000` (5 min) | ms de inactividad antes de marcar `idle`. |
| `warnBefore` | `number` | `30000` (30 s) | ms antes de `timeout` en los que se activa `warning` (para el modal de aviso). |
| `onIdle` | `() => void` | `undefined` | Se llama una vez, al cruzar el umbral de `timeout`. |
| `onWarn` | `() => void` | `undefined` | Se llama una vez, al entrar en la ventana de aviso. |
| `activityOnFocus` | `boolean` | `true` | Contar como actividad el volver a la pestaña/app (evento `focus`). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `idle` | `boolean` | Se cruzó `timeout` sin actividad. |
| `warning` | `boolean` | Está en la ventana de aviso (entre `timeout - warnBefore` y `timeout`). |
| `remaining` | `number` | ms restantes hasta `idle`. |
| `secondsLeft` | `number` | `remaining` redondeado hacia arriba, en segundos — listo para mostrar una cuenta regresiva. |
| `reset` | `() => void` | Reinicia el contador manualmente (por ejemplo, tras un "seguir conectado"). |

## Ejemplos

### Cerrar sesión con aviso previo
```tsx
function SessionGuard({ onLogout }: { onLogout: () => void }) {
  const { warning, secondsLeft, reset } = useIdle({
    timeout: 10 * 60_000,
    warnBefore: 30_000,
    onIdle: onLogout,
  });

  return (
    <Modal open={warning} onClose={reset} title="¿Seguís ahí?">
      <p>Tu sesión se cerrará en {secondsLeft}s por inactividad.</p>
      <Button onClick={reset}>Seguir conectado</Button>
    </Modal>
  );
}
```

### Pausar un polling costoso mientras el usuario no interactúa
```tsx
const { idle } = useIdle({ timeout: 2 * 60_000 });

useEffect(() => {
  if (idle) return; // no arranca el intervalo mientras está idle
  const id = setInterval(refetch, 15_000);
  return () => clearInterval(id);
}, [idle]);
```

## Notas y comportamiento

- Los eventos de actividad escuchados son `pointerdown`, `keydown`, `wheel`, `touchstart` y `scroll` (todos pasivos) — mover el mouse **sin** hacer click no cuenta como actividad; si necesitás capturar `mousemove` también, envolvé el hook o llamá a `reset()` vos mismo desde tu propio listener.
- El chequeo corre en un `setInterval` de 1 segundo (no en cada evento de actividad) — por diseño, `secondsLeft` no es milimétricamente preciso, es una cuenta regresiva a resolución de 1s, suficiente para UI.
- `onIdle`/`onWarn` se disparan **una sola vez** por transición (usan el estado previo para no reinvocar en cada tick mientras siguen en el mismo estado) — no se re-disparan repetidamente mientras el usuario sigue inactivo.
- `reset()` vuelve `idle`/`warning` a `false` y reinicia el conteo desde `timeout` — usalo tanto para un botón "seguir conectado" como para forzar una reactivación manual tras una acción que no dispara los eventos de actividad escuchados (por ejemplo, una respuesta de red).
