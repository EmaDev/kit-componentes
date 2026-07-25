export interface GroupSection {
  id: string;
  label: string;
}

export interface Group {
  id: string;
  label: string;
  kicker: string;
  tone: "primary" | "success" | "accent";
  blurb: string;
  sections: GroupSection[];
}

export const GROUPS: Group[] = [
  {
    id: "atoms",
    label: "Componentes atómicos",
    kicker: "UI",
    tone: "primary",
    blurb:
      "Piezas de interfaz: formularios, feedback, overlays y navegación. Sin dependencias del navegador ni del dispositivo.",
    sections: [
      { id: "button", label: "Button" },
      { id: "input", label: "Input" },
      { id: "textarea", label: "Textarea" },
      { id: "select", label: "Select" },
      { id: "dropdown", label: "Dropdown" },
      { id: "checkbox", label: "Checkbox" },
      { id: "spinner", label: "Spinner" },
      { id: "toast", label: "Toast" },
      { id: "modal", label: "Modal" },
      { id: "sheet", label: "BottomSheet" },
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
      { id: "stepper", label: "Stepper" },
      { id: "progress", label: "Progress" },
      { id: "skeleton", label: "Skeleton" },
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

export const SECTIONS: GroupSection[] = [
  { id: "intro", label: "Introducción" },
  ...GROUPS.flatMap((g) => g.sections),
];

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
