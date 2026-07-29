"use client";

export interface RoadmapItem { id: string; title: string; description?: string; quarter: string; status: "shipped" | "in-progress" | "planned" }
interface RoadmapProps { items: RoadmapItem[]; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const BADGE: Record<RoadmapItem["status"], { label: string; cls: string }> = {
  shipped: { label: "Lanzado", cls: "bg-success/10 text-success" },
  "in-progress": { label: "En curso", cls: "bg-primary/10 text-primary" },
  planned: { label: "Planeado", cls: "bg-surface-alt text-muted" },
};

/** Hoja de ruta: eventos futuros agrupados por trimestre, con estado de avance. */
export function Roadmap({ items, className = "" }: RoadmapProps) {
  const groups: [string, RoadmapItem[]][] = [];
  items.forEach(it => { const g = groups.find(([q]) => q === it.quarter); if (g) g[1].push(it); else groups.push([it.quarter, [it]]); });

  return (
    <div className={cn("space-y-6", className)}>
      {groups.map(([quarter, its]) => (
        <div key={quarter}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2">{quarter}</p>
          <div className="space-y-2">
            {its.map(it => (
              <div key={it.id} className="rounded-xl border border-border bg-surface px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{it.title}</p>
                  <span className={cn("shrink-0 h-6 px-2.5 rounded-full text-[10px] font-bold inline-flex items-center", BADGE[it.status].cls)}>{BADGE[it.status].label}</span>
                </div>
                {it.description && <p className="mt-1 text-[13px] text-muted leading-relaxed">{it.description}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
