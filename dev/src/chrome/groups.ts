export interface GroupSection {
  id: string;
  label: string;
}

export interface GroupSubsection {
  id: string;
  label: string;
  sections: GroupSection[];
}

export interface Group {
  id: string;
  label: string;
  kicker: string;
  tone: "primary" | "success" | "accent";
  blurb: string;
  sections: GroupSection[];
  /** Sólo grupos grandes y heterogéneos la definen: habilita render con tabs. */
  subsections?: GroupSubsection[];
}

export const GROUPS: Group[] = [
  {
    id: "ui",
    label: "UI",
    kicker: "UI",
    tone: "primary",
    blurb: "Formularios, feedback y overlays: los bloques de interfaz que arma casi cualquier pantalla.",
    sections: [
      { id: "button", label: "Button" },
      { id: "input", label: "Input" },
      { id: "textarea", label: "Textarea" },
      { id: "select", label: "Select" },
      { id: "dropdown", label: "Dropdown" },
      { id: "checkbox", label: "Checkbox" },
      { id: "switch", label: "Switch" },
      { id: "codeotp", label: "CodeOTP" },
      { id: "spinner", label: "Spinner" },
      { id: "toast", label: "Toast" },
      { id: "modal", label: "Modal" },
      { id: "sheet", label: "BottomSheet" },
      { id: "tooltip", label: "Tooltip" },
      { id: "popover", label: "Popover" },
      { id: "coachmark", label: "CoachMark" },
    ],
    subsections: [
      {
        id: "formularios",
        label: "Formularios",
        sections: [
          { id: "button", label: "Button" },
          { id: "input", label: "Input" },
          { id: "textarea", label: "Textarea" },
          { id: "select", label: "Select" },
          { id: "dropdown", label: "Dropdown" },
          { id: "checkbox", label: "Checkbox" },
          { id: "switch", label: "Switch" },
          { id: "codeotp", label: "CodeOTP" },
        ],
      },
      {
        id: "feedback",
        label: "Feedback",
        sections: [
          { id: "spinner", label: "Spinner" },
          { id: "toast", label: "Toast" },
        ],
      },
      {
        id: "overlays",
        label: "Overlays",
        sections: [
          { id: "modal", label: "Modal" },
          { id: "sheet", label: "BottomSheet" },
          { id: "tooltip", label: "Tooltip" },
          { id: "popover", label: "Popover" },
          { id: "coachmark", label: "CoachMark" },
        ],
      },
    ],
  },
  {
    id: "navigation",
    label: "Navegación",
    kicker: "Navegación",
    tone: "accent",
    blurb: "Navbar, SideBar y BottomNav — requieren Next.js (usan next/link y next/navigation) y corren de verdad en este playground.",
    sections: [
      { id: "navbar", label: "Navbar" },
      { id: "sidebar", label: "SideBar" },
      { id: "bottomnav", label: "BottomNav" },
    ],
  },
  {
    id: "interaction",
    label: "Interacción",
    kicker: "UI",
    tone: "primary",
    blurb: "Breadcrumbs, tarjetas 3D, acciones flotantes, stepper y barras/anillos de progreso.",
    sections: [
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "flipcard", label: "FlipCard" },
      { id: "floatingbutton", label: "FloatingButton" },
      { id: "addbutton", label: "AddButton" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
      { id: "notificationpanel", label: "NotificationPanel" },
      { id: "gestos", label: "Gestos" },
    ],
  },
  {
    id: "theme-group",
    label: "Personalización",
    kicker: "Tema",
    tone: "accent",
    blurb:
      "Editor en vivo de los 10 tokens de color del tema y paleta multi-tenant: un mismo deploy que cambia de marca según el dominio o la sesión.",
    sections: [
      { id: "themeconfigurator", label: "ThemeConfigurator" },
      { id: "tenants", label: "Multi-tenant" },
    ],
  },
  {
    id: "surfaces",
    label: "Superficies & media",
    kicker: "Superficies",
    tone: "primary",
    blurb:
      "Contenedores y contenido visual: cards de todo tipo, carrusel de imágenes, visor con pan y zoom que bloquea el resto de la página, y cinco estilos de tabs.",
    sections: [
      { id: "cards", label: "Cards" },
      { id: "carousel", label: "Carrusel" },
      { id: "imagezoom", label: "Imagen con zoom" },
      { id: "tabs", label: "Tabs" },
      { id: "tabsalt", label: "TabsGlow · Carousel · Dock" },
      { id: "scrollarea", label: "ScrollArea" },
      { id: "footer", label: "Footer" },
      { id: "videoplayer", label: "VideoPlayer" },
    ],
  },
  {
    id: "heroes",
    label: "Heroes",
    kicker: "Heroes",
    tone: "accent",
    blurb:
      "Cabeceras de pantalla completa listas para el tope de una vista: buscador con sugerencias en vivo, imagen a sangre con overlay, pestañas horizontales scrolables y saludo de bienvenida.",
    sections: [
      { id: "herosearch", label: "HeroSearch" },
      { id: "heroimage", label: "HeroImage" },
      { id: "herotabs", label: "HeroTabs" },
      { id: "herowelcome", label: "HeroWelcome" },
    ],
  },
  {
    id: "app-blocks",
    label: "Bloques de app",
    kicker: "Bloques",
    tone: "success",
    blurb:
      "Pantallas y piezas listas de flujos típicos de app: chips de filtro, PIN/contraseña, carga de montos, redirección con cuenta atrás, compartir y grillas con columnas ajustables.",
    sections: [
      { id: "chipcarousel", label: "ChipCarousel" },
      { id: "keypad", label: "Keypad" },
      { id: "pinlock", label: "PinLock" },
      { id: "amountpad", label: "AmountPad" },
      { id: "redirecttimer", label: "RedirectTimer" },
      { id: "sharebutton", label: "ShareButton" },
      { id: "cardgrid", label: "CardGrid" },
    ],
  },
  {
    id: "data",
    label: "Datos & grillas",
    kicker: "Datos",
    tone: "success",
    blurb:
      "Piezas de trabajo pesado: tabla con orden, búsqueda, selección y paginado; hoja de cálculo editable con fórmulas y atajos; y grilla de calendario mensual.",
    sections: [
      { id: "datatable", label: "DataTable" },
      { id: "spreadsheet", label: "Spreadsheet" },
      { id: "calendar", label: "CalendarGrid" },
    ],
  },
  {
    id: "lists",
    label: "Listas, pickers & feedback",
    kicker: "Listas",
    tone: "primary",
    blurb:
      "Galería con contador, snackbar de una acción a la vez, selector de fecha, paginado numérico y el gesto nativo de pull-to-refresh.",
    sections: [
      { id: "imagecounter", label: "ImageCounter" },
      { id: "snackbar", label: "Snackbar" },
      { id: "datepicker", label: "DatePicker" },
      { id: "pagination", label: "Pagination" },
      { id: "pulltorefresh", label: "PullToRefresh" },
    ],
  },
  {
    id: "commerce",
    label: "Comercio & conversión",
    kicker: "Comercio",
    tone: "success",
    blurb:
      "Carrito de compras, popup de promociones con captura de email, cupones con timer y banner de cuenta regresiva.",
    sections: [
      { id: "cart", label: "Cart" },
      { id: "promopopup", label: "PromoPopup" },
      { id: "couponcode", label: "CouponCode" },
      { id: "countdownbanner", label: "CountdownBanner" },
    ],
  },
  {
    id: "finance",
    label: "Finanzas & billetera",
    kicker: "Finanzas",
    tone: "success",
    blurb: "KPIs, saldo multi-moneda, cotizaciones, historial de valor, transacciones, envío de dinero, cobro con QR, divisor de cuentas y presupuesto.",
    sections: [
      { id: "kpicard", label: "KpiCard" },
      { id: "walletbalancecard", label: "WalletBalanceCard" },
      { id: "currencyselector", label: "CurrencySelector" },
      { id: "ratecomparator", label: "RateComparator" },
      { id: "valuehistorychart", label: "ValueHistoryChart" },
      { id: "jsonchartviewer", label: "JsonChartViewer" },
      { id: "transactionlist", label: "TransactionList" },
      { id: "sendmoneyflow", label: "SendMoneyFlow" },
      { id: "paymentqrcard", label: "PaymentQrCard" },
      { id: "billsplitter", label: "BillSplitter" },
      { id: "budgetcategoryprogress", label: "BudgetCategoryProgress" },
      { id: "paymentmethodpicker", label: "PaymentMethodPicker" },
    ],
  },
  {
    id: "trust",
    label: "Comercio, confianza & estado",
    kicker: "Confianza",
    tone: "primary",
    blurb: "Planes, envío, comparación de productos, stock, referidos, aprobaciones, permisos por rol, alertas de seguridad, KYC, sucursales y pantallas de estado.",
    sections: [
      { id: "pricingtable", label: "PricingTable" },
      { id: "shippingmethodpicker", label: "ShippingMethodPicker" },
      { id: "productcomparisontable", label: "ProductComparisonTable" },
      { id: "stocklimitedstepper", label: "StockLimitedStepper" },
      { id: "referralprogram", label: "ReferralProgram" },
      { id: "approvalchecklist", label: "ApprovalChecklist" },
      { id: "rolepermissionstable", label: "RolePermissionsTable" },
      { id: "securityalertbanner", label: "SecurityAlertBanner" },
      { id: "identityverification", label: "IdentityVerification" },
      { id: "branchselector", label: "BranchSelector" },
      { id: "pagestatusscreen", label: "PageStatusScreen" },
      { id: "maintenancepage", label: "MaintenancePage" },
    ],
  },
  {
    id: "advanced-forms",
    label: "Formularios avanzados",
    kicker: "Formularios",
    tone: "accent",
    blurb: "Filtros de búsqueda, reservas, perfil, idioma, rango de fechas, etiquetas, secciones colapsables, sliders, color, texto enriquecido, comparador de imágenes, rating, wizard y conversor de unidades.",
    sections: [
      { id: "searchfilters", label: "SearchFilters" },
      { id: "bookingcalendar", label: "BookingCalendar" },
      { id: "profileeditor", label: "ProfileEditor" },
      { id: "languagepicker", label: "LanguagePicker" },
      { id: "daterangepicker", label: "DateRangePicker" },
      { id: "taginput", label: "TagInput" },
      { id: "collapsibleformsections", label: "CollapsibleFormSections" },
      { id: "dualrangeslider", label: "DualRangeSlider" },
      { id: "colorpicker", label: "ColorPicker" },
      { id: "richtexteditor", label: "RichTextEditor" },
      { id: "beforeafterslider", label: "BeforeAfterSlider" },
      { id: "starratingwidget", label: "StarRatingWidget" },
      { id: "onboardingwizard", label: "OnboardingWizard" },
      { id: "unitconverter", label: "UnitConverter" },
    ],
  },
  {
    id: "timelines",
    label: "Timelines, actividad & procesos",
    kicker: "Timelines",
    tone: "primary",
    blurb: "Líneas de tiempo de eventos, ramificaciones, seguimiento de pedidos, comentarios sobre eventos, feed agrupado, auditoría, roadmap, pasos explicativos y dos Kanban.",
    sections: [
      { id: "activitytimeline", label: "ActivityTimeline" },
      { id: "branchingtimeline", label: "BranchingTimeline" },
      { id: "trackingstepper", label: "TrackingStepper" },
      { id: "timelinecomments", label: "TimelineComments" },
      { id: "groupedactivityfeed", label: "GroupedActivityFeed" },
      { id: "auditlog", label: "AuditLog" },
      { id: "roadmap", label: "Roadmap" },
      { id: "howitworkstimeline", label: "HowItWorksTimeline" },
      { id: "kanban", label: "KanbanBoard · KanbanBoardMobile" },
    ],
  },
  {
    id: "trip-tasks",
    label: "Itinerarios de viaje & tareas",
    kicker: "Viajes",
    tone: "accent",
    blurb: "Itinerario día por día, resumen de ruta, presupuesto de viaje, checklist, tareas agrupadas y tarjeta de tarea con subtareas.",
    sections: [
      { id: "itinerarytimeline", label: "ItineraryTimeline" },
      { id: "triproutemap", label: "TripRouteMap" },
      { id: "tripbudgetsummary", label: "TripBudgetSummary" },
      { id: "tripchecklist", label: "TripChecklist" },
      { id: "groupedtasklist", label: "GroupedTaskList" },
      { id: "taskcard", label: "TaskCard" },
    ],
  },
  {
    id: "effects",
    label: "Efectos visuales & superficies",
    kicker: "Efectos",
    tone: "success",
    blurb: "Abanico y pila de cartas, grilla de memoria, contador animado, morph de skeleton, parallax, tilt 3D, anillo de progreso, lista reordenable y grilla de videollamada.",
    sections: [
      { id: "cardfan", label: "CardFan" },
      { id: "swipeablecardstack", label: "SwipeableCardStack" },
      { id: "fliprevealgrid", label: "FlipRevealGrid" },
      { id: "animatedcounter", label: "AnimatedCounter" },
      { id: "skeletonmorph", label: "SkeletonMorph" },
      { id: "parallaxscrollcards", label: "ParallaxScrollCards" },
      { id: "tilthovercard", label: "TiltHoverCard" },
      { id: "animatedprogressring", label: "AnimatedProgressRing" },
      { id: "dragreorderlist", label: "DragReorderList" },
      { id: "videocallgrid", label: "VideoCallGrid" },
    ],
  },
  {
    id: "social",
    label: "Social, lectura & chat",
    kicker: "Social",
    tone: "accent",
    blurb:
      "Chatbot con quick replies, lector paginado tipo Google Books, post de red social con encuesta anidada, comentarios con hilos, confeti y pantalla de éxito.",
    sections: [
      { id: "chatbot", label: "Chatbot" },
      { id: "bookreader", label: "BookReader" },
      { id: "socialpost", label: "SocialPost · Poll" },
      { id: "commentbox", label: "CommentBox" },
      { id: "confetti", label: "Confetti · SuccessPage" },
    ],
  },
  {
    id: "pwa-group",
    label: "PWA & Nativo",
    kicker: "Plataforma",
    tone: "accent",
    blurb:
      "Instalación, conectividad, actualizaciones, notificaciones y detección de plataforma. Todo lo que hace que la web app se sienta nativa.",
    sections: [
      { id: "pwa", label: "Install Prompt" },
      { id: "pwamol", label: "Moléculas PWA" },
      { id: "appidentity", label: "AppIdentityConfig" },
      { id: "splash", label: "SplashScreen" },
      { id: "safearea", label: "Safe area · Shell" },
      { id: "platform", label: "Platform · Native" },
    ],
  },
  {
    id: "offline",
    label: "Offline, datos & sincronización",
    kicker: "Offline",
    tone: "success",
    blurb:
      "Header de app, cola de mutaciones offline con reintentos, fallback sin conexión, permisos con contexto, cámara, ubicación, biometría y hooks de persistencia.",
    sections: [
      { id: "appheader", label: "AppHeader" },
      { id: "appheadervariants", label: "Variantes de AppHeader" },
      { id: "syncstatus", label: "SyncStatus · useOfflineQueue" },
      { id: "offlinefallback", label: "OfflineFallback" },
      { id: "permissiongate", label: "PermissionGate" },
      { id: "cameracapture", label: "CameraCapture" },
      { id: "locationpicker", label: "LocationPicker" },
      { id: "biometricgate", label: "BiometricGate" },
      { id: "datahooks", label: "Hooks de datos" },
      { id: "deviceapis", label: "Web APIs de dispositivo" },
    ],
  },
  {
    id: "layouts",
    label: "Layouts",
    kicker: "Layout",
    tone: "primary",
    blurb:
      "El organismo raíz que arma la base de una PWA de una: header, bottom nav, notificaciones, splash, instalación, conectividad, permisos y un BottomSheet global compuestos sobre el resto de la librería.",
    sections: [{ id: "packageapp", label: "PackageApp" }],
  },
  {
    id: "utils",
    label: "Utilidades & rendimiento",
    kicker: "Utilidades",
    tone: "primary",
    blurb:
      "Control de frecuencia, inactividad, media queries reactivas, calidad de conexión, transiciones nativas entre pantallas y virtualización de listas largas.",
    sections: [
      { id: "usedebounce", label: "useDebounce" },
      { id: "useidle", label: "useIdle" },
      { id: "usemediaquery", label: "useMediaQuery" },
      { id: "usenetworkquality", label: "useNetworkQuality" },
      { id: "useviewtransition", label: "useViewTransition" },
      { id: "usevirtuallist", label: "useVirtualList" },
    ],
  },
];

export function groupById(id: string): Group {
  const g = GROUPS.find((x) => x.id === id);
  if (!g) throw new Error(`Unknown group id: ${id}`);
  return g;
}

export const SECTIONS: GroupSection[] = [
  { id: "intro", label: "Introducción" },
  ...GROUPS.flatMap((g) => g.sections),
];

/**
 * Ids observables por el scrollspy del SideNav. A diferencia de SECTIONS, para
 * los grupos con `subsections` (render con tabs) sólo observa el ancla del
 * grupo: las subsecciones comparten un único lugar físico en la página (sólo
 * el tab activo está montado ahí), así que no tiene sentido un ancla propia
 * por subsección.
 */
export const SCROLLSPY_SECTIONS: GroupSection[] = [
  { id: "intro", label: "Introducción" },
  ...GROUPS.flatMap((g) =>
    g.subsections ? [{ id: g.id, label: g.label }] : [{ id: g.id, label: g.label }, ...g.sections]
  ),
];

/** Resuelve un deep-link a un componente individual (ej. "#tooltip") a la subsección que lo contiene. */
export const UI_SECTION_TO_SUBSECTION: Record<string, string> = Object.fromEntries(
  (groupById("ui").subsections ?? []).flatMap((sub) => sub.sections.map((s) => [s.id, sub.id]))
);

export const GROUP_TONES: Record<
  Group["tone"],
  { card: string; cardHover: string; pill: string; dot: string; text: string }
> = {
  primary: {
    card: "border-primary/25 bg-primary/[0.04]",
    cardHover: "hover:border-primary/40",
    pill: "bg-primary/12 text-primary",
    dot: "bg-primary",
    text: "text-primary",
  },
  success: {
    card: "border-success/25 bg-success/[0.04]",
    cardHover: "hover:border-success/40",
    pill: "bg-success/12 text-success",
    dot: "bg-success",
    text: "text-success",
  },
  accent: {
    card: "border-accent/25 bg-accent/[0.04]",
    cardHover: "hover:border-accent/40",
    pill: "bg-accent/12 text-accent",
    dot: "bg-accent",
    text: "text-accent",
  },
};
