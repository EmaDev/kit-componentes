// =============================================================
//  Demo App — recorre los componentes en secciones
// =============================================================

// React hooks already destructured in atoms.jsx (shared babel scope)

// Dos grupos claramente separados: componentes de UI vs. plataforma/PWA
const GROUPS = [
  {
    id: "atoms",
    label: "Componentes atómicos",
    kicker: "UI",
    tone: "primary",
    blurb: "Piezas de interfaz: formularios, feedback, overlays y navegación. Sin dependencias del navegador ni del dispositivo.",
    sections: [
      { id: "button",    label: "Button" },
      { id: "input",     label: "Input" },
      { id: "textarea",  label: "Textarea" },
      { id: "select",    label: "Select" },
      { id: "dropdown",  label: "Dropdown" },
      { id: "spinner",   label: "Spinner" },
      { id: "toast",     label: "Toast" },
      { id: "modal",     label: "Modal" },
      { id: "sheet",     label: "BottomSheet" },
      { id: "navbar",    label: "Navbar" },
      { id: "sidebar",   label: "SideBar" },
      { id: "bottomnav", label: "BottomNav" },
    ],
  },
  {
    id: "data",
    label: "Datos & grillas",
    kicker: "Datos",
    tone: "success",
    blurb: "Piezas de trabajo pesado: tabla con orden, búsqueda, selección y paginado; hoja de cálculo editable con fórmulas y atajos; y grilla de calendario mensual.",
    sections: [
      { id: "datatable",   label: "DataTable" },
      { id: "spreadsheet", label: "Spreadsheet" },
      { id: "calendar",    label: "CalendarGrid" },
    ],
  },
  {
    id: "interact",
    label: "Interacción & feedback",
    kicker: "Feedback",
    tone: "warning",
    blurb: "Navegación contextual, selección, acciones flotantes, cantidades con estado de carga y progreso en todas sus formas.",
    sections: [
      { id: "breadcrumbs", label: "Breadcrumbs" },
      { id: "checkbox",    label: "Checkbox" },
      { id: "creditcard",  label: "Tarjeta volteable" },
      { id: "fab",         label: "Botón flotante" },
      { id: "stepper",     label: "Stepper · AddButton" },
      { id: "progress",    label: "Progress" },
    ],
  },
  {
    id: "surfaces",
    label: "Superficies & media",
    kicker: "Superficies",
    tone: "neutral",
    blurb: "Contenedores y contenido visual: cards de todo tipo, carrusel de imágenes, visor con pan y zoom que bloquea el resto de la página, y cinco estilos de tabs.",
    sections: [
      { id: "cards",     label: "Cards" },
      { id: "carousel",  label: "Carrusel" },
      { id: "imagezoom", label: "Imagen con zoom" },
      { id: "tabs",      label: "Tabs" },
    ],
  },
  {
    id: "pwa-group",
    label: "PWA & Nativo",
    kicker: "Plataforma",
    tone: "accent",
    blurb: "Instalación, conectividad, actualizaciones, notificaciones y detección de plataforma. Todo lo que hace que la web app se sienta nativa.",
    sections: [
      { id: "pwa",      label: "Install Prompt" },
      { id: "pwamol",   label: "Moléculas PWA" },
      { id: "splash",   label: "SplashScreen" },
      { id: "safearea", label: "Safe area · Shell" },
      { id: "platform", label: "Platform · Native" },
    ],
  },
];

const SECTIONS = [
  { id: "intro", label: "Introducción" },
  ...GROUPS.flatMap(g => g.sections),
];

// paleta por grupo (los tokens con alpha ya resuelven bien en el preview)
const GROUP_TONES = {
  primary: {
    card: "border-primary/25 bg-primary/[0.04]", cardHover: "hover:border-primary/40",
    pill: "bg-primary/12 text-primary", dot: "bg-primary", text: "text-primary",
  },
  success: {
    card: "border-success/25 bg-success/[0.04]", cardHover: "hover:border-success/40",
    pill: "bg-success/12 text-success", dot: "bg-success", text: "text-success",
  },
  accent: {
    card: "border-accent/25 bg-accent/[0.04]", cardHover: "hover:border-accent/40",
    pill: "bg-accent/12 text-accent", dot: "bg-accent", text: "text-accent",
  },
  warning: {
    card: "border-danger/25 bg-danger/[0.04]", cardHover: "hover:border-danger/40",
    pill: "bg-danger/12 text-danger", dot: "bg-danger", text: "text-danger",
  },
  neutral: {
    card: "border-border bg-surface-alt/60", cardHover: "hover:border-muted/50",
    pill: "bg-foreground/10 text-foreground", dot: "bg-foreground", text: "text-foreground",
  },
};

// ---------- Theme toggle ----------
function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <button onClick={()=>setDark(d=>!d)}
      className="relative w-14 h-8 rounded-full border border-border bg-surface-alt transition-colors hover:border-muted/40 active:scale-95"
      aria-label="Toggle theme"
    >
      <span className="absolute top-1 w-6 h-6 rounded-full bg-surface shadow-md flex items-center justify-center transition-all duration-300"
        style={{ left: dark ? "calc(100% - 1.75rem)" : "0.25rem", color: dark ? "var(--color-accent)" : "var(--color-primary)" }}>
        {dark ? I.moon : I.sun}
      </span>
    </button>
  );
}

// ---------- Section wrapper ----------
function Section({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-20 py-12 first:pt-6 border-b border-border last:border-0">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function Card({ title, children, className="" }) {
  return (
    <div className={cx("rounded-2xl border border-border bg-surface-alt/40 p-6", className)}>
      {title && <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{title}</p>}
      {children}
    </div>
  );
}

// ---------- Logo ----------
function Logo({ small }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/30">
        <Icon d={I.zap.props.children} width="16" height="16"/>
      </div>
      {!small && <span className="font-bold text-foreground tracking-tight">scaffold/ui</span>}
    </div>
  );
}

// =============================================================
//  Demo sections
// =============================================================
function IntroSection() {
  return (
    <Section id="intro" title="12 atómicos · 3 de datos · 6 de feedback · 6 moléculas PWA">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Next.js 15", icon: I.zap },
          { label: "React 19",   icon: I.layers },
          { label: "Tailwind v4",icon: I.edit },
          { label: "Framer Motion", icon: I.flag },
        ].map(b => (
          <div key={b.label} className="rounded-xl border border-border bg-surface p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5">
            <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">{b.icon}</span>
            <span className="text-sm font-semibold text-foreground">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          ["--color-primary",   "primary"],
          ["--color-accent",    "accent"],
          ["--color-success",   "success"],
          ["--color-danger",    "danger"],
          ["--color-foreground","foreground"],
        ].map(([v, name]) => (
          <div key={name} className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="h-16" style={{ background: `var(${v})` }}/>
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-foreground">{name}</p>
              <p className="text-[10px] text-muted font-mono">{v}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Índice por grupo — la librería tiene mitades bien distintas */}
      <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {GROUPS.map(g => {
          const t = GROUP_TONES[g.tone];
          return (
            <a key={g.id} href={`#${g.id}`}
              className={cx("group block rounded-2xl border p-5 transition-all hover:-translate-y-0.5", t.card, t.cardHover)}>
              <div className="flex items-center justify-between gap-3">
                <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", t.pill)}>
                  <span className={cx("w-1.5 h-1.5 rounded-full", t.dot)}/>
                  {g.kicker}
                </span>
                <span className={cx("transition-transform group-hover:translate-x-0.5", t.text)}>
                  {I.chevRight}
                </span>
              </div>
              <p className="mt-3 text-lg font-bold text-foreground">{g.label}</p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">{g.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {g.sections.map(s => (
                  <span key={s.id} className="rounded-md bg-surface border border-border px-2 py-1 text-[11px] font-medium text-muted">
                    {s.label}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}

function ButtonSection() {
  const [loading, setLoading] = useState(false);
  return (
    <Section id="button" title="Button" description="6 variantes · 4 tamaños · loading state · iconos · hover lift y tap scale.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Variantes">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>
        <Card title="Tamaños">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="secondary">{I.settings}</Button>
          </div>
        </Card>
        <Card title="Con iconos">
          <div className="flex flex-wrap gap-2">
            <Button leftIcon={I.plus}>Crear proyecto</Button>
            <Button variant="secondary" rightIcon={I.chevDown}>Filtros</Button>
            <Button variant="outline" leftIcon={I.github}>GitHub</Button>
          </div>
        </Card>
        <Card title="Loading">
          <div className="flex flex-wrap gap-2 items-center">
            <Button loading={loading} onClick={()=>{ setLoading(true); setTimeout(()=>setLoading(false), 1500); }}>
              {loading ? "Procesando…" : "Iniciar acción"}
            </Button>
            <Button variant="secondary" loading>Cargando</Button>
            <Button variant="success" disabled>Deshabilitado</Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function InputSection() {
  return (
    <Section id="input" title="Input" description="Floating label · estados focus/error con shake · iconos prefix/suffix · accent line con CSS variables.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Estados">
          <div className="space-y-4">
            <Input label="Nombre" hint="Aparece como label flotante."/>
            <Input label="Email" type="email" leftIcon={I.mail} hint="Con icono a la izquierda."/>
            <Input label="Contraseña" type="password" leftIcon={I.lock} rightIcon={I.eye} defaultValue="••••••••"/>
            <Input label="Email" type="email" leftIcon={I.mail} defaultValue="invalid-email" error="Formato de email inválido"/>
          </div>
        </Card>
        <Card title="Buscador">
          <div className="space-y-4">
            <Input placeholder="Buscar componentes…" leftIcon={I.search}/>
            <Input label="API Key" leftIcon={I.lock} defaultValue="sk_live_4242424242" hint="Privada. No la compartas."/>
            <Input label="Username" leftIcon={I.user} placeholder="@usuario"/>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function TextareaSection() {
  return (
    <Section id="textarea" title="Textarea" description="Auto-resize hasta 280px · contador animado · floating label.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Auto-resize">
          <Textarea label="Descripción" hint="Crece a medida que escribes."/>
        </Card>
        <Card title="Con contador">
          <Textarea label="Bio" maxLength={140} showCount defaultValue="Diseñador, dev y curioso."/>
        </Card>
      </div>
    </Section>
  );
}

function SelectSection() {
  const opts = [
    { value: "react", label: "React", icon: I.layers },
    { value: "vue",   label: "Vue",   icon: I.layers },
    { value: "svelte",label: "Svelte",icon: I.layers },
    { value: "solid", label: "SolidJS",icon: I.layers },
    { value: "qwik",  label: "Qwik",  icon: I.layers },
  ];
  return (
    <Section id="select" title="Select" description="Dropdown custom con stagger animation, check del activo y cierre por outside-click + Escape.">
      <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
        <Card title="Por defecto">
          <Select options={opts} label="Framework" placeholder="Elige tu framework"/>
        </Card>
        <Card title="Con valor inicial">
          <Select options={opts} label="Framework" defaultValue="react"/>
        </Card>
      </div>
    </Section>
  );
}

function DropdownSection() {
  return (
    <Section id="dropdown" title="Dropdown" description="Menú contextual con scale-in y stagger. Soporta iconos, shortcuts, dividers y acciones destructivas.">
      <Card>
        <div className="flex flex-wrap gap-4">
          <Dropdown
            trigger={<Button variant="secondary" rightIcon={I.chevDown}>Acciones</Button>}
            items={[
              { label: "Editar",    icon: I.edit,  shortcut: "⌘E" },
              { label: "Duplicar",  icon: I.copy,  shortcut: "⌘D" },
              { label: "Compartir", icon: I.user,  shortcut: "⌘⇧S" },
              { divider: true },
              { label: "Eliminar",  icon: I.trash, destructive: true, shortcut: "⌫" },
            ]}
          />
          <Dropdown align="start"
            trigger={<Button variant="ghost" size="icon">{I.more}</Button>}
            items={[
              { label: "Configuración", icon: I.settings },
              { label: "Notificaciones", icon: I.bell },
              { divider: true },
              { label: "Cerrar sesión", icon: I.lock, destructive: true },
            ]}
          />
        </div>
      </Card>
    </Section>
  );
}

function SpinnerSection() {
  return (
    <Section id="spinner" title="Spinner" description="4 variantes: ring (svg rot), dots (bounce stagger), pulse (ondas concéntricas) y bars.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          ["ring",  "Ring"],
          ["dots",  "Dots"],
          ["pulse", "Pulse"],
          ["bars",  "Bars"],
        ].map(([v, name]) => (
          <Card key={v} title={name}>
            <div className="flex items-center justify-around gap-3">
              <Spinner variant={v} size="sm"/>
              <Spinner variant={v} size="md"/>
              <Spinner variant={v} size="lg"/>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ToastSection() {
  const { toast } = useToast();
  return (
    <Section id="toast" title="Toast" description="Provider + hook useToast(). Stack en top-right, slide+spring, barra de progreso, auto-dismiss y pausa en hover.">
      <Card>
        <div className="flex flex-wrap gap-2">
          <Button variant="success" leftIcon={I.check} onClick={()=>toast({ variant:"success", title:"¡Cambios guardados!", description:"Tu perfil fue actualizado." })}>Éxito</Button>
          <Button variant="danger" onClick={()=>toast({ variant:"error", title:"Algo falló", description:"No pudimos conectar con el servidor." })}>Error</Button>
          <Button variant="secondary" onClick={()=>toast({ variant:"warning", title:"Atención", description:"Tu sesión expira en 2 minutos." })}>Warning</Button>
          <Button variant="outline" onClick={()=>toast({ variant:"info", title:"Nuevo mensaje", description:"Tienes una notificación sin leer." })}>Info</Button>
        </div>
      </Card>
    </Section>
  );
}

function ModalSection() {
  const [open, setOpen] = useState(false);
  return (
    <Section id="modal" title="Modal" description="Backdrop con blur, body lock, cerrado con Escape o click fuera, scale+fade del diálogo. 5 tamaños.">
      <Card>
        <Button onClick={()=>setOpen(true)} leftIcon={I.layers}>Abrir modal</Button>
      </Card>
      <Modal
        open={open} onClose={()=>setOpen(false)}
        title="Confirmar publicación"
        description="¿Estás seguro de publicar este proyecto? Será visible para todos los miembros del equipo."
        size="md"
        footer={<>
          <Button variant="ghost" onClick={()=>setOpen(false)}>Cancelar</Button>
          <Button variant="primary" leftIcon={I.check} onClick={()=>setOpen(false)}>Publicar</Button>
        </>}
      >
        <div className="rounded-xl border border-border bg-surface-alt p-4 text-sm text-muted leading-relaxed">
          <p><strong className="text-foreground">Proyecto:</strong> scaffolding/ui</p>
          <p className="mt-1"><strong className="text-foreground">Visibilidad:</strong> Equipo (12 miembros)</p>
          <p className="mt-1"><strong className="text-foreground">Versión:</strong> 1.0.0</p>
        </div>
      </Modal>
    </Section>
  );
}

function BottomSheetSection() {
  const [size, setSize] = useState("md");
  const [open, setOpen] = useState(false);
  const [snapOpen, setSnapOpen] = useState(false);
  const sizes = ["auto", "xs", "sm", "md", "lg", "xl", "full"];

  return (
    <Section id="sheet" title="BottomSheet" description="7 alturas predefinidas + snap points arrastrables. Drag para cerrar, handle, header/footer fijos y contenido scrolleable. En desktop se convierte en tarjeta flotante.">
      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="space-y-4">
          <Card title="Altura">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Elegí un tamaño y abrilo en el dispositivo. <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">auto</code> se ajusta al contenido (tope 85dvh); el resto son fracciones de la pantalla.
            </p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <button key={s} onClick={()=>{ setSize(s); setSnapOpen(false); setOpen(true); }}
                  className={cx(
                    "h-9 px-3.5 rounded-lg text-xs font-semibold transition-all active:scale-95 border",
                    size === s && open
                      ? "bg-primary text-white border-primary shadow-sm shadow-primary/30"
                      : "bg-surface text-foreground border-border hover:bg-surface-alt"
                  )}>
                  {s}
                  <span className="ml-1.5 font-mono text-[10px] opacity-60">{SHEET_SIZES[s].label}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Snap points">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Con <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">snapPoints={"{[0.35, 0.65, 0.92]}"}</code> el usuario
              arrastra el handle entre alturas. Desde el punto más bajo, arrastrar hacia abajo cierra.
            </p>
            <Button onClick={()=>{ setOpen(false); setSnapOpen(true); }} leftIcon={I.layers}>Abrir con snaps</Button>
          </Card>

          <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Uso:</p>
            <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`<BottomSheet
  open={open} onClose={() => setOpen(false)}
  size="md"                 // auto | xs | sm | md | lg | xl | full
  title="Elegí una opción"
  footer={<Button full>Confirmar</Button>}
>
  …contenido scrolleable…
</BottomSheet>

// o con alturas arrastrables:
<BottomSheet snapPoints={[0.35, 0.65, 0.92]} defaultSnap={0} … />`}</pre>
          </div>
        </div>

        {/* device mock */}
        <div className="flex justify-center lg:sticky lg:top-24">
          <div className="relative w-[300px] h-[600px] rounded-[40px] bg-surface border-[10px] border-foreground/90 overflow-hidden shadow-2xl shadow-black/20">
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-6 pb-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Vista previa</p>
                <p className="text-lg font-bold text-foreground mt-0.5">Mi app</p>
              </div>
              <div className="flex-1 px-5 space-y-2.5 overflow-hidden">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-surface-alt border border-border flex items-center px-3 gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10"/>
                    <span className="flex-1 space-y-1.5">
                      <span className="block h-2 rounded bg-border" style={{ width: `${55 + i*5}%` }}/>
                      <span className="block h-2 rounded bg-border/60 w-1/3"/>
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <button onClick={()=>{ setSnapOpen(false); setOpen(true); }}
                  className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold active:scale-95 transition-transform">
                  Abrir sheet ({size})
                </button>
              </div>
            </div>

            <PreviewBottomSheet
              open={open} onClose={()=>setOpen(false)} size={size}
              title={`Sheet · ${size}`}
              description={`Altura ${SHEET_SIZES[size].label}. Arrastrá el handle hacia abajo para cerrar.`}
              showClose
              footer={
                <button onClick={()=>setOpen(false)}
                  className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold active:scale-95 transition-transform">
                  Confirmar
                </button>
              }
            >
              <div className="space-y-2 py-1">
                {["Compartir enlace","Duplicar","Mover a carpeta","Renombrar","Archivar","Ver detalles","Exportar PDF","Eliminar"].map((o,i) => (
                  <div key={o} className={cx(
                    "flex items-center gap-3 h-11 px-3 rounded-xl border border-border",
                    i === 7 ? "text-danger" : "text-foreground"
                  )}>
                    <span className={cx("w-7 h-7 rounded-lg flex items-center justify-center", i===7 ? "bg-danger/10" : "bg-surface-alt")}/>
                    <span className="text-sm font-medium">{o}</span>
                  </div>
                ))}
              </div>
            </PreviewBottomSheet>

            <PreviewBottomSheet
              open={snapOpen} onClose={()=>setSnapOpen(false)}
              snapPoints={[0.35, 0.65, 0.92]} defaultSnap={0}
              title="Snap points"
              description="Arrastrá el handle: 35% → 65% → 92%."
            >
              <div className="space-y-2 py-1">
                {Array.from({length:14}).map((_,i) => (
                  <div key={i} className="h-12 rounded-xl bg-surface-alt border border-border flex items-center px-3">
                    <span className="text-xs text-muted font-mono">item {String(i+1).padStart(2,"0")}</span>
                  </div>
                ))}
              </div>
            </PreviewBottomSheet>
          </div>
        </div>
      </div>
    </Section>
  );
}

function PwaMoleculesSection() {
  const { toast } = useToast();
  const [net, setNet] = useState("offline");
  const [showUpdate, setShowUpdate] = useState(false);
  const [notif, setNotif] = useState("default");

  const statusRows = [
    { label: "Instalación",     value: "Instalada",         tone: "ok" },
    { label: "Conexión",        value: "Online · 4g",       tone: "ok" },
    { label: "Service worker",  value: "Actualización lista", tone: "warn" },
    { label: "Notificaciones",  value: "Sin definir",       tone: "warn" },
    { label: "Plataforma",      value: "Android",           tone: "off" },
  ];

  return (
    <Section id="pwamol" title="PWA Molecules" description="Estado de conectividad, actualización de service worker, opt-in de notificaciones, botón de instalación embebible y panel de diagnóstico.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="OfflineBanner">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Aparece solo al cortarse internet, confirma en verde al reconectar y avisa si la conexión es lenta (Network Information API).
          </p>
          <div className="rounded-xl border border-border overflow-hidden mb-3">
            <PwaOfflineBanner state={net}/>
            <div className="h-16 bg-surface-alt/40"/>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["offline","Offline"],["back","Reconectado"],["slow","Lenta"]].map(([k,l]) => (
              <button key={k} onClick={()=>setNet(k)}
                className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  net===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                {l}
              </button>
            ))}
          </div>
        </Card>

        <Card title="UpdatePrompt">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Detecta el service worker en <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">waiting</code>,
            envía <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">SKIP_WAITING</code> y recarga.
          </p>
          <div className="mb-3">
            <PwaUpdatePrompt floating={false}
              onUpdate={()=>toast({ title:"App actualizada", description:"Recargando con la última versión.", variant:"success" })}
              onDismiss={()=>toast({ title:"Se te avisará más tarde", variant:"info" })}/>
          </div>
          <Button variant="secondary" size="sm" onClick={()=>setShowUpdate(true)} leftIcon={I.plus}>Ver flotante</Button>
        </Card>

        <Card title="NotificationOptIn">
          <p className="text-sm text-muted leading-relaxed mb-4">
            No pide permiso al cargar: explica el valor y pide en un gesto. Maneja bloqueado y el caso iOS (requiere PWA instalada).
          </p>
          <div className="mb-3">
            <PwaNotificationOptIn status={notif}
              onAsk={()=>{ setNotif("granted"); toast({ title:"Notificaciones activadas", variant:"success" }); }}
              onDismiss={()=>toast({ title:"Descartado", variant:"info" })}/>
          </div>
          <div className="flex flex-wrap gap-2">
            {[["default","Sin definir"],["denied","Bloqueadas"],["ios","iOS sin instalar"]].map(([k,l]) => (
              <button key={k} onClick={()=>setNotif(k)}
                className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  notif===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                {l}
              </button>
            ))}
          </div>
        </Card>

        <Card title="PwaStatus">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Panel de diagnóstico para una pantalla de Ajustes: instalación, conexión, service worker, notificaciones y plataforma.
          </p>
          <PwaStatusPanel rows={statusRows}/>
        </Card>

        <Card title="InstallButton" className="md:col-span-2">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Botón embebible (header, ajustes, onboarding) que no interrumpe. Se adapta solo: instalable, ya instalada, o iOS con instrucciones.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PwaInstallButton state="available"/>
            <PwaInstallButton state="ios" variant="outline"/>
            <PwaInstallButton state="installed"/>
            <PwaInstallButton state="available" size="sm" variant="ghost"/>
            <PwaInstallButton state="available" size="lg"/>
          </div>
        </Card>
      </div>

      {showUpdate && (
        <PwaUpdatePrompt
          onUpdate={()=>{ setShowUpdate(false); toast({ title:"App actualizada", variant:"success" }); }}
          onDismiss={()=>setShowUpdate(false)}/>
      )}
    </Section>
  );
}

function SplashSection() {
  const [variant, setVariant] = useState("fade");
  const [bg, setBg] = useState("surface");
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [runId, setRunId] = useState(0);

  // simula useSplash(): duración mínima + progreso
  useEffect(() => {
    if (!visible) return;
    const start = Date.now();
    const dur = 2200;
    let raf;
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVisible(false);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, runId]);

  const play = (v) => {
    setVariant(v ?? variant);
    setProgress(0);
    setRunId(i => i + 1);
    setVisible(true);
  };

  return (
    <Section id="splash" title="SplashScreen" description="6 estilos de animación con icono, nombre, tagline y versión. useSplash() garantiza una duración mínima, espera las fuentes o cualquier promesa (sesión, primer fetch) y expone el progreso.">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          <Card title="Estilo de animación">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Cada variante define su entrada <em>y</em> su salida. Tocá una para reproducirla en el dispositivo.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {SPLASH_VARIANTS.map(v => (
                <button key={v.id} onClick={()=>play(v.id)}
                  className={cx(
                    "text-left rounded-xl border p-3 transition-all active:scale-[0.98]",
                    variant === v.id
                      ? "border-primary bg-primary/[0.06]"
                      : "border-border bg-surface hover:bg-surface-alt"
                  )}>
                  <span className="flex items-center gap-2">
                    <span className={cx("w-1.5 h-1.5 rounded-full", variant === v.id ? "bg-primary" : "bg-muted/40")}/>
                    <span className="text-sm font-semibold text-foreground">{v.label}</span>
                  </span>
                  <span className="block text-[11px] text-muted mt-1 pl-3.5">{v.hint}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Fondo">
            <div className="flex flex-wrap gap-2">
              {[["surface","Tema"],["brand","Marca (gradiente)"],["dark","Oscuro"]].map(([k,l]) => (
                <button key={k} onClick={()=>{ setBg(k); play(); }}
                  className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    bg===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                  {l}
                </button>
              ))}
            </div>
          </Card>

          <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Uso:</p>
            <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`const { visible, progress } = useSplash({
  minDuration: 1400,          // no menos que esto
  until: () => loadSession(),  // …y esperá esta promesa
  waitForFonts: true,
  oncePerSession: true,        // opcional
});

<SplashScreen
  visible={visible}
  progress={progress}          // lo usa variant="bars"
  variant="zoom"               // fade | pulse | orbit | bars | zoom | wipe
  background="brand"           // surface | brand | dark | CSS custom
  appName="Scaffolding"
  tagline="Componentes listos para producción"
  version="1.4.0"
  footnote="build 2f9a1c"
  icon={<img src="/icon.svg" alt=""/>}
/>`}</pre>
          </div>
        </div>

        {/* device mock */}
        <div className="flex flex-col items-center gap-3 lg:sticky lg:top-24">
          <div className="relative w-[280px] h-[560px] rounded-[40px] bg-surface border-[10px] border-foreground/90 overflow-hidden shadow-2xl shadow-black/20">
            {/* app "real" debajo del splash */}
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-7 pb-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Buenos días</p>
                <p className="text-xl font-bold text-foreground mt-0.5">Tu app</p>
              </div>
              <div className="flex-1 px-5 space-y-2.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-surface-alt border border-border flex items-center px-3 gap-3">
                    <span className="w-9 h-9 rounded-lg bg-primary/10 shrink-0"/>
                    <span className="flex-1 space-y-1.5">
                      <span className="block h-2 rounded bg-border" style={{ width: `${50+i*7}%` }}/>
                      <span className="block h-2 rounded bg-border/60 w-1/3"/>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <PreviewSplash
              visible={visible} variant={variant} background={bg} progress={progress}
              appName="Scaffolding" tagline="Componentes listos para producción"
              version="1.4.0" footnote="build 2f9a1c"
            />
          </div>

          <button onClick={()=>play()}
            className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all inline-flex items-center gap-2">
            {I.zap} Reproducir «{SPLASH_VARIANTS.find(v=>v.id===variant)?.label}»
          </button>
        </div>
      </div>
    </Section>
  );
}

// =============================================================
//  Datos & grillas
// =============================================================
const DEMO_PEOPLE = [
  { id:"1", name:"Lucía Marín",     email:"lucia@scaffold.io",  role:"Admin",    team:"Producto",   status:"activo",    mrr:2400, seats:12, joined:"2023-04-12" },
  { id:"2", name:"Bruno Ferrer",    email:"bruno@scaffold.io",  role:"Editor",   team:"Ingeniería", status:"activo",    mrr:1890, seats:8,  joined:"2023-06-02" },
  { id:"3", name:"Camila Ortiz",    email:"camila@scaffold.io", role:"Viewer",   team:"Diseño",     status:"invitado",  mrr:0,    seats:1,  joined:"2024-01-19" },
  { id:"4", name:"Diego Sosa",      email:"diego@scaffold.io",  role:"Editor",   team:"Ingeniería", status:"activo",    mrr:3200, seats:24, joined:"2022-11-30" },
  { id:"5", name:"Elena Ruiz",      email:"elena@scaffold.io",  role:"Admin",    team:"Producto",   status:"suspendido",mrr:540,  seats:3,  joined:"2023-09-08" },
  { id:"6", name:"Facundo Vera",    email:"facu@scaffold.io",   role:"Viewer",   team:"Marketing",  status:"activo",    mrr:1120, seats:6,  joined:"2024-03-21" },
  { id:"7", name:"Gabriela Núñez",  email:"gabi@scaffold.io",   role:"Editor",   team:"Diseño",     status:"activo",    mrr:2750, seats:15, joined:"2022-07-14" },
  { id:"8", name:"Hernán Paz",      email:"hernan@scaffold.io", role:"Viewer",   team:"Soporte",    status:"invitado",  mrr:0,    seats:1,  joined:"2024-05-05" },
  { id:"9", name:"Irene Costa",     email:"irene@scaffold.io",  role:"Admin",    team:"Ingeniería", status:"activo",    mrr:4100, seats:32, joined:"2021-10-01" },
  { id:"10",name:"Joaquín Aliaga",  email:"joaco@scaffold.io",  role:"Editor",   team:"Marketing",  status:"suspendido",mrr:320,  seats:2,  joined:"2023-12-11" },
  { id:"11",name:"Karina Vidal",    email:"kari@scaffold.io",   role:"Viewer",   team:"Soporte",    status:"activo",    mrr:960,  seats:5,  joined:"2024-02-27" },
  { id:"12",name:"Leandro Iglesias",email:"lean@scaffold.io",   role:"Editor",   team:"Producto",   status:"activo",    mrr:1650, seats:9,  joined:"2023-03-16" },
];

const STATUS_TONE = {
  activo:     "bg-success/12 text-success",
  invitado:   "bg-accent/12 text-accent",
  suspendido: "bg-danger/12 text-danger",
};

function DataTableSection() {
  const { toast } = useToast();
  const [density, setDensity] = useState("normal");

  const money = n => n === 0 ? "—" : `$${n.toLocaleString("es-AR")}`;

  const columns = [
    {
      key:"name", header:"Persona", width:"minmax(200px, 1.4fr)",
      render: r => (
        <span className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent shrink-0 flex items-center justify-center text-white text-[11px] font-bold">
            {r.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold text-foreground truncate">{r.name}</span>
            <span className="block text-[11px] text-muted truncate">{r.email}</span>
          </span>
        </span>
      ),
    },
    { key:"role", header:"Rol", width:"110px" },
    { key:"team", header:"Equipo", width:"130px", hideOnMobile:true },
    {
      key:"status", header:"Estado", width:"120px",
      render: r => (
        <span className={cx("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", STATUS_TONE[r.status])}>
          {r.status}
        </span>
      ),
    },
    { key:"seats", header:"Asientos", width:"100px", align:"right", hideOnMobile:true },
    { key:"mrr", header:"MRR", width:"110px", align:"right", render: r => (
      <span className={cx("font-semibold tabular-nums", r.mrr===0 ? "text-muted" : "text-foreground")}>{money(r.mrr)}</span>
    )},
  ];

  return (
    <Section id="datatable" title="DataTable" description="Orden por columna, búsqueda global, selección múltiple con estado indeterminado, paginado, header fijo, celdas con render custom, densidad y acciones por fila.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-1">Densidad</span>
        {[["compact","Compacta"],["normal","Normal"],["comfortable","Cómoda"]].map(([k,l]) => (
          <button key={k} onClick={()=>setDensity(k)}
            className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95",
              density===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
            {l}
          </button>
        ))}
      </div>

      <PreviewDataTable
        columns={columns} rows={DEMO_PEOPLE} rowKey={r=>r.id}
        selectable searchable pageSize={6} density={density}
        searchPlaceholder="Buscar por nombre, email, equipo…"
        onRowClick={r=>toast({ title:r.name, description:`${r.role} · ${r.team}`, variant:"info" })}
        toolbar={<Button size="sm" variant="secondary" leftIcon={I.plus}>Invitar</Button>}
        rowActions={r => (
          <Dropdown
            trigger={<button className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">⋯</button>}
            items={[
              { label:"Ver perfil", icon:I.user, onClick:()=>toast({ title:`Perfil de ${r.name}`, variant:"info" }) },
              { label:"Editar", icon:I.edit, onClick:()=>toast({ title:"Editando…", variant:"info" }) },
              { divider:true },
              { label:"Eliminar", icon:I.trash, destructive:true, onClick:()=>toast({ title:`${r.name} eliminada`, variant:"error" }) },
            ]}
          />
        )}
      />

      <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-foreground mb-2">Uso:</p>
        <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`const columns: Column<Person>[] = [
  { key: "name", header: "Persona", width: "minmax(200px,1.4fr)",
    render: r => <PersonCell row={r}/> },
  { key: "mrr", header: "MRR", align: "right", sortValue: r => r.mrr },
];

<DataTable
  columns={columns} rows={people} rowKey={r => r.id}
  selectable searchable pageSize={6}
  density="normal" stickyHeader maxHeight="420px"
  onRowClick={openDetail}
  rowActions={r => <RowMenu row={r}/>}
/>`}</pre>
      </div>
    </Section>
  );
}

function SpreadsheetSection() {
  const initial = {
    A1:"Mes",     B1:"Ingresos", C1:"Gastos", D1:"Margen",       E1:"%",
    A2:"Enero",   B2:"18400",    C2:"11200",  D2:"=B2-C2",       E2:"=ROUND(D2/B2*100;1)",
    A3:"Febrero", B3:"21750",    C3:"12900",  D3:"=B3-C3",       E3:"=ROUND(D3/B3*100;1)",
    A4:"Marzo",   B4:"19980",    C4:"13400",  D4:"=B4-C4",       E4:"=ROUND(D4/B4*100;1)",
    A5:"Abril",   B5:"24310",    C5:"14150",  D5:"=B5-C5",       E5:"=ROUND(D5/B5*100;1)",
    A6:"Mayo",    B6:"26840",    C6:"15020",  D6:"=B6-C6",       E6:"=ROUND(D6/B6*100;1)",
    A7:"Total",   B7:"=SUM(B2:B6)", C7:"=SUM(C2:C6)", D7:"=SUM(D2:D6)", E7:"=ROUND(D7/B7*100;1)",
    A9:"Promedio", B9:"=AVERAGE(B2:B6)", C9:"=AVERAGE(C2:C6)",
    A10:"Máximo",  B10:"=MAX(B2:B6)",    C10:"=MAX(C2:C6)",
  };

  const shortcuts = [
    ["Flechas", "Mover el cursor"],
    ["⇧ + flechas", "Extender la selección"],
    ["⌘/Ctrl + flechas", "Ir al extremo"],
    ["Tab / ⇧Tab", "Celda siguiente / anterior"],
    ["Enter / F2", "Editar la celda"],
    ["Escribir", "Reemplazar contenido"],
    ["Esc", "Cancelar edición"],
    ["Delete", "Limpiar selección"],
    ["⌘/Ctrl + C / X / V", "Copiar / cortar / pegar (TSV)"],
    ["⌘/Ctrl + Z / ⇧Z", "Deshacer / rehacer"],
    ["⌘/Ctrl + A", "Seleccionar todo"],
    ["Home / End", "Inicio / fin de fila"],
  ];

  return (
    <Section id="spreadsheet" title="Spreadsheet" description="Hoja de cálculo editable con fórmulas, rangos, undo/redo, copiar y pegar en TSV (compatible con Excel y Google Sheets) y barra de estado con suma y promedio de la selección.">
      <PreviewSpreadsheet rows={16} cols={7} initial={initial} height="420px" headerRow/>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <Card title="Atajos de teclado">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Hacé click en una celda y probá. El foco vive en la grilla, así que los atajos funcionan sin abrir nada.
          </p>
          <dl className="divide-y divide-border rounded-xl border border-border overflow-hidden">
            {shortcuts.map(([k,v]) => (
              <div key={k} className="px-3 py-2 flex items-center justify-between gap-4 bg-surface">
                <dt><kbd className="font-mono text-[11px] font-semibold bg-surface-alt border border-border rounded px-1.5 py-0.5 text-foreground">{k}</kbd></dt>
                <dd className="text-[11px] text-muted text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Fórmulas">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Evaluador propio, sin <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">eval()</code>:
            operadores <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">+ - * / ^ ( )</code>,
            referencias, rangos y detección de referencias circulares.
          </p>
          <div className="space-y-2">
            {[
              ["=B2-C2", "aritmética con referencias"],
              ["=SUM(B2:B6)", "suma de un rango"],
              ["=AVERAGE(B2:B6)", "también AVG"],
              ["=MIN / MAX / COUNT", "agregaciones"],
              ["=ROUND(D2/B2*100;1)", "anidadas, con decimales"],
              ["=ABS(C2-B2)", "valor absoluto"],
            ].map(([f,d]) => (
              <div key={f} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <code className="font-mono text-[11px] font-semibold text-primary">{f}</code>
                <span className="text-[11px] text-muted">{d}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            Errores tipados como en Excel: <code className="font-mono">#DIV/0!</code>, <code className="font-mono">#NAME?</code>, <code className="font-mono">#REF!</code>, <code className="font-mono">#CIRC!</code>.
          </p>
        </Card>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-foreground mb-2">Uso:</p>
        <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`<Spreadsheet
  rows={24} cols={8} height="420px" headerRow
  initial={{ A1: "Mes", B1: "Ingresos", B7: "=SUM(B2:B6)" }}
  onChange={grid => save(grid)}
/>

// …o sólo el motor, con tu propia UI
const sheet = useSpreadsheet({ rows: 50, cols: 12 });
sheet.setCell(0, 0, "=SUM(B1:B10)");
evaluateCell(sheet.grid, "A1");   // "1234"`}</pre>
      </div>
    </Section>
  );
}

function CalendarSection() {
  const { toast } = useToast();
  const [maxPerDay, setMaxPerDay] = useState(3);

  const events = useMemo(() => {
    const now = new Date();
    const d = (day, h = 9, m = 0) => new Date(now.getFullYear(), now.getMonth(), day, h, m);
    return [
      { id:"e1",  title:"Daily",              start:d(3, 9, 30),  color:"muted" },
      { id:"e2",  title:"Review de diseño",    start:d(3, 14, 0),  color:"accent" },
      { id:"e3",  title:"1:1 con Lucía",      start:d(3, 16, 30),  color:"primary" },
      { id:"e4",  title:"Retro de sprint",    start:d(3, 18, 0),  color:"success" },
      { id:"e5",  title:"Sprint 24",          start:d(5), end:d(9), allDay:true, color:"primary" },
      { id:"e6",  title:"Demo con cliente",   start:d(7, 11, 0),  color:"accent" },
      { id:"e7",  title:"Deploy a producción",start:d(9, 20, 0),  color:"danger" },
      { id:"e8",  title:"Feriado",            start:d(12), allDay:true, color:"danger" },
      { id:"e9",  title:"Planning",           start:d(15, 10, 0), color:"primary" },
      { id:"e10", title:"Workshop de research", start:d(15, 15, 0), color:"success" },
      { id:"e11", title:"Onboarding Facundo", start:d(18, 9, 0),  color:"success" },
      { id:"e12", title:"QBR",                start:d(22, 12, 0), color:"accent" },
      { id:"e13", title:"Congreso",           start:d(24), end:d(26), allDay:true, color:"accent" },
      { id:"e14", title:"Cierre de mes",      start:d(28, 17, 0), color:"danger" },
    ];
  }, []);

  return (
    <Section id="calendar" title="CalendarGrid" description="Grilla mensual de 6 semanas con eventos por día, multi-día y todo-el-día, colapso «+N más», semana que arranca lunes o domingo, día de hoy marcado y navegación entre meses.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-1">Eventos por celda</span>
        {[2,3,4].map(n => (
          <button key={n} onClick={()=>setMaxPerDay(n)}
            className={cx("h-8 w-8 rounded-lg text-xs font-semibold border transition-all active:scale-95",
              maxPerDay===n ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
            {n}
          </button>
        ))}
      </div>

      <PreviewCalendar
        events={events} maxPerDay={maxPerDay} cellMinHeight={104}
        onDayClick={d=>toast({ title:new Intl.DateTimeFormat("es-AR",{ dateStyle:"full" }).format(d), variant:"info" })}
        onEventClick={ev=>toast({
          title:ev.title,
          description: ev.allDay ? "Todo el día" : new Intl.DateTimeFormat("es-AR",{ dateStyle:"medium", timeStyle:"short" }).format(ev.start),
          variant:"success",
        })}
      />

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <Card title="Tokens de evento">
          <div className="space-y-2">
            {[
              ["primary","Con hora — chip suave"],
              ["accent","Categoría secundaria"],
              ["success","Confirmado"],
              ["danger","Bloqueante o feriado"],
              ["muted","Rutina de baja prioridad"],
            ].map(([c,d]) => (
              <div key={c} className="flex items-center gap-3">
                <span className={cx("rounded-md px-1.5 py-1 text-[11px] font-medium", CAL_COLORS[c].chip)}>
                  <span className="opacity-70 mr-1 tabular-nums">09:30</span>Evento
                </span>
                <span className={cx("rounded-md px-1.5 py-1 text-[11px] font-medium", CAL_COLORS[c].solid)}>Todo el día</span>
                <span className="text-[11px] text-muted">{d}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
          <p className="font-semibold text-foreground mb-2">Uso:</p>
          <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`const events: CalendarEvent[] = [
  { id: "1", title: "Planning", start: new Date(2026, 6, 15, 10) },
  { id: "2", title: "Sprint 24", start: from, end: to,
    allDay: true, color: "primary" },
];

<CalendarGrid
  events={events}
  weekStartsOn={1}        // 1 = lunes, 0 = domingo
  maxPerDay={3}
  cellMinHeight={104}
  onDayClick={openDay}
  onEventClick={openEvent}
/>`}</pre>
        </div>
      </div>
    </Section>
  );
}

// =============================================================
//  Interacción & feedback
// =============================================================
function BreadcrumbsSection() {
  const { toast } = useToast();
  const [depth, setDepth] = useState(6);
  const all = [
    { label:"Inicio", icon:I.home }, { label:"Proyectos" }, { label:"Scaffolding" },
    { label:"Componentes" }, { label:"Interacción" }, { label:"Breadcrumbs" },
    { label:"Detalle" }, { label:"Historial" },
  ];
  const items = all.slice(0, depth);

  return (
    <Section id="breadcrumbs" title="Breadcrumbs" description="Ruta de navegación con colapso automático: cuando hay más niveles que el máximo, deja el primero y los dos últimos y agrupa el resto en «…» (con tooltip nativo).">
      <div className="space-y-4">
        <Card title="Colapso automático">
          <div className="rounded-xl border border-border bg-surface px-4 py-3 mb-4 overflow-hidden">
            <PreviewBreadcrumbs items={items} maxItems={4}
              onNavigate={it=>toast({ title:`Ir a ${it.label}`, variant:"info" })}/>
          </div>
          <label className="block">
            <span className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
              <span>Niveles</span>
              <span className="font-mono text-muted">{depth}</span>
            </span>
            <input type="range" min="2" max="8" value={depth} onChange={e=>setDepth(+e.target.value)} className="w-full accent-primary"/>
          </label>
          <p className="text-[11px] text-muted mt-2">
            Con <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">maxItems={"{4}"}</code>, a partir de 5 niveles aparece el «…».
          </p>
        </Card>

        <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
          <p className="font-semibold text-foreground mb-2">Uso:</p>
          <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`<Breadcrumbs
  items={[
    { label: "Inicio", href: "/", icon: <HomeIcon/> },
    { label: "Proyectos", href: "/proyectos" },
    { label: "Detalle" },          // el último es aria-current="page"
  ]}
  maxItems={4}
  onNavigate={(item, i) => router.push(item.href)}
/>`}</pre>
        </div>
      </div>
    </Section>
  );
}

function CheckboxSection() {
  const [simple, setSimple] = useState(true);
  const [perms, setPerms] = useState(["read"]);
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState(false);

  return (
    <Section id="checkbox" title="Checkbox" description="Check animado por trazo, estado indeterminado real (aria-checked=mixed), tres tamaños y tonos, descripción, error y grupo con «seleccionar todo» automático.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Tamaños y tonos">
          <div className="space-y-3">
            {["sm","md","lg"].map(s => (
              <PreviewCheckbox key={s} size={s} checked={simple} onChange={setSimple} label={`Tamaño ${s}`}/>
            ))}
            <div className="h-px bg-border"/>
            {[["primary","Primary"],["success","Success"],["danger","Danger"]].map(([t,l]) => (
              <PreviewCheckbox key={t} tone={t} checked onChange={()=>{}} label={l}/>
            ))}
          </div>
        </Card>

        <Card title="Grupo con «seleccionar todo»">
          <PreviewCheckboxGroup
            label="Permisos" selectAllLabel="Todos los permisos"
            value={perms} onChange={setPerms}
            options={[
              { value:"read",   label:"Lectura",     description:"Ver contenido y comentarios" },
              { value:"write",  label:"Escritura",   description:"Crear y editar documentos" },
              { value:"delete", label:"Eliminación", description:"Borrar de forma permanente" },
              { value:"admin",  label:"Administración", description:"Requiere plan Enterprise", disabled:true },
            ]}/>
          <p className="text-[11px] text-muted mt-3">
            La casilla superior queda en estado <b className="text-foreground">mixto</b> cuando hay selección parcial.
          </p>
        </Card>

        <Card title="Con error" className="md:col-span-2">
          <PreviewCheckbox checked={terms} onChange={v=>{ setTerms(v); setTouched(true); }}
            label="Acepto los términos y condiciones"
            description="Podés revisarlos en cualquier momento desde tu perfil."
            error={touched && !terms ? "Tenés que aceptar los términos para continuar" : undefined}/>
        </Card>
      </div>
    </Section>
  );
}

function CreditCardSection() {
  const [theme, setTheme] = useState("dark");
  const [masked, setMasked] = useState(false);

  const cards = [
    { data:{ number:"4539 1488 0343 6467", holder:"Lucía Marín", expiry:"08/29", cvc:"318", brand:"visa", label:"Crédito" } },
    { data:{ number:"5299 1234 5678 9010", holder:"Bruno Ferrer", expiry:"03/28", cvc:"902", brand:"mastercard", label:"Débito" } },
  ];

  return (
    <Section id="creditcard" title="Tarjeta de crédito volteable" description="Volteo 3D con perspectiva y backface oculta: frente con chip, número agrupado y marca; dorso con banda magnética y CVC. Tocá la tarjeta para voltearla.">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-1">Tema</span>
        {[["dark","Oscuro"],["brand","Marca"],["steel","Acero"]].map(([k,l]) => (
          <button key={k} onClick={()=>setTheme(k)}
            className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95",
              theme===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
            {l}
          </button>
        ))}
        <button onClick={()=>setMasked(m=>!m)}
          className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ml-2",
            masked ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
          Enmascarar número
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
        {cards.map((c,i) => (
          <PreviewCreditCard key={i} data={c.data} theme={theme} masked={masked}/>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-foreground mb-2">Uso:</p>
        <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`<CreditCard
  theme="brand"        // dark | brand | steel | cualquier CSS
  masked               // oculta todo menos los últimos 4
  data={{ number: "4539 1488 0343 6467", holder: "Lucía Marín",
          expiry: "08/29", cvc: "318", brand: "visa" }}
/>

// El contenedor 3D sirve para cualquier par de caras
<FlipCard axis="x" front={<Frente/>} back={<Dorso/>}/>

// Pila navegable de tarjetas
<CreditCardStack cards={[{ id: "1", data }, { id: "2", data }]}/>`}</pre>
      </div>
    </Section>
  );
}

function FabSection() {
  const { toast } = useToast();
  const scrollRef = useRef(null);
  const [extended, setExtended] = useState(false);

  return (
    <Section id="fab" title="Botón flotante" description="Se esconde al scrollear hacia abajo y vuelve al subir. Con acciones secundarias se convierte en speed dial: se abren en cascada con etiquetas y backdrop.">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-4">
          <Card title="Comportamiento">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Scrolleá la lista del teléfono: el botón se esconde al bajar y reaparece al subir.
              Tocalo para desplegar las acciones.
            </p>
            <button onClick={()=>setExtended(e=>!e)}
              className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                extended ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
              {extended ? "Extendido" : "Circular"}
            </button>
          </Card>

          <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Uso:</p>
            <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`<FloatingButton
  hideOnScroll                 // se esconde al bajar
  position="bottom-right"      // …-left | …-center
  extended label="Nuevo"       // con texto visible
  actions={[                   // convierte el FAB en speed dial
    { icon: <CamIcon/>,  label: "Foto",  onClick: shoot },
    { icon: <FileIcon/>, label: "Archivo", tone: "accent", onClick: pick },
  ]}
/>`}</pre>
          </div>
        </div>

        <div className="flex justify-center lg:sticky lg:top-24">
          <div className="relative w-[280px] h-[520px] rounded-[38px] bg-surface border-[9px] border-foreground/90 overflow-hidden shadow-2xl shadow-black/20">
            <div ref={scrollRef} className="absolute inset-0 overflow-y-auto">
              <div className="px-5 pt-7 pb-3 sticky top-0 bg-surface/90 backdrop-blur z-10">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Bandeja</p>
                <p className="text-xl font-bold text-foreground mt-0.5">Mensajes</p>
              </div>
              <div className="px-5 pb-8 space-y-2.5">
                {Array.from({length:16}).map((_,i) => (
                  <div key={i} className="h-16 rounded-xl bg-surface-alt border border-border flex items-center px-3 gap-3">
                    <span className="w-9 h-9 rounded-full bg-primary/10 shrink-0"/>
                    <span className="flex-1 space-y-1.5">
                      <span className="block h-2 rounded bg-border" style={{ width:`${45+((i*13)%45)}%` }}/>
                      <span className="block h-2 rounded bg-border/60 w-1/3"/>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <PreviewFab scrollRef={scrollRef} extended={extended} label="Nuevo"
              actions={[
                { icon:I.edit, label:"Escribir", onClick:()=>toast({ title:"Nuevo mensaje", variant:"info" }) },
                { icon:I.user, label:"Contacto", tone:"accent", onClick:()=>toast({ title:"Elegir contacto", variant:"info" }) },
                { icon:I.trash, label:"Vaciar", tone:"danger", onClick:()=>toast({ title:"Bandeja vaciada", variant:"error" }) },
              ]}/>
          </div>
        </div>
      </div>
    </Section>
  );
}

function StepperSection() {
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const [slow, setSlow] = useState(2);
  const [cart, setCart] = useState(0);

  // simula una llamada al servidor: sólo el botón tocado queda en spinner
  const persist = next => new Promise(r => setTimeout(()=>{ setSlow(next); r(); }, 900));

  return (
    <Section id="stepper" title="Stepper · AddButton" description="Cantidad con loading independiente en «+» y «−»: si onChange devuelve una promesa, sólo ese botón muestra spinner y el otro se bloquea. El número entra desde arriba o abajo según la dirección.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Con carga en el servidor">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Cada toque espera 900 ms. Fijate que el spinner aparece <b className="text-foreground">sólo en el botón que tocaste</b>.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <PreviewStepper value={slow} onChange={persist} min={0} max={10}/>
            <span className="text-xs text-muted">unidades: <b className="text-foreground tabular-nums">{slow}</b></span>
          </div>
        </Card>

        <Card title="Variantes y tamaños">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <PreviewStepper value={qty} onChange={setQty} size="sm" variant="solid"/>
              <span className="text-[11px] text-muted">sm · solid</span>
            </div>
            <div className="flex items-center gap-3">
              <PreviewStepper value={qty} onChange={setQty} size="md" variant="outline" unit="kg"/>
              <span className="text-[11px] text-muted">md · outline · unidad</span>
            </div>
            <div className="flex items-center gap-3">
              <PreviewStepper value={qty} onChange={setQty} size="lg" variant="pill"/>
              <span className="text-[11px] text-muted">lg · pill</span>
            </div>
          </div>
        </Card>

        <Card title="Colapsable (estilo carrito)">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Arranca como un «+» y se expande al primer toque; al volver a 0 se colapsa solo.
          </p>
          <div className="flex items-center gap-4">
            <PreviewStepper value={cart} onChange={setCart} collapsible min={0} max={9}/>
            <span className="text-xs text-muted">en el carrito: <b className="text-foreground tabular-nums">{cart}</b></span>
          </div>
        </Card>

        <Card title="AddButton">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Tres estados encadenados: idle → cargando → hecho, y vuelve solo.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PreviewAddButton size="sm" onAdd={()=>new Promise(r=>setTimeout(r,1100))}/>
            <PreviewAddButton onAdd={()=>new Promise(r=>setTimeout(r,1100))}
              label="Al carrito" addedLabel="¡Listo!"/>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function ProgressSection() {
  const [value, setValue] = useState(62);
  const [step, setStep] = useState(1);
  const steps = ["Carrito","Envío","Pago","Confirmación"];

  return (
    <Section id="progress" title="Progress" description="Barra continua, segmentada, rayada e indeterminada; anillo circular con contenido al centro; y progreso por pasos con conectores y check en los completados.">
      <div className="mb-5">
        <label className="block max-w-sm">
          <span className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
            <span>Valor</span><span className="font-mono text-muted tabular-nums">{value}%</span>
          </span>
          <input type="range" min="0" max="100" value={value} onChange={e=>setValue(+e.target.value)} className="w-full accent-primary"/>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card title="ProgressBar">
          <div className="space-y-5">
            <PreviewProgressBar value={value} label="Subiendo archivos" showValue/>
            <PreviewProgressBar value={value} tone="success" size="sm" striped label="Con rayado"/>
            <PreviewProgressBar value={value} tone="accent" segments={5} label="Segmentada (5 pasos)"/>
            <PreviewProgressBar tone="primary" size="xs" label="Indeterminada"/>
          </div>
        </Card>

        <Card title="ProgressRing">
          <div className="flex items-center justify-around flex-wrap gap-4">
            <PreviewProgressRing value={value}/>
            <PreviewProgressRing value={value} tone="success" size={88} thickness={9}>
              <span className="text-center leading-tight">
                <span className="block text-lg font-bold text-foreground tabular-nums">{Math.round(value*1.4)}</span>
                <span className="block text-[9px] uppercase tracking-wider text-muted">de 140</span>
              </span>
            </PreviewProgressRing>
            <PreviewProgressRing tone="accent" size={56} thickness={5} showValue={false}/>
          </div>
        </Card>

        <Card title="StepsProgress" className="md:col-span-2">
          <PreviewStepsProgress steps={steps} current={step}/>
          <div className="mt-5 flex items-center gap-2">
            <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
              className="h-8 px-3 rounded-lg text-xs font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt disabled:opacity-30 active:scale-95 transition-all">
              Anterior
            </button>
            <button onClick={()=>setStep(s=>Math.min(steps.length-1,s+1))} disabled={step===steps.length-1}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover disabled:opacity-30 active:scale-95 transition-all">
              Siguiente
            </button>
            <span className="text-[11px] text-muted ml-2">paso {step+1} de {steps.length}</span>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function SafeAreaSection() {
  const { toast } = useToast();
  const [device, setDevice] = useState("iphone");
  const [edges, setEdges] = useState(["top","bottom"]);
  const [gutter, setGutter] = useState(0);
  const [keyboard, setKeyboard] = useState(false);
  const [avoidKeyboard, setAvoidKeyboard] = useState(true);
  const [awake, setAwake] = useState(false);
  const wakeRef = useRef(null);

  const toggleEdge = (e) =>
    setEdges(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);

  const haptic = (name) => {
    if (!navigator.vibrate) {
      toast({ title: "Sin soporte de vibración", description: "iOS Safari no expone la Vibration API.", variant: "info" });
      return;
    }
    navigator.vibrate(HAPTIC_PATTERNS[name]);
    toast({ title: `haptic("${name}")`, variant: "success" });
  };

  const goFullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      toast({ title: "Fullscreen no disponible", description: "iPhone no soporta la Fullscreen API.", variant: "info" });
    }
  };

  const toggleWake = async () => {
    try {
      if (wakeRef.current) {
        await wakeRef.current.release();
        wakeRef.current = null; setAwake(false);
        toast({ title: "Wake lock liberado", variant: "info" });
        return;
      }
      const s = await navigator.wakeLock?.request("screen");
      if (!s) throw new Error("unsupported");
      wakeRef.current = s; setAwake(true);
      s.addEventListener("release", () => { setAwake(false); wakeRef.current = null; });
      toast({ title: "Pantalla encendida", description: "No se va a apagar mientras esté activo.", variant: "success" });
    } catch {
      toast({ title: "Wake Lock no soportado", variant: "info" });
    }
  };

  const edgeBtns = [["top","Arriba"],["bottom","Abajo"],["left","Izq"],["right","Der"]];
  const devices = [["iphone","iPhone"],["iphoneL","iPhone horiz."],["android","Android"],["flat","Sin insets"]];

  return (
    <Section id="safearea" title="Safe area · Native shell" description="<SafeArea/> respeta notch, dynamic island y home indicator; useImmersive() esconde la barra del navegador y sigue la altura real del viewport; useKeyboardInset() evita que el teclado tape las barras fijas; useHaptics() da feedback táctil con nombres semánticos.">
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="space-y-4">
          <Card title="<SafeArea/> · bordes">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Elegí qué bordes respeta el contenedor. En rojo las zonas inseguras del dispositivo;
              en azul el área segura donde vive tu UI.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {edgeBtns.map(([k,l]) => (
                <button key={k} onClick={()=>toggleEdge(k)}
                  className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    edges.includes(k) ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                  {l}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                <span>gutter extra</span>
                <span className="font-mono text-muted">{gutter}px</span>
              </span>
              <input type="range" min="0" max="24" value={gutter} onChange={e=>setGutter(+e.target.value)}
                className="w-full accent-primary"/>
            </label>
          </Card>

          <Card title="Dispositivo simulado">
            <div className="flex flex-wrap gap-2">
              {devices.map(([k,l]) => (
                <button key={k} onClick={()=>setDevice(k)}
                  className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    device===k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                  {l}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              En producción <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">useSafeArea()</code> lee
              las insets reales de <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">env(safe-area-inset-*)</code> y
              las publica como <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">--sa-top</code> …
            </p>
          </Card>

          <Card title="useKeyboardInset()">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Con <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">avoidKeyboard</code> el
              borde inferior suma la altura del teclado, así el CTA nunca queda tapado.
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={()=>setKeyboard(k=>!k)}
                className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  keyboard ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                {keyboard ? "Cerrar teclado" : "Abrir teclado"}
              </button>
              <button onClick={()=>setAvoidKeyboard(a=>!a)}
                className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  avoidKeyboard ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                avoidKeyboard: {avoidKeyboard ? "on" : "off"}
              </button>
            </div>
            <div className="mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Tu viewport real, ahora</p>
              <ViewportReadout/>
            </div>
            <p className="text-[11px] text-muted mt-3">
              Tocá este campo en un celular para ver moverse los valores:
            </p>
            <input placeholder="Escribí acá…"
              className="mt-2 w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-foreground placeholder:text-muted outline-none focus:border-primary transition-colors"/>
          </Card>

          <Card title="useImmersive() · useHaptics()">
            <p className="text-sm text-muted leading-relaxed mb-4">
              Esconder la barra del navegador, fullscreen, wake lock y feedback táctil.
              Estos botones ejecutan las APIs reales en tu dispositivo.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={()=>{ window.scrollTo(0,1); setTimeout(()=>window.scrollTo(0,0),60); toast({ title:"Barra del navegador colapsada", variant:"success" }); }}
                className="h-9 px-3.5 rounded-lg text-xs font-semibold bg-surface border border-border text-foreground hover:bg-surface-alt active:scale-95 transition-all">
                Esconder barra
              </button>
              <button onClick={goFullscreen}
                className="h-9 px-3.5 rounded-lg text-xs font-semibold bg-surface border border-border text-foreground hover:bg-surface-alt active:scale-95 transition-all">
                Fullscreen
              </button>
              <button onClick={toggleWake}
                className={cx("h-9 px-3.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  awake ? "bg-success/12 text-success border-success/30" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
                {awake ? "Wake lock activo" : "Mantener despierta"}
              </button>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Haptics</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(HAPTIC_PATTERNS).map(k => (
                <button key={k} onClick={()=>haptic(k)}
                  className="h-8 px-2.5 rounded-lg text-[11px] font-mono font-semibold bg-surface border border-border text-foreground hover:bg-surface-alt hover:border-primary/40 active:scale-95 transition-all">
                  {k}
                </button>
              ))}
            </div>
          </Card>

          <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
            <p className="font-semibold text-foreground mb-2">Uso:</p>
            <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`// Raíz: bloqueos + barra escondida + vars publicadas
<NativeShell onlyWhenInstalled>{children}</NativeShell>

// Por pantalla, elegí qué bordes respetar
<SafeArea edges={["top"]} gutter={12} as="header">…</SafeArea>
<SafeArea edges={["bottom"]} avoidKeyboard as="footer">…</SafeArea>
<SafeAreaSpacer edge="bottom"/>   // al final de una lista

// Hooks sueltos
const sa = useSafeArea();              // { top, bottom, hasInsets, … }
const { inset, open } = useKeyboardInset();
const { toggleFullscreen } = useImmersive({ keepAwake: true });
const { haptic } = useHaptics();        // haptic("success")
useStatusBarColor({ light: "#fff", dark: "#0f172a" });

/* CSS disponible sin JS */
.bar { bottom: calc(var(--kb-inset) + var(--sa-bottom)); }
.screen { height: var(--app-height); }`}</pre>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:sticky lg:top-24">
          <SafeAreaVisualizer device={device} edges={edges} gutter={gutter}
            keyboard={keyboard} avoidKeyboard={avoidKeyboard}/>
          <div className="flex items-center gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-danger/25 border border-dashed border-danger/50"/> Zona insegura
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-primary/15 border border-primary"/> Área segura
            </span>
          </div>
        </div>
      </div>
    </Section>
  );
}

function PlatformSection() {
  const { toast } = useToast();
  const info = usePreviewPlatform();
  const [opts, setOpts] = useState({
    blockZoom: false, blockOverscroll: false,
    blockContextMenu: false, blockTextSelection: false,
    patchViewportMeta: true,
  });
  usePreviewNativeFeel(opts);
  const anyOn = opts.blockZoom || opts.blockOverscroll || opts.blockContextMenu || opts.blockTextSelection;

  return (
    <Section id="platform" title="Platform · Native feel" description="usePlatform() detecta sistema, navegador, form factor, display mode y safe areas. useNativeFeel() + <ViewportLock/> bloquean zoom, overscroll, long-press y selección para una experiencia 100% nativa.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="usePlatform()">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Detección real, en vivo, del dispositivo con el que estás viendo esto.
            SSR-safe: durante el primer render devuelve <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">hydrating: true</code> y
            se resuelve al montar. Detecta el iPad que se hace pasar por Mac y los WebViews embebidos (Instagram, etc).
          </p>
          <PlatformPanel info={info}/>
        </Card>

        <Card title="useNativeFeel() · en vivo">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Activá los bloqueos y probalos en esta misma página: intentá hacer pinch,
            <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded mx-1">ctrl</code>+scroll,
            long-press o seleccionar texto. Todo es reversible al desmontar.
          </p>
          <NativeFeelDemo opts={opts} setOpts={setOpts}
            onToast={(label, on) => toast({
              title: `${label}: ${on ? "activado" : "desactivado"}`,
              variant: on ? "success" : "info",
            })}/>

          {anyOn && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={()=>{ setOpts(o => ({ ...o, blockZoom:false, blockOverscroll:false, blockContextMenu:false, blockTextSelection:false })); toast({ title:"Todo restaurado", variant:"info" }); }}
                className="h-8 px-3 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-surface-alt active:scale-95 transition-all">
                Restaurar todo
              </button>
              <p className="text-[11px] text-muted">Los bloqueos están activos en esta página.</p>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-4 grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
          <p className="font-semibold text-foreground mb-2">Uso:</p>
          <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`// Detección
const { isIos, isStandalone, formFactor, safeArea } = usePlatform();
if (isIos && !isStandalone) return <IosInstallHint/>;

// Bloqueos — declarativo, en el layout raíz
<ViewportLock onlyWhenInstalled />

// …o imperativo, con control fino
useNativeFeel({
  blockZoom: true,
  blockOverscroll: true,
  blockContextMenu: true,
  blockTextSelection: true,
});`}</pre>
        </div>

        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-accent/15 text-accent inline-flex items-center justify-center shrink-0">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 9v4"/><path d="M12 17h.01"/><circle cx="12" cy="12" r="9"/>
              </svg>
            </span>
            Accesibilidad
          </p>
          <p className="text-xs text-muted leading-relaxed">
            Bloquear el zoom rompe el criterio WCAG 1.4.4. Usalo sólo en apps instaladas
            o tipo juego, y ofrecé un control propio de tamaño de texto. La forma segura es
            atarlo a la instalación con <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">onlyWhenInstalled</code>:
            en el navegador el usuario mantiene su zoom, y ya instalada la app se siente nativa.
          </p>
        </div>
      </div>
    </Section>
  );
}

function PwaSection() {
  const { toast } = useToast();
  const [show, setShow] = useState(null); // null | "android" | "ios"

  return (
    <Section id="pwa" title="PWA Install" description="Detecta plataforma (Android/desktop con beforeinstallprompt nativo · iOS Safari con instrucciones manuales), respeta el dismiss del usuario por X días vía localStorage.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="Android · Chrome · Desktop">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Banner flotante inferior que dispara el prompt nativo del navegador.
            Aparece sólo si el browser emite <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">beforeinstallprompt</code>.
          </p>
          <Button onClick={()=>setShow("android")} leftIcon={I.plus}>Ver banner</Button>
        </Card>

        <Card title="iOS Safari">
          <p className="text-sm text-muted leading-relaxed mb-4">
            Bottom sheet con instrucciones paso a paso (Safari no permite trigger
            programático). Incluye flecha animada apuntando al botón de compartir.
          </p>
          <Button variant="secondary" onClick={()=>setShow("ios")} leftIcon={I.plus}>Ver sheet iOS</Button>
        </Card>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
        <p className="font-semibold text-foreground mb-2">Uso en tu app:</p>
        <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{`// app/layout.tsx (cliente)
<PwaInstallPrompt
  appName="Scaffolding"
  tagline="Acceso rápido, offline y notificaciones."
  snoozeDays={14}
/>`}</pre>
      </div>

      {show === "android" && (
        <PwaAndroidBanner
          appName="Scaffolding"
          tagline="Acceso rápido, soporte offline y notificaciones push."
          onInstall={async () => {
            await new Promise(r => setTimeout(r, 800));
            setShow(null);
            toast({ title: "¡App instalada!", description: "Buscala en tu launcher.", variant: "success" });
          }}
          onDismiss={() => {
            setShow(null);
            toast({ title: "No se mostrará por 14 días", variant: "info" });
          }}
        />
      )}

      {show === "ios" && (
        <PwaIosSheet
          appName="Scaffolding"
          tagline="Acceso rápido desde tu pantalla de inicio."
          onDismiss={() => {
            setShow(null);
            toast({ title: "Cerrado", variant: "info" });
          }}
        />
      )}
    </Section>
  );
}

function NavbarSection() {
  const [active, setActive] = useState("/dashboard");
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: I.home },
    { href: "/projects",  label: "Proyectos", icon: I.layers },
    { href: "/inbox",     label: "Inbox",     icon: I.inbox },
    { href: "/team",      label: "Equipo",    icon: I.user },
  ];
  return (
    <Section id="navbar" title="Navbar" description="Sticky + glassmorphism al hacer scroll, pill animada en el activo, menú mobile animado.">
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <Navbar
          brand={<Logo/>} links={links}
          activeHref={active} onNavigate={setActive}
          actions={<>
            <Button size="sm" variant="ghost" leftIcon={I.bell}>Notificaciones</Button>
            <Button size="sm" leftIcon={I.plus}>Nuevo</Button>
          </>}
          sticky={false}
        />
        <div className="p-6 text-sm text-muted">
          Activo: <code className="font-mono text-foreground bg-surface-alt px-2 py-0.5 rounded">{active}</code>
        </div>
      </div>
    </Section>
  );
}

function SideBarSection() {
  const [active, setActive] = useState("/projects");
  const sections = [
    { title: "Principal", links: [
      { href: "/dashboard", label: "Dashboard", icon: I.home },
      { href: "/projects",  label: "Proyectos", icon: I.layers, badge: 12 },
      { href: "/inbox",     label: "Inbox",     icon: I.inbox, badge: 3 },
      { href: "/analytics", label: "Analytics", icon: I.chart },
    ]},
    { title: "Equipo", links: [
      { href: "/team",     label: "Miembros",   icon: I.user },
      { href: "/settings", label: "Ajustes",    icon: I.settings },
    ]},
  ];
  return (
    <Section id="sidebar" title="SideBar" description="Colapsable (76 ↔ 256px) con spring, indicador del activo animado, badges, secciones y footer.">
      <div className="rounded-2xl border border-border overflow-hidden bg-surface flex h-[480px]">
        <SideBar
          brand={<Logo/>}
          sections={sections}
          activeHref={active} onNavigate={setActive}
          footer={
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary shrink-0"/>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-foreground truncate">Lucía Marín</p>
                <p className="text-[11px] text-muted truncate">lucia@scaffold.io</p>
              </div>
            </div>
          }
        />
        <div className="flex-1 p-8 bg-surface-alt/30 overflow-auto">
          <p className="text-xs text-muted uppercase tracking-wider">Vista actual</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{sections.flatMap(s=>s.links).find(l=>l.href===active)?.label}</p>
          <p className="mt-4 text-sm text-muted max-w-md leading-relaxed">
            Probá click en el icono superior del sidebar para colapsarlo.
            El indicador del activo se anima entre opciones.
          </p>
        </div>
      </div>
    </Section>
  );
}

function BottomNavSection() {
  const [active, setActive] = useState("/home");
  const items = [
    { href: "/home",    label: "Inicio",  icon: I.home },
    { href: "/explore", label: "Explora", icon: I.search },
    { href: "/inbox",   label: "Inbox",   icon: I.inbox, badge: 7 },
    { href: "/me",      label: "Perfil",  icon: I.user },
  ];
  return (
    <Section id="bottomnav" title="BottomNav" description="Para mobile. Indicador superior animado con spring entre items, scale del icono activo y badges.">
      <div className="flex justify-center">
        <div className="w-[340px] h-[600px] rounded-[40px] bg-surface border-[10px] border-foreground/90 overflow-hidden flex flex-col shadow-2xl shadow-black/20">
          <div className="flex-1 bg-gradient-to-br from-primary/10 via-accent/5 to-surface p-6 overflow-hidden">
            <p className="text-[10px] text-muted uppercase tracking-wider mt-4">Pantalla</p>
            <p className="mt-1 text-xl font-bold text-foreground">
              {items.find(i=>i.href===active)?.label}
            </p>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Tocá los tabs de abajo. El indicador superior se mueve con spring y el icono crece suavemente.
            </p>
          </div>
          <BottomNav items={items} activeHref={active} onNavigate={setActive}/>
        </div>
      </div>
    </Section>
  );
}

// =============================================================
//  Side scroll-spy nav (agrupada)
// =============================================================
function SideNav() {
  const [active, setActive] = useState("intro");
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] });
    SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const item = (s) => {
    const isActive = active === s.id;
    return (
      <li key={s.id}>
        <a href={`#${s.id}`}
          className={cx(
            "relative block px-3 py-1.5 text-sm rounded-lg transition-all",
            isActive ? "text-primary font-medium" : "text-muted hover:text-foreground",
          )}>
          {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-primary"/>}
          {s.label}
        </a>
      </li>
    );
  };

  return (
    <nav className="hidden xl:block sticky top-24 self-start w-52 shrink-0">
      <ul className="space-y-0.5">{item({ id:"intro", label:"Introducción" })}</ul>
      {GROUPS.map(g => (
        <div key={g.id} className="mt-6">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground mb-2 pl-3">
            <span className={cx("w-1.5 h-1.5 rounded-full", GROUP_TONES[g.tone].dot)}/>
            {g.label}
          </p>
          <ul className="space-y-0.5 border-l border-border ml-3 pl-0.5">
            {g.sections.map(item)}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// ---------- Encabezado de grupo ----------
function GroupHeader({ group, count }) {
  const t = GROUP_TONES[group.tone];
  return (
    <div id={group.id} className="scroll-mt-20 pt-16 pb-2 first:pt-8">
      <div className={cx("rounded-3xl border p-7 sm:p-8", t.card)}>
        <div className="flex items-center gap-2 mb-3">
          <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em]", t.pill)}>
            <span className={cx("w-1.5 h-1.5 rounded-full", t.dot)}/>
            {group.kicker}
          </span>
          <span className="text-[11px] text-muted font-medium">{count}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{group.label}</h2>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-2xl">{group.blurb}</p>
      </div>
    </div>
  );
}

// =============================================================
//  Main App
// =============================================================
function App() {
  const [topActive, setTopActive] = useState("/components");
  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface text-foreground">
        <Navbar
          brand={<Logo/>}
          links={[
            { href:"/components", label:"Components", icon: I.layers },
            { href:"/tokens",     label:"Tokens",    icon: I.edit },
            { href:"/docs",       label:"Docs",      icon: I.inbox },
          ]}
          activeHref={topActive} onNavigate={setTopActive}
          actions={<>
            <ThemeToggle/>
            <Button size="sm" leftIcon={I.github} variant="secondary">GitHub</Button>
          </>}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          {/* Hero */}
          <div className="pt-14 pb-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/>
              scaffold · v1.0
            </div>
            <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight text-foreground leading-[1.05]">
              Tu kit de<br/>
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                componentes atómicos.
              </span>
            </h1>
            <p className="mt-5 text-base text-muted leading-relaxed max-w-xl">
              12 componentes atómicos, 3 grillas de datos, 6 de interacción y 6 moléculas PWA listas para arrancar cualquier proyecto Next.js. Animaciones con
              Framer Motion, tema claro/oscuro out-of-the-box, y tokens CSS que controlas
              desde un solo archivo.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button leftIcon={I.zap} onClick={()=>document.getElementById("button").scrollIntoView({ behavior:"smooth" })}>Empezar</Button>
              <Button variant="secondary" leftIcon={I.github}>Ver código</Button>
            </div>
          </div>

          {/* Body: side nav + sections */}
          <div className="flex gap-10">
            <SideNav/>
            <div className="flex-1 min-w-0">
              <IntroSection/>

              <GroupHeader group={GROUPS[0]} count="12 componentes"/>
              <ButtonSection/>
              <InputSection/>
              <TextareaSection/>
              <SelectSection/>
              <DropdownSection/>
              <SpinnerSection/>
              <ToastSection/>
              <ModalSection/>
              <BottomSheetSection/>
              <NavbarSection/>
              <SideBarSection/>
              <BottomNavSection/>

              <GroupHeader group={GROUPS[1]} count="3 componentes"/>
              <DataTableSection/>
              <SpreadsheetSection/>
              <CalendarSection/>

              <GroupHeader group={GROUPS[2]} count="6 componentes"/>
              <BreadcrumbsSection/>
              <CheckboxSection/>
              <CreditCardSection/>
              <FabSection/>
              <StepperSection/>
              <ProgressSection/>

              <GroupHeader group={GROUPS[3]} count="4 familias · 9 componentes"/>
              <CardsSection/>
              <CarouselSection/>
              <ImageZoomSection/>
              <TabsSection/>

              <GroupHeader group={GROUPS[4]} count="11 componentes · 12 hooks"/>
              <PwaSection/>
              <PwaMoleculesSection/>
              <SplashSection/>
              <SafeAreaSection/>
              <PlatformSection/>
            </div>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
