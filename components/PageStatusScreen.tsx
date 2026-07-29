"use client";
export type PageStatus = "404" | "403" | "500" | "empty";

interface PageStatusScreenProps {
  status: PageStatus;
  title?: string;
  description?: string;
  primary?: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DEFAULTS: Record<PageStatus, { title: string; description: string; icon: React.ReactNode }> = {
  "404": { title: "No encontramos esta página", description: "Puede que el enlace esté roto o que la página se haya movido.", icon: <g><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></g> },
  "403": { title: "No tenés acceso", description: "Pedile a un administrador que te habilite este permiso.", icon: <g><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></g> },
  "500": { title: "Algo salió mal de nuestro lado", description: "Ya estamos al tanto. Probá de nuevo en unos minutos.", icon: <g><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></g> },
  empty: { title: "Todavía no hay nada acá", description: "Cuando agregues contenido, va a aparecer en este lugar.", icon: <g><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g> },
};

/** Pantalla completa para 404 / sin permisos / error del servidor / vacío general. */
export function PageStatusScreen({ status, title, description, primary, secondary, className = "" }: PageStatusScreenProps) {
  const d = DEFAULTS[status];
  return (
    <div className={cn("h-full min-h-[420px] flex flex-col items-center justify-center text-center px-6", className)}>
      <span className="w-16 h-16 rounded-2xl bg-surface-alt text-muted inline-flex items-center justify-center">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{d.icon}</svg>
      </span>
      <h2 className="mt-5 text-xl font-bold text-foreground tracking-tight" style={{ textWrap: "balance" }}>{title ?? d.title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted leading-relaxed" style={{ textWrap: "pretty" }}>{description ?? d.description}</p>
      {(primary || secondary) && (
        <div className="mt-6 flex items-center gap-3">
          {secondary && <button type="button" onClick={secondary.onClick} className="h-10 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors">{secondary.label}</button>}
          {primary && <button type="button" onClick={primary.onClick} className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all">{primary.label}</button>}
        </div>
      )}
    </div>
  );
}
