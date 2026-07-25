import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/Button";
import { I } from "./Icon";

function ThemeToggle() {
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="relative w-14 h-8 rounded-full border border-border bg-surface-alt transition-colors hover:border-muted/40 active:scale-95"
      aria-label="Cambiar tema"
    >
      <span
        className="absolute top-1 w-6 h-6 rounded-full bg-surface shadow-md flex items-center justify-center transition-all duration-300"
        style={{
          left: dark ? "calc(100% - 1.75rem)" : "0.25rem",
          color: dark ? "var(--color-accent)" : "var(--color-primary)",
        }}
      >
        {dark ? I.moon : I.sun}
      </span>
    </button>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/30">
        {I.zap}
      </div>
      <span className="font-bold text-foreground tracking-tight">lib-kit-components</span>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Logo />
        <div className="flex items-center gap-2">
          <Link href="/ejemplos">
            <Button size="sm" variant="ghost">
              Ejemplos
            </Button>
          </Link>
          <ThemeToggle />
          <Button size="sm" leftIcon={I.github} variant="secondary">
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
}
