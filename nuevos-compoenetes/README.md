# Scaffolding · Atomic Components

12 componentes atómicos + 3 de datos + 6 moléculas PWA para Next.js + React + Tailwind v4 + Framer Motion, con soporte de tema claro/oscuro vía la clase `.dark` (compatible con `next-themes`).

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
  Modal.tsx
  BottomSheet.tsx        # 7 alturas + snapPoints arrastrables
  DataTable.tsx          # orden, búsqueda, selección, paginado, sticky header
  Spreadsheet.tsx        # hoja de cálculo editable con fórmulas y atajos
  CalendarGrid.tsx       # grilla mensual con eventos
  Navbar.tsx             # usa next/link + next/navigation
  SideBar.tsx            # usa next/link + next/navigation
  BottomNav.tsx          # usa next/link + next/navigation
  Stepper.tsx
  Progress.tsx
  Card.tsx               # Card base + StatCard · MediaCard · ProfileCard · PricingCard
  Carousel.tsx           # carrusel de imágenes: drag, dots, thumbs, autoplay, zoom
  ImageZoom.tsx          # visor pan + zoom a pantalla completa (bloquea el resto)
  Tabs.tsx               # 5 estilos: underline · pill · segmented · enclosed · vertical
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
preview.html             # demo en vivo de todos los componentes
```

## 🔧 Instalación

Asume Next.js 15 + Tailwind v4. Necesitas:

```bash
npm i framer-motion next-themes
```

En `app/layout.tsx`:

```tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/Toast";

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

## 🎨 Tokens

Todos los colores usan CSS variables (`--color-primary`, `--color-foreground`, …) definidas en `globals.css`. Cambia los valores allí — los componentes se adaptan solos en claro/oscuro.

## 🧪 Preview

Abre `preview.html` para ver todos los componentes funcionando con toggle de tema y todas las animaciones.

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

## 🖼 Superficies & media

```tsx
// Cards — variant: elevated | outline | flat | gradient | glass
<Card variant="elevated" padding="md" interactive>…</Card>
<StatCard label="MRR" value="$48.2k" delta={12.4} tone="primary" spark={[8,10,9,13]}/>
<MediaCard src="/casa.jpg" badge="Nuevo" title="Casa Aldama" horizontal
  description="Reforma integral de 140 m²." actions={<Button size="sm">Ver</Button>}/>
<ProfileCard name="Lucía Marín" role="Product designer" cover
  stats={[{ label: "Proyectos", value: 12 }]}/>
<PricingCard plan="Pro" price="$29" highlight badge="Popular"
  features={["Proyectos ilimitados", "Soporte prioritario"]} cta={<Button/>}/>

// Carrusel — drag, flechas, dots, miniaturas, autoplay, varias por vista
<Carousel images={[{ src, alt, caption }]} perView={2} peek={56}
  aspect={16/9} loop autoplay={2600} thumbs zoomable/>

// Imagen con pan y zoom — sólo la imagen; bloquea scroll, pinch del navegador,
// ctrl+scroll, pull-to-refresh, long-press y clicks fuera del visor
<ZoomableImage src="/plano.png" caption="A-01 · 1:50"/>
<ImageZoom open={open} onClose={close} src={img.src} maxScale={6}
  onPrev={prev} onNext={next}/>

// Tabs
<Tabs items={items} value={tab} onChange={setTab}
  variant="segmented" size="md" fitted scrollable
  panels={{ resumen: <Resumen/>, actividad: <Actividad/> }}/>
```

Gestos del visor: arrastrar = pan · rueda o pinch = zoom hacia el puntero · doble click = 250% ↔ reset · `+` / `−` / `0` · `←` `→` para recorrer la galería · `Esc` cierra. El pan está limitado para que la imagen nunca se escape de la pantalla.

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
