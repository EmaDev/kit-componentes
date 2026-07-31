# StudyTimer

> Temporizador Pomodoro: alterna foco y descanso automáticamente, con anillo de progreso y conteo de ciclos completados.

**Import**
```tsx
import { StudyTimer } from "lib-kit-components";
```

## Cuándo usarlo

Usalo cuando la sesión de estudio o trabajo se organiza en bloques de tiempo con descansos: la técnica Pomodoro clásica (25/5) o cualquier variante. El componente cambia de modo solo al llegar a cero y sigue corriendo, así que el usuario no tiene que tocar nada entre bloques.

## Cuándo NO usarlo / alternativas

- Si es una cuenta atrás **hacia un momento fijo** (fin de una oferta, un evento), usá [CountdownBanner](CountdownBanner.md) — trabaja con una fecha, no con una duración.
- Si la cuenta atrás termina en una redirección, usá [RedirectTimer](RedirectTimer.md).
- Si sólo querés mostrar un anillo de progreso animado sin lógica de tiempo, usá [AnimatedProgressRing](AnimatedProgressRing.md) o `ProgressRing` de [Progress](Progress.md).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `focusMinutes` | `number` | `25` | Duración del bloque de foco, en minutos. |
| `breakMinutes` | `number` | `5` | Duración del descanso, en minutos. |
| `onCycleComplete` | `(kind: "focus" \| "break") => void` | `undefined` | Se llama cada vez que un bloque llega a cero, con el tipo del bloque que **terminó** (no el que empieza). |
| `className` | `string` | `""` | Clases adicionales en el contenedor raíz. |

## Ejemplos

### Uso básico
```tsx
<StudyTimer />
```

### Bloques más largos, notificando cada cambio
```tsx
<StudyTimer
  focusMinutes={50}
  breakMinutes={10}
  onCycleComplete={(kind) =>
    snack({ message: kind === "focus" ? "¡Tomate un descanso!" : "Volvamos al foco", variant: "success" })
  }
/>
```

### Con notificación del sistema al terminar el foco
```tsx
const { notify } = useNotificationPermission();

<StudyTimer
  onCycleComplete={(kind) => kind === "focus" && notify("Pomodoro terminado", { body: "5 minutos de descanso." })}
/>
```

## Requisitos / dependencias

- Marcado como `"use client"`.
- No requiere `framer-motion`: el anillo es un `<circle>` de SVG con `stroke-dashoffset` animado por CSS.
- No depende de Next.js.
- Usa los tokens `--color-primary` (foco), `--color-success` (descanso) y `--color-border`.

## Notas y comportamiento

- **Arranca en pausa**: hay que tocar "Iniciar". El modo inicial es siempre `focus`.
- El pasaje de foco a descanso (y vuelta) es **automático y sin fin**: el timer no se detiene al terminar un bloque, arranca el siguiente. Sólo se detiene con "Pausar".
- El contador de ciclos sube **al terminar un bloque de foco**, no al terminar el descanso.
- "Reiniciar" vuelve a `focus` con el reloj completo y **pausa** el timer, pero **no** resetea el contador de ciclos.
- **La cuenta usa `setInterval` de 1 s sin corregir contra el reloj real**, así que acumula deriva y, más importante, **los navegadores limitan los timers en pestañas en segundo plano**: si el usuario cambia de pestaña o bloquea el teléfono, el timer se atrasa (en móvil puede pausarse del todo). Para sesiones largas donde la precisión importe, combinalo con [`useAppLifecycle`](../hooks/useAppLifecycle.md) para recalcular al volver, o mantené la pantalla despierta con `keepAwake` de [`useImmersive`](../hooks/useImmersive.md).
- Cambiar `focusMinutes` o `breakMinutes` **en caliente no ajusta el bloque en curso**: el nuevo valor se aplica cuando arranca el siguiente bloque. El estado inicial se toma de `focusMinutes` al montar.
- `onCycleComplete` se llama dentro del updater de estado del intervalo. Pasá una función estable (`useCallback`) — la identidad de esta prop está en las dependencias del `useEffect`, así que una función nueva en cada render reinicia el intervalo y hace perder hasta un segundo por render.
- No emite sonido ni vibración: si querés feedback, engancharlo desde `onCycleComplete` (por ejemplo con [`useHaptics`](../hooks/useHaptics.md)).
- No persiste nada: al recargar la página arranca de cero. Para que sobreviva, guardá el estado con [`usePersistentState`](../hooks/usePersistentState.md) por fuera.
