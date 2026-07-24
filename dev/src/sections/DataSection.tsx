import { useState } from "react";
import { DataTable, type Column } from "../../../components/DataTable";
import { Spreadsheet } from "../../../components/Spreadsheet";
import { CalendarGrid, type CalendarEvent } from "../../../components/CalendarGrid";
import { Card } from "./Layout";

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

export function DataSection() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-6">
      <Card title="DataTable">
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

      <Card title="Spreadsheet">
        <Spreadsheet
          rows={12}
          cols={6}
          height="300px"
          headerRow
          initial={{ A1: "Mes", B1: "Ingresos", A2: "Enero", B2: "1200", A3: "Febrero", B3: "1450", B4: "=SUM(B2:B3)" }}
        />
      </Card>

      <Card title="CalendarGrid">
        <CalendarGrid events={EVENTS} weekStartsOn={1} maxPerDay={3} />
      </Card>
    </div>
  );
}
