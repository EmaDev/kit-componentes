# Guía de componentes — lib-kit-components

Documentación de uso de cada componente y hook de la librería: qué es, cuándo usarlo (y cuándo no), todas sus props con tipo/default/descripción, ejemplos de código y comportamiento no obvio. Pensada para que tanto una persona como una IA (un asistente de código) puedan elegir e implementar el componente correcto sin tener que leer el código fuente.

Para instalación, peer dependencies, tokens de tema y el playground en vivo, ver el [README principal](../README.md).

## Cómo usar esta guía

1. Si ya sabés qué componente necesitás, andá directo a su archivo en la tabla de abajo.
2. Si no estás seguro de cuál usar, empezá por la [guía de decisión](#guía-de-decisión-necesito--usá).
3. Cada doc de componente tiene una sección **"Cuándo NO usarlo / alternativas"** que compara contra sus componentes hermanos más ambiguos (ej. `Modal` vs `BottomSheet`, `Select` vs `Dropdown`).
4. Todos los ejemplos asumen `import { X } from "lib-kit-components";` — el paquete tiene un único entry point (barrel export).

## Guía de decisión: "Necesito… → Usá…"

| Necesito… | Usá |
|---|---|
| Un botón con variantes, loading state e íconos | [Button](components/Button.md) |
| Capturar texto corto en un formulario (con floating label) | [Input](components/Input.md) |
| Capturar texto largo/multilínea, con auto-resize | [Textarea](components/Textarea.md) |
| Elegir **un** valor de una lista, dentro de un formulario | [Select](components/Select.md) |
| Un menú de **acciones** contextual (editar/eliminar/duplicar) anclado a un botón/ícono | [Dropdown](components/Dropdown.md) |
| Aclarar un ícono o campo sin label, con texto corto que aparece al hacer hover/focus | [Tooltip](components/Tooltip.md) |
| Un panel con contenido interactivo (formulario, filtros) anclado a un trigger, que se abre con click | [Popover](components/Popover.md) |
| Guiar a un usuario nuevo paso a paso por varias funcionalidades reales de la UI (onboarding) | [CoachMark](components/CoachMark.md) |
| Un checkbox individual o un grupo con "seleccionar todo" | [Checkbox](components/Checkbox.md) |
| Un interruptor on/off que se aplica al instante (sin botón "Guardar") | [Switch](components/Switch.md) |
| Un código de verificación (2FA/OTP) en casillas segmentadas | [CodeOTP](components/CodeOTP.md) |
| Indicar que algo está cargando (inline) | [Spinner](components/Spinner.md) |
| Feedback transitorio no bloqueante ("Guardado", "Error al subir") | [Toast](components/Toast.md) |
| Un diálogo centrado que **bloquea** la interacción hasta confirmar/cancelar | [Modal](components/Modal.md) |
| Un panel que sube desde abajo (selector de opciones, acciones rápidas, mobile-first) | [BottomSheet](components/BottomSheet.md) |
| Navegación horizontal superior (sitio/dashboard simple) — **requiere Next.js** | [Navbar](components/Navbar.md) |
| Navegación vertical lateral (dashboard con muchas secciones) — **requiere Next.js** | [SideBar](components/SideBar.md) |
| Navegación inferior fija tipo app nativa (mobile, 3-5 accesos) — **requiere Next.js** | [BottomNav](components/BottomNav.md) |
| Mostrar la ruta actual ("Inicio / Proyectos / Detalle") | [Breadcrumbs](components/Breadcrumbs.md) |
| Una tarjeta que se voltea en 3D (fichas, tarjetas de crédito) | [FlipCard](components/FlipCard.md) |
| Mostrar/seleccionar una tarjeta de crédito/débito | [FlipCard](components/FlipCard.md) (`CreditCard` / `CreditCardStack`) |
| Un botón de acción flotante (FAB), con o sin speed dial | [FloatingButton](components/FloatingButton.md) |
| Un control de cantidad (+ / −), tipo carrito de compras | [AddButton](components/AddButton.md) |
| Un botón "agregar" con confirmación idle → loading → hecho | [AddToCartButton](components/AddToCartButton.md) |
| Una barra o anillo de progreso, o un indicador de pasos de un wizard | [Progress](components/Progress.md) |
| Un placeholder animado mientras carga contenido (texto, avatar, tarjeta, lista, tabla) | [Skeleton](components/Skeleton.md) |
| Un panel para ajustar/exportar la paleta de colores del tema (marca, superficie, texto, estado) | [ThemeConfigurator](components/ThemeConfigurator.md) |
| Que un mismo deploy use una paleta distinta por cliente, según el dominio o la sesión (white-label / multi-tenant) | [TenantThemeProvider](components/TenantTheme.md) |
| Un contenedor de superficie genérico (KPI, contenido con imagen, perfil, pricing) | [Card](components/Card.md) (`StatCard` / `MediaCard` / `ProfileCard` / `PricingCard`) |
| Una galería de imágenes navegable (drag, flechas, dots, miniaturas, autoplay) | [Carousel](components/Carousel.md) |
| Ampliar **una** imagen a pantalla completa con pan y zoom | [ImageZoom](components/ImageZoom.md) (`ZoomableImage`) |
| Dividir contenido en pestañas dentro de una misma pantalla | [Tabs](components/Tabs.md) |
| Pestañas con pastilla flotante animada y glow alrededor del tab activo | [TabsGlow](components/TabsGlow.md) |
| Pestañas minimalistas con línea animada y paneles que se deslizan según la dirección | [TabsCarousel](components/TabsCarousel.md) |
| Pestañas con íconos que rebotan, estilo dock/tab bar nativo | [TabsDock](components/TabsDock.md) |
| Reemplazar el scroll nativo por una barra propia (grosor/animación custom, arrastrable) | [ScrollArea](components/ScrollArea.md) |
| Un pie de página con columnas de links, redes y newsletter | [Footer](components/Footer.md) |
| Una cabecera de pantalla completa con buscador y sugerencias en vivo | [HeroSearch](components/Hero.md) |
| Una cabecera con imagen a sangre, overlay y datos destacados (portada) | [HeroImage](components/Hero.md) |
| Una cabecera con pestañas horizontales scrolables (bandeja, listado con muchas categorías) | [HeroTabs](components/Hero.md) |
| Un saludo de bienvenida con dato destacado y accesos rápidos, para el home de la app | [HeroWelcome](components/Hero.md) |
| Una fila horizontal de chips (categorías, filtros, personas) con drag y snap | [ChipCarousel](components/ChipCarousel.md) |
| Un teclado numérico propio a pantalla completa (no el del sistema) | [Keypad](components/Keypad.md) |
| Una pantalla de bloqueo por PIN o contraseña al abrir la app | [PinLock](components/PinLock.md) |
| Cargar un monto de dinero a pantalla completa, estilo billetera | [AmountPad](components/AmountPad.md) |
| Redirigir a WhatsApp/Telegram/SMS/mail/URL con cuenta atrás y mensaje editable | [RedirectTimer](components/RedirectTimer.md) |
| Compartir contenido con la hoja nativa del sistema (o un sheet propio de fallback) | [ShareButton](components/ShareButton.md) |
| Una grilla de cards con columnas que el usuario ajusta en el momento | [CardGrid](components/CardGrid.md) |
| Listar/explorar datos tabulares: orden, búsqueda, selección, paginado | [DataTable](components/DataTable.md) |
| Una grilla **editable** tipo Excel/Sheets, con fórmulas | [Spreadsheet](components/Spreadsheet.md) |
| Un calendario mensual con eventos | [CalendarGrid](components/CalendarGrid.md) |
| Un banner/sheet para instalar la PWA (Android + iOS) | [PwaInstallPrompt](components/PwaInstallPrompt.md) |
| Un botón discreto de "Instalar" (header, ajustes) | [InstallButton](components/InstallButton.md) |
| Avisar que el usuario perdió conexión (o la recuperó) | [OfflineBanner](components/OfflineBanner.md) |
| Avisar que hay una nueva versión de la app (service worker) | [UpdatePrompt](components/UpdatePrompt.md) |
| Pedir permiso de notificaciones push con contexto (opt-in) | [NotificationOptIn](components/NotificationOptIn.md) |
| Un panel de diagnóstico PWA (service worker, conexión, permisos) | [PwaStatus](components/PwaStatus.md) |
| Una pantalla de splash/carga inicial animada | [SplashScreen](components/SplashScreen.md) |
| Respetar el notch / home indicator en un contenedor | [SafeArea](components/SafeArea.md) |
| Envolver toda la app con comportamiento "nativo" (zoom, overscroll, safe areas, etc. todo junto) | [NativeShell](components/NativeShell.md) |
| Sólo bloquear zoom/gestos del navegador, sin el resto de NativeShell | [ViewportLock](components/ViewportLock.md) |
| Una galería de una imagen a la vez con contador «3/12» superpuesto | [ImageCounter](components/ImageCounter.md) |
| Feedback de una acción con «deshacer», uno a la vez (cola FIFO) | [Snackbar](components/Snackbar.md) |
| Elegir una fecha o un rango, con atajos y días bloqueados | [DatePicker](components/DatePicker.md) |
| Saltar a una página específica de un listado grande y conocido | [Pagination](components/Pagination.md) |
| El gesto nativo de "tirar para refrescar" en una lista mobile | [PullToRefresh](components/PullToRefresh.md) |
| Un carrito de compras: botón con badge + panel de líneas | [Cart](components/Cart.md) (`CartButton` / `CartPanel` / `useCart`) |
| Un interstitial de oferta con captura de email | [PromoPopup](components/PromoPopup.md) |
| Un código de cupón copiable con timer y/o cupos | [CouponCode](components/CouponCode.md) |
| Un banner de cuenta regresiva de campaña, fijo arriba/abajo | [CountdownBanner](components/CountdownBanner.md) |
| Un asistente conversacional con burbujas y respuestas rápidas | [Chatbot](components/Chatbot.md) |
| Un lector de texto paginado por capítulos, tipo Google Books | [BookReader](components/BookReader.md) |
| Un post de red social con media, reacciones y comentarios | [SocialPost](components/SocialPost.md) |
| Comentarios con hilos de una respuesta, orden y likes | [CommentBox](components/CommentBox.md) |
| Una encuesta (única, múltiple, estrellas o NPS) | [Poll](components/Poll.md) |
| Confeti para celebrar una acción puntual | [Confetti](components/Confetti.md) |
| Una pantalla de éxito completa tras una operación | [SuccessPage](components/SuccessPage.md) |
| Un historial de notificaciones agrupado por fecha, o una campana con popover en el header | [NotificationPanel](components/NotificationPanel.md) (`NotificationBell`) |
| Un reproductor de video con controles propios, o un feed vertical tipo reels | [VideoPlayer](components/VideoPlayer.md) |
| Armar la base completa de una PWA (header, bottom nav, splash, instalación, conectividad, permisos, sheet global) de una | [PackageApp](components/PackageApp.md) (`useAppSheet`) |
| Una cabecera de pantalla con flecha de volver, título grande colapsable y buscador expandible | [AppHeader](components/AppHeader.md) |
| Una cabecera cápsula flotante desprendida de los bordes, estilo dynamic island | [AppHeaderIsland](components/AppHeaderIsland.md) |
| Una cabecera hero con degradado y esquina inferior muy redondeada | [AppHeaderWave](components/AppHeaderWave.md) |
| Una cabecera como tarjeta flotante que gana sombra al scrollear | [AppHeaderCard](components/AppHeaderCard.md) |
| Una cabecera con muesca circular y botón flotante centrado | [AppHeaderNotch](components/AppHeaderNotch.md) |
| Una cabecera minimalista con píldora de búsqueda siempre visible | [AppHeaderPill](components/AppHeaderPill.md) |
| Una cabecera hero con una card flotante vacía centrada para contenido propio | [AppHeaderCardSlot](components/AppHeaderCardSlot.md) |
| Configurar nombre/colores/íconos de instalación de la PWA con preview en vivo y export de manifest.json | [AppIdentityConfig](components/AppIdentityConfig.md) |
| Mostrar cuántos cambios offline faltan enviar (junto a `useOfflineQueue`) | [SyncStatus](components/SyncStatus.md) |
| Una pantalla de "sin conexión" cuando un fetch falla y no hay caché | [OfflineFallback](components/OfflineFallback.md) |
| Pedir un permiso del navegador (cámara, ubicación, notificaciones) con contexto | [PermissionGate](components/PermissionGate.md) |
| Tomar una foto con la cámara del dispositivo, dentro de la propia app | [CameraCapture](components/CameraCapture.md) |
| Elegir una ubicación: GPS actual + dirección con sugerencias | [LocationPicker](components/LocationPicker.md) |
| Desbloquear la app con Face ID / huella / Windows Hello | [BiometricGate](components/BiometricGate.md) |
| Retrasar un valor o una función (buscador, autoguardado) | [useDebounce / useDebouncedCallback](hooks/useDebounce.md) |
| Limitar la frecuencia de un handler de scroll/resize/drag | [useThrottledCallback](hooks/useDebounce.md) |
| Cerrar sesión o bloquear la app tras inactividad, con aviso previo | [useIdle](hooks/useIdle.md) |
| Un gesto de mantener presionado (menú contextual, drag) | [useLongPress](hooks/useLongPress.md) |
| Un gesto de swipe en cualquier dirección sobre un elemento propio | [useSwipe](hooks/useSwipe.md) |
| Saber si es mobile/tablet/desktop, o leer cualquier media query | [useMediaQuery](hooks/useMediaQuery.md) |
| Adaptar la carga (imágenes, autoplay, prefetch) según la calidad de conexión | [useNetworkQuality](hooks/useNetworkQuality.md) |
| Animar un cambio de pantalla/estado con la View Transitions API | [useViewTransition](hooks/useViewTransition.md) (`useScreenStack`) |
| Renderizar sólo lo visible de una lista larga (cientos/miles de filas) | [useVirtualList](hooks/useVirtualList.md) |
| Elegir un contacto de la agenda del sistema | [useContactPicker](hooks/useContactPicker.md) |
| Leer o escribir un tag NFC | [useNfc](hooks/useNfc.md) |
| Autocompletar un código de verificación por SMS (Android) | [useWebOTP](hooks/useWebOTP.md) |
| Refrescar datos en segundo plano cada tantas horas (PWA instalada) | [usePeriodicSync](hooks/usePeriodicSync.md) |

## Componentes

### Layouts

| Componente | Descripción |
|---|---|
| [PackageApp](components/PackageApp.md) | Organismo raíz para la base de una PWA: header, bottom nav, notificaciones, splash, instalación, conectividad, permisos y `BottomSheet` global (`useAppSheet`). |

### UI — formularios, feedback y overlays

| Componente | Descripción |
|---|---|
| [Button](components/Button.md) | Botón con 6 variantes, loading state, íconos y ripple. |
| [Input](components/Input.md) | Campo de texto con floating label, error/hint e íconos. |
| [Textarea](components/Textarea.md) | Área de texto con auto-resize y contador. |
| [Select](components/Select.md) | Selector de un valor, campo de formulario. |
| [Dropdown](components/Dropdown.md) | Menú contextual de acciones anclado a un trigger. |
| [Checkbox](components/Checkbox.md) | Checkbox individual y `CheckboxGroup`. |
| [Switch](components/Switch.md) | Interruptor on/off con thumb animado por spring. |
| [CodeOTP](components/CodeOTP.md) | Código OTP/2FA en casillas segmentadas, auto-avance y pegado multi-dígito. |
| [Spinner](components/Spinner.md) | Indicador de carga, 4 variantes. |
| [Toast](components/Toast.md) | `ToastProvider` + `useToast()`, notificaciones apiladas. |
| [Modal](components/Modal.md) | Diálogo centrado con backdrop. |
| [BottomSheet](components/BottomSheet.md) | Panel deslizable desde abajo, con snapPoints. |
| [Tooltip](components/Tooltip.md) | Globo informativo anclado, con hover/focus y auto-flip. |
| [Popover](components/Popover.md) | Panel anclado con contenido arbitrario, abierto con click. |
| [CoachMark](components/CoachMark.md) | Tour guiado con spotlight sobre elementos reales de la UI. |

### Navegación *(requieren Next.js — ver nota abajo)*

| Componente | Descripción |
|---|---|
| [Navbar](components/Navbar.md) | Barra superior horizontal con menú mobile. |
| [SideBar](components/SideBar.md) | Navegación lateral vertical, colapsable. |
| [BottomNav](components/BottomNav.md) | Navegación inferior fija tipo app nativa. |

### Interacción

| Componente | Descripción |
|---|---|
| [Breadcrumbs](components/Breadcrumbs.md) | Ruta de navegación con colapso automático. |
| [FlipCard](components/FlipCard.md) | Tarjeta 3D volteable + `CreditCard` / `CreditCardStack`. |
| [FloatingButton](components/FloatingButton.md) | FAB con speed dial opcional. |
| [AddButton](components/AddButton.md) | Control de cantidad (+/−) con loading independiente por botón. |
| [AddToCartButton](components/AddToCartButton.md) | Botón "agregar" con estados idle → loading → hecho. |
| [Progress](components/Progress.md) | `ProgressBar`, `ProgressRing`, `StepsProgress`. |
| [Skeleton](components/Skeleton.md) | Placeholders animados: primitivo + `SkeletonText`/`Avatar`/`Card`/`List`/`Table`. |
| [NotificationPanel](components/NotificationPanel.md) | Historial de notificaciones agrupado por fecha + `NotificationBell` (campana con popover). |

### Personalización

| Componente | Descripción |
|---|---|
| [ThemeConfigurator](components/ThemeConfigurator.md) | Editor en vivo de los 10 tokens de color del tema, con presets y export a CSS/JSON. |
| [TenantThemeProvider](components/TenantTheme.md) | Paleta multi-tenant: resuelve el tema por dominio o por sesión y lo aplica a toda la app. Incluye `useTenantTheme()`. |

### Superficies & media

| Componente | Descripción |
|---|---|
| [Card](components/Card.md) | Superficie base (5 variantes) + `StatCard` / `MediaCard` / `ProfileCard` / `PricingCard`. |
| [Carousel](components/Carousel.md) | Carrusel de imágenes: drag, flechas, dots, miniaturas, autoplay y zoom. |
| [ImageZoom](components/ImageZoom.md) | Visor pan + zoom a pantalla completa + `ZoomableImage`. |
| [Tabs](components/Tabs.md) | 5 estilos: underline · pill · segmented · enclosed · vertical. |
| [TabsGlow](components/TabsGlow.md) | Pastilla flotante animada con resplandor (glow) primario alrededor del tab activo. |
| [TabsCarousel](components/TabsCarousel.md) | Línea corta centrada + panel que se desliza como carrusel según la dirección. |
| [TabsDock](components/TabsDock.md) | Íconos con rebote elástico y punto indicador, estilo dock/tab bar nativo. |
| [ScrollArea](components/ScrollArea.md) | Scroll con barra propia arrastrable — 4 variantes de grosor/animación. |
| [Footer](components/Footer.md) | Pie de página con marca, columnas de links, redes y newsletter. |
| [VideoPlayer](components/VideoPlayer.md) | Reproductor con scrub, marcadores, atajos de teclado y modo `portrait` tipo reels. |

### Heroes

| Componente | Descripción |
|---|---|
| [HeroSearch](components/Hero.md) | Cabecera con buscador, sugerencias frecuentes y resultados en vivo. |
| [HeroImage](components/Hero.md) | Cabecera con imagen a sangre, overlay, metadatos y acciones. |
| [HeroTabs](components/Hero.md) | Cabecera con pestañas horizontales scrolables + panel opcional. |
| [HeroWelcome](components/Hero.md) | Saludo de bienvenida + dato destacado + accesos rápidos, para el home de la app. |

### Bloques de app

| Componente | Descripción |
|---|---|
| [ChipCarousel](components/ChipCarousel.md) | Fila de chips con drag, snap y flechas — 4 variantes. |
| [Keypad](components/Keypad.md) | Teclado numérico táctil 3×4, con tecla extra y borrado long-press. |
| [PinLock](components/PinLock.md) | Pantalla de bloqueo por PIN o contraseña. |
| [AmountPad](components/AmountPad.md) | Carga de montos a pantalla completa, estilo billetera. |
| [RedirectTimer](components/RedirectTimer.md) | Cuenta atrás con redirección a WhatsApp/Telegram/SMS/mail/URL + `buildRedirectHref`. |
| [ShareButton](components/ShareButton.md) | Compartir con la hoja nativa del sistema o un sheet propio. |
| [CardGrid](components/CardGrid.md) | Grilla de cards con columnas ajustables en tiempo real. |

### Datos & grillas

| Componente | Descripción |
|---|---|
| [DataTable](components/DataTable.md) | Tabla con orden, búsqueda, selección y paginado. |
| [Spreadsheet](components/Spreadsheet.md) | Hoja de cálculo editable con fórmulas. |
| [CalendarGrid](components/CalendarGrid.md) | Grilla mensual con eventos. |

### PWA & nativo

| Componente | Descripción |
|---|---|
| [PwaInstallPrompt](components/PwaInstallPrompt.md) | Banner Android + sheet iOS de instalación. |
| [InstallButton](components/InstallButton.md) | Botón de instalación embebible. |
| [OfflineBanner](components/OfflineBanner.md) | Estado de conexión / conexión lenta. |
| [UpdatePrompt](components/UpdatePrompt.md) | Aviso de nueva versión (service worker). |
| [NotificationOptIn](components/NotificationOptIn.md) | Opt-in de notificaciones push. |
| [PwaStatus](components/PwaStatus.md) | Panel de diagnóstico PWA. |
| [SplashScreen](components/SplashScreen.md) | Pantalla de carga inicial, 6 variantes de animación. |
| [AppIdentityConfig](components/AppIdentityConfig.md) | Editor en vivo de nombre/colores/íconos de instalación + export de `manifest.json`. Incluye `useAppIdentity()`. |
| [SafeArea](components/SafeArea.md) | `SafeArea` + `SafeAreaSpacer`, respeta insets del dispositivo. |
| [NativeShell](components/NativeShell.md) | Raíz todo-en-uno para experiencia nativa. |
| [ViewportLock](components/ViewportLock.md) | Bloquea zoom/overscroll/long-press, sin UI. |

### Listas, pickers & feedback

| Componente | Descripción |
|---|---|
| [ImageCounter](components/ImageCounter.md) | Galería de una imagen a la vez con contador «03 / 12», arrastre, teclado y zoom. |
| [Snackbar](components/Snackbar.md) | `SnackbarProvider` + `useSnackbar()`, uno a la vez con "deshacer" y swipe. |
| [DatePicker](components/DatePicker.md) | Fecha simple o rango, popover o embebido, atajos y límites. |
| [Pagination](components/Pagination.md) | Paginado numérico con elipsis, resumen y tamaño de página. |
| [PullToRefresh](components/PullToRefresh.md) | Gesto nativo de refresco, con resistencia y flash de confirmación. |

### Comercio & conversión

| Componente | Descripción |
|---|---|
| [Cart](components/Cart.md) | `CartButton` (badge animado) + `CartPanel` (líneas animadas) + `useCart()`. |
| [PromoPopup](components/PromoPopup.md) | Interstitial de ofertas con captura de email opcional. |
| [CouponCode](components/CouponCode.md) | Cupón copiable con timer de vencimiento y/o cupos. |
| [CountdownBanner](components/CountdownBanner.md) | Cuenta regresiva de campaña, fijable y descartable. |

### Social, lectura & chat

| Componente | Descripción |
|---|---|
| [Chatbot](components/Chatbot.md) | Chat con burbujas, "escribiendo…", quick replies y lanzador flotante. |
| [BookReader](components/BookReader.md) | Lector paginado tipo Google Books, con tema y tipografía ajustables. |
| [SocialPost](components/SocialPost.md) | Post con autor, media adaptativa, reacciones y contadores. |
| [CommentBox](components/CommentBox.md) | Comentarios con hilos de una respuesta, orden y likes. |
| [Poll](components/Poll.md) | Encuestas: única, múltiple, estrellas y NPS. |
| [Confetti](components/Confetti.md) | Confeti en canvas puro — burst, rain o center. |
| [SuccessPage](components/SuccessPage.md) | Pantalla de éxito con confeti, detalles y CTA. |

### Offline, datos & sincronización

| Componente | Descripción |
|---|---|
| [AppHeader](components/AppHeader.md) | Header de app con volver, título grande colapsable, acciones con badge y buscador expandible. |
| [AppHeaderIsland](components/AppHeaderIsland.md) | Cápsula flotante desprendida de los bordes, estilo dynamic island. |
| [AppHeaderWave](components/AppHeaderWave.md) | Hero con degradado y esquina inferior muy redondeada. |
| [AppHeaderCard](components/AppHeaderCard.md) | Tarjeta flotante con sombra que se eleva al scrollear. |
| [AppHeaderNotch](components/AppHeaderNotch.md) | Muesca circular con botón flotante centrado. |
| [AppHeaderPill](components/AppHeaderPill.md) | Barra minimalista + píldora de búsqueda siempre visible. |
| [AppHeaderCardSlot](components/AppHeaderCardSlot.md) | Hero con una card flotante vacía centrada, para contenido propio. |
| [SyncStatus](components/SyncStatus.md) | Estado visual de una cola offline (`useOfflineQueue`) — chip o panel de detalle. |
| [OfflineFallback](components/OfflineFallback.md) | Pantalla de "sin conexión" cuando un fetch falla y no hay caché. |
| [PermissionGate](components/PermissionGate.md) | Pide un permiso del navegador con contexto, y contempla el estado bloqueado. |
| [CameraCapture](components/CameraCapture.md) | Captura de foto a pantalla completa: preview, cambio de cámara y revisión. |
| [LocationPicker](components/LocationPicker.md) | GPS actual + dirección con sugerencias (sin mapa incluido). |
| [BiometricGate](components/BiometricGate.md) | Desbloqueo por Face ID / huella / Windows Hello vía WebAuthn. |

### Timelines, actividad & procesos

| Componente | Descripción |
|---|---|
| [ActivityTimeline](components/ActivityTimeline.md) | Línea de tiempo vertical de eventos con estado (done/current/pending/error). |
| [BranchingTimeline](components/BranchingTimeline.md) | Línea de tiempo con ramificaciones/nodos hijos (árbol de decisiones o flujo). |
| [TrackingStepper](components/TrackingStepper.md) | Pasos de seguimiento tipo envío/pedido, con hora y estado. |
| [TimelineComments](components/TimelineComments.md) | Línea de tiempo de eventos con notas/comentarios por evento. |
| [GroupedActivityFeed](components/GroupedActivityFeed.md) | Feed de actividad agrupado por fecha. |
| [AuditLog](components/AuditLog.md) | Historial de auditoría con cambios de campo (`from` → `to`) por entrada. |
| [Roadmap](components/Roadmap.md) | Roadmap de producto por trimestre, con estado shipped/in-progress/planned. |
| [HowItWorksTimeline](components/HowItWorksTimeline.md) | Pasos numerados "cómo funciona", horizontal o vertical. |
| [KanbanBoard](components/KanbanBoard.md) | Tablero Kanban de escritorio con drag & drop nativo, columnas lado a lado. |
| [KanbanBoardMobile](components/KanbanBoardMobile.md) | Kanban táctil: una columna visible a la vez, long-press para reordenar. |

### Itinerarios de viaje & tareas

| Componente | Descripción |
|---|---|
| [ItineraryTimeline](components/ItineraryTimeline.md) | Itinerario día por día: tira de días + timeline de actividades. |
| [TripRouteMap](components/TripRouteMap.md) | Resumen de ruta: destinos encadenados con fechas y noches, sin mapa real. |
| [TripBudgetSummary](components/TripBudgetSummary.md) | Presupuesto de viaje: anillo total + categorías. |
| [TripChecklist](components/TripChecklist.md) | Checklist simple con progreso (equipaje, pendientes). |
| [GroupedTaskList](components/GroupedTaskList.md) | Tareas agrupadas por día/categoría, colapsables. |
| [TaskCard](components/TaskCard.md) | Tarea con subtareas, prioridad y fecha límite. |

### Finanzas & billetera

| Componente | Descripción |
|---|---|
| [KpiCard](components/KpiCard.md) | Tarjeta de KPI con sparkline y variación, para dashboards. |
| [WalletBalanceCard](components/WalletBalanceCard.md) | Saldo multi-moneda con acciones enviar/recibir/convertir. |
| [CurrencySelector](components/CurrencySelector.md) | Selector de moneda con tasa de cambio. |
| [RateComparator](components/RateComparator.md) | Comparador de cotizaciones entre proveedores. |
| [ValueHistoryChart](components/ValueHistoryChart.md) | Gráfico de evolución de un valor por período. |
| [JsonChartViewer](components/JsonChartViewer.md) | Visor de datos JSON como tabla o gráfico. |
| [TransactionList](components/TransactionList.md) | Lista de transacciones agrupadas por categoría. |
| [SendMoneyFlow](components/SendMoneyFlow.md) | Flujo de envío de dinero a un contacto. |
| [PaymentQrCard](components/PaymentQrCard.md) | Tarjeta de cobro con QR y monto editable. |
| [BillSplitter](components/BillSplitter.md) | Divisor de cuenta entre participantes. |
| [BudgetCategoryProgress](components/BudgetCategoryProgress.md) | Progreso de gasto por categoría de presupuesto. |
| [PaymentMethodPicker](components/PaymentMethodPicker.md) | Selector de tarjetas guardadas + alta de tarjeta nueva. |

### Formularios avanzados

| Componente | Descripción |
|---|---|
| [SearchFilters](components/SearchFilters.md) | Filtros de búsqueda agrupados + resultados en vivo. |
| [BookingCalendar](components/BookingCalendar.md) | Calendario de reservas con horarios disponibles por día. |
| [ProfileEditor](components/ProfileEditor.md) | Editor de perfil: avatar, datos de contacto y bio. |
| [LanguagePicker](components/LanguagePicker.md) | Selector de idioma/región. |
| [DateRangePicker](components/DateRangePicker.md) | Selector de rango de fechas con presets. |
| [TagInput](components/TagInput.md) | Input de etiquetas con sugerencias. |
| [CollapsibleFormSections](components/CollapsibleFormSections.md) | Formulario largo dividido en secciones colapsables. |
| [DualRangeSlider](components/DualRangeSlider.md) | Slider de rango doble (mínimo–máximo). |
| [ColorPicker](components/ColorPicker.md) | Selector de color con paleta + color personalizado. |
| [RichTextEditor](components/RichTextEditor.md) | Editor de texto enriquecido básico (negrita, listas, links). |
| [BeforeAfterSlider](components/BeforeAfterSlider.md) | Comparador de imágenes antes/después con slider arrastrable. |
| [StarRatingWidget](components/StarRatingWidget.md) | Calificación por estrellas, con promedio y distribución. |
| [OnboardingWizard](components/OnboardingWizard.md) | Wizard multi-paso con validación y pasos opcionales. |
| [UnitConverter](components/UnitConverter.md) | Conversor de unidades por grupo (longitud, peso, etc.). |

### Comercio, confianza & estado

| Componente | Descripción |
|---|---|
| [PricingTable](components/PricingTable.md) | Tabla comparativa de planes, con precio mensual/anual. |
| [ShippingMethodPicker](components/ShippingMethodPicker.md) | Selector de método de envío con precio y ETA. |
| [ProductComparisonTable](components/ProductComparisonTable.md) | Tabla comparativa de especificaciones entre productos. |
| [StockLimitedStepper](components/StockLimitedStepper.md) | Stepper de cantidad limitado por el stock disponible. |
| [ReferralProgram](components/ReferralProgram.md) | Panel de programa de referidos con progreso hacia una recompensa. |
| [ApprovalChecklist](components/ApprovalChecklist.md) | Checklist de aprobación/rechazo por ítem. |
| [RolePermissionsTable](components/RolePermissionsTable.md) | Matriz de permisos por rol, editable. |
| [SecurityAlertBanner](components/SecurityAlertBanner.md) | Banner de alerta de seguridad (nuevo dispositivo, login sospechoso…). |
| [IdentityVerification](components/IdentityVerification.md) | Flujo de verificación de identidad (KYC) por pasos. |
| [BranchSelector](components/BranchSelector.md) | Selector de sucursal, con distancia y estado abierta/cerrada. |
| [PageStatusScreen](components/PageStatusScreen.md) | Pantalla de estado: 404, 403, 500 o vacío. |
| [MaintenancePage](components/MaintenancePage.md) | Pantalla de mantenimiento o "próximamente". |

### Efectos visuales & superficies

| Componente | Descripción |
|---|---|
| [CardFan](components/CardFan.md) | Abanico de cartas interactivo, para elegir una entre varias. |
| [SwipeableCardStack](components/SwipeableCardStack.md) | Pila de tarjetas swipeable, tipo Tinder. |
| [FlipRevealGrid](components/FlipRevealGrid.md) | Grilla de cartas que se voltean para revelar o emparejar. |
| [AnimatedCounter](components/AnimatedCounter.md) | Contador numérico animado hacia un valor. |
| [SkeletonMorph](components/SkeletonMorph.md) | Transición morph entre un skeleton y el contenido real. |
| [ParallaxScrollCards](components/ParallaxScrollCards.md) | Cards con efecto parallax al scrollear. |
| [TiltHoverCard](components/TiltHoverCard.md) | Tarjeta con inclinación 3D al mover el mouse + glare. |
| [AnimatedProgressRing](components/AnimatedProgressRing.md) | Anillo de progreso animado hacia un valor. |
| [DragReorderList](components/DragReorderList.md) | Lista reordenable por drag & drop. |
| [VideoCallGrid](components/VideoCallGrid.md) | Grilla de participantes de videollamada, con mute/video toggle. |

## Hooks

| Hook | Descripción |
|---|---|
| [useSpreadsheet](hooks/useSpreadsheet.md) | Motor de estado y fórmulas detrás de `Spreadsheet` (usable sin la UI). |
| [usePwaInstall](hooks/usePwaInstall.md) | Ciclo `beforeinstallprompt` → instalar, con snooze. |
| [useOnlineStatus](hooks/useOnlineStatus.md) | Online/offline + detección de conexión lenta. |
| [useServiceWorker](hooks/useServiceWorker.md) | Registro de SW + detección de actualización. |
| [useNotificationPermission](hooks/useNotificationPermission.md) | Permiso y disparo de notificaciones locales. |
| [usePlatform](hooks/usePlatform.md) | OS, browser, form factor, display mode, safe areas — SSR-safe. |
| [useNativeFeel](hooks/useNativeFeel.md) | Bloqueos imperativos para experiencia nativa (zoom, overscroll, etc.). |
| [useSplash](hooks/useSplash.md) | Duración mínima + espera de recursos para el splash screen. |
| [useSafeArea](hooks/useSafeArea.md) | Insets reactivos + CSS vars `--sa-*`. |
| [useImmersive](hooks/useImmersive.md) | Esconder barra del navegador, fullscreen, wake lock. |
| [useKeyboardInset](hooks/useKeyboardInset.md) | Altura del teclado virtual (`--kb-inset`). |
| [useHaptics](hooks/useHaptics.md) | Feedback táctil con patrones con nombre. |
| [useStatusBarColor](hooks/useStatusBarColor.md) | Tiñe la barra de estado (`theme-color`). |
| [idb / ls](hooks/idb.md) | Wrapper mínimo de IndexedDB (+ fallback a `localStorage`) detrás de la persistencia offline. |
| [useOfflineQueue](hooks/useOfflineQueue.md) | Cola de mutaciones offline con reintentos y backoff — motor de `SyncStatus`. |
| [useCachedFetch](hooks/useCachedFetch.md) | Stale-while-revalidate con persistencia en IndexedDB. |
| [usePersistentState](hooks/usePersistentState.md) | `useState` que sobrevive recargas y cierres de la app. |
| [usePushSubscription](hooks/usePushSubscription.md) | Suscripción a Web Push (VAPID), sincronizada con tu backend. |
| [useAppBadge](hooks/useAppBadge.md) | Contador en el ícono de la app instalada. |
| [useAppLifecycle](hooks/useAppLifecycle.md) | Foreground/background, tiempo fuera y el último gancho fiable para persistir. |
| [useBackButton](hooks/useBackButton.md) | Captura el botón atrás de Android para cerrar overlays propios. |
| [useStorageEstimate](hooks/useStorageEstimate.md) | Espacio usado por la app, persistencia y limpieza de Cache Storage. |
| [usePermission](hooks/usePermission.md) | Estado reactivo de un permiso del navegador — motor de `PermissionGate`. |
| [useCamera](hooks/useCamera.md) | Stream de cámara, cambio frontal/trasera y captura a `Blob`. |
| [useBarcodeScanner](hooks/useBarcodeScanner.md) | Lectura de QR/códigos de barra sobre un `<video>` en vivo. |
| [useGeolocation](hooks/useGeolocation.md) | Ubicación del dispositivo, una vez o en vivo (`watch`). |
| [useWebAuthn](hooks/useWebAuthn.md) | Biometría vía WebAuthn — motor de `BiometricGate`. |
| [useClipboard](hooks/useClipboard.md) | Copiar/leer el portapapeles con feedback temporizado. |
| [useFilePicker](hooks/useFilePicker.md) | Elegir/guardar archivos (File System Access API + fallback de `<input>`). |
| [useContactPicker](hooks/useContactPicker.md) | Selector de contactos del sistema (Android/Chrome). |
| [useNfc](hooks/useNfc.md) | Lectura y escritura de tags NFC (Web NFC). |
| [useWebOTP](hooks/useWebOTP.md) | Autocompleta el código de un SMS de verificación (Android/Chrome). |
| [usePeriodicSync](hooks/usePeriodicSync.md) | Actualización en segundo plano cada tantas horas (PWA instalada). |
| [useLongPress](hooks/useLongPress.md) | Gesto de mantener presionado, listo para pegar como props. |
| [useSwipe](hooks/useSwipe.md) | Gestos de swipe en las 4 direcciones sobre un elemento propio. |
| [useDebounce](hooks/useDebounce.md) | Retrasa un valor · `useDebouncedCallback` / `useThrottledCallback`. |
| [useIdle](hooks/useIdle.md) | Inactividad del usuario, con aviso previo configurable. |
| [useMediaQuery](hooks/useMediaQuery.md) | Media query reactiva + `useIsMobile`/`usePrefersDark`/etc. |
| [useNetworkQuality](hooks/useNetworkQuality.md) | Calidad de conexión para carga adaptativa. |
| [useViewTransition](hooks/useViewTransition.md) | View Transitions API + `useScreenStack` (pila de pantallas en memoria). |
| [useVirtualList](hooks/useVirtualList.md) | Virtualización de listas largas — renderiza sólo lo visible. |

## Notas transversales

- **Componentes que requieren Next.js**: `Navbar`, `SideBar` y `BottomNav` importan `next/link` y `next/navigation` directamente en su código — sólo funcionan dentro de una app Next.js con App Router. `next` es peer dependency **opcional** del paquete: si no usás estos tres, no hace falta instalarlo. El resto de la librería es React puro y funciona en cualquier proyecto (Vite, CRA, etc.).
- **Tailwind v4 requerido**: todos los componentes usan clases de utilidad de Tailwind (vía tokens CSS del paquete). El proyecto consumidor necesita Tailwind v4 configurado para escanear las clases del paquete — ver la sección "Estilos y tokens de tema" del [README principal](../README.md#estilos-y-tokens-de-tema).
- **`"use client"`**: todos los componentes están marcados como Client Components (usan hooks, `framer-motion`, o APIs del navegador). En Next.js App Router no hace falta agregar la directiva vos mismo al consumirlos.
- **Componentes controlados vs no controlados**: varios componentes (`Input`, `Select`, `Checkbox`, `FlipCard`, `DataTable`, etc.) soportan ambos modos — pasá `value`/`checked`/`flipped`/`selected` + su callback `onChange`/`onFlipChange`/`onSelectedChange` para modo controlado, o simplemente omitilos para que el componente maneje su propio estado interno. Cada doc lo aclara en su tabla de props.
- **Playground en vivo**: para ver cualquiera de estos componentes corriendo de verdad (no un mock), levantá `cd dev && npm run dev` — ver la sección de preview del [README principal](../README.md).
