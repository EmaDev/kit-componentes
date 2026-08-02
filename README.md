# Scaffolding · Atomic Components

67 componentes + 39 hooks para Next.js + React + Tailwind v4 + Framer Motion, con soporte de tema claro/oscuro vía la clase `.dark` (compatible con `next-themes`).

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
  NotificationPanel.tsx  # historial agrupado por fecha + <NotificationBell/> (popover) y <NotificationSidebar/> (drawer)
  ThemeConfigurator.tsx  # editor en vivo de los tokens de color del tema, con export CSS/JSON
  TenantTheme.tsx        # paleta multi-tenant por dominio/sesión: <TenantThemeProvider/> + useTenantTheme()
  Card.tsx               # Card base + StatCard · MediaCard · ProfileCard · PricingCard
  Carousel.tsx           # carrusel de imágenes: drag, dots, thumbs, autoplay, zoom
  ImageZoom.tsx          # visor pan + zoom a pantalla completa (bloquea el resto) + <ZoomableImage/>
  Tabs.tsx               # 5 estilos: underline · pill · segmented · enclosed · vertical
  TabsGlow.tsx           # pastilla flotante con overshoot elástico + glow primario
  TabsCarousel.tsx       # línea corta centrada + panel que se desliza como carrusel
  TabsDock.tsx           # iconos con rebote elástico estilo dock + punto indicador
  ScrollArea.tsx         # scroll con barra propia arrastrable — 4 variantes de grosor/animación
  Footer.tsx             # pie de página: marca, columnas de links, redes y newsletter
  VideoPlayer.tsx        # scrub, marcadores, atajos de teclado y modo portrait tipo reels
  Hero.tsx               # HeroSearch · HeroImage · HeroTabs · HeroWelcome — cabeceras de pantalla completa
  ChipCarousel.tsx       # fila de chips con drag, snap y flechas — 4 variantes
  Keypad.tsx             # teclado numérico táctil 3×4, tecla extra + borrado long-press
  PinLock.tsx            # pantalla de bloqueo por PIN o contraseña
  AmountPad.tsx          # carga de montos a pantalla completa, estilo billetera
  RedirectTimer.tsx      # cuenta atrás con redirección a WhatsApp/Telegram/SMS/mail/URL
  ShareButton.tsx        # compartir con hoja nativa del sistema o sheet propio
  CardGrid.tsx           # grilla de cards con columnas ajustables en tiempo real
  DataTable.tsx          # orden, búsqueda, selección, paginado, sticky header
  AnimatedTable.tsx      # orden con reacomodo animado (FLIP) + resalte de celdas que cambian
  ExpandableTable.tsx    # fila con panel de detalle desplegable animado
  Spreadsheet.tsx        # hoja de cálculo editable con fórmulas y atajos
  CalendarGrid.tsx       # grilla mensual con eventos
  Navbar.tsx             # usa next/link + next/navigation
  SideBar.tsx            # usa next/link + next/navigation
  BottomNav.tsx          # usa next/link + next/navigation
  ImageCounter.tsx       # galería de una imagen con contador «03 / 12» + zoom
  Snackbar.tsx           # <SnackbarProvider> + useSnackbar() (cola + deshacer)
  DatePicker.tsx         # fecha simple o rango, popover o embebido
  TimePicker.tsx         # horario (h/m/s), 12h o 24h, popover o embebido
  Pagination.tsx         # paginado con elipsis, resumen y tamaño de página
  PullToRefresh.tsx      # gesto nativo de refresco
  Cart.tsx               # CartButton (badge animado) + CartPanel + useCart()
  PromoPopup.tsx         # interstitial de ofertas + captura de email
  CouponCode.tsx         # cupón copiable con timer y/o cupos
  CountdownBanner.tsx    # cuenta regresiva de campaña
  Chatbot.tsx            # chat conversacional + quick replies + lanzador flotante
  BookReader.tsx         # lector paginado tipo Google Books (columnas CSS)
  SocialPost.tsx         # post de red social con media, reacciones y adjuntos
  CommentBox.tsx         # comentarios con hilos, likes, orden y paginado
  Poll.tsx               # encuestas: única, múltiple, estrellas y NPS
  Confetti.tsx           # confeti en canvas (burst · rain · center)
  SuccessPage.tsx        # pantalla de éxito + confeti + resumen de operación
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
  AppHeader.tsx          # header de app: volver, título grande colapsable, acciones, buscador
  AppHeaderIsland.tsx    # cápsula flotante desprendida de los bordes, estilo dynamic island
  AppHeaderTabs.tsx      # header + fila de tabs scrolables (underline o pastilla) con panels
  AppHeaderWave.tsx      # hero con degradado y esquina inferior muy redondeada
  AppHeaderCard.tsx      # tarjeta flotante con sombra que se eleva al scrollear
  AppHeaderNotch.tsx     # muesca circular con botón flotante centrado
  AppHeaderPill.tsx      # barra minimalista + píldora de búsqueda siempre visible
  AppHeaderCardSlot.tsx  # hero con card flotante vacía centrada, para contenido propio
  AppIdentityConfig.tsx  # editor en vivo de nombre/colores/íconos de instalación + export manifest.json
  SyncStatus.tsx         # estado visual de una cola offline (chip o panel)
  OfflineFallback.tsx    # pantalla de "sin conexión" cuando un fetch falla sin caché
  PermissionGate.tsx     # pide un permiso del navegador con contexto
  CameraCapture.tsx      # foto a pantalla completa: preview, cambio de cámara, revisión
  LocationPicker.tsx     # GPS actual + dirección con sugerencias (sin mapa)
  BiometricGate.tsx      # desbloqueo por Face ID / huella / Windows Hello (WebAuthn)
  ActivityTimeline.tsx   # línea de tiempo vertical de eventos con estado
  BranchingTimeline.tsx  # línea de tiempo con ramificaciones/nodos hijos
  TrackingStepper.tsx    # pasos de seguimiento tipo envío/pedido
  TimelineComments.tsx   # línea de tiempo de eventos con notas/comentarios
  GroupedActivityFeed.tsx # feed de actividad agrupado por fecha
  AuditLog.tsx           # historial de auditoría con cambios de campo (from → to)
  Roadmap.tsx            # roadmap de producto por trimestre
  HowItWorksTimeline.tsx # pasos numerados "cómo funciona", horizontal o vertical
  KanbanBoard.tsx        # tablero Kanban de escritorio con drag & drop nativo
  KanbanBoardMobile.tsx  # Kanban táctil, una columna visible a la vez
  ItineraryTimeline.tsx  # itinerario día por día: tira de días + timeline de actividades
  TripRouteMap.tsx       # resumen de ruta: destinos encadenados con fechas y noches
  TripBudgetSummary.tsx  # presupuesto de viaje: anillo total + categorías
  TripChecklist.tsx      # checklist simple con progreso (equipaje, pendientes)
  GroupedTaskList.tsx    # tareas agrupadas por día/categoría, colapsables
  TaskCard.tsx           # tarea con subtareas, prioridad y fecha límite
  KpiCard.tsx             # tarjeta de KPI con sparkline y variación
  WalletBalanceCard.tsx  # saldo multi-moneda con enviar/recibir/convertir
  CurrencySelector.tsx   # selector de moneda con tasa de cambio
  RateComparator.tsx     # comparador de cotizaciones entre proveedores
  ValueHistoryChart.tsx  # gráfico de evolución de un valor por período
  JsonChartViewer.tsx    # visor de datos JSON como tabla o gráfico
  TransactionList.tsx    # lista de transacciones agrupadas por categoría
  SendMoneyFlow.tsx      # flujo de envío de dinero a un contacto
  PaymentQrCard.tsx      # tarjeta de cobro con QR y monto editable
  BillSplitter.tsx       # divisor de cuenta entre participantes
  BudgetCategoryProgress.tsx # progreso de gasto por categoría de presupuesto
  PaymentMethodPicker.tsx # selector de tarjetas guardadas + alta de tarjeta nueva
  SearchFilters.tsx      # filtros de búsqueda agrupados + resultados en vivo
  ProductFilterBar.tsx   # orden asc/desc + filtros de faceta + rango de precio (tienda online)
  BookingCalendar.tsx    # calendario de reservas con horarios disponibles por día
  ProfileEditor.tsx      # editor de perfil: avatar, datos de contacto y bio
  LanguagePicker.tsx     # selector de idioma/región
  DateRangePicker.tsx    # selector de rango de fechas con presets
  TagInput.tsx           # input de etiquetas con sugerencias
  CollapsibleFormSections.tsx # formulario largo dividido en secciones colapsables
  DualRangeSlider.tsx    # slider de rango doble (mínimo–máximo)
  ColorPicker.tsx        # selector de color con paleta + color personalizado
  RichTextEditor.tsx     # editor de texto enriquecido básico
  BeforeAfterSlider.tsx  # comparador de imágenes antes/después con slider
  StarRatingWidget.tsx   # calificación por estrellas, con promedio y distribución
  OnboardingWizard.tsx   # wizard multi-paso con validación y pasos opcionales
  UnitConverter.tsx      # conversor de unidades por grupo
  PricingTable.tsx       # tabla comparativa de planes, precio mensual/anual
  ShippingMethodPicker.tsx # selector de método de envío con precio y ETA
  ProductComparisonTable.tsx # tabla comparativa de especificaciones entre productos
  StockLimitedStepper.tsx # stepper de cantidad limitado por stock disponible
  ReferralProgram.tsx    # panel de programa de referidos
  ApprovalChecklist.tsx  # checklist de aprobación/rechazo por ítem
  RolePermissionsTable.tsx # matriz de permisos por rol, editable
  SecurityAlertBanner.tsx # banner de alerta de seguridad de cuenta
  IdentityVerification.tsx # flujo de verificación de identidad (KYC) por pasos
  BranchSelector.tsx     # selector de sucursal, con distancia y estado
  PageStatusScreen.tsx   # pantalla de estado: 404, 403, 500 o vacío
  MaintenancePage.tsx    # pantalla de mantenimiento o "próximamente"
  CardFan.tsx            # abanico de cartas interactivo
  SwipeableCardStack.tsx # pila de tarjetas swipeable, tipo Tinder
  FlipRevealGrid.tsx     # grilla de cartas que se voltean para revelar/emparejar
  AnimatedCounter.tsx    # contador numérico animado hacia un valor
  SkeletonMorph.tsx      # transición morph entre skeleton y contenido real
  ParallaxScrollCards.tsx # cards con efecto parallax al scrollear
  TiltHoverCard.tsx      # tarjeta con inclinación 3D al mover el mouse + glare
  AnimatedProgressRing.tsx # anillo de progreso animado hacia un valor
  DragReorderList.tsx    # lista reordenable por drag & drop
  VideoCallGrid.tsx      # grilla de participantes de videollamada
  FabActionSheets.tsx    # FAB con speed dial: cada acción abre su propio BottomSheet
  QuickNotePad.tsx       # FAB + bloc de notas rápido (viñetas, numeración, emojis)
  DocumentEditor.tsx     # escritor a pantalla completa: tradicional o Markdown
  DiceRoller.tsx         # lanzador de dados 3D, cantidad elegible
  RouletteWheel.tsx      # ruleta con opciones editables, elige una por giro
  CoinFlip.tsx           # moneda 3D: cara o cruz al azar
  NumberGenerator.tsx    # número al azar en un rango editable, con historial
  RaffleDraw.tsx         # sorteo de N ganadores con reel animado, sin repetir
  TeamShuffler.tsx       # reparte una lista en N equipos parejos al azar
  TallyCounter.tsx       # anotador de palitos, marcas en grupos de 5
  Flashcard.tsx          # tarjeta de memorización con flip 3D
  FlashcardDeck.tsx      # mazo con progreso y calificación por tarjeta
  QuizCard.tsx           # opción múltiple con feedback y explicación
  StudyTimer.tsx         # Pomodoro: foco/descanso + ciclos completados
  StreakTracker.tsx      # racha de estudio + grilla de constancia
  ProgressByTopic.tsx    # dominio por tema/materia, ordenado por avance
  MatchingPairs.tsx      # ejercicio de emparejar término/definición
  index.ts               # barrel export
hooks/
  useSpreadsheet.ts            # motor de fórmulas + selección + undo/redo
  usePwaInstall.ts             # beforeinstallprompt + standalone + snooze
  useOnlineStatus.ts           # online/offline + conexión lenta
  useServiceWorker.ts          # registro + detección de actualización
  useNotificationPermission.ts # permiso + notificación local
  usePlatform.ts               # OS, navegador, form factor, display mode, safe areas
  useNativeFeel.ts             # bloqueos para experiencia nativa
  useAppIdentity.ts            # nombre/colores/íconos de instalación, persistidos + export manifest.json
  useSplash.ts                 # duración mínima + espera de recursos + progreso
  useSafeArea.ts               # insets reactivas + CSS vars --sa-*
  useImmersive.ts              # esconde la barra del navegador, fullscreen, wake lock
  useKeyboardInset.ts          # altura del teclado virtual (--kb-inset)
  useHaptics.ts                # feedback táctil con nombres semánticos
  useStatusBarColor.ts         # tiñe la barra de estado (theme-color)
  idb.ts                       # wrapper mínimo de IndexedDB + fallback a localStorage
  useOfflineQueue.ts           # cola de mutaciones offline con reintentos y backoff
  useCachedFetch.ts            # stale-while-revalidate con persistencia en IndexedDB
  usePersistentState.ts        # useState que sobrevive recargas y cierres de la app
  usePushSubscription.ts       # suscripción a Web Push (VAPID)
  useAppBadge.ts                # contador en el ícono de la app instalada
  useAppLifecycle.ts           # foreground/background + último gancho fiable para persistir
  useBackButton.ts             # captura el botón atrás de Android para overlays propios
  useStorageEstimate.ts        # espacio usado, persistencia y limpieza de Cache Storage
  usePermission.ts             # estado reactivo de un permiso del navegador
  useCamera.ts                 # stream de cámara, cambio de cámara y captura a Blob
  useBarcodeScanner.ts         # lectura de QR/códigos de barra sobre un <video> en vivo
  useGeolocation.ts            # ubicación del dispositivo, una vez o en vivo
  useWebAuthn.ts                # biometría vía WebAuthn (Face ID / huella / Windows Hello)
  useClipboard.ts              # copiar/leer el portapapeles con feedback temporizado
  useFilePicker.ts             # elegir/guardar archivos (File System Access + fallback)
  useContactPicker.ts          # selector de contactos del sistema (Android/Chrome)
  useNfc.ts                    # lectura y escritura de tags NFC (Web NFC)
  useWebOTP.ts                  # autocompleta el código de un SMS de verificación
  usePeriodicSync.ts           # actualización en segundo plano (PWA instalada)
  useLongPress.ts              # gesto de mantener presionado, listo para pegar como props
  useSwipe.ts                  # gestos de swipe en las 4 direcciones
  useDebounce.ts               # useDebounce + useDebouncedCallback + useThrottledCallback
  useIdle.ts                   # inactividad del usuario, con aviso previo
  useMediaQuery.ts             # media query reactiva + useIsMobile/usePrefersDark/etc.
  useNetworkQuality.ts         # calidad de conexión para carga adaptativa
  useViewTransition.ts         # View Transitions API + useScreenStack
  useVirtualList.ts            # virtualización de listas largas
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

## 🏗️ Guía: setup de una app nueva desde cero (SSR-first)

Checklist completa para arrancar un proyecto nuevo con Next.js + `lib-kit-components`, con arquitectura atómica en el consumidor y **Server Components por default** — el cliente se reserva sólo para lo que de verdad necesita interactividad (el shell de la app, formularios, hooks de estado).

Para el contenido del shell (qué componentes montar y en qué orden: safe areas, splash, capa PWA, navegación y FAB), la receta completa está en [docs/guides/app-base.md](docs/guides/app-base.md).

### 1. Crear el proyecto

```bash
npx create-next-app@latest mi-app --typescript --tailwind --app --src-dir --import-alias "@/*"
cd mi-app
```

`create-next-app` ya scaffoldea Tailwind v4 (sin `tailwind.config.js`/`postcss.config.js` manual, todo vía `@import "tailwindcss"` en CSS) — verificá `"tailwindcss": "^4"` en `package.json`. App Router (`--app`) es obligatorio: la librería y esta guía asumen Server Components, que no existen en Pages Router.

### 2. Instalar la librería y sus peer dependencies

```bash
npm i github:EmaDev/kit-componentes
npm i framer-motion next-themes
```

(`react`/`react-dom` ya vienen con `create-next-app`; `next` sólo hace falta si usás `Navbar`/`SideBar`/`BottomNav`, y ya está.)

### 3. Conectar estilos, tema y providers globales

`src/app/globals.css`:

```css
@import "tailwindcss";
@import "lib-kit-components/styles.css";
@source "../node_modules/lib-kit-components/dist";
```

`src/app/layout.tsx` — **se queda como Server Component** (no lleva `"use client"`): `ThemeProvider` y `ToastProvider` son client components por dentro, pero envolver `children` con ellos no obliga a que el layout raíz lo sea también.

```tsx
// src/app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "lib-kit-components";

export const metadata = { title: "Mi App", description: "…" };

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

Mantener el `RootLayout` como Server Component es lo que permite exportar `metadata`/`generateMetadata` (SEO) desde acá y desde cada `page.tsx` — un layout con `"use client"` no puede exportarlos.

### 4. Arquitectura atómica del proyecto consumidor

La librería ya te da los átomos y moléculas de UI (`Button`, `Input`, `Card`, `Hero`, …). Lo que arma el proyecto consumidor son las capas que **combinan** esos átomos con datos y navegación reales, separando claramente qué corre en el servidor y qué necesita el cliente:

```
src/
  app/
    layout.tsx                 # Server · providers globales (paso 3)
    (app)/
      layout.tsx               # Server · sólo arma <AppShell>{children}</AppShell>
      page.tsx                 # Server · fetch de datos + <HomeTemplate data={...}/>
      productos/[id]/page.tsx  # Server · fetch por id + <ProductTemplate/>
    (app)/AppShell.tsx          # Client · único punto donde se monta el shell (splash + PWA + nav + FAB)
  components/
    atoms/                     # primitivos 100% propios que no existen en la librería
    molecules/                 # combinación de átomos con un propósito (ProductPrice, RatingStars)
    organisms/                 # bloques de pantalla con estado/interacción (ProductGrid, FiltersBar)
    templates/                 # arman una pantalla completa a partir de organisms; reciben datos ya
                                # resueltos por props — NO hacen fetch, así pueden ser Server Components
  lib/
    data/                      # funciones de acceso a datos (fetch/DB/ORM) — se importan sólo desde
                                # Server Components (page.tsx, layout.tsx)
```

- **atoms/molecules**: úsalos sólo para lo que la librería no cubre. Todo lo que ya exporta `lib-kit-components` (ver [Estructura](#-estructura)) es tu capa de átomos — no la reimplementes.
- **organisms**: llevan `"use client"` en cuanto usan un hook (`useState`, `useCart`, `useDebounce`, etc.) o un componente client de la librería (`DataTable`, `Carousel`, `Chatbot`...). Reciben datos ya cargados por props, no hacen su propio fetch.
- **templates**: pura composición de layout (grid, secciones, orden de organisms). Si no usan hooks, quedan como Server Components — eso es lo que le permite a Next.js streamear el HTML de la pantalla completa antes de que hidrate un solo organism.
- **pages** (`page.tsx`): siempre Server Components `async`. Son el único lugar autorizado para `await fetch(...)`/queries a la base de datos — nunca en un `organism`/`template` client.

### 5. El shell de la app (el único límite cliente/servidor que importa)

Las piezas del shell (`SplashScreen`, `PwaInstallPrompt`, `BottomNav`, `FabActionSheets`, …) son client components — pero **no** hace falta que tu `layout.tsx` también lo sea. El patrón es aislarlas en un componente cliente propio (`AppShell`) que recibe `children` como prop: ese `children` lo sigue resolviendo el Server Component que lo llama, así que las páginas debajo del shell pueden seguir siendo 100% Server Components con fetch en el servidor.

```tsx
// src/app/(app)/AppShell.tsx
"use client";
import type { ReactNode } from "react";
import {
  NativeShell, SafeArea, SplashScreen, OfflineBanner, PwaInstallPrompt,
  BottomNav, FabActionSheets, SnackbarProvider, useSplash,
} from "lib-kit-components";
import { NAV, ACTIONS } from "./shell-config";

export function AppShell({ children }: { children: ReactNode }) {
  const { visible, progress } = useSplash({ minDuration: 1500, oncePerSession: true });

  return (
    <SnackbarProvider position="bottom-center" gap={80}>
      <NativeShell onlyWhenInstalled>
        <SplashScreen visible={visible} progress={progress} appName="Mi App" variant="bars" background="brand" />
        <OfflineBanner position="top" />
        <PwaInstallPrompt appName="Mi App" />

        <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
          <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
        </SafeArea>

        <BottomNav items={NAV} />
        <FabActionSheets actions={ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
      </NativeShell>
    </SnackbarProvider>
  );
}
```

Cada capa de ese shell, sus alternativas y sus gotchas (z-index, paddings sobre el `BottomNav`, safe areas, `HeroTabs` como nav de pantalla): [docs/guides/app-base.md](docs/guides/app-base.md).

```tsx
// src/app/(app)/layout.tsx — Server Component: no hace fetch, sólo delega
import { AppShell } from "./AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

```tsx
// src/app/(app)/page.tsx — Server Component: fetch en el servidor, cero JS de datos al cliente
import { getHomeData } from "@/lib/data/home";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

export default async function HomePage() {
  const data = await getHomeData(); // DB/fetch directo, sin API route intermedia
  return <HomeTemplate data={data} />;
}
```

```tsx
// src/components/templates/HomeTemplate.tsx — Server Component (sin "use client")
import { HeroWelcome } from "lib-kit-components";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import type { HomeData } from "@/lib/data/home";

export function HomeTemplate({ data }: { data: HomeData }) {
  return (
    <>
      <HeroWelcome name={data.user.name} highlight={data.highlight} tone="brand" />
      <ProductGrid products={data.products} />
    </>
  );
}
```

`ProductGrid` (un `organism`) recién ahí lleva `"use client"` si necesita `useCart()`, `useState` para filtros, etc. — pero ya recibe `products` resuelto, sin volver a pedirlo al cliente.

### 6. Por qué este patrón mantiene SSR real

- El HTML de `HomeTemplate` (hero + grilla con datos reales) se renderiza en el servidor y llega completo en la respuesta inicial — no depende de que hidrate `AppShell`.
- El único JS que el cliente hidrata "de arriba" es el shell (header, bottom nav, splash, sheet global); el contenido de cada pantalla hidrata sólo los organisms puntuales que lo necesitan (islas de interactividad), no la página entera.
- Evitá el error común de poner `"use client"` en `layout.tsx`/`page.tsx` "porque el shell lo pide" — el límite cliente va en `AppShell`, no en la ruta.
- Para confirmarlo: `view-source:` sobre la página en el navegador debe mostrar el contenido de `HomeTemplate` ya resuelto en el HTML crudo (sin JS), no un `<div id="__next">` vacío.

### 7. PWA mínima (si vas a montar `PwaInstallPrompt`/`UpdatePrompt`)

- `public/manifest.json` con `name`, `icons`, `start_url`, `display: "standalone"`.
- `public/sw.js` con al menos el handler que necesita `UpdatePrompt`:

```js
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
```

- Registrarlo con `useServiceWorker()` (ver [docs/hooks](docs/hooks/useAppLifecycle.md) y la sección [📱 PWA](#-pwa) más abajo).

### 8. Checklist final

- [ ] `npx tsc --noEmit` sin errores.
- [ ] `RootLayout` y `(app)/layout.tsx` sin `"use client"`.
- [ ] Todo `await fetch/DB` vive en un `page.tsx` (o una función en `lib/data/`), nunca en un `organism`.
- [ ] `view-source` de cada pantalla muestra el contenido real, no sólo el shell.
- [ ] `manifest.json` + `sw.js` si activaste `installPrompt`/`updatePrompt`.

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

// TabsGlow — pastilla flotante con overshoot elástico + glow
<TabsGlow items={items} value={tab} onChange={setTab} size="md" panels={panels}/>

// TabsCarousel — línea corta centrada, panel se desliza según la dirección
<TabsCarousel items={items} value={tab} onChange={setTab} panels={panels}/>

// TabsDock — iconos con rebote elástico y punto indicador, estilo dock
<TabsDock
  items={[{ id: "inicio", label: "Inicio", icon: <HomeIcon/> }]}
  value={tab} onChange={setTab} panels={panels}
/>

// VideoPlayer — scrub con buffer y marcadores, atajos de teclado, doble-tap para saltar
<VideoPlayer
  src="/videos/keynote.mp4" poster="/videos/keynote-poster.jpg"
  title="Keynote 2025" resumeKey="video-keynote-2025"
  markers={[{ at: 120, label: "Intro" }]}
/>

// …o modo portrait, feed vertical tipo reels
<VideoPlayer src={clip.url} orientation="portrait" loop autoPlay muted
  onNext={nextClip} onPrev={prevClip}
  overlay={<ClipActions clip={clip} />}
/>
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

Es **una sola pantalla**: un catálogo con un preview por componente, ordenado en las 6 categorías del inventario (Átomos · Moléculas · PWA & nativo · Config & hooks · Nicho · Otros), con índice lateral y buscador por nombre. Cada preview tiene su ancla propia (`/#datatable`, `/#bottomsheet`, …).

Al ser una app Next.js de verdad, `Navbar`, `SideBar` y `BottomNav` (que usan `next/link`/`next/navigation`) también corren en vivo, sin mocks.

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

// NotificationPanel / NotificationBell — historial agrupado por fecha
<NotificationBell
  items={notifications}
  onRead={markAsRead}
  onReadAll={markAllAsRead}
  onDismiss={dismiss}
/>

// …el mismo panel como centro de notificaciones lateral, con backdrop y Escape
<NotificationSidebar
  open={open} onClose={() => setOpen(false)} side="right" width={420}
  items={notifications} onRead={markAsRead} onReadAll={markAllAsRead}
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

// Orden con reacomodo animado + celdas que se resaltan al cambiar de valor
<AnimatedTable
  columns={columns} rows={liveStats} rowKey={s => s.id}
  sortable highlightChanges density="compact"
/>

// Fila con panel de detalle desplegable
<ExpandableTable
  columns={columns} rows={pedidos} rowKey={o => o.id}
  renderDetail={o => <DetallePedido pedido={o}/>}
  multiple
/>
```

`AnimatedTable` y `ExpandableTable` reutilizan el mismo tipo `Column<T>` que `DataTable`, así que podés pasarles las mismas definiciones de columna. `AnimatedTable` usa `key`, `header`, `width`, `align`, `sortable`, `render` y `sortValue`; `ExpandableTable` usa `key`, `header`, `width`, `align` y `render`. Ninguna de las dos aplica `hideOnMobile`.

Ninguna trae búsqueda, selección ni paginado a propósito — para eso está `DataTable`. Dos detalles: `highlightChanges` sólo resalta columnas **sin** `render` (el resalte se dispara cuando cambia el string del valor crudo), y en `ExpandableTable` **toda la fila es el disparador**, así que un control interactivo dentro de una celda necesita `e.stopPropagation()` para no desplegar el panel.

**Atajos de la hoja de cálculo**: flechas · `⇧`+flechas (rango) · `⌘/Ctrl`+flechas (extremos) · `Tab`/`⇧Tab` · `Enter`/`F2` (editar) · escribir (reemplazar) · `Esc` · `Delete` · `⌘/Ctrl`+`C`/`X`/`V` (TSV, compatible con Excel y Sheets) · `⌘/Ctrl`+`Z`/`⇧Z` · `⌘/Ctrl`+`A` · `Home`/`End`.

**Fórmulas** (evaluador propio, sin `eval()`): operadores `+ - * / ^ ( )`, referencias, rangos, y `SUM` `AVERAGE`/`AVG` `MIN` `MAX` `COUNT` `ABS` `ROUND`. Errores tipados: `#DIV/0!`, `#NAME?`, `#REF!`, `#CIRC!`.

## 🔁 Listas, pickers & feedback

```tsx
// Imagen con contador — 03 / 12 superpuesto, arrastre, teclado, zoom
<ImageCounter
  images={fotos}          // [{ src, alt, caption }]
  counter="pill"          // pill | bar | dots
  position="top-right"    // …-left | bottom-* | bottom-center
  aspect={4/3} pad badge="Destacada" thumbs zoomable
  onIndexChange={setIndex}
/>

// Snackbar — uno a la vez, cola FIFO, acción inline, swipe para descartar
<SnackbarProvider position="bottom-center">{children}</SnackbarProvider>

const { snack, undo, dismiss } = useSnackbar();
snack({ message: "Cambios publicados", variant: "success" });
undo("«Factura #1042» eliminada", () => restore(row));

// Date picker — simple o rango, atajos, límites, días bloqueados
<DatePicker
  value={date} onChange={setDate}
  label="Fecha de la visita" min={hoy} max={enDosMeses}
  disabledDate={d => d.getDay() === 0 || d.getDay() === 6}
  presets={[{ label: "Hoy", value: () => new Date() }]}
  weekStartsOn={1} locale="es-AR"
/>
<DatePicker mode="range" months={2} value={range} onChange={setRange}/>

// Time picker — horas/minutos (y segundos opcional), 12h o 24h, atajos, límites
<TimePicker
  value={time} onChange={setTime}
  label="Hora de la reserva" step={15}
  min="09:00" max="18:00"
  disabledTime={h => h === 13}
/>
<TimePicker hour12 value={time} onChange={setTime}/>

// Paginado — elipsis, extremos, resumen y tamaño de página
<Pagination
  page={page} total={248} pageSize={pageSize}
  onPageChange={setPage} onPageSizeChange={setPageSize}
  siblings={1} edges summary
/>

// Pull to refresh — sólo con el scroll arriba del todo
<PullToRefresh onRefresh={() => mutate()} threshold={72} height="100%">
  <Feed items={items}/>
</PullToRefresh>
```

`Snackbar` es para una acción y uno a la vez (confirmaciones, «deshacer»); `Toast` es para notificaciones que se acumulan. `PullToRefresh` usa `overscroll-behavior-y: contain` para no pelearse con el gesto del navegador.

## 🛒 Comercio & conversión

```tsx
const cart = useCart();

<CartButton count={cart.count} onClick={openSheet} variant="ghost"/>
<CartButton count={cart.count} bump="count"/>   // icon | count | none
<CartPanel
  lines={cart.lines} onQtyChange={cart.setQty}
  onRemove={cart.remove} onClear={cart.clear}   // el vaciado se anima antes de llamar
  shipping={0} discount={cupon}
  footer={<Button fullWidth>Finalizar compra</Button>}
/>

// Popup de promociones
<PromoPopup
  open={open} onClose={close}
  eyebrow="Sólo por hoy" highlight="30% OFF"
  title="Llevate el 30% en toda la colección"
  image="/promo.jpg"
  layout="center"            // center | side-image | bottom-sheet
  delay={4000} snoozeDays={7}
  emailCapture={{ onSubmit: sendCoupon, note: "Sin spam." }}
  cta={{ label: "Ver ofertas", onClick: go }}
/>

// Cupón temporal — timer, cupos, o los dos
<CouponCode code="HOTSALE30" label="30% OFF en toda la tienda"
  expiresAt={endOfSale} onExpire={refreshOffers} onCopy={track}/>
<CouponCode code="ENVIOGRATIS" uses={{ used: 37, total: 50 }} tone="success"/>

// Banner de cuenta regresiva
<CountdownBanner
  until={endOfSale} eyebrow="Hot Sale" title="La oferta termina en"
  variant="boxes"            // boxes | flip | bar
  tone="danger" sticky="top"
  cta={{ label: "Ver ofertas", onClick: go }}
  dismissible snoozeDays={1}
  expiredMessage="La promoción terminó." onExpire={refreshPrices}
/>
```

El badge de `CartButton` entra con spring y salta en cada incremento; con `bump="count"` el icono queda quieto y se agranda sólo el número; `CartPanel` anima cada línea y despide todas en cascada al vaciar. `CouponCode` pulsa en rojo en el último minuto y se tacha al vencer o agotarse.

## 💬 Social, lectura & chat

```tsx
// Chatbot — burbujas, «escribiendo…», quick replies
const [msgs, setMsgs] = useState<ChatMessage[]>([]);

<Chatbot
  messages={msgs}
  onSend={async text => {
    setMsgs(m => [...m, { id: uid(), role: "user", text, at: Date.now() }]);
    const answer = await askBot(text);      // el input queda bloqueado
    setMsgs(m => [...m, { id: uid(), role: "bot", ...answer }]);
  }}
  botName="Asistente" starters={["Envíos", "Pagos", "Devoluciones"]}
  variant="floating"      // floating | inline
  unread={2} footnote="Respuestas automáticas."
/>

// Lector paginado tipo Google Books
<BookReader
  title="Las sillas de la calle Aldama" author="Irene Costa"
  chapters={[{ id: "c1", title: "I · El taller", paragraphs: […] }]}
  spread="auto"           // auto | single | double
  theme="sepia"           // light | sepia | dark
  fontSize={19} height={560}
  storageKey="reader.aldama"      // recuerda capítulo + página
  onProgress={pct => save(pct)}
/>

// Post de red social — cualquier cosa se cuelga abajo
<SocialPost
  author={{ name: "Estudio Aldama", handle: "@aldama", verified: true }}
  time="hace 2 h" text={post.body} media={[{ src, alt }]}
  counts={{ likes: 1284, comments: 96, shares: 34 }}
  onLike={liked => react(post.id, liked)} onSave={bookmark}
  onComment={openThread} onShare={share} onMedia={i => openGallery(i)}
>
  <Poll question="¿Con qué madera armamos la próxima serie?"
    options={[{ id: "a", label: "Roble", votes: 412 }]}
    kind="single" onVote={async ids => await api.vote(pollId, ids)}/>
</SocialPost>

// Caja de comentarios — hilos de una respuesta
<CommentBox
  comments={comments}              // planos, con parentId en las respuestas
  currentUser={{ name: "Lucía", avatar: user.photo }}
  onSubmit={async (text, parentId) => await api.comment({ text, parentId })}
  onLike={(id, liked) => api.likeComment(id, liked)}
  maxLength={280} pageSize={4} sort="top"    // recent | top | old
/>

// Pantalla de éxito con confeti
<SuccessPage
  title="¡Pago confirmado!" headline="$248.320"
  description="Te mandamos el comprobante por mail."
  details={[{ label: "Operación", value: "#A-10428" }]}
  primary={{ label: "Ver mi pedido", href: "/pedidos/A-10428" }}
  confetti="burst"        // burst | rain | center | false
  tone="success" variant="full"   // full (100dvh) | card
  redirectIn={10} onRedirect={() => router.push("/")}
/>

// …o el confeti suelto, sobre cualquier contenedor relative
<Confetti fire={shot} mode="center" count={160}/>
```

`Chatbot` bloquea el input mientras `onSend` esté pendiente. `BookReader` pagina con `column-count` + `column-fill: auto` y repagina solo al cambiar tipografía o rotar el dispositivo, sin perder el capítulo. `SocialPost` recorta el texto a 240 caracteres con «ver más». `CommentBox` no anida más de un nivel a propósito. `Confetti` es canvas puro, sin dependencias, y respeta `prefers-reduced-motion`.

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

## 🧩 Base de una app (el shell)

No hay un componente "todo en uno": la base se arma con piezas que se montan **una vez** en el shell, y después cada pantalla nueva ya nace completa. Las cinco capas:

| # | Capa | Piezas |
|---|---|---|
| 1 | Shell nativo y safe areas | `NativeShell`, `SafeArea` (`SafeAreaSpacer`), `ViewportLock` |
| 2 | Arranque | `useSplash` + `SplashScreen` |
| 3 | Capa PWA | `PwaInstallPrompt`, `InstallButton`, `OfflineBanner`, `UpdatePrompt`, `OfflineFallback`, `PwaStatus` |
| 4 | Navegación | `HeroTabs variant="underline"` (dentro de la pantalla) + `BottomNav` (rutas) |
| 5 | Acción principal | `FabActionSheets` (3 acciones con sheet propio) + `SnackbarProvider` |

```tsx
// app/(app)/AppShell.tsx — "use client": el único límite cliente "de arriba"
<SnackbarProvider position="bottom-center" gap={80}>       {/* 80 = BottomNav (64) + margen */}
  <NativeShell onlyWhenInstalled>                          {/* --sa-*, --app-height; bloqueos sólo instalada */}
    <SplashScreen visible={visible} progress={progress} appName="Mi App" variant="bars" background="brand" />
    <OfflineBanner position="top" />
    <PwaInstallPrompt appName="Mi App" />
    <UpdatePrompt />                                       {/* requiere /sw.js con SKIP_WAITING */}

    <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
      <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
    </SafeArea>

    <BottomNav items={NAV} />                               {/* 3 rutas, mobile (md:hidden) */}
    <FabActionSheets actions={ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
  </NativeShell>
</SnackbarProvider>
```

```tsx
// app/(app)/page.tsx — Server Component: HeroTabs underline es la nav de la pantalla
<HeroTabs
  sticky variant="underline"
  title="Hola, Emanuel"
  actions={<InstallButton size="sm" variant="outline" />}
  tabs={[{ id: "resumen", label: "Resumen" }, { id: "movimientos", label: "Movimientos", count: 12 }]}
  panels={{ resumen: <ResumenPanel />, movimientos: <MovimientosPanel /> }}
/>
```

Guía completa (por qué ese orden, el mapa de z-index, los paddings sobre el `BottomNav`, manifest + service worker y los gotchas de cada pieza): **[docs/guides/app-base.md](docs/guides/app-base.md)**, que trae el código completo de cada archivo del shell.

## 📡 Offline, datos y sincronización

```tsx
// AppHeader — volver, título grande colapsable, acciones con badge, buscador expandible
<AppHeader
  title="Inicio" largeTitle searchable onSearch={setQuery}
  actions={[{ id: "notif", label: "Notificaciones", icon: <BellIcon/>, badge: 3, onClick: openNotifs }]}
/>

// Variantes visuales de AppHeader — misma idea, otro layout
<AppHeaderIsland title="Inicio" searchable onSearch={setQuery} />       // cápsula flotante, dynamic island
<AppHeaderTabs title="Bandeja" tabs={tabs} panels={panels} />          // fila de tabs scrolables pegada arriba
<AppHeaderWave title="Hola, Lucía" subtitle="Tenés 3 pedidos nuevos" />  // hero degradado, esquina curva
<AppHeaderCard title="Ajustes" onBack={() => router.back()} />          // tarjeta flotante, sombra al scrollear
<AppHeaderNotch title="Cámara" center={<Avatar src={user.photo} />} />  // muesca circular + botón central
<AppHeaderPill title="Explorar" onSearch={setQuery} />                 // barra + píldora de búsqueda fija
<AppHeaderCardSlot title="Mi cuenta" card={<WalletBalanceCard balances={saldos} />} /> // hero + card flotante

// Identidad de la PWA — nombre/colores/íconos con preview en vivo + export de manifest.json
<AppIdentityConfig baseManifest={manifestJson} />
const { identity, update, buildManifest, downloadManifest } = useAppIdentity();
update({ name: "Café Aldama", themeColor: "#7c3aed" });

// Cola de mutaciones offline — se persiste en IndexedDB y reintenta con backoff al volver la conexión
const queue = useOfflineQueue<Comment>({ send: (item) => api.postComment(item.payload) });
await queue.enqueue("create-comment", { postId, text }); // UI optimista, se ve al toque

// Estado de la cola — chip compacto o panel con detalle
<SyncStatus pending={queue.pending} failed={queue.failed} flushing={queue.flushing} onRetry={() => queue.retry()} />

// Lectura con caché (stale-while-revalidate) — pinta lo último visto aunque estés offline
const { data, error, fromCache, refetch } = useCachedFetch<Product>(`/api/products/${id}`);
if (error && !data) return <OfflineFallback onRetry={refetch} />;

// useState que sobrevive recargas y cierres de la app (IndexedDB, con fallback a localStorage)
const [filtros, setFiltros, { hydrated }] = usePersistentState("filtros.productos", DEFAULT_FILTERS);

// Pedir un permiso del navegador con contexto — nunca al cargar la app
<PermissionGate kind="camera" reason="Para escanear tu cupón necesitamos la cámara.">
  <CameraCapture open={open} onClose={close} onCapture={(blob) => upload(blob)} guide="document" />
</PermissionGate>

// Ubicación: GPS actual + dirección con sugerencias (sin mapa incluido)
<LocationPicker reverseGeocode={reverseGeocode} onSearch={searchAddresses} onChange={setLocation} />

// Desbloqueo biométrico (Face ID / huella / Windows Hello) vía WebAuthn
<BiometricGate open={locked} onUnlock={() => setLocked(false)} onFallback={() => setShowPinLock(true)} />

// Piezas sueltas: badge del ícono de la app, ciclo de vida, botón atrás de Android,
// espacio en disco, portapapeles y selector de archivos
useAppBadge(unreadCount);
const { isStale } = useAppLifecycle({ onPersist: saveDraft, staleAfter: 60_000 });
useBackButton({ active: sheetOpen, onBack: closeSheet });
const { usage, quota, clearCaches } = useStorageEstimate();
const { copy, copied } = useClipboard();
const { pick } = useFilePicker({ accept: "image/*", maxSize: 5 * 1024 * 1024 });
```

`idb`/`ls` son la capa de persistencia mínima (IndexedDB + fallback a `localStorage`) detrás de `usePersistentState`, `useOfflineQueue` y `useCachedFetch` — usalos directo sólo si necesitás una forma de guardar distinta a esas tres. `usePushSubscription` (Web Push/VAPID), `useCamera`/`useBarcodeScanner` (motor de `CameraCapture`) y `useWebAuthn` (motor de `BiometricGate`) son los hooks de bajo nivel detrás de sus componentes respectivos — usalos directo si necesitás una UI completamente propia.

## 🕒 Timelines, actividad & procesos

```tsx
// Línea de tiempo vertical de eventos
<ActivityTimeline events={[{ id: "1", title: "Pedido creado", time: "10:02", status: "done" }]} />

// Con ramificaciones (árbol de decisiones / flujo)
<BranchingTimeline nodes={[{ id: "1", title: "Inicio", time: "09:00", status: "done", children: [...] }]} />

// Pasos de seguimiento tipo envío/pedido
<TrackingStepper steps={[{ id: "1", label: "Preparando", time: "09:10", status: "done" }]} />

// Eventos con notas/comentarios inline
<TimelineComments events={events} currentUser="Lucía" onAddNote={(eventId, text) => addNote(eventId, text)} />

// Feed de actividad agrupado por fecha
<GroupedActivityFeed events={[{ id: "1", date: new Date(), title: "Actualizó el perfil" }]} />

// Historial de auditoría — cambios de campo (from → to)
<AuditLog entries={[{ id: "1", actor: "Ana", action: "Editó precio", time: "hace 2h", changes: [{ field: "precio", from: "$100", to: "$120" }] }]} />

// Roadmap de producto por trimestre
<Roadmap items={[{ id: "1", title: "Modo offline", quarter: "Q3 2026", status: "in-progress" }]} />

// Pasos numerados "cómo funciona"
<HowItWorksTimeline steps={[{ id: "1", title: "Creá tu cuenta", description: "..." }]} orientation="horizontal" />

// Kanban de escritorio — drag & drop nativo
<KanbanBoard columns={[{ id: "todo", title: "Por hacer", cards: [{ id: "1", title: "Diseñar login" }] }]} onChange={setColumns} />

// Kanban táctil — una columna a la vez, long-press para mover
<KanbanBoardMobile columns={columns} onChange={setColumns} />
```

## ✈️ Itinerarios de viaje & tareas

```tsx
// Itinerario día por día
<ItineraryTimeline
  days={[{ date: new Date("2026-08-10"), activities: [
    { id: "1", kind: "flight", title: "Vuelo a Lisboa", time: "08:40", endTime: "14:10", location: "EZE → LIS" },
    { id: "2", kind: "hotel", title: "Check-in Hotel Alfama", time: "16:00" },
  ] }]}
  onActivityClick={(a) => openDetail(a)}
/>

// Resumen de ruta — destinos encadenados, sin mapa real
<TripRouteMap
  stops={[
    { id: "lis", name: "Lisboa", country: "Portugal", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-14") },
    { id: "por", name: "Oporto", country: "Portugal", startDate: new Date("2026-08-14"), endDate: new Date("2026-08-17") },
  ]}
  value={activeStop} onSelect={setActiveStop}
/>

// Presupuesto del viaje — anillo total + categorías
<TripBudgetSummary
  categories={[
    { id: "alojamiento", label: "Alojamiento", spent: 420000, planned: 500000 },
    { id: "comida", label: "Comida", spent: 180000, planned: 150000 },
  ]}
  currency="ARS"
/>

// Checklist simple con progreso (equipaje, pendientes)
<TripChecklist
  title="Equipaje de mano"
  items={[{ id: "1", label: "Pasaporte", checked: true }, { id: "2", label: "Cargador", checked: false }]}
  onToggle={(id) => toggleItem(id)}
/>

// Tareas agrupadas por día o categoría, colapsables
<GroupedTaskList
  groups={[{ id: "d1", label: "Día 1", sublabel: "10 de agosto", items: [
    { id: "t1", label: "Confirmar traslado al aeropuerto", checked: false },
  ] }]}
  onToggle={(groupId, itemId) => toggleGroupItem(groupId, itemId)}
/>

// Tarea con subtareas, prioridad y vencimiento
<TaskCard
  task={{ id: "1", title: "Armar valija", priority: "high", dueDate: new Date("2026-08-09"),
    subtasks: [{ id: "s1", label: "Ropa de abrigo", done: true }, { id: "s2", label: "Adaptador de enchufe", done: false }] }}
  onToggleDone={toggleTask} onToggleSubtask={toggleSubtask}
/>
```

## 💰 Finanzas & billetera

```tsx
// KPI con sparkline
<KpiCard label="MRR" value="$48.2k" delta={{ value: "+12.4%", direction: "up" }} trend={[8, 10, 9, 13, 15]} />

// Saldo multi-moneda con acciones
<WalletBalanceCard balances={[{ code: "ARS", symbol: "$", amount: 248320 }]} primaryCode="ARS" onSend={goSend} onReceive={goReceive} />

// Selector de moneda con tasa
<CurrencySelector options={[{ code: "USD", name: "Dólar" }, { code: "ARS", name: "Peso" }]} value={code} onChange={setCode} baseCode="ARS" />

// Comparador de cotizaciones
<RateComparator from="ARS" to="USD" amount={100000} quotes={[{ provider: "Banco", rate: 1050, best: true }]} onSelect={pick} />

// Evolución de un valor por período
<ValueHistoryChart periods={[{ id: "6m", label: "6 meses", points: [{ date: new Date(), value: 1200 }] }]} currency="USD" />

// Datos JSON como tabla o gráfico
<JsonChartViewer data={ventasPorMes} defaultView="table" defaultChartType="bar" />

// Transacciones agrupadas por categoría
<TransactionList transactions={[{ id: "1", date: new Date(), title: "Supermercado", category: "Comida", amount: -12500 }]} currency="ARS" />

// Envío de dinero a un contacto
<SendMoneyFlow contacts={[{ id: "1", name: "Lucía Marín" }]} balance={saldo} currency="ARS" onSend={enviar} />

// Cobro con QR y monto editable
<PaymentQrCard name="Lucía Marín" handle="@lucia" qrValue={qrData} onAmountChange={setAmount} />

// Divisor de cuenta
<BillSplitter total={45000} participants={[{ id: "1", name: "Ana" }, { id: "2", name: "Bruno" }]} onConfirm={confirmar} />

// Progreso de gasto por categoría de presupuesto
<BudgetCategoryProgress categories={[{ id: "comida", label: "Comida", spent: 32000, limit: 40000 }]} currency="ARS" />

// Tarjetas guardadas + alta de tarjeta
<PaymentMethodPicker cards={[{ id: "1", brand: "visa", last4: "4242", expiry: "08/28" }]} value={cardId} onChange={setCardId} onAddCard={addCard} />
```

## 📋 Formularios avanzados

```tsx
// Filtros de búsqueda + resultados en vivo
<SearchFilters groups={[{ id: "categoria", label: "Categoría", options: [{ id: "ropa", label: "Ropa" }] }]} onSearch={setQuery} results={results} />

// Orden (asc/desc) + filtros de faceta + rango de precio — cabecera de listado de productos
<ProductFilterBar
  value={filters} onChange={setFilters} resultCount={128}
  sortFields={[{ id: "relevancia", label: "Más relevantes" }, { id: "precio", label: "Precio" }]}
  price={{ min: 0, max: 200000, format: n => `$${n.toLocaleString("es-AR")}` }}
  groups={[{ id: "categoria", label: "Categoría", options: [{ id: "ropa", label: "Ropa", count: 84 }] }]}
/>

// Calendario de reservas
<BookingCalendar days={[{ date: new Date(), slots: [{ time: "10:00", available: true }] }]} value={slot} onChange={setSlot} onConfirm={reservar} />

// Editor de perfil
<ProfileEditor value={{ avatar: null, name: "Lucía", email: "lucia@mail.com", phone: "", bio: "" }} onSave={guardar} />

// Selector de idioma
<LanguagePicker options={[{ code: "es", label: "Español", flag: "🇦🇷" }]} value={lang} onChange={setLang} />

// Rango de fechas con presets
<DateRangePicker value={range} onChange={setRange} presets={[{ label: "Últimos 7 días", value: () => ({ from: hace7, to: hoy }) }]} />

// Etiquetas con sugerencias
<TagInput value={tags} onChange={setTags} suggestions={["react", "next.js", "tailwind"]} maxTags={5} />

// Formulario largo en secciones colapsables
<CollapsibleFormSections sections={[{ id: "envio", title: "Envío", content: <FormularioEnvio /> }]} />

// Slider de rango doble
<DualRangeSlider min={0} max={1000} value={[100, 800]} onChange={setRange} format={(v) => `$${v}`} />

// Selector de color
<ColorPicker value={color} onChange={setColor} palette={["#2563eb", "#8b5cf6", "#ef4444"]} allowCustom />

// Editor de texto enriquecido
<RichTextEditor value={html} onChange={setHtml} placeholder="Escribí acá…" />

// Comparador antes/después
<BeforeAfterSlider before="/casa-antes.jpg" after="/casa-despues.jpg" />

// Calificación por estrellas
<StarRatingWidget value={rating} onChange={setRating} average={4.6} count={128} />

// Wizard multi-paso
<OnboardingWizard steps={[{ id: "1", title: "Bienvenida", content: <Paso1 /> }]} onFinish={finalizar} />

// Conversor de unidades
<UnitConverter groups={[{ id: "longitud", label: "Longitud", units: [{ id: "m", label: "Metros", toBase: 1 }, { id: "km", label: "Kilómetros", toBase: 1000 }] }]} />
```

## 🤝 Comercio, confianza & estado

```tsx
// Tabla comparativa de planes
<PricingTable plans={[{ id: "pro", name: "Pro", price: { monthly: 29, yearly: 290 }, features: ["Todo ilimitado"] }]} onSelect={elegirPlan} />

// Método de envío
<ShippingMethodPicker options={[{ id: "express", label: "Express", price: 1500, eta: "24-48h" }]} value={shipping} onChange={setShipping} />

// Comparación de especificaciones entre productos
<ProductComparisonTable products={[{ id: "1", name: "Plan A", price: "$29" }]} specs={[{ id: "storage", label: "Almacenamiento", values: { "1": "50GB" } }]} />

// Stepper limitado por stock
<StockLimitedStepper value={qty} onChange={setQty} stock={4} lowStockThreshold={5} />

// Programa de referidos
<ReferralProgram code="LUCIA10" invited={12} joined={5} goal={10} reward="1 mes gratis" shareUrl="https://app.com/r/LUCIA10" onShare={compartir} />

// Checklist de aprobación
<ApprovalChecklist items={[{ id: "1", label: "Verificar identidad" }]} onApprove={aprobar} onReject={rechazar} />

// Matriz de permisos por rol
<RolePermissionsTable roles={[{ id: "admin", label: "Admin" }]} permissions={[{ id: "billing", label: "Facturación", access: { admin: true } }]} onChange={setPermissions} />

// Alerta de seguridad de cuenta
<SecurityAlertBanner kind="new-device" detail="Chrome en Windows · Buenos Aires" onReview={revisar} />

// Verificación de identidad (KYC)
<IdentityVerification onSubmit={async (files) => enviarKyc(files)} />

// Selector de sucursal
<BranchSelector branches={[{ id: "1", name: "Palermo", address: "Av. Santa Fe 3253", open: true, distanceKm: 1.2 }]} value={branch} onChange={setBranch} />

// Pantalla de estado — 404 / 403 / 500 / vacío
<PageStatusScreen status="404" primary={{ label: "Volver al inicio", href: "/" }} />

// Mantenimiento o "próximamente"
<MaintenancePage kind="maintenance" eta="Volvemos a las 14:00" onNotify={avisarme} />
```

## ✨ Efectos visuales & superficies

```tsx
// Abanico de cartas interactivo
<CardFan cards={[{ id: "1", label: "Corazones" }, { id: "2", label: "Picas" }]} onPick={elegir} allowShuffle />

// Pila de tarjetas swipeable, tipo Tinder
<SwipeableCardStack cards={[{ id: "1", title: "Depto en Palermo" }]} onSwipe={(id, dir) => reaccionar(id, dir)} onEmpty={cargarMas} />

// Grilla de cartas que se voltean para revelar/emparejar
<FlipRevealGrid items={cartas} columns={4} memoryMode onMatch={onMatch} onComplete={onComplete} />

// Contador numérico animado
<AnimatedCounter value={total} format={(n) => `$${Math.round(n).toLocaleString()}`} />

// Morph entre skeleton y contenido real
<SkeletonMorph loading={loading} skeleton={<CardSkeleton />}>
  <Card>{data}</Card>
</SkeletonMorph>

// Cards con parallax al scrollear
<ParallaxScrollCards items={[{ id: "1", title: "Océano", image: "/ocean.jpg", depth: 0.3 }]} />

// Tarjeta con inclinación 3D + glare
<TiltHoverCard><Card>Pasá el mouse</Card></TiltHoverCard>

// Anillo de progreso animado
<AnimatedProgressRing value={72} />

// Lista reordenable por drag & drop
<DragReorderList items={playlist} onChange={setPlaylist} />

// Grilla de videollamada
<VideoCallGrid participants={[{ id: "1", name: "Ana Torres", speaking: true, videoOn: true }]} onToggleMute={toggleMute} onToggleVideo={toggleVideo} onLeave={salir} />
```

## ✍️ Escritura & acciones flotantes

```tsx
// FAB con speed dial: cada acción abre su propio BottomSheet
<FabActionSheets
  mainLabel="Crear"
  actions={[
    { icon: <PlusIcon/>, label: "Nuevo gasto", content: <FormularioGasto/> },
    { icon: <FilterIcon/>, label: "Filtros", sheetSnapPoints: [0.4, 0.9], content: <PanelDeFiltros/> },
  ]}
/>

// Bloc de notas rápido desde un FAB — viñetas, numeración y emojis
<QuickNotePad
  storageKey="notas.borrador"     // opcional: persiste el borrador en localStorage
  title="Nueva nota"
  onSave={texto => api.crearNota(texto)}
/>

// Escritor a pantalla completa — tradicional (WYSIWYG) o Markdown
<DocumentEditor
  defaultTitle={doc.titulo} defaultValue={doc.markdown}
  defaultFormat="traditional"    // traditional | markdown
  onChange={md => autosave(md)}  // siempre Markdown, en los dos modos
  onSave={async ({ title, markdown }) => await api.guardar({ title, markdown })}
  onClose={cerrar}
  variant="fullscreen"           // fullscreen | embed
/>
```

`FabActionSheets` compone `FloatingButton` + `BottomSheet`: **monta todos los sheets a la vez** (sólo uno abierto), así que un `content` que hace fetch al montarse se ejecuta antes de que el usuario abra nada — renderizalo condicionalmente en ese caso.

En `DocumentEditor` la fuente de verdad es siempre Markdown, y la conversión desde el modo tradicional es **con pérdida**: el subset soportado son títulos, negrita, cursiva, código, enlaces, citas, listas y bloques de código. Todo lo demás (tablas, imágenes, subrayado, HTML pegado) se pierde al convertir. Usa `document.execCommand`, que está deprecado: para un editor que sea pieza central del producto, considerá una librería dedicada. El indicador "Guardado" es cosmético — el guardado real lo hacés en `onChange`/`onSave`.

## 🎲 Juegos & sorteos

```tsx
// Dados 3D — cubos CSS de 6 caras, cantidad elegible por el usuario
<DiceRoller
  min={1} max={6} defaultCount={2} size={64}
  onRoll={values => console.log(values, values.reduce((a, b) => a + b, 0))}
/>

// Ruleta con opciones editables por el usuario — conic-gradient + puntero fijo
<RouletteWheel
  defaultOptions={["Pizza", "Sushi", "Empanadas", "Hamburguesas"]}
  allowEdit size={280}
  onResult={(option, index) => console.log(option, index)}
/>

// Moneda 3D — cara o cruz al azar
<CoinFlip labels={["Cara", "Cruz"]} onFlip={r => console.log(r)} />

// Número al azar en un rango editable, con efecto de conteo
<NumberGenerator defaultMin={1} defaultMax={100} onGenerate={n => console.log(n)} />

// Sorteo — reel animado, N ganadores, con o sin repetición
<RaffleDraw
  defaultEntries={["Ana", "Bruno", "Carla", "Diego"]}
  maxWinners={20}
  onDraw={winners => console.log(winners)}   // acumulado, no sólo los nuevos
/>

// Equipos parejos al azar a partir de una lista
<TeamShuffler defaultEntries={["Ana", "Bruno", "Carla", "Diego"]} defaultTeamCount={2} />

// Anotador de palitos — una fila por jugador, marcas en grupos de 5
<TallyCounter
  defaultPlayers={[{ name: "Equipo A", count: 0 }, { name: "Equipo B", count: 0 }]}
  allowEdit
/>
```

Todos son **no controlados**: las props `default*` alimentan el estado inicial y no se vuelven a leer — para recargar la lista, remontá el componente con una `key` distinta. Usan `Math.random()` sin sesgo, y los que animan un desenlace (dado, moneda, ruleta) comparten el patrón de "rotación siempre hacia adelante": el resultado se sortea *antes* y el ángulo se calcula para caer exactamente ahí, así que la animación nunca retrocede. `TallyCounter` y `TeamShuffler` **no exponen su resultado** (no tienen callback): son herramientas de pantalla.

En `DiceRoller`, `min`/`max` acotan la **cantidad de dados**, no el valor de las caras: los dados son siempre de 6 caras.

> ⚠️ El sorteo corre en el cliente y el usuario puede repetirlo hasta que le guste. Si el resultado tiene consecuencias reales, sorteá en el backend y usá estos componentes sólo para mostrar el desenlace.

## 🎓 Estudio & aprendizaje

```tsx
// Flashcard suelta — flip pregunta/respuesta
<Flashcard tag="Vocabulario" front="¿Cómo se dice «casa» en portugués?" back="Casa" />

// Mazo con cola de sesión: "De nuevo" vuelve al final
<FlashcardDeck
  cards={[{ id: "1", tag: "Historia", front: "¿Año de la independencia?", back: "1816" }]}
  onGrade={(id, grade) => saveReview(id, grade)}   // again | hard | good | easy
  onComplete={() => track("deck_done")}
/>

// Opción múltiple con feedback y explicación
<QuizCard
  key={pregunta.id}          // ← necesario para resetear entre preguntas
  question="¿Capital de Australia?" correctId="b"
  options={[{ id: "a", label: "Sídney" }, { id: "b", label: "Canberra" }]}
  explanation="Canberra es la capital; Sídney es la más poblada."
  index={0} total={5} onAnswer={(id, ok) => logAnswer(id, ok)} onNext={next}
/>

// Pomodoro — foco/descanso alternados
<StudyTimer focusMinutes={25} breakMinutes={5} onCycleComplete={kind => track("pomodoro", kind)} />

// Racha de estudio — grilla de constancia + racha actual
<StreakTracker studiedDates={["2026-07-27", "2026-07-28"]} weeks={14} goalPerWeek={5} />

// Dominio por tema — barra por materia, ordenadas por avance
<ProgressByTopic topics={[{ id: "1", label: "Álgebra lineal", mastery: 92 }]} onTopicClick={openTopic} />

// Emparejar término/definición (pairs memoizado, ver abajo)
<MatchingPairs pairs={PAIRS} onComplete={() => track("match_done")} />
```

`FlashcardDeck` no implementa el algoritmo de repetición espaciada en sí (SM-2 y similares necesitan persistencia entre sesiones): `onGrade` te da la calificación por tarjeta para que la guardes y calcules el próximo repaso en tu backend; localmente sólo reordena la cola de la sesión actual, que se arma al montar.

Tres detalles que hay que tener presentes:

- **`QuizCard` necesita `key`** por pregunta: `onNext` no limpia su estado interno de "respondida".
- **`MatchingPairs` necesita un `pairs` estable** (definido fuera del componente o con `useMemo`): un array literal inline remezcla las tarjetas en cada render del padre.
- **`StreakTracker` compara fechas en UTC**: en zonas al este de UTC la grilla y la racha se corren un día. En Argentina (UTC−3) funciona bien.

## 🖐 Gestos, rendimiento & Web APIs sueltas

```tsx
// Gestos — devuelven props listos para pegar en cualquier elemento
const longPress = useLongPress(() => openContextMenu(item), { onClick: () => openItem(item) });
const swipe = useSwipe({ onSwipeLeft: dismiss, onSwipeRight: dismiss });
<div {...longPress}>{/* … */}</div>

// Control de frecuencia
const debouncedQuery = useDebounce(query, 400);              // retrasa un valor
const saveDraft = useDebouncedCallback(api.saveDraft, 800);  // retrasa una función
const onScroll = useThrottledCallback(updateScrollState, 150); // limita la frecuencia

// Inactividad — cerrar sesión o bloquear con aviso previo
const { warning, secondsLeft, reset } = useIdle({ timeout: 10 * 60_000, onIdle: logout });

// Media queries — SSR-safe
const isDesktop = useIsDesktop();
const reduceMotion = usePrefersReducedMotion();

// Carga adaptativa según la calidad de conexión
const { quality, allowHeavy, imageWidth } = useNetworkQuality();
<VideoPlayer src={clip.url} autoPlay={allowHeavy} />

// Transición nativa entre pantallas/estados (con degradación limpia sin soporte)
const { transition } = useViewTransition();
<button onClick={() => transition(() => setFilter("activos"))}>Ver activos</button>

// Pila de pantallas en memoria — push/pop con soporte del botón atrás
const { current, push, pop, depth } = useScreenStack<"inicio" | "datos" | "listo">("inicio");

// Listas de miles de filas — renderiza sólo lo visible
const { scrollRef, virtualItems, totalHeight } = useVirtualList({ count: rows.length, itemHeight: 72 });

// Web APIs puntuales de dispositivo
const { pick } = useContactPicker();                 // selector de contactos del sistema
const { scan, tag } = useNfc();                       // lectura/escritura de tags NFC
useWebOTP((code) => setOtp(code));                    // autocompleta el SMS de verificación (Android)
const { register } = usePeriodicSync("refresh-feed"); // refresco en segundo plano (PWA instalada)
```
