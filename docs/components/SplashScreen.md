# SplashScreen

> Pantalla de carga a pantalla completa con 6 estilos de animación, pensada para el arranque de la app (mientras se resuelven fuentes, sesión, primer fetch, etc.).

**Import**
```tsx
import { SplashScreen } from "lib-kit-components";
import type { SplashVariant } from "lib-kit-components";
// se usa típicamente junto con:
import { useSplash } from "lib-kit-components";
```

## Cuándo usarlo

Usalo al arrancar la app (dentro del layout raíz) para tapar el contenido mientras se resuelven tareas iniciales — carga de fuentes, restauración de sesión, primer fetch crítico — y evitar un flash de contenido sin estilos o a medio cargar. Es puramente presentacional: el ciclo de vida (cuándo mostrarse y ocultarse) lo maneja el hook `useSplash`, que expone `visible` y `progress` para pasarle a este componente.

## Cuándo NO usarlo / alternativas

- No es un spinner de carga para una sección puntual de la UI (por ejemplo un botón o una tarjeta) — es un overlay de pantalla completa (`fixed inset-0 z-[200]`) pensado sólo para el arranque de la app. Para loaders locales, usá `Spinner`.
- No maneja por sí solo cuándo ocultarse: siempre necesita `visible` controlado desde afuera (normalmente con `useSplash`).

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `visible` | `boolean` | — | Controla la visibilidad. Requerido — usá `useSplash()` para manejar su ciclo de vida automáticamente. |
| `appName` | `string` | — | Nombre de la app. Requerido. |
| `tagline` | `string` | — | Texto corto bajo el nombre. |
| `version` | `string` | — | Versión mostrada al pie (se antepone `v`, ej. `"v1.4.0"`). |
| `footnote` | `string` | — | Texto extra al pie (build, entorno, copyright). |
| `icon` | `ReactNode` | ícono por defecto (rayo) | Icono/logo — `<img>`, svg o cualquier `ReactNode`. |
| `variant` | `SplashVariant` | `"fade"` | Estilo de animación. Ver tipo exportado abajo. |
| `progress` | `number` | `0` | Progreso de `0` a `1`. Sólo tiene efecto visual con `variant="bars"` (llena la barra); para las demás variantes se ignora visualmente. |
| `background` | `"surface" \| "brand" \| "dark" \| string` | `"surface"` | Fondo: `"surface"` (tema), `"brand"` (gradiente primary→accent), `"dark"` (`bg-foreground`), o cualquier valor CSS custom (ej. `"#0f172a"`, `"linear-gradient(...)"`). |
| `hideName` | `boolean` | `false` | Oculta el nombre de la app (modo sólo-logo). |
| `onExited` | `() => void` | — | Callback cuando la animación de salida terminó (vía `AnimatePresence.onExitComplete`). |

## Tipos exportados

```ts
export type SplashVariant =
  | "fade"    // sobrio: fade + leve subida, salida por opacidad
  | "pulse"   // anillos concéntricos que laten alrededor del icono
  | "orbit"   // punto orbitando el icono
  | "bars"    // barra de progreso bajo el logo
  | "zoom"    // el icono entra con spring y la pantalla escala al salir (estilo iOS)
  | "wipe";   // dos paneles que se abren revelando la app
```

## Ejemplos

### Uso básico con `useSplash`
```tsx
const { visible, progress } = useSplash({
  minDuration: 1400,
  until: () => loadSession(),
  waitForFonts: true,
});

<SplashScreen
  visible={visible}
  progress={progress}
  appName="Mi App"
  tagline="Tu frase corta"
/>
```

### Variante de marca, con barra de progreso real
```tsx
<SplashScreen
  visible={visible}
  progress={progress}
  variant="bars"
  background="brand"
  appName="Mi App"
  version="1.4.0"
  footnote="build 2f9a1c"
  icon={<img src="/icon.svg" alt="" />}
/>
```

### Estilo iOS (zoom) con logo únicamente
```tsx
<SplashScreen
  visible={visible}
  variant="zoom"
  appName="Mi App"
  hideName
  icon={<img src="/icon.png" alt="" />}
/>
```

### Una sola vez por sesión, con callback al salir
```tsx
const { visible, progress, hide } = useSplash({ oncePerSession: true });

<SplashScreen
  visible={visible}
  variant="wipe"
  appName="Mi App"
  onExited={() => console.log("splash cerrado")}
/>
```

## Requisitos / dependencias

- Usa `framer-motion` (`motion`, `AnimatePresence`, `Variants`) de forma intensiva: cada variante define animaciones de entrada y salida propias, incluyendo paneles que se separan (`wipe`), anillos concéntricos (`pulse`) y un punto orbitando (`orbit`).
- Se suele combinar con el hook `useSplash`, que resuelve `visible`/`progress` a partir de una duración mínima, la carga de fuentes (`document.fonts.ready`) y una promesa opcional (`until`).
- No depende de PWA/service worker — es puramente de UI/tiempos de carga.

## Notas y comportamiento

- Cada variante define su propia animación de salida en `shell.exit` (por ejemplo, `zoom` escala hasta 1.12 al salir; `wipe` mantiene la opacidad del fondo pero anima los paneles por separado; el resto simplemente hace fade out).
- El progreso (`progress`) sólo se refleja visualmente en `variant="bars"` como el ancho de la barra (`width: ${Math.round(progress * 100)}%`); en las demás variantes la prop se recibe pero no tiene efecto visual directo.
- `background` acepta cualquier string CSS válido más allá de los 3 presets — se aplica como `style={{ background: customBg }}` cuando no coincide con `"surface"`, `"brand"` o `"dark"`.
- Cuando `background` es `"brand"` o `"dark"` (`onBrand === true`), los textos y el ícono cambian a variantes claras/blancas para mantener contraste.
- `role="status"` con `aria-label={"Cargando " + appName}` para anunciarse a lectores de pantalla.
- El contenido queda con `z-[200]`, por encima de casi cualquier otro overlay de la librería (los prompts PWA usan `z-[110]`–`z-[130]`), pensado para taparlo todo durante el arranque.
- Respeta `env(safe-area-inset-bottom)` en la zona de versión/footnote.
