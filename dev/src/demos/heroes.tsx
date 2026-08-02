import { useState } from "react";
import { HeroSearch, HeroImage, HeroTabs, HeroWelcome, type HeroTab } from "../../../components/Hero";
import { Button } from "../../../components/Button";
import { useToast } from "../../../components/Toast";
import { Section } from "../chrome/Section";

// Placeholder SVG generado en el momento, sin depender de internet (mismo patrón que SurfacesGroup / AppBlocksGroup).
function phImage({ w = 1600, h = 900, label = "imagen", from = "#0f172a", to = "#2563eb", n = 1 }: { w?: number; h?: number; label?: string; from?: string; to?: string; n?: number } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="monospace" font-size="${h * 0.12}" font-weight="700" fill="rgba(255,255,255,0.85)">${n}</text>
<text x="${w / 2}" y="${h - 24}" text-anchor="middle" font-family="monospace" font-size="20" fill="rgba(255,255,255,0.6)" letter-spacing="3">${label.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const HERO_IMG = phImage({ w: 1600, h: 900, label: "hero", n: 3 });
const HERO_AVATAR = phImage({ w: 200, h: 200, label: "L", from: "#8b5cf6", to: "#2563eb", n: 7 });

function ZapIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function InboxIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function HeroSearchSection() {
  const { toast } = useToast();
  const [align, setAlign] = useState<"center" | "left">("center");

  return (
    <Section id="herosearch" title="HeroSearch" description="Cabecera con búsqueda como acción principal: sugerencias frecuentes en chips, resultados en vivo mientras se escribe, y submit con Enter o botón.">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["center", "left"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlign(a)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
              align === a ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
            }`}
          >
            {a === "center" ? "Centrado" : "Izquierda"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <HeroSearch
          eyebrow="1.284 propiedades activas"
          align={align}
          title="Encontrá tu próximo lugar"
          description="Filtrá por barrio, precio o metros. La búsqueda sugiere mientras escribís."
          placeholder="Barrio, calle o código…"
          cta="Buscar"
          suggestions={["Palermo", "Belgrano", "2 ambientes", "Con cochera"]}
          results={[
            { id: "1", label: "Palermo Hollywood", sub: "148 propiedades · CABA" },
            { id: "2", label: "Palermo Soho", sub: "92 propiedades · CABA" },
            { id: "3", label: "Belgrano R", sub: "61 propiedades · CABA" },
          ]}
          onSubmit={(q) => toast({ title: q ? `Buscando "${q}"` : "Escribí algo para buscar", variant: q ? "success" : "info" })}
        />
      </div>
    </Section>
  );
}

export function HeroImageSection() {
  const [overlay, setOverlay] = useState<"gradient" | "scrim" | "none">("gradient");

  return (
    <Section id="heroimage" title="HeroImage" description="Imagen a sangre con overlay legible, eyebrow, título, datos destacados y acciones. Alto fijo en px o aspect ratio.">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["gradient", "scrim", "none"] as const).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => setOverlay(o)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
              overlay === o ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
            }`}
          >
            {o === "gradient" ? "Degradado" : o === "scrim" ? "Scrim" : "Sin overlay"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <HeroImage
          src={HERO_IMG}
          overlay={overlay}
          height={360}
          eyebrow="Obra terminada"
          title="Casa Aldama"
          description="Reforma integral de 140 m² en dos plantas, con patio interior y carpintería a medida."
          meta={[{ label: "Superficie", value: "140 m²" }, { label: "Duración", value: "7 meses" }, { label: "Año", value: "2025" }]}
          actions={
            <>
              <Button size="md">Ver proyecto</Button>
              <Button size="md" variant="secondary">Galería</Button>
            </>
          }
        />
      </div>
    </Section>
  );
}

const HERO_TABS: HeroTab[] = [
  { id: "todo", label: "Todo", count: 128 },
  { id: "hoy", label: "Hoy", icon: <ZapIcon />, count: 12 },
  { id: "pendientes", label: "Pendientes", count: 7 },
  { id: "enviados", label: "Enviados" },
  { id: "borradores", label: "Borradores", count: 3 },
  { id: "archivo", label: "Archivo" },
  { id: "spam", label: "Spam", count: 41 },
  { id: "papelera", label: "Papelera" },
];

export function HeroTabsSection() {
  const [variant, setVariant] = useState<"underline" | "pill">("underline");
  const [tab, setTab] = useState("todo");

  const panels = Object.fromEntries(
    HERO_TABS.map((t) => [
      t.id,
      <div key={t.id} className="grid sm:grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface-alt/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t.label}</p>
            <p className="mt-2 text-sm text-foreground">Contenido {i + 1} de la pestaña.</p>
          </div>
        ))}
      </div>,
    ])
  );

  return (
    <Section id="herotabs" title="HeroTabs" description="Cabecera con muchas pestañas en poco ancho: scroll horizontal con drag y snap, degradados en los bordes que sólo aparecen si hay más contenido, y auto-scroll para que la pestaña activa siempre quede visible.">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["underline", "pill"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setVariant(v)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
              variant === v ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
            }`}
          >
            {v === "underline" ? "Underline" : "Pills"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <HeroTabs
          title="Bandeja de entrada"
          description="8 pestañas en el ancho que haya: probá arrastrar la fila."
          variant={variant}
          tabs={HERO_TABS}
          value={tab}
          onChange={setTab}
          panels={panels}
          actions={<Button size="sm" leftIcon={<PlusIcon />}>Nuevo</Button>}
        />
      </div>
    </Section>
  );
}

export function HeroWelcomeSection() {
  const { toast } = useToast();
  const [tone, setTone] = useState<"brand" | "surface">("brand");

  const quick = [
    { id: "enviar", label: "Enviar", icon: <SendIcon /> },
    { id: "cobrar", label: "Cobrar", icon: <InboxIcon /> },
    { id: "cargar", label: "Cargar", icon: <PlusIcon /> },
  ];

  return (
    <Section id="herowelcome" title="HeroWelcome" description="Saludo según la hora del dispositivo, avatar (o iniciales si no hay foto), dato destacado y accesos rápidos scrolables. Pensado para el home de una app instalada.">
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(["brand", "surface"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTone(t)}
            className={`h-8 px-3 rounded-lg text-xs font-semibold border transition-all active:scale-95 ${
              tone === t ? "bg-primary text-white border-primary" : "bg-surface text-foreground border-border hover:bg-surface-alt"
            }`}
          >
            {t === "brand" ? "Marca" : "Neutro"}
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border overflow-hidden bg-surface">
        <HeroWelcome
          tone={tone}
          name="Lucía Marín"
          avatar={HERO_AVATAR}
          subtitle="Cuenta personal · **** 4417"
          highlight={{ label: "Saldo disponible", value: "$248.320", delta: "+4,2%" }}
          quickActions={quick}
          onQuickAction={(id) => toast({ title: `Acción: ${id}`, variant: "info" })}
          actions={
            <button
              type="button"
              className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors ${
                tone === "brand" ? "bg-white/15 text-white hover:bg-white/25" : "border border-border text-foreground hover:bg-surface-alt"
              }`}
            >
              <BellIcon />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-current" />
            </button>
          }
        />
      </div>
    </Section>
  );
}

