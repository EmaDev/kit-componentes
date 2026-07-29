"use client";

export interface FeedEvent { id: string; date: Date; title: string; description?: string; icon?: React.ReactNode }
interface GroupedActivityFeedProps { events: FeedEvent[]; locale?: string; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

function dayLabel(d: Date, locale: string) {
  const today = new Date(), yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(d);
}

/** Feed de actividad de cuenta agrupado por día, con separadores "Hoy"/"Ayer". */
export function GroupedActivityFeed({ events, locale = "es-AR", className = "" }: GroupedActivityFeedProps) {
  const groups: [string, FeedEvent[]][] = [];
  events.forEach(e => {
    const label = dayLabel(e.date, locale);
    const g = groups.find(([l]) => l === label);
    if (g) g[1].push(e); else groups.push([label, [e]]);
  });
  const fmtTime = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={cn("space-y-5", className)}>
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="sticky top-0 bg-surface/95 backdrop-blur text-[11px] font-bold uppercase tracking-wider text-muted py-1">{label}</p>
          <ul className="mt-1 divide-y divide-border rounded-xl border border-border overflow-hidden bg-surface">
            {items.map(e => (
              <li key={e.id} className="flex items-start gap-3 px-3.5 py-2.5">
                <span className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                  {e.icon ?? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-foreground">{e.title}</span>
                  {e.description && <span className="block text-xs text-muted mt-0.5">{e.description}</span>}
                </span>
                <span className="shrink-0 text-[11px] font-medium text-muted/80 pt-0.5">{fmtTime.format(e.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
