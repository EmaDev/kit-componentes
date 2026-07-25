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
      { id: "scrollarea", label: "ScrollArea" },
      { id: "footer", label: "Footer" },
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
    id: "pwa-group",
    label: "PWA & Nativo",
    kicker: "Plataforma",
    tone: "accent",
    blurb:
      "Instalación, conectividad, actualizaciones, notificaciones y detección de plataforma. Todo lo que hace que la web app se sienta nativa.",
    sections: [
      { id: "pwa", label: "Install Prompt" },
      { id: "pwamol", label: "Moléculas PWA" },
      { id: "splash", label: "SplashScreen" },
      { id: "safearea", label: "Safe area · Shell" },
      { id: "platform", label: "Platform · Native" },
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
