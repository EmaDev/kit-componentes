import type { ReactNode } from "react";

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
    <section id={id} className="scroll-mt-20 py-12 first:pt-6 border-b border-border last:border-0">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        {description && <p className="mt-2 text-sm text-muted leading-relaxed">{description}</p>}
      </div>
      {children}
    </section>
  );
}

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
    <div className={`rounded-2xl border border-border bg-surface-alt/40 p-6 ${className}`}>
      {title && <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">{title}</p>}
      {children}
    </div>
  );
}

export function Row({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-wrap items-center gap-2 ${className}`}>{children}</div>;
}
