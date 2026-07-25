# Scaffolding · Atomic Components

42 componentes + 13 hooks para Next.js + React + Tailwind v4 + Framer Motion, con soporte de tema claro/oscuro vía la clase `.dark` (compatible con `next-themes`).

> 📖 **[Guía completa de uso de cada componente y hook →](docs/README.md)** — cuándo usar cada uno, todas sus props, ejemplos y comportamiento no obvio. Pensada para vos o para que la lea una IA antes de implementar.

> 🧪 **[Demo en vivo →](https://lib-kit-components.vercel.app)** — el playground de `dev/` deployado en Vercel, los componentes reales corriendo.

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
  Switch.tsx             # interruptor on/off con thumb animado por spring
  CodeOTP.tsx            # código OTP/2FA en casillas segmentadas, auto-avance y pegado multi-dígito
  Modal.tsx
  BottomSheet.tsx        # 7 alturas + snapPoints arrastrables
  Tooltip.tsx            # globo informativo con hover/focus y auto-flip
  Popover.tsx            # panel anclado con contenido arbitrario, abierto con click
  CoachMark.tsx          # tour guiado con spotlight sobre elementos reales de la UI
  Breadcrumbs.tsx
  FlipCard.tsx           # + <CreditCard/> y <CreditCardStack/>
  FloatingButton.tsx     # FAB + speed dial
  AddButton.tsx          # control de cantidad (+/−) con loading por botón
  AddToCartButton.tsx    # botón "agregar" con estados idle → loading → hecho
  Progress.tsx           # <ProgressBar/> <ProgressRing/> <StepsProgress/>
  Skeleton.tsx           # placeholders animados: primitivo + Text/Avatar/Card/List/Table
  ThemeConfigurator.tsx  # editor en vivo de los tokens de color del tema, con export CSS/JSON
  TenantTheme.tsx        # paleta multi-tenant por dominio/sesión: <TenantThemeProvider/> + useTenantTheme()
  Card.tsx               # Card base + StatCard · MediaCard · ProfileCard · PricingCard
  Carousel.tsx           # carrusel de imágenes: drag, dots, thumbs, autoplay, zoom
  ImageZoom.tsx          # visor pan + zoom a pantalla completa (bloquea el resto) + <ZoomableImage/>
  Tabs.tsx               # 5 estilos: underline · pill · segmented · enclosed · vertical
  ScrollArea.tsx         # scroll con barra propia arrastrable — 4 variantes de grosor/animación
  Footer.tsx             # pie de página: marca, columnas de links, redes y newsletter
  Hero.tsx               # HeroSearch · HeroImage · HeroTabs · HeroWelcome — cabeceras de pantalla completa
  ChipCarousel.tsx       # fila de chips con drag, snap y flechas — 4 variantes
  Keypad.tsx             # teclado numérico táctil 3×4, tecla extra + borrado long-press
  PinLock.tsx            # pantalla de bloqueo por PIN o contraseña
  AmountPad.tsx          # carga de montos a pantalla completa, estilo billetera
  RedirectTimer.tsx      # cuenta atrás con redirección a WhatsApp/Telegram/SMS/mail/URL
  ShareButton.tsx        # compartir con hoja nativa del sistema o sheet propio
  CardGrid.tsx           # grilla de cards con columnas ajustables en tiempo real
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
dev/                      # playground Next.js que importa components/ real (ver sección Preview)
```

## 🔧 Instalación

Asume Next.js 15 + Tailwind v4. Se distribuye como dependencia de Git (repo privado en GitHub), no desde npm.

```bash
npm i github:EmaDev/kit-componentes
# o fijando una versión/commit concreto:
npm i github:EmaDev/kit-componentes#v0.1.0
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

Para editarlos en vivo (paleta de marca, superficie, texto y estado) desde la propia UI en vez de tocar el CSS a mano, usá `ThemeConfigurator`:

```tsx
// Reskinea toda la app en vivo mientras se ajusta cada color
<ThemeConfigurator applyToDocument />

// …con presets de marca y export a CSS/JSON
<ThemeConfigurator
  presets={[{ name: "Océano", tokens: { ...DEFAULT_THEME_TOKENS, primary: "#0891b2", accent: "#06b6d4" } }]}
  onChange={(tokens) => console.log(tokens)}
/>
```

### Multi-tenant (white-label)

Un mismo deploy, una paleta por cliente — resuelta por **dominio** o por **sesión**. `TenantThemeProvider` inyecta las CSS vars del tenant activo, así todos los componentes se reskinean solos:

```ts
// lib/tenants.ts
export const TENANTS: TenantTheme[] = [
  { id: "acme",   name: "Acme",   domains: ["acme.com", "*.acme.com"],
    tokens: { primary: "#e11d48", primaryHover: "#be123c", accent: "#fb7185" } },
  { id: "globex", name: "Globex", domains: ["globex.io", "*.globex.io"],
    tokens: { primary: "#0891b2", primaryHover: "#0e7490", accent: "#06b6d4" },
    dark:   { primary: "#22d3ee", surface: "#082f49" } },
];
```

```tsx
// app/layout.tsx — Server Component: resolver en el servidor evita el flash de marca
const host = (await headers()).get("host") ?? undefined;

<TenantThemeProvider themes={TENANTS} host={host}>          {/* por dominio */}
<TenantThemeProvider themes={TENANTS} tenantId={session?.tenantId ?? null}>  {/* por auth */}
```

```tsx
// …y desde cualquier client component
const { tenant, themes, setTenant, tokens, setTokens, css } = useTenantTheme();
```

Detalles (precedencia de resolución, herencia claro→oscuro, tenants desde la base de datos): [TenantThemeProvider](docs/components/TenantTheme.md).

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

## 🦸 Heroes

```tsx
// Cabecera con buscador — sugerencias frecuentes + resultados en vivo
<HeroSearch
  title="Encontrá tu próximo lugar" eyebrow="1.284 propiedades activas"
  placeholder="Barrio, calle o código…" cta="Buscar"
  suggestions={["Palermo", "Belgrano", "2 ambientes"]}
  results={liveResults} onSubmit={(q) => router.push(`/buscar?q=${q}`)}
/>

// Cabecera con imagen a sangre — overlay, metadatos y acciones
<HeroImage
  src="/casa.jpg" eyebrow="Obra terminada" title="Casa Aldama"
  description="Reforma integral de 140 m² en dos plantas."
  meta={[{ label: "Superficie", value: "140 m²" }, { label: "Año", value: "2025" }]}
  actions={<Button>Ver proyecto</Button>} height={420} overlay="gradient"
/>

// Cabecera con pestañas horizontales scrolables
<HeroTabs
  title="Bandeja de entrada"
  tabs={[{ id: "todo", label: "Todo", count: 128 }, { id: "hoy", label: "Hoy", count: 12 }]}
  value={tab} onChange={setTab} variant="underline"
  panels={{ todo: <Todo />, hoy: <Hoy /> }}
/>

// Saludo de bienvenida — home de la app instalada
<HeroWelcome
  name="Lucía Marín" avatar={user.photo} subtitle="Cuenta personal · **** 4417"
  highlight={{ label: "Saldo disponible", value: "$248.320", delta: "+4,2%" }}
  quickActions={[{ id: "enviar", label: "Enviar", icon: <SendIcon /> }]}
  onQuickAction={(id) => go(id)} tone="brand"
/>
```

## 🧱 Bloques de app

```tsx
// Fila de chips — categorías, filtros (multi), personas, o "cover" con imagen de fondo
<ChipCarousel chips={categorias} value={cat} onChange={setCat} variant="soft" size="md" />
<ChipCarousel chips={filtros} value={tags} onChange={setTags} multi variant="outline" />

// Bloqueo por PIN o contraseña al abrir la app
<PinLock
  open={locked} mode="pin" length={4} appName="Mi App"
  onUnlock={async (code) => await verifyPin(code)}
  onSuccess={() => setLocked(false)}
  maxAttempts={5} onBiometric={() => webauthnLogin()}
/>

// Carga de montos a pantalla completa, estilo billetera
<AmountPad
  open={open} onClose={() => setOpen(false)}
  balance={saldo} min={100} max={500000}
  quickAmounts={[1000, 5000, 10000]}
  onConfirm={async (amount) => await recargar(amount)}
/>

// Redirección con cuenta atrás — WhatsApp | Telegram | SMS | mail | URL
<RedirectTimer
  target="whatsapp" phone="5491122334455"
  message="Hola 👋 quiero consultar por el plan Pro."
  seconds={8} onRedirect={(href) => track("wa_redirect", href)}
/>

// Compartir — hoja nativa del sistema, o sheet propio de fallback
<ShareButton title="Casa Aldama" text="Mirá esta propiedad" onShared={(m) => track("share", m)} />

// Grilla de cards con columnas ajustables en tiempo real
<CardGrid
  items={propiedades} renderItem={(p) => <PropertyCard key={p.id} {...p} />}
  defaultColumns={3} min={1} max={5} minCardWidth={190} storageKey="grid.cols"
/>
```

`Keypad` es la pieza de bajo nivel detrás de `AmountPad` y `PinLock` (teclado numérico 3×4 con tecla extra y borrado en long-press) — usalo directo sólo si necesitás armar un flujo numérico propio.

## 🧪 Preview y desarrollo local

`dev/` es un playground real con Next.js (App Router) que importa los componentes **directamente desde `components/`** (mismo Tailwind v4 + Framer Motion que consume cualquier proyecto) — no un mock.

```bash
cd dev
npm install
npm run dev
# abrí http://localhost:3000
```

Al ser una app Next.js de verdad, `Navbar`, `SideBar` y `BottomNav` (que usan `next/link`/`next/navigation`) también corren en vivo: tienen su demo en la página principal y una mini-demo de navegación real en `/nav-demo` para ver el estado activo cambiar entre rutas.

Para agregar un componente nuevo al playground (y el resto de los pasos obligatorios al crear uno): ver [CLAUDE.md](CLAUDE.md).

### Variables de entorno del playground

`dev/` lee estas variables (ver [`dev/.env.example`](dev/.env.example)) para armar los links del header/hero/footer — copiá el archivo a `dev/.env.local` para desarrollo local:

| Variable | Uso | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_REPO_URL` | Botones "GitHub" / "Ver código" | `https://github.com/EmaDev/kit-componentes` |
| `NEXT_PUBLIC_DEMO_URL` | URL pública del propio deploy (referencia, ej. para compartir) | `https://lib-kit-components.vercel.app` |
| `NEXT_PUBLIC_LIB_VERSION` | Versión mostrada en el footer | `0.1.0` |
| `NEXT_PUBLIC_DONATE_URL` | Link de donaciones en el footer (se oculta si no está seteada) | *(vacío)* |

Todas son `NEXT_PUBLIC_*` porque solo arman URLs en la UI, no hay nada sensible.

### Deploy del playground en Vercel

El código fuente (`components/`, `hooks/`, `docs/`) vive en un repo de GitHub; el playground de `dev/` se deploya aparte, como demo pública:

1. En Vercel, **New Project** → importar este repo.
2. **Root Directory**: `dev` (el playground tiene su propio `package.json`).
3. Cargar las variables de la tabla de arriba en **Settings → Environment Variables** (con la URL real del repo y, una vez asignado, el dominio que te dio Vercel para `NEXT_PUBLIC_DEMO_URL`).
4. Deploy. Framework preset: Next.js (autodetectado).

El resto del repo (paquete instalable) no necesita deploy — se consume vía `npm i github:EmaDev/kit-componentes` como se explica en Instalación.

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

// Tooltip
<Tooltip content="Eliminar producto">
  <Button variant="ghost" size="icon"><TrashIcon /></Button>
</Tooltip>

// Popover
<Popover trigger={<Button variant="secondary">Filtros</Button>}>
  <div className="flex flex-col gap-3 w-56">…</div>
</Popover>

// CoachMark — tour guiado con spotlight
<CoachMark
  open={tourOpen}
  onClose={() => setTourOpen(false)}
  steps={[
    { target: "#nav-search", title: "Buscá lo que necesites" },
    { target: "#cart-button", title: "Tu carrito", side: "left" },
  ]}
/>

// Switch
<Switch checked={notifications} onChange={setNotifications} label="Notificaciones push" />

// CodeOTP
<CodeOTP length={6} label="Código de verificación" onComplete={(code) => verifyCode(code)} />

// ScrollArea — variant: thin | pill | glow | debounce
<ScrollArea variant="pill" maxHeight={280}>
  <div className="flex flex-col gap-3 p-1">…</div>
</ScrollArea>

// Footer
<Footer
  brand={<span>Mi Tienda</span>}
  groups={[{ title: "Producto", links: [{ label: "Catálogo", href: "/catalogo" }] }]}
  bottomLinks={[{ label: "Privacidad", href: "/privacidad" }]}
/>
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
