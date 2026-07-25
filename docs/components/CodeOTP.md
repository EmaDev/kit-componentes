# CodeOTP

> Input de código de un solo uso (OTP/2FA) en casillas segmentadas, con auto-avance, borrado inteligente y pegado multi-dígito.

**Import**
```tsx
import { CodeOTP } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para capturar un código corto de verificación: 2FA por SMS/email, confirmación de PIN de un solo uso, código de invitación numérico. Cada dígito ocupa su propia casilla, con foco que avanza automáticamente al escribir y retrocede al borrar, y soporta pegar el código completo de una vez (por ejemplo desde el portapapeles o el autofill del navegador/SMS).

## Cuándo NO usarlo / alternativas

- Si el código de verificación es en realidad una contraseña que el usuario define y confirma (no un código enviado por otro canal), usá `Input` con `type="password"`.
- Si necesitás una pantalla completa de bloqueo por PIN (no un campo dentro de un formulario), usá `PinLock`, que además tiene teclado numérico propio integrado.
- Si el "código" es en realidad texto libre corto (no un valor de longitud fija por casilla), usá `Input`.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `length` | `number` | `6` | Cantidad de casillas/dígitos. |
| `value` | `string` | `undefined` | Valor controlado (hasta `length` caracteres). Si se omite, el componente maneja su propio estado interno. |
| `onChange` | `(value: string) => void` | `undefined` | Se llama en cada cambio con el string acumulado (puede estar incompleto). |
| `onComplete` | `(value: string) => void` | `undefined` | Se llama una única vez cuando las `length` casillas quedan completas. |
| `type` | `"numeric" \| "alphanumeric"` | `"numeric"` | Caracteres aceptados por casilla. |
| `masked` | `boolean` | `false` | Si es `true`, cada casilla usa `type="password"` (oculta el carácter). |
| `disabled` | `boolean` | `false` | Deshabilita todas las casillas. |
| `label` | `string` | `undefined` | Texto arriba de las casillas. |
| `hint` | `string` | `undefined` | Texto de ayuda debajo (se oculta si hay `error`). |
| `error` | `string` | `undefined` | Mensaje de error; también pinta el borde de las casillas en rojo. |
| `autoFocus` | `boolean` | `false` | Enfoca la primera casilla al montar. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño de cada casilla. |
| `className` | `string` | `""` | Clases para el contenedor raíz. |

## Tipos exportados

```ts
export type CodeOTPType = "numeric" | "alphanumeric";
export type CodeOTPSize = "sm" | "md" | "lg";
```

## Ejemplos

### Uso básico, no controlado
```tsx
<CodeOTP
  length={6}
  label="Código de verificación"
  hint="Te lo enviamos por SMS."
  onComplete={(code) => verifyCode(code)}
/>
```

### Controlado, con error
```tsx
const [code, setCode] = useState("");
const [error, setError] = useState<string>();

<CodeOTP
  length={4}
  value={code}
  onChange={setCode}
  error={error}
  onComplete={async (c) => {
    const ok = await verify(c);
    if (!ok) setError("Código incorrecto");
  }}
/>
```

### Alfanumérico y enmascarado
```tsx
<CodeOTP length={8} type="alphanumeric" masked label="Código de invitación" />
```

## Requisitos / dependencias

- Usa `framer-motion` para la micro-animación de escala al enfocar cada casilla (`whileFocus`) y para la aparición/desaparición de `hint`/`error`.
- Marcado como `"use client"`.
- Soporta modo **controlado** (`value` + `onChange`) y **no controlado** (omitiendo `value`), igual que `Popover`/`CoachMark`.

## Notas y comportamiento

- Cada casilla acepta un único carácter validado contra `/^[0-9]$/` (`type="numeric"`) o `/^[a-zA-Z0-9]$/` (`type="alphanumeric"`); un carácter que no matchea se ignora silenciosamente (la casilla no cambia).
- **Auto-avance**: escribir un carácter válido mueve el foco a la siguiente casilla automáticamente. **Backspace inteligente**: si la casilla actual tiene contenido, lo borra sin mover el foco; si está vacía, borra la casilla anterior y mueve el foco ahí (como en la mayoría de los flujos de OTP nativos).
- **Pegado multi-dígito**: pegar un string sobre cualquier casilla distribuye los caracteres válidos a partir de esa posición (no necesariamente desde la primera casilla) y mueve el foco a la última casilla completada.
- La primera casilla tiene `autoComplete="one-time-code"`, lo que permite el autofill nativo de iOS/Android al recibir un SMS con el código (el resto de las casillas tienen `autoComplete="off"`).
- `onComplete` se dispara exactamente cuando el string acumulado alcanza `length` caracteres (todas las casillas llenas), no antes; si el usuario borra un dígito después de completar el código, `onComplete` no se vuelve a disparar hasta volver a completarlo.
- En modo controlado (`value` definido), el componente **no** mantiene estado propio: cada tecla dispara `onChange` y es responsabilidad del consumidor actualizar `value` para que el cambio se refleje visualmente.
