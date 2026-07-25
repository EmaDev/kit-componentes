# Keypad

> Teclado numérico táctil 3×4, con tecla extra opcional junto al 0 y borrado con long-press. Pieza de bajo nivel usada internamente por `AmountPad` y `PinLock`.

**Import**
```tsx
import { Keypad, type KeypadKey } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando necesitás un teclado numérico propio dentro de la app (no el teclado nativo del dispositivo): carga de PIN, monto, código de verificación, o cualquier input numérico a pantalla completa donde preferís controlar vos el layout y el feedback táctil en vez de abrir el teclado del sistema. Es la pieza que arman `AmountPad` (con tecla de coma para centavos) y `PinLock` (sin tecla extra) — si necesitás ese flujo completo ya armado, usá esos componentes en vez de `Keypad` suelto.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás un input numérico de formulario estándar (con el teclado nativo del dispositivo), usá [Input](Input.md) con `type="number"` o `inputMode="numeric"` — `Keypad` es para flujos a pantalla completa que reemplazan el teclado del sistema.
- Para cargar un monto de dinero con formato de moneda en vivo, usá [AmountPad](AmountPad.md) directamente en vez de armar la pantalla vos con `Keypad`.
- Para una pantalla de bloqueo por PIN, usá [PinLock](PinLock.md) directamente — ya incluye el `Keypad`, los puntos de progreso y la verificación.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `onKey` | `(key: KeypadKey) => void` | — (requerido) | Se llama al tocar cualquier tecla, incluida `"backspace"` y `extraKey`. |
| `extraKey` | `KeypadKey \| null` | `null` | Tecla a la izquierda del 0 (ej. `","`, `"."`, `"00"`). `null` deja esa celda vacía. |
| `backspaceIcon` | `ReactNode` | ícono de flecha por defecto | Ícono custom para la tecla de borrado. |
| `onBackspaceLong` | `() => void` | `undefined` | Si se define, mantener presionada la tecla de borrado 550ms la dispara (además del vibrado `"warning"`), típicamente para borrar todo. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Alto de las teclas: `sm` 48px · `md` 60px · `lg` 72px. |
| `letters` | `boolean` | `false` | Muestra las letras estilo teléfono (ABC, DEF…) debajo de cada número del 2 al 9. |
| `disabled` | `boolean` | `false` | Deshabilita todas las teclas. |
| `className` | `string` | `""` | Clases CSS adicionales para el grid. |

## Tipos exportados

```ts
export type KeypadKey = string;
```

## Ejemplos

### Teclado básico
```tsx
const [code, setCode] = useState("");

<Keypad
  onKey={(k) => {
    if (k === "backspace") return setCode((c) => c.slice(0, -1));
    setCode((c) => (c.length < 6 ? c + k : c));
  }}
/>
```

### Con tecla de coma y borrado total en long-press
```tsx
<Keypad
  onKey={push}
  extraKey=","
  onBackspaceLong={() => setRaw("")}
  size="lg"
/>
```

### Estilo teléfono, con letras
```tsx
<Keypad onKey={dial} letters />
```

## Requisitos / dependencias

- No depende de `next` ni de `framer-motion`.
- Usa `useHaptics` internamente: cada tap dispara `haptic("tap")`, y el long-press de borrado dispara `haptic("warning")` antes de llamar a `onBackspaceLong`.
- Marcado como `"use client"`.
- No es controlado: no mantiene ningún valor propio, sólo emite teclas vía `onKey` — el estado del código/monto vive en el componente padre.

## Notas y comportamiento

- El grid es fijo de 3 columnas × 4 filas: dígitos 1-9, luego `extraKey | 0 | backspace`. Si `extraKey` es `null`, esa celda queda como un `<span aria-hidden>` vacío en vez de un botón.
- El long-press de borrado usa un `setTimeout` de 550ms guardado en una variable local del componente (no un `ref`/`state`); se cancela en `onPointerUp`/`onPointerLeave`. Sin `onBackspaceLong`, el listener de `onPointerDown` ni se agrega.
- `touchAction: "manipulation"` en cada botón evita el delay de 300ms de tap en navegadores móviles y el zoom por doble-tap accidental.
- `aria-label="Borrar"` en la tecla de retroceso; el resto usa el propio dígito/tecla como `aria-label`.
- `role="group"` con `aria-label="Teclado numérico"` en el contenedor.
