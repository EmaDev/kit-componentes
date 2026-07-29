"use client";
import { useState } from "react";

interface StarRatingWidgetProps {
  value?: number;
  onChange?: (n: number) => void;
  readOnly?: boolean;
  average?: number;
  count?: number;
  distribution?: number[];
  size?: number;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function Star({ filled, half, size }: { filled: boolean; half?: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={filled || half ? "text-accent" : "text-border"}>
      {half && <defs><linearGradient id="star-half"><stop offset="50%" stopColor="currentColor"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs>}
      <path fill={half ? "url(#star-half)" : filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
        d="M12 2.5l2.9 6.06 6.6.87-4.83 4.63 1.24 6.57L12 17.5l-5.91 3.13 1.24-6.57L1.5 9.43l6.6-.87z"/>
    </svg>
  );
}

/** Widget de calificación con estrellas: dejar una reseña o mostrar el promedio con distribución. */
export function StarRatingWidget({ value = 0, onChange, readOnly = false, average, count, distribution, size = 22, className = "" }: StarRatingWidgetProps) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  if (readOnly && average != null) {
    const max = distribution ? Math.max(...distribution) : 1;
    return (
      <div className={cn("flex items-start gap-6", className)}>
        <div className="text-center shrink-0">
          <p className="text-3xl font-black text-foreground tracking-tight">{average.toFixed(1)}</p>
          <div className="flex justify-center gap-0.5 mt-1">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} filled={i <= Math.round(average)} half={false}/>)}</div>
          {count != null && <p className="text-xs text-muted mt-1">{count} reseñas</p>}
        </div>
        {distribution && (
          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map(star => {
              const v = distribution[star - 1] ?? 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-muted w-3">{star}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-alt overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${(v / max) * 100}%` }}/></div>
                  <span className="text-[11px] text-muted w-6 text-right">{v}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("inline-flex gap-1", className)} onMouseLeave={() => setHover(null)}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" disabled={readOnly} onMouseEnter={() => setHover(i)} onClick={() => onChange?.(i)} className="active:scale-90 transition-transform disabled:cursor-default">
          <Star size={size} filled={i <= shown}/>
        </button>
      ))}
    </div>
  );
}
