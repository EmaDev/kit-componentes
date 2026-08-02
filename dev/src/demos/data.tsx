import { useEffect, useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { AnimatedTable } from "../../../components/AnimatedTable";
import { ExpandableTable } from "../../../components/ExpandableTable";
import { Spreadsheet } from "../../../components/Spreadsheet";
import { CalendarGrid, type CalendarEvent } from "../../../components/CalendarGrid";
import { Section, Card } from "../chrome/Section";

interface Person {
  id: string;
  name: string;
  email: string;
  mrr: number;
  status: "active" | "trial" | "churned";
}

const PEOPLE: Person[] = [
  { id: "1", name: "Ana Torres", email: "ana@empresa.com", mrr: 240, status: "active" },
  { id: "2", name: "Bruno Díaz", email: "bruno@empresa.com", mrr: 90, status: "trial" },
  { id: "3", name: "Carla Ruiz", email: "carla@empresa.com", mrr: 0, status: "churned" },
  { id: "4", name: "Diego Paz", email: "diego@empresa.com", mrr: 480, status: "active" },
  { id: "5", name: "Elena Sosa", email: "elena@empresa.com", mrr: 150, status: "active" },
];

const columns: Column<Person>[] = [
  { key: "name", header: "Persona", width: "minmax(160px,1.4fr)" },
  { key: "email", header: "Email", hideOnMobile: true },
  { key: "mrr", header: "MRR", align: "right", sortValue: (r) => r.mrr, render: (r) => `$${r.mrr}` },
  { key: "status", header: "Estado" },
];

const today = new Date();
const EVENTS: CalendarEvent[] = [
  { id: "e1", title: "Kickoff", start: new Date(today.getFullYear(), today.getMonth(), 5), color: "primary" },
  { id: "e2", title: "Revisión", start: new Date(today.getFullYear(), today.getMonth(), 12), color: "accent" },
  { id: "e3", title: "Entrega", start: new Date(today.getFullYear(), today.getMonth(), 20), color: "success" },
];

export function DataTableSection() {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <Section id="datatable" title="DataTable" description="Orden, búsqueda, selección, paginado y header sticky.">
      <Card>
        <DataTable
          columns={columns}
          rows={PEOPLE}
          rowKey={(r) => r.id}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          searchable
          pageSize={4}
          stickyHeader
          maxHeight="320px"
        />
      </Card>
    </Section>
  );
}

export function SpreadsheetSection() {
  return (
    <Section id="spreadsheet" title="Spreadsheet" description="Hoja de cálculo editable con fórmulas y atajos de Excel.">
      <Card>
        <Spreadsheet
          rows={12}
          cols={6}
          height="300px"
          headerRow
          initial={{ A1: "Mes", B1: "Ingresos", A2: "Enero", B2: "1200", A3: "Febrero", B3: "1450", B4: "=SUM(B2:B3)" }}
        />
      </Card>
    </Section>
  );
}

export function CalendarSection() {
  return (
    <Section id="calendar" title="CalendarGrid" description="Grilla mensual con eventos, click en día/evento y semanas adyacentes.">
      <Card>
        <CalendarGrid events={EVENTS} weekStartsOn={1} maxPerDay={3} />
      </Card>
    </Section>
  );
}

interface Ticker {
  id: string;
  ticker: string;
  price: number;
  change: number;
}

const TICKERS: Ticker[] = [
  { id: "1", ticker: "GGAL", price: 6420, change: 2.4 },
  { id: "2", ticker: "YPFD", price: 41850, change: -1.2 },
  { id: "3", ticker: "PAMP", price: 3190, change: 0.8 },
  { id: "4", ticker: "TXAR", price: 1075, change: 4.1 },
  { id: "5", ticker: "ALUA", price: 1240, change: -0.5 },
];

const tickerColumns: Column<Ticker>[] = [
  { key: "ticker", header: "Activo", width: "120px" },
  // Sin `render`: highlightChanges sólo resalta las columnas que muestran el valor crudo.
  { key: "price", header: "Precio", align: "right" },
  { key: "change", header: "Var. %", align: "right" },
];

export function AnimatedTableSection() {
  const [rows, setRows] = useState(TICKERS);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      setRows((rs) =>
        rs.map((r) => {
          const delta = Math.round((Math.random() - 0.5) * r.price * 0.03);
          return { ...r, price: r.price + delta, change: Number((r.change + (Math.random() - 0.5)).toFixed(1)) };
        }),
      );
    }, 1800);
    return () => clearInterval(id);
  }, [live]);

  return (
    <Section
      id="animatedtable"
      title="AnimatedTable"
      description="Orden con reacomodo animado de las filas (FLIP) y resalte de las celdas que cambian de valor. Comparte el tipo Column<T> con DataTable."
    >
      <Card>
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLive((l) => !l)}
            className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold active:scale-[0.98] transition-all"
          >
            {live ? "Detener datos en vivo" : "Simular datos en vivo"}
          </button>
          <p className="text-xs text-muted">Ordená por «Var. %» con la simulación activa para ver el reacomodo.</p>
        </div>
        <AnimatedTable columns={tickerColumns} rows={rows} rowKey={(r) => r.id} highlightChanges density="compact" />
      </Card>
    </Section>
  );
}

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  total: number;
  items: { nombre: string; cantidad: number; precio: number }[];
}

const PEDIDOS: Pedido[] = [
  {
    id: "1", numero: "#A-10428", cliente: "Ana Torres", total: 48200,
    items: [
      { nombre: "Silla Aldama", cantidad: 2, precio: 18600 },
      { nombre: "Almohadón lino", cantidad: 1, precio: 11000 },
    ],
  },
  {
    id: "2", numero: "#A-10429", cliente: "Bruno Díaz", total: 12400,
    items: [{ nombre: "Mesa auxiliar", cantidad: 1, precio: 12400 }],
  },
  {
    id: "3", numero: "#A-10430", cliente: "Carla Ruiz", total: 96800,
    items: [
      { nombre: "Sofá 3 cuerpos", cantidad: 1, precio: 82000 },
      { nombre: "Manta tejida", cantidad: 2, precio: 7400 },
    ],
  },
];

const pedidoColumns: Column<Pedido>[] = [
  { key: "numero", header: "Pedido", width: "130px" },
  { key: "cliente", header: "Cliente" },
  { key: "total", header: "Total", align: "right", render: (p) => `$${p.total.toLocaleString("es-AR")}` },
];

export function ExpandableTableSection() {
  return (
    <Section
      id="expandabletable"
      title="ExpandableTable"
      description="Click en una fila revela un panel de detalle animado. Con multiple se pueden abrir varias; sin él funciona como acordeón."
    >
      <Card>
        <ExpandableTable
          columns={pedidoColumns}
          rows={PEDIDOS}
          rowKey={(p) => p.id}
          defaultExpanded={["1"]}
          multiple
          renderDetail={(p) => (
            <ul className="space-y-1.5">
              {p.items.map((it) => (
                <li key={it.nombre} className="flex items-center justify-between text-xs">
                  <span className="text-foreground">
                    {it.cantidad} × {it.nombre}
                  </span>
                  <span className="font-semibold text-muted tabular-nums">
                    ${(it.cantidad * it.precio).toLocaleString("es-AR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        />
      </Card>
    </Section>
  );
}

