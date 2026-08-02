import { useState } from "react";
import { ActivityTimeline, type TimelineEvent } from "../../../components/ActivityTimeline";
import { BranchingTimeline, type BranchNode } from "../../../components/BranchingTimeline";
import { TrackingStepper, type TrackingStep } from "../../../components/TrackingStepper";
import { TimelineComments, type CommentableEvent } from "../../../components/TimelineComments";
import { GroupedActivityFeed, type FeedEvent } from "../../../components/GroupedActivityFeed";
import { AuditLog, type AuditEntry } from "../../../components/AuditLog";
import { Roadmap, type RoadmapItem } from "../../../components/Roadmap";
import { HowItWorksTimeline, type HowItWorksStep } from "../../../components/HowItWorksTimeline";
import { KanbanBoard, type KanbanColumn } from "../../../components/KanbanBoard";
import { KanbanBoardMobile } from "../../../components/KanbanBoardMobile";
import { Section, Card } from "../chrome/Section";

const EVENTS: TimelineEvent[] = [
  { id: "1", title: "Pedido creado", time: "10:02", status: "done" },
  { id: "2", title: "Pago confirmado", time: "10:05", status: "done" },
  { id: "3", title: "Preparando envío", time: "10:40", status: "current" },
  { id: "4", title: "Entregado", time: "—", status: "pending" },
];

export function ActivityTimelineSection() {
  return (
    <Section id="activitytimeline" title="ActivityTimeline" description="Línea de tiempo vertical de eventos con estado done/current/pending/error.">
      <Card>
        <ActivityTimeline events={EVENTS} />
      </Card>
    </Section>
  );
}

const BRANCH_NODES: BranchNode[] = [
  {
    id: "1", title: "Solicitud recibida", time: "09:00", status: "done",
    children: [
      { id: "2a", title: "Aprobada por sistema", time: "09:02", status: "done" },
      { id: "2b", title: "Derivada a revisión manual", time: "09:02", status: "current" },
    ],
  },
];

export function BranchingTimelineSection() {
  return (
    <Section id="branchingtimeline" title="BranchingTimeline" description="Línea de tiempo con ramificaciones — árbol de decisiones o flujo con caminos alternativos.">
      <Card>
        <BranchingTimeline nodes={BRANCH_NODES} />
      </Card>
    </Section>
  );
}

const TRACKING_STEPS: TrackingStep[] = [
  { id: "1", label: "Pedido confirmado", time: "Lun 10:05", status: "done" },
  { id: "2", label: "En preparación", time: "Lun 11:30", status: "done" },
  { id: "3", label: "En camino", time: "Mar 09:15", status: "current" },
  { id: "4", label: "Entregado", status: "pending" },
];

export function TrackingStepperSection() {
  return (
    <Section id="trackingstepper" title="TrackingStepper" description="Pasos de seguimiento tipo envío/pedido, con hora y estado.">
      <Card>
        <TrackingStepper steps={TRACKING_STEPS} />
      </Card>
    </Section>
  );
}

export function TimelineCommentsSection() {
  const [events, setEvents] = useState<CommentableEvent[]>([
    {
      id: "1", title: "Diseño aprobado", time: "hace 2 días", status: "done",
      notes: [{ id: "n1", author: "Ana", text: "Quedó perfecto, gracias!", time: "hace 2 días" }],
    },
    { id: "2", title: "En desarrollo", time: "hoy", status: "current", notes: [] },
  ]);
  return (
    <Section id="timelinecomments" title="TimelineComments" description="Eventos con hilo de notas/comentarios por evento.">
      <Card>
        <TimelineComments
          events={events}
          currentUser="Vos"
          onAddNote={(eventId, text) =>
            setEvents((evs) =>
              evs.map((e) =>
                e.id === eventId
                  ? { ...e, notes: [...e.notes, { id: `n${Date.now()}`, author: "Vos", text, time: "ahora" }] }
                  : e,
              ),
            )
          }
        />
      </Card>
    </Section>
  );
}

const today = new Date();
const FEED_EVENTS: FeedEvent[] = [
  { id: "1", date: today, title: "Actualizó el perfil" },
  { id: "2", date: today, title: "Subió 3 fotos nuevas" },
  { id: "3", date: new Date(today.getTime() - 86400000), title: "Creó el proyecto \"Casa Aldama\"" },
];

export function GroupedActivityFeedSection() {
  return (
    <Section id="groupedactivityfeed" title="GroupedActivityFeed" description="Feed de actividad agrupado por fecha.">
      <Card>
        <GroupedActivityFeed events={FEED_EVENTS} />
      </Card>
    </Section>
  );
}

const AUDIT_ENTRIES: AuditEntry[] = [
  { id: "1", actor: "Ana Torres", action: "Editó el precio", time: "hace 2h", changes: [{ field: "precio", from: "$100", to: "$120" }] },
  { id: "2", actor: "Bruno Díaz", action: "Cambió el estado", time: "hace 5h", changes: [{ field: "estado", from: "borrador", to: "publicado" }] },
];

export function AuditLogSection() {
  return (
    <Section id="auditlog" title="AuditLog" description="Historial de auditoría con cambios de campo (from → to) por entrada.">
      <Card>
        <AuditLog entries={AUDIT_ENTRIES} />
      </Card>
    </Section>
  );
}

const ROADMAP_ITEMS: RoadmapItem[] = [
  { id: "1", title: "Modo offline", quarter: "Q2 2026", status: "shipped" },
  { id: "2", title: "Exportar a Excel", quarter: "Q3 2026", status: "in-progress" },
  { id: "3", title: "App de escritorio", quarter: "Q4 2026", status: "planned" },
];

export function RoadmapSection() {
  return (
    <Section id="roadmap" title="Roadmap" description="Roadmap de producto por trimestre, con estado shipped/in-progress/planned.">
      <Card>
        <Roadmap items={ROADMAP_ITEMS} />
      </Card>
    </Section>
  );
}

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { id: "1", title: "Creá tu cuenta", description: "Registrate con tu email en menos de un minuto." },
  { id: "2", title: "Elegí un plan", description: "Empezá gratis o pasate a Pro cuando lo necesites." },
  { id: "3", title: "Invitá a tu equipo", description: "Sumá a quien quieras, sin límite de asientos." },
];

export function HowItWorksTimelineSection() {
  return (
    <Section id="howitworkstimeline" title="HowItWorksTimeline" description="Pasos numerados 'cómo funciona', horizontal o vertical.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card title="horizontal">
          <HowItWorksTimeline steps={HOW_IT_WORKS_STEPS} orientation="horizontal" />
        </Card>
        <Card title="vertical">
          <HowItWorksTimeline steps={HOW_IT_WORKS_STEPS} orientation="vertical" />
        </Card>
      </div>
    </Section>
  );
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: "todo", title: "Por hacer", cards: [{ id: "1", title: "Diseñar login", tag: "UI" }, { id: "2", title: "Definir paleta" }] },
  { id: "doing", title: "En curso", cards: [{ id: "3", title: "Armar Navbar", tag: "Front" }], limit: 3 },
  { id: "done", title: "Hecho", cards: [{ id: "4", title: "Setup del repo" }] },
];

export function KanbanSection() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [mobileColumns, setMobileColumns] = useState(INITIAL_COLUMNS);
  return (
    <Section id="kanban" title="KanbanBoard · KanbanBoardMobile" description="Tablero Kanban de escritorio con drag & drop nativo, y su variante táctil de una columna a la vez.">
      <Card title="KanbanBoard (escritorio)" className="mb-4">
        <KanbanBoard columns={columns} onChange={setColumns} />
      </Card>
      <Card title="KanbanBoardMobile (táctil)">
        <div className="relative max-w-sm h-96">
          <KanbanBoardMobile columns={mobileColumns} onChange={setMobileColumns} />
        </div>
      </Card>
    </Section>
  );
}

