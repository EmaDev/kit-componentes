import { ActivityTimeline, type TimelineEvent } from "../../../../../../components/ActivityTimeline";
import { ActividadHeader } from "../_components/ActividadHeader";

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

function Intro() {
  return (
    <p className="max-w-xl text-sm leading-relaxed text-muted">
      Pantalla de detalle: usa <code>AppHeaderTabs</code> (volver + título + acciones + tabs pegados arriba) en vez del{" "}
      <code>HeroTabs</code> de la home. La campana abre el <code>NotificationSidebar</code> que vive en el shell.
    </p>
  );
}

/** Sigue siendo Server Component: los panels se resuelven acá y viajan como ReactNode. */
export default function ActividadPage() {
  return (
    <ActividadHeader
      panels={{
        todo: (
          <div className="flex flex-col gap-6">
            <Intro />
            <ActivityTimeline events={EVENTS} />
          </div>
        ),
        sesiones: <ActivityTimeline events={EVENTS.filter((e) => e.title.includes("Sesión"))} />,
        sincronizacion: <ActivityTimeline events={EVENTS.filter((e) => e.status === "current")} />,
        backups: <ActivityTimeline events={EVENTS.filter((e) => e.title.includes("Backup"))} />,
        seguridad: <p className="text-sm text-muted">Sin eventos de seguridad en el período.</p>,
        facturacion: <p className="text-sm text-muted">Tu plan vence en 5 días.</p>,
      }}
    />
  );
}
