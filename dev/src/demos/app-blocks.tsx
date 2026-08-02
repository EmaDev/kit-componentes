import { useEffect, useState } from "react";
import { ChipCarousel, type Chip } from "../../../components/ChipCarousel";
import { Keypad } from "../../../components/Keypad";
import { PinLock } from "../../../components/PinLock";
import { AmountPad } from "../../../components/AmountPad";
import { RedirectTimer, type RedirectTarget } from "../../../components/RedirectTimer";
import { ShareButton } from "../../../components/ShareButton";
import { CardGrid } from "../../../components/CardGrid";
import { useToast } from "../../../components/Toast";
import { Section, Card } from "../chrome/Section";

// Placeholder SVG generado en el momento, sin depender de internet (mismo patrón que SurfacesGroup).
function phImage({ w = 800, h = 600, label = "imagen", from = "#2563eb", to = "#8b5cf6", n = 1 }: { w?: number; h?: number; label?: string; from?: string; to?: string; n?: number } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="monospace" font-size="${h * 0.12}" font-weight="700" fill="rgba(255,255,255,0.85)">${n}</text>
<text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.6)" letter-spacing="2">${label.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const money = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

export function ChipCarouselSection() {
  const [cat, setCat] = useState("todos");
  const [tags, setTags] = useState<string[]>(["envio"]);

  const CATEGORIES: Chip[] = [
    { id: "todos", label: "Todos", count: 128 },
    { id: "hoy", label: "Hoy", count: 12 },
    { id: "cerca", label: "Cerca de mí", count: 24 },
    { id: "favoritos", label: "Favoritos", count: 8 },
    { id: "ofertas", label: "Ofertas", count: 31 },
    { id: "nuevos", label: "Nuevos", count: 5 },
    { id: "agotados", label: "Agotados", disabled: true },
  ];

  const FILTERS: Chip[] = [
    { id: "envio", label: "Envío gratis" },
    { id: "retiro", label: "Retiro en tienda" },
    { id: "cuotas", label: "12 cuotas" },
    { id: "oferta", label: "Con descuento" },
    { id: "premium", label: "Premium" },
  ];

  const PLACES: Chip[] = ["Palermo", "San Telmo", "Recoleta", "Belgrano"].map((n, i) => ({
    id: `c${i}`,
    label: n,
    sub: `${4 + i} lugares`,
    image: phImage({ w: 400, h: 300, label: n, n: i + 1 }),
  }));

  return (
    <Section id="chipcarousel" title="ChipCarousel" description="Fila horizontal de chips con drag, snap, flechas en desktop y degradados en los bordes. Selección simple o múltiple, cuatro variantes.">
      <div className="space-y-4">
        <Card title="Categorías · selección simple">
          <ChipCarousel chips={CATEGORIES} value={cat} onChange={(v) => setCat(v as string)} variant="soft" />
          <p className="mt-3 text-[11px] text-muted">
            Seleccionado: <code className="font-mono text-foreground bg-surface-alt px-1.5 py-0.5 rounded">{cat || "—"}</code>
          </p>
        </Card>

        <Card title="Filtros · selección múltiple">
          <ChipCarousel chips={FILTERS} value={tags} onChange={(v) => setTags(v as string[])} multi variant="outline" />
        </Card>

        <Card title="Variante «cover» · imagen de fondo">
          <ChipCarousel chips={PLACES} variant="cover" size="lg" />
        </Card>
      </div>
    </Section>
  );
}

export function KeypadSection() {
  const [code, setCode] = useState("");
  return (
    <Section id="keypad" title="Keypad" description="Teclado numérico táctil 3×4, con tecla extra opcional y borrado con long-press. Pieza de bajo nivel usada por AmountPad y PinLock.">
      <div className="grid sm:grid-cols-[1fr_260px] gap-4 items-start">
        <Card title="Con tecla de coma y borrado total en long-press">
          <div className="max-w-[280px] mx-auto">
            <Keypad
              onKey={(k) => {
                if (k === "backspace") return setCode((c) => c.slice(0, -1));
                setCode((c) => c + k);
              }}
              extraKey=","
              onBackspaceLong={() => setCode("")}
            />
          </div>
        </Card>
        <Card title="Valor tipeado">
          <p className="text-2xl font-bold tabular-nums text-foreground break-all min-h-8">{code || "—"}</p>
          <p className="mt-2 text-[11px] text-muted">Mantené presionado el borrado para limpiar todo.</p>
        </Card>
      </div>
    </Section>
  );
}

export function PinLockSection() {
  const { toast } = useToast();
  const [locked, setLocked] = useState(false);
  const secret = "1234";

  // PinLock no tiene (ni debe tener) un botón de cerrar: es una pantalla de
  // bloqueo real, sólo sale con el código correcto. Esto es sólo para poder
  // salir de la demo sin tipear el PIN de prueba.
  useEffect(() => {
    if (!locked) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") setLocked(false); };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [locked]);

  return (
    <Section id="pinlock" title="PinLock" description="Pantalla de bloqueo a pantalla completa por PIN o contraseña: verificación automática al completar, shake y contador de intentos al fallar, biometría y 'olvidé mi código' opcionales. No tiene botón de cerrar — a propósito, es una pantalla de bloqueo real — probala con el código de prueba o salí con Esc.">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setLocked(true)}
            className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
          >
            Abrir pantalla de bloqueo
          </button>
          <span className="text-[11px] text-muted">
            Código de prueba: <b className="font-mono text-foreground">{secret}</b> · <b className="text-foreground">Esc</b> para salir de la demo sin desbloquear
          </span>
        </div>
        <PinLock
          open={locked}
          mode="pin"
          length={4}
          appName="Scaffolding"
          onUnlock={async (c) => {
            await new Promise((r) => setTimeout(r, 260));
            return c === secret;
          }}
          onSuccess={() => {
            setLocked(false);
            toast({ title: "¡Desbloqueada!", variant: "success" });
          }}
          onBiometric={() => { toast({ title: "Biometría", description: "Acá va WebAuthn / Face ID.", variant: "info" }); }}
          onForgot={() => { toast({ title: "Recuperar acceso", variant: "info" }); }}
        />
      </Card>
    </Section>
  );
}

export function AmountPadSection() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(184320.5);

  return (
    <Section id="amountpad" title="AmountPad" description="Carga de montos a pantalla completa, estilo billetera: número formateado en vivo, tecla de coma para centavos, montos sugeridos y validación de mínimo/máximo contra el saldo.">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">Saldo</p>
            <p className="text-lg font-bold text-foreground tabular-nums">{money(balance)}</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-10 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
          >
            Cargar dinero
          </button>
        </div>
        <AmountPad
          open={open}
          onClose={() => setOpen(false)}
          balance={balance}
          min={100}
          quickAmounts={[1000, 5000, 20000]}
          onConfirm={async (amount) => {
            await new Promise((r) => setTimeout(r, 500));
            setBalance((b) => b + amount);
            setOpen(false);
            toast({ title: "Carga acreditada", description: money(amount), variant: "success" });
          }}
        />
      </Card>
    </Section>
  );
}

export function RedirectTimerSection() {
  const { toast } = useToast();
  const [target, setTarget] = useState<RedirectTarget>("whatsapp");
  const [seconds, setSeconds] = useState(8);

  const TARGETS: { id: RedirectTarget; label: string }[] = [
    { id: "whatsapp", label: "WhatsApp" },
    { id: "telegram", label: "Telegram" },
    { id: "sms", label: "SMS" },
    { id: "mail", label: "Email" },
    { id: "url", label: "URL" },
  ];

  return (
    <Section id="redirecttimer" title="RedirectTimer" description="Cuenta atrás con anillo de progreso que, al llegar a cero, abre otra plataforma con el mensaje ya cargado. Editable, pausable y cancelable.">
      <div className="grid lg:grid-cols-[220px_1fr] gap-4 items-start">
        <Card title="Destino">
          <div className="flex flex-wrap gap-1.5">
            {TARGETS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTarget(t.id)}
                className={`h-8 px-2.5 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
                  target === t.id ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <label className="block mt-4">
            <span className="flex items-center justify-between text-xs font-semibold text-foreground mb-2">
              <span>Segundos</span>
              <span className="font-mono text-muted tabular-nums">{seconds}s</span>
            </span>
            <input type="range" min={3} max={20} value={seconds} onChange={(e) => setSeconds(+e.target.value)} className="w-full accent-primary" />
          </label>
        </Card>

        <RedirectTimer
          key={`${target}-${seconds}`}
          target={target}
          seconds={seconds}
          autoStart={false}
          phone={target === "telegram" ? "@scaffolding" : "5491122334455"}
          email="hola@scaffold.io"
          url="https://scaffold.io/gracias"
          message="Hola 👋 Vengo de la web y quiero consultar por el plan Pro."
          onRedirect={(href) => toast({ title: "Redirigiendo", description: href, variant: "info" })}
          onCancel={() => toast({ title: "Redirección cancelada", variant: "info" })}
        />
      </div>
    </Section>
  );
}

export function ShareButtonSection() {
  const { toast } = useToast();
  const shared = (m: string) => toast({ title: `Compartido · ${m}`, variant: "success" });

  return (
    <Section id="sharebutton" title="ShareButton" description="Usa la hoja nativa del sistema (Web Share API) cuando existe, y cae a un sheet propio en desktop: WhatsApp, Telegram, mail, SMS y copiar enlace.">
      <Card title="Apariencias — forzando el sheet propio para poder probarlo en cualquier dispositivo">
        <div className="flex flex-wrap items-center gap-3">
          <ShareButton title="Scaffolding UI" text="Mirá este kit de componentes" forceFallback onShared={shared} />
          <ShareButton variant="icon" forceFallback onShared={shared} />
          <ShareButton variant="ghost" forceFallback onShared={shared} />
          <ShareButton size="lg" label="Compartir proyecto" forceFallback onShared={shared} />
          <ShareButton variant="fab" forceFallback onShared={shared} />
        </div>
      </Card>
    </Section>
  );
}

const GRID_ITEMS = [
  ["Casa Aldama", "Palermo", "$185.000"],
  ["Loft Cabrera", "Villa Crespo", "$132.500"],
  ["Dúplex Nuñez", "Núñez", "$210.000"],
  ["Studio Serrano", "Palermo", "$98.400"],
  ["PH Chacarita", "Chacarita", "$156.900"],
  ["Casa Devoto", "Villa Devoto", "$244.000"],
].map(([title, zone, price], i) => ({ id: `g${i}`, title, zone, price, img: phImage({ w: 640, h: 480, label: zone, n: i + 1 }) }));

export function CardGridSection() {
  return (
    <Section id="cardgrid" title="CardGrid" description="Grilla de cards con ajuste de columnas en tiempo real: botones −/+, pills numéricas, o ambos. Respeta un ancho mínimo por card y avisa cuando las columnas elegidas no caben.">
      <Card>
        <CardGrid
          items={GRID_ITEMS}
          defaultColumns={2}
          min={1}
          max={4}
          minCardWidth={260}
          storageKey="playground.cardgrid.cols"
          toolbar={<span className="text-[11px] text-muted">{GRID_ITEMS.length} resultados</span>}
          renderItem={(it) => (
            <article key={it.id} className="rounded-2xl border border-border bg-surface overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={it.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted font-semibold truncate">{it.zone}</p>
                <p className="mt-0.5 text-sm font-bold text-foreground truncate">{it.title}</p>
                <p className="mt-1 text-sm font-bold text-primary tabular-nums">{it.price}</p>
              </div>
            </article>
          )}
        />
      </Card>
    </Section>
  );
}

