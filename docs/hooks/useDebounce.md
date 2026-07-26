# useDebounce / useDebouncedCallback / useThrottledCallback

> Tres primitivas de control de frecuencia: `useDebounce` retrasa un **valor**, `useDebouncedCallback` retrasa la **ejecución** de una función, `useThrottledCallback` limita cuántas veces por segundo puede ejecutarse.

**Import**
```ts
import { useDebounce, useDebouncedCallback, useThrottledCallback } from "lib-kit-components";
```

## Cuándo usarlo

- `useDebounce(value)`: cuando tenés un **estado controlado** (el `value` de un input) y querés reaccionar a él sólo cuando el usuario paró de escribir — el caso típico es un buscador que dispara un fetch.
- `useDebouncedCallback(fn)`: cuando lo que querés retrasar es una **función** que llamás vos directamente (no ligada al render de un valor), por ejemplo un autoguardado disparado por varios eventos distintos.
- `useThrottledCallback(fn)`: cuando el evento dispara con mucha frecuencia (scroll, resize, `pointermove`) y necesitás ejecutar tu handler como mucho una vez cada tantos ms, sin acumular retraso.

## Firma

```ts
function useDebounce<T>(value: T, delay?: number): T;
function useDebouncedCallback<A extends unknown[]>(fn: (...args: A) => void, delay?: number): (...args: A) => void;
function useThrottledCallback<A extends unknown[]>(fn: (...args: A) => void, ms?: number): (...args: A) => void;
```

## Parámetros

| Hook | Parámetro | Default | Descripción |
|---|---|---|---|
| `useDebounce` | `delay` | `300` | ms de espera tras el último cambio de `value` antes de propagarlo. |
| `useDebouncedCallback` | `delay` | `300` | ms de espera tras la última llamada antes de ejecutar `fn`. |
| `useThrottledCallback` | `ms` | `100` | Intervalo mínimo entre ejecuciones de `fn`. |

## Ejemplos

### Buscador que espera a que el usuario termine de escribir
```tsx
function SearchBox() {
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 400);

  useEffect(() => {
    if (debouncedQ) searchApi(debouncedQ);
  }, [debouncedQ]);

  return <input value={q} onChange={(e) => setQ(e.target.value)} />;
}
```

### Autoguardado con función debounced
```tsx
const saveDraft = useDebouncedCallback((text: string) => api.saveDraft(text), 800);

<textarea onChange={(e) => saveDraft(e.target.value)} />
```

### Throttle en un scroll handler
```tsx
const onScroll = useThrottledCallback(() => setShowBackToTop(window.scrollY > 400), 150);

useEffect(() => {
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, [onScroll]);
```

## Notas y comportamiento

- `useDebounce` es puramente reactivo: no hace falta llamar a nada, simplemente usá el valor devuelto en vez del original en tus efectos.
- `useDebouncedCallback` y `useThrottledCallback` leen la función más reciente desde un `ref` interno en cada ejecución diferida — no hace falta memoizar `fn` con `useCallback` para que usen siempre la versión actual (evita closures viejas capturando estado obsoleto).
- `useDebouncedCallback` limpia el timer pendiente al desmontar — si el componente se desmonta antes de que venza el `delay`, la función nunca se ejecuta.
- `useThrottledCallback` es "leading edge": la primera llamada se ejecuta inmediatamente, y las siguientes dentro de la ventana de `ms` se descartan — no hay una llamada final garantizada al final de la ráfaga (a diferencia de un throttle "trailing"). Si necesitás la última llamada de una ráfaga, combinalo con `useDebouncedCallback`.
