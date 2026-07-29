"use client";
import { useMemo, useState } from "react";

export interface BookingSlot { time: string; available: boolean }
export interface BookingDay { date: Date; slots: BookingSlot[] }

interface BookingCalendarProps {
  days: BookingDay[];
  value?: { date: Date; time: string } | null;
  onChange?: (v: { date: Date; time: string }) => void;
  onConfirm?: (v: { date: Date; time: string }) => void | Promise<void>;
  locale?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** Reserva de turnos: tira de días horizontal + grilla de horarios disponibles/ocupados. */
export function BookingCalendar({ days, value, onChange, onConfirm, locale = "es-AR", className = "" }: BookingCalendarProps) {
  const [dayIdx, setDayIdx] = useState(() => Math.max(0, days.findIndex(d => value && sameDay(d.date, value.date))));
  const [busy, setBusy] = useState(false);
  const day = days[dayIdx];
  const selectedTime = value && day && sameDay(value.date, day.date) ? value.time : null;

  const fmtDow = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const fmtDay = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric" }), [locale]);
  const fmtMonth = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", day: "numeric" }), [locale]);

  const pick = (time: string) => onChange?.({ date: day.date, time });

  const confirm = async () => {
    if (!selectedTime) return;
    setBusy(true);
    try { await onConfirm?.({ date: day.date, time: selectedTime }); } finally { setBusy(false); }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((d, i) => {
          const has = d.slots.some(s => s.available);
          return (
            <button key={i} type="button" disabled={!has} onClick={() => setDayIdx(i)}
              className={cn("shrink-0 w-14 h-[62px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all",
                i === dayIdx ? "bg-primary border-primary text-white" : has ? "border-border bg-surface hover:border-primary/40" : "border-border/50 bg-surface-alt/40 text-muted/50")}>
              <span className={cn("text-[10px] font-bold uppercase", i === dayIdx ? "text-white/80" : "text-muted")}>{fmtDow.format(d.date)}</span>
              <span className="text-base font-bold">{fmtDay.format(d.date)}</span>
            </button>
          );
        })}
      </div>

      {day && (
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">{fmtMonth.format(day.date)}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {day.slots.map(s => (
              <button key={s.time} type="button" disabled={!s.available} onClick={() => pick(s.time)}
                className={cn("h-10 rounded-xl text-sm font-semibold border transition-all",
                  !s.available ? "border-border/40 text-muted/40 line-through cursor-not-allowed" :
                  s.time === selectedTime ? "bg-primary border-primary text-white" : "border-border text-foreground hover:border-primary/50")}>
                {s.time}
              </button>
            ))}
          </div>
        </div>
      )}

      {onConfirm && (
        <button type="button" onClick={confirm} disabled={!selectedTime || busy}
          className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}
          {selectedTime ? `Confirmar turno · ${selectedTime}` : "Elegí un horario"}
        </button>
      )}
    </div>
  );
}
