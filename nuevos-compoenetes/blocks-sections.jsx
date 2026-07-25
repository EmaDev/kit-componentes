// =============================================================
//  PREVIEW · Secciones de los bloques de app
//  Chips · PinLock · AmountPad · RedirectTimer · Share · CardGrid
// =============================================================

function BSection({ id, title, description, children }) {
  return (
    <section id={id} className="scroll-mt-20 py-12 border-b border-border last:border-0">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>}
      </div>
      {children}
    </section>
  );
}

function BCard({ title, children, className = "" }) {
  return (
    <div className={cx("rounded-2xl border border-border bg-surface-alt/40 p-6", className)}>
      {title && <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{title}</p>}
      {children}
    </div>
  );
}

function BPills({ options, value, onChange, label }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {label && <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-1">{label}</span>}
      {options.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)}
          className={cx("h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95",
            value === k ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt")}>
          {l}
        </button>
      ))}
    </div>
  );
}

function BPhone({ children, h = 560, w = 288 }) {
  return (
    <div className="relative rounded-[38px] bg-surface border-[9px] border-foreground/90 overflow-hidden shadow-2xl shadow-black/20 shrink-0"
      style={{ width: w, height: h }}>
      {children}
    </div>
  );
}

function BUsage({ children }) {
  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border p-5 text-xs text-muted leading-relaxed">
      <p className="font-semibold text-foreground mb-2">Uso:</p>
      <pre className="font-mono text-[11px] text-foreground/80 overflow-auto leading-relaxed">{children}</pre>
    </div>
  );
}

// =============================================================
//  1 · Chips
// =============================================================
const CHIP_AVATARS = ["Lucía", "Bruno", "Camila", "Diego", "Elena", "Facundo"].map((n, i) => ({
  id: `p${i}`, label: n, image: phImage({ w: 200, h: 200, label: n[0], n: i + 1 }),
}));

function ChipsSection() {
  const [variant, setVariant] = useState("soft");
  const [size, setSize] = useState("md");
  const [cat, setCat] = useState("todos");
  const [tags, setTags] = useState(["envio"]);
  const [person, setPerson] = useState("p0");
  const [place, setPlace] = useState("c0");

  const cats = [
    { id: "todos", label: "Todos", icon: I.layers, count: 128 },
    { id: "hoy", label: "Hoy", icon: I.zap, count: 12 },
    { id: "cerca", label: "Cerca de mí", icon: I.home, count: 24 },
    { id: "favoritos", label: "Favoritos", icon: I.check, count: 8 },
    { id: "ofertas", label: "Ofertas", icon: I.flag, count: 31 },
    { id: "nuevos", label: "Nuevos", icon: I.plus, count: 5 },
    { id: "agotados", label: "Agotados", icon: I.close, disabled: true },
  ];

  const filters = [
    { id: "envio", label: "Envío gratis" }, { id: "retiro", label: "Retiro en tienda" },
    { id: "cuotas", label: "12 cuotas" }, { id: "usado", label: "Usado" },
    { id: "oferta", label: "Con descuento" }, { id: "premium", label: "Premium" },
  ];

  const covers = ["Palermo", "San Telmo", "Recoleta", "Belgrano", "Chacarita", "Colegiales"].map((n, i) => ({
    id: `c${i}`, label: n, sub: `${4 + i} lugares`, icon: I.home,
    image: phImage({ w: 600, h: 400, label: n, n: i + 1 }),
  }));

  return (
    <BSection id="chips" title="Carrusel de chips"
      description="Fila horizontal de chips con iconos, imágenes, subtítulo y contador. Arrastre con el mouse o el dedo, snap por chip, degradados en los bordes y flechas en desktop. Selección simple o múltiple, y cuatro variantes — incluida «cover», con la imagen de fondo.">
      <div className="space-y-4">
        <BCard title="Categorías · icono + contador">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <BPills label="Variante" value={variant} onChange={setVariant}
              options={[["soft","Soft"],["outline","Outline"],["solid","Solid"]]}/>
            <BPills label="Tamaño" value={size} onChange={setSize}
              options={[["sm","sm"],["md","md"],["lg","lg"]]}/>
          </div>
          <PreviewChipCarousel chips={cats} value={cat} onChange={setCat} variant={variant} size={size}/>
          <p className="mt-3 text-[11px] text-muted">
            Seleccionado: <code className="font-mono text-foreground bg-surface-alt px-1.5 py-0.5 rounded">{cat || "—"}</code> · tocá de nuevo para limpiar
          </p>
        </BCard>

        <div className="grid lg:grid-cols-2 gap-4">
          <BCard title="Filtros · selección múltiple">
            <PreviewChipCarousel chips={filters} value={tags} onChange={setTags} multi variant="outline"/>
            <p className="mt-3 text-[11px] text-muted">
              Activos: <b className="text-foreground">{tags.length ? tags.join(", ") : "ninguno"}</b>
            </p>
          </BCard>

          <BCard title="Personas · imagen circular">
            <PreviewChipCarousel chips={CHIP_AVATARS} value={person} onChange={setPerson} variant="soft"/>
          </BCard>
        </div>

        <BCard title="Variante «cover» · imagen de fondo con título">
          <PreviewChipCarousel chips={covers} value={place} onChange={setPlace} variant="cover" size="lg" gap={10}/>
        </BCard>

        <BUsage>{`<ChipCarousel
  chips={[
    { id: "hoy", label: "Hoy", icon: <ZapIcon/>, count: 12 },
    { id: "lucia", label: "Lucía", image: "/lucia.jpg" },
    { id: "palermo", label: "Palermo", sub: "8 lugares",
      image: "/palermo.jpg" },        // variant="cover"
  ]}
  value={cat} onChange={setCat}
  variant="soft"      // soft | outline | solid | cover
  size="md"           // sm | md | lg
  multi={false} clearable arrows
/>`}</BUsage>
      </div>
    </BSection>
  );
}

// =============================================================
//  2 · PinLock
// =============================================================
function PinLockSection() {
  const { toast } = useToast();
  const [mode, setMode] = useState("pin");
  const [length, setLength] = useState(4);
  const [locked, setLocked] = useState(true);
  const secret = mode === "pin" ? "1234".padEnd(length, "5").slice(0, length) : "scaffold";

  return (
    <BSection id="pinlock" title="Bloqueo por PIN o contraseña"
      description="Pantalla de arranque que cubre la app hasta desbloquear: puntos que se llenan, verificación automática al completar el PIN, shake y contador de intentos al fallar, tinte verde al acertar, borrado con long-press y salida por biometría. Acepta también el teclado físico.">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-4">
          <BCard title="Configuración">
            <div className="space-y-4">
              <BPills label="Modo" value={mode} onChange={m => { setMode(m); setLocked(true); }}
                options={[["pin","PIN numérico"],["password","Contraseña"]]}/>
              {mode === "pin" && (
                <BPills label="Dígitos" value={length} onChange={n => { setLength(n); setLocked(true); }}
                  options={[[4,"4"],[6,"6"]]}/>
              )}
              <div className="rounded-xl border border-primary/25 bg-primary/[0.05] px-3.5 py-2.5 text-xs text-foreground">
                Código de prueba: <b className="font-mono">{secret}</b>
              </div>
              <button onClick={() => setLocked(true)}
                className="h-9 px-3.5 rounded-lg text-xs font-semibold bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all">
                Bloquear de nuevo
              </button>
            </div>
          </BCard>

          <BUsage>{`const [locked, setLocked] = useState(true);

<PinLock
  open={locked}
  mode="pin"                  // pin | password
  length={4}
  appName="Scaffolding"
  onUnlock={async code => await verifyPin(code)}   // → boolean
  onSuccess={() => setLocked(false)}
  maxAttempts={5}
  onLockout={() => logout()}
  onBiometric={() => webauthnLogin()}
  onForgot={() => router.push("/recuperar")}
/>`}</BUsage>
        </div>

        <div className="flex justify-center lg:sticky lg:top-24">
          <BPhone>
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-7 pb-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Hola de nuevo</p>
                <p className="text-xl font-bold text-foreground mt-0.5">Tu billetera</p>
              </div>
              <div className="flex-1 px-5 space-y-2.5">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="h-16 rounded-xl bg-surface-alt border border-border flex items-center px-3 gap-3">
                    <span className="w-9 h-9 rounded-lg bg-primary/10 shrink-0"/>
                    <span className="flex-1 space-y-1.5">
                      <span className="block h-2 rounded bg-border" style={{ width: `${50 + i * 7}%` }}/>
                      <span className="block h-2 rounded bg-border/60 w-1/3"/>
                    </span>
                  </div>
                ))}
              </div>
              {!locked && (
                <button onClick={() => setLocked(true)}
                  className="m-4 h-11 rounded-xl bg-primary text-white text-sm font-semibold active:scale-95 transition-transform">
                  Bloquear
                </button>
              )}
            </div>

            <PreviewPinLock
              open={locked} mode={mode} length={length} appName="Scaffolding"
              onUnlock={async code => { await new Promise(r => setTimeout(r, 260)); return code === secret; }}
              onSuccess={() => { setLocked(false); toast({ title: "¡Desbloqueada!", variant: "success" }); }}
              onBiometric={() => toast({ title: "Biometría", description: "Acá va WebAuthn / Face ID.", variant: "info" })}
              onForgot={() => toast({ title: "Recuperar acceso", variant: "info" })}
            />
          </BPhone>
        </div>
      </div>
    </BSection>
  );
}

// =============================================================
//  3 · AmountPad
// =============================================================
function AmountPadSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(184320.5);
  const [last, setLast] = useState(null);
  const money = n => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  return (
    <BSection id="amount" title="Carga de importes"
      description="Pantalla completa para ingresar dinero, estilo billetera virtual: el número se formatea en vivo con separadores de miles, la coma habilita centavos, el tamaño de la tipografía baja al crecer el monto, hay montos sugeridos y el botón sólo se activa cuando el importe es válido. El máximo puede ser el saldo disponible.">
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="space-y-4">
          <BCard title="Estado">
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-border bg-surface px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Saldo</p>
                <p className="text-lg font-bold text-foreground tabular-nums">{money(balance)}</p>
              </div>
              {last != null && (
                <div className="rounded-xl border border-success/30 bg-success/[0.06] px-4 py-3">
                  <p className="text-[10px] uppercase tracking-wider text-success font-semibold">Última carga</p>
                  <p className="text-lg font-bold text-foreground tabular-nums">{money(last)}</p>
                </div>
              )}
              <button onClick={() => setOpen(true)}
                className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all">
                Cargar dinero
              </button>
              <button onClick={() => { setBalance(184320.5); setLast(null); }}
                className="h-10 px-3.5 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors">
                Reiniciar
              </button>
            </div>
            <p className="mt-3 text-[11px] text-muted">
              Probá la coma para centavos, «Todo» para usar el saldo completo y mantené presionada la tecla de borrado para limpiar.
            </p>
          </BCard>

          <BUsage>{`<AmountPad
  open={open} onClose={() => setOpen(false)}
  title="¿Cuánto querés cargar?"
  currency="ARS" locale="es-AR"
  balance={saldo}          // valida el máximo y agrega "Todo"
  min={100} max={500000}
  quickAmounts={[1000, 5000, 10000]}
  decimals                  // habilita la coma
  cta="Continuar"
  onConfirm={async amount => await recargar(amount)}
/>`}</BUsage>
        </div>

        <div className="flex justify-center lg:sticky lg:top-24">
          <BPhone>
            <div className="absolute inset-0 flex flex-col">
              <div className="px-5 pt-7">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Saldo disponible</p>
                <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">{money(balance)}</p>
              </div>
              <div className="px-5 mt-4 grid grid-cols-2 gap-2">
                {["Cargar","Enviar","Cobrar","Pagar"].map((a, i) => (
                  <button key={a} onClick={() => i === 0 && setOpen(true)}
                    className="h-16 rounded-xl bg-surface-alt border border-border flex flex-col items-start justify-center px-3 gap-1 active:scale-95 transition-transform">
                    <span className="w-6 h-6 rounded-md bg-primary/12 text-primary grid place-items-center [&_svg]:w-3.5 [&_svg]:h-3.5">{I.plus}</span>
                    <span className="text-xs font-semibold text-foreground">{a}</span>
                  </button>
                ))}
              </div>
              <div className="flex-1 px-5 mt-4 space-y-2">
                {[1,2,3].map(i => (
                  <div key={i} className="h-12 rounded-xl bg-surface-alt/60 border border-border flex items-center px-3 gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-border/60"/>
                    <span className="flex-1 h-2 rounded bg-border" style={{ width: `${40 + i * 10}%` }}/>
                  </div>
                ))}
              </div>
            </div>

            <PreviewAmountPad
              open={open} onClose={() => setOpen(false)} balance={balance} min={100}
              quickAmounts={[1000, 5000, 20000]}
              onConfirm={async amount => {
                await new Promise(r => setTimeout(r, 500));
                setBalance(b => b + amount);
                setLast(amount);
                setOpen(false);
                toast({ title: "Carga acreditada", description: money(amount), variant: "success" });
              }}
            />
          </BPhone>
        </div>
      </div>
    </BSection>
  );
}

// =============================================================
//  4 · RedirectTimer
// =============================================================
function TimerSection() {
  const { toast } = useToast();
  const [target, setTarget] = useState("whatsapp");
  const [seconds, setSeconds] = useState(8);
  const [msg, setMsg] = useState("Hola 👋 Vengo de la web y quiero consultar por el plan Pro.");

  return (
    <BSection id="timer" title="Timer con redirección"
      description="Cuenta atrás con anillo de progreso que, al llegar a cero, abre otra plataforma con el mensaje ya cargado. El usuario puede editar el texto (lo que pausa el reloj), pausar, reanudar o salir en el momento. Sirve para WhatsApp, Telegram, SMS, mail o cualquier URL.">
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <BCard title="Destino">
            <div className="space-y-4">
              <BPills value={target} onChange={setTarget}
                options={[["whatsapp","WhatsApp"],["telegram","Telegram"],["sms","SMS"],["mail","Email"],["url","URL"]]}/>
              <label className="block">
                <span className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
                  <span>Segundos</span><span className="font-mono text-muted tabular-nums">{seconds}s</span>
                </span>
                <input type="range" min="3" max="30" value={seconds} onChange={e => setSeconds(+e.target.value)} className="w-full accent-primary"/>
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Mensaje por defecto</span>
                <input value={msg} onChange={e => setMsg(e.target.value)}
                  className="mt-1.5 w-full h-10 px-3 rounded-lg border border-border bg-surface text-sm text-foreground outline-none focus:border-primary transition-colors"/>
              </label>
            </div>
          </BCard>

          <BUsage>{`<RedirectTimer
  target="whatsapp"          // whatsapp | telegram | sms | mail | url
  phone="5491122334455"      // internacional, sin +
  message="Hola 👋 quiero consultar por el plan Pro."
  editable                    // el usuario ajusta el texto
  seconds={8} autoStart newTab
  onRedirect={href => track("wa_redirect", href)}
  onCancel={() => setStep("form")}
/>

// sólo el link, para tu propio botón
buildRedirectHref("whatsapp", { phone, message });`}</BUsage>
        </div>

        <PreviewRedirectTimer
          key={`${target}-${seconds}`}
          target={target} seconds={seconds}
          phone={target === "telegram" ? "@scaffolding" : "5491122334455"}
          email="hola@scaffold.io" url="https://scaffold.io/gracias"
          message={msg}
          onRedirect={href => toast({ title: "Redirigiendo", description: href, variant: "info" })}
          onCancel={() => toast({ title: "Redirección cancelada", variant: "info" })}
        />
      </div>
    </BSection>
  );
}

// =============================================================
//  5 · ShareButton
// =============================================================
function ShareSection() {
  const { toast } = useToast();
  const [fallback, setFallback] = useState(true);
  const native = typeof navigator !== "undefined" && !!navigator.share;
  const shared = m => toast({ title: `Compartido · ${m}`, variant: "success" });

  return (
    <BSection id="share" title="Botón de compartir"
      description="Usa la hoja nativa del sistema con la Web Share API cuando existe (Android, iOS, Safari) y cae a un sheet propio en desktop: WhatsApp, Telegram, mail, SMS y copiar enlace con confirmación. Cuatro apariencias y feedback táctil.">
      <div className="grid md:grid-cols-2 gap-4">
        <BCard title="Apariencias">
          <div className="flex flex-wrap items-center gap-3">
            <PreviewShareButton title="Scaffolding UI" text="Mirá este kit de componentes" forceFallback={fallback} onShared={shared}/>
            <PreviewShareButton variant="icon" forceFallback={fallback} onShared={shared}/>
            <PreviewShareButton variant="ghost" forceFallback={fallback} onShared={shared}/>
            <PreviewShareButton size="lg" label="Compartir proyecto" forceFallback={fallback} onShared={shared}/>
            <PreviewShareButton variant="fab" forceFallback={fallback} onShared={shared}/>
          </div>
          <div className="mt-5">
            <BPills label="Modo" value={fallback ? "fb" : "auto"} onChange={k => setFallback(k === "fb")}
              options={[["auto","Automático"],["fb","Forzar sheet propio"]]}/>
            <p className="mt-3 text-[11px] text-muted">
              En este dispositivo <b className="text-foreground">{native ? "sí" : "no"}</b> existe <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">navigator.share</code>
              {native ? " — en modo automático se abre la hoja del sistema." : " — siempre se usa el sheet propio."}
            </p>
          </div>
        </BCard>

        <BCard title="En contexto">
          <div className="rounded-2xl border border-border bg-surface overflow-hidden">
            <img src={phImage({ w: 800, h: 420, label: "producto", n: 7 })} alt="" className="w-full h-36 object-cover"/>
            <div className="p-4">
              <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">Publicación</p>
              <p className="mt-0.5 text-base font-bold text-foreground">Casa Aldama · 140 m²</p>
              <p className="mt-1 text-xs text-muted leading-relaxed">Reforma integral con patio interno y terraza verde.</p>
              <div className="mt-4 flex items-center gap-2">
                <button className="h-10 flex-1 rounded-xl bg-primary text-white text-sm font-semibold active:scale-[0.97] transition-transform">Consultar</button>
                <PreviewShareButton variant="icon" size="lg" title="Casa Aldama" text="Mirá esta propiedad" forceFallback={fallback} onShared={shared}/>
              </div>
            </div>
          </div>
        </BCard>
      </div>

      <BUsage>{`<ShareButton
  title="Casa Aldama"
  text="Mirá esta propiedad"
  url="https://scaffold.io/casa-aldama"   // default: location.href
  variant="button"     // button | icon | ghost | fab
  size="md"
  onShared={method => track("share", method)}
/>`}</BUsage>
    </BSection>
  );
}

// =============================================================
//  6 · CardGrid
// =============================================================
const GRID_ITEMS = [
  ["Casa Aldama", "Palermo", "$185.000"], ["Loft Cabrera", "Villa Crespo", "$132.500"],
  ["Dúplex Nuñez", "Núñez", "$210.000"], ["Studio Serrano", "Palermo", "$98.400"],
  ["PH Chacarita", "Chacarita", "$156.900"], ["Casa Devoto", "Villa Devoto", "$244.000"],
  ["Depto Colegiales", "Colegiales", "$121.300"], ["Loft Almagro", "Almagro", "$104.800"],
  ["Casa Saavedra", "Saavedra", "$198.200"],
].map(([title, zone, price], i) => ({
  id: `g${i}`, title, zone, price, img: phImage({ w: 800, h: 600, label: zone, n: i + 1 }),
}));

function CardGridSection() {
  const [cols, setCols] = useState(3);

  return (
    <BSection id="cardgrid" title="Grid de cards con columnas ajustables"
      description="Grilla que cambia de columnas en el momento, con botones − / + y atajos numéricos. Respeta un ancho mínimo por card: si las columnas elegidas no caben, baja sola y lo avisa. Puede recordar la preferencia del usuario en localStorage.">
      <PreviewCardGrid
        items={GRID_ITEMS} defaultColumns={3} min={1} max={5} minCardWidth={190} gap={16}
        onColumnsChange={setCols}
        toolbar={<span className="text-[11px] text-muted">{GRID_ITEMS.length} resultados</span>}
        renderItem={it => (
          <article key={it.id} className="group rounded-2xl border border-border bg-surface overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
            <div className="relative overflow-hidden" style={{ aspectRatio: cols > 3 ? "1 / 1" : "4 / 3" }}>
              <img src={it.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            <div className="p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted font-semibold truncate">{it.zone}</p>
              <p className={cx("mt-0.5 font-bold text-foreground truncate", cols > 3 ? "text-xs" : "text-sm")}>{it.title}</p>
              <p className="mt-1 text-sm font-bold text-primary tabular-nums">{it.price}</p>
            </div>
          </article>
        )}
      />

      <BUsage>{`<CardGrid
  items={propiedades} renderItem={p => <PropertyCard {...p}/>}
  defaultColumns={3} min={1} max={5}
  minCardWidth={190}        // por debajo de esto, baja columnas sola
  gap={16}
  controlStyle="both"       // buttons | pills | both
  storageKey="grid.cols"    // recuerda la elección
  toolbar={<SortSelect/>}
  onColumnsChange={setCols} // podés adaptar el contenido de la card
/>`}</BUsage>
    </BSection>
  );
}

function BlocksSections() {
  return (
    <>
      <ChipsSection/>
      <PinLockSection/>
      <AmountPadSection/>
      <TimerSection/>
      <ShareSection/>
      <CardGridSection/>
    </>
  );
}

Object.assign(window, { BlocksSections });
