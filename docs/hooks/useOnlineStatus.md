# useOnlineStatus

> Estado de conectividad reactivo: online/offline, "recién reconectado" temporal, y calidad de conexión vía la Network Information API.

**Import**
```ts
import { useOnlineStatus } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para mostrar un banner de "sin conexión", un toast de "¡de nuevo online!" al reconectar, o para degradar la experiencia (menos animaciones, imágenes de menor calidad, avisos) cuando la conexión es lenta. El componente `OfflineBanner` de esta librería usa este hook internamente para su UI ya armada; usá el hook directo si necesitás una UI propia o si querés reaccionar a la conectividad en lógica que no es puramente visual (por ejemplo, pausar un polling o encolar requests offline).

## Firma

```ts
function useOnlineStatus(reconnectedMs?: number): {
  online: boolean;
  justReconnected: boolean;
  effectiveType: string | null;
  slowConnection: boolean;
}
```

## Opciones (parámetros)

A diferencia de otros hooks de la librería, no recibe un objeto de opciones sino un único parámetro posicional.

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `reconnectedMs` | `number` | `3000` | Cuántos ms permanece `justReconnected` en `true` después de recuperar la conexión. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `online` | `boolean` | Hay conexión según `navigator.onLine` / eventos `online`/`offline` del navegador. |
| `justReconnected` | `boolean` | `true` durante `reconnectedMs` después de que se dispara el evento `online` (no se activa en el montaje inicial aunque ya estés online). Útil para un toast tipo "¡De nuevo online!". |
| `effectiveType` | `string \| null` | Tipo de conexión efectiva (`"4g"`, `"3g"`, `"2g"`, `"slow-2g"`) si la Network Information API está disponible; `null` si el navegador no la soporta. |
| `slowConnection` | `boolean` | `true` si `saveData` está activo o `effectiveType` es `"2g"`/`"slow-2g"`. |

## Ejemplos

### Banner de sin conexión
```tsx
import { useOnlineStatus } from "lib-kit-components";

function ConnectionBanner() {
  const { online, justReconnected } = useOnlineStatus();

  if (justReconnected) return <div className="banner-success">De nuevo online</div>;
  if (!online) return <div className="banner-warning">Sin conexión — algunos datos pueden estar desactualizados</div>;
  return null;
}
```

### Aviso de conexión lenta
```tsx
function SlowConnectionHint() {
  const { slowConnection, effectiveType } = useOnlineStatus();
  if (!slowConnection) return null;
  return <p>Conexión lenta detectada ({effectiveType ?? "desconocida"}): desactivamos las animaciones.</p>;
}
```

### Reaccionar a reconexión con un `reconnectedMs` más largo
```tsx
function App() {
  const { online, justReconnected } = useOnlineStatus(5000); // 5s de aviso

  useEffect(() => {
    if (justReconnected) refetchPendingQueries();
  }, [justReconnected]);

  return <>{!online && <OfflineOverlay />}</>;
}
```

## Notas y comportamiento

- SSR-safe: el estado inicial es `online: true` (se asume conectado tanto en servidor como en el primer render del cliente) y se corrige de inmediato dentro de un `useEffect` con el valor real de `navigator.onLine`. No usa un inicializador perezoso que lea `navigator` durante el render, así que no hay riesgo de mismatch de hidratación.
- La Network Information API (`navigator.connection`, de donde salen `effectiveType` y la parte de `saveData` de `slowConnection`) es **no estándar y sólo la soportan navegadores basados en Chromium** (Chrome/Edge Android y desktop). En Firefox y Safari, `effectiveType` queda siempre en `null` y `slowConnection` sólo puede activarse si el navegador soporta al menos `saveData` — en la práctica, en esos navegadores esta parte del hook no aporta información.
- `online`/`offline` sí son estándar y funcionan en todos los navegadores modernos, pero reflejan la conectividad de red del sistema operativo, no necesariamente que el backend de tu app sea alcanzable (podés estar "online" y aun así no poder llegar a tu API).
- El listener de cambios de `navigator.connection` (`change`) se agrega/quita con optional chaining, así que en navegadores donde `connection` existe parcialmente no rompe.
- No depende de `document`, sólo de `window`/`navigator`, así que funciona igual en cualquier layout.
