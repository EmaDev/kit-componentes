# useImmersive

> Modo inmersivo: esconde la barra de direcciones del navegador, sigue la altura real del viewport, y opcionalmente entra en fullscreen, bloquea la orientación y mantiene la pantalla encendida.

**Import**
```ts
import { useImmersive } from "lib-kit-components";
```

## Cuándo usarlo

Usalo en apps que necesitan aprovechar toda la pantalla como una app nativa: juegos, reproductores de video/audio a pantalla completa, kioscos, o cualquier pantalla donde la barra de direcciones del navegador o el salto de `100vh` al aparecer/desaparecer esa barra sean un problema visual. No hay un componente de alto nivel que envuelva este hook en la librería — es de uso directo.

## Firma

```ts
function useImmersive(options?: {
  hideAddressBar?: boolean;
  trackViewportHeight?: boolean;
  fullscreenOnInteraction?: boolean;
  keepAwake?: boolean;
  lockOrientation?: OrientationLockType; // "any" | "natural" | "landscape" | "landscape-primary" | "landscape-secondary" | "portrait" | "portrait-primary" | "portrait-secondary"
  disabled?: boolean;
}): {
  viewportHeight: number;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  awake: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  hideBrowserBar: () => void;
}
```

## Opciones (parámetros)

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `hideAddressBar` | `boolean` | `true` | Esconde la barra de direcciones del navegador en mobile, haciendo scroll a 1px al cargar y al rotar. Es la **única vía** en iOS Safari, que no permite usar la Fullscreen API en iPhone. |
| `trackViewportHeight` | `boolean` | `true` | Publica la altura real del viewport en la CSS var `--app-height` (px). Usala en vez de `100vh` para que el layout no salte cuando aparece/desaparece la barra del navegador. |
| `fullscreenOnInteraction` | `boolean` | `false` | Pide la Fullscreen API automáticamente en la primera interacción del usuario (`pointerdown`/`keydown`), necesario porque la mayoría de los navegadores exigen un gesto directo del usuario para conceder fullscreen. |
| `keepAwake` | `boolean` | `false` | Mantiene la pantalla encendida vía la Screen Wake Lock API mientras el hook está montado y la pestaña está visible. |
| `lockOrientation` | `OrientationLockType` | `undefined` (sin bloqueo) | Orientación a bloquear (ej. `"portrait"`). **Sólo se aplica cuando se entra en fullscreen** (ver nota abajo) — no bloquea nada por sí solo al montar el hook. |
| `disabled` | `boolean` | `false` | Desactiva todo el hook. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `viewportHeight` | `number` | Altura real del viewport en px (`visualViewport.height` si está disponible, si no `innerHeight`). |
| `isFullscreen` | `boolean` | Si el documento está en fullscreen ahora mismo (sincronizado con el evento `fullscreenchange`, sea cual sea la vía por la que se entró). |
| `fullscreenSupported` | `boolean` | El navegador soporta la Fullscreen API (`document.fullscreenEnabled`). |
| `awake` | `boolean` | El wake lock está activo. |
| `enterFullscreen` | `() => Promise<void>` | Pide fullscreen sobre `document.documentElement`. Si falla (rechazado por el usuario o no soportado), no lanza — falla en silencio. Si `lockOrientation` está seteado, intenta bloquear la orientación inmediatamente después de entrar en fullscreen. |
| `exitFullscreen` | `() => Promise<void>` | Sale de fullscreen. |
| `toggleFullscreen` | `() => Promise<void>` | Alterna entre `enterFullscreen`/`exitFullscreen` según el estado actual. |
| `hideBrowserBar` | `() => void` | Versión imperativa del truco de scroll para esconder la barra de direcciones; podés llamarlo manualmente (ej. tras cerrar un teclado en pantalla, o en un botón "Modo inmersivo"). |

## Ejemplos

### Uso básico: altura real + barra de direcciones oculta
```tsx
import { useImmersive } from "lib-kit-components";

function GameShell({ children }: { children: React.ReactNode }) {
  const { viewportHeight } = useImmersive();
  return <div style={{ height: viewportHeight || "100dvh" }}>{children}</div>;
  // o directamente en CSS: height: var(--app-height);
}
```

### Modo kiosko: fullscreen + orientación bloqueada + pantalla encendida
```tsx
function KioskButton() {
  const { toggleFullscreen, isFullscreen } = useImmersive({
    lockOrientation: "landscape",
    keepAwake: true,
  });

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? "Salir de pantalla completa" : "Modo kiosko"}
    </button>
  );
  // lockOrientation sólo toma efecto al llamar enterFullscreen (acá, vía toggleFullscreen)
}
```

### Fullscreen automático en la primera interacción (útil para juegos)
```tsx
function GamePage() {
  const { isFullscreen, fullscreenSupported } = useImmersive({
    fullscreenOnInteraction: true,
    lockOrientation: "landscape",
  });

  return (
    <div>
      {fullscreenSupported && !isFullscreen && <p>Tocá la pantalla para jugar en modo completo.</p>}
      <Game />
    </div>
  );
}
```

## Notas y comportamiento

- **El truco de `hideAddressBar` es exactamente eso: un truco.** Hace `window.scrollTo(0, 1)` y, 60ms después, `window.scrollTo(0, 0)`, tanto al montar (con un delay de 120ms) como en cada `orientationchange`. Es la única forma conocida de conseguir que Safari en iPhone colapse su chrome, ya que la Fullscreen API no está disponible ahí. Para que funcione, la página tiene que tener contenido más alto que el viewport (si no hay nada para scrollear, el truco no hace nada); si `hideBrowserBar` detecta que ya hay más de 1px de scroll (`window.scrollY > 1`), no hace nada (evita reiniciar un scroll que el usuario ya hizo).
- **`lockOrientation` normalmente requiere fullscreen activo**: el código sólo intenta `screen.orientation.lock(...)` dentro de `enterFullscreen()`, inmediatamente después de que el `requestFullscreen()` tiene éxito, y ese intento está envuelto en su propio `.catch()` silencioso. Si nunca llamás a `enterFullscreen`/`toggleFullscreen` (por ejemplo, sólo usás `hideAddressBar`), la opción `lockOrientation` **no tiene ningún efecto**, aunque la hayas pasado — es un error común esperar que bloquee la orientación sólo por pasarla como opción.
- **Gotcha de hidratación en `fullscreenSupported`**: a diferencia de `viewportHeight`/`isFullscreen`/`awake` (que parten de `useState` con valores fijos y seguros), `fullscreenSupported` se calcula como una constante directamente en el cuerpo del componente (`document.fullscreenEnabled`), no dentro de un efecto. En el servidor da `false` (no hay `document`); en el primer render del cliente ya puede dar `true` en navegadores que sí soportan Fullscreen API (la mayoría de desktop/Android; no en iPhone). Si renderizás UI condicionada directamente a `fullscreenSupported` (como en el tercer ejemplo de arriba), podés ver un warning de mismatch de hidratación puntual en esos navegadores — considerá retrasar esa condición a después del montaje si te preocupa el warning.
- `keepAwake` se libera automáticamente cuando el navegador oculta la pestaña (comportamiento estándar de la Wake Lock API) y el hook la vuelve a pedir solo cuando la pestaña vuelve a estar visible (`visibilitychange`); requiere HTTPS.
- `document.fullscreenEnabled` en iPhone es `false` (no soportado); en iPad sí suele estar soportado.
