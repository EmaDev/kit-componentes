export { Button } from "./Button";
export { Input } from "./Input";
export { Textarea } from "./Textarea";
export { Select } from "./Select";
export type { SelectOption } from "./Select";
export { Dropdown } from "./Dropdown";
export type { DropdownItem } from "./Dropdown";
export { Spinner } from "./Spinner";
export { ToastProvider, useToast } from "./Toast";
export type { Toast } from "./Toast";
export { Modal } from "./Modal";
export { BottomSheet } from "./BottomSheet";
export type { BottomSheetSize } from "./BottomSheet";
export { DataTable } from "./DataTable";
export type { Column, SortDir } from "./DataTable";
export { Spreadsheet } from "./Spreadsheet";
export { useSpreadsheet, evaluateCell, cellId, colName, colIndex } from "../hooks/useSpreadsheet";
export { CalendarGrid } from "./CalendarGrid";
export type { CalendarEvent } from "./CalendarGrid";
export { Navbar } from "./Navbar";
export type { NavLink } from "./Navbar";
export { SideBar } from "./SideBar";
export type { SidebarLink, SidebarSection } from "./SideBar";
export { BottomNav } from "./BottomNav";
export type { BottomNavItem } from "./BottomNav";
export { Tooltip } from "./Tooltip";
export type { TooltipSide, TooltipAlign } from "./Tooltip";
export { Popover } from "./Popover";
export type { PopoverSide, PopoverAlign } from "./Popover";
export { CoachMark } from "./CoachMark";
export type { CoachMarkStep, CoachMarkSide, CoachMarkAlign } from "./CoachMark";
export { Footer } from "./Footer";
export type { FooterLink, FooterLinkGroup, FooterSocialLink, FooterNewsletter } from "./Footer";

// --- Interacción & feedback ---
export { Breadcrumbs } from "./Breadcrumbs";
export type { Crumb } from "./Breadcrumbs";
export { Checkbox, CheckboxGroup } from "./Checkbox";
export { Switch } from "./Switch";
export type { SwitchSize, SwitchTone } from "./Switch";
export { CodeOTP } from "./CodeOTP";
export type { CodeOTPType, CodeOTPSize } from "./CodeOTP";
export { FlipCard, CreditCard, CreditCardStack } from "./FlipCard";
export type { CreditCardData } from "./FlipCard";
export { FloatingButton } from "./FloatingButton";
export type { FabAction } from "./FloatingButton";
export { AddButton } from "./AddButton";
export { AddToCartButton } from "./AddToCartButton";
export { ProgressBar, ProgressRing, StepsProgress } from "./Progress";
export { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard, SkeletonList, SkeletonTable } from "./Skeleton";
export type { SkeletonVariant, SkeletonAnimation } from "./Skeleton";
export { NotificationPanel, NotificationBell, relativeTime, groupLabel } from "./NotificationPanel";
export type { AppNotification, NotificationTone, NotificationPanelProps, NotificationBellProps } from "./NotificationPanel";

// --- Personalización / multi-tenant ---
export {
  ThemeConfigurator,
  DEFAULT_THEME_TOKENS,
  DEFAULT_DARK_THEME_TOKENS,
  THEME_TOKEN_VARS,
  THEME_TOKEN_KEYS,
} from "./ThemeConfigurator";
export type { ThemeTokens, ThemePreset } from "./ThemeConfigurator";
export {
  TenantThemeProvider,
  useTenantTheme,
  resolveTenantByHost,
  resolveTenantTokens,
  tenantThemeCss,
  hostMatches,
} from "./TenantTheme";
export type { TenantTheme, ThemeMode } from "./TenantTheme";

// --- Superficies & media ---
export { Card, CardMedia, CardHeader, CardFooter, StatCard, MediaCard, ProfileCard, PricingCard } from "./Card";
export type { CardVariant, CardPadding, StatTone } from "./Card";
export { Carousel } from "./Carousel";
export type { CarouselImage } from "./Carousel";
export { ImageZoom, ZoomableImage } from "./ImageZoom";
export { Tabs } from "./Tabs";
export type { TabItem, TabsVariant, TabsSize } from "./Tabs";
export { ScrollArea } from "./ScrollArea";
export type { ScrollAreaVariant, ScrollAreaOrientation } from "./ScrollArea";
export { VideoPlayer, formatTime } from "./VideoPlayer";
export type { VideoPlayerProps, PlayerOrientation } from "./VideoPlayer";

// --- Heroes ---
export { HeroSearch, HeroImage, HeroTabs, HeroWelcome, greetingFor } from "./Hero";
export type { HeroSearchProps, HeroImageProps, HeroTabsProps, HeroWelcomeProps, HeroTab } from "./Hero";

// --- Bloques de app ---
export { ChipCarousel } from "./ChipCarousel";
export type { Chip, ChipVariant, ChipSize } from "./ChipCarousel";
export { Keypad } from "./Keypad";
export type { KeypadKey } from "./Keypad";
export { PinLock } from "./PinLock";
export { AmountPad } from "./AmountPad";
export { RedirectTimer, buildRedirectHref } from "./RedirectTimer";
export type { RedirectTarget } from "./RedirectTimer";
export { ShareButton } from "./ShareButton";
export { CardGrid } from "./CardGrid";

// --- Listas, pickers & feedback ---
export { ImageCounter } from "./ImageCounter";
export type { CounterImage, CounterStyle, CounterPosition } from "./ImageCounter";
export { SnackbarProvider, useSnackbar } from "./Snackbar";
export type { Snack, SnackbarVariant, SnackbarPosition } from "./Snackbar";
export { DatePicker } from "./DatePicker";
export type { DateRange } from "./DatePicker";
export { Pagination } from "./Pagination";
export { PullToRefresh } from "./PullToRefresh";

// --- Comercio & conversión ---
export { CartButton, CartPanel, useCart } from "./Cart";
export type { CartLine } from "./Cart";
export { PromoPopup } from "./PromoPopup";
export type { PromoLayout } from "./PromoPopup";
export { CouponCode } from "./CouponCode";
export { CountdownBanner } from "./CountdownBanner";
export type { CountdownVariant } from "./CountdownBanner";

// --- Social, lectura & chat ---
export { Chatbot } from "./Chatbot";
export type { ChatMessage } from "./Chatbot";
export { BookReader } from "./BookReader";
export type { BookChapter, ReaderTheme } from "./BookReader";
export { SocialPost } from "./SocialPost";
export type { PostAuthor, PostMedia, PostCounts } from "./SocialPost";
export { CommentBox } from "./CommentBox";
export type { Comment, CommentSort } from "./CommentBox";
export { Poll } from "./Poll";
export type { PollOption, PollKind } from "./Poll";
export { Confetti } from "./Confetti";
export { SuccessPage } from "./SuccessPage";
export type { SuccessDetail } from "./SuccessPage";

// --- PWA ---
export { PwaInstallPrompt } from "./PwaInstallPrompt";
export { InstallButton } from "./InstallButton";
export { OfflineBanner } from "./OfflineBanner";
export { UpdatePrompt } from "./UpdatePrompt";
export { NotificationOptIn } from "./NotificationOptIn";
export { PwaStatus } from "./PwaStatus";
export { SplashScreen } from "./SplashScreen";
export type { SplashVariant } from "./SplashScreen";
export { ViewportLock } from "./ViewportLock";
export { NativeShell } from "./NativeShell";
export { SafeArea, SafeAreaSpacer } from "./SafeArea";
export { useSplash } from "../hooks/useSplash";
export { useSafeArea } from "../hooks/useSafeArea";
export type { SafeAreaInsets } from "../hooks/useSafeArea";
export { useImmersive } from "../hooks/useImmersive";
export { useKeyboardInset } from "../hooks/useKeyboardInset";
export { useHaptics } from "../hooks/useHaptics";
export type { HapticPattern } from "../hooks/useHaptics";
export { useStatusBarColor } from "../hooks/useStatusBarColor";
export { usePwaInstall } from "../hooks/usePwaInstall";
export type { PwaPlatform } from "../hooks/usePwaInstall";
export { usePlatform } from "../hooks/usePlatform";
export type { PlatformInfo, OS, Browser, FormFactor, DisplayMode } from "../hooks/usePlatform";
export { useNativeFeel } from "../hooks/useNativeFeel";
export type { NativeFeelOptions } from "../hooks/useNativeFeel";
export { useOnlineStatus } from "../hooks/useOnlineStatus";
export { useServiceWorker } from "../hooks/useServiceWorker";
export { useNotificationPermission } from "../hooks/useNotificationPermission";
export type { NotificationStatus } from "../hooks/useNotificationPermission";

// --- Layouts ---
export { PackageApp, useAppSheet } from "./PackageApp";
export type {
  PackageAppProps,
  PackageAppNotifications,
  PackageAppPermission,
  PackageAppSplashProps,
  AppSheetOptions,
} from "./PackageApp";

// --- Offline, datos & sincronización ---
export { AppHeader } from "./AppHeader";
export type { HeaderAction } from "./AppHeader";
export { SyncStatus } from "./SyncStatus";
export { OfflineFallback } from "./OfflineFallback";
export { PermissionGate } from "./PermissionGate";
export { CameraCapture } from "./CameraCapture";
export { LocationPicker } from "./LocationPicker";
export { BiometricGate } from "./BiometricGate";
export { useOfflineQueue } from "../hooks/useOfflineQueue";
export type { QueuedItem, QueueItemStatus } from "../hooks/useOfflineQueue";
export { useCachedFetch } from "../hooks/useCachedFetch";
export { usePersistentState } from "../hooks/usePersistentState";
export { idb, ls, idbAvailable } from "../hooks/idb";
export { usePushSubscription } from "../hooks/usePushSubscription";
export { useAppBadge } from "../hooks/useAppBadge";
export { useAppLifecycle } from "../hooks/useAppLifecycle";
export { useBackButton } from "../hooks/useBackButton";
export { useStorageEstimate, formatBytes } from "../hooks/useStorageEstimate";
export { usePermission } from "../hooks/usePermission";
export type { PermissionKind, PermissionState } from "../hooks/usePermission";
export { useCamera } from "../hooks/useCamera";
export type { CameraFacing } from "../hooks/useCamera";
export { useBarcodeScanner } from "../hooks/useBarcodeScanner";
export type { ScanResult } from "../hooks/useBarcodeScanner";
export { useGeolocation } from "../hooks/useGeolocation";
export type { Coords } from "../hooks/useGeolocation";
export { useWebAuthn } from "../hooks/useWebAuthn";
export { useClipboard } from "../hooks/useClipboard";
export { useFilePicker } from "../hooks/useFilePicker";
export { useContactPicker } from "../hooks/useContactPicker";
export type { PickedContact } from "../hooks/useContactPicker";
export { useNfc } from "../hooks/useNfc";
export type { NfcTag } from "../hooks/useNfc";
export { useWebOTP } from "../hooks/useWebOTP";
export { usePeriodicSync } from "../hooks/usePeriodicSync";

// --- Gestos & entrada ---
export { useLongPress } from "../hooks/useLongPress";
export { useSwipe } from "../hooks/useSwipe";
export type { SwipeDirection } from "../hooks/useSwipe";

// --- Utilidades & rendimiento ---
export { useDebounce, useDebouncedCallback, useThrottledCallback } from "../hooks/useDebounce";
export { useIdle } from "../hooks/useIdle";
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersDark,
  usePrefersReducedMotion,
  useIsLandscape,
  useIsStandalone,
} from "../hooks/useMediaQuery";
export { useNetworkQuality } from "../hooks/useNetworkQuality";
export type { Quality } from "../hooks/useNetworkQuality";
export { useViewTransition, useScreenStack } from "../hooks/useViewTransition";
export { useVirtualList } from "../hooks/useVirtualList";
