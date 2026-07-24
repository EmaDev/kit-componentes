import { Section } from "./Section";
import { GROUPS, GROUP_TONES } from "./groups";
import { I } from "./Icon";

const BADGES = [
  { label: "Vite (real)", icon: I.zap },
  { label: "React 19", icon: I.layers },
  { label: "Tailwind v4", icon: I.edit },
];

const TOKENS: [string, string][] = [
  ["--color-primary", "primary"],
  ["--color-accent", "accent"],
  ["--color-success", "success"],
  ["--color-danger", "danger"],
  ["--color-foreground", "foreground"],
];

export function IntroSection() {
  return (
    <Section id="intro" title="Playground · importa components/ directo, sin mocks">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {BADGES.map((b) => (
          <div
            key={b.label}
            className="rounded-xl border border-border bg-surface p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/5"
          >
            <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
              {b.icon}
            </span>
            <span className="text-sm font-semibold text-foreground">{b.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TOKENS.map(([v, name]) => (
          <div key={name} className="rounded-xl border border-border bg-surface overflow-hidden">
            <div className="h-16" style={{ background: `var(${v})` }} />
            <div className="px-3 py-2">
              <p className="text-xs font-semibold text-foreground">{name}</p>
              <p className="text-[10px] text-muted font-mono">{v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GROUPS.map((g) => {
          const t = GROUP_TONES[g.tone];
          return (
            <a
              key={g.id}
              href={`#${g.id}`}
              className={`group block rounded-2xl border p-5 transition-all hover:-translate-y-0.5 ${t.card} ${t.cardHover}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${t.pill}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                  {g.kicker}
                </span>
                <span className={`transition-transform group-hover:translate-x-0.5 ${t.text}`}>
                  {I.chevRight}
                </span>
              </div>
              <p className="mt-3 text-lg font-bold text-foreground">{g.label}</p>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">{g.blurb}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {g.sections.map((s) => (
                  <span
                    key={s.id}
                    className="rounded-md bg-surface border border-border px-2 py-1 text-[11px] font-medium text-muted"
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </a>
          );
        })}
      </div>
    </Section>
  );
}
