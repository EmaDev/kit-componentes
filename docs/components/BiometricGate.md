# BiometricGate

> Pantalla de desbloqueo biométrico (Face ID / huella / Windows Hello) vía WebAuthn, a pantalla completa. Si el dispositivo no tiene biometría, cae directo al método alternativo.

**Import**
```tsx
import { BiometricGate } from "lib-kit-components";
```

## Cuándo usarlo

Para gatear el acceso a una app (o a una acción sensible dentro de ella, como ver un saldo o confirmar un pago) con la biometría de la plataforma en vez de (o además de) un PIN. Intenta la verificación automáticamente al abrirse y ofrece reintentar o pasar a un `onFallback` (login con PIN/contraseña) si no hay soporte o el usuario cancela.

## Cuándo NO usarlo / alternativas

- Si querés un bloqueo por PIN/contraseña como método principal (con la biometría como atajo dentro de esa pantalla), usá `PinLock`, que ya expone un slot `onBiometric`.
- Sin un backend que resuelva `verify`, `BiometricGate` sólo confirma que el dispositivo *puede* autenticar (no valida identidad contra un servidor) — para producción, pasá siempre `verify`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si la pantalla está visible. |
| `onUnlock` | `() => void` | — (requerido) | Se llama cuando la verificación biométrica fue exitosa. |
| `appName` | `string` | `"Mi App"` | Nombre mostrado por el diálogo nativo del sistema. |
| `title` | `string` | `"Desbloqueá la app"` | Título principal. |
| `description` | `string` | `"Usá tu huella o tu rostro para continuar."` | Texto de ayuda en estado inicial. |
| `onFallback` | `() => void` | `undefined` | Método alternativo (PIN, login). Si no se pasa, no se muestra el botón. |
| `fallbackLabel` | `string` | `"Usar PIN"` | Texto del botón de método alternativo. |
| `auto` | `boolean` | `true` | Intenta autenticar automáticamente apenas `open` es `true` y hay soporte. |
| `verify` | `(credential: PublicKeyCredential, kind: "register" \| "login") => Promise<boolean>` | `undefined` | Verificación contra tu backend. Sin esto, cualquier credencial válida del dispositivo desbloquea. |

## Ejemplos

### Uso básico con fallback a PIN
```tsx
const [locked, setLocked] = useState(true);

<BiometricGate
  open={locked}
  onUnlock={() => setLocked(false)}
  onFallback={() => setShowPinLock(true)}
/>
```

### Con verificación real contra el backend
```tsx
<BiometricGate
  open={locked}
  appName="Billetera"
  onUnlock={() => setLocked(false)}
  verify={async (credential, kind) => {
    const res = await fetch("/api/webauthn/verify", {
      method: "POST",
      body: JSON.stringify({ credential, kind }),
    });
    return res.ok;
  }}
  onFallback={() => setShowPinLock(true)}
/>
```

### Sin intento automático (el usuario dispara el desbloqueo)
```tsx
<BiometricGate open={locked} auto={false} onUnlock={() => setLocked(false)} />
```

## Requisitos / dependencias

- Usa el hook `useWebAuthn` (WebAuthn / Credential Management API) y `useHaptics` para el feedback táctil de éxito/error.
- Usa `framer-motion` para la entrada/salida y el pulso del ícono mientras verifica.
- Marcado como `"use client"`. Requiere contexto seguro (HTTPS o `localhost`).

## Notas y comportamiento

- Si el dispositivo no soporta WebAuthn o no tiene un autenticador de plataforma disponible (`available: false`), el botón "Desbloquear" no se muestra en absoluto — sólo queda el mensaje explicativo y, si existe, el botón de `onFallback`.
- El intento automático (`auto`) sólo se dispara cuando `open`, `supported` y `available` son `true` a la vez; si `available` tarda en resolverse (es asíncrono), el efecto se re-ejecuta cuando cambia.
- Sin `verify`, `authenticate()` del hook subyacente resuelve `true` apenas el sistema operativo confirma la verificación local — no hay validación de identidad real contra un servidor.
- El ícono de huella tiene una animación de "shake" (`style={{ animation: "shake 0.4s ease" }}`) en el estado de fallo; si tu `globals.css` no define un `@keyframes shake`, el ícono simplemente no vibra (no rompe nada), agregalo si querés el efecto completo.
- `z-index` del overlay es `z-[150]`, por encima de `CameraCapture` (`z-[140]`) — pensado para superponerse a cualquier otra pantalla mientras la app está bloqueada.
