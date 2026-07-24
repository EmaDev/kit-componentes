# useHaptics

> Feedback táctil (vibración) con patrones semánticos con nombre, en vez de arrays de milisegundos "mágicos".

**Import**
```ts
import { useHaptics, type HapticPattern } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para dar feedback físico en interacciones clave en mobile: confirmar un guardado exitoso, marcar un error de validación, o el "tick" de seleccionar un ítem en una lista — en vez de llamar a `navigator.vibrate` directamente con números arbitrarios. No hay un componente de alto nivel que envuelva este hook — es de uso directo, normalmente en el `onClick`/`onTap` de botones o gestos importantes.

## Firma

```ts
function useHaptics(options?: { disabled?: boolean }): {
  supported: boolean;
  haptic: (pattern?: HapticPattern) => void;
  vibrate: (pattern: number | number[]) => void;
}
```

`HapticPattern = "selection" | "tap" | "impactLight" | "impactMedium" | "impactHeavy" | "success" | "warning" | "error" | "toggle"` (tipo exportado).

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `disabled` | `boolean` | `false` | Desactiva la vibración globalmente (por ejemplo, atado a una preferencia del usuario en la configuración de la app). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El dispositivo/navegador soporta `navigator.vibrate`. **Siempre `false` en cualquier navegador de iOS** (ver nota abajo). |
| `haptic` | `(pattern?: HapticPattern) => void` | Dispara uno de los patrones con nombre. Default: `"tap"` si no se pasa nada. |
| `vibrate` | `(pattern: number \| number[]) => void` | Dispara un patrón custom en ms (mismo formato que `navigator.vibrate`: un número, o un array alternando vibración/pausa). |

### Patrones con nombre disponibles

| Patrón | ms (`navigator.vibrate`) | Uso sugerido |
|---|---|---|
| `selection` | `[8]` | Cambiar de opción en un picker/slider. |
| `tap` (default) | `[12]` | Tap genérico en un botón. |
| `impactLight` | `[10]` | Impacto liviano (drag/drop suelta, swipe). |
| `impactMedium` | `[22]` | Impacto medio. |
| `impactHeavy` | `[38]` | Impacto fuerte. |
| `success` | `[14, 60, 26]` | Acción confirmada con éxito. |
| `warning` | `[26, 70, 26]` | Advertencia. |
| `error` | `[38, 60, 38, 60, 38]` | Error / validación fallida. |
| `toggle` | `[10, 40, 10]` | Prender/apagar un switch. |

## Ejemplos

### Feedback en un botón
```tsx
import { useHaptics } from "lib-kit-components";

function SaveButton({ onSave }: { onSave: () => void }) {
  const { haptic } = useHaptics();
  return (
    <button onClick={() => { haptic("success"); onSave(); }}>
      Guardar
    </button>
  );
}
```

### Distinguir éxito/error en un formulario
```tsx
function SubmitButton({ onSubmit }: { onSubmit: () => Promise<boolean> }) {
  const { haptic } = useHaptics();
  return (
    <button onClick={async () => {
      const ok = await onSubmit();
      haptic(ok ? "success" : "error");
    }}>
      Enviar
    </button>
  );
}
```

### Patrón custom y mostrar un hint sólo si hay soporte
```tsx
function VibrateTestButton() {
  const { supported, vibrate } = useHaptics();
  if (!supported) return null; // no tiene sentido mostrarlo en iOS/desktop
  return <button onClick={() => vibrate([50, 30, 50, 30, 100])}>Probar vibración</button>;
}
```

## Notas y comportamiento

- **iOS Safari (y cualquier navegador en iOS, incluidos Chrome/Firefox para iOS, que son WebKit por debajo) NUNCA soporta la Vibration API.** No es un bug ni una limitación temporal: Apple directamente no la implementa en WebKit/iOS. `supported` va a devolver `false` siempre ahí, y `haptic()`/`vibrate()` van a ser no-ops silenciosos. No hay ningún workaround desde la web para conseguir feedback háptico real en iOS Safari; sólo una app nativa puede acceder al Taptic/Haptic Engine de Apple.
- `vibrate()` también respeta `prefers-reduced-motion: reduce` automáticamente: si el usuario tiene esa preferencia de accesibilidad activada a nivel sistema, la llamada no hace nada, sin necesidad de chequearlo vos mismo.
- Android (Chrome, Firefox, Samsung Internet) soporta bien la Vibration API. Desktop en general no tiene hardware de vibración, así que `supported` suele ser `false` ahí también, aunque técnicamente algunos navegadores expongan la función.
- La llamada real a `navigator.vibrate` está envuelta en `try/catch`: algunos navegadores exigen que se dispare desde un gesto directo del usuario (click/tap) o pueden bloquearla por policy — en esos casos falla en silencio, sin lanzar hacia tu código.
- `haptic(pattern)` internamente copia el array del patrón (`[...PATTERNS[pattern]]`) antes de pasarlo a `vibrate`, así que no hay riesgo de mutar los patrones base entre llamadas.
