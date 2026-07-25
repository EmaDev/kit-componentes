import { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  StatCard,
  MediaCard,
  ProfileCard,
  PricingCard,
  type CardVariant,
} from "../../../components/Card";
import { Carousel, type CarouselImage } from "../../../components/Carousel";
import { ImageZoom, ZoomableImage } from "../../../components/ImageZoom";
import { Tabs, type TabItem, type TabsVariant } from "../../../components/Tabs";
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

const CARD_VARIANTS: CardVariant[] = ["elevated", "outline", "flat", "gradient", "glass"];

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

function CardSection() {
  return (
    <Section id="cards" title="Card" description="Superficie base con 5 variantes + StatCard · MediaCard · ProfileCard · PricingCard.">
      <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {CARD_VARIANTS.map((v) => (
          <Card key={v} variant={v} padding="md" className="h-24 flex items-center justify-center">
            <span className="text-xs font-semibold text-foreground">{v}</span>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <PreviewCard title="Card + header/footer">
          <Card variant="elevated" padding="md">
            <CardHeader title="Ingresos del mes" subtitle="Julio 2026" />
            <p className="mt-3 text-sm text-muted">Resumen de facturación consolidada.</p>
            <CardFooter>
              <Button size="sm" variant="secondary">Exportar</Button>
              <Button size="sm">Ver detalle</Button>
            </CardFooter>
          </Card>
        </PreviewCard>

        <PreviewCard title="StatCard">
          <StatCard label="MRR" value="$48.2k" delta={12.4} tone="primary" spark={[8, 10, 9, 13, 15, 14, 18]} footnote="vs. mes anterior" />
        </PreviewCard>

        <PreviewCard title="MediaCard">
          <MediaCard
            src={phImage({ w: 1200, h: 900, label: "casa", from: "#0ea5a4", to: "#22c55e" })}
            badge="Nuevo"
            title="Casa Aldama"
            description="Reforma integral de 140 m²."
            actions={<Button size="sm">Ver</Button>}
          />
        </PreviewCard>

        <PreviewCard title="ProfileCard">
          <ProfileCard
            name="Lucía Marín"
            role="Product designer"
            cover
            stats={[{ label: "Proyectos", value: 12 }, { label: "Equipo", value: 4 }]}
            actions={<Button size="sm" fullWidth>Ver perfil</Button>}
          />
        </PreviewCard>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <PreviewCard title="MediaCard horizontal">
          <MediaCard
            src={phImage({ w: 900, h: 900, label: "plano", from: "#f59e0b", to: "#ef4444" })}
            badge="A-01"
            title="Departamento en Palermo"
            description="2 ambientes, luz natural todo el día."
            horizontal
            actions={<Button size="sm" variant="secondary">Ver plano</Button>}
          />
        </PreviewCard>

        <PreviewCard title="PricingCard destacado">
          <PricingCard
            plan="Pro"
            price="$29"
            highlight
            badge="Popular"
            features={["Proyectos ilimitados", "Soporte prioritario", "Exportación avanzada"]}
            cta={<Button fullWidth>Elegir Pro</Button>}
          />
        </PreviewCard>
      </div>
    </Section>
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

export function SurfacesGroup() {
  return (
    <>
      <CardSection />
      <CarouselSection />
      <ImageZoomSection />
      <TabsSection />
    </>
  );
}
