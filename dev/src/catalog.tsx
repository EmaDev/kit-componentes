import type { ComponentType } from "react";

import * as Ui from "./demos/ui";
import * as Interaction from "./demos/interaction";
import * as Navigation from "./demos/navigation";
import * as Surfaces from "./demos/surfaces";
import * as Heroes from "./demos/heroes";
import * as AppBlocks from "./demos/app-blocks";
import * as Data from "./demos/data";
import * as Lists from "./demos/lists";
import * as Commerce from "./demos/commerce";
import * as Finance from "./demos/finance";
import * as Trust from "./demos/trust";
import * as AdvancedForms from "./demos/advanced-forms";
import * as Timelines from "./demos/timelines";
import * as TripTasks from "./demos/trip-tasks";
import * as Games from "./demos/games";
import * as Study from "./demos/study";
import * as Effects from "./demos/effects";
import * as Social from "./demos/social";
import * as Pwa from "./demos/pwa";
import * as Offline from "./demos/offline";
import * as Theme from "./demos/theme";
import * as Utils from "./demos/utils";

/** Una entrada del catálogo = un componente (o una familia) con su preview. */
export interface Entry {
  /** Ancla en la página. Coincide con el `id` del <Section> del demo. */
  id: string;
  /** Nombre visible en el índice — el nombre real del componente. */
  name: string;
  /** Términos extra para el buscador (sub-componentes, hooks, sinónimos). */
  alias?: string;
  Demo: ComponentType;
}

export interface Group {
  id: string;
  label: string;
  entries: Entry[];
}

export interface Category {
  id: string;
  num: string;
  label: string;
  blurb: string;
  groups: Group[];
}

export const CATALOG: Category[] = [
  {
    id: "atomos",
    num: "01",
    label: "Átomos",
    blurb: "Primitivos sin lógica de dominio: controlan un valor, muestran un estado o abren una superficie.",
    groups: [
      {
        id: "atomos-forms",
        label: "Formulario & entrada",
        entries: [
          { id: "button", name: "Button", Demo: Ui.ButtonSection },
          { id: "input", name: "Input", Demo: Ui.InputSection },
          { id: "textarea", name: "Textarea", Demo: Ui.TextareaSection },
          { id: "select", name: "Select", Demo: Ui.SelectSection },
          { id: "dropdown", name: "Dropdown", Demo: Ui.DropdownSection },
          { id: "checkbox", name: "Checkbox", alias: "CheckboxGroup radio", Demo: Ui.CheckboxSection },
          { id: "switch", name: "Switch", alias: "toggle", Demo: Ui.SwitchSection },
          { id: "codeotp", name: "CodeOTP", alias: "OtpInput código verificación pin", Demo: Ui.CodeOTPSection },
          { id: "addbutton", name: "AddButton", alias: "Stepper cantidad", Demo: Interaction.AddButtonSection },
          { id: "taginput", name: "TagInput", alias: "etiquetas chips", Demo: AdvancedForms.TagInputSection },
          { id: "dualrangeslider", name: "DualRangeSlider", alias: "rango precio slider", Demo: AdvancedForms.DualRangeSliderSection },
          { id: "colorpicker", name: "ColorPicker", alias: "color", Demo: AdvancedForms.ColorPickerSection },
          { id: "keypad", name: "Keypad", alias: "teclado numérico", Demo: AppBlocks.KeypadSection },
        ],
      },
      {
        id: "atomos-pickers",
        label: "Pickers",
        entries: [
          { id: "datepicker", name: "DatePicker", alias: "fecha calendario", Demo: Lists.DatePickerSection },
          { id: "daterangepicker", name: "DateRangePicker", alias: "rango fechas", Demo: AdvancedForms.DateRangePickerSection },
          { id: "timepicker", name: "TimePicker", alias: "hora horario", Demo: Lists.TimePickerSection },
          { id: "languagepicker", name: "LanguagePicker", alias: "idioma i18n", Demo: AdvancedForms.LanguagePickerSection },
        ],
      },
      {
        id: "atomos-feedback",
        label: "Feedback & estado",
        entries: [
          { id: "spinner", name: "Spinner", alias: "loading cargando", Demo: Ui.SpinnerSection },
          { id: "skeleton", name: "Skeleton", alias: "placeholder shimmer", Demo: Interaction.SkeletonSection },
          { id: "skeletonmorph", name: "SkeletonMorph", Demo: Effects.SkeletonMorphSection },
          { id: "progress", name: "Progress", alias: "ProgressBar ProgressRing StepsProgress", Demo: Interaction.ProgressSection },
          { id: "animatedprogressring", name: "AnimatedProgressRing", Demo: Effects.AnimatedProgressRingSection },
          { id: "animatedcounter", name: "AnimatedCounter", Demo: Effects.AnimatedCounterSection },
          { id: "toast", name: "Toast", alias: "useToast notificación", Demo: Ui.ToastSection },
          { id: "snackbar", name: "Snackbar", alias: "useSnackbar deshacer undo", Demo: Lists.SnackbarSection },
          { id: "starratingwidget", name: "StarRatingWidget", alias: "estrellas rating", Demo: AdvancedForms.StarRatingWidgetSection },
          { id: "confetti", name: "Confetti · SuccessPage", alias: "éxito celebración", Demo: Social.ConfettiSuccessSection },
        ],
      },
      {
        id: "atomos-superficies",
        label: "Superficies & overlays",
        entries: [
          { id: "cards", name: "Card", alias: "StatCard MediaCard ProfileCard PricingCard", Demo: Surfaces.CardSection },
          { id: "modal", name: "Modal", alias: "dialog popup", Demo: Ui.ModalSection },
          { id: "sheet", name: "BottomSheet", alias: "sheet snap points", Demo: Ui.BottomSheetSection },
          { id: "tooltip", name: "Tooltip", Demo: Ui.TooltipSection },
          { id: "popover", name: "Popover", Demo: Ui.PopoverSection },
          { id: "coachmark", name: "CoachMark", alias: "onboarding tour", Demo: Ui.CoachMarkSection },
          { id: "scrollarea", name: "ScrollArea", Demo: Surfaces.ScrollAreaSection },
          { id: "floatingbutton", name: "FloatingButton", alias: "FAB acciones", Demo: Interaction.FloatingButtonSection },
          { id: "fabactionsheets", name: "FabActionSheets", alias: "FAB sheet", Demo: Interaction.FabActionSheetsSection },
          { id: "flipcard", name: "FlipCard", alias: "CreditCard CreditCardStack tarjeta", Demo: Interaction.FlipCardSection },
        ],
      },
      {
        id: "atomos-utils",
        label: "Utilidades",
        entries: [{ id: "sharebutton", name: "ShareButton", alias: "compartir Web Share", Demo: AppBlocks.ShareButtonSection }],
      },
    ],
  },

  {
    id: "moleculas",
    num: "02",
    label: "Moléculas",
    blurb: "Bloques compuestos y agnósticos de dominio: navegación, headers, datos, listas, media y pantallas genéricas.",
    groups: [
      {
        id: "mol-nav",
        label: "Navegación",
        entries: [
          { id: "navbar", name: "Navbar", Demo: Navigation.NavbarSection },
          { id: "sidebar", name: "SideBar", Demo: Navigation.SideBarSection },
          { id: "bottomnav", name: "BottomNav", alias: "tab bar mobile", Demo: Navigation.BottomNavSection },
          { id: "breadcrumbs", name: "Breadcrumbs", alias: "migas", Demo: Interaction.BreadcrumbsSection },
          { id: "tabs", name: "Tabs", alias: "pestañas", Demo: Surfaces.TabsSection },
          { id: "tabsalt", name: "TabsGlow · TabsCarousel · TabsDock", alias: "pestañas", Demo: Surfaces.TabsAltSection },
          { id: "chipcarousel", name: "ChipCarousel", alias: "chips filtros", Demo: AppBlocks.ChipCarouselSection },
          { id: "footer", name: "Footer", alias: "pie newsletter", Demo: Surfaces.FooterSection },
        ],
      },
      {
        id: "mol-headers",
        label: "Headers & heroes",
        entries: [
          { id: "appheader", name: "AppHeader", alias: "large title back search", Demo: Offline.AppHeaderSection },
          {
            id: "appheadervariants",
            name: "AppHeaderIsland · Wave · Card · Notch · Pill",
            alias: "AppHeaderCardSlot variantes header",
            Demo: Offline.AppHeaderVariantsSection,
          },
          { id: "appheadertabs", name: "AppHeaderTabs", Demo: Offline.AppHeaderTabsSection },
          { id: "herosearch", name: "HeroSearch", Demo: Heroes.HeroSearchSection },
          { id: "heroimage", name: "HeroImage", Demo: Heroes.HeroImageSection },
          { id: "herotabs", name: "HeroTabs", Demo: Heroes.HeroTabsSection },
          { id: "herowelcome", name: "HeroWelcome", alias: "saludo bienvenida", Demo: Heroes.HeroWelcomeSection },
        ],
      },
      {
        id: "mol-datos",
        label: "Datos & tablas",
        entries: [
          { id: "datatable", name: "DataTable", alias: "tabla orden búsqueda paginado", Demo: Data.DataTableSection },
          { id: "expandabletable", name: "ExpandableTable", alias: "tabla detalle", Demo: Data.ExpandableTableSection },
          { id: "animatedtable", name: "AnimatedTable", alias: "tabla FLIP tiempo real", Demo: Data.AnimatedTableSection },
          { id: "spreadsheet", name: "Spreadsheet", alias: "hoja de cálculo fórmulas useSpreadsheet", Demo: Data.SpreadsheetSection },
          { id: "calendar", name: "CalendarGrid", alias: "calendario mes", Demo: Data.CalendarSection },
          { id: "kpicard", name: "KpiCard", alias: "métrica indicador", Demo: Finance.KpiCardSection },
          { id: "jsonchartviewer", name: "JsonChartViewer", alias: "gráfico chart", Demo: Finance.JsonChartViewerSection },
          { id: "valuehistorychart", name: "ValueHistoryChart", alias: "gráfico histórico", Demo: Finance.ValueHistoryChartSection },
        ],
      },
      {
        id: "mol-listas",
        label: "Listas & colecciones",
        entries: [
          { id: "pagination", name: "Pagination", alias: "paginado", Demo: Lists.PaginationSection },
          { id: "searchfilters", name: "SearchFilters", alias: "filtros búsqueda", Demo: AdvancedForms.SearchFiltersSection },
          { id: "cardgrid", name: "CardGrid", alias: "grilla columnas", Demo: AppBlocks.CardGridSection },
          { id: "dragreorderlist", name: "DragReorderList", alias: "reordenar drag", Demo: Effects.DragReorderListSection },
          { id: "swipeablecardstack", name: "SwipeableCardStack", alias: "swipe tinder", Demo: Effects.SwipeableCardStackSection },
          { id: "pulltorefresh", name: "PullToRefresh", alias: "refrescar gesto", Demo: Lists.PullToRefreshSection },
          { id: "activitytimeline", name: "ActivityTimeline", alias: "línea de tiempo", Demo: Timelines.ActivityTimelineSection },
          { id: "branchingtimeline", name: "BranchingTimeline", Demo: Timelines.BranchingTimelineSection },
          { id: "groupedactivityfeed", name: "GroupedActivityFeed", alias: "feed actividad", Demo: Timelines.GroupedActivityFeedSection },
        ],
      },
      {
        id: "mol-media",
        label: "Media & visual",
        entries: [
          { id: "carousel", name: "Carousel", alias: "slider imágenes", Demo: Surfaces.CarouselSection },
          { id: "imagezoom", name: "ImageZoom · ZoomableImage", alias: "zoom pan", Demo: Surfaces.ImageZoomSection },
          { id: "imagecounter", name: "ImageCounter", alias: "galería contador", Demo: Lists.ImageCounterSection },
          { id: "videoplayer", name: "VideoPlayer", alias: "video reproductor", Demo: Surfaces.VideoPlayerSection },
          { id: "beforeafterslider", name: "BeforeAfterSlider", alias: "antes después comparar", Demo: AdvancedForms.BeforeAfterSliderSection },
          { id: "cardfan", name: "CardFan", alias: "abanico cartas", Demo: Effects.CardFanSection },
          { id: "fliprevealgrid", name: "FlipRevealGrid", alias: "memoria grilla", Demo: Effects.FlipRevealGridSection },
          { id: "tilthovercard", name: "TiltHoverCard", alias: "tilt 3D", Demo: Effects.TiltHoverCardSection },
          { id: "parallaxscrollcards", name: "ParallaxScrollCards", alias: "parallax scroll", Demo: Effects.ParallaxScrollCardsSection },
        ],
      },
      {
        id: "mol-flujos",
        label: "Flujos & pantallas",
        entries: [
          { id: "onboardingwizard", name: "OnboardingWizard", alias: "wizard pasos", Demo: AdvancedForms.OnboardingWizardSection },
          {
            id: "collapsibleformsections",
            name: "CollapsibleFormSections",
            alias: "formulario largo acordeón",
            Demo: AdvancedForms.CollapsibleFormSectionsSection,
          },
          { id: "pagestatusscreen", name: "PageStatusScreen", alias: "404 error vacío empty state", Demo: Trust.PageStatusScreenSection },
          { id: "maintenancepage", name: "MaintenancePage", alias: "mantenimiento", Demo: Trust.MaintenancePageSection },
          {
            id: "notificationpanel",
            name: "NotificationPanel",
            alias: "NotificationSidebar NotificationBell campana",
            Demo: Interaction.NotificationPanelSection,
          },
        ],
      },
    ],
  },

  {
    id: "pwa",
    num: "03",
    label: "PWA & nativo",
    blurb: "Instalación, conectividad, permisos, hardware y todo lo que hace que la web se sienta app instalada.",
    groups: [
      {
        id: "pwa-install",
        label: "Instalación & ciclo de vida",
        entries: [
          { id: "pwa", name: "PwaInstallPrompt", alias: "instalar usePwaInstall A2HS", Demo: Pwa.PwaInstallSection },
          {
            id: "pwamol",
            name: "InstallButton · UpdatePrompt · OfflineBanner · NotificationOptIn · PwaStatus",
            alias: "moléculas pwa actualización",
            Demo: Pwa.PwaMoleculesSection,
          },
          { id: "splash", name: "SplashScreen", alias: "useSplash arranque", Demo: Pwa.SplashSection },
        ],
      },
      {
        id: "pwa-offline",
        label: "Conectividad & offline",
        entries: [
          { id: "syncstatus", name: "SyncStatus", alias: "useOfflineQueue cola sincronización", Demo: Offline.OfflineQueueSection },
          { id: "offlinefallback", name: "OfflineFallback", alias: "sin conexión", Demo: Offline.OfflineFallbackSection },
        ],
      },
      {
        id: "pwa-permisos",
        label: "Permisos & hardware",
        entries: [
          { id: "permissiongate", name: "PermissionGate", alias: "usePermission permisos", Demo: Offline.PermissionSection },
          { id: "cameracapture", name: "CameraCapture", alias: "useCamera cámara foto", Demo: Offline.CameraCaptureSection },
          { id: "locationpicker", name: "LocationPicker", alias: "useGeolocation ubicación mapa", Demo: Offline.LocationPickerSection },
          { id: "biometricgate", name: "BiometricGate", alias: "useWebAuthn huella biometría", Demo: Offline.BiometricGateSection },
          {
            id: "deviceapis",
            name: "Web APIs de dispositivo",
            alias: "useNfc useWebOTP useContactPicker useBarcodeScanner useClipboard useFilePicker useHaptics",
            Demo: Offline.DeviceApisSection,
          },
        ],
      },
      {
        id: "pwa-shell",
        label: "Shell nativo",
        entries: [
          { id: "safearea", name: "SafeArea · NativeShell · ViewportLock", alias: "notch useSafeArea inmersivo", Demo: Pwa.SafeAreaSection },
          { id: "platform", name: "usePlatform · useNativeFeel", alias: "detección plataforma iOS Android", Demo: Pwa.PlatformSection },
        ],
      },
    ],
  },

  {
    id: "config",
    num: "04",
    label: "Config & hooks",
    blurb: "Configuración de la app e infraestructura sin UI. Los hooks son la capa real de la librería.",
    groups: [
      {
        id: "config-comp",
        label: "Componentes de config",
        entries: [
          { id: "appidentity", name: "AppIdentityConfig", alias: "useAppIdentity manifest nombre íconos", Demo: Pwa.AppIdentitySection },
          { id: "themeconfigurator", name: "ThemeConfigurator", alias: "tema tokens colores", Demo: Theme.ConfiguratorSection },
          { id: "tenants", name: "TenantThemeProvider", alias: "multi-tenant marca dominio", Demo: Theme.TenantsSection },
          { id: "profileeditor", name: "ProfileEditor", alias: "perfil avatar", Demo: AdvancedForms.ProfileEditorSection },
        ],
      },
      {
        id: "config-datos",
        label: "Datos & offline",
        entries: [
          {
            id: "datahooks",
            name: "usePersistentState · useCachedFetch · idb",
            alias: "hooks datos IndexedDB storage useStorageEstimate",
            Demo: Offline.DataHooksSection,
          },
        ],
      },
      {
        id: "config-ui",
        label: "Utilidades UI",
        entries: [
          { id: "usedebounce", name: "useDebounce", alias: "throttle", Demo: Utils.DebounceSection },
          { id: "useidle", name: "useIdle", alias: "inactividad", Demo: Utils.IdleSection },
          { id: "usemediaquery", name: "useMediaQuery", alias: "useIsMobile breakpoints", Demo: Utils.MediaQuerySection },
          { id: "usenetworkquality", name: "useNetworkQuality", alias: "conexión red", Demo: Utils.NetworkQualitySection },
          { id: "useviewtransition", name: "useViewTransition", alias: "transiciones pantallas", Demo: Utils.ViewTransitionSection },
          { id: "usevirtuallist", name: "useVirtualList", alias: "virtualización lista larga", Demo: Utils.VirtualListSection },
          { id: "gestos", name: "useSwipe · useLongPress", alias: "gestos táctil", Demo: Interaction.GestosSection },
        ],
      },
    ],
  },

  {
    id: "nicho",
    num: "05",
    label: "Componentes por nicho",
    blurb: "Con lógica de dominio: sirven para un tipo de producto concreto. Se arman sobre átomos y moléculas.",
    groups: [
      {
        id: "nicho-fintech",
        label: "Fintech & billetera",
        entries: [
          { id: "walletbalancecard", name: "WalletBalanceCard", alias: "saldo billetera", Demo: Finance.WalletBalanceCardSection },
          { id: "amountpad", name: "AmountPad", alias: "monto importe teclado", Demo: AppBlocks.AmountPadSection },
          { id: "sendmoneyflow", name: "SendMoneyFlow", alias: "enviar dinero transferencia", Demo: Finance.SendMoneyFlowSection },
          { id: "transactionlist", name: "TransactionList", alias: "movimientos transacciones", Demo: Finance.TransactionListSection },
          { id: "paymentqrcard", name: "PaymentQrCard", alias: "cobro QR", Demo: Finance.PaymentQrCardSection },
          { id: "currencyselector", name: "CurrencySelector", alias: "moneda divisa", Demo: Finance.CurrencySelectorSection },
          { id: "ratecomparator", name: "RateComparator", alias: "cotización tipo de cambio", Demo: Finance.RateComparatorSection },
          { id: "billsplitter", name: "BillSplitter", alias: "dividir cuenta", Demo: Finance.BillSplitterSection },
          { id: "budgetcategoryprogress", name: "BudgetCategoryProgress", alias: "presupuesto", Demo: Finance.BudgetCategoryProgressSection },
          { id: "identityverification", name: "IdentityVerification", alias: "KYC identidad", Demo: Trust.IdentityVerificationSection },
        ],
      },
      {
        id: "nicho-comercio",
        label: "Comercio & conversión",
        entries: [
          { id: "cart", name: "Cart", alias: "CartButton CartPanel useCart carrito", Demo: Commerce.CartSection },
          { id: "productfilterbar", name: "ProductFilterBar", alias: "orden filtros tienda", Demo: AdvancedForms.ProductFilterBarSection },
          { id: "paymentmethodpicker", name: "PaymentMethodPicker", alias: "método de pago tarjeta", Demo: Finance.PaymentMethodPickerSection },
          { id: "shippingmethodpicker", name: "ShippingMethodPicker", alias: "envío", Demo: Trust.ShippingMethodPickerSection },
          { id: "stocklimitedstepper", name: "StockLimitedStepper", alias: "stock cantidad", Demo: Trust.StockLimitedStepperSection },
          { id: "trackingstepper", name: "TrackingStepper", alias: "seguimiento pedido", Demo: Timelines.TrackingStepperSection },
          { id: "productcomparisontable", name: "ProductComparisonTable", alias: "comparar productos", Demo: Trust.ProductComparisonTableSection },
          { id: "pricingtable", name: "PricingTable", alias: "planes precios", Demo: Trust.PricingTableSection },
          { id: "promopopup", name: "PromoPopup", alias: "promoción popup email", Demo: Commerce.PromoPopupSection },
          { id: "couponcode", name: "CouponCode", alias: "cupón descuento", Demo: Commerce.CouponCodeSection },
          { id: "countdownbanner", name: "CountdownBanner", alias: "cuenta regresiva oferta", Demo: Commerce.CountdownBannerSection },
        ],
      },
      {
        id: "nicho-estudio",
        label: "Estudio & aprendizaje",
        entries: [
          { id: "flashcard", name: "Flashcard", Demo: Study.FlashcardSection },
          { id: "flashcarddeck", name: "FlashcardDeck", alias: "SRS mazo repaso", Demo: Study.FlashcardDeckSection },
          { id: "quizcard", name: "QuizCard", alias: "opción múltiple examen", Demo: Study.QuizCardSection },
          { id: "matchingpairs", name: "MatchingPairs", alias: "emparejar", Demo: Study.MatchingPairsSection },
          { id: "studytimer", name: "StudyTimer", alias: "pomodoro", Demo: Study.StudyTimerSection },
          { id: "streaktracker", name: "StreakTracker", alias: "racha", Demo: Study.StreakTrackerSection },
          { id: "progressbytopic", name: "ProgressByTopic", alias: "dominio materia", Demo: Study.ProgressByTopicSection },
        ],
      },
      {
        id: "nicho-viajes",
        label: "Viajes & reservas",
        entries: [
          { id: "itinerarytimeline", name: "ItineraryTimeline", alias: "itinerario viaje", Demo: TripTasks.ItineraryTimelineSection },
          { id: "triproutemap", name: "TripRouteMap", alias: "ruta mapa", Demo: TripTasks.TripRouteMapSection },
          { id: "tripbudgetsummary", name: "TripBudgetSummary", alias: "presupuesto viaje", Demo: TripTasks.TripBudgetSummarySection },
          { id: "tripchecklist", name: "TripChecklist", alias: "checklist valija", Demo: TripTasks.TripChecklistSection },
          { id: "bookingcalendar", name: "BookingCalendar", alias: "reservas turnos", Demo: AdvancedForms.BookingCalendarSection },
        ],
      },
      {
        id: "nicho-social",
        label: "Social, chat & lectura",
        entries: [
          { id: "socialpost", name: "SocialPost · Poll", alias: "red social encuesta", Demo: Social.SocialPostSection },
          { id: "commentbox", name: "CommentBox", alias: "comentarios hilos", Demo: Social.CommentBoxSection },
          { id: "timelinecomments", name: "TimelineComments", alias: "notas sobre eventos", Demo: Timelines.TimelineCommentsSection },
          { id: "chatbot", name: "Chatbot", alias: "chat quick replies", Demo: Social.ChatbotSection },
          { id: "videocallgrid", name: "VideoCallGrid", alias: "videollamada", Demo: Effects.VideoCallGridSection },
          { id: "bookreader", name: "BookReader", alias: "lector libro", Demo: Social.BookReaderSection },
        ],
      },
      {
        id: "nicho-productividad",
        label: "Productividad & trabajo",
        entries: [
          { id: "kanban", name: "KanbanBoard · KanbanBoardMobile", alias: "tablero tareas", Demo: Timelines.KanbanSection },
          { id: "taskcard", name: "TaskCard", alias: "tarea subtareas", Demo: TripTasks.TaskCardSection },
          { id: "groupedtasklist", name: "GroupedTaskList", alias: "tareas agrupadas", Demo: TripTasks.GroupedTaskListSection },
          { id: "approvalchecklist", name: "ApprovalChecklist", alias: "aprobaciones", Demo: Trust.ApprovalChecklistSection },
          { id: "richtexteditor", name: "RichTextEditor", alias: "editor texto enriquecido", Demo: AdvancedForms.RichTextEditorSection },
          { id: "documenteditor", name: "DocumentEditor", alias: "markdown documento", Demo: Interaction.DocumentEditorSection },
          { id: "quicknotepad", name: "QuickNotePad", alias: "notas rápidas", Demo: Interaction.QuickNotePadSection },
        ],
      },
      {
        id: "nicho-juegos",
        label: "Juegos & sorteos",
        entries: [
          { id: "diceroller", name: "DiceRoller", alias: "dados", Demo: Games.DiceRollerSection },
          { id: "roulettewheel", name: "RouletteWheel", alias: "ruleta", Demo: Games.RouletteWheelSection },
          { id: "coinflip", name: "CoinFlip", alias: "moneda cara ceca", Demo: Games.CoinFlipSection },
          { id: "raffledraw", name: "RaffleDraw", alias: "sorteo ganadores", Demo: Games.RaffleDrawSection },
          { id: "numbergenerator", name: "NumberGenerator", alias: "número aleatorio", Demo: Games.NumberGeneratorSection },
          { id: "teamshuffler", name: "TeamShuffler", alias: "equipos", Demo: Games.TeamShufflerSection },
          { id: "tallycounter", name: "TallyCounter", alias: "anotador puntos", Demo: Games.TallyCounterSection },
        ],
      },
    ],
  },

  {
    id: "otros",
    num: "06",
    label: "Otros",
    blurb: "Herramientas de conversión, seguridad, admin y piezas de marketing que no entran en las categorías anteriores.",
    groups: [
      {
        id: "otros-archivos",
        label: "Archivos & conversión",
        entries: [{ id: "unitconverter", name: "UnitConverter", alias: "conversor unidades", Demo: AdvancedForms.UnitConverterSection }],
      },
      {
        id: "otros-seguridad",
        label: "Seguridad & admin",
        entries: [
          { id: "pinlock", name: "PinLock", alias: "PIN bloqueo", Demo: AppBlocks.PinLockSection },
          { id: "securityalertbanner", name: "SecurityAlertBanner", alias: "alerta seguridad", Demo: Trust.SecurityAlertBannerSection },
          { id: "auditlog", name: "AuditLog", alias: "auditoría cambios", Demo: Timelines.AuditLogSection },
          { id: "rolepermissionstable", name: "RolePermissionsTable", alias: "roles permisos", Demo: Trust.RolePermissionsTableSection },
          { id: "branchselector", name: "BranchSelector", alias: "sucursal", Demo: Trust.BranchSelectorSection },
        ],
      },
      {
        id: "otros-marketing",
        label: "Marketing & crecimiento",
        entries: [
          { id: "roadmap", name: "Roadmap", alias: "hoja de ruta", Demo: Timelines.RoadmapSection },
          { id: "howitworkstimeline", name: "HowItWorksTimeline", alias: "cómo funciona pasos", Demo: Timelines.HowItWorksTimelineSection },
          { id: "referralprogram", name: "ReferralProgram", alias: "referidos invitar", Demo: Trust.ReferralProgramSection },
          { id: "redirecttimer", name: "RedirectTimer", alias: "redirección WhatsApp Telegram", Demo: AppBlocks.RedirectTimerSection },
        ],
      },
    ],
  },
];

export const TOTAL_ENTRIES = CATALOG.reduce(
  (n, c) => n + c.groups.reduce((m, g) => m + g.entries.length, 0),
  0
);

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export function matchesEntry(entry: Entry, query: string): boolean {
  const q = normalize(query).trim();
  if (!q) return true;
  const haystack = normalize(`${entry.name} ${entry.alias ?? ""} ${entry.id}`);
  return q.split(/\s+/).every((term) => haystack.includes(term));
}
