# CoachMark

> Tour guiado paso a paso que resalta elementos reales de la UI con un spotlight y una tarjeta explicativa, para onboarding de funcionalidades.

**Import**
```tsx
import { CoachMark } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para **onboarding activo**: guiar a un usuario nuevo (o ante una funcionalidad nueva) por una secuencia de 2 o más elementos reales de la pantalla, oscureciendo el resto de la UI y mostrando un recorte ("spotlight") sobre el elemento actual junto con un título, descripción y navegación Siguiente/Atrás/Saltar.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás aclarar el significado de **un** elemento puntual, sin secuencia ni bloqueo del resto de la pantalla, usá `Tooltip`.
- Si el contenido a mostrar es interactivo pero no forma parte de un tour guiado (un mini-formulario, un selector), usá `Popover`.
- Si el mensaje es un aviso puntual no bloqueante ("Nueva función disponible"), usá `Toast` o `NotificationOptIn` en vez de un tour de varios pasos.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `steps` | `CoachMarkStep[]` | — (requerido) | Pasos del tour, en orden. Si está vacío, el componente no renderiza nada. |
| `open` | `boolean` | — (requerido) | Controla si el tour está visible. |
| `onClose` | `() => void` | — (requerido) | Se llama al cerrar: botón "Saltar", tecla `Escape`, o al confirmar el último paso (después de `onFinish`). |
| `onFinish` | `() => void` | `undefined` | Se llama al confirmar el último paso, **antes** de `onClose`. Útil para marcar el tour como completado (ej. guardarlo en `localStorage`). |
| `step` | `number` | `undefined` | Índice del paso actual (controlado, 0-indexed). Si se omite, el componente maneja su propio estado interno. |
| `onStepChange` | `(index: number) => void` | `undefined` | Se llama cada vez que el paso debería cambiar (Siguiente/Atrás). En modo controlado es la única forma de que el cambio tenga efecto. |
| `nextLabel` | `string` | `"Siguiente"` | Texto del botón de avance (excepto en el último paso). |
| `prevLabel` | `string` | `"Atrás"` | Texto del botón de retroceso (oculto en el primer paso). |
| `finishLabel` | `string` | `"Entendido"` | Texto del botón de avance en el último paso. |
| `skipLabel` | `string` | `"Saltar"` | Texto del botón de cierre anticipado. |
| `showSkip` | `boolean` | `true` | Muestra/oculta el botón "Saltar" (arriba a la derecha). |
| `spotlightPadding` | `number` | `8` | Píxeles de margen entre el borde del elemento resaltado y el recorte del spotlight. |
| `className` | `string` | `""` | Clases para el contenedor raíz (`fixed inset-0`). |

## Tipos exportados

```ts
export interface CoachMarkStep {
  /** Selector CSS (document.querySelector) o ref del elemento a resaltar. */
  target: string | React.RefObject<HTMLElement>;
  title: string;
  description?: string;
  side?: "top" | "bottom" | "left" | "right"; // default: "bottom"
  align?: "start" | "center" | "end";         // default: "center"
}

export type CoachMarkSide = "top" | "bottom" | "left" | "right";
export type CoachMarkAlign = "start" | "center" | "end";
```

## Ejemplos

### Uso básico con selectores CSS
```tsx
const [tourOpen, setTourOpen] = useState(true);

<CoachMark
  open={tourOpen}
  onClose={() => setTourOpen(false)}
  onFinish={() => localStorage.setItem("onboarding-done", "1")}
  steps={[
    { target: "#nav-search", title: "Buscá lo que necesites", description: "Escribí un producto o proveedor y filtrá en vivo." },
    { target: "#cart-button", title: "Tu carrito", description: "Revisá tus pedidos pendientes acá.", side: "left" },
    { target: "#profile-avatar", title: "Tu cuenta", description: "Configurá notificaciones y datos de facturación.", side: "bottom", align: "end" },
  ]}
/>
```

### Con refs (elementos sin id estable)
```tsx
const btnRef = useRef<HTMLButtonElement>(null);

<Button ref={btnRef}>Exportar</Button>

<CoachMark
  open={tourOpen}
  onClose={() => setTourOpen(false)}
  steps={[{ target: btnRef, title: "Exportá tus datos", description: "Generá un CSV o PDF con un click." }]}
/>
```

### Controlado, con navegación externa
```tsx
const [step, setStep] = useState(0);

<CoachMark
  open={tourOpen}
  step={step}
  onStepChange={setStep}
  onClose={() => setTourOpen(false)}
  steps={tourSteps}
/>
<p>Paso {step + 1} de {tourSteps.length}</p>
```

## Requisitos / dependencias

- Usa `framer-motion` internamente para la animación del overlay, el spotlight (con `layout` para transiciones suaves entre elementos) y la tarjeta.
- Marcado como `"use client"`.
- No requiere ningún provider.
- Soporta modo **controlado** (`step` + `onStepChange`) y **no controlado** (omitiendo `step`), igual que `Popover`.

## Notas y comportamiento

- El elemento resaltado se resuelve con `document.querySelector(target)` (si `target` es `string`) o `target.current` (si es un `RefObject`) **en el momento de medir**, no al montar — si el elemento no existe todavía en el DOM, el spotlight se omite (fondo oscuro sólido sin recorte) hasta que aparezca.
- Mientras el tour está abierto, se recalcula la posición del elemento en cada `resize` y `scroll` (con `capture: true`, así detecta scroll de contenedores internos, no sólo de `window`), y se hace `scrollIntoView({ block: "center" })` sobre el target al cambiar de paso.
- El spotlight se dibuja con un `box-shadow: 0 0 0 9999px rgba(0,0,0,0.65)` sobre un div del tamaño exacto del target (+ `spotlightPadding`), no con un SVG de máscara — es una técnica CSS simple pero significa que el recorte siempre es rectangular (con esquinas redondeadas), no sigue la forma real de elementos no rectangulares.
- **El spotlight tiene `pointer-events: none`**: durante el tour, el usuario no puede interactuar con el elemento resaltado ni con el resto de la página; sólo puede avanzar/retroceder/saltar desde la tarjeta. Esto es intencional para mantener el flujo del tour, pero significa que `CoachMark` no sirve para tours "hands-on" donde el usuario debe clickear el elemento real.
- La tarjeta bloquea el scroll del body (`document.body.style.overflow = "hidden"`) igual que `Modal`, y se cierra con `Escape`.
- El lado de la tarjeta (`side` de cada paso) se auto-invierte si no entra en el viewport, igual que `Tooltip`, pero **no hay clamping en el eje de alineación** (`align`): un target muy cerca de un borde puede hacer que la tarjeta se recorte.
- `z-[210]`: el nivel más alto de la librería, por encima de `SplashScreen`/`ImageZoom` (`z-[200]`), para garantizar que el tour se vea sobre cualquier otro overlay.
- Si `steps` está vacío, el componente retorna `null` sin importar el valor de `open`.
