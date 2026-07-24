// =============================================================
//  CalendarGrid — preview version
// =============================================================

const CAL_COLORS = {
  primary: { chip:"bg-primary/12 text-primary", dot:"bg-primary", solid:"bg-primary text-white" },
  accent:  { chip:"bg-accent/12 text-accent",   dot:"bg-accent",  solid:"bg-accent text-white" },
  success: { chip:"bg-success/12 text-success", dot:"bg-success", solid:"bg-success text-white" },
  danger:  { chip:"bg-danger/12 text-danger",   dot:"bg-danger",  solid:"bg-danger text-white" },
  muted:   { chip:"bg-surface-alt text-muted",  dot:"bg-muted",   solid:"bg-muted text-white" },
};

const calStartOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const calSameDay = (a,b) => a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();

function PreviewCalendar({
  month, events = [], weekStartsOn = 1, maxPerDay = 3, cellMinHeight = 96,
  onDayClick, onEventClick, showAdjacent = true, locale = "es-AR",
}) {
  const [innerMonth, setInnerMonth] = useState(() => month ?? new Date());
  const current = month ?? innerMonth;
  const [expanded, setExpanded] = useState(null);
  const today = calStartOfDay(new Date());

  const days = useMemo(() => {
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const shift = (first.getDay() - weekStartsOn + 7) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - shift);
    return Array.from({length:42}, (_,i) => {
      const d = new Date(start);
      d.setDate(start.getDate()+i);
      return d;
    });
  }, [current, weekStartsOn]);

  const dayKey = d => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const byDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const from = calStartOfDay(ev.start);
      const to = calStartOfDay(ev.end ?? ev.start);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate()+1)) {
        const k = dayKey(d);
        map.set(k, [...(map.get(k) ?? []), ev]);
      }
    }
    for (const list of map.values()) {
      list.sort((a,b) => Number(!!b.allDay)-Number(!!a.allDay) || a.start-b.start);
    }
    return map;
  }, [events]);

  const weekdayNames = useMemo(() => {
    const base = new Date(2024, 0, 1);
    return Array.from({length:7}, (_,i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + ((i + (weekStartsOn===0 ? 6 : 0)) % 7));
      return new Intl.DateTimeFormat(locale, { weekday:"short" }).format(d).replace(".","");
    });
  }, [locale, weekStartsOn]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month:"long", year:"numeric" }).format(current);
  const timeFmt = new Intl.DateTimeFormat(locale, { hour:"2-digit", minute:"2-digit" });
  const shiftMonth = delta => setInnerMonth(new Date(current.getFullYear(), current.getMonth()+delta, 1));

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <p className="flex-1 text-sm font-semibold text-foreground capitalize">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <button onClick={()=>shiftMonth(-1)} aria-label="Mes anterior"
            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt active:scale-90 transition-all">{I.chevLeft}</button>
          <button onClick={()=>setInnerMonth(new Date())}
            className="h-8 px-3 rounded-lg text-xs font-semibold text-foreground hover:bg-surface-alt transition-colors">Hoy</button>
          <button onClick={()=>shiftMonth(1)} aria-label="Mes siguiente"
            className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt active:scale-90 transition-all">{I.chevRight}</button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-border bg-surface-alt/40">
        {weekdayNames.map(w => (
          <div key={w} className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-muted">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === current.getMonth();
          if (!showAdjacent && !inMonth) {
            return <div key={i} className="border-r border-b border-border" style={{ minHeight: cellMinHeight }}/>;
          }
          const k = dayKey(d);
          const list = byDay.get(k) ?? [];
          const isToday = calSameDay(d, today);
          const isOpen = expanded === k;
          const shown = isOpen ? list : list.slice(0, maxPerDay);
          const hidden = list.length - shown.length;
          const isWeekend = d.getDay()===0 || d.getDay()===6;

          return (
            <div key={i} onClick={()=>onDayClick?.(d)}
              className={cx("relative border-r border-b border-border p-1.5 flex flex-col gap-1 transition-colors",
                (i+1)%7===0 && "border-r-0", i>=35 && "border-b-0",
                !inMonth && "bg-surface-alt/30",
                isWeekend && inMonth && "bg-surface-alt/20",
                onDayClick && "cursor-pointer hover:bg-primary/[0.04]")}
              style={{ minHeight: cellMinHeight }}>
              <div className="flex items-center justify-between px-0.5">
                <span className={cx("inline-flex items-center justify-center text-[12px] font-semibold tabular-nums",
                  isToday && "w-6 h-6 rounded-full bg-primary text-white",
                  !isToday && inMonth && "text-foreground",
                  !isToday && !inMonth && "text-muted/50")}>
                  {d.getDate()}
                </span>
                {list.length > 0 && !isOpen && (
                  <span className="flex items-center gap-0.5">
                    {list.slice(0,3).map((ev,j) => (
                      <span key={j} className={cx("w-1 h-1 rounded-full", CAL_COLORS[ev.color ?? "primary"].dot)}/>
                    ))}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                {shown.map(ev => {
                  const c = CAL_COLORS[ev.color ?? "primary"];
                  return (
                    <button key={ev.id} onClick={e=>{ e.stopPropagation(); onEventClick?.(ev); }}
                      className={cx("w-full text-left rounded-md px-1.5 py-1 text-[11px] font-medium truncate transition-transform active:scale-[0.97]",
                        ev.allDay ? c.solid : c.chip, !inMonth && "opacity-50")}
                      style={{ animation: "fadeInUp 0.18s both" }}>
                      {!ev.allDay && <span className="opacity-70 mr-1 tabular-nums">{timeFmt.format(ev.start)}</span>}
                      {ev.title}
                    </button>
                  );
                })}
                {hidden > 0 && (
                  <button onClick={e=>{ e.stopPropagation(); setExpanded(k); }}
                    className="text-left px-1.5 text-[11px] font-semibold text-muted hover:text-foreground transition-colors">
                    +{hidden} más
                  </button>
                )}
                {isOpen && list.length > maxPerDay && (
                  <button onClick={e=>{ e.stopPropagation(); setExpanded(null); }}
                    className="text-left px-1.5 text-[11px] font-semibold text-muted hover:text-foreground transition-colors">
                    Ver menos
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { PreviewCalendar, CAL_COLORS });
