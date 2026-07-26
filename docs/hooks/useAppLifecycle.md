# useAppLifecycle

> Ciclo de vida foreground/background de la app: cuánto tiempo estuvo oculta, si conviene refrescar datos al volver, y el último gancho fiable para persistir estado antes de que el sistema congele o mate la pestaña.

**Import**
```ts
import { useAppLifecycle } from "lib-kit-components";
```

## Cuándo usarlo

Para revalidar datos cuando el usuario vuelve a la app después de un rato (cambió de app, bloqueó el teléfono, cambió de pestaña) sin depender sólo de `visibilitychange` a mano, y para guardar el último estado justo antes de que la pestaña se congele — en móvil, `beforeunload` **no se dispara de forma confiable**, así que hay que usar `pagehide`/`freeze` para no perder datos. `useCachedFetch` ya usa una lógica similar internamente para su propio `revalidateOnFocus`; usá `useAppLifecycle` cuando necesités esa misma señal para tu propia lógica (no sólo para refetchear un endpoint).

## Firma

```ts
function useAppLifecycle(handlers?: {
  onResume?: (msHidden: number) => void;
  onHide?: () => void;
  onPersist?: () => void;
  staleAfter?: number;
}): {
  visible: boolean;
  staleFor: number;
  isStale: boolean;
  lastResume: number;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `onResume` | `(msHidden: number) => void` | `undefined` | La app volvió a primer plano; recibe cuánto tiempo estuvo oculta, en ms. |
| `onHide` | `() => void` | `undefined` | La app pasó a segundo plano. |
| `onPersist` | `() => void` | `undefined` | Último momento útil para guardar estado (`pagehide` / evento `freeze`) — puede no haber otra oportunidad después de esto. |
| `staleAfter` | `number` | `60_000` | Umbral en ms para que `isStale` se considere `true`. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `visible` | `boolean` | La app está en primer plano ahora mismo (`document.visibilityState === "visible"`). |
| `staleFor` | `number` | Cuánto tiempo (ms) estuvo oculta la última vez que volvió a primer plano. `0` si nunca estuvo oculta. |
| `isStale` | `boolean` | `staleFor > staleAfter` — atajo para "estuvo fuera lo suficiente como para refrescar". |
| `lastResume` | `number` | Timestamp (`Date.now()`) del último resume. |

## Ejemplos

### Refrescar datos si estuvo fuera más de un minuto
```tsx
function Dashboard() {
  const { isStale } = useAppLifecycle({ staleAfter: 60_000 });
  const { refetch } = useCachedFetch("/api/dashboard");

  useEffect(() => {
    if (isStale) refetch();
  }, [isStale, refetch]);

  return <DashboardContent />;
}
```

### Guardar el borrador antes de que el sistema congele la pestaña
```tsx
function Editor({ draft }: { draft: string }) {
  useAppLifecycle({
    onPersist: () => {
      // única oportunidad confiable en móvil — sincrónico, sin awaits largos
      localStorage.setItem("draft", draft);
    },
  });
  return <textarea defaultValue={draft} />;
}
```

## Notas y comportamiento

- **`onPersist` es la única señal confiable en móvil para guardar estado antes de perder la pestaña.** `beforeunload` no se dispara quitando la app del multitasking en iOS/Android — el hook escucha `pagehide` (se dispara siempre al navegar fuera o cerrar) y el evento `freeze` (Page Lifecycle API, Chrome) para cubrir ambos casos. Lo que hagas en `onPersist` debe ser rápido y sincrónico (como `localStorage.setItem`); una llamada de red asíncrona puede no llegar a completarse.
- `onResume`/`onHide` están basados en `visibilitychange`, que es la señal correcta y multiplataforma para foreground/background (a diferencia de `blur`/`focus`, que también disparan por otros motivos como abrir devtools).
- Los callbacks (`onResume`, `onHide`, `onPersist`) se leen desde un `ref` interno que se actualiza en cada render, así que siempre usan la versión más reciente de las funciones sin necesidad de que vos las memoices con `useCallback`.
- `staleFor` se resetea a lo calculado en el resume más reciente — no acumula entre varios ciclos de esconder/mostrar, siempre refleja la última transición.
