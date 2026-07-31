"use client";
import { useState, useId } from "react";

export interface RaffleDrawProps {
  /** Participantes iniciales. Default: vacío. */
  defaultEntries?: string[];
  /** Cantidad máxima de ganadores que se puede elegir a la vez. Default 20. */
  maxWinners?: number;
  /** Se llama al terminar cada sorteo con el listado completo de ganadores (acumulado). */
  onDraw?: (winners: string[]) => void;
  className?: string;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// Efecto "reel": cicla nombres al azar cada vez más lento y se detiene en el índice ganador.
async function spinReel(pool: string[], winnerIndex: number, onTick: (name: string) => void) {
  const ticks = 16;
  for (let t = 0; t < ticks; t++) {
    onTick(pool[randInt(0, pool.length - 1)]);
    await sleep(35 + (t / ticks) * 160);
  }
  onTick(pool[winnerIndex]);
  await sleep(350);
}

/**
 * Herramienta de sorteos: lista de participantes, cantidad de ganadores a
 * elegir, animación tipo tómbola/reel y opción de no repetir ganadores.
 */
export function RaffleDraw({ defaultEntries = [], maxWinners = 20, onDraw, className = "" }: RaffleDrawProps) {
  const [entries, setEntries] = useState<string[]>(defaultEntries);
  const [draft, setDraft] = useState("");
  const [drawCount, setDrawCount] = useState(1);
  const [noRepeat, setNoRepeat] = useState(true);
  const [winners, setWinners] = useState<string[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const uid = useId();

  const addFromDraft = () => {
    const names = draft.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setEntries((e) => [...e, ...names]);
    setDraft("");
  };
  const removeEntry = (i: number) => setEntries((e) => e.filter((_, idx) => idx !== i));
  const clearAll = () => { setEntries([]); setWinners([]); setCurrent(null); };
  const resetWinners = () => setWinners([]);

  const draw = async () => {
    if (drawing || entries.length === 0) return;
    setDrawing(true);
    const pool = [...entries];
    const count = Math.min(drawCount, pool.length);
    const roundWinners: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = randInt(0, pool.length - 1);
      await spinReel(pool, idx, setCurrent);
      roundWinners.push(pool[idx]);
      if (noRepeat) pool.splice(idx, 1);
      await sleep(200);
    }
    setWinners((w) => {
      const next = [...w, ...roundWinners];
      onDraw?.(next);
      return next;
    });
    if (noRepeat) setEntries(pool);
    setDrawing(false);
  };

  const maxPickable = Math.min(maxWinners, entries.length || 1);

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="rounded-2xl border border-border bg-surface-alt/40 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Participantes ({entries.length})</p>
          {entries.length > 0 && <button type="button" onClick={clearAll} className="text-xs font-bold text-muted hover:text-danger transition-colors">Vaciar todo</button>}
        </div>

        {entries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
            {entries.map((name, i) => (
              <span key={`${uid}-e-${i}`} className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full border border-border bg-surface text-xs font-semibold text-foreground">
                {name}
                <button type="button" aria-label={`Quitar ${name}`} onClick={() => removeEntry(i)} className="w-5 h-5 rounded-full text-muted hover:bg-surface-alt hover:text-danger transition-colors">✕</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-start gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) addFromDraft(); }}
            placeholder={"Un nombre por línea…"}
            rows={2}
            className="flex-1 rounded-lg border border-dashed border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
          <button type="button" onClick={addFromDraft} className="h-9 px-3.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-surface transition-colors shrink-0 self-start">Agregar</button>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-end gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Ganadores a elegir</p>
            <div className="mt-1.5 inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-1">
              <button type="button" aria-label="Menos" onClick={() => setDrawCount((c) => Math.max(1, c - 1))} disabled={drawCount <= 1 || drawing} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">−</button>
              <span className="w-6 text-center text-sm font-bold text-foreground tabular-nums">{drawCount}</span>
              <button type="button" aria-label="Más" onClick={() => setDrawCount((c) => Math.min(maxPickable, c + 1))} disabled={drawCount >= maxPickable || drawing} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">+</button>
            </div>
          </div>
          <label className="flex items-center gap-2 h-9 text-sm font-semibold text-foreground select-none">
            <input type="checkbox" checked={noRepeat} onChange={(e) => setNoRepeat(e.target.checked)} disabled={drawing} className="w-4 h-4 rounded accent-primary" />
            No repetir ganadores
          </label>
        </div>

        <button type="button" onClick={draw} disabled={drawing || entries.length === 0} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all">
          {drawing ? "Sorteando…" : "Sortear"}
        </button>
      </div>

      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.04] px-6 py-8 flex items-center justify-center min-h-[92px]">
        {current ? (
          <p key={current} className="text-2xl font-bold text-foreground text-center" style={{ animation: drawing ? "raffleTick 0.15s ease" : "raffleSettle 0.35s ease" }}>{current}</p>
        ) : (
          <p className="text-sm text-muted">Agregá participantes y tocá «Sortear»</p>
        )}
      </div>
      <style>{`@keyframes raffleTick{from{opacity:0.4;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}@keyframes raffleSettle{from{opacity:0.5;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}`}</style>

      {winners.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-alt/40 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Ganadores</p>
            <button type="button" onClick={resetWinners} className="text-xs font-bold text-muted hover:text-danger transition-colors">Reiniciar</button>
          </div>
          <ol className="space-y-1.5">
            {winners.map((w, i) => (
              <li key={`${uid}-w-${i}`} className="flex items-center gap-3 h-9 px-3 rounded-lg bg-surface border border-border text-sm">
                <span className="w-6 text-center font-bold text-primary tabular-nums">{i + 1}º</span>
                <span className="font-semibold text-foreground">{w}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
