# SecurityAlertBanner

> Banner de alerta de seguridad de cuenta: nuevo dispositivo, cambio de contraseña, login sospechoso o cambio de correo, con tono crítico (rojo) para el caso de acceso sospechoso.

**Import**
```tsx
import { SecurityAlertBanner } from "lib-kit-components";
import type { SecurityAlertKind } from "lib-kit-components";
```

## Cuándo usarlo

Para notificar dentro de la propia app (ej. en el dashboard de cuenta, o arriba de "Configuración de seguridad") que ocurrió un evento sensible sobre la cuenta del usuario: inicio de sesión desde un dispositivo nuevo, cambio de contraseña, un intento de acceso sospechoso, o un cambio de correo. Cada `kind` trae su propio título y ícono predefinidos; `detail` permite agregar contexto puntual (ej. "Desde Buenos Aires, Argentina · Chrome en Windows"). El caso `"suspicious-login"` se renderiza en tono de peligro (rojo) y cambia el texto del CTA a "No fui yo — revisar".

## Cuándo NO usarlo / alternativas

- Para un mensaje transitorio que desaparece solo tras unos segundos (ej. "Guardado correctamente"), usá [Toast](Toast.md) o [Snackbar](Snackbar.md) — `SecurityAlertBanner` es persistente hasta que el usuario lo cierra.
- Para un estado de conectividad (offline/lenta/reconectado), usá [OfflineBanner](OfflineBanner.md), no `SecurityAlertBanner`.
- Para una cuenta regresiva o promoción con vencimiento, usá [CountdownBanner](CountdownBanner.md).
- Si el evento requiere bloquear la interacción hasta que el usuario confirme algo (ej. re-autenticar), un [Modal](Modal.md) es más apropiado que un banner que se puede ignorar.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `kind` | `SecurityAlertKind` | — (requerido) | Tipo de evento; define título e ícono. Ver [Tipos exportados](#tipos-exportados). |
| `detail` | `string` | `undefined` | Texto secundario con contexto adicional (ubicación, dispositivo, fecha). Si no se pasa, no se muestra esa línea. |
| `onReview` | `() => void` | `undefined` | Callback del link de acción ("Ver detalle" / "No fui yo — revisar"). Si no se pasa, el link no se renderiza. |
| `onDismiss` | `() => void` | `undefined` | Callback adicional al cerrar el banner (además de ocultarlo). |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Tipos exportados

```ts
type SecurityAlertKind = "new-device" | "password-changed" | "suspicious-login" | "email-changed";
```

## Ejemplos

### Alerta informativa de nuevo dispositivo
```tsx
<SecurityAlertBanner
  kind="new-device"
  detail="Desde Córdoba, Argentina · Safari en iPhone · hace 2 minutos"
  onReview={() => router.push("/cuenta/seguridad")}
/>
```

### Alerta crítica de login sospechoso
```tsx
<SecurityAlertBanner
  kind="suspicious-login"
  detail="Intento bloqueado desde una IP no reconocida."
  onReview={() => setShowSecurityModal(true)}
  onDismiss={() => trackEvent("security_alert_dismissed", { kind: "suspicious-login" })}
/>
```

### Cambio de contraseña, sin acción
```tsx
<SecurityAlertBanner kind="password-changed" detail="Hoy a las 14:32." />
```

## Requisitos / dependencias

- Marcado como `"use client"`. No requiere ningún Provider.
- No depende de Next.js ni de `framer-motion`.

## Notas y comportamiento

- Es **no controlado**: el banner mantiene su propio estado `visible` interno (`useState`) y desaparece (`return null`) al hacer click en cerrar; no hay forma de volver a mostrarlo desde afuera salvo desmontar/remontar el componente (ej. cambiando su `key`).
- `onDismiss` se dispara además de (no en lugar de) ocultar el banner — usalo para tracking o para persistir que el usuario ya vio la alerta, no para controlar la visibilidad.
- El botón de acción (`onReview`) sólo se renderiza si se pasa la prop; sin `onReview` el banner queda como aviso puramente informativo con botón de cerrar.
- El tono crítico (rojo, borde `border-danger/30`) sólo se activa automáticamente para `kind="suspicious-login"`; los demás tipos usan el tono primario aunque tengan `detail`.
