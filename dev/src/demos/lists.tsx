import { useState } from "react";
import { ImageCounter } from "../../../components/ImageCounter";
import { SnackbarProvider, useSnackbar } from "../../../components/Snackbar";
import { DatePicker, type DateRange } from "../../../components/DatePicker";
import { TimePicker } from "../../../components/TimePicker";
import { Pagination } from "../../../components/Pagination";
import { PullToRefresh } from "../../../components/PullToRefresh";
import { Section, Card } from "../chrome/Section";

function phImage({ w = 800, h = 600, label = "imagen", from = "#2563eb", to = "#8b5cf6", n = 1 }: { w?: number; h?: number; label?: string; from?: string; to?: string; n?: number } = {}) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-family="monospace" font-size="${h * 0.12}" font-weight="700" fill="rgba(255,255,255,0.85)">${n}</text>
<text x="${w / 2}" y="${h - 18}" text-anchor="middle" font-family="monospace" font-size="14" fill="rgba(255,255,255,0.6)" letter-spacing="2">${label.toUpperCase()}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const FOTOS = ["Living", "Cocina", "Dormitorio", "Baño", "Balcón"].map((n, i) => ({
  src: phImage({ w: 800, h: 600, label: n, n: i + 1 }),
  alt: n,
  caption: n,
}));

export function ImageCounterSection() {
  const [index, setIndex] = useState(0);
  return (
    <Section id="imagecounter" title="ImageCounter" description="Galería de una imagen a la vez con el clásico contador «3 / 12» superpuesto. Arrastre horizontal, flechas, teclado y zoom opcional.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card title="Estilo pill + zoom">
          <ImageCounter images={FOTOS} counter="pill" badge="Destacada" thumbs zoomable index={index} onIndexChange={setIndex} />
        </Card>
        <Card title="Estilo bar (caption + contador)">
          <ImageCounter images={FOTOS} counter="bar" aspect={16 / 10} />
        </Card>
      </div>
    </Section>
  );
}

function SnackbarDemo() {
  const { snack, undo } = useSnackbar();
  return (
    <Card title="Disparar snacks — uno a la vez, cola FIFO">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => snack({ message: "Cambios publicados", variant: "success" })}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-primary text-white shadow-sm shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
        >
          Éxito
        </button>
        <button
          type="button"
          onClick={() => snack({ message: "No se pudo guardar", variant: "error", closeable: true })}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt active:scale-95 transition-all"
        >
          Error
        </button>
        <button
          type="button"
          onClick={() => undo("«Factura #1042» eliminada", () => snack({ message: "Restaurada", variant: "info" }))}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt active:scale-95 transition-all"
        >
          Con deshacer
        </button>
      </div>
    </Card>
  );
}

export function SnackbarSection() {
  return (
    <Section id="snackbar" title="Snackbar" description="Uno a la vez, cola FIFO, acción inline y swipe para descartar — a diferencia de Toast, que se acumula.">
      <SnackbarProvider position="bottom-center">
        <SnackbarDemo />
      </SnackbarProvider>
    </Section>
  );
}

export function DatePickerSection() {
  const [date, setDate] = useState<Date | null>(new Date());
  const [range, setRange] = useState<DateRange>({ from: null, to: null });

  return (
    <Section id="datepicker" title="DatePicker" description="Fecha simple o rango, con atajos, límites y días bloqueados (fines de semana, en este ejemplo).">
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <Card title="Simple + presets">
          <DatePicker
            value={date}
            onChange={(v) => setDate(v as Date | null)}
            label="Fecha de la visita"
            disabledDate={(d) => d.getDay() === 0 || d.getDay() === 6}
            presets={[{ label: "Hoy", value: () => new Date() }]}
          />
        </Card>
        <Card title="Rango · dos meses">
          <DatePicker mode="range" months={2} value={range} onChange={(v) => setRange(v as DateRange)} />
        </Card>
      </div>
    </Section>
  );
}

export function TimePickerSection() {
  const [time, setTime] = useState<string | null>("10:30");
  const [time12, setTime12] = useState<string | null>(null);

  return (
    <Section id="timepicker" title="TimePicker" description="Horario libre (horas/minutos), 12h o 24h, con atajos, límites y horarios bloqueados (almuerzo, en este ejemplo).">
      <div className="grid sm:grid-cols-2 gap-4 items-start">
        <Card title="24h · paso 15 min + límites">
          <TimePicker
            value={time}
            onChange={setTime}
            label="Hora de la reserva"
            step={15}
            min="09:00"
            max="18:00"
            disabledTime={(h) => h === 13}
            presets={[{ label: "Ahora", value: () => {
              const d = new Date();
              return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            } }]}
          />
        </Card>
        <Card title="12h · AM/PM">
          <TimePicker hour12 value={time12} onChange={setTime12} label="Hora de entrega" />
        </Card>
      </div>
    </Section>
  );
}

export function PaginationSection() {
  const [page, setPage] = useState(3);
  const [pageSize, setPageSize] = useState(20);
  return (
    <Section id="pagination" title="Pagination" description="Paginado numérico con elipsis, botones de extremos, resumen de rango y tamaño de página.">
      <Card>
        <Pagination page={page} total={248} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </Card>
    </Section>
  );
}

export function PullToRefreshSection() {
  const [items, setItems] = useState(["Pedido #1042", "Pedido #1041", "Pedido #1040", "Pedido #1039"]);
  const [n, setN] = useState(1043);

  return (
    <Section id="pulltorefresh" title="PullToRefresh" description="Gesto nativo de refresco: sólo arranca con el scroll arriba del todo, resistencia progresiva y flash de confirmación al terminar.">
      <Card title="Arrastrá hacia abajo desde arriba de la lista">
        <PullToRefresh
          height={260}
          onRefresh={async () => {
            await new Promise((r) => setTimeout(r, 900));
            setItems((prev) => [`Pedido #${n}`, ...prev]);
            setN((v) => v + 1);
          }}
        >
          <ul className="space-y-2 px-1">
            {items.map((it) => (
              <li key={it} className="rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm font-medium text-foreground">
                {it}
              </li>
            ))}
          </ul>
        </PullToRefresh>
      </Card>
    </Section>
  );
}

