"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface PollOption {
  id: string;
  label: string;
  votes: number;
  /** imagen opcional para encuestas visuales */
  image?: string;
  hint?: string;
}

export type PollKind = "single" | "multi" | "rating" | "nps";

interface PollProps {
  question: string;
  description?: string;
  options?: PollOption[];
  kind?: PollKind;
  /** id(s) ya votados: la encuesta arranca en resultados */
  voted?: string[] | null;
  onVote?: (ids: string[]) => void | Promise<void>;
  /** muestra porcentajes antes de votar */
  revealBeforeVote?: boolean;
  /** cierre de la encuesta: «Cierra en 2 días» */
  closesLabel?: string;
  closed?: boolean;
  totalLabel?: string;
  /** máximo de opciones en multi */
  maxChoices?: number;
  footer?: React.ReactNode;
  className?: string;
}

const pct = (v: number, total: number) => total === 0 ? 0 : (v / total) * 100;

function ResultRow({ o, total, mine, winner }: { o: PollOption; total: number; mine: boolean; winner: boolean }) {
  const p = pct(o.votes, total);
  return (
    <div className="relative rounded-xl border border-border overflow-hidden bg-surface">
      <motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className={`absolute inset-y-0 left-0 ${mine ? "bg-primary/16" : winner ? "bg-foreground/8" : "bg-surface-alt"}`}/>
      <div className="relative flex items-center gap-2.5 px-3.5 h-11">
        {mine && (
          <span className="w-4 h-4 rounded-full bg-primary text-white inline-flex items-center justify-center shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
        )}
        <span className={`text-sm truncate ${mine || winner ? "font-bold text-foreground" : "font-medium text-foreground/90"}`}>{o.label}</span>
        <span className="ml-auto shrink-0 flex items-center gap-2">
          <span className="text-[11px] text-muted tabular-nums">{o.votes.toLocaleString()}</span>
          <span className="text-sm font-bold text-foreground tabular-nums">{Math.round(p)}%</span>
        </span>
      </div>
    </div>
  );
}

/** Encuesta: opción única, múltiple, estrellas o NPS, con resultados animados y estado votado. */
export function Poll({
  question, description, options = [], kind = "single", voted = null, onVote,
  revealBeforeVote = false, closesLabel, closed = false, totalLabel = "votos",
  maxChoices, footer, className = "",
}: PollProps) {
  const [picked, setPicked] = useState<string[]>([]);
  const [localVoted, setLocalVoted] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const myVote = voted ?? localVoted;
  const done = !!myVote;

  const scale = useMemo<PollOption[]>(() => {
    if (kind === "rating") return [1, 2, 3, 4, 5].map(n => ({ id: String(n), label: `${n} estrellas`, votes: 0 }));
    if (kind === "nps") return Array.from({ length: 11 }, (_, n) => ({ id: String(n), label: String(n), votes: 0 }));
    return options;
  }, [kind, options]);

  const list = kind === "single" || kind === "multi" ? options : scale;
  const total = useMemo(() => {
    const base = options.reduce((s, o) => s + o.votes, 0);
    return base + (localVoted ? localVoted.length : 0);
  }, [options, localVoted]);

  const showResults = done || (revealBeforeVote && (kind === "single" || kind === "multi")) || closed;

  const submit = async (ids: string[]) => {
    if (busy || closed) return;
    setBusy(true);
    try { await onVote?.(ids); setLocalVoted(ids); } finally { setBusy(false); }
  };

  const toggle = (id: string) => {
    if (kind === "single") { submit([id]); return; }
    setPicked(p => {
      if (p.includes(id)) return p.filter(x => x !== id);
      if (maxChoices && p.length >= maxChoices) return p;
      return [...p, id];
    });
  };

  const withMine = (o: PollOption): PollOption =>
    localVoted?.includes(o.id) ? { ...o, votes: o.votes + 1 } : o;

  const maxVotes = Math.max(...list.map(o => withMine(o).votes), 0);

  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <header className="mb-4">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>
          {closed ? "Encuesta cerrada" : kind === "nps" ? "NPS" : kind === "rating" ? "Valoración" : "Encuesta"}
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground leading-snug" style={{ textWrap: "pretty" }}>{question}</h3>
        {description && <p className="mt-1.5 text-xs text-muted leading-relaxed">{description}</p>}
      </header>

      {/* estrellas */}
      {kind === "rating" && (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="flex items-center gap-1.5" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map(n => {
              const on = (hover || rating || (myVote ? +myVote[0] : 0)) >= n;
              return (
                <button key={n} type="button" aria-label={`${n} estrellas`}
                  disabled={done || closed}
                  onMouseEnter={() => setHover(n)}
                  onClick={() => { setRating(n); submit([String(n)]); }}
                  className="p-1 disabled:cursor-default">
                  <motion.svg animate={{ scale: on ? 1.06 : 1, rotate: on ? 0 : -4 }}
                    width="34" height="34" viewBox="0 0 24 24"
                    fill={on ? "var(--color-accent)" : "none"} stroke={on ? "var(--color-accent)" : "var(--color-border)"}
                    strokeWidth="1.8" strokeLinejoin="round">
                    <path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9Z"/>
                  </motion.svg>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted">
            {done ? `Gracias por tu valoración: ${myVote?.[0]} de 5` : "Tocá una estrella para valorar"}
          </p>
        </div>
      )}

      {/* NPS */}
      {kind === "nps" && (
        <div className="py-1">
          <div className="grid grid-cols-11 gap-1">
            {Array.from({ length: 11 }, (_, n) => {
              const mine = myVote?.[0] === String(n);
              const tone = n <= 6 ? "danger" : n <= 8 ? "accent" : "success";
              return (
                <button key={n} type="button" disabled={done || closed} onClick={() => submit([String(n)])}
                  className={[
                    "h-11 rounded-lg text-xs font-bold tabular-nums border transition-all active:scale-95 disabled:cursor-default",
                    mine
                      ? `bg-${tone} text-white border-transparent`
                      : done ? "border-border text-muted" : "border-border text-foreground hover:border-primary/50 hover:bg-primary/5",
                  ].join(" ")}
                  style={mine ? { background: `var(--color-${tone})`, borderColor: "transparent" } : undefined}>
                  {n}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-muted">
            <span>Nada probable</span><span>Muy probable</span>
          </div>
          {done && <p className="mt-3 text-xs text-muted text-center">Anotado: <b className="text-foreground">{myVote?.[0]}</b> de 10. Gracias.</p>}
        </div>
      )}

      {/* opciones */}
      {(kind === "single" || kind === "multi") && (
        <div className="space-y-2">
          <AnimatePresence initial={false} mode="popLayout">
            {list.map(o => {
              const oo = withMine(o);
              if (showResults) {
                return (
                  <motion.div key={o.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ResultRow o={oo} total={total} mine={!!myVote?.includes(o.id)} winner={oo.votes === maxVotes && maxVotes > 0}/>
                  </motion.div>
                );
              }
              const on = picked.includes(o.id);
              return (
                <motion.button key={o.id} layout type="button" onClick={() => toggle(o.id)} disabled={busy}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={[
                    "w-full text-left rounded-xl border px-3.5 h-11 flex items-center gap-2.5 transition-all active:scale-[0.99]",
                    on ? "border-primary bg-primary/8" : "border-border bg-surface hover:border-primary/40 hover:bg-surface-alt/60",
                  ].join(" ")}>
                  <span className={[
                    "w-[18px] h-[18px] shrink-0 inline-flex items-center justify-center border-2 transition-colors",
                    kind === "multi" ? "rounded-md" : "rounded-full",
                    on ? "border-primary bg-primary text-white" : "border-border",
                  ].join(" ")}>
                    {on && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">{o.label}</span>
                  {o.hint && <span className="ml-auto text-[11px] text-muted shrink-0">{o.hint}</span>}
                </motion.button>
              );
            })}
          </AnimatePresence>

          {kind === "multi" && !done && !closed && (
            <button type="button" onClick={() => submit(picked)} disabled={picked.length === 0 || busy}
              className="mt-1 w-full h-11 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/25 disabled:opacity-35 disabled:shadow-none hover:bg-primary-hover active:scale-[0.99] transition-all">
              {busy ? "Enviando…" : `Votar${picked.length ? ` (${picked.length})` : ""}`}
            </button>
          )}
        </div>
      )}

      <footer className="mt-4 flex items-center gap-2 flex-wrap text-[11px] text-muted">
        <span className="tabular-nums font-semibold text-foreground">{total.toLocaleString()}</span>
        <span>{totalLabel}</span>
        {closesLabel && <span>· {closed ? "Cerrada" : closesLabel}</span>}
        {maxChoices && kind === "multi" && !done && <span>· hasta {maxChoices} opciones</span>}
        {done && !closed && <span className="ml-auto font-semibold text-success">Tu voto quedó registrado</span>}
      </footer>

      {footer && <div className="mt-3">{footer}</div>}
    </section>
  );
}
