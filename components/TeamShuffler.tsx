"use client";
import { useState, useId } from "react";

export interface TeamShufflerProps {
  defaultEntries?: string[];
  defaultTeamCount?: number;
  className?: string;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Arma equipos al azar y parejos a partir de una lista de nombres. */
export function TeamShuffler({ defaultEntries = [], defaultTeamCount = 2, className = "" }: TeamShufflerProps) {
  const [entries, setEntries] = useState<string[]>(defaultEntries);
  const [draft, setDraft] = useState("");
  const [teamCount, setTeamCount] = useState(defaultTeamCount);
  const [teams, setTeams] = useState<string[][] | null>(null);
  const uid = useId();

  const addFromDraft = () => {
    const names = draft.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!names.length) return;
    setEntries((e) => [...e, ...names]);
    setDraft("");
  };
  const removeEntry = (i: number) => setEntries((e) => e.filter((_, idx) => idx !== i));

  const doShuffle = () => {
    if (entries.length < teamCount) return;
    const shuffled = shuffle(entries);
    const groups: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => groups[i % teamCount].push(name));
    setTeams(groups);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="rounded-2xl border border-border bg-surface-alt/40 p-4 space-y-2.5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Participantes ({entries.length})</p>
        {entries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {entries.map((name, i) => (
              <span key={`${uid}-e-${i}`} className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1.5 rounded-full border border-border bg-surface text-xs font-semibold text-foreground">
                {name}
                <button type="button" aria-label={`Quitar ${name}`} onClick={() => removeEntry(i)} className="w-5 h-5 rounded-full text-muted hover:bg-surface-alt hover:text-danger transition-colors">✕</button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-start gap-2">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Un nombre por línea…" rows={2} className="flex-1 rounded-lg border border-dashed border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
          <button type="button" onClick={addFromDraft} className="h-9 px-3.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-surface transition-colors shrink-0 self-start">Agregar</button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Cantidad de equipos</p>
          <div className="mt-1.5 inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-1">
            <button type="button" onClick={() => setTeamCount((c) => Math.max(2, c - 1))} disabled={teamCount <= 2} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">−</button>
            <span className="w-6 text-center text-sm font-bold text-foreground tabular-nums">{teamCount}</span>
            <button type="button" onClick={() => setTeamCount((c) => Math.min(entries.length || c + 1, c + 1))} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt transition-colors">+</button>
          </div>
        </div>
        <button type="button" onClick={doShuffle} disabled={entries.length < teamCount} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all">Armar equipos</button>
      </div>

      {teams && (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${teams.length},minmax(0,1fr))` }}>
          {teams.map((team, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface-alt/40 p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Equipo {i + 1}</p>
              <ul className="space-y-1">
                {team.map((name, j) => <li key={j} className="text-sm font-semibold text-foreground">{name}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
