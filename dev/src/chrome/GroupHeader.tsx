import { GROUP_TONES, type Group } from "./groups";

export function GroupHeader({ group, count }: { group: Group; count: string }) {
  const t = GROUP_TONES[group.tone];
  return (
    <div id={group.id} className="scroll-mt-20 pt-16 pb-2 first:pt-8">
      <div className={`rounded-3xl border p-7 sm:p-8 ${t.card}`}>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${t.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
            {group.kicker}
          </span>
          <span className="text-[11px] text-muted font-medium">{count}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{group.label}</h2>
        <p className="mt-3 text-sm text-muted leading-relaxed max-w-2xl">{group.blurb}</p>
      </div>
    </div>
  );
}
