"use client";
export type MaintenanceKind = "maintenance" | "coming-soon";
interface MaintenancePageProps {
  kind?: MaintenanceKind;
  title?: string;
  description?: string;
  eta?: string;
  onNotify?: (email: string) => void | Promise<void>;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Página estática de mantenimiento o "próximamente" para features en construcción. */
export function MaintenancePage({ kind = "maintenance", title, description, eta, onNotify, className = "" }: MaintenancePageProps) {
  const isSoon = kind === "coming-soon";
  return (
    <div className={cn("h-full min-h-[420px] flex flex-col items-center justify-center text-center px-6", className)}>
      <span className="w-16 h-16 rounded-2xl bg-primary/10 text-primary inline-flex items-center justify-center">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {isSoon ? <g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></g> : <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>}
        </svg>
      </span>
      <h2 className="mt-5 text-xl font-bold text-foreground tracking-tight" style={{ textWrap: "balance" }}>
        {title ?? (isSoon ? "Muy pronto" : "Estamos mejorando esto")}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed" style={{ textWrap: "pretty" }}>
        {description ?? (isSoon ? "Estamos trabajando en esta función. Te avisamos en cuanto esté lista." : "Volvemos enseguida — estamos haciendo tareas de mantenimiento.")}
      </p>
      {eta && <p className="mt-3 text-xs font-bold text-primary">{eta}</p>}
      {onNotify && (
        <form onSubmit={e => { e.preventDefault(); const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value; if (email) onNotify(email); }}
          className="mt-6 flex gap-2 w-full max-w-xs">
          <input name="email" type="email" required placeholder="tu@email.com" className="flex-1 h-11 rounded-xl border border-border bg-surface px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
          <button type="submit" className="h-11 px-4 rounded-xl bg-primary text-white text-sm font-bold shrink-0">Avisarme</button>
        </form>
      )}
    </div>
  );
}
