import type { ReactNode } from "react";

/**
 * Tarjeta de preview de un componente. Es la única unidad visual del
 * playground: cabecera con el nombre real del componente (mono, así se
 * reconoce y se copia) + una línea de qué hace, y abajo el componente vivo.
 */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
        <header className="border-b border-border bg-surface-alt/50 px-5 py-3.5">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-mono text-sm font-semibold text-foreground">{title}</h3>
            <a
              href={`#${id}`}
              className="font-mono text-[11px] text-muted/70 hover:text-primary transition-colors"
              aria-label={`Enlace directo a ${title}`}
            >
              #{id}
            </a>
          </div>
          {description && <p className="mt-1.5 text-[13px] leading-relaxed text-muted max-w-3xl">{description}</p>}
        </header>
        <div className="p-5 space-y-4">{children}</div>
      </div>
    </section>
  );
}

/** Sub-bloque dentro de un preview: una variante concreta, con etiqueta chica. */
export function Card({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border/70 bg-surface-alt/30 p-4 ${className}`}>
      {title && <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3">{title}</p>}
      {children}
    </div>
  );
}

export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-2 ${className}`}>{children}</div>;
}
