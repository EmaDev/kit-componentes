# useWebOTP

> Autocompleta el código de un SMS de verificación en Android/Chrome vía la WebOTP API — el usuario no tiene que salir de la app para copiar el código.

**Import**
```ts
import { useWebOTP } from "lib-kit-components";
```

## Cuándo usarlo

Junto a un flujo de verificación por SMS (2FA, confirmación de teléfono): en Android/Chrome, el navegador detecta el SMS entrante que siga el formato esperado y ofrece autocompletar el código sin que el usuario tenga que copiarlo a mano. Combina naturalmente con `CodeOTP` para el input segmentado — pasale el código recibido a su `onComplete`/estado controlado.

## Cuándo NO usarlo / alternativas

- En iOS no existe esta API, pero el autofill nativo de iOS funciona solo si el input tiene `autoComplete="one-time-code"` — `CodeOTP` ya lo configura en su primer input, así que no necesitás este hook para que iOS funcione; `useWebOTP` es un agregado específico para Android/Chrome por encima de eso.

## Firma

```ts
function useWebOTP(onCode: (code: string) => void, enabled?: boolean): void
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `onCode` | `(code: string) => void` | — (requerido) | Se llama con el código extraído del SMS. |
| `enabled` | `boolean` | `true` | Poné en `false` para no escuchar (por ejemplo, si ya se completó la verificación). |

No devuelve nada — es un hook de sólo efecto.

## Ejemplos

### Junto a CodeOTP
```tsx
function VerifyPhone() {
  const [code, setCode] = useState("");
  useWebOTP((c) => setCode(c), code.length < 6);

  return <CodeOTP length={6} value={code} onChange={setCode} onComplete={verifyCode} />;
}
```

## Requisitos / dependencias

- Sólo funciona en Android + Chrome (la WebOTP API no existe en otros navegadores/plataformas) y requiere HTTPS.
- El SMS que reciba el usuario **debe terminar** con `@tu-dominio.com #123456` (el dominio del sitio, seguido de `#` y el código) — es el formato exacto que exige la especificación para que el navegador pueda asociar el mensaje al origen que lo pidió. Sin ese sufijo, el navegador nunca ofrece el autocompletado.

## Notas y comportamiento

- El hook usa un `AbortController` para poder cancelar el pedido: se aborta automáticamente al desmontar o cuando `enabled` pasa a `false`, así no queda "escuchando" SMS indefinidamente después de que ya no hace falta.
- Sin soporte de la API (`"OTPCredential" in window` es `false`), el efecto no hace nada — no hay error ni advertencia, simplemente el autocompletado de Android no está disponible y el usuario escribe el código a mano (o usa el autofill nativo de iOS si aplica).
- Cancelar el pedido (por desmontaje, por otro `credentials.get()` en la página, o porque el usuario nunca recibe el SMS) resuelve como rechazo y se atrapa en silencio — no propaga ningún error a tu código.
