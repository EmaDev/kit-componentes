"use client";
import { useState, useId } from "react";

export interface TallyPlayer {
  id: string;
  name: string;
  count: number;
}

export interface TallyCounterProps {
  /** Jugadores/categorías iniciales. Default: dos columnas "Jugador 1/2". */
  defaultPlayers?: Omit<TallyPlayer, "id">[];
  /** Permite agregar/quitar/renombrar columnas. Default true. */
  allowEdit?: boolean;
  className?: string;
}

let tallyUid = 0;
function nextId() { return `tp${++tallyUid}`; }

// Un grupo de hasta 5 palitos: 4 verticales + 1 diagonal que los cruza al completar 5.
function TallyGroup({ n }: { n: number }) {
  const w = 26, h = 34;
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      {Array.from({ length: Math.min(n, 4) }).map((_, i) => (
        <div key={i} className="absolute bottom-0 bg-foreground/80 rounded-full" style={{ width: 2.5, height: h, left: 3 + i * 6 }} />
      ))}
      {n >= 5 && (
        <div className="absolute bg-foreground/80 rounded-full" style={{ width: 2.5, height: Math.sqrt(w * w + h * h) - 4, left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(32deg)" }} />
      )}
    </div>
  );
}

function TallyMarks({ count }: { count: number }) {
  if (count <= 0) return <span className="text-sm text-muted italic">Sin marcas</span>;
  const groups = Math.ceil(count / 5);
  return (
    <div className="flex flex-wrap items-end gap-2.5">
      {Array.from({ length: groups }).map((_, i) => {
        const remaining = count - i * 5;
        return <TallyGroup key={i} n={Math.min(5, remaining)} />;
      })}
    </div>
  );
}

/**
 * Anotador de palitos: una columna por jugador/categoría, marcas en grupos
 * de 5 (cuatro palitos + uno cruzado), con controles +/− y edición de nombres.
 */
export function TallyCounter({ defaultPlayers = [{ name: "Jugador 1", count: 0 }, { name: "Jugador 2", count: 0 }], allowEdit = true, className = "" }: TallyCounterProps) {
  const [players, setPlayers] = useState<TallyPlayer[]>(() => defaultPlayers.map((p) => ({ ...p, id: nextId() })));
  const uid = useId();

  const inc = (id: string, delta: number) => setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, count: Math.max(0, p.count + delta) } : p)));
  const rename = (id: string, name: string) => setPlayers((ps) => ps.map((p) => (p.id === id ? { ...p, name } : p)));
  const addPlayer = () => setPlayers((ps) => [...ps, { id: nextId(), name: `Jugador ${ps.length + 1}`, count: 0 }]);
  const removePlayer = (id: string) => setPlayers((ps) => (ps.length > 1 ? ps.filter((p) => p.id !== id) : ps));
  const resetAll = () => setPlayers((ps) => ps.map((p) => ({ ...p, count: 0 })));

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        {players.map((p) => (
          <div key={`${uid}-${p.id}`} className="rounded-2xl border border-border bg-surface-alt/40 p-4 flex items-center gap-4">
            <div className="w-28 shrink-0">
              {allowEdit ? (
                <input value={p.name} onChange={(e) => rename(p.id, e.target.value)} className="w-full h-9 rounded-lg border border-border bg-surface px-2.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              ) : (
                <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
              )}
              <p className="mt-1 text-2xl font-bold text-primary tabular-nums">{p.count}</p>
            </div>

            <div className="flex-1 min-h-[34px] overflow-x-auto">
              <TallyMarks count={p.count} />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button type="button" aria-label="Restar" onClick={() => inc(p.id, -1)} disabled={p.count <= 0} className="w-9 h-9 rounded-lg border border-border text-lg font-bold text-foreground hover:bg-surface disabled:opacity-30 transition-colors">−</button>
              <button type="button" aria-label="Sumar" onClick={() => inc(p.id, 1)} className="w-9 h-9 rounded-lg bg-primary text-white text-lg font-bold active:scale-[0.95] transition-all">+</button>
              {allowEdit && players.length > 1 && (
                <button type="button" aria-label="Quitar jugador" onClick={() => removePlayer(p.id)} className="w-9 h-9 rounded-lg text-muted hover:bg-surface hover:text-danger transition-colors">✕</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {allowEdit && (
          <button type="button" onClick={addPlayer} className="h-10 px-4 rounded-xl border border-dashed border-border text-sm font-bold text-foreground hover:bg-surface-alt transition-colors">+ Agregar jugador</button>
        )}
        <button type="button" onClick={resetAll} className="h-10 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors ml-auto">Reiniciar</button>
      </div>
    </div>
  );
}
