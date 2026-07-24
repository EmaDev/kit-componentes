# usePlatform

> Detecta sistema operativo, navegador, form factor, modo de visualización (standalone/PWA), safe areas y preferencias del usuario, todo en un solo hook SSR-safe.

**Import**
```ts
import { usePlatform, type PlatformInfo, type OS, type Browser, type FormFactor, type DisplayMode } from "lib-kit-components";
```

## Cuándo usarlo

Es el hook base para cualquier lógica condicional por plataforma: mostrar instrucciones distintas en iOS vs Android, ocultar un botón de instalación dentro de un WebView embebido (Instagram, TikTok, etc.), adaptar el layout según `formFactor`, o aplicar padding de safe area sin montar un componente aparte. Varios componentes de la librería (`PwaInstallPrompt`, `NativeShell`, `SafeArea`, etc.) resuelven internamente esta misma detección; usá `usePlatform` directamente cuando necesités la información cruda para tu propia lógica en vez de sólo el resultado visual de esos componentes.

## Firma

```ts
function usePlatform(): PlatformInfo
```

No recibe parámetros.

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `os` | `"ios" \| "ipados" \| "android" \| "macos" \| "windows" \| "linux" \| "unknown"` | Sistema operativo detectado por user agent. iPadOS moderno se distingue de macOS porque el UA de iPad "miente" y dice `Macintosh`; se detecta por tener más de un touch point (`maxTouchPoints > 1`). |
| `browser` | `"safari" \| "chrome" \| "firefox" \| "edge" \| "samsung" \| "webview" \| "unknown"` | Navegador detectado por user agent. |
| `formFactor` | `"mobile" \| "tablet" \| "desktop"` | Basado en `iPad`/touch + tamaño de pantalla (lado más corto entre 600 y 1100px = tablet, menor a 600px con touch = mobile). |
| `displayMode` | `"browser" \| "standalone" \| "minimal-ui" \| "fullscreen" \| "twa"` | Cómo se está mostrando la app. `"twa"` se detecta por `document.referrer` empezando con `android-app://` (Trusted Web Activity de Android). |
| `isStandalone` | `boolean` | `true` si `displayMode !== "browser"` (instalada como PWA, TWA, o WebView de una app nativa). |
| `isIos` | `boolean` | `os === "ios" \|\| os === "ipados"`. |
| `isAndroid` | `boolean` | — |
| `isMobileOs` | `boolean` | iOS o Android (cualquier form factor). |
| `isTouch` | `boolean` | El dispositivo tiene pantalla táctil (`maxTouchPoints > 0` o soporte de `ontouchstart`). |
| `isWebView` | `boolean` | Corre dentro de un WebView embebido: Safari en iOS sin cadena `Safari` en el UA, Chrome de Android marcado `; wv)`, o dentro de apps conocidas (Facebook, Instagram, Line, Twitter, WhatsApp, TikTok, detectadas por patrones del UA). |
| `hasSafeArea` | `boolean` | El dispositivo reporta insets de safe area > 0 (notch, dynamic island, home indicator). |
| `safeArea` | `{ top: number; right: number; bottom: number; left: number }` | Insets reales en px, leídos vía un elemento sonda con `env(safe-area-inset-*)` (no se puede leer `env()` directo desde JS). |
| `prefersReducedMotion` | `boolean` | El usuario activó la preferencia de sistema "menos movimiento". |
| `pixelRatio` | `number` | `window.devicePixelRatio`. |
| `hydrating` | `boolean` | `true` únicamente en el primer render. Ver mecánica de hidratación abajo — **es el campo más importante a chequear antes de confiar en cualquier otro campo.** |

## Ejemplos

### Gatear el render hasta resolver la plataforma (evita flashes/mismatch)
```tsx
import { usePlatform } from "lib-kit-components";

function PlatformAwareUI() {
  const platform = usePlatform();
  if (platform.hydrating) return <Skeleton />; // idéntico en server y en la 1ª pasada del cliente

  return platform.isIos && !platform.isStandalone
    ? <IosInstallHint />
    : <AndroidInstallButton />;
}
```

### Ocultar instalación dentro de un WebView embebido
```tsx
function InstallCta() {
  const { isWebView, hydrating } = usePlatform();
  if (hydrating || isWebView) return null; // Instagram/TikTok in-app browser no soporta instalar PWAs
  return <InstallButton />;
}
```

### Layout condicional por form factor
```tsx
function Shell({ children }: { children: React.ReactNode }) {
  const { formFactor, hydrating } = usePlatform();
  if (hydrating) return <Skeleton />;
  return formFactor === "desktop" ? <SideBar>{children}</SideBar> : <BottomNav>{children}</BottomNav>;
}
```

## Notas y comportamiento

- **Mecánica de `hydrating` (importante, es sutil)**: el estado inicial se calcula con un inicializador perezoso de `useState(() => ({ ...detect(), hydrating: true }))`. En el servidor, `detect()` no tiene `window` y devuelve valores neutros (`os: "unknown"`, `formFactor: "desktop"`, etc.) con `hydrating: true`. **En el cliente, esa misma función se vuelve a ejecutar en el primer render (el de hidratación)** — y en ese momento `window` **ya existe**, así que `detect()` puede devolver de entrada valores reales (no neutros) para `os`, `browser`, `formFactor`, etc., aunque `hydrating` se fuerza a `true` de todas formas en ese primer render. Es decir: **`hydrating: true` es la única garantía de que el primer render del cliente coincide con el del servidor**; los demás campos pueden ya estar "resueltos" desde ese primer render y no necesariamente coinciden con lo que se renderizó en el servidor. Por eso **siempre hay que condicionar cualquier salida visual a `hydrating` antes de leer cualquier otro campo** (como en los ejemplos de arriba) — si renderizás `os`/`isIos`/etc. directamente sin ese gate, corrés riesgo de un warning de mismatch de hidratación en los navegadores donde el valor real difiere del neutro asumido en servidor.
- Tras el montaje, un `useEffect` corrige el estado a los valores reales con `hydrating: false`, y se vuelve a sincronizar automáticamente ante cambios de `display-mode` (instalar/desinstalar la PWA en caliente), `prefers-reduced-motion`, `orientationchange` y `resize`.
- La lectura de `safeArea` usa un `<div>` temporal invisible con `top:env(safe-area-inset-top,0px)` etc., insertado y removido del DOM en cada cálculo — es la única forma de leer `env()` desde JavaScript.
- La detección de WebView por apps conocidas (`FBAN|FBAV|Instagram|Line\/|Twitter|WhatsApp|TikTok`) es por patrón de user agent; navegadores in-app no listados explícitamente no se detectan por esa vía (pero sí pueden caer en la detección genérica de WebView de iOS/Android).
- Ningún campo de `PlatformInfo` (salvo `hydrating`) tiene un valor "por defecto" confiable para renderizar directamente sin gatear: todos parten de la detección real vía `detect()`.
