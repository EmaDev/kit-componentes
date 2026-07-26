# SyncStatus

> Indicador visual del estado de una cola de mutaciones offline (`useOfflineQueue`): cuántos cambios faltan enviar, si hay un envío en curso, y qué falló definitivamente. Chip compacto para la barra de la app o panel con detalle para una pantalla de ajustes.

**Import**
```tsx
import { SyncStatus } from "lib-kit-components";
```

## Cuándo usarlo

Como compañero visual de `useOfflineQueue`: pasale `pending`, `failed` y `flushing` directo desde el hook y `SyncStatus` arma el mensaje y el color correctos. Usá `variant="chip"` para un indicador chico en el header o la barra inferior, y `variant="panel"` para una fila con más detalle (hora del último sync, botón de reintentar) en una pantalla de ajustes o de la propia cola.

## Cuándo NO usarlo / alternativas

- Para el estado general de conexión del dispositivo (sin relación con una cola de cambios pendientes), usá `OfflineBanner`.
- Para el estado "sin conexión, no hay nada que mostrar" de una pantalla completa, usá `OfflineFallback`.
- `SyncStatus` no encola ni envía nada — es sólo la vista; la lógica vive en `useOfflineQueue`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `pending` | `number` | — (requerido) | Cambios esperando salir. |
| `failed` | `number` | `0` | Cambios que agotaron los reintentos. |
| `flushing` | `boolean` | `false` | Hay un envío en curso ahora mismo. |
| `lastSyncedAt` | `number \| null` | `null` | Timestamp del último envío exitoso (sólo se usa en `variant="panel"`). |
| `onRetry` | `() => void` | `undefined` | Reintentar el envío. Si no se pasa, no se muestra el botón. |
| `variant` | `"chip" \| "panel"` | `"chip"` | Chip compacto vs panel con detalle. |
| `hideWhenSynced` | `boolean` | `true` en `"chip"`, `false` en `"panel"` | Ocultarse (con animación) cuando no hay nada pendiente ni fallido. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Ejemplos

### Chip en el header, conectado a useOfflineQueue
```tsx
const queue = useOfflineQueue<Comment>({ send: (item) => api.postComment(item.payload) });

<AppHeader title="Pedido #A-1042">
  <SyncStatus
    pending={queue.pending}
    failed={queue.failed}
    flushing={queue.flushing}
    onRetry={() => queue.retry()}
  />
</AppHeader>
```

### Panel de detalle en Ajustes
```tsx
<SyncStatus
  variant="panel"
  pending={queue.pending}
  failed={queue.failed}
  flushing={queue.flushing}
  lastSyncedAt={lastSyncedAt}
  onRetry={() => queue.retry()}
/>
```

## Requisitos / dependencias

- Usa el hook `useOnlineStatus` para distinguir "pendiente pero online" (`pending`, va a intentar solo) de "pendiente y offline" (`offline`, espera a que vuelva la conexión).
- Usa `framer-motion` para la entrada/salida del chip y el ícono girando mientras `flushing`.
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- El estado mostrado se deriva con esta prioridad: `failed` > `flushing` > (`!online && pending`) > `pending` > `synced` — si hay algo fallido, se muestra "fallido" aunque también haya un envío en curso o esté offline.
- En `variant="chip"`, `hideWhenSynced` es `true` por defecto: el chip **desaparece** (con `AnimatePresence`) en cuanto no hay nada pendiente ni fallido, para no ocupar espacio permanente en el header. En `variant="panel"` el default es `false`: el panel se queda mostrando "Todo sincronizado" como confirmación positiva.
- El botón "Reintentar" sólo aparece en los estados `"failed"` (ambas variantes) y `"pending"` (sólo `variant="panel"`) — en `"offline"` no se muestra porque reintentar manualmente no serviría de nada sin conexión.
- Los textos están en singular/plural correcto según la cantidad (`"1 cambio pendiente"` vs `"3 cambios pendientes"`).
