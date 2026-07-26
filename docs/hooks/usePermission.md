# usePermission

> Estado reactivo de un permiso del navegador (cámara, ubicación, notificaciones, etc.), sincronizado con el evento `change` de la Permissions API. No pide el permiso por sí solo — eso lo hace `request()`, o el hook/componente dueño de la feature (`useCamera`, `useGeolocation`, etc.).

**Import**
```ts
import { usePermission, type PermissionKind, type PermissionState } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesités **leer** el estado de un permiso para adaptar la UI (deshabilitar un botón, mostrar un aviso) sin necesariamente pedirlo todavía, o cuando estés armando tu propia UI de pedido de permiso en vez de usar `PermissionGate`. Si sólo necesitás el patrón estándar "explicar → pedir → contemplar bloqueado", usá el componente `PermissionGate`, que ya envuelve este hook.

## Firma

```ts
function usePermission(kind: PermissionKind): {
  state: PermissionState;
  request: () => Promise<PermissionState>;
  granted: boolean;
  denied: boolean;
}

type PermissionKind = "camera" | "microphone" | "geolocation" | "notifications" | "clipboard-read" | "persistent-storage";
type PermissionState = "unsupported" | "prompt" | "granted" | "denied";
```

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `kind` | `PermissionKind` | Qué permiso observar/pedir. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `state` | `PermissionState` | Estado actual, sincronizado en vivo (mientras el navegador soporte el evento `change` para ese permiso). |
| `request` | `() => Promise<PermissionState>` | Dispara el pedido nativo correspondiente al `kind` (ver notas). Devuelve el nuevo estado. |
| `granted` | `boolean` | Atajo para `state === "granted"`. |
| `denied` | `boolean` | Atajo para `state === "denied"`. |

## Ejemplos

### Deshabilitar un botón según el estado, sin pedir todavía
```tsx
function ScanButton() {
  const { state, request } = usePermission("camera");
  return (
    <button onClick={request} disabled={state === "unsupported"}>
      {state === "denied" ? "Cámara bloqueada — habilitala en Ajustes" : "Escanear"}
    </button>
  );
}
```

### UI de pedido propia (en vez de PermissionGate)
```tsx
function MicPermission({ children }: { children: ReactNode }) {
  const { state, request } = usePermission("microphone");
  if (state === "granted") return <>{children}</>;
  return <button onClick={request}>Habilitar micrófono</button>;
}
```

## Notas y comportamiento

- `request()` dispara una acción **distinta según el `kind`**, no una API genérica: para `"notifications"` llama a `Notification.requestPermission()`; para `"camera"`/`"microphone"` pide (y de inmediato cierra) un stream de `getUserMedia`; para `"geolocation"` pide una posición con `getCurrentPosition`; para `"persistent-storage"` llama a `navigator.storage.persist()`. No hay un `kind` genérico que sólo lea sin pedir nada — `request()` siempre intenta obtener el permiso.
- El estado inicial y los cambios en vivo dependen de `navigator.permissions.query({ name: kind })`; si el navegador no soporta consultar ese `kind` en particular (Safari no soporta `"camera"`/`"microphone"`/`"clipboard-read"` vía Permissions API, por ejemplo), el estado cae a `"unsupported"` — pero **igual podés llamar a `request()`**, que dispara el diálogo nativo aunque no puedas leer el estado de antemano.
- Para `"notifications"`, el estado inicial se lee además de forma síncrona desde `Notification.permission` (`"default"` se traduce a `"prompt"`), independientemente de si la Permissions API lo soporta, porque `Notification.permission` está ampliamente soportado por separado.
- Una vez que el usuario **deniega** un permiso a nivel navegador, la mayoría de los navegadores ya no vuelven a mostrar el diálogo nativo en pedidos subsecuentes — `request()` en ese caso suele resolver `"denied"` sin ninguna interacción visible del usuario. Es responsabilidad de tu UI (como hace `PermissionGate`) explicar cómo desbloquearlo manualmente desde los ajustes del navegador.
