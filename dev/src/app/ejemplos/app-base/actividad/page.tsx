import { ActivityTimeline, type TimelineEvent } from "../../../../../../components/ActivityTimeline";

const EVENTS: TimelineEvent[] = [
  { id: "1", title: "Sesión iniciada", description: "Chrome · Buenos Aires", time: "Hoy · 09:10", status: "done" },
  {
    id: "2",
    title: "Ítem creado desde el FAB",
    description: "Categoría: tarea",
    time: "Hoy · 09:14",
    status: "done",
  },
  {
    id: "3",
    title: "Sincronizando cambios",
    description: "Quedan 2 mutaciones en la cola offline.",
    time: "Hoy · 09:15",
    status: "current",
  },
  {
    id: "4",
    title: "Backup semanal",
    description: "Se ejecuta el domingo a la noche.",
    time: "Dom · 23:00",
    status: "pending",
  },
];

export default function ActividadPage() {
  return (
    <div className="px-5 pb-6 pt-8 sm:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Actividad</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Segunda ruta del <code>BottomNav</code>: el shell (splash, safe areas, nav, FAB) no se vuelve a montar al
        navegar — sólo cambia este contenido.
      </p>
      <div className="mt-6">
        <ActivityTimeline events={EVENTS} />
      </div>
    </div>
  );
}
