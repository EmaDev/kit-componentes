"use client";

export interface HowItWorksStep { id: string; number?: number; title: string; description: string; icon?: React.ReactNode }
interface HowItWorksTimelineProps { steps: HowItWorksStep[]; orientation?: "horizontal" | "vertical"; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Explicativo "cómo funciona" 1-2-3 — estático, no interactivo (distinto del OnboardingWizard). */
export function HowItWorksTimeline({ steps, orientation = "horizontal", className = "" }: HowItWorksTimelineProps) {
  if (orientation === "vertical") {
    return (
      <ol className={cn("space-y-0", className)}>
        {steps.map((s, i) => (
          <li key={s.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i < steps.length - 1 && <span className="absolute left-[19px] top-10 bottom-0 w-px bg-border"/>}
            <span className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-primary text-white font-bold inline-flex items-center justify-center">{s.icon ?? s.number ?? i + 1}</span>
            <div className="pt-1">
              <p className="text-base font-bold text-foreground">{s.title}</p>
              <p className="mt-1 text-sm text-muted leading-relaxed max-w-md">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }
  return (
    <div className={cn("grid gap-6", className)} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))` }}>
      {steps.map((s, i) => (
        <div key={s.id} className="relative text-center">
          {i < steps.length - 1 && <span className="hidden md:block absolute top-5 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-border"/>}
          <span className="relative z-10 mx-auto w-10 h-10 rounded-full bg-primary text-white font-bold inline-flex items-center justify-center">{s.icon ?? s.number ?? i + 1}</span>
          <p className="mt-3 text-sm font-bold text-foreground">{s.title}</p>
          <p className="mt-1 text-[13px] text-muted leading-relaxed">{s.description}</p>
        </div>
      ))}
    </div>
  );
}
