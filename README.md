# Scaffolding · Atomic Components

31 componentes + 13 hooks para Next.js + React + Tailwind v4 + Framer Motion, con soporte de tema claro/oscuro vía la clase `.dark` (compatible con `next-themes`).

> 📖 **[Guía completa de uso de cada componente y hook →](docs/README.md)** — cuándo usar cada uno, todas sus props, ejemplos y comportamiento no obvio. Pensada para vos o para que la lea una IA antes de implementar.

## 📁 Estructura

```
app/
  globals.css            # Tokens de tema + base PWA
components/
  Button.tsx
  Input.tsx
  Textarea.tsx
  Select.tsx
  Dropdown.tsx
  Spinner.tsx
  Toast.tsx              # incluye <ToastProvider> + hook useToast()
  Checkbox.tsx           # + <CheckboxGroup/>
  Modal.tsx
  BottomSheet.tsx        # 7 alturas + snapPoints arrastrables
  Breadcrumbs.tsx
  FlipCard.tsx           # + <CreditCard/> y <CreditCardStack/>
  FloatingButton.tsx     # FAB + speed dial
  Stepper.tsx            # + <AddButton/>
  Progress.tsx           # <ProgressBar/> <ProgressRing/> <StepsProgress/>
  DataTable.tsx          # orden, búsqueda, selección, paginado, sticky header
  Spreadsheet.tsx        # hoja de cálculo editable con fórmulas y atajos
  CalendarGrid.tsx       # grilla mensual con eventos
  Navbar.tsx             # usa next/link + next/navigation
  SideBar.tsx            # usa next/link + next/navigation
  BottomNav.tsx          # usa next/link + next/navigation
  PwaInstallPrompt.tsx   # banner Android + sheet iOS
  InstallButton.tsx      # botón de instalación embebible
  OfflineBanner.tsx      # offline / reconectado / conexión lenta
  UpdatePrompt.tsx       # "nueva versión disponible" (service worker)
  NotificationOptIn.tsx  # opt-in de notificaciones
  PwaStatus.tsx          # panel de diagnóstico PWA
  SplashScreen.tsx       # 6 estilos de animación · icono · versión
  SafeArea.tsx           # + <SafeAreaSpacer/>: notch, island, home indicator
  NativeShell.tsx        # raíz todo-en-uno para experiencia nativa
  ViewportLock.tsx       # bloquea zoom/overscroll/long-press (sin UI)
  index.ts               # barrel export
hooks/
  useSpreadsheet.ts            # motor de fórmulas + selección + undo/redo
  usePwaInstall.ts             # beforeinstallprompt + standalone + snooze
  useOnlineStatus.ts           # online/offline + conexión lenta
  useServiceWorker.ts          # registro + detección de actualización
  useNotificationPermission.ts # permiso + notificación local
  usePlatform.ts               # OS, navegador, form factor, display mode, safe areas
  useNativeFeel.ts             # bloqueos para experiencia nativa
  useSplash.ts                 # duración mínima + espera de recursos + progreso
  useSafeArea.ts               # insets reactivas + CSS vars --sa-*
  useImmersive.ts              # esconde la barra del navegador, fullscreen, wake lock
  useKeyboardInset.ts          # altura del teclado virtual (--kb-inset)
  useHaptics.ts                # feedback táctil con nombres semánticos
  useStatusBarColor.ts         # tiñe la barra de estado (theme-color)
docs/                     # guía de uso de cada componente y hook (ver enlace arriba)
dev/                      # playground Vite que importa components/ real (ver sección Preview)
```

## 🔧 Instalación

Asume Next.js 15 + Tailwind v4. Se distribuye como dependencia de Git (repo privado en GitHub), no desde npm.

```bash
npm i github:<usuario>/lib-kit-components
# o fijando una versión/commit concreto:
npm i github:<usuario>/lib-kit-components#v0.1.0
```

`npm install` corre automáticamente el script `prepare` (`tsup`), que compila `dist/` a partir del código fuente — no hace falta commitear el build.

También necesitás los peer dependencies en el proyecto consumidor:

```bash
npm i react react-dom framer-motion next-themes
```

(`next` es peer dependency opcional: sólo hace falta si usás `Navbar`, `SideBar` o `BottomNav`, que usan `next/link` y `next/navigation`.)

### Estilos y tokens de tema

El paquete expone su CSS de tokens en `lib-kit-components/styles.css`. Importalo una vez en tu `app/globals.css` (o equivalente) **antes** de tus propios estilos, y decile a Tailwind v4 que escanee las clases usadas dentro del paquete (viven compiladas en `dist/`, fuera de tu `content` habitual):

```css
@import "tailwindcss";
@import "lib-kit-components/styles.css";
@source "../node_modules/lib-kit-components/dist";
```

Si ya tenés tus propios tokens de tema (`--color-primary`, etc.) podés omitir el `@import` del paquete y definir vos las variables — los componentes sólo necesitan que existan.

En `app/layout.tsx`:

```tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "lib-kit-components";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Todos los imports de ejemplo en este README (`@/components/...`) pasan a importarse directo desde `"lib-kit-components"` una vez instalado como paquete.

## 🎨 Tokens

Todos los colores usan CSS variables (`--color-primary`, `--color-foreground`, …) definidas en `globals.css`. Cambia los valores allí — los componentes se adaptan solos en claro/oscuro.

## 🧪 Preview y desarrollo local

`dev/` es un playground real con Vite que importa los componentes **directamente desde `components/`** (mismo Tailwind v4 + Framer Motion que consume cualquier proyecto) — no un mock.

```bash
cd dev
npm install
npm run dev
# abrí la URL que imprime Vite (típicamente http://localhost:5173)
```

Los tres componentes que dependen de Next.js (`Navbar`, `SideBar`, `BottomNav`, por `next/link`/`next/navigation`) no resuelven en este playground de Vite — tienen su propia sección en el sidebar con una nota explicando por qué, en vez de una demo en vivo.

Para agregar un componente nuevo al playground (y el resto de los pasos obligatorios al crear uno): ver [CLAUDE.md](CLAUDE.md).

## 📚 Uso rápido

```tsx
// Button
<Button variant="primary" size="md" loading={false}>Guardar</Button>

// Input
<Input label="Email" type="email" leftIcon={<MailIcon />} error="..." />

// Select
<Select options={[{value:"a",label:"A"}]} onChange={v => …} />

// Toast
const { toast } = useToast();
toast({ title: "¡Listo!", variant: "success" });

// Modal
<Modal open={open} onClose={…} title="Hola" footer={<Button>OK</Button>}>
  …
</Modal>

// BottomSheet — auto | xs | sm | md | lg | xl | full
<BottomSheet open={open} onClose={…} size="md" title="Elegí una opción"
  footer={<Button>Confirmar</Button>}>
  …
</BottomSheet>

// …o con alturas arrastrables
<BottomSheet snapPoints={[0.35, 0.65, 0.92]} defaultSnap={0} … />
```

## 📊 Datos y grillas

```tsx
// Tabla profesional
const columns: Column<Person>[] = [
  { key: "name", header: "Persona", width: "minmax(200px,1.4fr)",
    render: r => <PersonCell row={r} /> },
  { key: "mrr", header: "MRR", align: "right", sortValue: r => r.mrr },
];

<DataTable
  columns={columns} rows={people} rowKey={r => r.id}
  selectable searchable pageSize={6}
  density="normal" stickyHeader maxHeight="420px"
  onRowClick={openDetail}
  rowActions={r => <RowMenu row={r} />}
/>

// Hoja de cálculo editable
<Spreadsheet
  rows={24} cols={8} height="420px" headerRow
  initial={{ A1: "Mes", B1: "Ingresos", B7: "=SUM(B2:B6)" }}
  onChange={grid => save(grid)}
/>

// Grilla de calendario
<CalendarGrid
  events={events} weekStartsOn={1} maxPerDay={3}
  onDayClick={openDay} onEventClick={openEvent}
/>
```

**Atajos de la hoja de cálculo**: flechas · `⇧`+flechas (rango) · `⌘/Ctrl`+flechas (extremos) · `Tab`/`⇧Tab` · `Enter`/`F2` (editar) · escribir (reemplazar) · `Esc` · `Delete` · `⌘/Ctrl`+`C`/`X`/`V` (TSV, compatible con Excel y Sheets) · `⌘/Ctrl`+`Z`/`⇧Z` · `⌘/Ctrl`+`A` · `Home`/`End`.

**Fórmulas** (evaluador propio, sin `eval()`): operadores `+ - * / ^ ( )`, referencias, rangos, y `SUM` `AVERAGE`/`AVG` `MIN` `MAX` `COUNT` `ABS` `ROUND`. Errores tipados: `#DIV/0!`, `#NAME?`, `#REF!`, `#CIRC!`.

## 📱 PWA

```tsx
// Prompt de instalación (Android nativo + instrucciones iOS)
<PwaInstallPrompt appName="Mi App" snoozeDays={14} />

// Botón embebible (header / ajustes)
<InstallButton size="sm" variant="outline" onIosClick={() => setShowIosHelp(true)} />

// Conectividad — se muestra solo cuando hace falta
<OfflineBanner position="top" />

// Nueva versión lista (requiere sw.js con SKIP_WAITING)
<UpdatePrompt swUrl="/sw.js" />

// Opt-in de notificaciones
<NotificationOptIn onResult={(s) => console.log(s)} />

// Diagnóstico en Ajustes
<PwaStatus />
```

En tu `public/sw.js` agregá el handler que `UpdatePrompt` necesita:

```js
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
```

## 📲 Plataforma y experiencia nativa

```tsx
// Qué dispositivo es — SSR-safe (hydrating: true en el primer render)
const {
  os,            // ios | ipados | android | macos | windows | linux
  browser,       // safari | chrome | firefox | edge | samsung | webview
  formFactor,    // mobile | tablet | desktop
  displayMode,   // browser | standalone | minimal-ui | fullscreen | twa
  isStandalone,  // corre instalada
  isIos, isAndroid, isMobileOs, isTouch, isWebView,
  safeArea,      // { top, right, bottom, left } en px reales
  prefersReducedMotion, pixelRatio,
} = usePlatform();

// Bloquear zoom y gestos del navegador — declarativo
<ViewportLock onlyWhenInstalled />   // recomendado: sólo con la PWA instalada
<ViewportLock onlyOnMobile />

// …o imperativo, con control fino
useNativeFeel({
  blockZoom: true,          // pinch · doble-tap · ctrl+scroll · ctrl +/- · viewport meta
  blockOverscroll: true,    // pull-to-refresh y rebote del body
  blockContextMenu: true,   // long-press / click derecho (respeta inputs)
  blockTextSelection: true, // fuera de inputs y textareas
});
```

Detalles: en iOS el pinch-zoom **sólo** se frena reescribiendo el `<meta name="viewport">`, así que `useNativeFeel` lo parchea (y lo restaura al desmontar). `usePlatform` detecta el iPad que se hace pasar por Mac y los WebViews embebidos (Instagram, Facebook, TikTok…).

> ⚠️ **Accesibilidad**: bloquear el zoom incumple WCAG 1.4.4. Usá `onlyWhenInstalled` para que en el navegador el usuario conserve su zoom, y ofrecé un control propio de tamaño de texto.

## 🚀 Splash screen

```tsx
const { visible, progress } = useSplash({
  minDuration: 1400,           // nunca menos que esto (evita el flash)
  until: () => loadSession(),  // …y esperá esta promesa
  waitForFonts: true,
  oncePerSession: true,        // opcional
});

<SplashScreen
  visible={visible}
  progress={progress}          // lo usa variant="bars"
  variant="zoom"               // fade | pulse | orbit | bars | zoom | wipe
  background="brand"           // surface | brand | dark | cualquier CSS
  appName="Mi App"
  tagline="Tu frase corta"
  version="1.4.0"
  footnote="build 2f9a1c"
  icon={<img src="/icon.svg" alt="" />}
/>
```

Las 6 variantes definen entrada **y** salida: `fade` (sobrio), `pulse` (anillos concéntricos), `orbit` (punto orbitando), `bars` (barra de progreso real), `zoom` (spring in + escala al salir, estilo iOS) y `wipe` (dos paneles que se abren revelando la app).

## 📐 Safe areas y shell nativo

```tsx
// Raíz: bloqueos + barra del navegador escondida + vars publicadas
<NativeShell onlyWhenInstalled>{children}</NativeShell>

// Por pantalla, elegí qué bordes respetar
<SafeArea edges={["top"]} gutter={12} as="header">…</SafeArea>
<SafeArea edges={["bottom"]} avoidKeyboard as="footer">…</SafeArea>
<SafeAreaSpacer edge="bottom" />   // cierre de una lista scrolleable

// Hooks sueltos
const sa = useSafeArea();                    // { top, bottom, hasInsets, orientation, … }
const { inset, open } = useKeyboardInset();  // teclado virtual
const { toggleFullscreen, hideBrowserBar, viewportHeight } = useImmersive({
  hideAddressBar: true,      // scroll a 1px: única vía en iOS Safari
  trackViewportHeight: true, // publica --app-height
  keepAwake: true,           // Screen Wake Lock
});
const { haptic } = useHaptics();             // haptic("success" | "error" | "tap" | …)
useStatusBarColor({ light: "#ffffff", dark: "#0f172a" });
```

Las CSS vars quedan disponibles sin JS:

```css
.screen  { height: var(--app-height); }                        /* sin saltos de 100vh */
.bar     { bottom: calc(var(--kb-inset) + var(--sa-bottom)); } /* sube con el teclado */
.header  { padding-top: calc(var(--sa-top) + 12px); }
```

Y hay utilidades listas en `globals.css`: `.h-app`, `.min-h-app`, `.pinned-bottom`, `.scroll-native`.
