# NotificationOptIn

> Tarjeta de opt-in de notificaciones push/web que explica el valor antes de pedir el permiso, en vez de pedirlo automáticamente al cargar.

**Import**
```tsx
import { NotificationOptIn } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando querés activar notificaciones del navegador con buenas prácticas: pedir el permiso recién cuando el usuario hace un gesto explícito (clickear "Activar"), no apenas carga la página — pedir el permiso de entrada es lo que suele hacer que el usuario lo bloquee para siempre. Es una tarjeta embebida (no un modal ni un banner fijo), pensada para colocar en un feed, onboarding o pantalla de ajustes.

## Cuándo NO usarlo / alternativas

- No reemplaza la lógica de suscripción push real (Web Push API, VAPID keys, backend) — sólo maneja el permiso del navegador (`Notification.permission`) y puede disparar una notificación local de prueba vía el hook subyacente; la suscripción a push remoto es responsabilidad tuya.
- Si el usuario ya bloqueó las notificaciones a nivel navegador, este componente no puede volver a pedir el permiso (ninguna API del browser lo permite) — sólo muestra un texto explicando cómo desbloquearlas manualmente desde los ajustes.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `title` | `string` | `"Activar notificaciones"` | Título de la tarjeta. |
| `description` | `string` | `"Te avisamos sólo de lo importante. Podés desactivarlas cuando quieras."` | Descripción cuando el permiso todavía no fue decidido. |
| `actionLabel` | `string` | `"Activar"` | Texto del botón de acción. |
| `dismissLabel` | `string` | `"No, gracias"` | Texto del botón para descartar. |
| `deniedHint` | `string` | `"Están bloqueadas. Habilitalas desde los ajustes del navegador."` | Texto mostrado cuando el usuario ya bloqueó las notificaciones (`status === "denied"`). |
| `onResult` | `(status: "granted" \| "denied" \| "default" \| "unsupported") => void` | — | Callback con el resultado del pedido de permiso. |
| `requireInstalledOnIos` | `boolean` | `true` | En iOS, el permiso de notificaciones sólo existe con la PWA instalada en pantalla de inicio; si es `true`, muestra un aviso pidiendo instalar primero en vez del botón de activar. |
| `forceVisible` | `boolean` | `false` | Fuerza la tarjeta visible, ignorando el estado real del permiso — para testear el UI. |

## Ejemplos

### Uso básico
```tsx
<NotificationOptIn onResult={(status) => console.log("Permiso:", status)} />
```

### Sin el requisito de instalación en iOS (asumiendo que ya se maneja aparte)
```tsx
<NotificationOptIn requireInstalledOnIos={false} />
```

### Textos personalizados y callback de suscripción push
```tsx
<NotificationOptIn
  title="No te pierdas nada"
  description="Recibí avisos cuando tu pedido cambie de estado."
  actionLabel="Sí, avisame"
  dismissLabel="Ahora no"
  onResult={async (status) => {
    if (status === "granted") await subscribeToPush();
  }}
/>
```

### Forzar visible para testear el diseño en desarrollo
```tsx
<NotificationOptIn forceVisible />
```

## Requisitos / dependencias

- Usa `framer-motion` para la animación de entrada/salida de la tarjeta y el ícono de campana que se mueve periódicamente.
- Depende de `useNotificationPermission` (Notification API del navegador) y de `usePwaInstall` (para saber si está en iOS y si está en modo standalone).
- Refleja el estado real de `Notification.permission` del navegador. En un entorno de desarrollo normal, si nunca se pidió el permiso, el estado es `"default"` y la tarjeta se muestra; una vez que el usuario decide (otorga o bloquea), el estado persiste a nivel navegador/sitio y no vuelve a cambiar solo — usá `forceVisible` para forzar el diseño sin tener que resetear permisos del navegador manualmente (chrome://settings/content/notifications o equivalente).
- La API `Notification` no existe en todos los navegadores/contextos (por ejemplo, WebViews embebidos restringidos); en ese caso el estado es `"unsupported"` y la tarjeta directamente no se muestra (`visible` requiere `status === "default" || status === "denied"`).

## Notas y comportamiento

- `visible` es `forceVisible || (!hidden && (status === "default" || status === "denied"))`: no se muestra si el permiso ya fue `"granted"` ni si es `"unsupported"` (salvo `forceVisible`).
- En iOS sin la PWA instalada (`requireInstalledOnIos` con `pwa.platform === "ios" && !pwa.isStandalone`), el botón de acción se oculta y en su lugar se muestra el texto "Primero agregá la app a tu pantalla de inicio para poder recibir notificaciones."
- Si `status === "denied"`, tampoco se muestran los botones de acción — sólo el `deniedHint`, porque no hay ninguna API que permita re-pedir un permiso ya denegado por el usuario.
- Al conceder el permiso (`result === "granted"`), la tarjeta se oculta automáticamente (`setHidden(true)`).
- Tiene un botón de cerrar (X) independiente del flujo de decisión, que también oculta la tarjeta sin pedir permiso.
- Usa animación de salida con colapso de altura (`exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}`) para que el layout no salte bruscamente al ocultarse.
