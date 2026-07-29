"use client";

export interface RateQuote { provider: string; logo?: string; rate: number; fee?: number; etaMinutes?: number; best?: boolean }
interface RateComparatorProps {
  from: string;
  to: string;
  amount: number;
  quotes: RateQuote[];
  onSelect?: (quote: RateQuote) => void;
  locale?: string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Comparador de cotización: mismo monto convertido por distintos proveedores, ordenado por lo que más te dan. */
export function RateComparator({ from, to, amount, quotes, onSelect, locale = "es-AR", className = "" }: RateComparatorProps) {
  const sorted = [...quotes].sort((a, b) => (b.rate - (b.fee ?? 0) / amount) - (a.rate - (a.fee ?? 0) / amount));
  const fmt = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(n);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted">Convirtiendo <b className="text-foreground">{fmt(amount)} {from}</b> a {to}</p>
      {sorted.map((q, i) => {
        const gross = amount * q.rate;
        const net = gross - (q.fee ?? 0);
        const best = i === 0;
        return (
          <button key={q.provider} type="button" onClick={() => onSelect?.(q)}
            className={cn("w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors", best ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
            <span className="w-9 h-9 rounded-full bg-surface-alt border border-border inline-flex items-center justify-center text-xs font-black text-muted shrink-0">{q.logo ?? q.provider[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{q.provider}</span>
                {best && <span className="h-5 px-2 rounded-full bg-primary text-white text-[10px] font-bold inline-flex items-center">Mejor cotización</span>}
              </span>
              <span className="block text-[11px] text-muted mt-0.5">
                1 {from} = {q.rate.toLocaleString(locale, { maximumFractionDigits: 4 })} {to}
                {q.fee ? ` · comisión ${fmt(q.fee)} ${to}` : " · sin comisión"}
                {q.etaMinutes != null && ` · ${q.etaMinutes < 60 ? `${q.etaMinutes} min` : `${Math.round(q.etaMinutes / 60)} h`}`}
              </span>
            </span>
            <span className="text-right shrink-0">
              <span className="block text-sm font-black text-foreground">{fmt(net)} {to}</span>
              <span className="block text-[10px] text-muted">recibís</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
