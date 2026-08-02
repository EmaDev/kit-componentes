import { useEffect, useState } from "react";
import { I } from "./Icon";
import { SITE_CONFIG } from "../site.config";

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      className="shrink-0 w-9 h-9 rounded-lg border border-border bg-surface-alt text-muted flex items-center justify-center hover:text-foreground hover:border-muted/40 active:scale-95 transition-all"
      aria-label="Cambiar tema"
    >
      {dark ? I.moon : I.sun}
    </button>
  );
}

export function Header({
  query,
  onQueryChange,
  shown,
  total,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  shown: number;
  total: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-3 sm:gap-5">
        <a href="#top" className="hidden sm:flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
            {I.zap}
          </span>
          <span className="font-bold text-foreground tracking-tight">lib-kit-components</span>
        </a>

        <div className="flex-1 min-w-0 max-w-xl sm:ml-auto">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">{I.search}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar componente…"
              aria-label="Buscar componente"
              className="w-full h-10 pl-10 pr-24 rounded-xl border border-border bg-surface-alt text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-muted pointer-events-none">
              {query ? `${shown}/${total}` : total}
            </span>
          </div>
        </div>

        <ThemeToggle />
        <a
          href={SITE_CONFIG.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 w-9 h-9 rounded-lg border border-border bg-surface-alt text-muted flex items-center justify-center hover:text-foreground hover:border-muted/40 active:scale-95 transition-all"
          aria-label="Repositorio en GitHub"
        >
          {I.github}
        </a>
      </div>
    </header>
  );
}
