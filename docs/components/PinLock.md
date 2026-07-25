# PinLock

> Pantalla de bloqueo a pantalla completa por PIN numérico o contraseña, para el arranque de la app: puntos que se llenan, verificación automática al completar el PIN, shake y contador de intentos al fallar, bloqueo tras N intentos, y salidas por biometría o "olvidé mi código".

**Import**
```tsx
import { PinLock } from "lib-kit-components";
```

## Cuándo usarlo

Usalo como gate de acceso al abrir la app (o al volver de background) en flujos tipo billetera/banca/apps con datos sensibles: PIN numérico de 4-6 dígitos con teclado propio (`Keypad`), o contraseña con campo de texto revelable. Verifica automáticamente al completar el largo del PIN (no hace falta botón "confirmar"), cuenta intentos fallidos y ejecuta `onLockout` al superar el máximo. Acepta también el teclado físico en modo `pin`.

## Cuándo NO usarlo / alternativas

- Para un login inicial de sesión (usuario/contraseña con más campos, "olvidé mi contraseña" como flujo completo, registro), usá un formulario propio con [Input](Input.md) — `PinLock` es específicamente para el re-bloqueo rápido de una sesión ya iniciada, no para el login completo.
- Para pedir una confirmación puntual (no un gate de pantalla completa), usá [Modal](Modal.md) o [BottomSheet](BottomSheet.md) con tu propio formulario.
- Si sólo necesitás el teclado numérico sin la lógica de intentos/bloqueo/puntos, usá [Keypad](Keypad.md) directamente.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Controla si la pantalla de bloqueo está visible. |
| `mode` | `"pin" \| "password"` | `"pin"` | `pin` = teclado numérico propio con puntos de progreso. `password` = campo de texto con toggle de visibilidad. |
| `length` | `number` | `4` | Cantidad de dígitos del PIN (sólo aplica en `mode="pin"`). |
| `onUnlock` | `(code: string) => boolean \| Promise<boolean>` | — (requerido) | Verifica el código. Devolvé `true` si es correcto (puede ser async, ej. contra backend). |
| `onSuccess` | `() => void` | `undefined` | Se llama ~420ms después de un `onUnlock` exitoso (tras la animación del tinte verde). |
| `maxAttempts` | `number` | `5` | Intentos fallidos permitidos antes de bloquear. |
| `onLockout` | `() => void` | `undefined` | Se llama al alcanzar `maxAttempts` (ej. para forzar logout o cooldown). |
| `appName` | `string` | `"Tu app"` | Nombre mostrado arriba del título. |
| `title` | `string` | `"Ingresá tu PIN"` / `"Ingresá tu contraseña"` según `mode` | Título principal. |
| `hint` | `string` | `"Necesario para desbloquear la app"` | Texto de ayuda cuando no hay error activo. |
| `icon` | `ReactNode` | ícono de candado | Ícono en el chip superior. |
| `onBiometric` | `() => void \| Promise<void>` | `undefined` | Si se define, muestra el botón "Usar biometría" (Face ID / huella — la implementación real, ej. WebAuthn, la provee el consumidor). |
| `onForgot` | `() => void` | `undefined` | Si se define, muestra el link "¿Olvidaste tu PIN/contraseña?". |
| `fullscreen` | `boolean` | `true` | `true` = `position: fixed` cubriendo todo el viewport. `false` = `position: absolute` sobre el contenedor relativo más cercano. |
| `className` | `string` | `""` | Clases CSS adicionales para el contenedor raíz. |

## Ejemplos

### PIN de 4 dígitos, verificación contra backend
```tsx
const [locked, setLocked] = useState(true);

<PinLock
  open={locked}
  mode="pin"
  length={4}
  appName="Mi Billetera"
  onUnlock={async (code) => await verifyPin(code)}
  onSuccess={() => setLocked(false)}
  maxAttempts={5}
  onLockout={() => logout()}
  onBiometric={() => webauthnLogin()}
  onForgot={() => router.push("/recuperar")}
/>
```

### Modo contraseña
```tsx
<PinLock
  open={locked}
  mode="password"
  onUnlock={(pass) => pass === storedPassword}
  onSuccess={() => setLocked(false)}
/>
```

### Embebido dentro de un contenedor (no pantalla completa)
```tsx
<div className="relative h-full">
  <AppContent />
  <PinLock open={locked} fullscreen={false} onUnlock={check} onSuccess={unlock} />
</div>
```

## Requisitos / dependencias

- No depende de `next`.
- Usa `Keypad` internamente en `mode="pin"`, y por lo tanto `useHaptics` (feedback en cada tecla, `"success"` al desbloquear, `"error"` al fallar, `"warning"` en long-press).
- Marcado como `"use client"`.
- Es controlado vía `open`: el consumidor decide cuándo mostrarlo (típicamente al montar la app o al volver de background/inactividad).

## Notas y comportamiento

- En `mode="pin"`, la verificación es **automática**: en cuanto `code.length === length`, se llama a `onUnlock` sin esperar ninguna confirmación del usuario.
- Mientras `state` es `"checking"` u `"ok"`, o si `locked` es `true` (se alcanzó `maxAttempts`), el `Keypad` queda deshabilitado y no acepta más teclas.
- En `mode="pin"` también se escucha el teclado físico (`keydown`): dígitos `0-9` y `Backspace` funcionan igual que tocar el `Keypad` en pantalla.
- Al fallar, dispara `haptic("error")`, shake de 400ms en los puntos/formulario, e incrementa `attempts`; el mensaje muestra los intentos restantes. El código se limpia automáticamente 620ms después del error.
- Al alcanzar `maxAttempts`, `locked` pasa a `true`: se deshabilita el teclado (o el input en modo password) y el mensaje cambia a "Demasiados intentos" — no hay temporizador de cooldown incorporado, `onLockout` es responsabilidad del consumidor (ej. forzar logout).
- Al abrir (`open` pasa a `true`), el código y el estado se resetean automáticamente vía `useEffect`.
- En `mode="password"`, el submit ocurre por `Enter` (envío del `<form>`) o llamando a `submit(code)`; el botón "Desbloquear" queda deshabilitado sin código, con `locked`, o durante `"checking"`.
- El botón de biometría y el link "olvidé mi código" sólo se muestran si se pasan `onBiometric`/`onForgot` respectivamente, y el de biometría se oculta además si `locked` es `true`.
