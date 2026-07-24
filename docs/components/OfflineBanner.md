# OfflineBanner

> Barra de estado de conectividad que aparece sola cuando se corta internet, confirma en verde al reconectar, y avisa si la conexión es lenta.

**Import**
```tsx
import { OfflineBanner } from "lib-kit-components";
```

## Cuándo usarlo

Montalo una vez, arriba en el layout de la app, para avisar automáticamente al usuario cuando pierde la conexión, cuando la recupera, o cuando la conexión es notoriamente lenta (2G/save-data). Es útil en cualquier PWA que dependa de red para operaciones críticas y quiera comunicar ese estado sin que el usuario tenga que adivinarlo por errores sueltos en la UI.

## Cuándo NO usarlo / alternativas

- Si necesitás un panel de diagnóstico más completo (instalación, service worker, notificaciones, no sólo conectividad), usá `PwaStatus`.
- No reemplaza el manejo de errores de red por request individual — sólo informa el estado global de conectividad del navegador.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `position` | `"top" \| "bottom"` | `"top"` | Posición fija del banner en la pantalla. |
| `offlineLabel` | `string` | `"Sin conexión · estás viendo contenido guardado"` | Texto cuando no hay conexión. |
| `onlineLabel` | `string` | `"Conexión restablecida"` | Texto al recuperar conexión (se autooculta luego de unos segundos). |
| `warnSlow` | `boolean` | `true` | Si es `true`, muestra también un aviso cuando la conexión es lenta. |
| `slowLabel` | `string` | `"Conexión lenta"` | Texto del aviso de conexión lenta. |

## Ejemplos

### Uso básico
```tsx
<OfflineBanner />
```

### Abajo de la pantalla, sin aviso de conexión lenta
```tsx
<OfflineBanner position="bottom" warnSlow={false} />
```

### Textos personalizados
```tsx
<OfflineBanner
  offlineLabel="No tenés conexión — algunos datos pueden estar desactualizados"
  onlineLabel="¡De vuelta online!"
  slowLabel="Tu conexión está lenta, puede tardar más de lo normal"
/>
```

## Requisitos / dependencias

- Usa `framer-motion` para la animación de entrada/salida del banner (slide + fade) y el punto pulsante del estado offline.
- Depende del hook `useOnlineStatus`, basado en los eventos `online`/`offline` del navegador y, cuando está disponible, la Network Information API (`navigator.connection`) para detectar `effectiveType` y `saveData`.
- Refleja el estado **real** de red del navegador: en un entorno de desarrollo normal, con conexión estable, este componente no muestra nada la mayor parte del tiempo. Para verlo en acción hay que forzar el estado offline desde DevTools (pestaña Network → Offline) o desconectar la red real; no tiene una prop de tipo `forceVisible` para testing.
- La Network Information API (`navigator.connection`) no está disponible en todos los navegadores (por ejemplo, no en Safari) — en esos casos `effectiveType` es siempre `null` y el aviso de conexión lenta sólo puede activarse vía `saveData`, que tampoco está soportado universalmente.

## Notas y comportamiento

- Estado mostrado, en orden de prioridad: `offline` (no hay conexión) > `back` (se acaba de reconectar) > `slow` (conexión lenta, sólo si `warnSlow` es `true`) > nada.
- El estado `back` (verde) se mantiene visible sólo durante `reconnectedMs` (3000ms, fijo en el hook `useOnlineStatus`, no configurable desde esta prop del componente) y luego se oculta solo.
- `slowConnection` es `true` cuando `saveData` está activo o `effectiveType` es `"2g"` o `"slow-2g"`.
- SSR-safe: `useOnlineStatus` asume `online: true` en el server y corrige el valor real al montar en el cliente, evitando parpadeos de hidratación.
- El banner usa `role="status"` y `aria-live="polite"` para anunciarse a lectores de pantalla sin interrumpir.
- Respeta `env(safe-area-inset-top)` o `env(safe-area-inset-bottom)` según la posición, para no quedar tapado por notch/home indicator.
