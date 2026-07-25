import { useState } from "react";
import {
  Card,
  StatCard,
  MediaCard,
  ProfileCard,
  PricingCard,
  type CardVariant,
} from "../../../components/Card";
import { Carousel, type CarouselImage } from "../../../components/Carousel";
import { ImageZoom, ZoomableImage } from "../../../components/ImageZoom";
import { Tabs, type TabItem, type TabsVariant } from "../../../components/Tabs";
import { ScrollArea, type ScrollAreaVariant } from "../../../components/ScrollArea";
import { Footer } from "../../../components/Footer";
import { Button } from "../../../components/Button";
import { Section, Card as PreviewCard } from "../chrome/Section";

// Placeholders SVG generados en el momento (sin depender de internet): grilla fina
// + numeración, así al hacer zoom en ImageZoom/Carousel se ve detalle real.
function phImage({
  w = 1600, h = 900, label = "imagen", from = "#2563eb", to = "#8b5cf6", n = 1,
}: { w?: number; h?: number; label?: string; from?: string; to?: string; n?: number } = {}) {
  const cell = 50;
  let grid = "";
  for (let x = 0; x <= w; x += cell) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  for (let y = 0; y <= h; y += cell) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g stroke="rgba(255,255,255,0.16)" stroke-width="1">${grid}</g>
<circle cx="${w / 2}" cy="${h / 2}" r="${h * 0.28}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" font-family="monospace" font-size="${h * 0.13}" font-weight="700" fill="rgba(255,255,255,0.9)">${n}</text>
<text x="${w / 2}" y="${h / 2 + h * 0.09}" text-anchor="middle" font-family="monospace" font-size="${h * 0.045}" fill="rgba(255,255,255,0.75)" letter-spacing="4">${label.toUpperCase()}</text>
<text x="${w / 2}" y="${h - 24}" text-anchor="middle" font-family="monospace" font-size="20" fill="rgba(255,255,255,0.55)">${w} × ${h}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PH_PALETTE: [string, string][] = [
  ["#2563eb", "#8b5cf6"], ["#0ea5a4", "#22c55e"], ["#f59e0b", "#ef4444"],
  ["#8b5cf6", "#ec4899"], ["#334155", "#0f172a"], ["#0284c7", "#06b6d4"],
];

function phSet(labels: string[], size: { w: number; h: number } = { w: 1600, h: 900 }): CarouselImage[] {
  return labels.map((label, i) => {
    const [from, to] = PH_PALETTE[i % PH_PALETTE.length];
    return { src: phImage({ ...size, label, from, to, n: i + 1 }), alt: label, caption: label };
  });
}

const GALLERY = phSet(["Living", "Cocina", "Dormitorio", "Balcón", "Baño"]);

const TAB_ITEMS: TabItem[] = [
  { id: "resumen", label: "Resumen" },
  { id: "actividad", label: "Actividad", badge: 3 },
  { id: "archivado", label: "Archivado", disabled: true },
];

const TAB_VARIANTS: { id: TabsVariant; label: string }[] = [
  { id: "underline", label: "underline" },
  { id: "pill", label: "pill" },
  { id: "segmented", label: "segmented" },
  { id: "enclosed", label: "enclosed" },
  { id: "vertical", label: "vertical" },
];

const VARIANT_PICKS: { id: CardVariant; label: string; accent: string }[] = [
  { id: "elevated", label: "Elevada", accent: "border-rose-300 text-rose-600 dark:border-rose-800 dark:text-rose-400" },
  { id: "outline", label: "Contorno", accent: "border-accent/40 text-accent" },
  { id: "flat", label: "Plana", accent: "border-border text-muted" },
  { id: "gradient", label: "Gradiente", accent: "border-orange-300 text-orange-600 dark:border-orange-800 dark:text-orange-400" },
  { id: "glass", label: "Glass", accent: "border-primary/40 text-primary" },
];

function CardSection() {
  const [variant, setVariant] = useState<CardVariant>("glass");

  return (
    <Section
      id="cards"
      title="Card"
      description="Una superficie base con 5 variantes y 4 paddings, más cuatro cards ya armadas sobre ella: KPI con sparkline, media card (vertical u horizontal), perfil y plan de precios."
    >
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted mr-1">Variante</span>
        {VARIANT_PICKS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariant(v.id)}
            className={[
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
              variant === v.id ? "bg-primary text-white border-primary shadow-sm shadow-primary/30" : `bg-surface ${v.accent}`,
            ].join(" ")}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard variant={variant} label="MRR" value="$48.2k" delta={12.4} tone="primary" icon={<ChartIcon />} spark={[8, 10, 9, 13, 15, 14, 18]} />
        <StatCard variant={variant} label="Usuarios activos" value="9.481" delta={4.1} tone="success" icon={<UsersIcon />} spark={[5, 6, 6, 7, 8, 7, 9]} />
        <StatCard variant={variant} label="Churn" value="2.3" unit="%" delta={-0.8} tone="danger" icon={<FlagIcon />} spark={[3, 3.4, 3, 2.8, 2.5, 2.6, 2.3]} />
        <StatCard variant={variant} label="Tickets" value={37} delta={-15} tone="accent" icon={<MailIcon />} spark={[60, 55, 50, 45, 40, 38, 37]} />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <MediaCard
          variant={variant}
          src={phImage({ w: 900, h: 700, label: "fachada norte", from: "#6d28d9", to: "#4338ca", n: 1 })}
          badge="Nuevo"
          title="Casa Aldama"
          description="Reforma integral de 140 m² con patio interior y galería vidriada."
          meta={<span>Córdoba · 140 m²</span>}
          actions={
            <>
              <Button size="sm">Ver proyecto</Button>
              <Button size="sm" variant="ghost">Compartir</Button>
            </>
          }
        />

        <ProfileCard
          variant={variant}
          name="Lucía Marín"
          role="Product designer · Equipo Producto"
          cover
          stats={[{ label: "Proyectos", value: 12 }, { label: "Equipos", value: 3 }, { label: "Años", value: 5 }]}
          actions={
            <>
              <Button size="sm" fullWidth>Mensaje</Button>
              <Button size="sm" variant="secondary" fullWidth>Perfil</Button>
            </>
          }
        />

        <MediaCard
          variant={variant}
          src={phImage({ w: 700, h: 700, label: "living", from: "#f97316", to: "#ea580c", n: 3 })}
          badge="3"
          title="Living reformado"
          description="Antes y después del estar principal."
          meta={<span>hace 2 días</span>}
          horizontal
        />

        <Card variant={variant} padding="md">
          <p className="text-[15px] font-semibold leading-snug text-foreground mb-2">Card base, sin adornos</p>
          <p className="text-sm text-muted leading-relaxed">
            La superficie sola: componé lo que quieras adentro con{" "}
            <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">CardMedia</code>,{" "}
            <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">CardHeader</code>{" "}
            y <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded">CardFooter</code>.
          </p>
          <div className="mt-4 flex items-center justify-between">
            <Button size="sm" variant="secondary">Acción</Button>
            <span className="text-[11px] font-mono text-muted">padding=&quot;md&quot;</span>
          </div>
        </Card>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <PricingCard
          plan="Starter"
          price="$0"
          description="Para probar la librería en un proyecto chico."
          features={["1 proyecto", "Componentes atómicos", "Tema claro/oscuro"]}
          cta={<Button variant="secondary" fullWidth>Empezar</Button>}
        />
        <PricingCard
          plan="Pro"
          price="$29"
          highlight
          badge="Popular"
          description="Todo lo que necesita un equipo de producto."
          features={["Proyectos ilimitados", "Datos y grillas", "Moléculas PWA", "Soporte prioritario"]}
          cta={<Button fullWidth>Elegir Pro</Button>}
        />
        <PricingCard
          plan="Enterprise"
          price="A medida"
          period=""
          description="Con revisión de accesibilidad y onboarding."
          features={["SSO y auditoría", "Datos y grillas propios", "SLA 99.9%"]}
          cta={<Button variant="outline" fullWidth>Hablar con ventas</Button>}
        />
      </div>
    </Section>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V10M12 19V5M20 19v-7" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19a5.7 5.7 0 0 1 11 0" />
      <path d="M16 8.4a3 3 0 1 1 0 5.8" />
      <path d="M15.5 14.6c2.4.4 4 1.9 4.4 4.4" />
    </svg>
  );
}
function FlagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21V4" />
      <path d="M5 5h13l-3 4 3 4H5" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function CarouselSection() {
  return (
    <Section id="carousel" title="Carrusel" description="Drag, flechas, dots, miniaturas, autoplay y zoom al hacer click en un slide.">
      <div className="grid lg:grid-cols-2 gap-4">
        <PreviewCard title="Peek + autoplay">
          <Carousel images={GALLERY} perView={2} peek={56} aspect={16 / 9} loop autoplay={2600} />
        </PreviewCard>
        <PreviewCard title="Miniaturas + zoom">
          <Carousel images={GALLERY} thumbs zoomable aspect={4 / 3} />
        </PreviewCard>
      </div>
    </Section>
  );
}

function ImageZoomSection() {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <Section id="imagezoom" title="Imagen con zoom" description="Visor pan + zoom a pantalla completa que bloquea el resto de la página mientras está abierto.">
      <div className="grid lg:grid-cols-2 gap-4">
        <PreviewCard title="ZoomableImage — una sola imagen">
          <div className="max-w-sm">
            <ZoomableImage src={phImage({ label: "plano", from: "#334155", to: "#0f172a" })} caption="A-01 · 1:50" />
          </div>
        </PreviewCard>

        <PreviewCard title="Visor controlado — galería con prev/next">
          <div className="grid grid-cols-3 gap-2">
            {GALLERY.map((img, i) => (
              <button key={i} type="button" onClick={() => setIndex(i)}
                className="relative aspect-square overflow-hidden rounded-xl border border-border cursor-zoom-in">
                <img src={img.src} alt={img.alt} className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted leading-relaxed">
            Click en una miniatura → abre el visor compartido con <code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">onPrev</code>/<code className="font-mono bg-surface-alt px-1.5 py-0.5 rounded">onNext</code> para recorrer la galería sin cerrarlo.
          </p>
          <ImageZoom
            open={index != null}
            src={index != null ? GALLERY[index].src : ""}
            alt={index != null ? GALLERY[index].alt : ""}
            caption={index != null ? GALLERY[index].caption : undefined}
            onClose={() => setIndex(null)}
            onPrev={() => setIndex((i) => (i == null ? i : (i - 1 + GALLERY.length) % GALLERY.length))}
            onNext={() => setIndex((i) => (i == null ? i : (i + 1) % GALLERY.length))}
          />
        </PreviewCard>
      </div>
    </Section>
  );
}

function TabsSection() {
  const [tab, setTab] = useState("resumen");
  const panels = {
    resumen: <p className="text-sm text-muted">Vista general de la cuenta.</p>,
    actividad: <p className="text-sm text-muted">Últimos 3 eventos registrados.</p>,
    archivado: <p className="text-sm text-muted">Sin elementos archivados.</p>,
  };
  return (
    <Section id="tabs" title="Tabs" description="5 estilos: underline · pill · segmented · enclosed · vertical.">
      <div className="grid md:grid-cols-2 gap-4">
        {TAB_VARIANTS.map(({ id, label }) => (
          <PreviewCard key={id} title={label}>
            <Tabs
              items={TAB_ITEMS}
              value={tab}
              onChange={setTab}
              variant={id}
              fitted={id !== "vertical"}
              panels={panels}
            />
          </PreviewCard>
        ))}
      </div>
    </Section>
  );
}

const SCROLLAREA_VARIANTS: { id: ScrollAreaVariant; label: string; hint: string }[] = [
  { id: "thin", label: "thin", hint: "Invisible en reposo, aparece con fade al hacer hover o scrollear." },
  { id: "pill", label: "pill", hint: "Siempre visible atenuada; se ensancha y se pinta primary al activarse." },
  { id: "glow", label: "glow", hint: "Gradiente primary → accent con resplandor permanente." },
];

const SCROLL_ITEMS = Array.from({ length: 24 }, (_, i) => `Elemento ${i + 1}`);

function ScrollAreaSection() {
  return (
    <Section
      id="scrollarea"
      title="ScrollArea"
      description="Reemplaza el scroll nativo por una barra propia, arrastrable — 3 variantes de grosor y animación."
    >
      <div className="grid md:grid-cols-3 gap-4">
        {SCROLLAREA_VARIANTS.map(({ id, label, hint }) => (
          <PreviewCard key={id} title={label}>
            <ScrollArea variant={id} maxHeight={240} className="rounded-xl border border-border">
              <div className="flex flex-col gap-2 p-3">
                {SCROLL_ITEMS.map((item) => (
                  <div key={item} className="rounded-lg bg-surface-alt px-3 py-2 text-sm text-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <p className="mt-3 text-[11px] text-muted leading-relaxed">{hint}</p>
          </PreviewCard>
        ))}
      </div>
    </Section>
  );
}

function FooterSection() {
  return (
    <Section id="footer" title="Footer" description="Marca + redes, columnas de links con reveal animado, newsletter y barra inferior con volver-arriba.">
      <div className="rounded-2xl border border-border overflow-hidden">
        <Footer
          brand={<span className="font-bold text-foreground">Logo</span>}
          description="Componentes atómicos + moléculas PWA, listos para instalar."
          socials={[
            { label: "GitHub", href: "#", icon: <GithubIcon /> },
            { label: "X", href: "#", icon: <XIcon /> },
          ]}
          groups={[
            { title: "Producto", links: [{ label: "Componentes", href: "#" }, { label: "Hooks", href: "#" }, { label: "Playground", href: "#" }] },
            { title: "Compañía", links: [{ label: "Repositorio", href: "#" }, { label: "Changelog", href: "#" }] },
          ]}
          newsletter={{
            description: "Novedades de la librería, sin spam.",
            onSubmit: () => new Promise((resolve) => setTimeout(resolve, 900)),
          }}
          bottomLinks={[{ label: "Privacidad", href: "#" }, { label: "Términos", href: "#" }]}
        />
      </div>
    </Section>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.3 22H1.2l8.1-9.3L1 2h7.3l5 6.6L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z" />
    </svg>
  );
}

export function SurfacesGroup() {
  return (
    <>
      <CardSection />
      <CarouselSection />
      <ImageZoomSection />
      <TabsSection />
      <ScrollAreaSection />
      <FooterSection />
    </>
  );
}
