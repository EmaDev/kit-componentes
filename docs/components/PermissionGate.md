# PermissionGate

> Pide un permiso del navegador (cámara, ubicación, notificaciones, etc.) con contexto: primero explica *por qué* lo necesitás, y sólo entonces dispara el pedido nativo. Contempla el estado bloqueado, donde el navegador ya no vuelve a preguntar.

**Import**
```tsx
import { PermissionGate, type PermissionKind } from "lib-kit-components";
```

## Cuándo usarlo

Como guardia declarativa alrededor de cualquier feature que dependa de un permiso del navegador: envolvé el contenido que lo necesita en `children`, y `PermissionGate` se encarga de mostrar el pedido con contexto mientras el permiso no esté concedido, y renderizar `children` directo en cuanto lo esté. Es la pieza recomendada para **nunca** pedir un permiso apenas carga la app — pedilo en el momento en que el usuario entiende para qué sirve.

## Cuándo NO usarlo / alternativas

- Si necesitás el estado del permiso sin la UI de pedido (por ejemplo, para deshabilitar un botón), usá el hook `usePermission` directamente.
- Para el flujo específico de notificaciones push con su propio copy y diseño, usá `NotificationOptIn` en vez de `PermissionGate kind="notifications"`.
- `PermissionGate` sólo *pide* el permiso — no inicia cámara, geolocalización, etc. por sí mismo; combinalo con `useCamera`, `useGeolocation`, `CameraCapture` o `LocationPicker` una vez concedido.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `kind` | `PermissionKind` | — (requerido) | Qué permiso pedir: `"camera"`, `"microphone"`, `"geolocation"`, `"notifications"`, `"clipboard-read"`, `"persistent-storage"`. |
| `reason` | `string` | — (requerido) | Por qué lo necesitás — el usuario decide con este texto. |
| `title` | `string` | `"Necesitamos acceso a {permiso}"` | Título del pedido. |
| `icon` | `ReactNode` | ícono de escudo | Ícono del pedido. |
| `cta` | `string` | `"Permitir"` | Texto del botón de pedido. |
| `children` | `ReactNode` | `undefined` | Contenido a mostrar una vez concedido el permiso. |
| `onGranted` | `() => void` | `undefined` | Se llama cuando el usuario concede el permiso. |
| `onDenied` | `() => void` | `undefined` | Se llama cuando el usuario lo rechaza. |
| `deniedHelp` | `string` | `"Habilitalo desde los ajustes del navegador para este sitio."` | Texto de ayuda cuando el permiso quedó bloqueado. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

`PermissionKind` y `PermissionState` se re-exportan desde `usePermission`:

```ts
type PermissionKind =
  | "camera" | "microphone" | "geolocation"
  | "notifications" | "clipboard-read" | "persistent-storage";

type PermissionState = "unsupported" | "prompt" | "granted" | "denied";
```

## Ejemplos

### Gatear una feature de cámara
```tsx
<PermissionGate
  kind="camera"
  reason="Para escanear el código QR de tu cupón necesitamos acceso a la cámara."
>
  <QrScannerScreen />
</PermissionGate>
```

### Con callbacks de analítica
```tsx
<PermissionGate
  kind="geolocation"
  reason="Usamos tu ubicación para calcular el costo de envío."
  onGranted={() => track("location_granted")}
  onDenied={() => track("location_denied")}
>
  <LocationPicker onChange={setLocation} />
</PermissionGate>
```

## Requisitos / dependencias

- Usa el hook `usePermission` (Permissions API, con fallback específico por tipo de permiso al pedirlo).
- Usa `framer-motion` para la entrada del panel.
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- Mientras el estado sea distinto de `"granted"`, `children` **no se monta en absoluto** (no hay `display: none`) — cualquier hook o efecto dentro de `children` sólo corre una vez concedido el permiso.
- El estado `"denied"` (bloqueado) oculta el botón de pedir permiso: en la mayoría de los navegadores, una vez denegado, `navigator.permissions` no vuelve a disparar el diálogo nativo — sólo queda el texto de `deniedHelp` indicando cómo habilitarlo manualmente.
- El estado `"unsupported"` (el navegador no expone `Permissions API` para ese `kind`, ej. Safari con algunos permisos) deshabilita el botón y cambia su texto a "No disponible en este navegador", pero **no** oculta el pedido — en muchos casos igual podés intentar `request()` y el navegador mostrará su propio diálogo nativo aunque no puedas *leer* el estado de antemano.
- El ícono cambia de tono (`primary` → `danger`) automáticamente cuando el estado es `"denied"`.
