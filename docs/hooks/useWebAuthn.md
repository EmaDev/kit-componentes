# useWebAuthn

> Biometría del dispositivo (Face ID / huella / Windows Hello) vía WebAuthn: registro y login con el autenticador de plataforma. Es el hook detrás de `BiometricGate` y del slot `onBiometric` de `PinLock`.

**Import**
```ts
import { useWebAuthn } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesités armar tu propio flujo de biometría (no el de `BiometricGate`), por ejemplo un botón de "Registrar Face ID" dentro de una pantalla de seguridad de la cuenta, separado del flujo de desbloqueo. Sin backend, sólo confirma que el dispositivo *puede* verificar biométricamente al usuario — para autenticación real necesitás pasar `verify` (o `getRegistrationOptions`/`getAuthenticationOptions`) contra tu servidor.

## Cuándo NO usarlo / alternativas

- Para la pantalla estándar de desbloqueo biométrico a pantalla completa, usá el componente `BiometricGate`, que ya envuelve este hook con toda la UI.

## Firma

```ts
function useWebAuthn(options?: {
  appName?: string;
  rpId?: string;
  getRegistrationOptions?: () => Promise<PublicKeyCredentialCreationOptions>;
  getAuthenticationOptions?: () => Promise<PublicKeyCredentialRequestOptions>;
  verify?: (credential: PublicKeyCredential, kind: "register" | "login") => Promise<boolean>;
}): {
  supported: boolean;
  available: boolean;
  busy: boolean;
  error: string | null;
  register: (userId?: string, userName?: string) => Promise<boolean>;
  authenticate: () => Promise<boolean>;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `appName` | `string` | `"Mi App"` | Nombre visible en el diálogo del sistema (`rp.name` al registrar). |
| `rpId` | `string` | hostname actual | Dominio (Relying Party ID). |
| `getRegistrationOptions` | `() => Promise<PublicKeyCredentialCreationOptions>` | genera opciones locales | Traé las opciones de registro (con `challenge` real) desde tu backend. |
| `getAuthenticationOptions` | `() => Promise<PublicKeyCredentialRequestOptions>` | genera opciones locales | Traé las opciones de login (con `challenge` real) desde tu backend. |
| `verify` | `(credential: PublicKeyCredential, kind: "register" \| "login") => Promise<boolean>` | `undefined` | Enviá la credencial a tu backend para verificarla. Sin esto, cualquier credencial local válida "pasa". |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador expone `window.PublicKeyCredential` (WebAuthn disponible). |
| `available` | `boolean` | Hay un autenticador de plataforma disponible en este dispositivo (huella, Face ID, Windows Hello). |
| `busy` | `boolean` | Hay un registro/login en curso. |
| `error` | `string \| null` | Mensaje legible del último intento fallido. |
| `register` | `(userId?, userName?) => Promise<boolean>` | Registra una nueva credencial biométrica. |
| `authenticate` | `() => Promise<boolean>` | Verifica con una credencial ya registrada. |

## Ejemplos

### Registro dentro de una pantalla de seguridad
```tsx
function SecuritySettings({ userId, userName }: { userId: string; userName: string }) {
  const { supported, available, register, busy, error } = useWebAuthn({
    appName: "Mi App",
    getRegistrationOptions: () => api.get("/webauthn/register-options"),
    verify: (credential) => api.post("/webauthn/register-verify", { credential }).then((r) => r.ok),
  });

  if (!supported || !available) return null;
  return (
    <button onClick={() => register(userId, userName)} disabled={busy}>
      {busy ? "Registrando…" : "Activar Face ID / huella"}
    </button>
  );
}
```

### Login biométrico standalone (sin BiometricGate)
```tsx
const { authenticate, busy, error } = useWebAuthn({
  getAuthenticationOptions: () => api.get("/webauthn/login-options"),
  verify: (credential) => api.post("/webauthn/login-verify", { credential }).then((r) => r.ok),
});

<button onClick={async () => { if (await authenticate()) onLoggedIn(); }} disabled={busy}>
  Ingresar con biometría
</button>
```

## Notas y comportamiento

- **Sin backend, no hay verificación de identidad real.** Sin `getRegistrationOptions`/`getAuthenticationOptions`, el hook genera un `challenge` aleatorio *localmente* — válido para probar que el flujo funciona, pero **no seguro para producción**: cualquiera podría reproducir el resultado sin un servidor validando la firma. Para un login real, siempre necesitás las tres piezas del lado del servidor: opciones con challenge firmado, y `verify` que valide la respuesta.
- `available` se resuelve de forma asíncrona vía `PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()` — puede tardar un instante en pasar de `false` a `true` tras el primer render; no lo trates como sincrónico.
- Si el usuario cancela el diálogo nativo del sistema (o no hay credencial), `error.name === "NotAllowedError"` se traduce a `"Cancelaste la verificación."`; cualquier otro `DOMException` muestra su mensaje crudo o un genérico.
- `register`/`authenticate` devuelven `false` tanto si el usuario cancela como si `verify` devuelve `false` — no hay forma de distinguir "cancelado" de "rechazado por el backend" desde el valor de retorno; usá `error` para dar contexto adicional cuando haga falta.
