import { useState } from "react";
import { ItineraryTimeline, type ItineraryDay } from "../../../components/ItineraryTimeline";
import { TripRouteMap, type RouteStop } from "../../../components/TripRouteMap";
import { TripBudgetSummary, type TripBudgetCategory } from "../../../components/TripBudgetSummary";
import { TripChecklist, type ChecklistItem } from "../../../components/TripChecklist";
import { GroupedTaskList, type TaskGroup } from "../../../components/GroupedTaskList";
import { TaskCard, type TaskCardData } from "../../../components/TaskCard";
import { Section, Card } from "../chrome/Section";

const DAYS: ItineraryDay[] = [
  {
    date: new Date("2026-08-10"),
    activities: [
      { id: "1", kind: "flight", title: "Vuelo a Lisboa", time: "08:40", endTime: "14:10", location: "EZE → LIS" },
      { id: "2", kind: "hotel", title: "Check-in Hotel Alfama", time: "16:00" },
      { id: "3", kind: "food", title: "Cena en Time Out Market", time: "20:30" },
    ],
  },
  {
    date: new Date("2026-08-11"),
    activities: [
      { id: "4", kind: "activity", title: "Tour a pie por Belém", time: "10:00" },
      { id: "5", kind: "transport", title: "Tranvía 28", time: "15:00" },
    ],
  },
];

export function ItineraryTimelineSection() {
  return (
    <Section id="itinerarytimeline" title="ItineraryTimeline" description="Itinerario día por día: tira de días + línea de tiempo de actividades.">
      <Card>
        <ItineraryTimeline days={DAYS} />
      </Card>
    </Section>
  );
}

const STOPS: RouteStop[] = [
  { id: "lis", name: "Lisboa", country: "Portugal", startDate: new Date("2026-08-10"), endDate: new Date("2026-08-14") },
  { id: "por", name: "Oporto", country: "Portugal", startDate: new Date("2026-08-14"), endDate: new Date("2026-08-17") },
];

export function TripRouteMapSection() {
  const [active, setActive] = useState<string | undefined>("lis");
  return (
    <Section id="triproutemap" title="TripRouteMap" description="Resumen de ruta: destinos encadenados con fechas y noches, sin mapa real.">
      <Card>
        <TripRouteMap stops={STOPS} value={active} onSelect={setActive} />
      </Card>
    </Section>
  );
}

const BUDGET_CATEGORIES: TripBudgetCategory[] = [
  { id: "alojamiento", label: "Alojamiento", spent: 420000, planned: 500000 },
  { id: "comida", label: "Comida", spent: 180000, planned: 150000 },
  { id: "transporte", label: "Transporte", spent: 90000, planned: 120000 },
];

export function TripBudgetSummarySection() {
  return (
    <Section id="tripbudgetsummary" title="TripBudgetSummary" description="Presupuesto de viaje: anillo total + categorías.">
      <Card>
        <TripBudgetSummary categories={BUDGET_CATEGORIES} currency="ARS" />
      </Card>
    </Section>
  );
}

export function TripChecklistSection() {
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: "1", label: "Pasaporte", checked: true },
    { id: "2", label: "Cargador", checked: false },
    { id: "3", label: "Adaptador de enchufe", checked: false },
  ]);
  return (
    <Section id="tripchecklist" title="TripChecklist" description="Checklist simple con progreso (equipaje, pendientes).">
      <Card>
        <TripChecklist
          title="Equipaje de mano"
          items={items}
          onToggle={(id) => setItems((its) => its.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)))}
        />
      </Card>
    </Section>
  );
}

export function GroupedTaskListSection() {
  const [groups, setGroups] = useState<TaskGroup[]>([
    {
      id: "d1", label: "Día 1", sublabel: "10 de agosto",
      items: [
        { id: "t1", label: "Confirmar traslado al aeropuerto", checked: false },
        { id: "t2", label: "Hacer el check-in online", checked: true },
      ],
    },
    { id: "d2", label: "Día 2", sublabel: "11 de agosto", items: [{ id: "t3", label: "Reservar el tour", checked: false }] },
  ]);
  return (
    <Section id="groupedtasklist" title="GroupedTaskList" description="Tareas agrupadas por día/categoría, colapsables.">
      <Card>
        <GroupedTaskList
          groups={groups}
          onToggle={(groupId, itemId) =>
            setGroups((gs) =>
              gs.map((g) =>
                g.id === groupId
                  ? { ...g, items: g.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)) }
                  : g,
              ),
            )
          }
        />
      </Card>
    </Section>
  );
}

export function TaskCardSection() {
  const [task, setTask] = useState<TaskCardData>({
    id: "1", title: "Armar valija", priority: "high", dueDate: new Date("2026-08-09"),
    subtasks: [
      { id: "s1", label: "Ropa de abrigo", done: true },
      { id: "s2", label: "Adaptador de enchufe", done: false },
    ],
  });
  return (
    <Section id="taskcard" title="TaskCard" description="Tarea con subtareas, prioridad y fecha límite.">
      <Card>
        <TaskCard
          task={task}
          onToggleDone={() => setTask((t) => ({ ...t, done: !t.done }))}
          onToggleSubtask={(_, subtaskId) =>
            setTask((t) => ({
              ...t,
              subtasks: t.subtasks?.map((s) => (s.id === subtaskId ? { ...s, done: !s.done } : s)),
            }))
          }
        />
      </Card>
    </Section>
  );
}

